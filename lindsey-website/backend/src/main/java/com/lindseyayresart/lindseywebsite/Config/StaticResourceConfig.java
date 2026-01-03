package com.lindseyayresart.lindseywebsite.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration for serving static resources (images)
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve images from classpath:/Images/
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/Images/")
                .setCachePeriod(31536000); // Cache for 1 year (images don't change)
    }
}

