package com.lindseyayresart.lindseywebsite.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        // Add this to the beginning of your initializeDatabase method
        try {
            if (jdbcTemplate.getDataSource() != null) {
                logger.info("Database URL: {}", jdbcTemplate.getDataSource().getConnection().getMetaData().getURL());
            } else {
                logger.warn("DataSource is null, cannot log database URL.");
            }
        } catch (java.sql.SQLException e) {
            logger.error("Failed to get database URL", e);
        }
        logger.info("Database schema: {}", jdbcTemplate.queryForObject("SELECT current_schema()", String.class));
        
        try {
            // FORCE DROP AND RECREATE FOR TESTING
            logger.info("FORCING table drop and recreate");
            
            // Backup existing data if needed
            List<Map<String, Object>> existingData = new ArrayList<>();
            if (tableExists("ARTWORKS")) {
                existingData = backupTableData("ARTWORKS");
                logger.info("Backed up {} records", existingData.size());
            }
            
            // Drop and recreate
            dropTable("ARTWORKS");
            logger.info("Table dropped");
            executeScript("sql/tables/ARTWORKS.sql");
            logger.info("Table recreated");
            
            // Restore data if we have a backup
            if (!existingData.isEmpty()) {
                restoreTableData("ARTWORKS", existingData);
                logger.info("Data restored");
            }
            
            dropFunction("get_artworks_by_medium");
            dropFunction("get_artwork_by_title");
            dropFunction("get_featured_artworks");
            dropFunction("get_artworks_by_category");
            dropFunction("get_all_artworks");
            dropFunction("update_artwork_content_hash");
            // Then stored procedures - these can be recreated each time
            executeScript("sql/stored_procedures/ArtworkManagement.sql");
            
            // Finally triggers
            executeScript("sql/triggers/update_artwork_timestamp.sql");
            
            logger.info("Database initialization completed");
            
            // Verify schema after recreation
            verifySchema("ARTWORKS");
            
        } catch (Exception e) {
            logger.error("Database initialization failed", e);
            throw e;
        }
    }
    
    private boolean tableExists(String tableName) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ? AND table_schema = current_schema()",
            Integer.class,
            tableName.toLowerCase()
        );
        return count != null && count > 0;
    }
    
    /**
     * Check if the table schema matches our expected definition in the SQL file
     */
    private boolean isSchemaValid(String tableName) {
        logger.info("Validating schema for table: {}", tableName);
        
        try {
            // Extract column definitions from our SQL file
            Map<String, ColumnDefinition> expectedColumns = extractColumnsFromSqlFile("sql/tables/ARTWORKS.sql");
            if (expectedColumns.isEmpty()) {
                logger.warn("Failed to extract column definitions from SQL file");
                return false;
            }
            
            // Get existing columns from the database
            Map<String, ColumnDefinition> actualColumns = getExistingColumns(tableName);
            
            logger.info("Expected columns: {}", expectedColumns.keySet());
            logger.info("Actual columns: {}", actualColumns.keySet());
            
            // Check if all expected columns exist with the right types
            for (String columnName : expectedColumns.keySet()) {
                ColumnDefinition expected = expectedColumns.get(columnName);
                
                // If column doesn't exist at all
                if (!actualColumns.containsKey(columnName)) {
                    logger.warn("Column {} is missing", columnName);
                    return false;
                }
                
                // Check if the type matches
                ColumnDefinition actual = actualColumns.get(columnName);
                if (!typesMatch(expected.type, actual.type)) {
                    logger.warn("Column {} has wrong type: expected {}, got {}", 
                        columnName, expected.type, actual.type);
                    return false;
                }
                
                // For more thorough validation, also check constraints
                // This is simplified; you might want to expand this
                if (!constraintsMatch(expected.constraints, actual.constraints)) {
                    logger.warn("Column {} has mismatched constraints: expected {}, got {}", 
                        columnName, expected.constraints, actual.constraints);
                    return false;
                }
            }
            
            // Check if there are any extra columns that shouldn't be there
            for (String columnName : actualColumns.keySet()) {
                if (!expectedColumns.containsKey(columnName)) {
                    logger.warn("Extra column found in database: {}", columnName);
                    return false;
                }
            }
            
            // All columns match
            logger.info("Schema validation successful for table: {}", tableName);
            return true;
            
        } catch (Exception e) {
            logger.warn("Error validating schema: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Backup all data from a table
     */
    private List<Map<String, Object>> backupTableData(String tableName) {
        logger.info("Backing up data from table: {}", tableName);
        return jdbcTemplate.queryForList("SELECT * FROM " + tableName);
    }
    
    /**
     * Drop a table and clean up related objects
     */
    private void dropTable(String tableName) {
        logger.info("Dropping table: {}", tableName);
        
        // Drop triggers first (PostgreSQL drops dependents automatically, but being explicit is good)
        jdbcTemplate.execute("DROP TABLE IF EXISTS " + tableName + " CASCADE");
        
        // In PostgreSQL, CASCADE will handle most dependencies
        // For very complex cases with external references, you might need more cleanup
        
        // Clean up sequences if they exist and aren't shared with other tables
        String sequenceName = tableName.toLowerCase() + "_id_seq";
        try {
            jdbcTemplate.execute("DROP SEQUENCE IF EXISTS " + sequenceName + " CASCADE");
        } catch (Exception e) {
            // Sequence might be in use by other tables, or might not exist
            logger.debug("Note: Could not drop sequence {}: {}", sequenceName, e.getMessage());
        }
    }

    private void dropFunction(String functionName) {
        logger.info("Dropping function: {}", functionName);
        try {
            // Try to get the function signatures
            List<String> signatures = jdbcTemplate.queryForList(
                "SELECT pg_get_function_identity_arguments(oid) " +
                "FROM pg_proc " +
                "WHERE proname = ? AND pg_function_is_visible(oid)",
                String.class, functionName.toLowerCase());
            
            // Drop each function with its signature
            if (signatures.isEmpty()) {
                logger.info("No functions found with name: {}", functionName);
                return;
            }
            
            for (String signature : signatures) {
                String dropSql = "DROP FUNCTION IF EXISTS " + functionName + "(" + signature + ") CASCADE";
                logger.info("Executing: {}", dropSql);
                jdbcTemplate.execute(dropSql);
                logger.info("Successfully dropped function: {}({})", functionName, signature);
            }
        } catch (Exception e) {
            logger.warn("Could not drop function {}: {}", functionName, e.getMessage());
        }
    }
    
    /**
     * Restore backed up data to a table
     */
    private void restoreTableData(String tableName, List<Map<String, Object>> data) {
        if (data.isEmpty()) {
            return;
        }
        
        // Get column names from the first record
        Map<String, Object> firstRecord = data.get(0);
        List<String> columns = firstRecord.keySet().stream()
            .filter(col -> !col.equals("id")) // Skip ID column to let it auto-increment
            .collect(Collectors.toList());
        
        // For each record, create an insert statement
        for (Map<String, Object> record : data) {
            try {
                StringBuilder sql = new StringBuilder();
                sql.append("INSERT INTO ").append(tableName).append(" (");
                sql.append(String.join(", ", columns));
                sql.append(") VALUES (");
                
                // Create value placeholders
                sql.append(columns.stream().map(c -> "?").collect(Collectors.joining(", ")));
                sql.append(")");
                
                // Extract values in the same order as columns
                Object[] values = columns.stream()
                    .map(record::get)
                    .toArray();
                
                jdbcTemplate.update(sql.toString(), values);
            } catch (Exception e) {
                logger.warn("Could not restore record: {}", e.getMessage());
                // Continue with other records
            }
        }
        
        // Reset sequence if needed
        try {
            // Find the max ID
            Integer maxId = jdbcTemplate.queryForObject(
                "SELECT MAX(id) FROM " + tableName, 
                Integer.class
            );
            
            if (maxId != null && maxId > 0) {
                // Set sequence to start after max ID
                jdbcTemplate.execute(
                    "SELECT setval('" + tableName.toLowerCase() + "_id_seq', " + (maxId + 1) + ", false)"
                );
            }
        } catch (Exception e) {
            logger.warn("Could not reset sequence: {}", e.getMessage());
        }
    }
    
    private void executeScript(String resourcePath) {
        try {
            logger.info("Executing SQL script: {}", resourcePath);
            ClassPathResource resource = new ClassPathResource(resourcePath);
            
            if (!resource.exists()) {
                logger.warn("Script not found: {}", resourcePath);
                return;
            }
            
            String sql;
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                sql = reader.lines().collect(Collectors.joining("\n"));
            }
                
            jdbcTemplate.execute(sql);
            logger.info("Successfully executed script: {}", resourcePath);
            
        } catch (IOException e) {
            logger.error("Error reading script {}: {}", resourcePath, e.getMessage(), e);
            throw new RuntimeException("Failed to read SQL script", e);
        }
    }
    
    /**
     * Extract column definitions from SQL file
     */
    private Map<String, ColumnDefinition> extractColumnsFromSqlFile(String sqlFilePath) {
        Map<String, ColumnDefinition> columns = new HashMap<>();
        
        try {
            ClassPathResource resource = new ClassPathResource(sqlFilePath);
            
            if (!resource.exists()) {
                throw new IOException("SQL definition file not found: " + sqlFilePath);
            }
            
            String sqlContent = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining("\n"));
            
            // Find the CREATE TABLE statement
            int createTableStart = sqlContent.toLowerCase().indexOf("create table");
            if (createTableStart == -1) {
                logger.warn("No CREATE TABLE statement found in SQL file");
                return columns;
            }
            
            // Extract the column definitions section (between the first '(' and matching ')')
            int openParenIndex = sqlContent.indexOf('(', createTableStart);
            if (openParenIndex == -1) {
                logger.warn("Invalid CREATE TABLE syntax - no opening parenthesis");
                return columns;
            }
            
            // Find the matching closing parenthesis
            int closeParenIndex = findMatchingClosingParen(sqlContent, openParenIndex);
            if (closeParenIndex == -1) {
                logger.warn("Invalid CREATE TABLE syntax - no matching closing parenthesis");
                return columns;
            }
            
            String columnDefinitions = sqlContent.substring(openParenIndex + 1, closeParenIndex).trim();
            
            // Split by commas, but ensure we don't split inside parentheses
            List<String> columnLines = splitIgnoringParentheses(columnDefinitions);
            
            for (String line : columnLines) {
                line = line.trim();
                
                // Skip constraint definitions (PRIMARY KEY, FOREIGN KEY, etc.)
                if (line.toUpperCase().startsWith("PRIMARY KEY") || 
                    line.toUpperCase().startsWith("FOREIGN KEY") ||
                    line.toUpperCase().startsWith("UNIQUE") ||
                    line.toUpperCase().startsWith("CONSTRAINT") ||
                    line.toUpperCase().startsWith("CHECK") ||
                    line.toUpperCase().startsWith("INDEX")) {
                    continue;
                }
                
                // Parse the column definition
                // Expected format: column_name TYPE [constraints]
                String[] parts = line.split("\\s+", 3);
                if (parts.length >= 2) {
                    String name = parts[0].toLowerCase();
                    String type = parts[1].toUpperCase();
                    String constraints = parts.length > 2 ? parts[2].trim() : "";
                    
                    columns.put(name, new ColumnDefinition(name, type, constraints));
                }
            }
            
        } catch (Exception e) {
            logger.error("Error extracting column definitions from SQL file: {}", e.getMessage(), e);
        }
        
        return columns;
    }
    
    /**
     * Get the existing columns from the database
     */
    private Map<String, ColumnDefinition> getExistingColumns(String tableName) {
        Map<String, ColumnDefinition> columns = new HashMap<>();
        
        try {
            List<Map<String, Object>> results = jdbcTemplate.queryForList(
                "SELECT column_name, data_type, character_maximum_length, " +
                "numeric_precision, numeric_scale, is_nullable, column_default " +
                "FROM information_schema.columns " +
                "WHERE table_name = ? " +
                "AND table_schema = current_schema()",
                tableName.toLowerCase()
            );
            
            for (Map<String, Object> row : results) {
                String name = ((String) row.get("column_name")).toLowerCase();
                String baseType = ((String) row.get("data_type")).toUpperCase();
                String type = getNormalizedType(baseType, row);
                
                String isNullable = (String) row.get("is_nullable");
                Object defaultValue = row.get("column_default");
                
                StringBuilder constraints = new StringBuilder();
                if ("NO".equals(isNullable)) {
                    constraints.append("NOT NULL");
                }
                
                if (defaultValue != null) {
                    if (constraints.length() > 0) {
                        constraints.append(" ");
                    }
                    constraints.append("DEFAULT ").append(defaultValue);
                }
                
                columns.put(name, new ColumnDefinition(name, type, constraints.toString()));
            }
        } catch (Exception e) {
            logger.error("Error getting existing columns: {}", e.getMessage(), e);
        }
        
        return columns;
    }
    
    /**
     * Normalize the data type with precision/scale/length information
     */
    private String getNormalizedType(String baseType, Map<String, Object> columnInfo) {
        // Handle types with additional parameters
        switch (baseType) {
            case "CHARACTER VARYING":
                Integer maxLength = (Integer) columnInfo.get("character_maximum_length");
                return maxLength != null ? "VARCHAR(" + maxLength + ")" : "VARCHAR";
                
            case "NUMERIC":
            case "DECIMAL":
                Integer precision = (Integer) columnInfo.get("numeric_precision");
                Integer scale = (Integer) columnInfo.get("numeric_scale");
                return (precision != null && scale != null) ? 
                    baseType + "(" + precision + "," + scale + ")" : baseType;
                    
            default:
                return mapDatabaseTypeToSqlType(baseType);
        }
    }
    
    /**
     * Maps database-returned types to the types we use in SQL files
     */
    private String mapDatabaseTypeToSqlType(String dbType) {
        switch (dbType) {
            case "CHARACTER VARYING":
                return "VARCHAR";
            case "TIMESTAMP WITHOUT TIME ZONE":
                return "TIMESTAMP";
            case "DOUBLE PRECISION":
                return "DOUBLE";
            case "BOOLEAN":
                return "BOOLEAN";
            case "INTEGER":
                return "INT";
            default:
                return dbType;
        }
    }
    
    /**
     * Find the matching closing parenthesis for the given opening parenthesis
     */
    private int findMatchingClosingParen(String text, int openPos) {
        int depth = 1;
        for (int i = openPos + 1; i < text.length(); i++) {
            if (text.charAt(i) == '(') {
                depth++;
            } else if (text.charAt(i) == ')') {
                depth--;
                if (depth == 0) {
                    return i;
                }
            }
        }
        return -1; // No matching parenthesis found
    }
    
    /**
     * Split text by commas, but ignore commas inside parentheses
     */
    private List<String> splitIgnoringParentheses(String text) {
        List<String> result = new ArrayList<>();
        int start = 0;
        int depth = 0;
        
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == '(') {
                depth++;
            } else if (c == ')') {
                depth--;
            } else if (c == ',' && depth == 0) {
                result.add(text.substring(start, i).trim());
                start = i + 1;
            }
        }
        
        // Add the last segment
        if (start < text.length()) {
            result.add(text.substring(start).trim());
        }
        
        return result;
    }
    
    /**
     * Compare if two types are equivalent
     */
    private boolean typesMatch(String expectedType, String actualType) {
        // Normalize types for comparison
        expectedType = expectedType.toUpperCase().replaceAll("\\s+", "");
        actualType = actualType.toUpperCase().replaceAll("\\s+", "");
        
        // Direct match
        if (expectedType.equals(actualType)) {
            return true;
        }
        
        // Check for compatible types
        if (expectedType.equals("INT") && actualType.equals("INTEGER")) {
            return true;
        }
        if (expectedType.equals("DOUBLE") && actualType.equals("DOUBLEPRECISION")) {
            return true;
        }
        
        // Special case for VARCHAR without length
        if (expectedType.equals("VARCHAR") && actualType.startsWith("VARCHAR(")) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Compare if constraints match (simplified version)
     */
    private boolean constraintsMatch(String expectedConstraints, String actualConstraints) {
        // This is a simplified comparison that just checks if the NOT NULL constraint matches
        boolean expectedNotNull = expectedConstraints.toUpperCase().contains("NOT NULL");
        boolean actualNotNull = actualConstraints.toUpperCase().contains("NOT NULL");
        
        // Only return false if the NOT NULL constraint doesn't match
        return expectedNotNull == actualNotNull;
    }
    
    /**
     * Helper class for column definitions
     */
    private static class ColumnDefinition {
        final String name;
        final String type;
        final String constraints;
        
        public ColumnDefinition(String name, String type, String constraints) {
            this.name = name;
            this.type = type;
            this.constraints = constraints;
        }
        
        @Override
        public String toString() {
            return name + " " + type + " " + constraints;
        }
    }
    
    // Add this method to verify the schema
    private void verifySchema(String tableName) {
        List<Map<String, Object>> columns = jdbcTemplate.queryForList(
            "SELECT column_name, data_type, character_maximum_length " +
            "FROM information_schema.columns " +
            "WHERE table_name = ? AND table_schema = current_schema()",
            tableName.toLowerCase()
        );
        
        logger.info("Schema after initialization - table {} has {} columns:", tableName, columns.size());
        for (Map<String, Object> column : columns) {
            logger.info(" - {} ({} {})", 
                column.get("column_name"),
                column.get("data_type"),
                column.get("character_maximum_length") != null ? "(" + column.get("character_maximum_length") + ")" : "");
        }
    }
}