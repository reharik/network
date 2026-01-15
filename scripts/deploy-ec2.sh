#!/bin/bash
# Deployment script for EC2
# This script is meant to be run on the EC2 instance
# It can be invoked manually or by GitHub Actions via SSH

set -e

APP_DIR="/opt/network"
COMPOSE_FILE="$APP_DIR/docker-compose.prod.yml"
IMAGE_TAG="${1:-latest}"  # Default to 'latest' if no tag provided

cd "$APP_DIR"

echo "=========================================="
echo "Network Application Deployment"
echo "=========================================="
echo "Image tag: $IMAGE_TAG"
echo "Time: $(date)"
echo ""

# Pull latest code (if using git)
if [ -d "$APP_DIR/.git" ]; then
  echo "Pulling latest code..."
  git pull || echo "Warning: git pull failed (continuing anyway)"
fi

# Build or pull Docker image
if [ "$IMAGE_TAG" != "latest" ] && [[ "$IMAGE_TAG" =~ ^[0-9a-f]{40}$ ]]; then
  # It's a commit SHA, we need to build
  echo "Building Docker image from source..."
  docker compose -f "$COMPOSE_FILE" build api
else
  # Try to pull, fallback to build
  echo "Pulling Docker image..."
  docker compose -f "$COMPOSE_FILE" pull api || {
    echo "Pull failed, building from source..."
    docker compose -f "$COMPOSE_FILE" build api
  }
fi

# Stop services gracefully
echo "Stopping services..."
docker compose -f "$COMPOSE_FILE" stop api || true

# Start services
echo "Starting services..."
docker compose -f "$COMPOSE_FILE" up -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 10

# Health check
echo "Checking API health..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✓ API is healthy"
    break
  fi
  
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "ERROR: API health check failed after $MAX_RETRIES attempts"
    echo "Checking logs..."
    docker compose -f "$COMPOSE_FILE" logs --tail=50 api
    exit 1
  fi
  
  echo "Waiting for API... ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

# Run database migrations
echo "Running database migrations..."
if docker compose -f "$COMPOSE_FILE" exec -T api sh -c "cd apps/api && npm run db:migrate:prod" 2>/dev/null; then
  echo "✓ Migrations completed"
else
  echo "WARNING: Migration failed or not needed (check logs if issues persist)"
fi

# Show service status
echo ""
echo "Service status:"
docker compose -f "$COMPOSE_FILE" ps

echo ""
echo "=========================================="
echo "Deployment completed successfully!"
echo "=========================================="
