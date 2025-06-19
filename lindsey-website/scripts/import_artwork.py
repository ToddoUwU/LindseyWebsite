#!/usr/bin/env python3
# filepath: /home/toddday/WebstormProjects/LindseyWebsite/lindsey-website/scripts/import_artwork.py
"""
Artwork Import Script

This script imports artwork data from text files into a PostgreSQL database.
It reads description files from a structured directory and extracts relevant
information based on a template format, then inserts or updates records in
the database accordingly.

The script is designed to work with text files that follow a specific format:
- Each field starts with a field name at the beginning of a line
- Field content is indented or on subsequent lines
- The script processes all artwork directories starting with two digits (e.g., 01-Artwork)

Usage:
    python import_artwork.py --env dev|prod [--image-path PATH] [--dry-run]

Arguments:
    --env: Environment to use (dev or prod)
    --image-path: Path to Images directory
    --dry-run: Show what would be imported without making changes

Author: GitHub Copilot
Date: June 7, 2025
"""

# Import standard library modules for file operations and system functions
import os               # Operating system interfaces, for file paths and environment variables
import sys              # System-specific parameters and functions, used for exit codes
import re               # Regular expressions, used for text pattern matching
# Import PostgreSQL driver for database communication
import psycopg2         # PostgreSQL database adapter
import psycopg2.extras  # Extra functionality for psycopg2 like dictionary cursors
# Import cryptographic hash function for generating content hashes
import hashlib          # Implements various hash algorithms including SHA-256
# Import command line argument parser
import argparse         # Parser for command-line options, arguments, and sub-commands
# Import datetime for timestamp handling
from datetime import datetime  # Date and time functionality
# Import Path for better file path handling
from pathlib import Path       # Object-oriented filesystem paths
# Import dotenv to load environment variables from .env files
from dotenv import load_dotenv # Load environment variables from .env files
from test_dir_img_txt_title_match import get_valid_art_directories

# Set up command line argument parsing
# Create an ArgumentParser object with a description of what the script does
parser = argparse.ArgumentParser(description='Import artwork data from text files into PostgreSQL database.')
# Define the --env argument, restricting it to either 'dev' or 'prod' with 'dev' as default
parser.add_argument('--env', choices=['dev', 'prod'], default='dev', 
                    help='Environment to use (dev or prod)')
# Define the --image-path argument with a default path to the Images directory
parser.add_argument('--image-path', default='/home/toddday/Documents/LinbinbinWebsite/Images', 
                    help='Path to Images directory')
# Define the --dry-run flag, which takes no value but indicates a test run when present
parser.add_argument('--dry-run', action='store_true', 
                    help='Show what would be imported without making changes')
# Add this to your argument definitions
parser.add_argument('--verbose', action='store_true', 
                    help='Show detailed validation information')
# Parse the command line arguments and store them in args
args = parser.parse_args()

# Load environment variables from the appropriate .env file based on the selected environment
# Construct the environment file name (.env.dev or .env.prod)
env_file = f".env.{args.env}"
# Check if the environment file exists
if not os.path.exists(env_file):
    print(f"Error: Environment file {env_file} not found.")
    sys.exit(1)  # Exit with error code 1 if the file doesn't exist

# Load the environment variables from the file into the process environment
load_dotenv(env_file)

# Set up database connection parameters from environment variables
db_params = {
    # Get DB_HOST from environment or use 'localhost' as fallback
    'host': os.getenv('DB_HOST', 'localhost'),
    # Get DB_PORT from environment or use '5432' as fallback
    'port': os.getenv('DB_PORT', '5432'),
    # Get database name from environment variable (no fallback)
    'database': os.getenv('POSTGRES_DB'),
    # Get username from environment variable (no fallback)
    'user': os.getenv('POSTGRES_USER'),
    # Get password from environment variable (no fallback)
    'password': os.getenv('POSTGRES_PASSWORD')
}

# Try to connect to the database using the parameters
try:
    # Establish a connection to the PostgreSQL database
    conn = psycopg2.connect(**db_params)
    print(f"Connected to {args.env} database: {db_params['database']}")
except Exception as e:
    # If connection fails, print the error message and exit
    print(f"Error connecting to the database: {e}")
    sys.exit(1)

