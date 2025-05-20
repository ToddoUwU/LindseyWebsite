required_vars=("POSTGRES_USER" "POSTGRES_PASSWORD" "POSTGRES_DB" "APP_PORT" "DB_PORT" "REDIS_PORT")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: Required environment variable $var is not set."
    exit 1
  fi
done
echo "Starting development environment..."
cp .env.dev .env
docker-compose up $@