-- Migration script to add medium_image_url column to ARTWORKS table
-- Run this against the dev or prod database to add the new column

-- Add the medium_image_url column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'artworks'
        AND column_name = 'medium_image_url'
    ) THEN
        ALTER TABLE artworks ADD COLUMN medium_image_url VARCHAR(255);
        RAISE NOTICE 'Column medium_image_url added successfully';
    ELSE
        RAISE NOTICE 'Column medium_image_url already exists';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'artworks'
AND column_name IN ('small_image_url', 'medium_image_url', 'large_image_url')
ORDER BY ordinal_position;

