# Lindsey Website - Project Architecture

## Overview
Full-stack art gallery website for showcasing and selling digital artwork.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Angular 21, Material 21, Tailwind CSS 3.4, TypeScript 5.9 |
| Backend | Spring Boot 3.4.5 (WAR), Java 21, JPA/Hibernate 6.6 |
| App Server | WildFly 40.0.0.Final (Undertow servlet container) |
| Database | PostgreSQL 15 (Docker) — exposed to WildFly as JNDI datasource `java:/LindseyDS` |
| Mail | WildFly JNDI mail session `java:jboss/mail/Lindsey` |
| Cache | Caffeine (in-memory) |
| Deployment | WildFly standalone profile + Dockerized Postgres (orchestrated by `run.sh`) |

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
│       ├── webapp/WEB-INF/  # jboss-web.xml (context-root /), jboss-deployment-structure.xml
│       └── resources/
│           ├── Images/       # Artwork images (72+ directories)
│           ├── static/       # Angular build output (auto-generated)
│           └── application.properties
├── wildfly/                  # trim.cli — generates standalone-lindseywebsite.xml
├── scripts/                  # Python scripts for data management (run locally)
├── postgres/init/            # Database init scripts
├── certs/                    # SSL certificates (keystore.p12, used by WildFly/Elytron)
├── docker-compose.yml        # Postgres-only container orchestration
├── Dockerfile                # (legacy embedded-Tomcat image; not used by run.sh)
├── run.sh                    # Launches Dockerized Postgres + WildFly
├── .env.dev                  # Development environment variables
└── .env.prod                 # Production environment variables
```

## WildFly Setup
The backend deploys as a WAR onto WildFly 40 at `/opt/wildfly`. Key pieces:
- **Trimmed profile**: `standalone-lindseywebsite.xml` keeps only 13 subsystems
  (undertow, ee, io, naming, datasources+jca, mail, transactions, elytron, logging,
  deployment-scanner, core-management, request-controller). Regenerate it with:
  ```bash
  cp /opt/wildfly/standalone/configuration/standalone.xml \
     /opt/wildfly/standalone/configuration/standalone-lindseywebsite.xml
  /opt/wildfly/bin/jboss-cli.sh --file=wildfly/trim.cli
  ```
- **PostgreSQL driver module**: `/opt/wildfly/modules/system/layers/base/org/postgresql/main/`
  (jar + `module.xml`), registered as the `postgresql` driver.
- **JNDI resources**: datasource `java:/LindseyDS`, mail session `java:jboss/mail/Lindsey`.
  Spring binds to them via `spring.datasource.jndi-name` / `spring.mail.jndi-name`.
- **TLS**: terminated by Undertow/Elytron on 8443 using `certs/keystore.p12`.
- **WAR descriptors**: `jboss-web.xml` deploys at root `/`; `jboss-deployment-structure.xml`
  excludes WildFly's jaxrs + logging subsystems and `org.hibernate` so Spring's own
  MVC/logback/Hibernate are used.
- All secrets in the config are `${env.*}` expressions resolved from the process
  environment (exported by `run.sh` from `.env.*`).

## Build & Deploy Flow
1. **Maven** builds the WAR: the `frontend-maven-plugin` runs `ng build` into
   `resources/static/`, then packages `lindsey-website-*.war`.
2. `run.sh` copies the WAR to `/opt/wildfly/standalone/deployments/lindsey-website.war`.
3. WildFly serves it at `https://localhost:8443/` (root context).

## Running the App
```bash
./run.sh dev          # Postgres (Docker) + build WAR + run WildFly (https://localhost:8443)
./run.sh prod         # Same with .env.prod (https://localhost:443)
./run.sh down         # Stop WildFly + Postgres container
./run.sh logs         # Tail WildFly + Postgres logs
./run.sh cert         # Generate a self-signed dev keystore
```
**IntelliJ**: use the `WildFly (dev)` run config (`.run/`). One-time setup — register the
WildFly server (Settings → Application Servers → `/opt/wildfly`, Ultimate + Jakarta EE
plugin) and set its config file to `standalone-lindseywebsite.xml`.

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
All env vars are defined in `.env.dev` / `.env.prod`. `run.sh` exports them so Postgres
(via docker-compose) and WildFly (via `${env.*}` in standalone-lindseywebsite.xml) both
see them. Note: WildFly runs on the host, so `DB_HOST` defaults to `localhost` and
`SSL_KEYSTORE_PATH` is forced to the absolute host path of `certs/keystore.p12`.
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
- Python scripts in `scripts/` are for local data management, not used in the app server
- Frontend build output goes to `backend/src/main/resources/static/` (embedded in WAR)
- The app packages as a WAR and is deployed onto WildFly/Undertow (no embedded Tomcat).
  Tomcat is excluded from `spring-boot-starter-web`; `jakarta.servlet-api` is `provided`.
