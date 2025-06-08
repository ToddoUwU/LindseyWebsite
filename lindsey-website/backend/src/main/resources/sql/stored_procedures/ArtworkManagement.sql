-- Get artwork by medium
CREATE OR REPLACE FUNCTION get_artworks_by_medium(p_medium VARCHAR)
RETURNS SETOF ARTWORKS AS $$
BEGIN
    RETURN QUERY SELECT * FROM ARTWORKS WHERE medium = p_medium;
END;
$$ LANGUAGE plpgsql;

-- Get artwork by title
CREATE OR REPLACE FUNCTION get_artwork_by_title(p_title VARCHAR)
RETURNS SETOF ARTWORKS AS $$
BEGIN
    RETURN QUERY SELECT * FROM ARTWORKS WHERE title = p_title LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Get featured artwork
CREATE OR REPLACE FUNCTION get_featured_artworks()
RETURNS SETOF ARTWORKS AS $$
BEGIN
    RETURN QUERY SELECT * FROM ARTWORKS WHERE is_featured = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Get artwork by category
CREATE OR REPLACE FUNCTION get_artworks_by_category(p_category VARCHAR)
RETURNS SETOF ARTWORKS AS $$
BEGIN
    RETURN QUERY SELECT * FROM ARTWORKS WHERE categories LIKE '%' || p_category || '%';
END;
$$ LANGUAGE plpgsql;

-- Get all artworks - potentially with pagination
CREATE OR REPLACE FUNCTION get_all_artworks()
RETURNS SETOF ARTWORKS AS $$
BEGIN
   RETURN QUERY SELECT * FROM ARTWORKS ORDER BY date_produced DESC;

END;
$$ LANGUAGE plpgsql;

-- Update artwork content hash
CREATE OR REPLACE FUNCTION update_artwork_hash(p_id BIGINT, p_hash VARCHAR)
RETURNS VOID AS $$
BEGIN
    UPDATE ARTWORKS
    SET content_hash = p_hash,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;