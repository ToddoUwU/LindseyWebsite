package com.lindseyayresart.lindseywebsite.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lindseyayresart.lindseywebsite.Model.Artwork;
import com.lindseyayresart.lindseywebsite.Model.ArtworkProduct;
import com.lindseyayresart.lindseywebsite.Repository.ArtworkProductRepository;
import com.lindseyayresart.lindseywebsite.Repository.ArtworkRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service for managing artwork products (prints, merchandise, etc.).
 */
@Service
@Transactional(readOnly = true)
public class ArtworkProductService {

    private static final Logger logger = LoggerFactory.getLogger(ArtworkProductService.class);

    private final ArtworkProductRepository productRepository;
    private final ArtworkRepository artworkRepository;

    public ArtworkProductService(ArtworkProductRepository productRepository, ArtworkRepository artworkRepository) {
        this.productRepository = productRepository;
        this.artworkRepository = artworkRepository;
    }

    // ============================================================
    // Read Operations
    // ============================================================

    /**
     * Get all products for a specific artwork.
     */
    @Cacheable(value = "artworkProducts", key = "#artworkId")
    public List<ArtworkProduct> getProductsByArtworkId(Long artworkId) {
        logger.debug("Fetching products for artwork ID: {}", artworkId);
        return productRepository.findByArtworkIdOrderByDisplayOrderAsc(artworkId);
    }

    /**
     * Get only available products for a specific artwork.
     */
    public List<ArtworkProduct> getAvailableProductsByArtworkId(Long artworkId) {
        logger.debug("Fetching available products for artwork ID: {}", artworkId);
        return productRepository.findByArtworkIdAndIsAvailableTrueOrderByDisplayOrderAsc(artworkId);
    }

    /**
     * Get product by ID.
     */
    public Optional<ArtworkProduct> getProductById(Long id) {
        logger.debug("Fetching product by ID: {}", id);
        return productRepository.findById(id);
    }

    /**
     * Get all products in a specific category.
     */
    public List<ArtworkProduct> getProductsByCategory(String category) {
        logger.debug("Fetching products in category: {}", category);
        return productRepository.findByProductCategoryIgnoreCaseAndIsAvailableTrueOrderByArtworkTitleAsc(category);
    }

    /**
     * Get all unique product categories.
     */
    @Cacheable(value = "productCategories")
    public Set<String> getAllProductCategories() {
        logger.debug("Fetching all product categories");
        return productRepository.findAllProductCategories();
    }

    /**
     * Check if an artwork has any available products.
     */
    public boolean hasAvailableProducts(Long artworkId) {
        return productRepository.existsByArtworkIdAndIsAvailableTrue(artworkId);
    }

    /**
     * Count available products for an artwork.
     */
    public long countAvailableProducts(Long artworkId) {
        return productRepository.countByArtworkIdAndIsAvailableTrue(artworkId);
    }

    // ============================================================
    // Write Operations
    // ============================================================

    /**
     * Add a new product to an artwork.
     */
    @Transactional
    @CacheEvict(value = "artworkProducts", key = "#artworkId")
    public ArtworkProduct addProduct(Long artworkId, ArtworkProduct product) {
        logger.info("Adding product '{}' to artwork ID: {}", product.getDescription(), artworkId);
        
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new IllegalArgumentException("Artwork not found with ID: " + artworkId));
        
        product.setArtwork(artwork);
        return productRepository.save(product);
    }

    /**
     * Update an existing product.
     */
    @Transactional
    @CacheEvict(value = "artworkProducts", allEntries = true)
    public ArtworkProduct updateProduct(Long productId, ArtworkProduct updatedProduct) {
        logger.info("Updating product ID: {}", productId);
        
        ArtworkProduct existing = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));
        
        existing.setDescription(updatedProduct.getDescription());
        existing.setProductCategory(updatedProduct.getProductCategory());
        existing.setProductUrl(updatedProduct.getProductUrl());
        existing.setPrice(updatedProduct.getPrice());
        existing.setIsAvailable(updatedProduct.getIsAvailable());
        existing.setDisplayOrder(updatedProduct.getDisplayOrder());
        existing.setProductImageUrl(updatedProduct.getProductImageUrl());
        
        return productRepository.save(existing);
    }

    /**
     * Delete a product.
     */
    @Transactional
    @CacheEvict(value = "artworkProducts", allEntries = true)
    public void deleteProduct(Long productId) {
        logger.info("Deleting product ID: {}", productId);
        productRepository.deleteById(productId);
    }

    /**
     * Toggle product availability.
     */
    @Transactional
    @CacheEvict(value = "artworkProducts", allEntries = true)
    public ArtworkProduct toggleAvailability(Long productId) {
        logger.info("Toggling availability for product ID: {}", productId);
        
        ArtworkProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));
        
        product.setIsAvailable(!product.getIsAvailable());
        return productRepository.save(product);
    }
}

