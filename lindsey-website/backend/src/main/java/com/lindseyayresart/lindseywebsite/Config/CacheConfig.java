package com.lindseyayresart.lindseywebsite.Config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Cache configuration using Caffeine (in-memory cache).
 *
 * Caffeine is simpler than Redis for single-instance deployments:
 * - No external service to manage
 * - Faster (no network hop)
 * - Sufficient for small-to-medium datasets
 *
 * Trade-offs vs Redis:
 * - Cache is lost on app restart
 * - Can't share cache across multiple instances
 * - Limited by JVM heap size
 *
 * For an art portfolio site with ~100-200 artworks, Caffeine is ideal.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();

        // Default cache configuration
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(500)                    // Max entries
            .expireAfterWrite(1, TimeUnit.HOURS) // Default TTL
            .recordStats());                     // Enable stats for monitoring

        // Register cache names (Spring creates them on-demand, but explicit is clearer)
        cacheManager.setCacheNames(java.util.List.of(
            "featuredArtworks",  // Refreshed every 5 min by scheduler
            "categories",
            "dimensions",
            "years",
            "mediums",
            "artworks",
            "artworksByCategory",
            "artworksByMedium",
            "artworksForSale"
        ));

        return cacheManager;
    }
}
