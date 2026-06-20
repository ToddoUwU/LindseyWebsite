package com.lindseyayresart.lindseywebsite.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Security configuration for the application.
 * <p>
 * Implements:
 * - Security headers (XSS, clickjacking, content-type sniffing protection)
 * - CORS configuration
 * - Rate limiting headers
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${ALLOWED_ORIGINS:http://localhost:4200}")
    private String allowedOrigins;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:}")
    private String adminPassword;

    /**
     * Filter to add security headers to all responses.
     * These headers protect against common web vulnerabilities.
     */
    @Bean
    public OncePerRequestFilter securityHeadersFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(@NonNull HttpServletRequest request,
                                            @NonNull HttpServletResponse response,
                                            @NonNull FilterChain filterChain)
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

    // TLS termination and any HTTP->HTTPS handling now live at the WildFly/Undertow layer
    // (or a fronting reverse proxy), so the former application-level httpsRedirectFilter
    // has been removed.

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

    /**
     * Password encoder for the in-memory admin account.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Single in-memory ADMIN account used to protect the mutating/admin endpoints.
     * <p>
     * Fails CLOSED: if no admin password is configured (app.admin.password / ADMIN_PASSWORD),
     * NO user is registered, so every protected endpoint returns 401 rather than being open.
     */
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        if (adminPassword == null || adminPassword.isBlank()) {
            return new InMemoryUserDetailsManager();
        }
        UserDetails admin = User.withUsername(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // No browser login form; admin endpoints use HTTP Basic (configured below).
                .formLogin(AbstractHttpConfigurer::disable)

                // Stateless API: no server-side sessions.
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // CSRF disabled: stateless API with no cookie-based auth (HTTP Basic),
                // and inbound payment/fulfilment webhooks must POST without a CSRF token.
                .csrf(AbstractHttpConfigurer::disable)

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // NOTE: antMatcher(...) forces AntPathRequestMatcher. As a Spring Boot WAR on an
                // external servlet container, MvcRequestMatcher (the default) matches
                // unreliably, so all rules below are explicit ant matchers.
                .authorizeHttpRequests(auth -> auth
                        // Angular SPA shell + static assets + served images
                        .requestMatchers(antMatcher("/"), antMatcher("/index.html"),
                                antMatcher("/favicon.ico"), antMatcher("/*.js"), antMatcher("/*.css"),
                                antMatcher("/static/**"), antMatcher("/assets/**"),
                                antMatcher("/images/**"), antMatcher("/media/**")).permitAll()
                        // Health probe + Spring Boot's error dispatch (so 4xx/5xx on public
                        // endpoints aren't re-secured into a misleading 401)
                        .requestMatchers(antMatcher("/api/health"), antMatcher("/error")).permitAll()
                        // Public customer-facing form submissions (rate-limited upstream)
                        .requestMatchers(antMatcher(HttpMethod.POST, "/api/contact"),
                                antMatcher(HttpMethod.POST, "/api/inquiry")).permitAll()
                        // Public checkout + inbound webhooks (present or future)
                        .requestMatchers(antMatcher("/api/public/**"), antMatcher("/api/order/**"),
                                antMatcher("/api/artello/webhook"), antMatcher("/api/square/webhook")).permitAll()
                        // All read-only gallery/product data is public
                        .requestMatchers(antMatcher(HttpMethod.GET, "/api/**")).permitAll()
                        // Everything else — admin cache eviction, product create/update/delete,
                        // and any future mutating endpoint — requires the ADMIN role.
                        .anyRequest().hasRole("ADMIN")
                )
                .httpBasic(Customizer.withDefaults());

        http.addFilterBefore(securityHeadersFilter(), org.springframework.security.web.header.HeaderWriterFilter.class);
        return http.build();
    }
}

