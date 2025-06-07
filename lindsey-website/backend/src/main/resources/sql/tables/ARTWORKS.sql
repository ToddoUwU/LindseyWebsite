CREATE TABLE IF NOT EXISTS ARTWORKS (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    art_description TEXT,
    dimensions VARCHAR(100),
    small_image_url VARCHAR(255),
    large_image_url VARCHAR(255),
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
    content_hash VARCHAR(64)
);

-- Create indexes for faster searching
CREATE INDEX IF NOT EXISTS idx_artwork_title ON ARTWORKS(title);
CREATE INDEX IF NOT EXISTS idx_artwork_medium ON ARTWORKS(medium);
CREATE INDEX IF NOT EXISTS idx_artwork_date ON ARTWORKS(date_produced);