package com.lindseyayresart.lindseywebsite.Model;

import com.lindseyayresart.lindseywebsite.Interfaces.ArtelloPrintConfiguration;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtelloProductInfo implements ArtelloPrintConfiguration {
    private String catalogProductId;
    private String frameColor;
    private String frameStyle;
    private String id;
    private boolean includeFramingService;
    private boolean includeHangingPins;
    private boolean includeMats;
    private String orientation;
    private String paperStyle;
    private String paperType;
    private String size;
    private List<ArtelloDesign> designs;
    private BigDecimal unitCost;

    public boolean isFramed() {
        return includeFramingService;
    }

    public boolean hasHangingPins() {
        return includeHangingPins;
    }

    public boolean hasMats() {
        return includeMats;
    }
}
