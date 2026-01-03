package com.lindseyayresart.lindseywebsite.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Security configuration for the application.
 * 
 * Implements:
 * - Security headers (XSS, clickjacking, content-type sniffing protection)
 * - CORS configuration
 * - Rate limiting headers
 */
@Configuration
public class SecurityConfig {

    @Value("${ALLOWED_ORIGINS:http://localhost:4200}")
    private String allowedOrigins;

    /**
     * Filter to add security headers to all responses.
     * These headers protect against common web vulnerabilities.
     */
    @Bean
    public OncePerRequestFilter securityHeadersFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, 
                                            HttpServletResponse response, 
                                            FilterChain filterChain) 
                    throws ServletException, IOException {
                
                // Prevent XSS attacks - tells browser to block reflected XSS
                response.setHeader("X-XSS-Protection", "1; mode=block");
                
                // Prevent clickjacking - only allow framing from same origin
                response.setHeader("X-Frame-Options", "SAMEORIGIN");
                
                // Prevent MIME type sniffing
                response.setHeader("X-Content-Type-Options", "nosniff");
                
                // Control referrer information sent with requests
                response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
                
                // Permissions policy - disable unnecessary browser features
                response.setHeader("Permissions-Policy", 
                    "geolocation=(), microphone=(), camera=(), payment=()");
                
                // Content Security Policy - restrict resource loading
                // Allows images from self and data URIs, scripts from self
                response.setHeader("Content-Security-Policy", 
                    "default-src 'self'; " +
                    "img-src 'self' data: https:; " +
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                    "font-src 'self' https://fonts.gstatic.com; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                    "connect-src 'self' https:; " +
                    "frame-ancestors 'self';");
                
                // HTTPS Strict Transport Security (only in production)
                if (request.isSecure()) {
                    response.setHeader("Strict-Transport-Security", 
                        "max-age=31536000; includeSubDomains");
                }
                
                filterChain.doFilter(request, response);
            }
        };
    }

    /**
     * Filter to redirect HTTP requests to HTTPS in production.
     * Only active when the application is running in production environment.
     *
     * Note: In production, it's recommended to use a reverse proxy (like Nginx)
     * to handle HTTP to HTTPS redirects for better performance.
     */
    @Bean
    public OncePerRequestFilter httpsRedirectFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain filterChain)
                    throws ServletException, IOException {

                // Only redirect in production (when ENVIRONMENT=prod)
                String environment = System.getProperty("ENVIRONMENT",
                    System.getenv("ENVIRONMENT"));
                if (!"prod".equalsIgnoreCase(environment)) {
                    filterChain.doFilter(request, response);
                    return;
                }

                // If request is not secure (HTTP), redirect to HTTPS
                if (!request.isSecure()) {
                    String httpsUrl = "https://" + request.getServerName() +
                        ":" + request.getServerPort() + request.getRequestURI();

                    if (request.getQueryString() != null) {
                        httpsUrl += "?" + request.getQueryString();
                    }

                    response.sendRedirect(httpsUrl);
                    return;
                }

                filterChain.doFilter(request, response);
            }
        };
    }

    /**
     * CORS configuration for the application.
     * Controls which origins can make requests to the API.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Parse allowed origins from environment variable
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        configuration.setAllowedOrigins(origins);
        
        // Allowed HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allowed headers
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "X-Requested-With",
            "Accept",
            "Origin",
            "Cache-Control"
        ));
        
        // Expose headers to the client
        configuration.setExposedHeaders(Arrays.asList(
            "X-Total-Count",
            "Content-Disposition"
        ));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
}

