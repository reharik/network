#!/usr/bin/env bash
set -euo pipefail

cd /opt/network

# Load env so APP_NAME (and other vars) are available for compose file substitution
if [ -f /opt/network/env/prod.env ]; then
  set -a
  # shellcheck source=/dev/null
  . /opt/network/env/prod.env
  set +a
fi
: "${APP_NAME:=network-prod}"

echo "Starting EC2 deploy at $(date)"

if [ ! -d /opt/network/deploy ]; then
  echo "ERROR: /opt/network/deploy does not exist"
  exit 1
fi

if [ ! -f /opt/network/deploy/network-api.tar.gz ]; then
  echo "ERROR: /opt/network/deploy/network-api.tar.gz not found"
  exit 1
fi

if [ ! -f /opt/network/docker-compose.prod.yml ]; then
  echo "ERROR: /opt/network/docker-compose.prod.yml not found"
  exit 1
fi

echo "Loading Docker image"
gunzip -c /opt/network/deploy/network-api.tar.gz | docker load

# Tear down legacy project "network" if it exists (releases port 3000 for network-prod)
echo "Stopping legacy project if present..."
docker compose -p network --project-directory /opt/network -f /opt/network/docker-compose.prod.yml down 2>/dev/null || true

echo "Starting services via docker compose"
docker compose --env-file /opt/network/env/prod.env --project-directory /opt/network -f /opt/network/docker-compose.prod.yml up -d

echo "Running database migrations"
docker compose --env-file /opt/network/env/prod.env --project-directory /opt/network -f /opt/network/docker-compose.prod.yml exec -T api sh -c "cd /app && npx knex --knexfile apps/api/dist/knexfile.js migrate:latest"

echo "Running containers:"
docker compose --env-file /opt/network/env/prod.env --project-directory /opt/network -f /opt/network/docker-compose.prod.yml ps

echo "Cleaning up old Docker images..."
docker image prune -f

echo "Deploy complete"