def calculate_content_hash(artwork):
    """
    Calculate SHA-256 hash for artwork content to detect changes.
    
    This function combines all relevant fields of the artwork into a single
    string and generates a SHA-256 hash, which can be used to detect if any
    content has changed between imports.
    
    Args:
        artwork (dict): Dictionary containing artwork fields
        
    Returns:
        str: SHA-256 hash as hexadecimal string
    """
    # Concatenate all relevant artwork fields into a single string
    # Use str() to ensure all values are strings and use get() with default values to handle missing keys
    content = (
        str(artwork.get('title', '')) +             # Artwork title
        str(artwork.get('art_description', '')) +   # Description of the artwork
        str(artwork.get('dimensions', '')) +        # Dimensions (size) of the artwork
        str(artwork.get('small_image_url', '')) +   # URL to small image
        str(artwork.get('large_image_url', '')) +   # URL to large image
        str(artwork.get('link_to_print', '')) +     # Link to purchase prints
        str(artwork.get('date_produced', '')) +     # Date the artwork was created
        str(artwork.get('original_price', '')) +    # Price of the original artwork
        str(artwork.get('for_sale', '')) +          # Whether the artwork is for sale
        str(artwork.get('location', '')) +          # Where the artwork is located
        str(artwork.get('medium', '')) +            # Medium used (oil, acrylic, etc.)
        str(artwork.get('categories', '')) +        # Categories the artwork belongs to
        str(artwork.get('is_featured', ''))         # Whether the artwork is featured
    )
    # Generate a SHA-256 hash of the content string
    # First encode the string as UTF-8 bytes, then hash it, then convert the hash to a hexadecimal string
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

def parse_artwork_file(file_path):
    """
    Parse an artwork description file into a dictionary.
    
    This function reads a text file containing artwork information and
    extracts the content of each field according to the template format.
    
    The template format has fields like:
    Title
        Artwork Title
    
    ArtDescription
        Description of the artwork...
        
    Args:
        file_path (str or Path): Path to the artwork description file
        
    Returns:
        dict: Dictionary mapping database field names to their values
    """
    # Print which file is being parsed
    print(f"Parsing {file_path}")
    # Initialize empty dictionary to store field data
    artwork = {}
    # Initialize variables to track the current field and its content
    current_field = None
    field_content = []
    
    # Open and read the file line by line
    with open(file_path, 'r') as file:
        for line in file:
            # Remove leading/trailing whitespace from the line
            line = line.rstrip()  # Keep leading tabs/spaces for indentation detection
            
            # Skip empty lines
            if not line.strip():  # Use strip() here to check if line is empty after removing all whitespace
                continue
            
            # Check if this is a new field header
            # A field header is typically at the beginning of the line (not indented)
            if not line.startswith('\t') and not line.startswith('    '):  # Check for tab or 4 spaces
                # Try to match field names - they're usually a single word at the start of the line
                # But sometimes have explanatory text after, like "OriginalPrice - Price of..."
                field_match = re.match(r'^([A-Za-z]+)($|\s.*)', line)
                if field_match:
                    # If we were processing another field, save its content before moving to the new field
                    if current_field:
                        # Join all content lines with newlines and store in the artwork dictionary
                        artwork[current_field.lower()] = '\n'.join(field_content).strip()
                        # Reset the content accumulator for the new field
                        field_content = []
                    
                    # Set the new current field - just take the word part, not any explanatory text
                    current_field = field_match.group(1)
                    
                    # Debug print to see what fields are being detected
                    print(f"Found field: {current_field}")
                    
                    # If there's content on the same line, it goes into the content (skip explanatory parts)
                    remaining = field_match.group(2).strip()
                    # Skip explanatory text (like "- Price of the original artwork not print")
                    if remaining and not remaining.startswith('-'):
                        field_content.append(remaining)
                    continue  # Move to next line
            
            # If line is indented and we're in a field, add it to the current field's content
            elif current_field and (line.startswith('\t') or line.startswith('    ')):
                # Add the line without the indentation
                field_content.append(line.strip())
    
    # Save the last field's content
    if current_field:
        artwork[current_field.lower()] = '\n'.join(field_content).strip()
    
    print("Raw parsed data:", artwork)  # Debug print to see what was parsed
    
    # Map the template fields to database column names and handle default values
    db_artwork = {
        # Set title, get from artwork or None (will be checked later)
        'title': artwork.get('title', '').strip() or None,
        # Set art description, use empty string as default, and strip whitespace
        'art_description': artwork.get('artdescription', '').strip(),
        # Set dimensions, use empty string as default, and strip whitespace
        'dimensions': artwork.get('dimensions', '').strip(),
        # Small image URL will be set later by find_images function
        'small_image_url': '',
        # Large image URL will be set later by find_images function
        'large_image_url': '',
        # Set link to print, use empty string as default, and strip whitespace
        'link_to_print': artwork.get('linktoprint', '').strip(),
        # Set date produced, use empty string as default, and strip whitespace
        'date_produced': artwork.get('dateproduced', '').strip(),
        # Set original price, remove '$' and ',' from price, use '0' as default, and strip whitespace
        'original_price': artwork.get('originalprice', '0').replace('$', '').replace(',', '').strip(),
        # Set for_sale flag to True by default
        'for_sale': True,
        # Set location, use empty string as default, and strip whitespace
        'location': artwork.get('location', '').strip(),
        # Set medium, use empty string as default, and strip whitespace
        'medium': artwork.get('medium', '').strip(),
        # Set categories, use empty string as default, and strip whitespace
        'categories': artwork.get('categories', '').strip(),
        # Set is_featured flag to False by default
        'is_featured': False,
        # Set creation timestamp to current date/time
        'created_at': datetime.now(),
        # Set update timestamp to current date/time
        'updated_at': datetime.now()
    }
    
    # Return the prepared database artwork dictionary
    return db_artwork

