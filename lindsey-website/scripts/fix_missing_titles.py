#!/usr/bin/env python3
"""
Fix Missing Titles Script

This script updates .txt files that are missing titles by extracting
the title from the directory/filename.

For example: 33-The_Witches -> "The Witches"
"""

import re
from pathlib import Path

# Files that need title updates
FILES_TO_UPDATE = [
    "backend/src/main/resources/Images/33-The_Witches/33-The_Witches.txt",
    "backend/src/main/resources/Images/34-Little_Lisbet/34-Little_Lisbet.txt",
    "backend/src/main/resources/Images/37-Desert_Jackalope/37-Desert_Jackalope.txt",
    "backend/src/main/resources/Images/39-Chameleon/39-Chameleon.txt",
    "backend/src/main/resources/Images/40-Buck/40-Buck.txt",
    "backend/src/main/resources/Images/42-Ancient_Mech/42-Ancient_Mech.txt",
    "backend/src/main/resources/Images/44-Desert_Sunset/44-Desert_Sunset.txt",
    "backend/src/main/resources/Images/53-Beautiful_Beige/53-Beautiful_Beige.txt",
    "backend/src/main/resources/Images/54-Fire/54-Fire.txt",
    "backend/src/main/resources/Images/56-Snail_Trails/56-Snail_Trails.txt",
]

def extract_title_from_filename(filename):
    """
    Extract a human-readable title from a filename.

    Example: "33-The_Witches" -> "The Witches"
    """
    # Get just the filename without extension
    name = Path(filename).stem

    # Remove the leading number and dash (e.g., "33-")
    name = re.sub(r'^\d+-', '', name)

    # Replace underscores with spaces
    name = name.replace('_', ' ')

    return name

def update_title_in_file(file_path, title):
    """
    Update the Title field in a .txt file.

    Reads the file, finds the Title section, and adds the title below it.
    """
    file_path = Path(file_path)

    if not file_path.exists():
        print(f"Warning: File not found: {file_path}")
        return False

    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find the Title line and update
    updated = False
    new_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]
        new_lines.append(line)

        # Check if this is the Title field
        if line.strip() == 'Title':
            # Add the title on the next line with proper indentation
            new_lines.append(f'\t{title}\n')
            updated = True
            # Skip the next line if it's empty or already has content
            if i + 1 < len(lines):
                next_line = lines[i + 1]
                # Only skip if it's not another field header
                if next_line.strip() and not re.match(r'^[A-Za-z]+($|\s)', next_line.strip()):
                    i += 1  # Skip the existing line

        i += 1

    if updated:
        # Write the updated content back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"✓ Updated: {file_path.name} with title '{title}'")
        return True
    else:
        print(f"✗ Could not update: {file_path.name} (Title field not found)")
        return False

def main():
    print("Fixing Missing Titles in Artwork Files")
    print("=" * 60)

    updated_count = 0

    for file_path in FILES_TO_UPDATE:
        # Resolve the full path
        full_path = Path.cwd() / file_path

        # Extract title from filename
        title = extract_title_from_filename(file_path)

        # Update the file
        if update_title_in_file(full_path, title):
            updated_count += 1

    print("=" * 60)
    print(f"\nSummary: Updated {updated_count} out of {len(FILES_TO_UPDATE)} files")

if __name__ == "__main__":
    main()

