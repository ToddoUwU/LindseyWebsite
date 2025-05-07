echo "Starting development environment..."
cp .env.dev .env
docker-compose up $@