import json
from PIL import Image 
import os
import re
from pathlib import Path
def get_valid_art_directories(images_path, verbose=False):
    """
    Validate art directories to ensure they have:
    1. A matching text file with the same name as the directory
    2. A valid title in the text file
    3. A matching LindseyAyres_ image file
    
    Args:
        images_path (Path): Path to the Images directory
        verbose (bool): Whether to print debug information
        
    Returns:
        tuple: (valid_art_info, invalid_art_info, debug_info)
            - valid_art_info: List of Path objects for valid directories
            - invalid_art_info: List of Path objects for invalid directories  
            - debug_info: Dictionary with lists of directories missing txt, title, or images
    """
    images_path = Path(images_path)
    art_dirs = [d for d in images_path.iterdir() if d.is_dir()]
    art_dirs = sorted(art_dirs, key=lambda x: x.name.lower())
    valid_art_info = []
    invalid_art_info = []
    missing_txt = []
    missing_img = []
    missing_title = []
    missing_matched_img = []
    valid_images = [] 

    for dir_path in art_dirs:
        hasTxtFile = False
        hasImgFile = False
        hasTitle = False
        hasMatchImage = False
        title = None
        large_image_path = None
        image_match_to_dir = None
        expected_image_name = None

        # Debug info
        txt_debug = "No matching txt file found"
        img_debug = "No valid images found"
        title_debug = "No title found in text file"
        img_match_debug = "No matching image found"

        # Check for matching text file
        expected_txt = dir_path / f"{dir_path.name}.txt"
        if expected_txt.exists():
            hasTxtFile = True
            txt_debug = f"Found {expected_txt.name}"

            # Check if text file has a title section
            try:
                txt_content = expected_txt.read_text(encoding='utf-8')
                # Look for Title section (must begin with "Title" and have content after it)
                title_match = re.search(r'Title\s*\n[ \t]+([^\n]+)', txt_content)
                if title_match and title_match.group(1).strip():
                    hasTitle = True
                    title = title_match.group(1).strip()
                    title_debug = f"Found title: {title_match.group(1).strip()}"
            except Exception as e:
                if verbose:
                    print(f"Error reading {expected_txt}: {str(e)}")

        # Check for image files
        for file_path in dir_path.iterdir():
            if file_path.is_file() and file_path.suffix.lower() != '.txt':
                try:
                
                    # Try to open the file as an image with PIL
                    img = Image.open(file_path)
                    valid_images.append(file_path)
                    # Just accessing format property is enough to validate it's a recognized image format
                    img_format = img.format
                    hasImgFile = True
                    img_debug = f"Found image: {file_path.name}, Format: {img_format}"
                except Exception as e:
                    if verbose:
                        print(f"Error checking {file_path}: {str(e)}")
                    continue
        if hasImgFile:
            image_match_to_dir  = stripDirStringToImageFormat(dir_path.name)
            for img_path in valid_images:
                print(f"Checking image: {img_path}")
               
                expected_image_name = image_match_to_dir + img_path.suffix.lower()
                if expected_image_name.lower() == img_path.name.lower():
                    hasMatchImage = True
                    large_image_path = img_path
                    img_match_debug = f"Found matching image: {img_path.name}"
                    break
            #We want to print out if we have images but no matching image
            if not hasMatchImage:
                img_match_debug = f"No matching image found for {image_match_to_dir}"
            
        # Directory is valid if it has matching txt with a title AND at least one image
        if hasTxtFile and hasImgFile and hasMatchImage and hasTitle:
            valid_art_info.append({
                'dir_path': dir_path,
                'title': title,
                'large_image': large_image_path
            })
        else:
            invalid_art_info.append(dir_path)
            
            # Track specific issues
            if not hasTxtFile:
                missing_txt.append(dir_path.name)
            if not hasImgFile:
                missing_img.append(dir_path.name)
            if hasTxtFile and not hasTitle:
                missing_title.append(dir_path.name)
            if hasImgFile and not hasMatchImage:
                missing_matched_img.append(dir_path.name)
            
            # Print debug info for each invalid directory if verbose
            if verbose:
                print(f"\nDirectory: {dir_path.name}")
                print(f"  Text file status: {txt_debug}")
                if hasTxtFile:
                    print(f"  Title status: {title_debug}")
                print(f"  Image file status: {img_debug}")
                if hasImgFile:
                    print(f"  Image match status: {img_match_debug}")

    # Create debug info dictionary
    debug_info = {
        "missing_txt": missing_txt,
        "missing_img": missing_img,
        "missing_title": missing_title,
        "missing_matched_img": missing_matched_img
    }
    
    
    if verbose:
        print("\nSummary:")
        print(f"Valid directories: {len(valid_art_info)}")
        print(f"Invalid directories: {len(invalid_art_info)}")
        print(f"Directories missing matching txt file: {len(missing_txt)}")
        print(f"Directories with txt file but missing title: {len(missing_title)}")
        print(f"Directories missing valid images: {len(missing_img)}")
        print(f"Directories with images but no matching image: {len(missing_matched_img)}")
        print(f"\nInvalid directories: {sorted([d.name for d in invalid_art_info])}")
        json_debug_info = {
            "valid_directories": [str(d['dir_path']) for d in valid_art_info],
            "invalid_directories": [str(d) for d in invalid_art_info],
            "missing_txt": missing_txt,
            "missing_img": missing_img,
            "missing_title": missing_title,
            "missing_matched_img": missing_matched_img
        }
        # Pretty-printed JSON string
        json_output = json.dumps(json_debug_info, indent=2)
        print("\nDebug Information (JSON):")
        print(json_output)
        print(f"Debug info: {debug_info}")
        
        
    return valid_art_info, invalid_art_info, debug_info

def stripDirStringToImageFormat(input_str):
    #print(f"Processing input string: {input_str}")
    parts = input_str.split('-', 1)
    if len(parts) < 2:
        raise ValueError("Input string must contain exactly one dash separating the prefix and the rest.")
    rest = parts[1]
    cleaned_rest = re.sub(r'[-_\W]+', '', rest)
    #print(f"Cleaned rest: {'LindseyAyres_' + cleaned_rest}")
    return 'LindseyAyres_' + cleaned_rest

if __name__ == "__main__":
    # When run directly, process with verbose output
    images_path = Path('/home/toddday/Documents/LinbinbinWebsite/Images')
    valid_dirs, invalid_dirs, debug_info = get_valid_art_directories(images_path, verbose=True)
