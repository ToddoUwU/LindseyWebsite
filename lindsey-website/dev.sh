#!/bin/bash

# First, copy the dev environment file
echo "Loading development environment variables..."
cp .env.dev .env

# Source the environment variables
source .env

# Now check if required variables are set
required_vars=("POSTGRES_USER" "POSTGRES_PASSWORD" "POSTGRES_DB" "APP_PORT" "DB_PORT" "REDIS_PORT")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: Required environment variable $var is not set in .env.dev file."
    exit 1
  fi
done

echo "Starting development environment..."
docker-compose up $@