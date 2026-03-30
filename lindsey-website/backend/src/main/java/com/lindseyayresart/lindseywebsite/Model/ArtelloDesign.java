package com.lindseyayresart.lindseywebsite.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArtelloDesign {
    private Map<String, Object> fitOptions;
    private String imageId;
    private ArtelloDesignOverrides overrides;
    private ArtelloSourceImage sourceImage;

    /**
     * Convenience constructor that builds the nested overrides and sourceImage objects.
     */
    public ArtelloDesign(String imageId, String url, int height, int width, int rotation, int x, int y) {
        this.imageId = imageId;
        this.sourceImage = new ArtelloSourceImage(url);
        this.overrides = new ArtelloDesignOverrides(height, rotation, width, x, y);
        this.fitOptions = Map.of();
    }
}
