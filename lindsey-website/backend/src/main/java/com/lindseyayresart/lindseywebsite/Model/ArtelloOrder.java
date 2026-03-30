package com.lindseyayresart.lindseywebsite.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArtelloOrder {
    private String channelName;
    private String companyName;
    private ArtelloBranding branding;
    private Instant createdAt;
    private String currency;
    private ArtelloCustomerAddress customerAddress;
    private List<ArtelloOrderItem> items;
    private String orderId;
    @JsonProperty("isTestOrder")
    private boolean isTestOrder;
    private BigDecimal total;
}
