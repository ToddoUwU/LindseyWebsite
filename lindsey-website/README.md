# Lindsey Website - Art Gallery Platform

A modern web application showcasing Lindsey Ayres' artwork, built with Spring Boot (backend) and Angular (frontend).

## 🏗️ Architecture

**Backend**: Spring Boot 3.4.1 with embedded Tomcat
- REST API with comprehensive artwork management
- PostgreSQL database with JPA/Hibernate
- Redis caching for performance
- TLS/SSL encryption
- Image serving and processing

**Frontend**: Angular 18 with TypeScript
- Responsive art gallery interface
- Real-time search and filtering
- Image optimization and lazy loading

**Infrastructure**: Docker Compose
- PostgreSQL 15 database
- Redis 7 cache
- Automated SSL certificate management

## 🚀 Quick Start

### Prerequisites
- Java 21
- Node.js 22+
- Docker & Docker Compose
- IntelliJ IDEA Ultimate (recommended)

### 1. Clone & Setup
```bash
git clone <repository-url>
cd lindsey-website

# Copy environment files
cp .env.example .env.dev
cp .env.example .env.prod

# Edit with your credentials
nano .env.dev  # Add database password
```

### 2. Start Development Environment
```bash
# Start database and cache
docker compose up -d postgres redis

# Start the application
./run.sh dev
```

### 3. Access the Application
- **HTTPS API**: https://localhost:8443/api/
- **HTTP API**: http://localhost:8080/api/
- **Frontend**: http://localhost:4200 (when Angular dev server is running)

## 📋 API Endpoints

### Core Endpoints
```
GET  /api/featured           # Featured artworks
GET  /api/categories         # Available categories
GET  /api/dimensions         # Available dimensions
GET  /api/mediums           # Available mediums
GET  /api/years             # Available years

GET  /api/artwork/{id}      # Artwork by ID
GET  /api/artwork/title/{title} # Artwork by title

GET  /api/artworks/search?q={term} # Search artworks
GET  /api/artworks/category/{cat}  # Filter by category
GET  /api/artworks/medium/{med}    # Filter by medium
GET  /api/artworks/for-sale        # Artworks for sale
```

### Admin Endpoints
```
POST /api/admin/cache/evict  # Clear all caches
```

### Response Format
```json
{
  "id": 67,
  "title": "The Christmas Animals",
  "artDescription": "Artist's first published children's book...",
  "dimensions": "12\"x9\"",
  "smallImageUrl": "/images/68-TheChristmasAnimals/LindseyAyres_TheChristmasAnimals-sm.jpg",
  "mediumImageUrl": "/images/68-TheChristmasAnimals/LindseyAyres_TheChristmasAnimals-med.jpg",
  "largeImageUrl": "/images/68-TheChristmasAnimals/LindseyAyres_TheChristmasAnimals.jpg",
  "categories": "Children,Illustration,Animals,Nature,Books,Painting,Cartoons,Acrylic,Spiritual",
  "medium": "Acrylic",
  "dateProduced": "2002-01-01",
  "originalPrice": 0.00,
  "forSale": false,
  "location": "Salt Lake City, Utah",
  "isFeatured": true
}
```

## 🛠️ Development Setup

### IntelliJ IDEA Configuration

1. **Import Project**: Open as Maven project
2. **Configure Tomcat**:
   - File → Settings → Application Servers
   - Add Tomcat Server pointing to `./tomcat/`
3. **Run Configuration**:
   - VM Options: `-Dspring.profiles.active=dev -Dspring.datasource.password=YOUR_DB_PASSWORD`
   - Environment Variables: `SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/lindseydb`

### Database Schema
The application uses automatic schema creation. Key tables:
- `ARTWORKS`: Main artwork data
- `ARTWORK_PRODUCTS`: Print products (future use)

