package com.lindseyayresart.lindseywebsite.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArtelloOrderItem {
    private String arteloProductId;
    private String orderItemId;
    private ArtelloProductInfo productInfo;
    private int quantity;
    private BigDecimal unitPrice;
}
