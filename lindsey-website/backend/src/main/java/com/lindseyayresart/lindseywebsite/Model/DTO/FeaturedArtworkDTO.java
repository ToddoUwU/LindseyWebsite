package com.lindseyayresart.lindseywebsite.Model.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for featured artwork with compressed image
 * This is sent on initial page load to minimize bandwidth
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeaturedArtworkDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private String title;
    private String artDescription;
    private String dimensions;
    
    /**
     * Small/compressed image URL for initial display
     */
    private String compressedImageUrl;
    
    /**
     * Full resolution image URL - only sent when user selects the artwork
     */
    private String fullImageUrl;
    
    private String linkToPrint;
    private LocalDate dateProduced;
    private BigDecimal originalPrice;
    private Boolean forSale;
    private String location;
    private String medium;
    
    /**
     * Categories as comma-delimited string (no spaces): "Acrylic,Painting,Nature"
     */
    private String categories;
    
    private Boolean isFeatured;
}

