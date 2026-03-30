package com.lindseyayresart.lindseywebsite.Model.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArtelloOrderResponse {
    private String artelloOrderId;
    private String status;
    private String trackingNumber;
    private String trackingUrl;
    private String carrier;
}
