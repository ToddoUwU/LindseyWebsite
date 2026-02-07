#!/usr/bin/env python3
"""
Add Valid Print Ratios to Artwork Text Files

This script:
1. Reads pixel dimensions from the image file
2. Calculates the ratio using GCD
3. Finds all matching valid print sizes from Artelo (within 2% tolerance)
4. Adds/updates a "Valid Ratios" section in the .txt file

Usage:
    python add_valid_ratios.py [--images-dir PATH] [--dry-run]
"""

import os
import re
import math
import logging
from typing import List, Tuple, Optional
from pathlib import Path
from PIL import Image

# Configuration
IMAGES_DIR = 'backend/src/main/resources/Images'
logging.basicConfig(level=logging.INFO, format='%(message)s')

# Valid print ratios from Artelo (organized by category)
VALID_PRINT_SIZES = {
    '1:1': [
        (6, 6), (8, 8), (10, 10), (12, 12), (14, 14), (16, 16), (18, 18), 
        (20, 20), (23, 23), (24, 24), (28, 28), (30, 30), (32, 32), 
        (36, 36), (40, 40)
    ],
    '2:3': [
        (4, 6), (8, 12), (12, 18), (16, 24), (20, 30), (24, 36), 
        (32, 48), (36, 54), (40, 60), (18, 27)
    ],
    '3:4': [
        (6, 8), (9, 12), (12, 16), (18, 24), (24, 32), (30, 40), (36, 48)
    ],
    '4:5': [
        (8, 10), (12, 15), (16, 20), (20, 25), (24, 30), (36, 45), (40, 50)
    ],
    'Other': [
        (3, 7), (4, 10), (5, 7), (5, 10), (5, 12), (6.8, 16), (6, 12), 
        (8, 20), (8, 24), (8, 28), (8.5, 11), (9, 11), (9, 18), (10, 13), 
        (10, 17), (10, 20), (10, 24), (10, 30), (10, 36), (11, 14), 
        (11, 17), (11, 22), (12, 14), (12, 20), (12, 24), (12, 30), 
        (12, 36), (13, 17), (13, 19), (14, 18), (14, 20), (14, 23), 
        (14, 24), (14, 28), (14, 36), (14, 50), (15, 30), (16, 22), 
        (16, 27), (16, 30), (16, 32), (16, 36), (16, 37), (16, 48), 
        (17, 20), (17, 23), (18, 20), (18, 22), (18, 26), (18, 30), 
        (18, 36), (18, 43), (18, 45), (18, 47), (18, 50), (18, 54), 
        (19, 27), (20, 24), (20, 26), (20, 28), (20, 33), (20, 36), 
        (21, 30), (20, 40), (20, 60), (22, 28), (22, 30), (22, 34), 
        (22, 36), (24, 28), (24, 38), (24, 40), (24, 45), (24, 48), 
        (24, 56), (24, 60), (24, 65), (24, 90), (26, 34), (26, 40), 
        (27, 30), (27, 40), (28, 36), (28, 38), (28, 40), (28, 48), 
        (30, 50), (30, 60), (30, 75), (32, 42), (32, 44), (32, 54), 
        (36, 40), (36, 50), (36, 60), (36, 70), (5.1, 7.1), (7.9, 9.8), 
        (17.7, 23.6), (23.6, 35.4), (39.4, 55.1)
    ]
}

# Flatten all ratios
ALL_VALID_SIZES = [size for sizes in VALID_PRINT_SIZES.values() for size in sizes]

# Regex patterns
DIM_REGEX = re.compile(r'(\d+(?:\.\d+)?)\"?\s*x\s*(\d+(?:\.\d+)?)\"?', re.IGNORECASE)
DIM_LINE_REGEX = re.compile(r'^Dimensions\s*$', re.IGNORECASE)
VALID_RATIOS_LINE_REGEX = re.compile(r'^Valid\s+Ratios\s*$', re.IGNORECASE)


def format_size(w: float, h: float) -> str:
    """Format size as string (remove .0 for whole numbers)."""
    w_str = str(int(w)) if w == int(w) else str(w)
    h_str = str(int(h)) if h == int(h) else str(h)
    return f"{w_str}x{h_str}"


def parse_dimensions(dim_str: str) -> Tuple[float, float]:
    """Extract width and height from dimension string like '14"x17"'."""
    match = DIM_REGEX.search(dim_str)
    if match:
        return float(match.group(1)), float(match.group(2))
    return 0.0, 0.0


def calculate_ratio(width: float, height: float) -> Tuple[float, float]:
    """Calculate simplified ratio using GCD."""
    # Convert to integers by multiplying by 10 to handle decimals
    w_int = int(round(width * 10))
    h_int = int(round(height * 10))
    
    gcd = math.gcd(w_int, h_int)
    
    # Divide back
    ratio_w = w_int / gcd
    ratio_h = h_int / gcd
    
    return ratio_w, ratio_h