### Image Management
Images are stored in `backend/src/main/resources/Images/` with naming convention:
- Large: `LindseyAyres_{TitleClean}.jpg`
- Medium: `LindseyAyres_{TitleClean}-med.jpg`
- Small: `LindseyAyres_{TitleClean}-sm.jpg`

## 🔒 Security Features

### HTTPS/TLS
- Automatic HTTP → HTTPS redirects in production
- HSTS (HTTP Strict Transport Security)
- Content Security Policy (CSP)
- XSS protection headers
- Clickjacking prevention

### Input Validation
- SQL injection prevention via parameterized queries
- XSS protection with input sanitization
- Rate limiting (100 requests/minute per IP)
- File upload restrictions

### Authentication (Future)
- API key authentication for external integrations
- Basic Auth for Lumaprints API
- Bearer token for Artello API

## 🚀 Deployment

### Production Environment
```bash
# Build and deploy
./run.sh prod

# Check status
./run.sh status

# View logs
./run.sh logs
```

### SSL Certificate Setup
```bash
# Generate self-signed cert (dev)
./run.sh cert

# For production: Add real certificate to certs/keystore.p12
# Update SSL_KEYSTORE_PASSWORD in .env.prod
```

### Docker Commands
```bash
# Start all services
docker compose --env-file .env.prod up -d

# Rebuild application
docker compose --env-file .env.prod build --no-cache app

# View logs
docker compose logs -f app
```

## 🔧 Configuration

### Environment Variables

#### Database
```bash
POSTGRES_USER=toadMan
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=lindseydb
DB_PORT=5432
```

#### Application
```bash
ENVIRONMENT=prod|dev
HTTPS_PORT=443
LOG_LEVEL=INFO|DEBUG
DB_RECREATE_TABLES=false
```

#### SSL/TLS
```bash
SSL_KEYSTORE_PATH=/app/certs/keystore.p12
SSL_KEYSTORE_PASSWORD=your_keystore_password
SSL_KEY_ALIAS=lindsey-website
```

#### External APIs (Optional)
```bash
EXTERNAL_API_LUMAPRINTS_API_KEY=your_key
EXTERNAL_API_LUMAPRINTS_API_SECRET=your_secret
EXTERNAL_API_ARTELLO_API_KEY=your_key
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs lindsey-website-postgres-1

# Reset database
docker compose down -v && docker compose up -d postgres
```

**Port Already in Use**
```bash
# Find process using port
sudo lsof -i :8080
sudo lsof -i :8443

# Kill process
sudo kill -9 <PID>
```

**Images Not Loading**
- Check image files exist in `backend/src/main/resources/Images/`
- Verify naming convention matches database URLs
- Check StaticResourceConfig.java configuration

**SSL Certificate Issues**
```bash
# Regenerate dev certificate
./generate-dev-cert.sh

# Check keystore
keytool -list -v -keystore certs/keystore.p12
```

### IntelliJ Issues

**Tomcat Won't Start**
- Check VM parameters include correct database password
- Verify environment variables are set
- Check Tomcat configuration points to correct directory

**Hot Reload Not Working**
- Use "Update classes and resources" instead of restart
- Check file is saved before updating

## 📊 Monitoring

### Application Metrics
- Spring Boot Actuator endpoints (when enabled)
- Database connection pool status
- Cache hit/miss ratios
- Request/response times

### Logs
```bash
# Application logs
docker compose logs -f app

# Database logs
docker compose logs -f postgres

# All services
docker compose logs -f
```

## 🔄 Data Management

### Artwork Import
```bash
cd scripts
python3 merge_artworks.py --env dev --generate-thumbnails --verbose
```

### Cache Management
```bash
# Clear all caches
curl -X POST http://localhost:8080/api/admin/cache/evict
```

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Angular Documentation](https://angular.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Status**: ✅ Production Ready
**Artworks**: 68 loaded
**Features**: Gallery, Search, Filtering, SSL, Caching
**Security**: Enterprise-grade with input validation and HTTPS
