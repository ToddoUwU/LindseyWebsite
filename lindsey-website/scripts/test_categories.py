#!/usr/bin/env python3
"""
Test Category Formatting

This demonstrates how categories are formatted for the database.
"""

def format_categories(categories_str):
    if not categories_str or not categories_str.strip():
        return ''
    categories = [cat.strip() for cat in categories_str.split(',')]
    formatted_categories = [cat.title() for cat in categories if cat]
    return ','.join(formatted_categories)

print("=" * 70)
print("Category Formatting Test")
print("=" * 70)
print()

# Test case from user requirement
test1 = 'acrylic, painting, paint pouring, insects, abstract, moon, fantasy, nature, moody'
expected1 = 'Acrylic,Painting,Paint Pouring,Insects,Abstract,Moon,Fantasy,Nature,Moody'

# Test case from actual artwork file
test2 = 'children, illustration, animals, nature, books, painting, cartoons, acrylic, spiritual'
expected2 = 'Children,Illustration,Animals,Nature,Books,Painting,Cartoons,Acrylic,Spiritual'

print("Test 1 - User Example:")
print(f"  Input:    '{test1}'")
print(f"  Output:   '{format_categories(test1)}'")
print(f"  Expected: '{expected1}'")
print(f"  ✓ PASS" if format_categories(test1) == expected1 else "  ✗ FAIL")
print()

print("Test 2 - Actual Artwork (The Christmas Animals):")
print(f"  Input:    '{test2}'")
print(f"  Output:   '{format_categories(test2)}'")
print(f"  Expected: '{expected2}'")
print(f"  ✓ PASS" if format_categories(test2) == expected2 else "  ✗ FAIL")
print()

print("=" * 70)
print("Key Features:")
print("  • No spaces after commas")
print("  • Each word is title-cased (first letter capitalized)")
print("  • Original .txt files remain unchanged")
print("  • Perfect for TypeScript: categories.split(',')")
print("=" * 70)

