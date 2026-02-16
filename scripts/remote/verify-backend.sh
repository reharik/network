#!/usr/bin/env bash
set -euo pipefail

: "${APP_NAME:=network}"

sleep 5

if curl -fsS http://localhost/health >/dev/null; then
  echo "Health check passed."
  exit 0
fi

echo "Health check failed."
docker compose -p "${APP_NAME}" -f /opt/network/docker-compose.prod.yml ps || true
docker compose -p "${APP_NAME}" -f /opt/network/docker-compose.prod.yml logs --tail=200 || true
exit 1
