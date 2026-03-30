package com.lindseyayresart.lindseywebsite.Model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing an artwork.
 * <p>
 * Caching is handled at the service layer using Spring Cache with Caffeine.
 * This keeps the entity clean and separates caching concerns.
 * <p>
 * An artwork can have many associated products (prints, merchandise, etc.)
 * via the one-to-many relationship with ArtworkProduct.
 */

@Entity
@Table(name = "ARTWORKS")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Artwork implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, unique = true)
    private String title;

    @Column(name = "art_description", columnDefinition = "TEXT")
    private String artDescription;

    @Column(name = "dimensions")
    private String dimensions;

    @Column(name = "small_image_url")
    private String smallImageUrl;

    @Column(name = "small_image_width")
    private Integer smallImageWidth;

    @Column(name = "small_image_height")
    private Integer smallImageHeight;

    @Column(name = "medium_image_url")
    private String mediumImageUrl;

    @Column(name = "medium_image_width")
    private Integer mediumImageWidth;

    @Column(name = "medium_image_height")
    private Integer mediumImageHeight;

    @Column(name = "large_image_url")
    private String largeImageUrl;

    @Column(name = "large_image_width")
    private Integer largeImageWidth;

    @Column(name = "large_image_height")
    private Integer largeImageHeight;

    @Column(name = "link_to_print")
    private String linkToPrint;

    @Column(name = "artello_product_set_id", length = 36)
    private String artelloProductSetId;

    @Column(name = "date_produced")
    private LocalDate dateProduced;

    /**
     * Price of the original artwork (if for sale).
     */
    @Column(name = "original_price")
    private BigDecimal originalPrice;

    /**
     * Whether the original artwork is for sale.
     */
    @Column(name = "for_sale")
    private Boolean forSale;

    @Column(name = "location")
    private String location;

    @Column(name = "medium")
    private String medium;

    @Column(name = "categories", columnDefinition = "TEXT")
    private String categories;

    @Column(name = "is_featured")
    private Boolean isFeatured;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Hash value used for cache invalidation verification
    @Column(name = "content_hash")
    private String contentHash;


    @OneToMany(mappedBy = "artwork", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ArtworkProduct> products = new ArrayList<>();

    /**
     * Helper method to add a product to this artwork.
     */
    public void addProduct(ArtworkProduct product) {
        products.add(product);
        product.setArtwork(this);
    }

    /**
     * Helper method to remove a product from this artwork.
     */
    public void removeProduct(ArtworkProduct product) {
        products.remove(product);
        product.setArtwork(null);
    }

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