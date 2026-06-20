# Lindsey Website - Art Gallery Platform

A modern web application showcasing Lindsey Ayres' artwork, built with Spring Boot (backend) and Angular (frontend).

## 🏗️ Architecture

**Backend**: Spring Boot 3.4.5 packaged as a WAR, deployed on **WildFly 40 (Undertow)**
- REST API with comprehensive artwork management
- PostgreSQL via a WildFly-managed JNDI datasource (`java:/LindseyDS`)
- Mail via a WildFly-managed JNDI mail session (`java:jboss/mail/Lindsey`)
- Caffeine in-memory caching
- TLS/SSL terminated by Undertow/Elytron (`certs/keystore.p12`)
- Image serving and processing

**Frontend**: Angular 21 with TypeScript
- Responsive art gallery interface
- Real-time search and filtering
- Image optimization and lazy loading
- Built into the WAR (`backend/src/main/resources/static/`)

**Infrastructure**:
- WildFly 40 at `/opt/wildfly` running the trimmed `standalone-lindseywebsite.xml`
- PostgreSQL 15 as a Docker Compose service
- `run.sh` orchestrates both; self-signed SSL for dev

## 🚀 Quick Start

### Prerequisites
- Java 21
- Node.js 22+
- Docker & Docker Compose
- WildFly 40 installed at `/opt/wildfly` (with the PostgreSQL JDBC module and
  `standalone-lindseywebsite.xml` generated via `wildfly/trim.cli` — see CLAUDE.md)
- IntelliJ IDEA Ultimate with the Jakarta EE / Application Servers plugin (recommended)

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
# Starts Postgres (Docker), builds the WAR, deploys it, and runs WildFly
./run.sh dev
```

### 3. Access the Application
- **HTTPS API**: https://localhost:8443/api/
- **HTTP**: http://localhost:8080/ (also served by Undertow; use HTTPS in production)
- **Frontend dev server**: http://localhost:4200 (when running `cd frontend && npm start`;
  its proxy forwards `/api` and `/images` to https://localhost:8443)

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

1. **Import Project**: Open as a Maven project.
2. **Register WildFly** (one-time): File → Settings → Build, Execution, Deployment →
   Application Servers → add **WildFly 40.0.0.Final** pointing at `/opt/wildfly`
   (requires the Jakarta EE / Application Servers plugin, Ultimate edition).
3. **Run Configuration**: use the bundled **`WildFly (dev)`** config (`.run/`). It deploys
   the `lindsey-website:war exploded` artifact at context root `/`, uses
   `standalone-lindseywebsite.xml`, runs **Postgres(dev)** first, and sets the dev env vars.
   If the server/artifact names don't auto-resolve, point them at your registered WildFly
   server and the war-exploded artifact.

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
- TLS terminated by WildFly/Undertow + Elytron (`certs/keystore.p12`)
- HSTS (HTTP Strict Transport Security) header on secure requests
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

### Postgres (Docker) Commands
```bash
# Start just the database
docker compose --env-file .env.dev up -d postgres

# View database logs
docker compose logs -f postgres

# Reset the database (drops the volume!)
docker compose down -v && docker compose --env-file .env.dev up -d postgres
```

### WildFly
```bash
# Regenerate the trimmed profile after changing wildfly/trim.cli
cp /opt/wildfly/standalone/configuration/standalone.xml \
   /opt/wildfly/standalone/configuration/standalone-lindseywebsite.xml
/opt/wildfly/bin/jboss-cli.sh --file=wildfly/trim.cli

# Tail the server log
tail -f /opt/wildfly/standalone/log/server.log
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
./run.sh cert

# Check keystore
keytool -list -v -keystore certs/keystore.p12
```

**WildFly Won't Boot / Datasource Errors**
```bash
# Boot the profile directly to see errors
SSL_KEYSTORE_PATH=$PWD/certs/keystore.p12 SSL_KEYSTORE_PASSWORD=changeit \
POSTGRES_USER=toadMan POSTGRES_PASSWORD=... POSTGRES_DB=lindseydb \
SPRING_MAIL_USERNAME=... SPRING_MAIL_PASSWORD=... \
/opt/wildfly/bin/standalone.sh -c standalone-lindseywebsite.xml

# Test the datasource (with Postgres running)
/opt/wildfly/bin/jboss-cli.sh --connect \
  '/subsystem=datasources/data-source=LindseyDS:test-connection-in-pool'
```

### IntelliJ Issues

**WildFly Won't Start**
- Confirm the server is registered at `/opt/wildfly` and its config file is set to
  `standalone-lindseywebsite.xml`.
- Verify the `WildFly (dev)` env vars are present (datasource/mail/TLS use `${env.*}`).
- Ensure the `lindsey-website:war exploded` artifact is selected for deployment.

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
# Application logs (WildFly)
tail -f /opt/wildfly/standalone/log/server.log

# Database logs
docker compose logs -f postgres

# Both (via run.sh)
./run.sh logs
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
- [WildFly Documentation](https://docs.wildfly.org/)
- [Angular Documentation](https://angular.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

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
