package com.lindseyayresart.lindseywebsite.Services;

import com.lindseyayresart.lindseywebsite.Config.ExternalApiConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Service for integrating with Lumaprints API.
 *
 * Lumaprints provides print-on-demand services for artwork.
 * API Documentation: https://api-docs.lumaprints.com/
 *
 * Authentication: Basic HTTP authentication using API Key and Secret
 * Rate Limits: Check API documentation for current limits
 */
@Service
public class LumaprintsService {

    private static final Logger logger = LoggerFactory.getLogger(LumaprintsService.class);

    private final ExternalApiConfig apiConfig;
    private final RestTemplate restTemplate;

    public LumaprintsService(ExternalApiConfig apiConfig, RestTemplate restTemplate) {
        this.apiConfig = apiConfig;
        this.restTemplate = restTemplate;
    }

    /**
     * Test connection to Lumaprints API by attempting to get categories.
     *
     * @return true if connection successful
     */
    public boolean testConnection() {
        try {
            String url = apiConfig.getLumaprintsBaseUrl() + "/categories";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getLumaprintsBasicAuth());
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, String.class);

            boolean success = response.getStatusCode().is2xxSuccessful();
            logger.info("Lumaprints API connection test: {}", success ? "SUCCESS" : "FAILED");
            return success;

        } catch (Exception e) {
            logger.error("Failed to connect to Lumaprints API", e);
            return false;
        }
    }

    // ==========================================
    // PRODUCT ENDPOINTS
    // ==========================================

    /**
     * Retrieve all categories available.
     *
     * @return JSON response with categories
     */
    public String getCategories() {
        return makeGetRequest("/categories", "categories");
    }

    /**
     * Retrieve all subcategories under a category.
     *
     * @param categoryId The category ID
     * @return JSON response with subcategories
     */
    public String getSubcategories(String categoryId) {
        return makeGetRequest("/categories/" + categoryId + "/subcategories", "subcategories");
    }

    /**
     * Retrieve all options available for the subcategory.
     *
     * @param subcategoryId The subcategory ID
     * @return JSON response with options
     */
    public String getSubcategoryOptions(String subcategoryId) {
        return makeGetRequest("/subcategories/" + subcategoryId + "/options", "subcategory options");
    }

    // ==========================================
    // STORE ENDPOINTS
    // ==========================================

    /**
     * Get all stores that are available for API order creation.
     * Only Standard Stores can be used to submit an order.
     *
     * @return JSON response with stores
     */
    public String getStores() {
        return makeGetRequest("/stores", "stores");
    }

    // ==========================================
    // PRICING ENDPOINTS
    // ==========================================

    /**
     * Get product cost for a specific configuration.
     *
     * @param subcategoryId The subcategory ID
     * @param width Product width
     * @param height Product height
     * @param options Additional options (JSON string)
     * @return JSON response with pricing
     */
    public String getProductCost(String subcategoryId, int width, int height, String options) {
        try {
            String url = apiConfig.getLumaprintsBaseUrl() + "/pricing/product";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getLumaprintsBasicAuth());
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build request body
            String requestBody = String.format(
                "{\"subcategoryId\": \"%s\", \"width\": %d, \"height\": %d",
                subcategoryId, width, height);

            if (options != null && !options.trim().isEmpty()) {
                requestBody += ", \"options\": " + options;
            }
            requestBody += "}";

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully retrieved product cost for subcategory {}", subcategoryId);
                return response.getBody();
            } else {
                logger.error("Failed to get product cost: {}", response.getStatusCode());
                return null;
            }

        } catch (Exception e) {
            logger.error("Error getting product cost", e);
            return null;
        }
    }

    /**
     * Calculate shipping cost for an order.
     *
     * @param orderDetails JSON string with order details including address
     * @return JSON response with shipping costs
     */
    public String getShippingCost(String orderDetails) {
        try {
            String url = apiConfig.getLumaprintsBaseUrl() + "/pricing/shipping";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getLumaprintsBasicAuth());
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(orderDetails, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully calculated shipping cost");
                return response.getBody();
            } else {
                logger.error("Failed to calculate shipping cost: {}", response.getStatusCode());
                return null;
            }

        } catch (Exception e) {
            logger.error("Error calculating shipping cost", e);
            return null;
        }
    }

    // ==========================================
    // IMAGE ENDPOINTS
    // ==========================================

    /**
     * Check if an image meets the required dimensions.
     *
     * @param imageUrl URL of the image to check
     * @param width Required width
     * @param height Required height
     * @param options Additional options (JSON string)
     * @return JSON response with validation result
     */
    public String checkImage(String imageUrl, int width, int height, String options) {
        try {
            String url = apiConfig.getLumaprintsBaseUrl() + "/images/check";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getLumaprintsBasicAuth());
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build request body
            String requestBody = String.format(
                "{\"url\": \"%s\", \"width\": %d, \"height\": %d",
                imageUrl, width, height);

            if (options != null && !options.trim().isEmpty()) {
                requestBody += ", \"options\": " + options;
            }
            requestBody += "}";

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully checked image dimensions");
                return response.getBody();
            } else {
                logger.error("Failed to check image: {}", response.getStatusCode());
                return response.getBody(); // Return error details
            }

        } catch (Exception e) {
            logger.error("Error checking image", e);
            return null;
        }
    }

    // ==========================================
    // ORDER ENDPOINTS
    // ==========================================

    /**
     * Submit a new order for fulfillment.
     *
     * @param orderData JSON string with complete order details
     * @return JSON response with order number or error
     */
    public String createOrder(String orderData) {
        try {
            String url = apiConfig.getLumaprintsBaseUrl() + "/orders";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getLumaprintsBasicAuth());
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(orderData, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully submitted order to Lumaprints");
                return response.getBody();
            } else {
                logger.error("Failed to create order: {} - {}", response.getStatusCode(), response.getBody());
                return response.getBody(); // Return error details
            }

        } catch (Exception e) {
            logger.error("Error creating order", e);
            return null;
        }
    }

    /**
     * Get details of a specific order.
     *
     * @param orderId The order ID
     * @return JSON response with order details
     */
    public String getOrder(String orderId) {
        return makeGetRequest("/orders/" + orderId, "order details");
    }

    /**
     * Get multiple orders with pagination.
     *
     * @param page Page number (optional)
     * @param limit Number of orders per page (optional)
     * @return JSON response with orders list
     */
    public String getOrders(Integer page, Integer limit) {
        String url = "/orders";
        if (page != null || limit != null) {
            url += "?";
            if (page != null) url += "page=" + page;
            if (limit != null) url += (page != null ? "&" : "") + "limit=" + limit;
        }
        return makeGetRequest(url, "orders list");
    }

    /**
     * Get shipments for a specific order.
     *
     * @param orderId The order ID
     * @return JSON response with shipment details
     */
    public String getOrderShipments(String orderId) {
        return makeGetRequest("/orders/" + orderId + "/shipments", "order shipments");
    }

    // ==========================================
    // WEBHOOK ENDPOINTS
    // ==========================================

    /**
     * Subscribe to a new webhook event.
     *
     * @param webhookData JSON string with webhook subscription details
     * @return JSON response with subscription result
     */
    public String subscribeToWebhook(String webhookData) {
        try {
            String url = apiConfig.getLumaprintsBaseUrl() + "/webhooks";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getLumaprintsBasicAuth());
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(webhookData, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully subscribed to webhook");
                return response.getBody();
            } else {
                logger.error("Failed to subscribe to webhook: {}", response.getStatusCode());
                return response.getBody();
            }

        } catch (Exception e) {
            logger.error("Error subscribing to webhook", e);
            return null;
        }
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Make a GET request to the Lumaprints API.
     *
     * @param endpoint API endpoint (without base URL)
     * @param description Description for logging
     * @return JSON response or null on error
     */
    private String makeGetRequest(String endpoint, String description) {
        try {
            String url = apiConfig.getLumaprintsBaseUrl() + endpoint;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiConfig.getLumaprintsBasicAuth());
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully retrieved {}", description);
                return response.getBody();
            } else {
                logger.error("Failed to get {}: {}", description, response.getStatusCode());
                return null;
            }

        } catch (Exception e) {
            logger.error("Error retrieving {}", description, e);
            return null;
        }
    }
}
