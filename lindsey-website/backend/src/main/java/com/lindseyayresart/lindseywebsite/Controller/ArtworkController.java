package com.lindseyayresart.lindseywebsite.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lindseyayresart.lindseywebsite.Model.Artwork;
import com.lindseyayresart.lindseywebsite.Services.ArtworkService;

import java.util.List;
import java.util.Set;

/**
 * REST Controller for artwork-related endpoints.
 *
 * Separate endpoints for each data type (no combined DTOs):
 * - GET /api/featured - Featured artworks
 * - GET /api/categories - Unique categories
 * - GET /api/dimensions - Unique dimensions
 * - GET /api/years - Unique production years
 * - GET /api/artwork/{id} - Single artwork by ID
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "${ALLOWED_ORIGINS:}"})
public class ArtworkController {
    
    private static final Logger logger = LoggerFactory.getLogger(ArtworkController.class);
    
    private final ArtworkService artworkService;

    public ArtworkController(ArtworkService artworkService) {
        this.artworkService = artworkService;
    }

    // ============================================================
    // Endpoint 1: Featured Artworks
    // ============================================================

    /**
     * GET /api/featured
     * Returns artworks marked as featured
     */
    @GetMapping("/featured")
    public ResponseEntity<List<Artwork>> getFeaturedArtworks() {
        logger.info("GET /api/featured - Fetching featured artworks");

        try {
            List<Artwork> featured = artworkService.getFeaturedArtworks();
            logger.info("Returning {} featured artworks", featured.size());
            return ResponseEntity.ok(featured);
        } catch (Exception e) {
            logger.error("Error fetching featured artworks", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================================
    // Endpoint 2: Unique Categories
    // ============================================================

    /**
     * GET /api/categories
     * Returns unique list of all categories
     */
    @GetMapping("/categories")
    public ResponseEntity<Set<String>> getCategories() {
        logger.info("GET /api/categories - Fetching unique categories");

        try {
            Set<String> categories = artworkService.getUniqueCategories();
            logger.info("Returning {} categories", categories.size());
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            logger.error("Error fetching categories", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================================
    // Endpoint 3: Unique Dimensions
    // ============================================================

    /**
     * GET /api/dimensions
     * Returns unique list of all dimensions
     */
    @GetMapping("/dimensions")
    public ResponseEntity<List<String>> getDimensions() {
        logger.info("GET /api/dimensions - Fetching unique dimensions");

        try {
            List<String> dimensions = artworkService.getUniqueDimensions();
            logger.info("Returning {} dimensions", dimensions.size());
            return ResponseEntity.ok(dimensions);
        } catch (Exception e) {
            logger.error("Error fetching dimensions", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================================
    // Endpoint 4: Unique Years
    // ============================================================

    /**
     * GET /api/years
     * Returns unique list of all years when artworks were produced
     */
    @GetMapping("/years")
    public ResponseEntity<Set<Integer>> getYears() {
        logger.info("GET /api/years - Fetching unique years");

        try {
            Set<Integer> years = artworkService.getUniqueYears();
            logger.info("Returning {} years", years.size());
            return ResponseEntity.ok(years);
        } catch (Exception e) {
            logger.error("Error fetching years", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================================
    // Single Artwork Endpoints
    // ============================================================

    /**
     * GET /api/artwork/{id}
     * Returns full artwork details by ID
     *
     * Security: Input validation applied
     */
    @GetMapping("/artwork/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        logger.info("GET /api/artwork/{} - Fetching artwork", id);

        // Validate ID is positive
        if (id == null || id <= 0) {
            logger.warn("Invalid artwork ID: {}", id);
            return ResponseEntity.badRequest().build();
        }

        try {
            return artworkService.getArtworkById(id)
                .map(artwork -> {
                    logger.info("Returning artwork: {}", artwork.getTitle());
                    return ResponseEntity.ok(artwork);
                })
                .orElseGet(() -> {
                    logger.warn("Artwork not found: {}", id);
                    return ResponseEntity.notFound().build();
                });
        } catch (Exception e) {
            logger.error("Error fetching artwork by ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * GET /api/artwork/title/{title}
     * Returns full artwork details by title
     *
     * Security: Input validation and sanitization applied
     */
    @GetMapping("/artwork/title/{title}")
    public ResponseEntity<Artwork> getArtworkByTitle(@PathVariable String title) {
        logger.info("GET /api/artwork/title - Fetching artwork by title");

        // Validate and sanitize input
        String sanitized = sanitizeInput(title, 255);
        if (sanitized == null) {
            logger.warn("Title rejected: invalid input");
            return ResponseEntity.badRequest().build();
        }

        try {
            return artworkService.getArtworkByTitle(sanitized)
                .map(artwork -> {
                    logger.info("Returning artwork: {}", artwork.getTitle());
                    return ResponseEntity.ok(artwork);
                })
                .orElseGet(() -> {
                    logger.warn("Artwork not found by title");
                    return ResponseEntity.notFound().build();
                });
        } catch (Exception e) {
            logger.error("Error fetching artwork by title", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================================
    // Filtered Queries
    // ============================================================

    /**
     * GET /api/artworks/category/{category}
     * Returns artworks filtered by category
     *
     * Security: Input validation and sanitization applied
     */
    @GetMapping("/artworks/category/{category}")
    public ResponseEntity<List<Artwork>> getArtworksByCategory(@PathVariable String category) {
        logger.info("GET /api/artworks/category - Fetching artworks by category");

        // Validate and sanitize input
        String sanitized = sanitizeInput(category, 50);
        if (sanitized == null) {
            logger.warn("Category rejected: invalid input");
            return ResponseEntity.badRequest().build();
        }

        try {
            List<Artwork> artworks = artworkService.getArtworksByCategory(sanitized);
            logger.info("Returning {} artworks for category", artworks.size());
            return ResponseEntity.ok(artworks);
        } catch (Exception e) {
            logger.error("Error fetching artworks by category", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/artworks/medium/{medium}
     * Returns artworks filtered by medium
     *
     * Security: Input validation and sanitization applied
     */
    @GetMapping("/artworks/medium/{medium}")
    public ResponseEntity<List<Artwork>> getArtworksByMedium(@PathVariable String medium) {
        logger.info("GET /api/artworks/medium - Fetching artworks by medium");

        // Validate and sanitize input
        String sanitized = sanitizeInput(medium, 100);
        if (sanitized == null) {
            logger.warn("Medium rejected: invalid input");
            return ResponseEntity.badRequest().build();
        }

        try {
            List<Artwork> artworks = artworkService.getArtworksByMedium(sanitized);
            logger.info("Returning {} artworks for medium", artworks.size());
            return ResponseEntity.ok(artworks);
        } catch (Exception e) {
            logger.error("Error fetching artworks by medium", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/artworks/for-sale
     * Returns artworks that are for sale
     */
    @GetMapping("/artworks/for-sale")
    public ResponseEntity<List<Artwork>> getArtworksForSale() {
        logger.info("GET /api/artworks/for-sale - Fetching artworks for sale");

        try {
            List<Artwork> artworks = artworkService.getArtworksForSale();
            logger.info("Returning {} artworks for sale", artworks.size());
            return ResponseEntity.ok(artworks);
        } catch (Exception e) {
            logger.error("Error fetching artworks for sale", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/artworks/search?q={searchTerm}
     * Search artworks by term
     *
     * Security protections:
     * - Input validation (null/empty check)
     * - Length limit (max 100 chars) to prevent DoS
     * - Character sanitization to remove HTML/SQL special characters
     * - Parameterized queries in repository layer (JPA handles automatically)
     */
    @GetMapping("/artworks/search")
    public ResponseEntity<List<Artwork>> searchArtworks(@RequestParam("q") String searchTerm) {
        logger.info("GET /api/artworks/search - Searching artworks");

        // Validate and sanitize input using helper method
        String sanitized = sanitizeInput(searchTerm, 100);
        if (sanitized == null) {
            logger.warn("Search rejected: invalid input");
            return ResponseEntity.badRequest().build();
        }

        try {
            List<Artwork> artworks = artworkService.searchArtworks(sanitized);
            logger.info("Found {} artworks matching search", artworks.size());
            return ResponseEntity.ok(artworks);
        } catch (Exception e) {
            logger.error("Error searching artworks", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/mediums
     * Returns unique list of all mediums
     */
    @GetMapping("/mediums")
    public ResponseEntity<List<String>> getMediums() {
        logger.info("GET /api/mediums - Fetching unique mediums");

        try {
            List<String> mediums = artworkService.getUniqueMediums();
            logger.info("Returning {} mediums", mediums.size());
            return ResponseEntity.ok(mediums);
        } catch (Exception e) {
            logger.error("Error fetching mediums", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================================
    // Cache Management (Admin)
    // ============================================================

    /**
     * POST /api/admin/cache/evict
     * Evict all caches (admin endpoint)
     *
     * Security: This endpoint should be protected in production.
     * Consider adding authentication or IP restrictions.
     */
    @PostMapping("/admin/cache/evict")
    public ResponseEntity<String> evictCaches() {
        logger.info("POST /api/admin/cache/evict - Evicting all caches");

        try {
            artworkService.evictAllCaches();
            return ResponseEntity.ok("All caches evicted successfully");
        } catch (Exception e) {
            logger.error("Error evicting caches", e);
            return ResponseEntity.internalServerError().body("Failed to evict caches");
        }
    }

    // ============================================================
    // Helper Methods
    // ============================================================

    /**
     * Sanitize user input to prevent injection attacks.
     *
     * @param input The raw user input
     * @param maxLength Maximum allowed length
     * @return Sanitized string, or null if input is invalid
     */
    private String sanitizeInput(String input, int maxLength) {
        if (input == null || input.trim().isEmpty()) {
            return null;
        }

        String trimmed = input.trim();

        // Check length
        if (trimmed.length() > maxLength) {
            logger.warn("Input rejected: exceeds max length of {}", maxLength);
            return null;
        }

        // Remove potentially dangerous characters
        String sanitized = trimmed.replaceAll("[<>\"'%;()&+\\\\]", "");

        // If sanitization removed everything, reject
        if (sanitized.isEmpty()) {
            return null;
        }

        return sanitized;
    }
}
