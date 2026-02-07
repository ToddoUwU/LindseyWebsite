import json
import os
import re
import time
import requests
from typing import List, Dict, Optional

API_URL = "https://www.artelo.io/api/open/product-sets/get"
API_TOKEN = "TOKEN_HERE"

# Relative path: scripts/ -> backend/src/main/resources/Images
IMAGES_ROOT = os.path.normpath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "backend",
        "src",
        "main",
        "resources",
        "Images",
    )
)

LIMIT = 100
OFFSET = 0

# Artelo rate limit: 5 requests / second
REQUEST_DELAY_SECONDS = 0.25


def extract_image_name(product_set_name: str) -> str:
    """
    Handles:
    - LindseyAyres_Kokeshi
    - Kokeshi
    """
    if "_" in product_set_name:
        return product_set_name.split("_", 1)[1]
    return product_set_name

def normalize_name(name: str) -> str:
    """
    Normalizes names for matching:
    - lowercase
    - remove underscores, spaces, hyphens
    """
    return re.sub(r"[_\s\-]", "", name).lower()


def find_matching_folder(image_name: str) -> Optional[str]:
    """
    Matches folder format:
    1-IMAGENAME
    12-IMAGENAME
    123-IMAGENAME
    """
    target = normalize_name(image_name)
    for entry in os.listdir(IMAGES_ROOT):
        print(f"Matching '{image_name}' -> '{entry}'")
        full_path = os.path.join(IMAGES_ROOT, entry)
        if not os.path.isdir(full_path):
            continue

        match = re.match(r"\d{1,3}-(.+)", entry)
        if not match:
            continue

        folder_image_name = match.group(1)
        if normalize_name(folder_image_name) == target:
            return full_path

    return None


def fetch_product_sets_page(offset: int, limit: int) -> List[Dict]:
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Accept": "application/json",
    }

    params = {
        "limit": limit,
        "offset": offset,
    }

    response = requests.get(
        API_URL,
        headers=headers,
        params=params,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def save_product_set(product_set: Dict) -> None:
    product_set_name = product_set.get("name")
    if not product_set_name:
        raise ValueError("Product set missing 'name' field")

    image_name = extract_image_name(product_set_name)
    folder_path = find_matching_folder(image_name)

    if not folder_path:
        print(f"No matching folder found for product set: {product_set_name}")
        return

    filename = f"{product_set_name}.json"
    filepath = os.path.join(folder_path, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(
            product_set,
            f,
            indent=2,
            ensure_ascii=False,
            sort_keys=True,
        )

    print(f"Saved {filepath}")


def main():
    offset = OFFSET
    processed = 0

    while True:
        print(f"Fetching product sets (offset={offset}, limit={LIMIT})")
        product_sets = fetch_product_sets_page(offset, LIMIT)

        if not product_sets:
            break

        for product_set in product_sets:
            save_product_set(product_set)
            processed += 1

        offset += LIMIT
        time.sleep(REQUEST_DELAY_SECONDS)

    print(f"Done. Processed {processed} product sets.")


if __name__ == "__main__":
    main()
