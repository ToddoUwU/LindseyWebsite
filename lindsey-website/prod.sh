echo "Starting production environment..."
cp .env.prod .env
docker-compose up -d $@