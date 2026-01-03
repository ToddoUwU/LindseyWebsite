package com.lindseyayresart.lindseywebsite.Services;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lindseyayresart.lindseywebsite.Model.Artwork;
import com.lindseyayresart.lindseywebsite.Repository.ArtworkRepository;

/**
 * Service layer for Artwork operations.
 *
 * Uses Spring Data JPA for database access and Spring Cache (Redis) for caching.
 * Each method returns a single responsibility - no combined DTOs.
 *
 * Cache names:
 * - "artworks" - individual artworks by ID
 * - "featuredArtworks" - list of featured artworks
 * - "categories" - unique categories
 * - "dimensions" - unique dimensions
 * - "years" - unique production years
 * - "artworksByCategory" - artworks filtered by category
 */
@Service
@Transactional(readOnly = true)
public class ArtworkService {

    private static final Logger logger = LoggerFactory.getLogger(ArtworkService.class);

    private final ArtworkRepository artworkRepository;

    public ArtworkService(ArtworkRepository artworkRepository) {
        this.artworkRepository = artworkRepository;
    }

    // ============================================================
    // Individual Artwork Queries
    // ============================================================

    /**
     * Get artwork by ID
     */
    @Cacheable(value = "artworks", key = "#id")
    public Optional<Artwork> getArtworkById(Long id) {
        logger.debug("Fetching artwork by ID: {}", id);
        return artworkRepository.findById(id);
    }

    /**
     * Get artwork by title (case-insensitive)
     */
    @Cacheable(value = "artworks", key = "'title:' + #title.toLowerCase()")
    public Optional<Artwork> getArtworkByTitle(String title) {
        logger.debug("Fetching artwork by title: {}", title);
        return artworkRepository.findByTitleIgnoreCase(title);
    }

    /**
     * Get all artworks
     */
    @Cacheable(value = "artworks", key = "'all'")
    public List<Artwork> getAllArtworks() {
        logger.debug("Fetching all artworks");
        return artworkRepository.findAll();
    }

    // ============================================================
    // Featured Artworks - Endpoint 1
    // Sorted by updatedAt descending (most recently updated first)
    // Cache refreshed every 5 minutes via scheduled task
    // ============================================================

    /**
     * Get artworks marked as featured, sorted by last updated.
     * Only returns artworks that have valid image URLs.
     * Called by: GET /api/featured
     */
    @Cacheable(value = "featuredArtworks")
    public List<Artwork> getFeaturedArtworks() {
        logger.info("Fetching featured artworks from database");
        List<Artwork> featured = artworkRepository.findFeaturedWithImages();
        logger.info("Found {} featured artworks with images", featured.size());
        return featured;
    }

    /**
     * Scheduled task to refresh featured artworks cache every 5 minutes.
     * This ensures featured artwork changes are reflected quickly.
     */
    @Scheduled(fixedRate = 5 * 60 * 1000) // 5 minutes
    @CacheEvict(value = "featuredArtworks", allEntries = true)
    public void refreshFeaturedArtworksCache() {
        logger.info("Scheduled refresh: Evicting featured artworks cache");
    }

    // ============================================================
    // Unique Categories - Endpoint 2
    // ============================================================

    /**
     * Get unique list of all categories.
     * Called by: GET /api/categories
     */
    @Cacheable(value = "categories")
    public Set<String> getUniqueCategories() {
        logger.info("Fetching unique categories from database");
        Set<String> categories = artworkRepository.findAllUniqueCategories();
        logger.info("Found {} unique categories", categories.size());
        return categories;
    }

    // ============================================================
    // Unique Dimensions - Endpoint 3
    // ============================================================

    /**
     * Get unique list of all dimensions.
     * Called by: GET /api/dimensions
     */
    @Cacheable(value = "dimensions")
    public List<String> getUniqueDimensions() {
        logger.info("Fetching unique dimensions from database");
        List<String> dimensions = artworkRepository.findDistinctDimensions();
        logger.info("Found {} unique dimensions", dimensions.size());
        return dimensions;
    }

    // ============================================================
    // Unique Years - Endpoint 4
    // ============================================================

    /**
     * Get unique list of all years when artworks were produced.
     * Called by: GET /api/years
     */
    @Cacheable(value = "years")
    public Set<Integer> getUniqueYears() {
        logger.info("Fetching unique years from database");
        Set<Integer> years = artworkRepository.findAllUniqueYears();
        logger.info("Found {} unique years", years.size());
        return years;
    }

    // ============================================================
    // Filtered Queries
    // ============================================================

    /**
     * Get artworks by category
     */
    @Cacheable(value = "artworksByCategory", key = "#category.toLowerCase()")
    public List<Artwork> getArtworksByCategory(String category) {
        logger.debug("Fetching artworks by category: {}", category);
        return artworkRepository.findByCategoriesContainingIgnoreCaseOrderByTitleAsc(category);
    }

    /**
     * Get artworks by medium
     */
    @Cacheable(value = "artworksByMedium", key = "#medium.toLowerCase()")
    public List<Artwork> getArtworksByMedium(String medium) {
        logger.debug("Fetching artworks by medium: {}", medium);
        return artworkRepository.findByMediumContainingIgnoreCaseOrderByTitleAsc(medium);
    }

    /**
     * Get artworks for sale (only those with images)
     */
    @Cacheable(value = "artworksForSale")
    public List<Artwork> getArtworksForSale() {
        logger.debug("Fetching artworks for sale");
        return artworkRepository.findForSaleWithImages();
    }

    /**
     * Search artworks by term (searches title, description, categories)
     */
    public List<Artwork> searchArtworks(String searchTerm) {
        logger.debug("Searching artworks with term: {}", searchTerm);
        return artworkRepository.findByTitleContainingIgnoreCaseOrArtDescriptionContainingIgnoreCaseOrCategoriesContainingIgnoreCaseOrderByTitleAsc(
                searchTerm, searchTerm, searchTerm);
    }

    /**
     * Get unique mediums
     */
    @Cacheable(value = "mediums")
    public List<String> getUniqueMediums() {
        logger.info("Fetching unique mediums from database");
        return artworkRepository.findDistinctMediums();
    }

    // ============================================================
    // Cache Management
    // ============================================================

    /**
     * Evict all caches - call this when artworks are updated
     */
    @CacheEvict(value = {
        "artworks",
        "featuredArtworks",
        "categories",
        "dimensions",
        "years",
        "artworksByCategory",
        "artworksByMedium",
        "artworksForSale",
        "mediums"
    }, allEntries = true)
    public void evictAllCaches() {
        logger.info("All artwork caches evicted");
    }

    /**
     * Evict single artwork from cache
     */
    @CacheEvict(value = "artworks", key = "#id")
    public void evictArtworkCache(Long id) {
        logger.info("Evicted cache for artwork ID: {}", id);
    }
}

