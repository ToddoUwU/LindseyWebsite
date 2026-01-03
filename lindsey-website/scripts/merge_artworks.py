#!/usr/bin/env python3
"""
Artwork Merge Script

This script performs a comprehensive merge operation to insert/update artwork data
from text files into the PostgreSQL database. It follows these key requirements:

1. Reads artwork metadata from .txt files in each artwork directory
2. Finds the LARGEST .jpg file in each folder for large_image_url
3. Maps text file fields to database columns:
   - Title -> title
   - ArtDescription -> art_description
   - Dimensions -> dimensions
   - Medium -> medium
   - DateProduced -> date_produced (converted from text year to DATE)
   - Location -> location
   - OriginalPrice -> original_price (parsed as numeric)
   - Categories -> categories
   - SmallImage -> small_image_url
   - LargeImage -> large_image_url
   - LinkToPrint -> link_to_print
4. Sets created_at and updated_at to current timestamp
5. Sets is_featured to TRUE only for:
   - "The Maypole Unicorn"
   - "The Christmas Animals"
   All other artworks get is_featured = FALSE
6. Uses UPSERT (INSERT ... ON CONFLICT) for idempotent operations

Usage:
    python merge_artworks.py --env dev|prod [--image-path PATH] [--dry-run]

Arguments:
    --env: Environment to use (dev or prod)
    --image-path: Path to Images directory (default: backend/src/main/resources/Images)
    --dry-run: Show what would be imported without making changes

Author: GitHub Copilot
Date: January 2, 2026
"""

import os
import sys
import re
import psycopg2
import psycopg2.extras
import hashlib
import argparse
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image

# Set up command line argument parsing
parser = argparse.ArgumentParser(description='Merge artwork data from text files into PostgreSQL database.')
parser.add_argument('--env', choices=['dev', 'prod'], default='dev',
                    help='Environment to use (dev or prod)')
parser.add_argument('--image-path',
                    default='backend/src/main/resources/Images',
                    help='Path to Images directory')
parser.add_argument('--dry-run', action='store_true',
                    help='Show what would be imported without making changes')
parser.add_argument('--verbose', action='store_true',
                    help='Show detailed validation information')
parser.add_argument('--generate-thumbnails', action='store_true',
                    help='Generate -sm and -med image versions if they do not exist')
args = parser.parse_args()

# Load environment variables from the appropriate .env file
# Look in the parent directory (project root) for .env files
script_dir = Path(__file__).parent
project_root = script_dir.parent
env_file = project_root / f".env.{args.env}"

if not env_file.exists():
    print(f"Error: Environment file {env_file} not found.")
    print(f"Looking in: {project_root}")
    sys.exit(1)

load_dotenv(env_file)

# Set up database connection parameters
db_params = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('POSTGRES_DB'),
    'user': os.getenv('POSTGRES_USER'),
    'password': os.getenv('POSTGRES_PASSWORD')
}

# Featured artworks (titles that should have is_featured = TRUE)
FEATURED_ARTWORKS = {
    'The Maypole Unicorn',
    'The Christmas Animals'
}

def get_artwork_directories(images_path):
    """
    Get all valid artwork directories (those starting with digits and containing a .txt file).

    Args:
        images_path (Path): Path to the Images directory

    Returns:
        list: List of Path objects for valid artwork directories
    """
    valid_dirs = []

    if not images_path.exists() or not images_path.is_dir():
        print(f"Error: Images directory {images_path} does not exist or is not a directory.")
        return valid_dirs

    # Look for directories starting with digits (e.g., 01-Something, 68-TheChristmasAnimals)
    for item in sorted(images_path.iterdir()):
        if item.is_dir() and re.match(r'^\d+', item.name):
            # Check if there's a matching .txt file in the directory
            txt_file = item / f"{item.name}.txt"
            if txt_file.exists():
                valid_dirs.append(item)
                if args.verbose:
                    print(f"Found valid directory: {item.name}")
            else:
                print(f"Warning: Directory {item.name} has no matching .txt file")

    return valid_dirs

