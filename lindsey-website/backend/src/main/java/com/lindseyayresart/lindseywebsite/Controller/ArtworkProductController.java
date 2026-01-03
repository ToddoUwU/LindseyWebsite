package com.lindseyayresart.lindseywebsite.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lindseyayresart.lindseywebsite.Model.ArtworkProduct;
import com.lindseyayresart.lindseywebsite.Services.ArtworkProductService;

import java.util.List;
import java.util.Set;

/**
 * REST Controller for artwork product endpoints.
 * 
 * Products are items that can be purchased based on an artwork:
 * - Prints (various sizes)
 * - Canvas prints
 * - Merchandise (mugs, shirts, etc. via Printify)
 * 
 * Endpoints:
 * - GET /api/artwork/{id}/products - Products for a specific artwork
 * - GET /api/products/categories - All product categories
 * - GET /api/products/category/{category} - Products in a category
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "${ALLOWED_ORIGINS:}"})
public class ArtworkProductController {
    
    private static final Logger logger = LoggerFactory.getLogger(ArtworkProductController.class);
    
    private final ArtworkProductService productService;

    public ArtworkProductController(ArtworkProductService productService) {
        this.productService = productService;
    }

    // ============================================================
    // Products by Artwork
    // ============================================================

    /**
     * GET /api/artwork/{artworkId}/products
     * Returns all available products for a specific artwork.
     */
    @GetMapping("/artwork/{artworkId}/products")
    public ResponseEntity<List<ArtworkProduct>> getProductsByArtwork(@PathVariable Long artworkId) {
        logger.info("GET /api/artwork/{}/products - Fetching products", artworkId);

        try {
            List<ArtworkProduct> products = productService.getAvailableProductsByArtworkId(artworkId);
            logger.info("Returning {} products for artwork ID: {}", products.size(), artworkId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error fetching products for artwork ID: {}", artworkId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================================
    // Product Categories
    // ============================================================

    /**
     * GET /api/products/categories
     * Returns all unique product categories.
     */
    @GetMapping("/products/categories")
    public ResponseEntity<Set<String>> getProductCategories() {
        logger.info("GET /api/products/categories - Fetching product categories");

        try {
            Set<String> categories = productService.getAllProductCategories();
            logger.info("Returning {} product categories", categories.size());
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            logger.error("Error fetching product categories", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/products/category/{category}
     * Returns all available products in a specific category.
     */
    @GetMapping("/products/category/{category}")
    public ResponseEntity<List<ArtworkProduct>> getProductsByCategory(@PathVariable String category) {
        logger.info("GET /api/products/category/{} - Fetching products", category);

        try {
            List<ArtworkProduct> products = productService.getProductsByCategory(category);
            logger.info("Returning {} products in category: {}", products.size(), category);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error fetching products in category: {}", category, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================================
    // Product Count
    // ============================================================

    /**
     * GET /api/artwork/{artworkId}/products/count
     * Returns the count of available products for an artwork.
     */
    @GetMapping("/artwork/{artworkId}/products/count")
    public ResponseEntity<Long> getProductCount(@PathVariable Long artworkId) {
        logger.debug("GET /api/artwork/{}/products/count", artworkId);
        
        try {
            long count = productService.countAvailableProducts(artworkId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            logger.error("Error counting products for artwork ID: {}", artworkId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/artwork/{artworkId}/products/exists
     * Check if an artwork has any available products.
     */
    @GetMapping("/artwork/{artworkId}/products/exists")
    public ResponseEntity<Boolean> hasProducts(@PathVariable Long artworkId) {
        logger.debug("GET /api/artwork/{}/products/exists", artworkId);
        
        try {
            boolean hasProducts = productService.hasAvailableProducts(artworkId);
            return ResponseEntity.ok(hasProducts);
        } catch (Exception e) {
            logger.error("Error checking products for artwork ID: {}", artworkId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================================
    // Admin Endpoints (for future admin panel)
    // These would typically require authentication
    // ============================================================

    /**
     * POST /api/artwork/{artworkId}/products
     * Add a new product to an artwork.
     */
    @PostMapping("/artwork/{artworkId}/products")
    public ResponseEntity<ArtworkProduct> addProduct(
            @PathVariable Long artworkId, 
            @RequestBody ArtworkProduct product) {
        logger.info("POST /api/artwork/{}/products - Adding product: {}", artworkId, product.getDescription());

        try {
            ArtworkProduct created = productService.addProduct(artworkId, product);
            logger.info("Created product ID: {} for artwork ID: {}", created.getId(), artworkId);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            logger.warn("Artwork not found: {}", artworkId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error adding product to artwork ID: {}", artworkId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * PUT /api/products/{productId}
     * Update an existing product.
     */
    @PutMapping("/products/{productId}")
    public ResponseEntity<ArtworkProduct> updateProduct(
            @PathVariable Long productId, 
            @RequestBody ArtworkProduct product) {
        logger.info("PUT /api/products/{} - Updating product", productId);

        try {
            ArtworkProduct updated = productService.updateProduct(productId, product);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            logger.warn("Product not found: {}", productId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating product ID: {}", productId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * DELETE /api/products/{productId}
     * Delete a product.
     */
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        logger.info("DELETE /api/products/{} - Deleting product", productId);

        try {
            productService.deleteProduct(productId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting product ID: {}", productId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}

