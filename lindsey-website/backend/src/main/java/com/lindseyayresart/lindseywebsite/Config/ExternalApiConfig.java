package com.lindseyayresart.lindseywebsite.Config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for external API integrations.
 * 
 * API keys and secrets are loaded from environment variables for security.
 * Never commit actual API keys to version control.
 */
@Setter
@Configuration
@ConfigurationProperties(prefix = "external.api")
public class ExternalApiConfig {

    // Getters and setters
    // Lumaprints API Configuration
    @Getter
    private String lumaprintsApiKey;
    @Getter
    private String lumaprintsApiSecret;
    private String lumaprintsBaseUrl = "https://api.lumaprints.com"; // Production URL
    @Getter
    private String lumaprintsSandboxUrl = "https://sandbox-api.lumaprints.com"; // Sandbox URL

    // Artello API Configuration
    @Getter
    private String artelloApiKey;
    @Getter
    private String artelloBaseUrl = "https://www.artelo.io/api";

    // Environment flag to use sandbox vs production
    @Getter
    private boolean useSandbox = false;

    public String getLumaprintsBaseUrl() {
        return useSandbox ? lumaprintsSandboxUrl : lumaprintsBaseUrl;
    }

    /**
     * Generate Basic Auth header for Lumaprints API.
     * Format: "Basic " + Base64(apiKey:apiSecret)
     */
    public String getLumaprintsBasicAuth() {
        if (lumaprintsApiKey == null || lumaprintsApiSecret == null) {
            throw new IllegalStateException("Lumaprints API key and secret must be configured");
        }
        String credentials = lumaprintsApiKey + ":" + lumaprintsApiSecret;
        return "Basic " + java.util.Base64.getEncoder().encodeToString(credentials.getBytes());
    }

    /**
     * Get Bearer token header for Artello API.
     */
    public String getArtelloBearerAuth() {
        if (artelloApiKey == null) {
            throw new IllegalStateException("Artello API key must be configured");
        }
        return "Bearer " + artelloApiKey;
    }
}
