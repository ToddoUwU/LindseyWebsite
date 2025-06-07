package com.lindseyayresart.lindseywebsite.Services;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.lindseyayresart.lindseywebsite.Model.Artwork;
import com.lindseyayresart.lindseywebsite.Repository.ArtworkRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import jakarta.transaction.Transactional;

@Service
public class ArtworkService {
    
    private static final Logger logger = LoggerFactory.getLogger(ArtworkService.class);
    private static final String ARTWORK_CACHE_KEY = "artwork:";
    private static final String ARTWORK_LIST_KEY = "artworks:all";
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Autowired
    private ArtworkRepository artworkRepository;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * Get artwork by ID (from cache if available)
     */
    public Optional<Artwork> getArtworkById(Long id) {
        String key = ARTWORK_CACHE_KEY + id;
        Artwork artwork = (Artwork) redisTemplate.opsForValue().get(key);
        
        if (artwork != null) {
            return Optional.of(artwork);
        } else {
            Optional<Artwork> artworkOpt = artworkRepository.findById(id);
            artworkOpt.ifPresent(art -> {
                art.setContentHash(calculateHash(art));
                redisTemplate.opsForValue().set(key, art);
            });
            return artworkOpt;
        }
    }
    
    /**
     * Get artwork by title using stored procedure (from cache if available)
     */
    @SuppressWarnings("unchecked")
    public Optional<Artwork> getArtworkByTitle(String title) {
        // First check if we have a title to ID mapping in cache
        Long id = (Long) redisTemplate.opsForHash().get("artwork:titles", title);
        
        if (id != null) {
            return getArtworkById(id);
        }
        
        // Check cache by title
        String cacheKey = "artwork:title:" + title.toLowerCase();
        Artwork cached = (Artwork) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return Optional.of(cached);
        }
        
        // Use stored procedure if not in cache
        StoredProcedureQuery query = entityManager
            .createStoredProcedureQuery("get_artwork_by_title", Artwork.class)
            .registerStoredProcedureParameter("p_title", String.class, ParameterMode.IN)
            .setParameter("p_title", title);
        
        List<Artwork> results = query.getResultList();
        
        if (!results.isEmpty()) {
            Artwork artwork = results.get(0);
            
            // Cache the result
            artwork.setContentHash(calculateHash(artwork));
            redisTemplate.opsForValue().set(cacheKey, artwork);
            redisTemplate.opsForValue().set(ARTWORK_CACHE_KEY + artwork.getId(), artwork);
            redisTemplate.opsForHash().put("artwork:titles", title, artwork.getId());
            
            return Optional.of(artwork);
        }
        
