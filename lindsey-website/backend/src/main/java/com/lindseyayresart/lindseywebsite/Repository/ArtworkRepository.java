package com.lindseyayresart.lindseywebsite.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lindseyayresart.lindseywebsite.Model.Artwork;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {

    // ============================================================
    // Basic Queries - Using Spring Data JPA method naming
    // ============================================================

    Optional<Artwork> findByTitleIgnoreCase(String title);

    // ============================================================
    // Featured Artworks - sorted by last updated, must have images
    // ============================================================

    /**
     * Get featured artworks that have valid image URLs.
     * Artworks without images should not be displayed.
     */
    @Query("""
        SELECT a FROM Artwork a 
        WHERE a.isFeatured = true 
        AND a.smallImageUrl IS NOT NULL AND a.smallImageUrl != '' 
        AND a.largeImageUrl IS NOT NULL AND a.largeImageUrl != ''
        ORDER BY a.updatedAt DESC
        """)
    List<Artwork> findFeaturedWithImages();

    // ============================================================
    // For Sale Queries - must have images
    // ============================================================

    @Query("""
        SELECT a FROM Artwork a 
        WHERE a.forSale = true 
        AND a.smallImageUrl IS NOT NULL AND a.smallImageUrl != '' 
        AND a.largeImageUrl IS NOT NULL AND a.largeImageUrl != ''
        ORDER BY a.title ASC
        """)
    List<Artwork> findForSaleWithImages();

    // ============================================================
    // Category Queries (categories is comma-delimited, needs LIKE)
    // ============================================================

    List<Artwork> findByCategoriesContainingIgnoreCaseOrderByTitleAsc(String category);

    // ============================================================
    // Medium Queries
    // ============================================================

    List<Artwork> findByMediumIgnoreCaseOrderByTitleAsc(String medium);

    List<Artwork> findByMediumContainingIgnoreCaseOrderByTitleAsc(String medium);

    // ============================================================
    // Distinct Values for Filters - Using @Query for projections
    // ============================================================

    /**
     * Get all unique dimensions (non-null, non-empty, ordered)
     */
    @Query("SELECT DISTINCT a.dimensions FROM Artwork a WHERE a.dimensions IS NOT NULL AND a.dimensions != '' ORDER BY a.dimensions ASC")
    List<String> findDistinctDimensions();

    /**
     * Get all unique mediums (non-null, non-empty, ordered)
     */
    @Query("SELECT DISTINCT a.medium FROM Artwork a WHERE a.medium IS NOT NULL AND a.medium != '' ORDER BY a.medium ASC")
    List<String> findDistinctMediums();

    // ============================================================
    // Native Queries - Only where JPA method naming is insufficient
    // ============================================================

    /**
     * Get unique categories from comma-separated field.
     * Native query required because categories are stored as "Cat1,Cat2,Cat3"
     */
    @Query(value = """
        SELECT DISTINCT TRIM(unnest(string_to_array(categories, ','))) as category
        FROM artworks 
        WHERE categories IS NOT NULL AND categories != ''
        ORDER BY category
        """, nativeQuery = true)
    Set<String> findAllUniqueCategories();

    /**
     * Get unique years from dateProduced.
     * Native query required to extract year from date field.
     */
    @Query(value = """
        SELECT DISTINCT EXTRACT(YEAR FROM date_produced)::INTEGER as year
        FROM artworks 
        WHERE date_produced IS NOT NULL
        ORDER BY year DESC
        """, nativeQuery = true)
    Set<Integer> findAllUniqueYears();

    // ============================================================
    // Search - Needs @Query for OR across multiple fields
    // ============================================================

    List<Artwork> findByTitleContainingIgnoreCaseOrArtDescriptionContainingIgnoreCaseOrCategoriesContainingIgnoreCaseOrderByTitleAsc(
            String titleSearch, String descriptionSearch, String categorySearch);
}