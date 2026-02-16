#!/usr/bin/env bash
set -euo pipefail

: "${S3_BUCKET:?S3_BUCKET env var is required}"
: "${APP_NAME:?APP_NAME env var is required}"

mkdir -p /opt/network/deploy /opt/network/scripts

aws s3 cp "s3://${S3_BUCKET}/deployments/${APP_NAME}/network-api-latest.tar.gz" \
  /opt/network/deploy/network-api.tar.gz

aws s3 cp "s3://${S3_BUCKET}/deployments/${APP_NAME}/docker-compose.prod.yml" \
  /opt/network/docker-compose.prod.yml

aws s3 cp "s3://${S3_BUCKET}/deployments/${APP_NAME}/deploy-ec2.sh" \
  /opt/network/scripts/deploy-ec2.sh

chmod +x /opt/network/scripts/deploy-ec2.sh
echo "Backend artifacts downloaded."
