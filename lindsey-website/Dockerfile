# ============================================================
# Multi-stage Docker build for Lindsey Website
# Node 22 | Angular 21 | TypeScript 5.9 | Java 21
# Environment variables must be provided at runtime (no defaults)
# ============================================================

# Stage 1: Build Angular frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
# Build outputs to ../backend/src/main/resources/static as configured in angular.json
# But since we're in a container, we output locally and copy later
RUN npm run build -- --configuration=production --output-path=dist/lindsey-website

# Stage 2: Build Spring Boot backend
FROM maven:3.9.5-eclipse-temurin-21 AS backend-build
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY backend/pom.xml ./backend/
WORKDIR /app/backend

# Download dependencies (cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# Copy frontend build output to Spring static resources
COPY --from=frontend-build /app/frontend/dist/lindsey-website/browser/ ./src/main/resources/static/

# Copy backend source
COPY backend/src ./src

# Optional: Build timestamp to force rebuild (pass --build-arg BUILD_TIMESTAMP=$(date +%s))
ARG BUILD_TIMESTAMP
RUN echo "Build timestamp: ${BUILD_TIMESTAMP:-none}"

# Build JAR (skip frontend build since we did it separately)
RUN mvn clean package -DskipTests -Dskip.frontend.build=true

# Stage 3: Runtime container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

# Copy the WAR file (Spring Boot packages as WAR but it's executable)
COPY --from=backend-build /app/backend/target/lindsey-website-*.war app.war

# Create certs directory (will be mounted as volume)
RUN mkdir -p /app/certs && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose HTTPS port
EXPOSE 8443

# Health check (using --no-check-certificate for self-signed certs)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider --no-check-certificate https://localhost:8443/api/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.war"]
