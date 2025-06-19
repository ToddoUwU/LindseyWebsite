from pathlib import Path
from PIL import Image  # You may need to install this: pip install Pillow

# Check the Besta image file
besta_img = Path('/home/toddday/Documents/LinbinbinWebsite/Images/32-Besta/LindseyAyres_Besta.jpg')

try:
    img = Image.open(besta_img)
    print(f"PIL confirms this is a valid {img.format} image")
    print(f"Size: {img.size}px")
    print(f"Mode: {img.mode}")
    img.verify()  # Additional verification
    print("Image verified successfully")
except Exception as e:
    print(f"Error: {e}")