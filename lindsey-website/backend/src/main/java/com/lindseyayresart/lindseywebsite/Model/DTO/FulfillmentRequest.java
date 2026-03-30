package com.lindseyayresart.lindseywebsite.Model.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FulfillmentRequest {
    private String variantId;
    private Integer quantity;
    private String customerName;
    private String email;
    private String orderReference;

    // Shipping Address
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String zipCode;
    private String country;
}