#!/usr/bin/env bash
set -euo pipefail

if [ -f /opt/network/env/prod.env ]; then
  set -a
  # shellcheck source=/dev/null
  . /opt/network/env/prod.env
  set +a
fi
: "${APP_NAME:=network-prod}"

sleep 5

if curl -fsS http://localhost/health >/dev/null; then
  echo "Health check passed."
  exit 0
fi

echo "Health check failed."
docker compose --env-file /opt/network/env/prod.env -f /opt/network/docker-compose.prod.yml ps || true
docker compose --env-file /opt/network/env/prod.env -f /opt/network/docker-compose.prod.yml logs --tail=200 || true
exit 1