def parse_artwork_file(file_path):
    """
    Parse an artwork description file into a dictionary.

    The template format has fields like:
    Title
        Artwork Title

    ArtDescription
        Description of the artwork...

    Args:
        file_path (Path): Path to the artwork description file

    Returns:
        dict: Dictionary mapping field names to their values
    """
    if args.verbose:
        print(f"Parsing {file_path}")

    artwork = {}
    current_field = None
    field_content = []

    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            line = line.rstrip()

            # Skip empty lines
            if not line.strip():
                continue

            # Check if this is a new field header (not indented)
            if not line.startswith('\t') and not line.startswith('    '):
                # Match field names like "Title", "ArtDescription", "OriginalPrice - Price of..."
                field_match = re.match(r'^([A-Za-z]+)($|\s.*)', line)
                if field_match:
                    # Save previous field content
                    if current_field:
                        artwork[current_field.lower()] = '\n'.join(field_content).strip()
                        field_content = []

                    # Set new field
                    current_field = field_match.group(1)

                    if args.verbose:
                        print(f"  Found field: {current_field}")

                    # Check if there's content on the same line (skip explanatory text with "-")
                    remaining = field_match.group(2).strip()
                    if remaining and not remaining.startswith('-'):
                        field_content.append(remaining)
                    continue

            # If line is indented and we're in a field, add it to content
            elif current_field and (line.startswith('\t') or line.startswith('    ')):
                field_content.append(line.strip())

    # Save the last field's content
    if current_field:
        artwork[current_field.lower()] = '\n'.join(field_content).strip()

    if args.verbose:
        print(f"  Parsed fields: {list(artwork.keys())}")

    return artwork

# Image size constants
# Small: 5 images per row on 1080p screen (1920 / 5 = ~384px, with some margin ~216px effective)
SMALL_IMAGE_MAX_WIDTH = 384
# Medium: 50% of desktop screen (~960px)
MEDIUM_IMAGE_MAX_WIDTH = 960
# Quality settings for resized images
IMAGE_QUALITY = 85


def derive_image_basename_from_folder(folder_name):
    """
    Derive the expected image base filename from the folder name.

    Folder: 04-The_Cat_Who_Ate_The_Sun
    Result: LindseyAyres_TheCatWhoAteTheSun

    Args:
        folder_name (str): The artwork folder name (e.g., "04-The_Cat_Who_Ate_The_Sun")

    Returns:
        str: The expected image base name (e.g., "LindseyAyres_TheCatWhoAteTheSun")
    """
    # Remove the leading number and hyphen (e.g., "04-" -> "")
    name_without_number = re.sub(r'^\d+-', '', folder_name)

    # Remove underscores
    name_without_underscores = name_without_number.replace('_', '')

    # Add the prefix
    return f"LindseyAyres_{name_without_underscores}"


def get_image_size(path):
    """
    Get the width and height of an image.

    Args:
        path (Path): Path to the image file

    Returns:
        tuple: (width, height) in pixels, or (None, None) if not available
    """
    try:
        with Image.open(path) as img:
            return img.size  # (width, height)
    except Exception:
        return (None, None)


