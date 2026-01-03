package com.lindseyayresart.lindseywebsite.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple rate limiting filter to protect against DoS attacks.
 * 
 * Limits requests per IP address within a time window.
 * Returns 429 Too Many Requests when limit is exceeded.
 */
@Configuration
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitingFilter.class);

    // Rate limit: requests per window
    @Value("${rate.limit.requests:100}")
    private int maxRequests;

    // Time window in milliseconds (default: 1 minute)
    @Value("${rate.limit.window.ms:60000}")
    private long windowMs;

    // Store request counts per IP
    private final Map<String, RateLimitEntry> requestCounts = new ConcurrentHashMap<>();

    // Cleanup interval (every 5 minutes)
    private static final long CLEANUP_INTERVAL_MS = 300000;
    private long lastCleanup = System.currentTimeMillis();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Skip rate limiting for static resources
        String path = request.getRequestURI();
        if (isStaticResource(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get client IP (consider X-Forwarded-For for proxies)
        String clientIp = getClientIp(request);
        
        // Periodically cleanup old entries
        cleanupOldEntries();

        // Check rate limit
        RateLimitEntry entry = requestCounts.computeIfAbsent(clientIp, 
            k -> new RateLimitEntry());

        if (entry.isRateLimited(maxRequests, windowMs)) {
            logger.warn("Rate limit exceeded for IP: {}", clientIp);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many requests. Please try again later.\"}");
            return;
        }

        // Increment request count
        entry.increment();

        // Add rate limit headers
        response.setHeader("X-RateLimit-Limit", String.valueOf(maxRequests));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(entry.getRemaining(maxRequests)));

        filterChain.doFilter(request, response);
    }

    /**
     * Check if the path is a static resource (images, css, js).
     */
    private boolean isStaticResource(String path) {
        return path.startsWith("/images/") ||
               path.startsWith("/assets/") ||
               path.endsWith(".css") ||
               path.endsWith(".js") ||
               path.endsWith(".ico") ||
               path.endsWith(".png") ||
               path.endsWith(".jpg") ||
               path.endsWith(".jpeg") ||
               path.endsWith(".gif") ||
               path.endsWith(".woff") ||
               path.endsWith(".woff2");
    }

    /**
     * Get client IP, considering proxy headers.
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Take the first IP in the list (client IP)
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Cleanup expired entries to prevent memory leaks.
     */
    private void cleanupOldEntries() {
        long now = System.currentTimeMillis();
        if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
            requestCounts.entrySet().removeIf(entry -> 
                entry.getValue().isExpired(windowMs * 2));
            lastCleanup = now;
        }
    }

    /**
     * Rate limit entry for tracking requests per IP.
     */
    private static class RateLimitEntry {
        private final AtomicInteger count = new AtomicInteger(0);
        private volatile long windowStart = System.currentTimeMillis();

        public synchronized boolean isRateLimited(int maxRequests, long windowMs) {
            long now = System.currentTimeMillis();
            
            // Reset if window has passed
            if (now - windowStart > windowMs) {
                count.set(0);
                windowStart = now;
            }
            
            return count.get() >= maxRequests;
        }

        public void increment() {
            count.incrementAndGet();
        }

        public int getRemaining(int maxRequests) {
            return Math.max(0, maxRequests - count.get());
        }

        public boolean isExpired(long maxAge) {
            return System.currentTimeMillis() - windowStart > maxAge;
        }
    }
}

