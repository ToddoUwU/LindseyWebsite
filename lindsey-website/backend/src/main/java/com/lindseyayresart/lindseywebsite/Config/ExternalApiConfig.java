package com.lindseyayresart.lindseywebsite.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for external API integrations.
 * 
 * API keys and secrets are loaded from environment variables for security.
 * Never commit actual API keys to version control.
 */
@Configuration
@ConfigurationProperties(prefix = "external.api")
public class ExternalApiConfig {

    // Lumaprints API Configuration
    private String lumaprintsApiKey;
    private String lumaprintsApiSecret;
    private String lumaprintsBaseUrl = "https://api.lumaprints.com"; // Production URL
    private String lumaprintsSandboxUrl = "https://sandbox-api.lumaprints.com"; // Sandbox URL

    // Artello API Configuration
    private String artelloApiKey;
    private String artelloBaseUrl = "https://www.artelo.io/api";

    // Environment flag to use sandbox vs production
    private boolean useSandbox = false;

    // Getters and setters
    public String getLumaprintsApiKey() {
        return lumaprintsApiKey;
    }

    public void setLumaprintsApiKey(String lumaprintsApiKey) {
        this.lumaprintsApiKey = lumaprintsApiKey;
    }

    public String getLumaprintsApiSecret() {
        return lumaprintsApiSecret;
    }

    public void setLumaprintsApiSecret(String lumaprintsApiSecret) {
        this.lumaprintsApiSecret = lumaprintsApiSecret;
    }

    public String getLumaprintsBaseUrl() {
        return useSandbox ? lumaprintsSandboxUrl : lumaprintsBaseUrl;
    }

    public void setLumaprintsBaseUrl(String lumaprintsBaseUrl) {
        this.lumaprintsBaseUrl = lumaprintsBaseUrl;
    }

    public String getLumaprintsSandboxUrl() {
        return lumaprintsSandboxUrl;
    }

    public void setLumaprintsSandboxUrl(String lumaprintsSandboxUrl) {
        this.lumaprintsSandboxUrl = lumaprintsSandboxUrl;
    }

    public String getArtelloApiKey() {
        return artelloApiKey;
    }

    public void setArtelloApiKey(String artelloApiKey) {
        this.artelloApiKey = artelloApiKey;
    }

    public String getArtelloBaseUrl() {
        return artelloBaseUrl;
    }

    public void setArtelloBaseUrl(String artelloBaseUrl) {
        this.artelloBaseUrl = artelloBaseUrl;
    }

    public boolean isUseSandbox() {
        return useSandbox;
    }

    public void setUseSandbox(boolean useSandbox) {
        this.useSandbox = useSandbox;
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
