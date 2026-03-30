package com.lindseyayresart.lindseywebsite.Services;


import com.lindseyayresart.lindseywebsite.Config.SquareConfig;
import com.squareup.square.SquareClient;
import com.squareup.square.types.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class SquarePaymentService {
    private final SquareClient squareClient;
    private final SquareConfig squareConfig;

    /**
     * Processes a payment using a nonce (sourceId) from the frontend.
     */
    public Optional<Payment> createPayment(String nonce, BigDecimal amount, String currency,
                                           String buyerEmail, String orderReference) {

        // Square amounts are in the smallest unit (cents for USD)
        long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

        Money bodyAmountMoney = Money.builder()
                .amount(amountInCents)
                .currency(Currency.valueOf(currency))
                .build();

        CreatePaymentRequest body = CreatePaymentRequest.builder()
                .sourceId(nonce)
                .idempotencyKey(UUID.randomUUID().toString())
                .amountMoney(bodyAmountMoney)
                .locationId(squareConfig.getLocationId())
                .buyerEmailAddress(buyerEmail)
                .referenceId(orderReference) // Links the Square transaction back to your DB ref
                .note("Art Print Order: " + orderReference)
                .build();

        try {
            CreatePaymentResponse response = squareClient.payments().create(body);

            if (response.getErrors().isPresent()) {
                String errorMsg = String.valueOf(response.getErrors().get().getFirst().getDetail());
                log.error("Square Payment Error: {}", errorMsg);
                return Optional.empty();
            }

            return response.getPayment();
        } catch (Exception e) {
            log.error("Critical failure communicating with Square for order {}", orderReference, e);
            throw new RuntimeException("Could not process payment with Square.");
        }
    }

    /**
     * Retrieves buyer email on-demand from Square.
     * Supports the 'Zero PII' local storage strategy.
     */
    public Optional<String> getBuyerEmail(String paymentId) {
        try {
            V1RetrieveOrderRequest orderRequest = V1RetrieveOrderRequest.builder().locationId(squareConfig.getLocationId()).orderId(paymentId).build();
            V1Order clientOrder = squareClient.v1Transactions().v1RetrieveOrder(orderRequest);
            return clientOrder.getBuyerEmail();
        } catch (Exception e) {
            log.error("Failed to retrieve buyer email for payment {}", paymentId, e);
            return null;
        }
    }

    /**
     * Refunds a payment. Useful for manual intervention or cancellations.
     */
    public String refundPayment(String paymentId, BigDecimal amount, String reason) {
        long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

        Money amountMoney = Money.builder()
                .amount(amountInCents)
                .currency(Currency.valueOf("USD"))
                .build();

        RefundPaymentRequest body = RefundPaymentRequest.builder()
                .idempotencyKey(UUID.randomUUID().toString())
                .amountMoney(amountMoney)
                .paymentId(paymentId)
                .reason(reason)
                .build();

        try {
            RefundPaymentResponse response = squareClient.refunds().refundPayment(body);
            return response.getRefund().toString();
        } catch (Exception e) {
            log.error("Refund failed for payment {}", paymentId, e);
            throw new RuntimeException("Refund failed: " + e.getMessage());
        }
    }
}
