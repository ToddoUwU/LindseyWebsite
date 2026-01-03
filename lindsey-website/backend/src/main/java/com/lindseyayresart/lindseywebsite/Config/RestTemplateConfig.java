package com.lindseyayresart.lindseywebsite.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for REST API clients.
 *
 * Provides configured RestTemplate instances for external API calls.
 */
@Configuration
public class RestTemplateConfig {

    /**
     * RestTemplate for external API calls.
     * Configured with reasonable timeouts using Spring Boot's built-in HTTP client.
     */
    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // Configure timeouts using Spring Boot's SimpleClientHttpRequestFactory
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // 5 seconds connection timeout
        factory.setReadTimeout(30000);   // 30 seconds read timeout

        restTemplate.setRequestFactory(factory);

        return restTemplate;
    }
}
