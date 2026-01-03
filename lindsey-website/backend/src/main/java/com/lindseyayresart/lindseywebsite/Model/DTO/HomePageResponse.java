package com.lindseyayresart.lindseywebsite.Model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

/**
 * DTO for the home page response containing featured artworks and filter options
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomePageResponse implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * Featured artworks with compressed images
     */
    private List<FeaturedArtworkDTO> featuredArtworks;
    
    /**
     * All unique categories for filtering (sorted alphabetically)
     */
    private Set<String> categories;
    
    /**
     * All unique years when artworks were produced (sorted descending)
     */
    private Set<Integer> years;
    
    /**
     * All unique dimensions/sizes (sorted)
     */
    private Set<String> dimensions;
}

