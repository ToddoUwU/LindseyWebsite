package com.lindseyayresart.lindseywebsite.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

/**
 * Configuration for REST API clients.
 * <p>
 * Provides configured RestTemplate instances for external API calls.
 */

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient restClient(RestClient.Builder builder) {
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory();

        factory.setReadTimeout(Duration.ofSeconds(15));

        return builder
                .requestFactory(factory)
                .build();
    }
}
