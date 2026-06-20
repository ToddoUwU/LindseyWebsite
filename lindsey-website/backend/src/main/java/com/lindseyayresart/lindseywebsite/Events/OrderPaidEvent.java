package com.lindseyayresart.lindseywebsite.Events;

import java.math.BigDecimal;

/**
 * Published after a checkout's DB transaction commits (status PAID/SUBMITTED).
 * <p>
 * Carries only the primitives the confirmation email needs — never an entity — because the
 * listener runs AFTER_COMMIT (and on another thread via {@code @Async}), outside the original
 * persistence session. The customer email lives only inside this event for the life of the
 * send; it is never written to our database.
 */
public record OrderPaidEvent(
        String orderRef,
        String customerEmail,
        String customerName,
        String artworkTitle,
        String itemDescription,
        BigDecimal total
) {
}
