package com.lindseyayresart.lindseywebsite.Events;

/**
 * Published after an Artello "Shipped" webhook is persisted.
 * <p>
 * Note there is NO customer email here — we never stored it. The listener re-fetches it
 * transiently from Square using {@link #squarePaymentId()} at send time, then lets it fall
 * out of scope. See ARTELLO_INTEGRATION.md / CUSTOMER_PRIVACY.md.
 */
public record OrderShippedEvent(
        String orderRef,
        String squarePaymentId,
        String artworkTitle,
        String trackingNumber,
        String trackingUrl,
        String carrier
) {
}
