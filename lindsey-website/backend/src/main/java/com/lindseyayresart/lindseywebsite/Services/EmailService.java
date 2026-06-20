package com.lindseyayresart.lindseywebsite.Services;

import com.lindseyayresart.lindseywebsite.Events.OrderPaidEvent;
import com.lindseyayresart.lindseywebsite.Events.OrderShippedEvent;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.util.HtmlUtils;

import java.util.Optional;

/**
 * Service for sending emails with input sanitization
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final SquarePaymentService squarePaymentService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Order-email relay: send AS orders@, replies go to Lindsey's personal inbox.
    @Value("${app.mail.orders-from}")
    private String ordersFrom;
    @Value("${app.mail.orders-from-name}")
    private String ordersFromName;
    @Value("${app.mail.reply-to}")
    private String replyTo;

    public EmailService(JavaMailSender mailSender, SquarePaymentService squarePaymentService) {
        this.mailSender = mailSender;
        this.squarePaymentService = squarePaymentService;
    }

    // ============================================================
    // Order lifecycle emails (event-driven, decoupled from checkout)
    // ============================================================

    /**
     * Order confirmation. Fires only AFTER the checkout transaction commits, on a background
     * thread, so a slow/failing SMTP server can never delay the customer's success screen or
     * roll back a paid order. The customer email arrives inside the event and is never stored.
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderPaid(OrderPaidEvent event) {
        String body = buildOrderConfirmationBody(event);
        sendOrderEmail(event.customerEmail(), "Thank you for your order 🎨", body);
    }

    /**
     * Shipping notification, triggered by Artello's "Shipped" webhook.
     * <p>
     * We never stored the customer's email, so we re-fetch it transiently from Square
     * (the verified retainer of buyer email) for the single moment we need it, then let it
     * fall out of scope.
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderShipped(OrderShippedEvent event) {
        Optional<String> customerEmail = squarePaymentService.getBuyerEmail(event.squarePaymentId());
        if (customerEmail == null || customerEmail.isEmpty()) {
            // Don't fail the order — just log so it can be followed up manually.
            logger.error("Could not resolve buyer email for shipped order {}; tracking email skipped",
                    event.orderRef());
            return;
        }
        String body = buildShippedBody(event);
        sendOrderEmail(customerEmail.get(), "Your artwork is on its way 🎨", body);
    }

    /**
     * Sends an order email through the relay: From = orders@ (branded), Reply-To = Lindsey's
     * inbox. Runs in an async listener, so failures are logged rather than propagated — a mail
     * hiccup must never affect the order record. The recipient address is never logged.
     */
    private void sendOrderEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setFrom(ordersFrom, ordersFromName);
            helper.setReplyTo(replyTo);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            logger.info("Order email sent (subject='{}')", subject);
        } catch (Exception e) {
            logger.error("Failed to send order email (subject='{}')", subject, e);
        }
    }

    private String buildOrderConfirmationBody(OrderPaidEvent event) {
        String name = sanitizeInput(event.customerName());
        String title = sanitizeInput(event.artworkTitle());
        String item = sanitizeInput(event.itemDescription());
        String total = event.total() != null ? event.total().toPlainString() : "";
        return """
                <p>Hi %s,</p>
                <p>Thank you so much for your order &mdash; it genuinely means the world to me that
                you've chosen to bring my work into your home. 🎨</p>
                <p><strong>Order %s</strong><br/>
                %s &mdash; %s<br/>
                Total: $%s</p>
                <p>Your print is being made to order. I'll send another note with tracking the moment
                it ships. If you have any questions &mdash; or just want to say hi &mdash; simply hit
                reply; it comes straight to me.</p>
                <p>With gratitude,<br/>Lindsey</p>
                """.formatted(name, sanitizeInput(event.orderRef()), title, item, sanitizeInput(total));
    }

    private String buildShippedBody(OrderShippedEvent event) {
        String title = sanitizeInput(event.artworkTitle());
        String carrier = sanitizeInput(event.carrier());
        String tracking = sanitizeInput(event.trackingNumber());

        StringBuilder shipLine = new StringBuilder();
        if (!carrier.isEmpty()) {
            shipLine.append("Carrier: ").append(carrier).append("<br/>");
        }
        if (!tracking.isEmpty()) {
            shipLine.append("Tracking: ").append(tracking).append("<br/>");
        }
        if (event.trackingUrl() != null && !event.trackingUrl().isBlank()) {
            String url = sanitizeInput(event.trackingUrl());
            shipLine.append("<a href=\"").append(url).append("\">Track your package</a><br/>");
        }

        return """
                <p>Hi there,</p>
                <p>Wonderful news &mdash; <strong>%s</strong> is on its way to you! 🎨</p>
                <p><strong>Order %s</strong><br/>
                %s</p>
                <p>I hope it brings you joy when it arrives. If anything isn't perfect, just hit reply
                and you'll reach me directly.</p>
                <p>Warmly,<br/>Lindsey</p>
                """.formatted(title, sanitizeInput(event.orderRef()), shipLine.toString());
    }

    /**
     * Send general contact email (to artist and confirmation to user)
     */
    public void sendContactEmail(String name, String email, String subject, String message) {
        String sanitizedName = sanitizeInput(name);
        String sanitizedEmail = sanitizeInput(email);
        String sanitizedSubject = sanitizeInput(subject);
        String sanitizedMessage = sanitizeInput(message);

        // Send contact to artist
        String fullSubject = "Contact Form: " + sanitizedSubject;
        String emailBody = buildContactEmailBody(sanitizedName, sanitizedEmail, sanitizedMessage);
        sendEmail("lindseyayres@yahoo.com", fullSubject, emailBody, sanitizedEmail);

        // Send confirmation to user
        String confirmationSubject = "Thank you for contacting us";
        String confirmationBody = buildContactConfirmationEmailBody(sanitizedName);
        sendEmail(sanitizedEmail, confirmationSubject, confirmationBody, "lindseyayres@yahoo.com");
    }

    /**
     * Send artwork inquiry email (to artist and confirmation to user)
     */
    public void sendInquiryEmail(Long artworkId, String artworkTitle, String artworkDimensions,
                                 String name, String email, String message) {
        String sanitizedName = sanitizeInput(name);
        String sanitizedEmail = sanitizeInput(email);
        String sanitizedArtworkTitle = sanitizeInput(artworkTitle);
        String sanitizedArtworkDimensions = sanitizeInput(artworkDimensions != null ? artworkDimensions : "");
        String sanitizedMessage = sanitizeInput(message != null ? message : "");

        // Send inquiry to artist
        String inquirySubject = "ORIGINAL ARTWORK INQUIRY: " + sanitizedArtworkTitle;
        String inquiryBody = buildInquiryEmailBody(artworkId, sanitizedArtworkTitle, sanitizedArtworkDimensions,
                sanitizedName, sanitizedEmail, sanitizedMessage);
        sendEmail("lindseyayres@yahoo.com", inquirySubject, inquiryBody, sanitizedEmail);

        // Send confirmation to user
        String confirmationSubject = "Thank you for your inquiry about " + sanitizedArtworkTitle;
        String confirmationBody = buildConfirmationEmailBody(sanitizedName, sanitizedArtworkTitle);
        sendEmail(sanitizedEmail, confirmationSubject, confirmationBody, "lindseyayres@yahoo.com");
    }

    /**
     * Send email with reply-to set to user's email
     */
    private void sendEmail(String to, String subject, String body, String replyTo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setReplyTo(replyTo);

            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (MailException e) {
            logger.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Sanitize user input by escaping HTML characters
     */
    private String sanitizeInput(String input) {
        if (input == null) {
            return "";
        }
        return HtmlUtils.htmlEscape(input.trim());
    }

    /**
     * Build email body for contact form
     */
    private String buildContactEmailBody(String name, String email, String message) {
        return String.format(
                "New contact form submission:\n\n" +
                        "Name: %s\n" +
                        "Email: %s\n\n" +
                        "Message:\n%s",
                name, email, message
        );
    }

    /**
     * Build email body for artwork inquiry
     */
    private String buildInquiryEmailBody(Long artworkId, String title, String dimensions,
                                         String name, String email, String message) {
        StringBuilder body = new StringBuilder();
        body.append("ORIGINAL ARTWORK INQUIRY\n\n");
        body.append("Artwork ID: ").append(artworkId).append("\n");
        body.append("Title: ").append(title).append("\n");
        if (!dimensions.isEmpty()) {
            body.append("Dimensions: ").append(dimensions).append("\n");
        }
        body.append("\n");
        body.append("Customer Information:\n");
        body.append("Name: ").append(name).append("\n");
        body.append("Email: ").append(email).append("\n");
        if (!message.isEmpty()) {
            body.append("\nAdditional Message:\n").append(message);
        }
        return body.toString();
    }

    /**
     * Build email body for inquiry confirmation
     */
    private String buildConfirmationEmailBody(String name, String artworkTitle) {
        return String.format(
                "Dear %s,\n\n" +
                        "Thank you for your inquiry about the artwork '%s'. " +
                        "We appreciate your interest and will get back to you soon.\n\n" +
                        "Best regards,\n" +
                        "Lindsey Ayres Art",
                name, artworkTitle
        );
    }

    /**
     * Build email body for contact confirmation
     */
    private String buildContactConfirmationEmailBody(String name) {
        return String.format(
                "Dear %s,\n\n" +
                        "Thank you for reaching out to us. " +
                        "We have received your message and will get back to you shortly.\n\n" +
                        "Best regards,\n" +
                        "Lindsey Ayres Art",
                name
        );
    }
}
