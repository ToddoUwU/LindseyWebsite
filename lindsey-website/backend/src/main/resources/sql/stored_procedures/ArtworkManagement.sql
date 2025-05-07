CREATE OR REPLACE FUNCTION get_artworks_by_medium(p_medium VARCHAR)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR,
    description TEXT,
    image_url VARCHAR,
    medium VARCHAR,
    year INTEGER,
    for_sale BOOLEAN,
    price NUMERIC,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM artworks WHERE artworks.medium = p_medium;
END;
$$ LANGUAGE plpgsql;