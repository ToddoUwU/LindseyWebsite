package com.lindseyayresart.lindseywebsite.Model.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FulfillmentStatus {
    private String providerOrderId;
    private String status;
    private String trackingNumber;
    private String trackingUrl;
    private String carrier;
}