package com.lindseyayresart.lindseywebsite.Model.DTO;

import java.math.BigDecimal;

public record OrderConfirmation(
        String orderReference,
        String artworkTitle,
        String variantDescription,
        BigDecimal totalAmount,
        String status
) {
}