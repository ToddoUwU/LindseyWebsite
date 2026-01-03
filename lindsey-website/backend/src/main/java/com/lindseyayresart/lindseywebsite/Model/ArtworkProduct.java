package com.lindseyayresart.lindseywebsite.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing a product associated with an artwork.
 * 
 * Products can be:
 * - Prints (various sizes)
 * - Merchandise (mugs, shirts, etc. via Printify)
 * - Original artwork for sale
 * 
 * One artwork can have many products (one-to-many relationship).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ARTWORK_PRODUCTS")
public class ArtworkProduct implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The artwork this product is associated with.
     * Many products can belong to one artwork.
     * JsonIgnore prevents circular reference issues during JSON serialization.
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id", nullable = false)
    private Artwork artwork;

    /**
     * Product description (required).
     * E.g., "8x10 Print", "Canvas Print 16x20", "Coffee Mug", "T-Shirt"
     */
    @Column(name = "description", nullable = false)
    private String description;

    /**
     * Product category (required).
     * E.g., "Print", "Canvas", "Mug", "Apparel", "Home Decor", "Original"
     */
    @Column(name = "product_category", nullable = false)
    private String productCategory;

    /**
     * URL to purchase the product (required).
     * Links to Printify, Etsy, or other storefront.
     */
    @Column(name = "product_url", nullable = false)
    private String productUrl;

    /**
     * Price of the product (optional - may be dynamic on external site).
     */
    @Column(name = "price")
    private BigDecimal price;

    /**
     * Whether this product is currently available for purchase.
     */
    @Column(name = "is_available")
    private Boolean isAvailable = true;

    /**
     * Display order for sorting products.
     * Lower numbers appear first.
     */
    @Column(name = "display_order")
    private Integer displayOrder = 0;

    /**
     * Optional image URL for the product (if different from artwork).
     * Useful for showing mockups of mugs, shirts, etc.
     */
    @Column(name = "product_image_url")
    private String productImageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

