CREATE TABLE IF NOT EXISTS ARTWORKS (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    art_description TEXT,
    dimensions VARCHAR(100),
    small_image_url VARCHAR(255),
    small_image_width INT,
    small_image_height INT,
    medium_image_url VARCHAR(255),
    medium_image_width INT,
    medium_image_height INT,
    large_image_url VARCHAR(255),
    large_image_width INT,
    large_image_height INT,
    link_to_print VARCHAR(255),
    date_produced DATE,
    original_price DECIMAL(10,2),
    for_sale BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    medium VARCHAR(100),
    categories TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content_hash VARCHAR(64),
    valid_ratios TEXT
);

-- Create indexes for faster searching
CREATE INDEX IF NOT EXISTS idx_artwork_title ON ARTWORKS(title);
CREATE INDEX IF NOT EXISTS idx_artwork_medium ON ARTWORKS(medium);
CREATE INDEX IF NOT EXISTS idx_artwork_date ON ARTWORKS(date_produced);

COMMENT ON COLUMN ARTWORKS.valid_ratios IS 'Comma-delimited list of valid print sizes that match the artwork ratio (e.g., "11x14,14x18,22x28")';