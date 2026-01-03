-- ============================================================
-- ARTWORK_PRODUCTS Table
-- Stores products associated with artworks (prints, merchandise, etc.)
-- One artwork can have many products (one-to-many relationship)
-- ============================================================

CREATE TABLE IF NOT EXISTS ARTWORK_PRODUCTS (
    id BIGSERIAL PRIMARY KEY,

    -- Foreign key to ARTWORKS table (required)
    artwork_id BIGINT NOT NULL REFERENCES ARTWORKS(id) ON DELETE CASCADE,

    -- Product description (required) - e.g., "8x10 Print", "Coffee Mug"
    description VARCHAR(255) NOT NULL,

    -- Product category (required) - e.g., "Print", "Canvas", "Mug", "Apparel"
    product_category VARCHAR(100) NOT NULL,

    -- URL to purchase the product (required) - links to Printify, Etsy, etc.
    product_url VARCHAR(500) NOT NULL,

    -- Price (optional - may be dynamic on external site)
    price DECIMAL(10, 2),

    -- Whether product is currently available
    is_available BOOLEAN DEFAULT TRUE,

    -- Display order for sorting (lower numbers first)
    display_order INTEGER DEFAULT 0,

    -- Optional image URL for product mockup
    product_image_url VARCHAR(500),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups by artwork
CREATE INDEX IF NOT EXISTS idx_artwork_products_artwork_id ON ARTWORK_PRODUCTS(artwork_id);

-- Index for category lookups
CREATE INDEX IF NOT EXISTS idx_artwork_products_category ON ARTWORK_PRODUCTS(product_category);

-- Index for available products
CREATE INDEX IF NOT EXISTS idx_artwork_products_available ON ARTWORK_PRODUCTS(is_available);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_artwork_products_artwork_available ON ARTWORK_PRODUCTS(artwork_id, is_available);

-- ============================================================
-- Trigger to auto-update updated_at timestamp
-- ============================================================

CREATE OR REPLACE FUNCTION update_artwork_products_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_artwork_products_timestamp ON ARTWORK_PRODUCTS;
CREATE TRIGGER trigger_update_artwork_products_timestamp
    BEFORE UPDATE ON ARTWORK_PRODUCTS
    FOR EACH ROW
    EXECUTE FUNCTION update_artwork_products_timestamp();

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON TABLE ARTWORK_PRODUCTS IS 'Products associated with artworks (prints, merchandise, etc.)';
COMMENT ON COLUMN ARTWORK_PRODUCTS.artwork_id IS 'Reference to the parent artwork';
COMMENT ON COLUMN ARTWORK_PRODUCTS.description IS 'Product description, e.g., "8x10 Print", "Canvas 16x20", "Coffee Mug"';
COMMENT ON COLUMN ARTWORK_PRODUCTS.product_category IS 'Category: Print, Canvas, Mug, Apparel, Home Decor, Original, etc.';
COMMENT ON COLUMN ARTWORK_PRODUCTS.product_url IS 'URL to purchase the product (Printify, Etsy, etc.)';
COMMENT ON COLUMN ARTWORK_PRODUCTS.price IS 'Product price (optional if dynamic on external site)';
COMMENT ON COLUMN ARTWORK_PRODUCTS.is_available IS 'Whether the product is currently available for purchase';
COMMENT ON COLUMN ARTWORK_PRODUCTS.display_order IS 'Order for displaying products (lower numbers first)';
COMMENT ON COLUMN ARTWORK_PRODUCTS.product_image_url IS 'Optional mockup image URL (for mugs, shirts, etc.)';

