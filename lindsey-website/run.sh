#!/bin/bash
# ============================================================
# Lindsey Website - Docker Management Script
#
# Usage:
#   ./run.sh dev          Start development environment
#   ./run.sh prod         Start production environment
#   ./run.sh dev --build  Rebuild and start dev
#   ./run.sh prod --build Rebuild and start prod
#   ./run.sh down         Stop all containers
#   ./run.sh logs         View logs
#   ./run.sh status       Check container status
#   ./run.sh cert         Generate self-signed cert for dev
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Use 'docker compose' (plugin) instead of 'docker-compose' (standalone)
DOCKER_COMPOSE="docker compose"

COMMAND=${1:-help}
shift || true

case $COMMAND in
    dev)
        echo -e "${GREEN}Starting DEVELOPMENT environment...${NC}"
        if [ ! -f ".env.dev" ]; then
            echo -e "${RED}Error: .env.dev not found!${NC}"
            exit 1
        fi
        # Check if credentials are set
        source .env.dev
        if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ]; then
            echo -e "${RED}Error: POSTGRES_USER or POSTGRES_PASSWORD not set in .env.dev${NC}"
            exit 1
        fi
        # Check for SSL keystore
        if [ ! -f "certs/keystore.p12" ]; then
            echo -e "${YELLOW}Warning: No SSL certificate found!${NC}"
            echo "Run './run.sh cert' to generate a self-signed certificate first."
            exit 1
        fi
        if [ -z "$SSL_KEYSTORE_PASSWORD" ]; then
            echo -e "${RED}Error: SSL_KEYSTORE_PASSWORD not set in .env.dev${NC}"
            exit 1
        fi
        $DOCKER_COMPOSE --env-file .env.dev up "$@"
        ;;

    prod)
        echo -e "${GREEN}Starting PRODUCTION environment...${NC}"
        if [ ! -f ".env.prod" ]; then
            echo -e "${RED}Error: .env.prod not found!${NC}"
            exit 1
        fi
        source .env.prod
        if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ]; then
            echo -e "${RED}Error: POSTGRES_USER or POSTGRES_PASSWORD not set in .env.prod${NC}"
            exit 1
        fi
        if [ -z "$SSL_KEYSTORE_PASSWORD" ]; then
            echo -e "${RED}Error: SSL_KEYSTORE_PASSWORD not set in .env.prod${NC}"
            exit 1
        fi
        # Production runs detached by default
        $DOCKER_COMPOSE --env-file .env.prod up -d "$@"
        echo -e "${GREEN}Production started! Use './run.sh logs' to view logs${NC}"
        ;;

    down)
        echo -e "${YELLOW}Stopping all containers...${NC}"
        $DOCKER_COMPOSE down "$@"
        ;;

    logs)
        $DOCKER_COMPOSE logs -f "$@"
        ;;

    status)
        $DOCKER_COMPOSE ps
        ;;

    rebuild)
        ENV=${1:-dev}
        echo -e "${YELLOW}Rebuilding $ENV environment...${NC}"
        $DOCKER_COMPOSE --env-file .env.$ENV build --no-cache
        ;;

    cert)
        echo -e "${GREEN}Generating self-signed certificate for development...${NC}"
        ./generate-dev-cert.sh
        ;;

    help|*)
        echo "Lindsey Website - Docker Management"
        echo ""
        echo "Usage: ./run.sh <command> [options]"
        echo ""
        echo "Commands:"
        echo "  dev           Start development environment (https://localhost:8443)"
        echo "  prod          Start production environment (https://localhost:443)"
        echo "  down          Stop all containers"
        echo "  logs          View container logs"
        echo "  status        Check container status"
        echo "  rebuild       Rebuild containers (./run.sh rebuild dev|prod)"
        echo "  cert          Generate self-signed SSL certificate for dev"
        echo ""
        echo "Options:"
        echo "  --build       Rebuild images before starting"
        echo ""
        echo "First-time setup:"
        echo "  1. ./run.sh cert           # Generate SSL certificate"
        echo "  2. Edit .env.dev           # Add SSL_KEYSTORE_PASSWORD"
        echo "  3. ./run.sh dev --build    # Build and start"
        echo ""
        echo "Examples:"
        echo "  ./run.sh dev              # Start dev (https://localhost:8443)"
        echo "  ./run.sh dev --build      # Rebuild and start dev"
        echo "  ./run.sh prod             # Start prod (https://localhost:443)"
        echo "  ./run.sh down             # Stop everything"
        ;;
esac

