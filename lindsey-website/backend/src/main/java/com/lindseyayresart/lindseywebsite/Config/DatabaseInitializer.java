package com.lindseyayresart.lindseywebsite.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DatabaseInitializer {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final JdbcTemplate jdbcTemplate;
    
    @Autowired
    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    @PostConstruct
    @Transactional
    public void initializeDatabase() {
        logger.info("Initializing database");
        
        // Tables first
        executeScript("sql/tables/ARTWORKS.sql");
        
        // Then stored procedures
        executeScript("sql/stored_procedures/ArtworkManagement.sql");
        
        // Finally triggers
        //executeScript("sql/triggers/update_artwork_timestamp.sql");
        
        logger.info("Database initialization completed");
    }
    
    private void executeScript(String resourcePath) {
        try {
            ClassPathResource resource = new ClassPathResource(resourcePath);
            
            if (!resource.exists()) {
                logger.warn("Script not found: {}", resourcePath);
                return;
            }
            
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                String script = reader.lines().collect(Collectors.joining("\n"));
                
                if (script.trim().isEmpty()) {
                    logger.info("Script is empty: {}", resourcePath);
                    return;
                }
                
                logger.debug("Executing script: {}", resourcePath);
                jdbcTemplate.execute(script);
                logger.debug("Script executed successfully: {}", resourcePath);
            }
        } catch (IOException e) {
            logger.error("Failed to read SQL script: " + resourcePath, e);
            throw new RuntimeException("Failed to read SQL script: " + resourcePath, e);
        } catch (Exception e) {
            logger.error("Failed to execute SQL script: " + resourcePath, e);
            throw new RuntimeException("Failed to execute SQL script: " + resourcePath, e);
        }
    }
}