#!/usr/bin/env bash
set -euo pipefail

: "${S3_BUCKET:?S3_BUCKET env var is required}"

aws s3 cp "s3://${S3_BUCKET}/deployments/frontend-latest.tar.gz" /tmp/frontend.tar.gz
aws s3 cp "s3://${S3_BUCKET}/deployments/Caddyfile" /tmp/Caddyfile

rm -f /opt/network/Caddyfile
mv /tmp/Caddyfile /opt/network/Caddyfile

rm -rf /opt/network/frontend
mkdir -p /opt/network/frontend
tar -xzf /tmp/frontend.tar.gz -C /opt/network/frontend
rm -f /tmp/frontend.tar.gz

cd /opt/network
docker compose -f docker-compose.prod.yml restart proxy
echo "Frontend deployed."
