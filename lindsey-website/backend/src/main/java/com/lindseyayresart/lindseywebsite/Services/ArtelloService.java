package com.lindseyayresart.lindseywebsite.Services;

import com.lindseyayresart.lindseywebsite.Config.ExternalApiConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Service for integrating with Artello API.
 *
 * Artello provides art marketplace and gallery services.
 * API Documentation: https://www.artelo.io/api
 */
@Service
public class ArtelloService {

    private static final Logger logger = LoggerFactory.getLogger(ArtelloService.class);

    private final ExternalApiConfig apiConfig;
    private final RestTemplate restTemplate;

    public ArtelloService(ExternalApiConfig apiConfig, RestTemplate restTemplate) {
        this.apiConfig = apiConfig;
        this.restTemplate = restTemplate;
    }

    /**
     * Test authentication with Artello API.
     *
     * @return true if authentication successful
     */
    public boolean testAuthentication() {
        try {
            String url = apiConfig.getArtelloBaseUrl() + "/open/authentication/check";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getArtelloBearerAuth());

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, String.class);

            boolean success = response.getStatusCode().is2xxSuccessful();
            logger.info("Artello API authentication test: {}", success ? "SUCCESS" : "FAILED");
            return success;

        } catch (Exception e) {
            logger.error("Failed to authenticate with Artello API", e);
            return false;
        }
    }

    /**
     * Get catalog from Artello.
     *
     * @return JSON response from API
     */
    public String getCatalog() {
        try {
            String url = apiConfig.getArtelloBaseUrl() + "/open/catalog/get";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getArtelloBearerAuth());

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully retrieved Artello catalog");
                return response.getBody();
            } else {
                logger.error("Failed to get Artello catalog: {}", response.getStatusCode());
                return null;
            }

        } catch (Exception e) {
            logger.error("Error calling Artello API", e);
            return null;
        }
    }

    /**
     * Submit artwork for listing on Artello marketplace.
     *
     * @param artworkData JSON data about the artwork
     * @return Response from API or null on failure
     */
    public String submitArtwork(String artworkData) {
        try {
            String url = apiConfig.getArtelloBaseUrl() + "/open/artworks/submit";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getArtelloBearerAuth());
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(artworkData, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully submitted artwork to Artello");
                return response.getBody();
            } else {
                logger.error("Failed to submit artwork to Artello: {}", response.getStatusCode());
                return null;
            }

        } catch (Exception e) {
            logger.error("Error submitting artwork to Artello", e);
            return null;
        }
    }

    /**
     * Get sales data from Artello.
     *
     * @param startDate Start date in YYYY-MM-DD format
     * @param endDate End date in YYYY-MM-DD format
     * @return Sales data JSON or null on failure
     */
    public String getSalesData(String startDate, String endDate) {
        try {
            String url = apiConfig.getArtelloBaseUrl() + "/open/sales";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getArtelloBearerAuth());

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Add query parameters
            String fullUrl = String.format("%s?startDate=%s&endDate=%s",
                url, startDate, endDate);

            ResponseEntity<String> response = restTemplate.exchange(
                fullUrl, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully retrieved Artello sales data");
                return response.getBody();
            } else {
                logger.error("Failed to get Artello sales data: {}", response.getStatusCode());
                return null;
            }

        } catch (Exception e) {
            logger.error("Error getting Artello sales data", e);
            return null;
        }
    }
}
