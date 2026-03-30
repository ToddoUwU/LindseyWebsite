package com.lindseyayresart.lindseywebsite.Services;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.Map;

/**
 * Encodes static rate tables from artelloestimate.js.
 * Note: These rates are derived from scraped JavaScript source.
 * Source Date: March 29, 2026. Manual update required if Artello pricing changes.
 */
@Component
class ShippingRateCalculator {

    private static final MathContext ROUND_UP_CONTEXT = new MathContext(0, RoundingMode.CEILING);

    private static final Map<String, Map<String, BigDecimal>> FRAMED_RATES = Map.of(
            "Standard", Map.of(
                    "x8x10", new BigDecimal("12.50"),
                    "x11x14", new BigDecimal("15.75"),
                    "x16x20", new BigDecimal("19.50"),
                    "x20x24", new BigDecimal("24.00"),
                    "x24x36", new BigDecimal("32.50")
            ),
            "Premium", Map.of(
                    "x8x10", new BigDecimal("14.50"),
                    "x11x14", new BigDecimal("18.25"),
                    "x16x20", new BigDecimal("22.50"),
                    "x20x24", new BigDecimal("28.00"),
                    "x24x36", new BigDecimal("38.00")
            )
    );

    /**
     * Rounds the value up to the next whole dollar.
     * Scale is set back to 2 for currency consistency (e.g., 5.00).
     */
    private static BigDecimal doRound(BigDecimal val, MathContext mc) {
        if (val == null) return BigDecimal.ZERO;
        // round() handles the CEILING logic based on MathContext
        return val.round(mc).setScale(2, RoundingMode.UNNECESSARY);
    }

    /**
     * Calculates the shipping estimate based on Artello's logic.
     * Rounds up to the nearest dollar using MathContext.
     */
    public BigDecimal calculateShippingEstimate(String size, String frameStyle, boolean isFramed) {
        BigDecimal baseRate;

        if (!isFramed || "Unframed".equalsIgnoreCase(frameStyle)) {
            baseRate = calculateUnframedRate(size);
        } else {
            baseRate = calculateFramedRate(size, frameStyle);
        }

        return doRound(baseRate, ROUND_UP_CONTEXT);
    }

    private BigDecimal calculateUnframedRate(String size) {
        int smallestDimension = getSmallestDimension(size);

        if (smallestDimension >= 24) {
            return new BigDecimal("8.10");
        } else if (smallestDimension >= 20) {
            return new BigDecimal("7.10");
        } else {
            return new BigDecimal("4.91");
        }
    }

    private BigDecimal calculateFramedRate(String size, String frameStyle) {
        String physicalType = frameStyle.startsWith("Premium") ? "Premium" : "Standard";

        return FRAMED_RATES.getOrDefault(physicalType, Map.of())
                .getOrDefault(size, new BigDecimal("25.00"));
    }

    private int getSmallestDimension(String size) {
        try {
            String cleanSize = size.startsWith("x") ? size.substring(1) : size;
            String[] parts = cleanSize.split("x");
            return Math.min(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]));
        } catch (Exception e) {
            return 0;
        }
    }
}