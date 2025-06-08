# Stage 1: Build Angular frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build -- --output-path=../backend/src/main/resources/static

# Stage 2: Build Spring Boot backend with improved caching for development
FROM maven:3.9.5-eclipse-temurin-21 AS backend-build
WORKDIR /app/backend

# Copy pom.xml first for better layer caching
COPY backend/pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline

# Add build timestamp to force rebuilds (for development)
ARG BUILD_TIMESTAMP
RUN echo "Build timestamp: $BUILD_TIMESTAMP"

# Build the application
RUN mvn clean package -DskipTests

# Stage 3: Final runtime container
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend-build /app/backend/target/lindsey-website-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

# Set Spring Boot profile through ENV for runtime control
# Use default value if ENVIRONMENT variable is not set
ENV SPRING_PROFILES_ACTIVE=${ENVIRONMENT:-dev}