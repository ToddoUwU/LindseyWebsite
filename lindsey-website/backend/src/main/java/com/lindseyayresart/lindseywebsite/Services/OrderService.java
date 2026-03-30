package com.lindseyayresart.lindseywebsite.Services;

import com.lindseyayresart.lindseywebsite.Enums.OrderStatus;
import com.lindseyayresart.lindseywebsite.Model.ArtelloPrintVariant;
import com.lindseyayresart.lindseywebsite.Model.DTO.*;
import com.lindseyayresart.lindseywebsite.Model.PrintOrder;
import com.lindseyayresart.lindseywebsite.Repository.ArtelloPrintVariantRepository;
import com.lindseyayresart.lindseywebsite.Repository.PrintOrderRepository;
import com.squareup.square.types.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {

    // Simple in-memory counter for the NNNN part of the reference (resetting daily logic would go here)
    private static final AtomicLong sequence = new AtomicLong(1);
    private final PrintOrderRepository orderRepository;
    private final ArtelloPrintVariantRepository variantRepository;
    private final SquarePaymentService squareService; // Hypothetical Square wrapper
    private final ArtelloService artelloService;

    @Transactional
    public OrderConfirmation processCheckout(CheckoutRequest request) {
        // 1. Validate variant
        ArtelloPrintVariant variant = variantRepository.findById(request.printVariantId())
                .filter(ArtelloPrintVariant::getIsAvailable)
                .orElseThrow(() -> new RuntimeException("Variant unavailable or not found"));

        // 2. Generate Order Reference: LAA-YYYYMMDD-NNNN
        String orderRef = generateOrderReference();

        // 3. Create PENDING order in DB first so we have a record before hitting Square
        PrintOrder order = PrintOrder.builder()
                .orderReference(orderRef)
                .artwork(variant.getArtwork())
                .printVariant(variant)
                .quantity(request.quantity())
                .totalAmount(variant.getRetailPrice().multiply(BigDecimal.valueOf(request.quantity())))
                .status(OrderStatus.PENDING)
                .build();

        order = orderRepository.save(order);

        // 4. Square Payment Attempt
        Optional<Payment> paymentOptional = squareService.createPayment(
                request.squareNonce(),
                order.getTotalAmount(),
                "USD",
                request.customerEmail(),
                orderRef);

        // If payment fails or ID is missing, cancel and exit early
        if (paymentOptional.isEmpty() || paymentOptional.get().getId().isEmpty()) {
            order.setStatus(OrderStatus.CANCELLED);
            order.setErrorMessage("Square payment was not authorized or connection failed.");
            orderRepository.save(order);
            throw new RuntimeException("Payment processing failed. Please try again.");
        }

        // 5. Success Path: Update to PAID
        Payment payment = paymentOptional.get();
        order.setSquarePaymentId(payment.getId().get());
        order.setStatus(OrderStatus.PAID);
        order = orderRepository.save(order); // Explicit save to commit the PAID state

        // 6. Artello Fulfillment (Only happens if PAID)
        try {
            FulfillmentRequest fulfillment = mapToFulfillment(request, order);
            ArtelloOrderResponse response = artelloService.createOrder(fulfillment);

            order.setArtelloOrderId(response.getArtelloOrderId());
            order.setStatus(OrderStatus.SUBMITTED);
            orderRepository.save(order);
        } catch (Exception e) {
            // Critical: Payment is taken, but Artello failed.
            // We log it and leave it as PAID for manual review.
            log.error("CRITICAL: Payment succeeded but fulfillment failed for {}. Manual intervention required.", orderRef, e);
            order.setErrorMessage("Fulfillment submission failed: " + e.getMessage());
            orderRepository.save(order);
        }

        // 7. Return Confirmation (Whether SUBMITTED or stayed PAID due to Artello error)
        return new OrderConfirmation(
                order.getOrderReference(),
                variant.getArtwork().getTitle(),
                variant.getSize() + " " + variant.getFrameStyle(),
                order.getTotalAmount(),
                order.getStatus().name()
        );
    }

    @Transactional
    public void handleArtelloStatusChange(ArtelloWebhookPayload payload) {
        PrintOrder order = orderRepository.findByArtelloOrderId(payload.getArtelloOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found for Artello ID: " + payload.getArtelloOrderId()));

        String status = payload.getStatus().toUpperCase();

        if ("SHIPPED".equals(status)) {
            order.setStatus(OrderStatus.SHIPPED);
            order.setTrackingNumber(payload.getTrackingNumber());
            order.setTrackingUrl(payload.getTrackingUrl());
            order.setShippingCarrier(payload.getCarrier());
            // TODO: Trigger EmailService.sendTrackingEmail(order.getSquarePaymentId());
            log.info("Order {} marked as SHIPPED.", order.getOrderReference());
        } else if ("CANCELLED".equals(status)) {
            order.setStatus(OrderStatus.CANCELLED);
            log.warn("Order {} was CANCELLED by Artello vendor.", order.getOrderReference());
        }

        orderRepository.save(order);
    }

    private String generateOrderReference() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return String.format("LAA-%s-%04d", datePart, sequence.getAndIncrement());
    }

    private FulfillmentRequest mapToFulfillment(CheckoutRequest req, PrintOrder order) {
        return FulfillmentRequest.builder()
                .variantId(order.getPrintVariant().getArtelloVariantId())
                .quantity(order.getQuantity())
                .customerName(req.customerName())
                .email(req.customerEmail())
                .orderReference(order.getOrderReference())
                .addressLine1(req.addressLine1())
                .addressLine2(req.addressLine2())
                .city(req.city())
                .state(req.state())
                .zipCode(req.zipCode())
                .country(req.shippingCountry())
                .build();
    }
}