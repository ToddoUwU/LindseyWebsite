package com.lindseyayresart.lindseywebsite.Config;

import com.squareup.square.SquareClient;
import com.squareup.square.core.Environment;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "external.api.square")
@Getter
@Setter
public class SquareConfig {
    private String accessToken;
    private String locationId;
    private String applicationId;  // Public, needed by frontend SDK
    private boolean useSandbox = false;

    @Bean
    public SquareClient squareClient() {
        return SquareClient.builder()
                .token(accessToken)
                .environment(useSandbox ? Environment.SANDBOX : Environment.PRODUCTION)
                .build();
    }
}