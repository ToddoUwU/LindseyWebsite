package com.lindseyayresart.lindseywebsite.Model.DTO;

/**
 * Using Records for DTOs: Immutable, clean, and perfect for Request/Response bodies.
 */
public record CheckoutRequest(
        Long printVariantId,
        Integer quantity,
        String squareNonce,
        String customerName,
        String customerEmail,
        String addressLine1,
        String addressLine2,
        String city,
        String state,
        String zipCode,
        String shippingCountry // "US"/"CA"
) {}