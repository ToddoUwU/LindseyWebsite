package com.lindseyayresart.lindseywebsite.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ARTWORKS")
public class Artwork {
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
    
    @Column(name = "large_image_url")
    private String largeImageUrl;
    
    @Column(name = "link_to_print")
    private String linkToPrint;
    
    @Column(name = "date_produced")
    private LocalDate dateProduced;
    
    @Column(name = "original_price")
    private BigDecimal originalPrice;
    
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
    
    // Hash value used for Redis cache invalidation verification
    @Column(name = "content_hash")
    private String contentHash;
}