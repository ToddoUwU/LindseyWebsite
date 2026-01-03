package com.lindseyayresart.lindseywebsite.Model.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for artwork inquiry form submissions
 */
public record InquiryRequest(
    @NotNull(message = "Artwork ID is required")
    Long artworkId,

    @NotBlank(message = "Artwork title is required")
    @Size(max = 200, message = "Artwork title must be less than 200 characters")
    String artworkTitle,

    @Size(max = 100, message = "Artwork dimensions must be less than 100 characters")
    String artworkDimensions,

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 254, message = "Email must be less than 254 characters")
    String email,

    @Size(max = 5000, message = "Message must be less than 5000 characters")
    String message
) {}