        return Optional.empty();
    }
    
    /**
     * Get artworks by medium using stored procedure (from cache if available)
     */
    @SuppressWarnings("unchecked")
    public List<Artwork> getArtworksByMedium(String medium) {
        String cacheKey = "artworks:medium:" + medium.toLowerCase();
        List<Artwork> cached = (List<Artwork>) redisTemplate.opsForValue().get(cacheKey);
        
        if (cached != null) {
            return cached;
        }
        
        StoredProcedureQuery query = entityManager
            .createStoredProcedureQuery("get_artworks_by_medium", Artwork.class)
            .registerStoredProcedureParameter("p_medium", String.class, ParameterMode.IN)
            .setParameter("p_medium", medium);
        
        List<Artwork> results = query.getResultList();
        
        // Cache results
        redisTemplate.opsForValue().set(cacheKey, results);
        
        return results;
    }
    
    /**
     * Get all artworks using stored procedure (from cache if available)
     */
    @SuppressWarnings("unchecked")
    public List<Artwork> getAllArtworks() {
        List<Artwork> cached = (List<Artwork>) redisTemplate.opsForValue().get(ARTWORK_LIST_KEY);
        
        if (cached != null) {
            return cached;
        }
        
        StoredProcedureQuery query = entityManager
            .createStoredProcedureQuery("get_all_artworks", Artwork.class);
        
        List<Artwork> results = query.getResultList();
        
        // Cache results
        redisTemplate.opsForValue().set(ARTWORK_LIST_KEY, results);
        
        return results;
    }
    
    /**
     * Get featured artworks using stored procedure (from cache if available)
     */
    @SuppressWarnings("unchecked")
    public List<Artwork> getFeaturedArtworks() {
        String cacheKey = "artworks:featured";
        List<Artwork> cached = (List<Artwork>) redisTemplate.opsForValue().get(cacheKey);
        
        if (cached != null) {
            return cached;
        }
        
        StoredProcedureQuery query = entityManager
            .createStoredProcedureQuery("get_featured_artworks", Artwork.class);
        
        List<Artwork> results = query.getResultList();
        
        // Cache results
        redisTemplate.opsForValue().set(cacheKey, results);
        
        return results;
    }
    
    /**
     * Get artworks by category using stored procedure (from cache if available)
     */
    @SuppressWarnings("unchecked")
    public List<Artwork> getArtworksByCategory(String category) {
        String cacheKey = "artworks:category:" + category.toLowerCase();
        List<Artwork> cached = (List<Artwork>) redisTemplate.opsForValue().get(cacheKey);
        
        if (cached != null) {
            return cached;
        }
        
        StoredProcedureQuery query = entityManager
            .createStoredProcedureQuery("get_artworks_by_category", Artwork.class)
            .registerStoredProcedureParameter("p_category", String.class, ParameterMode.IN)
            .setParameter("p_category", category);
        
        List<Artwork> results = query.getResultList();
        
        // Cache results
        redisTemplate.opsForValue().set(cacheKey, results);
        
        return results;
    }
    
    /**
     * Refresh all artwork data in cache every 30 minutes
     */
    @Scheduled(fixedRate = 30 * 60 * 1000) // 30 minutes
    @Transactional
    public void refreshCache() {
        logger.info("Refreshing artwork cache");
        
        // Clear all artwork-related keys from cache
        redisTemplate.delete(redisTemplate.keys("artwork:*"));
        redisTemplate.delete(redisTemplate.keys("artworks:*"));
        
        // Get fresh data from database
        List<Artwork> allArtworks = getAllArtworks();
        
        // Update content hashes and cache individual artworks
        for (Artwork artwork : allArtworks) {
            String newHash = calculateHash(artwork);
            
            // Update hash in database if changed
            if (!newHash.equals(artwork.getContentHash())) {
                updateArtworkHash(artwork.getId(), newHash);
                artwork.setContentHash(newHash);
            }
            
            // Cache the artwork by ID
            redisTemplate.opsForValue().set(ARTWORK_CACHE_KEY + artwork.getId(), artwork);
            
            // Cache title to ID mapping
            redisTemplate.opsForHash().put("artwork:titles", artwork.getTitle(), artwork.getId());
        }
        
        logger.info("Artwork cache refreshed with {} items", allArtworks.size());
    }
    
    /**
     * Update artwork hash in database using stored procedure
     */
    @Transactional
    public void updateArtworkHash(Long id, String hash) {
        StoredProcedureQuery query = entityManager
            .createStoredProcedureQuery("update_artwork_hash")
            .registerStoredProcedureParameter("p_id", Long.class, ParameterMode.IN)
            .registerStoredProcedureParameter("p_hash", String.class, ParameterMode.IN)
            .setParameter("p_id", id)
            .setParameter("p_hash", hash);
        
        query.execute();
    }
    
    /**
     * Calculate a hash of the artwork content for change detection
     */
    private String calculateHash(Artwork artwork) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            StringBuilder sb = new StringBuilder();
            
            // Combine all relevant fields for hashing
            sb.append(artwork.getTitle())
              .append(artwork.getArtDescription())
              .append(artwork.getDimensions())
              .append(artwork.getSmallImageUrl())
              .append(artwork.getLargeImageUrl())
              .append(artwork.getLinkToPrint())
              .append(artwork.getDateProduced())
              .append(artwork.getOriginalPrice())
              .append(artwork.getForSale())
              .append(artwork.getLocation())
              .append(artwork.getMedium())
              .append(artwork.getCategories())
              .append(artwork.getIsFeatured());
            
            byte[] hashBytes = md.digest(sb.toString().getBytes());
            
            // Convert to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            logger.error("Error calculating hash", e);
            return "";
        }
    }
}