def find_images(art_dir, title):
    """
    Find matching image files for an artwork based on its title.
    
    This function searches the artwork directory for images that match
    the naming pattern "LindseyAyres_[SanitizedTitle]" and selects the
    smallest for small_image_url and largest for large_image_url.
    
    Args:
        art_dir (str or Path): Directory containing the artwork images
        title (str): Title of the artwork
        
    Returns:
        tuple: (small_image_url, large_image_url) - paths to the images
    """
    # Remove all non-alphanumeric characters from the title to create a filename-safe version
    sanitized_title = re.sub(r'[^a-zA-Z0-9]', '', title)
    # Create the pattern to match image filenames (LindseyAyres_[SanitizedTitle])
    pattern = f"LindseyAyres_{sanitized_title}"
    
    # Initialize empty list to store matching image paths
    images = []
    # Iterate through all files in the directory
    for file in os.listdir(art_dir):
        # Check if the filename contains the pattern (case-insensitive) and has an image extension
        if pattern.lower() in file.lower() and file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            # Add the full path to the list of matching images
            images.append(os.path.join(art_dir, file))
    
    # Sort the images by file size (smallest first)
    images.sort(key=lambda x: os.path.getsize(x))
    
    # Initialize variables for small and large images
    small_image = None
    large_image = None
    
    # If any matching images were found
    if images:
        # If there are at least 2 images, use the smallest for small_image and largest for large_image
        if len(images) >= 2:
            small_image = get_relative_path(images[0])     # First image (smallest)
            large_image = get_relative_path(images[-1])    # Last image (largest)
        else:
            # If there's only one image, use it for both small and large
            small_image = large_image = get_relative_path(images[0])
    
    # Return the paths as a tuple
    return small_image, large_image

def get_relative_path(absolute_path):
    """
    Convert an absolute file path to a relative web path.
    
    This function converts the absolute file path to a relative web path
    that can be used in the application. It extracts the part after 'Images/'
    and prepends '/images/' to create a web-accessible URL.
    
    Args:
        absolute_path (str): Absolute path to the image file
        
    Returns:
        str: Relative web path for the image
    """
    # Split the path at 'Images/' to isolate the part we need
    parts = absolute_path.split('Images/')
    # If the split worked (i.e., 'Images/' was found in the path)
    if len(parts) > 1:
        # Return a web-accessible path starting with '/images/'
        return f"/images/{parts[1]}"
    # If 'Images/' was not in the path, return the original path as a fallback
    return absolute_path

