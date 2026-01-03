package com.lindseyayresart.lindseywebsite.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

/**
 * Service for sending emails with input sanitization
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
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