def find_artwork_images(art_dir, title):
    """
    Find or generate the small, medium, and large image files for an artwork.

    The large image should be named: LindseyAyres_{FolderNameClean}.jpg
    The medium image: LindseyAyres_{FolderNameClean}-med.jpg
    The small image: LindseyAyres_{FolderNameClean}-sm.jpg

    If -sm or -med files don't exist, they will be generated from the large image.

    Args:
        art_dir (Path): Directory containing the artwork images
        title (str): Title of the artwork

    Returns:
        tuple: (small_image_url, small_image_width, small_image_height, medium_image_url, medium_image_width, medium_image_height, large_image_url, large_image_width, large_image_height) - relative web paths and dimensions
    """
    # Derive expected base filename from folder name
    base_name = derive_image_basename_from_folder(art_dir.name)

    # Expected file names
    large_filename = f"{base_name}.jpg"
    medium_filename = f"{base_name}-med.jpg"
    small_filename = f"{base_name}-sm.jpg"

    # Full paths
    large_path = art_dir / large_filename
    medium_path = art_dir / medium_filename
    small_path = art_dir / small_filename

    # Check if large image exists
    if not large_path.exists():
        # Try case-insensitive search
        large_path = find_file_case_insensitive(art_dir, large_filename)
        if not large_path:
            print(f"  Warning: Large image not found: {large_filename}")
            jpg_files = [f.name for f in art_dir.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg']]
            if jpg_files:
                print(f"    Found JPG files: {jpg_files}")
            return ('', None, None, '', None, None, '', None, None)

    if args.verbose:
        print(f"  Found large image: {large_path.name}")

    # Generate medium image if it doesn't exist
    if not medium_path.exists():
        if args.generate_thumbnails:
            print(f"  Generating medium image: {medium_filename}")
            generate_resized_image(large_path, medium_path, MEDIUM_IMAGE_MAX_WIDTH)
        else:
            if args.verbose:
                print(f"  Medium image not found (use --generate-thumbnails to create)")

    # Generate small image if it doesn't exist
    if not small_path.exists():
        if args.generate_thumbnails:
            print(f"  Generating small image: {small_filename}")
            generate_resized_image(large_path, small_path, SMALL_IMAGE_MAX_WIDTH)
        else:
            if args.verbose:
                print(f"  Small image not found (use --generate-thumbnails to create)")

    # Get sizes
    large_w, large_h = get_image_size(large_path) if large_path.exists() else (None, None)
    medium_w, medium_h = get_image_size(medium_path) if medium_path.exists() else (None, None)
    small_w, small_h = get_image_size(small_path) if small_path.exists() else (None, None)

    # Build URLs (use the files if they exist, otherwise empty string)
    large_url = get_relative_web_path(art_dir, large_path) if large_path.exists() else ''
    medium_url = get_relative_web_path(art_dir, medium_path) if medium_path.exists() else ''
    small_url = get_relative_web_path(art_dir, small_path) if small_path.exists() else ''

    if args.verbose:
        print(f"  Large URL: {large_url}")
        print(f"  Medium URL: {medium_url}")
        print(f"  Small URL: {small_url}")

    return (small_url, small_w, small_h, medium_url, medium_w, medium_h, large_url, large_w, large_h)


def find_file_case_insensitive(directory, filename):
    """
    Find a file in a directory with case-insensitive matching.

    Args:
        directory (Path): Directory to search
        filename (str): Filename to find

    Returns:
        Path or None: Path to the found file, or None if not found
    """
    filename_lower = filename.lower()
    for file in directory.iterdir():
        if file.is_file() and file.name.lower() == filename_lower:
            return file
    return None


def generate_resized_image(source_path, dest_path, max_width, quality=IMAGE_QUALITY):
    """
    Generate a resized image while preserving aspect ratio and quality.

    Uses Pillow's high-quality LANCZOS resampling algorithm for best results.

    Args:
        source_path (Path): Path to the source image
        dest_path (Path): Path where the resized image will be saved
        max_width (int): Maximum width for the resized image
        quality (int): JPEG quality (1-100, higher is better)

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        with Image.open(source_path) as img:
            original_width, original_height = img.size

            # Calculate new dimensions while preserving aspect ratio
            if original_width <= max_width:
                # Image is already smaller than max_width, just copy it
                if args.verbose:
                    print(f"    Image already small enough ({original_width}px), copying as-is")
                import shutil
                shutil.copy2(source_path, dest_path)
                return True

            # Calculate new height to maintain aspect ratio
            ratio = max_width / original_width
            new_width = max_width
            new_height = int(original_height * ratio)

            # Use LANCZOS resampling for high-quality downscaling
            resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

            # Preserve EXIF data if present (for correct orientation)
            exif = img.info.get('exif')

            # Save with optimized settings
            save_kwargs = {
                'quality': quality,
                'optimize': True,
                'progressive': True,
            }
            if exif:
                save_kwargs['exif'] = exif

            # Handle different color modes
            if resized_img.mode in ('RGBA', 'P'):
                resized_img = resized_img.convert('RGB')

            resized_img.save(dest_path, 'JPEG', **save_kwargs)

            # Log compression stats
            original_size = source_path.stat().st_size
            new_size = dest_path.stat().st_size
            compression_ratio = (1 - new_size / original_size) * 100

            if args.verbose:
                print(f"    Original: {original_width}x{original_height} ({original_size:,} bytes)")
                print(f"    Resized:  {new_width}x{new_height} ({new_size:,} bytes)")
                print(f"    Compression: {compression_ratio:.1f}% smaller")

            return True

    except Exception as e:
        print(f"  Error generating resized image {dest_path.name}: {e}")
        return False


def get_relative_web_path(art_dir, image_file):
    """
    Convert an absolute file path to a relative web path.

    Args:
        art_dir (Path): The artwork directory
        image_file (Path): The image file (can be Path or str)

    Returns:
        str: Relative web path for the image (e.g., /images/68-TheChristmasAnimals/file.jpg)
    """
    if isinstance(image_file, Path):
        filename = image_file.name
    else:
        filename = image_file
    return f"/images/{art_dir.name}/{filename}"

def parse_date_produced(date_str):
    """
    Convert date string (usually just a year) to a proper DATE.

    Args:
        date_str (str): Date string (e.g., "2002", "2024")

    Returns:
        str or None: Date string in YYYY-MM-DD format, or None if parsing fails
    """
    if not date_str or not date_str.strip():
        return None

    try:
        # Try to parse as a year
        year = int(date_str.strip())
        # Return January 1st of that year
        return f"{year}-01-01"
    except ValueError:
        # If it's not a simple year, try other formats
        # Could add more sophisticated date parsing here if needed
        print(f"Warning: Could not parse date '{date_str}'")
        return None

def format_categories(categories_str):
    """
    Format categories string into proper comma-delimited format.

    Converts: "acrylic, painting, paint pouring, insects, abstract"
    To: "Acrylic,Painting,Paint Pouring,Insects,Abstract"

    Args:
        categories_str (str): Raw categories string from .txt file

    Returns:
        str: Formatted categories string (no spaces after commas, title case)
    """
    if not categories_str or not categories_str.strip():
        return ''

    # Split by comma, strip whitespace, and capitalize each word
    categories = [cat.strip() for cat in categories_str.split(',')]

    # Title case each category (capitalize first letter of each word)
    formatted_categories = [cat.title() for cat in categories if cat]

    # Join with comma (no spaces)
    return ','.join(formatted_categories)

def parse_price(price_str):
    """
    Parse price string into a numeric value.

    Args:
        price_str (str): Price string (e.g., "$250", "$1,200", "Sold", "Not for sale")

    Returns:
        float: Price as a decimal number, or 0 if not a valid price
    """
    if not price_str or not price_str.strip():
        return 0.0

    # Remove $ and commas
    price_str = price_str.replace('$', '').replace(',', '').strip()

    # Check for special cases
    if price_str.lower() in ['sold', 'not for sale', 'n/a', 'na']:
        return 0.0

    try:
        return float(price_str)
    except ValueError:
        print(f"Warning: Could not parse price '{price_str}'")
        return 0.0

def determine_for_sale(price_str):
    """
    Determine if artwork is for sale based on the original price string.

    Args:
        price_str (str): Original price string

    Returns:
        bool: True if for sale, False otherwise
    """
    if not price_str or not price_str.strip():
        return False

    price_lower = price_str.lower()

    # Not for sale if it says "sold" or "not for sale"
    if 'sold' in price_lower or 'not for sale' in price_lower:
        return False

    # For sale if there's a valid price
    return parse_price(price_str) > 0

def calculate_content_hash(artwork_data):
    """
    Calculate SHA-256 hash for artwork content to detect changes.

    Args:
        artwork_data (dict): Dictionary containing artwork fields

    Returns:
        str: SHA-256 hash as hexadecimal string
    """
    # Concatenate all relevant fields including image sizes
    content = '|'.join([
        str(artwork_data.get('title', '')),
        str(artwork_data.get('art_description', '')),
        str(artwork_data.get('dimensions', '')),
        str(artwork_data.get('small_image_url', '')),
        str(artwork_data.get('small_image_width', '')),
        str(artwork_data.get('small_image_height', '')),
        str(artwork_data.get('medium_image_url', '')),
        str(artwork_data.get('medium_image_width', '')),
        str(artwork_data.get('medium_image_height', '')),
        str(artwork_data.get('large_image_url', '')),
        str(artwork_data.get('large_image_width', '')),
        str(artwork_data.get('large_image_height', '')),
        str(artwork_data.get('link_to_print', '')),
        str(artwork_data.get('date_produced', '')),
        str(artwork_data.get('original_price', '')),
        str(artwork_data.get('for_sale', '')),
        str(artwork_data.get('location', '')),
        str(artwork_data.get('medium', '')),
        str(artwork_data.get('categories', '')),
        str(artwork_data.get('is_featured', ''))
    ])

    return hashlib.sha256(content.encode('utf-8')).hexdigest()

def merge_artwork(cursor, artwork_data):
    """
    Insert or update artwork in database using UPSERT.

    Uses PostgreSQL's INSERT ... ON CONFLICT to handle both insert and update
    in a single operation.

    Args:
        cursor: Database cursor
        artwork_data (dict): Artwork data to merge

    Returns:
        str: 'inserted', 'updated', or 'skipped'
    """
    title = artwork_data['title']

    # Calculate content hash
    content_hash = calculate_content_hash(artwork_data)

    # Check if artwork exists and has same content hash
    cursor.execute("""
        SELECT id, content_hash
        FROM artworks
        WHERE title = %s
    """, (title,))

    existing = cursor.fetchone()

    if existing:
        existing_id, existing_hash = existing
        if existing_hash == content_hash:
            if args.verbose:
                print(f"  Skipping '{title}' - no changes detected")
            return 'skipped'

    # Perform UPSERT including width/height fields
    cursor.execute("""
        INSERT INTO artworks (
            title, art_description, dimensions,
            small_image_url, small_image_width, small_image_height,
            medium_image_url, medium_image_width, medium_image_height,
            large_image_url, large_image_width, large_image_height,
            link_to_print, date_produced, original_price, for_sale, location,
            medium, categories, is_featured, created_at, updated_at, content_hash
        ) VALUES (
            %s, %s, %s,
            %s, %s, %s,
            %s, %s, %s,
            %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s
        )
        ON CONFLICT (title) DO UPDATE SET
            art_description = EXCLUDED.art_description,
            dimensions = EXCLUDED.dimensions,
            small_image_url = EXCLUDED.small_image_url,
            small_image_width = EXCLUDED.small_image_width,
            small_image_height = EXCLUDED.small_image_height,
            medium_image_url = EXCLUDED.medium_image_url,
            medium_image_width = EXCLUDED.medium_image_width,
            medium_image_height = EXCLUDED.medium_image_height,
            large_image_url = EXCLUDED.large_image_url,
            large_image_width = EXCLUDED.large_image_width,
            large_image_height = EXCLUDED.large_image_height,
            link_to_print = EXCLUDED.link_to_print,
            date_produced = EXCLUDED.date_produced,
            original_price = EXCLUDED.original_price,
            for_sale = EXCLUDED.for_sale,
            location = EXCLUDED.location,
            medium = EXCLUDED.medium,
            categories = EXCLUDED.categories,
            is_featured = EXCLUDED.is_featured,
            updated_at = EXCLUDED.updated_at,
            content_hash = EXCLUDED.content_hash
        RETURNING id, (xmax = 0) AS inserted
    """, (
        artwork_data['title'],
        artwork_data['art_description'],
        artwork_data['dimensions'],
        artwork_data['small_image_url'],
        artwork_data.get('small_image_width'),
        artwork_data.get('small_image_height'),
        artwork_data['medium_image_url'],
        artwork_data.get('medium_image_width'),
        artwork_data.get('medium_image_height'),
        artwork_data['large_image_url'],
        artwork_data.get('large_image_width'),
        artwork_data.get('large_image_height'),
        artwork_data['link_to_print'],
        artwork_data['date_produced'],
        artwork_data['original_price'],
        artwork_data['for_sale'],
        artwork_data['location'],
        artwork_data['medium'],
        artwork_data['categories'],
        artwork_data['is_featured'],
        artwork_data['created_at'],
        artwork_data['updated_at'],
        content_hash
    ))

    result = cursor.fetchone()
    artwork_id, was_inserted = result

    action = 'inserted' if was_inserted else 'updated'
    print(f"  {action.capitalize()}: {title} (ID: {artwork_id})")

    return action

def process_artwork_directory(art_dir):
    """
    Process a single artwork directory: parse text file, find images, prepare data.

    Args:
        art_dir (Path): Path to the artwork directory

    Returns:
        dict or None: Prepared artwork data, or None if processing failed
    """
    print(f"\nProcessing: {art_dir.name}")

    # Find the .txt file
    txt_file = art_dir / f"{art_dir.name}.txt"

    if not txt_file.exists():
        print(f"  Error: Text file not found: {txt_file}")
        return None

    try:
        # Parse the text file
        parsed_data = parse_artwork_file(txt_file)

        # Get the title
        title = parsed_data.get('title', '').strip()
        if not title:
            print(f"  Error: No title found in {txt_file}")
            return None

        # Find images (small, medium, large)
        small_image, small_w, small_h, medium_image, medium_w, medium_h, large_image, large_w, large_h = find_artwork_images(art_dir, title)

        # Parse date
        date_produced = parse_date_produced(parsed_data.get('dateproduced', ''))

        # Parse price and determine if for sale
        original_price_str = parsed_data.get('originalprice', '').strip()
        original_price = parse_price(original_price_str)
        for_sale = determine_for_sale(original_price_str)

        # Determine if featured
        is_featured = title in FEATURED_ARTWORKS

        # Get current timestamp
        now = datetime.now()

        # Format categories properly (no spaces after commas, title case)
        formatted_categories = format_categories(parsed_data.get('categories', ''))

        # Prepare the artwork data
        artwork_data = {
            'title': title,
            'art_description': parsed_data.get('artdescription', '').strip(),
            'dimensions': parsed_data.get('dimensions', '').strip(),
            'small_image_url': small_image,
            'small_image_width': small_w,
            'small_image_height': small_h,
            'medium_image_url': medium_image,
            'medium_image_width': medium_w,
            'medium_image_height': medium_h,
            'large_image_url': large_image,
            'large_image_width': large_w,
            'large_image_height': large_h,
            'link_to_print': parsed_data.get('linktoprint', '').strip(),
            'date_produced': date_produced,
            'original_price': original_price,
            'for_sale': for_sale,
            'location': parsed_data.get('location', '').strip(),
            'medium': parsed_data.get('medium', '').strip(),
            'categories': formatted_categories,
            'is_featured': is_featured,
            'created_at': now,
            'updated_at': now
        }

        if args.verbose:
            print(f"  Title: {title}")
            print(f"  Categories: {formatted_categories}")
            print(f"  Featured: {is_featured}")
            print(f"  For Sale: {for_sale}")
            print(f"  Date: {date_produced}")

        return artwork_data

    except Exception as e:
        print(f"  Error processing {art_dir.name}: {e}")
        return None

def main():
    """
    Main function that orchestrates the artwork merge process.
    """
    print(f"Artwork Merge Script")
    print(f"Environment: {args.env}")
    print(f"Image Path: {args.image_path}")
    print(f"Dry Run: {args.dry_run}")
    if args.generate_thumbnails:
        print(f"Image Resizing: ENABLED")
        print(f"  Small images: {SMALL_IMAGE_MAX_WIDTH}px max width (5 per row on 1080p)")
        print(f"  Medium images: {MEDIUM_IMAGE_MAX_WIDTH}px max width (50% of desktop)")
        print(f"  Quality: {IMAGE_QUALITY}%")
    else:
        print(f"Image Resizing: DISABLED (use --generate-thumbnails to create -sm and -med versions)")
    print("-" * 60)

    # Resolve image path
    # Get project root (parent of scripts directory)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    images_path = Path(args.image_path)
    if not images_path.is_absolute():
        # Resolve relative to project root, not current working directory
        images_path = project_root / images_path

    print(f"Resolved Images Path: {images_path}")

    # Get all valid artwork directories
    art_dirs = get_artwork_directories(images_path)

    if not art_dirs:
        print("No valid artwork directories found!")
        return

    print(f"\nFound {len(art_dirs)} artwork directories to process")
    print("-" * 60)

    # Connect to database
    try:
        conn = psycopg2.connect(**db_params)
        print(f"Connected to {args.env} database: {db_params['database']}")
        conn.autocommit = False
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)

    # Process all artwork directories
    stats = {'inserted': 0, 'updated': 0, 'skipped': 0, 'errors': 0}

    try:
        cursor = conn.cursor()

        for art_dir in art_dirs:
            try:
                # Process the directory
                artwork_data = process_artwork_directory(art_dir)

                if artwork_data is None:
                    stats['errors'] += 1
                    continue

                # Merge into database (unless dry run)
                if args.dry_run:
                    print(f"  [DRY RUN] Would merge: {artwork_data['title']}")
                    stats['inserted'] += 1
                else:
                    action = merge_artwork(cursor, artwork_data)
                    stats[action] += 1

            except Exception as e:
                print(f"  Error: {e}")
                stats['errors'] += 1
                if not args.dry_run:
                    conn.rollback()
                raise

        # Commit all changes
        if not args.dry_run:
            conn.commit()
            print("\n" + "=" * 60)
            print("All changes committed successfully!")
        else:
            print("\n" + "=" * 60)
            print("DRY RUN - No changes were made to the database")

        # Print statistics
        print("\nMerge Statistics:")
        print(f"  Inserted: {stats['inserted']}")
        print(f"  Updated:  {stats['updated']}")
        print(f"  Skipped:  {stats['skipped']}")
        print(f"  Errors:   {stats['errors']}")
        print(f"  Total:    {sum(stats.values())}")

    except Exception as e:
        print(f"\nError during merge: {e}")
        if not args.dry_run:
            conn.rollback()
            print("All changes rolled back")
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    main()

