package com.lindseyayresart.lindseywebsite.Services;

import com.lindseyayresart.lindseywebsite.Config.ExternalApiConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * Service for integrating with Lumaprints API.
 * <p>
 * Lumaprints provides print-on-demand services for artwork.
 * API Documentation: https://api-docs.lumaprints.com/
 * <p>
 * Authentication: Basic HTTP authentication using API Key and Secret
 * Rate Limits: Check API documentation for current limits
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class LumaprintsService {

    private final ExternalApiConfig apiConfig;
    private final RestClient restClient;

    // ==========================================
    // CONNECTION TEST
    // ==========================================

    /**
     * Test connection to Lumaprints API by attempting to get categories.
     *
     * @return true if connection successful
     */
    public boolean testConnection() {
        try {
            restClient.get()
                    .uri(buildUri("/categories", Map.of()))
                    .headers(this::setHeaders)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, this::handleError)
                    .toBodilessEntity();

            log.info("Lumaprints API connection test: SUCCESS");
            return true;

        } catch (Exception e) {
            log.error("Lumaprints API connection test: FAILED", e);
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
     * @param width         Product width
     * @param height        Product height
     * @param options       Additional options (JSON string)
     * @return JSON response with pricing
     */
    public String getProductCost(String subcategoryId, int width, int height, String options) {
        try {
            Map<String, Object> body = new java.util.LinkedHashMap<>();
            body.put("subcategoryId", subcategoryId);
            body.put("width", width);
            body.put("height", height);
            if (options != null && !options.trim().isEmpty()) {
                body.put("options", options);
            }

            String result = restClient.post()
                    .uri(buildUri("/pricing/product", Map.of()))
                    .headers(this::setHeaders)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, this::handleError)
                    .body(String.class);

            log.info("Successfully retrieved product cost for subcategory {}", subcategoryId);
            return result;

        } catch (Exception e) {
            log.error("Error getting product cost", e);
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
            String result = restClient.post()
                    .uri(buildUri("/pricing/shipping", Map.of()))
                    .headers(this::setHeaders)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(orderDetails)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, this::handleError)
                    .body(String.class);

            log.info("Successfully calculated shipping cost");
            return result;

        } catch (Exception e) {
            log.error("Error calculating shipping cost", e);
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
     * @param width    Required width
     * @param height   Required height
     * @param options  Additional options (JSON string)
     * @return JSON response with validation result
     */
    public String checkImage(String imageUrl, int width, int height, String options) {
        try {
            Map<String, Object> body = new java.util.LinkedHashMap<>();
            body.put("url", imageUrl);
            body.put("width", width);
            body.put("height", height);
            if (options != null && !options.trim().isEmpty()) {
                body.put("options", options);
            }

            String result = restClient.post()
                    .uri(buildUri("/images/check", Map.of()))
                    .headers(this::setHeaders)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, this::handleError)
                    .body(String.class);

            log.info("Successfully checked image dimensions");
            return result;

        } catch (Exception e) {
            log.error("Error checking image", e);
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
            String result = restClient.post()
                    .uri(buildUri("/orders", Map.of()))
                    .headers(this::setHeaders)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(orderData)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, this::handleError)
                    .body(String.class);

            log.info("Successfully submitted order to Lumaprints");
            return result;

        } catch (Exception e) {
            log.error("Error creating order", e);
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
     * @param page  Page number (optional)
     * @param limit Number of orders per page (optional)
     * @return JSON response with orders list
     */
    public String getOrders(Integer page, Integer limit) {
        Map<String, Object> params = new java.util.LinkedHashMap<>();
        if (page != null) params.put("page", page);
        if (limit != null) params.put("limit", limit);

        return makeGetRequest("/orders", "orders list", params);
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
            String result = restClient.post()
                    .uri(buildUri("/webhooks", Map.of()))
                    .headers(this::setHeaders)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(webhookData)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, this::handleError)
                    .body(String.class);

            log.info("Successfully subscribed to webhook");
            return result;

        } catch (Exception e) {
            log.error("Error subscribing to webhook", e);
            return null;
        }
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Make a GET request to the Lumaprints API.
     *
     * @param endpoint    API endpoint (without base URL)
     * @param description Description for logging
     * @return JSON response or null on error
     */
    private String makeGetRequest(String endpoint, String description) {
        return makeGetRequest(endpoint, description, Map.of());
    }

    /**
     * Make a GET request to the Lumaprints API with query parameters.
     *
     * @param endpoint    API endpoint (without base URL)
     * @param description Description for logging
     * @param queryParams Query parameters to append
     * @return JSON response or null on error
     */
    private String makeGetRequest(String endpoint, String description, Map<String, Object> queryParams) {
        try {
            String result = restClient.get()
                    .uri(buildUri(endpoint, queryParams))
                    .headers(this::setHeaders)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, this::handleError)
                    .body(String.class);

            log.info("Successfully retrieved {}", description);
            return result;

        } catch (Exception e) {
            log.error("Error retrieving {}", description, e);
            return null;
        }
    }

    /**
     * Constructs a full URI using the base URL from config and provided path/params.
     */
    private URI buildUri(String path, Map<String, Object> queryParams) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiConfig.getLumaprintsBaseUrl())
                .path(path);

        queryParams.forEach(builder::queryParam);
        return builder.build().toUri();
    }

    private void setHeaders(org.springframework.http.HttpHeaders headers) {
        headers.set("Authorization", apiConfig.getLumaprintsBasicAuth());
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
    }

    private void handleError(org.springframework.http.HttpRequest request, org.springframework.http.client.ClientHttpResponse response) throws java.io.IOException {
        log.error("Lumaprints API Failure: {} {} | URI: {}",
                response.getStatusCode(), response.getStatusText(), request.getURI());
        throw new RuntimeException("Lumaprints API Error: " + response.getStatusCode());
    }
}