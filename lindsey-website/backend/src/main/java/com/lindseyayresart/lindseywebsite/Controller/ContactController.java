package com.lindseyayresart.lindseywebsite.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lindseyayresart.lindseywebsite.Model.DTO.ContactRequest;
import com.lindseyayresart.lindseywebsite.Model.DTO.InquiryRequest;
import com.lindseyayresart.lindseywebsite.Services.EmailService;

import jakarta.validation.Valid;

/**
 * REST Controller for contact-related endpoints.
 *
 * Endpoints:
 * - POST /api/contact - General contact form
 * - POST /api/inquiry - Artwork inquiry form
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "${ALLOWED_ORIGINS:}"})
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    private final EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * POST /api/contact
     * Submit general contact form
     */
    @PostMapping("/contact")
    public ResponseEntity<String> submitContact(@Valid @RequestBody ContactRequest request) {
        logger.info("POST /api/contact - Contact form submission from: {}", request.email());

        try {
            emailService.sendContactEmail(
                request.name(),
                request.email(),
                request.subject(),
                request.message()
            );

            logger.info("Contact email sent successfully for: {}", request.email());
            return ResponseEntity.ok("Message sent successfully");

        } catch (Exception e) {
            logger.error("Failed to send contact email for: {}", request.email(), e);
            return ResponseEntity.internalServerError()
                .body("Failed to send message. Please try again later.");
        }
    }

    /**
     * POST /api/inquiry
     * Submit artwork inquiry form
     */
    @PostMapping("/inquiry")
    public ResponseEntity<String> submitInquiry(@Valid @RequestBody InquiryRequest request) {
        logger.info("POST /api/inquiry - Inquiry for artwork: {} from: {}",
                   request.artworkTitle(), request.email());

        try {
            emailService.sendInquiryEmail(
                request.artworkId(),
                request.artworkTitle(),
                request.artworkDimensions(),
                request.name(),
                request.email(),
                request.message()
            );

            logger.info("Inquiry email sent successfully for artwork: {} from: {}",
                       request.artworkTitle(), request.email());
            return ResponseEntity.ok("Inquiry sent successfully");

        } catch (Exception e) {
            logger.error("Failed to send inquiry email for artwork: {} from: {}",
                        request.artworkTitle(), request.email(), e);
            return ResponseEntity.internalServerError()
                .body("Failed to send inquiry. Please try again later.");
        }
    }
}
