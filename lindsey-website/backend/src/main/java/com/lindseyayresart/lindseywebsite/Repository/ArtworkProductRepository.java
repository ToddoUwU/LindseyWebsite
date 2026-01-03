package com.lindseyayresart.lindseywebsite.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lindseyayresart.lindseywebsite.Model.ArtworkProduct;

import java.util.List;
import java.util.Set;

@Repository
public interface ArtworkProductRepository extends JpaRepository<ArtworkProduct, Long> {

    // ============================================================
    // Products by Artwork
    // ============================================================

    /**
     * Get all products for a specific artwork, ordered by display order.
     */
    List<ArtworkProduct> findByArtworkIdOrderByDisplayOrderAsc(Long artworkId);

    /**
     * Get available products for a specific artwork.
     */
    List<ArtworkProduct> findByArtworkIdAndIsAvailableTrueOrderByDisplayOrderAsc(Long artworkId);

    // ============================================================
    // Products by Category
    // ============================================================

    /**
     * Get all products in a specific category.
     */
    List<ArtworkProduct> findByProductCategoryIgnoreCaseOrderByArtworkTitleAsc(String category);

    /**
     * Get available products in a specific category.
     */
    List<ArtworkProduct> findByProductCategoryIgnoreCaseAndIsAvailableTrueOrderByArtworkTitleAsc(String category);

    // ============================================================
    // Unique Categories
    // ============================================================

    /**
     * Get all unique product categories.
     */
    @Query("SELECT DISTINCT p.productCategory FROM ArtworkProduct p WHERE p.productCategory IS NOT NULL ORDER BY p.productCategory ASC")
    Set<String> findAllProductCategories();

    // ============================================================
    // Counts
    // ============================================================

    /**
     * Count products for a specific artwork.
     */
    long countByArtworkId(Long artworkId);

    /**
     * Count available products for a specific artwork.
     */
    long countByArtworkIdAndIsAvailableTrue(Long artworkId);

    // ============================================================
    // Check if artwork has products
    // ============================================================

    /**
     * Check if an artwork has any products.
     */
    boolean existsByArtworkId(Long artworkId);

    /**
     * Check if an artwork has any available products.
     */
    boolean existsByArtworkIdAndIsAvailableTrue(Long artworkId);
}

