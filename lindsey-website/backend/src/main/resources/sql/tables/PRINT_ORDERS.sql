CREATE TABLE IF NOT EXISTS PRINT_ORDERS
(
    id                BIGSERIAL PRIMARY KEY,
    order_reference   VARCHAR(20)    NOT NULL UNIQUE,            -- "LAA-20260329-0001"
    square_payment_id VARCHAR(100),
    artello_order_id  VARCHAR(36),
    artwork_id        BIGINT REFERENCES ARTWORKS (id),
    print_variant_id  BIGINT REFERENCES ARTELLO_PRINT_VARIANTS (id),
    quantity          INTEGER        NOT NULL DEFAULT 1,
    total_amount      DECIMAL(10, 2) NOT NULL,
    currency          VARCHAR(3)     NOT NULL DEFAULT 'USD',
    status            VARCHAR(30)    NOT NULL DEFAULT 'PENDING', -- PENDING/PAID/SUBMITTED/PROCESSING/SHIPPED/CANCELLED/REFUNDED
    tracking_number   VARCHAR(100),
    tracking_url      VARCHAR(500),
    shipping_carrier  VARCHAR(50),
    is_test_order     BOOLEAN                 DEFAULT FALSE,
    error_message     TEXT,
    created_at        TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP               DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_orders_ref ON PRINT_ORDERS (order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_square ON PRINT_ORDERS (square_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_artello ON PRINT_ORDERS (artello_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON PRINT_ORDERS (status);