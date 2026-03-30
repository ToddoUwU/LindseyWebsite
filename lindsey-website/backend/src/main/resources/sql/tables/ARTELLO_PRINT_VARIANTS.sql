CREATE TABLE IF NOT EXISTS ARTELLO_PRINT_VARIANTS
(
    id                      BIGSERIAL PRIMARY KEY,
    artwork_id              BIGINT         NOT NULL REFERENCES ARTWORKS (id) ON DELETE CASCADE,
    artello_variant_id      VARCHAR(36)    NOT NULL UNIQUE,
    catalog_product_id      VARCHAR(50)    NOT NULL, -- "IndividualArtPrint"
    size                    VARCHAR(20)    NOT NULL, -- "x16x20"
    orientation             VARCHAR(20)    NOT NULL, -- "Horizontal"/"Vertical"
    paper_type              VARCHAR(50)    NOT NULL, -- "PearlFineArt"
    paper_style             VARCHAR(50)    NOT NULL, -- "FineArt"
    frame_style             VARCHAR(50)    NOT NULL, -- "PremiumMetal"/"Unframed"
    frame_color             VARCHAR(50)    NOT NULL, -- "SilverPremiumMetal"/"Unframed"
    include_framing_service BOOLEAN        NOT NULL DEFAULT FALSE,
    include_hanging_pins    BOOLEAN        NOT NULL DEFAULT FALSE,
    include_mats            BOOLEAN        NOT NULL DEFAULT FALSE,
    unit_cost               DECIMAL(10, 2) NOT NULL, -- Artello's cost to us
    shipping_estimate       DECIMAL(10, 2) NOT NULL, -- Computed from rate tables
    retail_price            DECIMAL(10, 2) NOT NULL, -- Customer pays this (cost + shipping + margin)
    is_available            BOOLEAN                 DEFAULT TRUE,
    display_order           INTEGER                 DEFAULT 0,
    created_at              TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP               DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pv_artwork ON ARTELLO_PRINT_VARIANTS (artwork_id);
CREATE INDEX IF NOT EXISTS idx_pv_artello ON ARTELLO_PRINT_VARIANTS (artello_variant_id);
CREATE INDEX IF NOT EXISTS idx_pv_available ON ARTELLO_PRINT_VARIANTS (artwork_id, is_available);