def find_matching_print_sizes(artwork_w: float, artwork_h: float, tolerance: float = 0.02) -> List[str]:
    """
    Find all valid print sizes that match the artwork's ratio.
    
    Args:
        artwork_w: Artwork width in inches
        artwork_h: Artwork height in inches
        tolerance: Tolerance for ratio matching (default 0.02 = 2%)
    
    Returns:
        List of matching print sizes (e.g., ['11x14', '14x18'])
    """
    # Calculate artwork ratio
    artwork_ratio = artwork_w / artwork_h
    
    matches = []
    
    for print_w, print_h in ALL_VALID_SIZES:
        # Calculate print ratio
        print_ratio = print_w / print_h
        
        # Check if ratios match within tolerance
        ratio_diff = abs(artwork_ratio - print_ratio) / artwork_ratio
        
        if ratio_diff <= tolerance:
            matches.append(format_size(print_w, print_h))
    
    return sorted(set(matches), key=lambda x: (float(x.split('x')[0]), float(x.split('x')[1])))


def find_image_file(directory: Path) -> Optional[Path]:
    """Find the first image file in directory."""
    for ext in ['.jpg', '.jpeg', '.png', '.bmp', '.gif']:
        for img_file in directory.glob(f'*{ext}'):
            return img_file
        for img_file in directory.glob(f'*{ext.upper()}'):
            return img_file
    return None


def get_image_dimensions(image_path: Path) -> Optional[Tuple[int, int]]:
    """Get pixel dimensions from image file."""
    try:
        with Image.open(image_path) as img:
            return img.size  # (width, height)
    except Exception as e:
        logging.warning(f"Could not open image {image_path}: {e}")
        return None


def process_artwork_file(filepath: Path, dry_run: bool = False) -> None:
    """
    Process a single artwork .txt file to add valid print ratios.
    
    Args:
        filepath: Path to the .txt file
        dry_run: If True, only show what would be done
    """
    logging.info(f"\nProcessing: {filepath.name}")
    
    # Find the image file to get pixel dimensions
    art_dir = filepath.parent
    image_path = find_image_file(art_dir)
    
    if not image_path:
        logging.warning(f"  No image file found in {art_dir.name}")
        return
    
    # Get pixel dimensions
    pixel_dims = get_image_dimensions(image_path)
    if not pixel_dims:
        logging.warning(f"  Could not read image dimensions from {image_path.name}")
        return
    
    pixel_w, pixel_h = pixel_dims
    
    # Calculate ratio from pixels
    ratio_w, ratio_h = calculate_ratio(pixel_w, pixel_h)
    
    # Find matching print sizes based on pixel ratio
    matches = find_matching_print_sizes(ratio_w, ratio_h)
    
    logging.info(f"  Image: {image_path.name} ({pixel_w}x{pixel_h})")
    logging.info(f"  Pixel ratio: {ratio_w}:{ratio_h}")
    logging.info(f"  Valid print sizes: {', '.join(matches) if matches else 'None found'}")
    
    # Read file
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Process lines
    new_lines = []
    i = 0
    added_valid_ratios = False
    
    while i < len(lines):
        line = lines[i]
        
        # Skip old Valid Ratios sections
        if VALID_RATIOS_LINE_REGEX.match(line.strip()):
            i += 1
            # Skip the indented content that follows
            while i < len(lines) and (lines[i].startswith('    ') or lines[i].startswith('\t')):
                i += 1
            continue
        
        # Check if this is the Dimensions line
        if DIM_LINE_REGEX.match(line.strip()) and not added_valid_ratios:
            new_lines.append(line)
            i += 1
            
            # Next line should contain dimensions
            if i < len(lines):
                dim_line = lines[i]
                new_lines.append(dim_line)
                i += 1
                
                # Add Valid Ratios section immediately after dimensions
                if matches:
                    new_lines.append('\n')
                    new_lines.append('Valid Ratios\n')
                    new_lines.append('    ' + ', '.join(matches) + '\n')
                    added_valid_ratios = True
                
                continue
        
        # Normal line - just add it
        new_lines.append(line)
        i += 1
    
    # Write back
    if not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        logging.info(f"  ✓ Updated {filepath.name}")
    else:
        logging.info(f"  [DRY RUN] Would update {filepath.name}")


def main():
    """Main function to process all artwork files."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Add valid print ratios to artwork text files')
    parser.add_argument('--images-dir', default=IMAGES_DIR, help='Path to Images directory (relative to project root)')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done without making changes')
    args = parser.parse_args()
    
    # Get the script directory and project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    # Resolve images path relative to project root
    images_path = Path(args.images_dir)
    if not images_path.is_absolute():
        images_path = project_root / images_path
    
    if not images_path.exists():
        logging.error(f"Directory not found: {images_path}")
        logging.error(f"Resolved from: {args.images_dir}")
        logging.error(f"Project root: {project_root}")
        return
    
    # Find all artwork .txt files
    txt_files = []
    for item in sorted(images_path.iterdir()):
        if item.is_dir() and re.match(r'^\d+', item.name):
            txt_file = item / f"{item.name}.txt"
            if txt_file.exists():
                txt_files.append(txt_file)
    
    logging.info(f"Found {len(txt_files)} artwork files to process")
    logging.info(f"Images directory: {images_path}")
    logging.info("=" * 60)
    
    for txt_file in txt_files:
        process_artwork_file(txt_file, dry_run=args.dry_run)
    
    logging.info("\n" + "=" * 60)
    if args.dry_run:
        logging.info("DRY RUN complete - no files were modified")
    else:
        logging.info("✓ All files processed successfully!")


if __name__ == '__main__':
    main()