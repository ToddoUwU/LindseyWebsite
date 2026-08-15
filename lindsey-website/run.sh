#!/bin/bash
# ============================================================
# Lindsey Website - Run Script (WildFly + Dockerized Postgres)
#
# The backend runs on WildFly 40 (Undertow servlet container) using the trimmed
# profile standalone-lindseywebsite.xml. PostgreSQL runs as a Docker Compose
# service. This script wires the two together.
#
# Usage:
#   ./run.sh dev          Start Postgres (Docker) + build WAR + run WildFly (https://localhost:8443)
#   ./run.sh prod         Same, production env (.env.prod, https://localhost:443)
#   ./run.sh down         Stop WildFly and the Postgres container
#   ./run.sh logs         Tail WildFly + Postgres logs
#   ./run.sh status       Show WildFly and container status
#   ./run.sh cert         Generate a self-signed dev keystore (certs/keystore.p12)
#
# Env overrides:
#   WILDFLY_HOME   (default: /opt/wildfly)
# ============================================================

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WILDFLY_HOME="${WILDFLY_HOME:-/opt/wildfly}"
WILDFLY_CONFIG="standalone-lindseywebsite.xml"
DOCKER_COMPOSE="docker compose"

COMMAND=${1:-help}
shift || true

# --- Load + export all variables from an env file, then derive host-specific ones ----
load_env() {
    local env_file="$1"
    if [ ! -f "$env_file" ]; then
        echo -e "${RED}Error: $env_file not found!${NC}"; exit 1
    fi
    set -a; # shellcheck source=/dev/null
    source "$env_file"; set +a

    # WildFly runs on the host (not in the compose network), so Postgres is on localhost.
    export DB_HOST="${DB_HOST:-localhost}"
    export DB_PORT="${DB_PORT:-5432}"
    # Elytron needs a real host path to the keystore (the .env value targets the old container).
    export SSL_KEYSTORE_PATH="$PROJECT_DIR/certs/keystore.p12"
    export SSL_KEYSTORE_PASSWORD="${SSL_KEYSTORE_PASSWORD:-changeit}"

    for v in POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB SPRING_MAIL_USERNAME SPRING_MAIL_PASSWORD; do
        if [ -z "${!v}" ]; then
            echo -e "${RED}Error: $v not set in $env_file${NC}"; exit 1
        fi
    done
}

wait_for_postgres() {
    echo -e "${YELLOW}Waiting for Postgres...${NC}"
    for _ in $(seq 1 30); do
        if $DOCKER_COMPOSE exec -T postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; then
            echo -e "${GREEN}Postgres is ready.${NC}"; return 0
        fi
        sleep 1
    done
    echo -e "${RED}Postgres did not become ready in time.${NC}"; exit 1
}

build_war() {
    echo -e "${GREEN}Building WAR (Angular + Spring Boot)...${NC}"
    mvn -f "$PROJECT_DIR/backend/pom.xml" clean package -DskipTests
}

deploy_war() {
    local war
    war="$(ls -t "$PROJECT_DIR"/backend/target/lindsey-website-*.war 2>/dev/null | head -1)"
    if [ -z "$war" ]; then
        echo -e "${RED}Error: no WAR found in backend/target.${NC}"; exit 1
    fi
    local dest="$WILDFLY_HOME/standalone/deployments"
    rm -f "$dest"/lindsey-website.war "$dest"/lindsey-website.war.*
    cp "$war" "$dest/lindsey-website.war"   # context-root '/' comes from WEB-INF/jboss-web.xml
    echo -e "${GREEN}Deployed $(basename "$war") -> $dest/lindsey-website.war${NC}"
}

start_stack() {
    local env_file="$1"; local https_port="$2"
    load_env "$env_file"
    if [ ! -f "$PROJECT_DIR/certs/keystore.p12" ]; then
        echo -e "${RED}No SSL certificate found. Run './run.sh cert' first.${NC}"; exit 1
    fi
    echo -e "${GREEN}Copying configuration to WildFly...${NC}"
    cp "$PROJECT_DIR/wildfly/$WILDFLY_CONFIG" "$WILDFLY_HOME/standalone/configuration/$WILDFLY_CONFIG"
    $DOCKER_COMPOSE --env-file "$env_file" up -d postgres
    wait_for_postgres
    build_war
    deploy_war
    echo -e "${GREEN}Starting WildFly (https://localhost:$https_port)...${NC}"
    exec "$WILDFLY_HOME/bin/standalone.sh" -c "$WILDFLY_CONFIG" -b 0.0.0.0 \
        -Djboss.https.port="$https_port"
}

case $COMMAND in
    dev)
        start_stack ".env.dev" "8443"
        ;;

    prod)
        # Binding 443 may require elevated privileges / setcap on the JVM, or a reverse proxy.
        start_stack ".env.prod" "443"
        ;;

    down)
        echo -e "${YELLOW}Stopping WildFly...${NC}"
        "$WILDFLY_HOME/bin/jboss-cli.sh" --connect --command=:shutdown 2>/dev/null || \
            echo "(WildFly not running)"
        echo -e "${YELLOW}Stopping Postgres container...${NC}"
        $DOCKER_COMPOSE down "$@"
        ;;

    logs)
        echo -e "${YELLOW}--- Postgres ---${NC}"; $DOCKER_COMPOSE logs --tail=50 postgres || true
        echo -e "${YELLOW}--- WildFly (tailing server.log, Ctrl-C to stop) ---${NC}"
        tail -f "$WILDFLY_HOME/standalone/log/server.log"
        ;;

    status)
        echo -e "${YELLOW}--- Containers ---${NC}"; $DOCKER_COMPOSE ps
        echo -e "${YELLOW}--- WildFly ---${NC}"
        if "$WILDFLY_HOME/bin/jboss-cli.sh" --connect --command=":read-attribute(name=server-state)" 2>/dev/null; then
            :
        else
            echo "WildFly not running"
        fi
        ;;

    cert)
        echo -e "${GREEN}Generating self-signed certificate (certs/keystore.p12)...${NC}"
        mkdir -p "$PROJECT_DIR/certs"
        keytool -genkeypair -alias lindsey-website -keyalg RSA -keysize 2048 -validity 3650 \
            -storetype PKCS12 -keystore "$PROJECT_DIR/certs/keystore.p12" \
            -storepass "${SSL_KEYSTORE_PASSWORD:-changeit}" \
            -dname "CN=localhost, OU=Dev, O=Lindsey Ayres Art, L=, ST=, C=US" \
            -ext "SAN=dns:localhost,ip:127.0.0.1"
        echo -e "${GREEN}Done. Set SSL_KEYSTORE_PASSWORD in .env.dev to match.${NC}"
        ;;

    help|*)
        echo "Lindsey Website - WildFly + Postgres runner"
        echo ""
        echo "Usage: ./run.sh <command>"
        echo "  dev       Postgres (Docker) + build WAR + run WildFly (https://localhost:8443)"
        echo "  prod      Same with .env.prod (https://localhost:443)"
        echo "  down      Stop WildFly and the Postgres container"
        echo "  logs      Tail WildFly + Postgres logs"
        echo "  status    Show WildFly + container status"
        echo "  cert      Generate a self-signed dev keystore"
        echo ""
        echo "First-time setup:"
        echo "  1. ./run.sh cert                                   # self-signed keystore"
        echo "  2. ./run.sh dev"
        ;;
esac
