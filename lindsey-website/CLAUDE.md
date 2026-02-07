# Lindsey Website - Project Architecture

## Overview
Full-stack art gallery website for showcasing and selling digital artwork.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Angular 21, Material 21, Tailwind CSS 3.4, TypeScript 5.9 |
| Backend | Spring Boot 3.4.1, Java 21, JPA/Hibernate 6.6 |
| Database | PostgreSQL 15 |
| Cache | Caffeine (in-memory) |
| Deployment | Docker Compose, multi-stage build |

## Project Structure
```
lindsey-website/
├── frontend/                 # Angular app
│   └── src/app/
│       ├── pages/            # home, shop, about, contact
│       ├── components/       # artwork-card, artwork-dialog, header, etc.
│       ├── services/         # artwork.service, filter.service, contact.service
│       └── models/           # TypeScript interfaces
├── backend/                  # Spring Boot app
│   └── src/main/
│       ├── java/.../lindseywebsite/
│       │   ├── Controller/   # REST endpoints
│       │   ├── Service/      # Business logic
│       │   ├── Repository/   # JPA repositories
│       │   ├── Model/        # Entities and DTOs
│       │   └── Config/       # Spring configuration
│       └── resources/
│           ├── Images/       # Artwork images (72+ directories)
│           ├── static/       # Angular build output (auto-generated)
│           └── application.properties
├── scripts/                  # Python scripts for data management (run locally)
├── postgres/init/            # Database init scripts
├── certs/                    # SSL certificates
├── docker-compose.yml        # Container orchestration
├── Dockerfile                # Multi-stage build
├── run.sh                    # Dev/prod launcher
├── .env.dev                  # Development environment variables
└── .env.prod                 # Production environment variables
```

## Docker Build Flow
1. **Stage 1 (Node 22)**: Build Angular → outputs to `dist/lindsey-website/browser/`
2. **Stage 2 (Maven)**: Copy Angular output to `resources/static/`, build Spring Boot WAR
3. **Stage 3 (JRE 21 Alpine)**: Lean runtime with just the WAR file

## Running the App
```bash
./run.sh dev          # Development (https://localhost:8443)
./run.sh prod         # Production (https://localhost:443)
./run.sh dev --build  # Rebuild and start
./run.sh down         # Stop containers
./run.sh logs         # View logs
```

## Key API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/featured | Featured artworks |
| GET | /api/categories | Unique categories |
| GET | /api/dimensions | Unique dimensions |
| GET | /api/mediums | Unique mediums |
| GET | /api/artwork/{id} | Single artwork by ID |
| GET | /api/artworks/search?q= | Search artworks |
| GET | /api/artworks/for-sale | Available for purchase |
| POST | /api/contact | Contact form submission |
| POST | /api/inquiry | Artwork inquiry form |
| GET | /api/health | Health check |

## Database
**Main table: ARTWORKS**
- id, title, art_description, dimensions, medium, categories (comma-delimited)
- Image URLs: small_image_url, medium_image_url, large_image_url
- Image dimensions: width/height for each size
- Metadata: date_produced, location, original_price, for_sale, is_featured

## Image Organization
Each artwork has a directory: `backend/src/main/resources/Images/{number}-{Title}/`
- `LindseyAyres_{Title}-sm.jpg` (thumbnail)
- `LindseyAyres_{Title}-med.jpg` (medium)
- `LindseyAyres_{Title}.jpg` (full-res)

## Environment Variables
All env vars are defined in `.env.dev` / `.env.prod` and passed via docker-compose.yml.
Key variables:
- `SPRING_PROFILES_ACTIVE` - dev/prod profile
- `POSTGRES_*` - Database credentials
- `SPRING_JPA_*` - JPA/Hibernate settings
- `SSL_*` - TLS certificate config
- `EXTERNAL_API_*` - Lumaprints/Artello API keys
- `SPRING_MAIL_*` - Email configuration

## Security Features
- Input validation (frontend + backend)
- Rate limiting (100 req/min per IP)
- HTTPS with TLS
- Security headers (CSP, XSS, clickjacking protection)
- Parameterized JPA queries

## Caching
Caffeine in-memory cache with 1-hour TTL. Featured artworks refresh every 5 minutes.

## Notes
- Python scripts in `scripts/` are for local data management, not used in container
- Frontend build output goes to `backend/src/main/resources/static/` (embedded in WAR)
- The app packages as WAR but runs as executable JAR via `java -jar app.war`