def upsert_artwork(conn, artwork):
    """
    Insert a new artwork or update an existing one in the database.
    
    This implements behavior similar to Oracle's MERGE, using PostgreSQL's
    upsert capabilities to handle cases where the script runs multiple times.
    """
    # Create a cursor for executing SQL commands
    cursor = conn.cursor()
    
    try:
        # Calculate a content hash for detecting changes
        content_hash = calculate_content_hash(artwork)
        # Add the content hash to the artwork data
        artwork['content_hash'] = content_hash
        
        # First check if we need to actually update based on content hash
        cursor.execute("SELECT id, content_hash FROM artworks WHERE title = %s", (artwork['title'],))
        existing = cursor.fetchone()
        
        if existing:
            # Get the ID and content hash of the existing artwork
            artwork_id, existing_hash = existing
            
            # If content hash matches, skip the update (nothing changed)
            if existing_hash == content_hash:
                print(f"Skipping update for '{artwork['title']}' - no changes detected")
                return
                
            # Update existing artwork
            placeholders = []
            values = []
            
            for key in artwork:
                placeholders.append(f"{key} = %s")
                values.append(artwork[key])
            
            values.append(artwork_id)
            query = f"UPDATE artworks SET {', '.join(placeholders)} WHERE id = %s"
            
            if args.dry_run:
                print(f"Would update: {artwork['title']}")
            else:
                cursor.execute(query, values)
                print(f"Updated: {artwork['title']} (ID: {artwork_id})")
        else:
            # Insert new artwork
            columns = list(artwork.keys())
            placeholders = ['%s'] * len(columns)
            values = [artwork[key] for key in columns]
            
            query = f"INSERT INTO artworks ({', '.join(columns)}) VALUES ({', '.join(placeholders)}) RETURNING id"
            
            if args.dry_run:
                print(f"Would insert: {artwork['title']}")
            else:
                cursor.execute(query, values)
                artwork_id = cursor.fetchone()[0]
                print(f"Inserted: {artwork['title']} (ID: {artwork_id})")
    
    except Exception as e:
        print(f"Error processing artwork '{artwork.get('title', 'Unknown')}': {e}")
        raise
    finally:
        cursor.close()

def main():
    """
    Main function that orchestrates the artwork import process.
    
    This function:
    1. Scans the directories in the Images folder
    2. Identifies artwork directories (those starting with digits)
    3. Processes each artwork directory to extract data
    4. Finds matching images
    5. Inserts or updates records in the database
    
    Returns:
        None
    """
    # Convert the image path to a Path object for easier handling
    images_path = Path(args.image_path)
    # Check if the images directory exists and is actually a directory
    if not images_path.exists() or not images_path.is_dir():
        print(f"Error: Images directory {args.image_path} does not exist or is not a directory.")
        return
    
    valid_art_info, invalid_art_info, debug_info = get_valid_art_directories(images_path, verbose=args.verbose if hasattr(args, 'verbose') else False)
    
    valid_art_info.sort()
    if verbose:
        print(valid_art_info)

    # Initialize counter for tracking how many artworks are imported
    import_count = 0
    # Disable autocommit to wrap all database operations in a transaction
    conn.autocommit = False
    
    try:
        # Process each artwork directory
        for art_dir in valid_art_info:
            description_file = art_dir / f"{art_dir.name}.txt"
            
            try:
                # Parse the first matching text file to extract artwork data
                artwork = parse_artwork_file(description_file)
                print("Parsed artwork:", artwork)
    
                    
                # Find images for this artwork based on its title
                small_image, large_image = find_images(art_dir, artwork['title'])
                # Add the image URLs to the artwork data
                artwork['small_image_url'] = small_image or ''
                artwork['large_image_url'] = large_image or ''
                
                # Handle date parsing for the database
                if artwork['date_produced']:
                    try:
                        # Try to interpret the date as just a year
                        year = int(artwork['date_produced'].strip())
                        # Convert to a full date (January 1st of that year)
                        artwork['date_produced'] = f"{year}-01-01"
                    except ValueError:
                        # If it's not just a year, leave it as is for PostgreSQL to interpret
                        pass
                
                # Parse the price to a float for the database
                try:
                    # Convert price string to float, or use 0 if empty
                    artwork['original_price'] = float(artwork['original_price'] or 0)
                except ValueError:
                    # If conversion fails, set price to 0
                    artwork['original_price'] = 0
                
                # Insert or update the artwork in the database
                upsert_artwork(conn, artwork)
                # Increment the import counter
                import_count += 1
            
            except Exception as e:
                # If an error occurs while processing a directory
                print(f"Error processing directory {art_dir.name}: {e}")
                # In a real import (not dry run), rollback the transaction
                if not args.dry_run:
                    conn.rollback()
                # Re-raise the exception to exit the function
                raise
        
        # If everything succeeded and this is not a dry run
        if not args.dry_run:
            # Commit the transaction to save all changes
            conn.commit()
            print(f"Successfully imported {import_count} artworks.")
        else:
            # For dry runs, report what would have happened
            print(f"Dry run complete. Would import {import_count} artworks.")
    
    except Exception as e:
        # If any unhandled exception occurs
        if not args.dry_run:
            # Rollback the transaction to undo any partial changes
            conn.rollback()
        # Print the error
        print(f"Error during import: {e}")
    finally:
        # Always close the database connection
        conn.close()

# If this script is run directly (not imported)
if __name__ == "__main__":
    # Call the main function to start the import process
    main()
