-- This SQL script creates a trigger to automatically update the `updated_at` timestamp
-- Create function to automatically update timestamp when artwork is updated
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on ARTWORKS table
DROP TRIGGER IF EXISTS set_timestamp ON ARTWORKS;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON ARTWORKS
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();