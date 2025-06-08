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

# Make sure infrastructure is running first
# there is no need to rebuild the database or cache service 
# every single time, leverage how docker-compose works to only 
# rebuild the postgres and redis services if there is a configuration change 
# if they need to be rebuilt, just do that manually 
echo "Ensuring database and cache services are running..."
docker-compose up -d postgres redis

# Check for --rebuild flag to force rebuild
REBUILD=false
for arg in "$@"; do
  if [ "$arg" == "--rebuild" ]; then
    REBUILD=true
    break
  fi
done

if [ "$REBUILD" = true ]; then
  echo "Forcing rebuild of application container..."
  docker-compose build --no-cache lindsey-website
  
  # Stop and remove only the application container
  docker-compose stop lindsey-website
  docker-compose rm -f lindsey-website
fi

echo "Starting development environment..."

# Start the containers
docker-compose up lindsey-website