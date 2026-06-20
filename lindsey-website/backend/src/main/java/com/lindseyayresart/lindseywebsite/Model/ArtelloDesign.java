package com.lindseyayresart.lindseywebsite.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

/**
 * A single design as returned by Artello inside a product option's designs[] array.
 * <p>
 * NOTE: this is the shape Artello SENDS (flat geometry, image with preview URLs).
 * It is NOT the shape Artello expects for /orders/create (nested sourceImage/overrides) —
 * order creation uses a separate request DTO that re-nests these values.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArtelloDesign {
    private String id;
    private ArtelloImage image;

    // Flat geometry mapping (Artello sends these on the design itself, not nested)
    private BigDecimal height;
    private BigDecimal width;
    private BigDecimal x;
    private BigDecimal y;
    private Integer rotation;
    private Integer order;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ArtelloImage {
        private String url;
        // Preview values are plain URL strings keyed by size: "lg", "sm", "xs"
        private Map<String, String> previews;
    }
}
