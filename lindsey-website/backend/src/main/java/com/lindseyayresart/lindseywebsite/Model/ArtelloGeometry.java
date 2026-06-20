package com.lindseyayresart.lindseywebsite.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtelloGeometry {
    @Column(name = "geo_height", precision = 12, scale = 4)
    private BigDecimal height;

    @Column(name = "geo_width", precision = 12, scale = 4)
    private BigDecimal width;

    @Column(name = "geo_x", precision = 12, scale = 4)
    private BigDecimal x;

    @Column(name = "geo_y", precision = 12, scale = 4)
    private BigDecimal y;

    @Column(name = "geo_rotation")
    private Integer rotation;
}
