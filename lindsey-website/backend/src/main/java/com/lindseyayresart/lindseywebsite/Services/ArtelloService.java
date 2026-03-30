package com.lindseyayresart.lindseywebsite.Services;

import com.lindseyayresart.lindseywebsite.Config.ExternalApiConfig;
import com.lindseyayresart.lindseywebsite.Model.DTO.ArtelloOrderResponse;
import com.lindseyayresart.lindseywebsite.Model.DTO.ArtelloProductSet;
import com.lindseyayresart.lindseywebsite.Model.DTO.FulfillmentRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service for integrating with Artello API.
 * <p>
 * Artello provides art marketplace and gallery services.
 * API Documentation: https://www.artelo.io/api
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ArtelloService {


    private static final ParameterizedTypeReference<List<ArtelloProductSet>> PRODUCT_SET_LIST_TYPE =
            new ParameterizedTypeReference<>() {
            };
    private static final ParameterizedTypeReference<List<Map<String, Object>>> GENERIC_LIST_TYPE =
            new ParameterizedTypeReference<>() {
            };
    private final ExternalApiConfig apiConfig;
    private final RestClient restClient;

    public List<ArtelloProductSet> getProductSets(int limit) {
        return restClient.get()
                .uri(buildUri("/open/product-sets/get", Map.of("limit", limit)))
                .headers(this::setHeaders)
                .retrieve()
                .onStatus(HttpStatusCode::isError, this::handleError)
                .body(PRODUCT_SET_LIST_TYPE);
    }

    public Optional<ArtelloProductSet> getProductSetByNameLimit1(String name) {
        List<ArtelloProductSet> sets = restClient.get().uri(uriBuilder -> uriBuilder.path(apiConfig.getArtelloBaseUrl() + "/open/product-sets/get").queryParam("limit", 1).queryParam("name", name).build())
                .header("Authorization", apiConfig.getArtelloBearerAuth())
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        (request, response) -> {
                            log.error("Artello API error: {} {}", response.getStatusCode(), response.getStatusText());
                            throw new RuntimeException("Artello Service Unavailable");
                        }
                )
                .body(PRODUCT_SET_LIST_TYPE);

        return sets == null ? Optional.empty() : Optional.ofNullable(sets.getFirst());
    }

    public Optional<ArtelloProductSet> getProductSetById(String setId) {
        try {
            List<ArtelloProductSet> responseList = restClient.get()
                    .uri(uriBuilder -> uriBuilder.path(apiConfig.getArtelloBaseUrl() + "/open/product-sets/get-by-id")
                            .queryParam("id", setId)
                            .build())
                    .header("Authorization", apiConfig.getArtelloBearerAuth())
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            (request, response) -> {
                                log.error("Artello API error: {} {}", response.getStatusCode(), response.getStatusText());
                                throw new RuntimeException("Artello Service Unavailable");
                            }
                    )
                    .body(PRODUCT_SET_LIST_TYPE);

            return Optional.ofNullable(responseList)
                    .filter(list -> !list.isEmpty())
                    .map(List::getFirst);

        } catch (Exception e) {
            log.error("Failed to fetch ProductSet {} due to: {}", setId, e.getMessage());
            // Fallback logic in SyncService will catch this
            throw e;
        }
    }

    public ArtelloOrderResponse createOrder(FulfillmentRequest orderRequest) {
        return restClient.post()
                .uri(buildUri("/open/orders/create", Map.of()))
                .headers(this::setHeaders)
                .contentType(MediaType.APPLICATION_JSON)
                .body(orderRequest)
                .retrieve()
                .onStatus(HttpStatusCode::isError, this::handleError)
                .body(ArtelloOrderResponse.class);
    }

    public ArtelloOrderResponse getOrderById(String orderId) {
        return restClient.get()
                .uri(buildUri("/open/orders/get-by-id", Map.of("orderId", orderId)))
                .headers(this::setHeaders)
                .retrieve()
                .onStatus(HttpStatusCode::isError, this::handleError)
                .body(ArtelloOrderResponse.class);
    }

    public void cancelOrder(String orderId) {
        restClient.delete()
                .uri(buildUri("/open/orders/cancel", Map.of("id", orderId)))
                .headers(this::setHeaders)
                .retrieve()
                .onStatus(HttpStatusCode::isError, this::handleError)
                .toBodilessEntity();
    }

    // --- WEBHOOKS ---

    public void registerWebhook(String url, String topic, List<String> statuses) {
        Map<String, Object> body = Map.of("url", url, "topic", topic, "statuses", statuses);

        restClient.post()
                .uri(buildUri("/open/webhooks/save", Map.of()))
                .headers(this::setHeaders)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .onStatus(HttpStatusCode::isError, this::handleError)
                .toBodilessEntity();
    }

    public List<Map<String, Object>> listWebhooks() {
        return restClient.get()
                .uri(buildUri("/open/webhooks/get", Map.of()))
                .headers(this::setHeaders)
                .retrieve()
                .onStatus(HttpStatusCode::isError, this::handleError)
                .body(GENERIC_LIST_TYPE);
    }
    // --- HELPERS ---

    /**
     * Constructs a full URI using the base URL from config and provided path/params.
     */
    private URI buildUri(String path, Map<String, Object> queryParams) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiConfig.getArtelloBaseUrl())
                .path(path);

        queryParams.forEach(builder::queryParam);
        return builder.build().toUri();
    }

    private void setHeaders(org.springframework.http.HttpHeaders headers) {
        headers.setBearerAuth(apiConfig.getArtelloBearerAuth());
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
    }

    private void handleError(org.springframework.http.HttpRequest request, org.springframework.http.client.ClientHttpResponse response) throws java.io.IOException {
        log.error("Artello API Failure: {} {} | URI: {}",
                response.getStatusCode(), response.getStatusText(), request.getURI());
        throw new RuntimeException("Artello API Error: " + response.getStatusCode());
    }
}
