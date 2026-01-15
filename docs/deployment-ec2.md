# EC2 Deployment Guide

This guide walks you through deploying the Network application to an AWS EC2 instance using Docker Compose.

## Architecture

```
┌─────────────────────────────────────────────────┐
│              EC2 Instance                        │
│                                                  │
│  ┌──────────────┐      ┌──────────────┐         │
│  │   Caddy      │──────▶│   API       │         │
│  │  (Proxy)     │      │  (Container)│         │
│  │  Port 80/443 │      │  Port 3000  │         │
│  └──────────────┘      └──────┬──────┘         │
│         │                      │                │
│         │              ┌───────▼──────┐         │
│         │              │  PostgreSQL  │         │
│         │              │  (Container)  │         │
│         │              └───────────────┘         │
│         │                                       │
│         └──────────▶ Static Frontend Files     │
│                      (Served by Caddy)          │
└─────────────────────────────────────────────────┘
```

## Prerequisites

### EC2 Instance Requirements

- **OS**: Ubuntu 22.04 LTS or later (recommended)
- **Instance Type**:
  - **t4g.micro** (ARM64, Graviton2) - Recommended for cost savings
  - **t3.micro** or **t3.small** (x86_64) - Also supported
- **Architecture**: ARM64 (t4g instances) or x86_64 (t3 instances)
- **Storage**: At least 20GB free space
- **Security Group**: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

**Note**: This deployment is configured for ARM64 (t4g.micro). All Docker images (Node.js, PostgreSQL, Caddy) support ARM64 natively.

### Software on EC2

- Docker Engine (20.10+)
- Docker Compose plugin (v2+)
- Git (for cloning repository)
- AWS CLI (optional, for backups to S3)

## Step 1: Prepare EC2 Instance

### 1.1 Install Docker

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up Docker repository
# Note: This automatically detects architecture (ARM64 for t4g, x86_64 for t3)
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine and Compose plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version

# Verify architecture (should show arm64 for t4g instances)
docker info | grep Architecture

# Log out and back in for group changes to take effect
```

### 1.2 Configure Firewall (Optional but Recommended)

```bash
# Install UFW if not present
sudo apt-get install -y ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw --force enable

# Check status
sudo ufw status
```

### 1.3 Set Up IAM Instance Role (Recommended)

Instead of storing AWS credentials, use an IAM instance role:

1. **Create IAM Role** in AWS Console (us-east-1 region):
   - Go to IAM → Roles → Create Role
   - Select "EC2" as trusted entity
   - Attach policies:
     - `AmazonS3FullAccess` (for backups)
     - `AmazonSESFullAccess` (for email)
     - `AmazonSNSFullAccess` (for SMS, optional)
   - Name it: `network-ec2-role`

   **Note**: IAM is global, but ensure your EC2 instance and S3 buckets are in us-east-1 for consistency.

2. **Attach Role to EC2 Instance**:
   - Go to EC2 → Instances → Select your instance
   - Actions → Security → Modify IAM role
   - Select `network-ec2-role`
   - Save

3. **Verify** (on EC2):
   ```bash
   # Should return role credentials
   curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
   ```

## Step 2: Set Up Application Directory

```bash
# Create application directory
sudo mkdir -p /opt/network
sudo chown $USER:$USER /opt/network
cd /opt/network

# Clone repository (or transfer files)
git clone <your-repo-url> .

# Or if you prefer to transfer files manually:
# scp -r /path/to/network/* user@ec2-ip:/opt/network/
```

## Step 3: Configure Environment Variables

```bash
cd /opt/network

# Create .env file
nano apps/api/.env
```

Add the following configuration:

```bash
# Application Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_SECURE_DB_PASSWORD_HERE
POSTGRES_DB=network_prod

# JWT Security (CHANGE THIS!)
JWT_SECRET=YOUR_VERY_SECURE_JWT_SECRET_KEY_CHANGE_THIS

# CORS Configuration
# For no domain: use http://YOUR_EC2_IP or http://YOUR_EC2_DNS
# For domain: use https://yourdomain.com
CORS_ORIGIN=http://YOUR_EC2_IP_OR_DNS

# AWS Configuration (uses IAM role if available, otherwise set these)
# Note: All AWS services should be in us-east-1 region
AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=  # Leave empty if using IAM role
# AWS_SECRET_ACCESS_KEY=  # Leave empty if using IAM role
# DO NOT SET AWS_ENDPOINT in production!

# Email Configuration
FROM_EMAIL=noreply@yourdomain.com

# SMS Configuration (optional)
SMS_FROM_NUMBER=+1234567890
SMS_DELIVERY_MODE=email_handoff  # or aws_sns

# Voice Configuration (optional)
CONNECT_INSTANCE_ID=
CONNECT_CONTACT_FLOW_ID=

# Logging
LOG_LEVEL=info
```

**Security Note**: For production, consider using AWS Systems Manager Parameter Store or Secrets Manager instead of `.env` files.

## Step 4: Configure Caddy (Reverse Proxy)

### Option A: Without Domain (HTTP Only)

Edit `Caddyfile`:

```bash
nano Caddyfile
```

Update the `:80` block with your EC2 public IP or DNS:

```caddy
:80 {
  reverse_proxy /api/* api:3000 {
    health_uri /health
    health_interval 30s
  }
  root * /usr/share/caddy/html
  file_server
  try_files {path} /index.html
}
```

**Limitations**:

- No HTTPS (browsers will show security warnings)
- Self-signed certificates won't work properly
- Some browser features may be restricted

### Option B: With Domain (HTTPS Enabled)

1. **Point your domain to EC2**:
   - Add an A record: `yourdomain.com` → `YOUR_EC2_IP`
   - (Optional) Add CNAME: `www.yourdomain.com` → `yourdomain.com`

2. **Update Caddyfile**:

```caddy
yourdomain.com {
  reverse_proxy /api/* api:3000 {
    health_uri /health
    health_interval 30s
  }
  root * /usr/share/caddy/html
  file_server
  try_files {path} /index.html
}
```

Caddy will automatically:

- Obtain SSL certificate from Let's Encrypt
- Enable HTTPS
- Auto-renew certificates

## Step 5: Build and Deploy Frontend

### On Your Local Machine or CI/CD

```bash
# Build production frontend
export VITE_API=http://YOUR_EC2_IP/api  # or https://yourdomain.com/api
npm run build:web:production

# Transfer to EC2
scp -r apps/web/dist/* user@ec2-ip:/opt/network/frontend/
```

Or create the directory on EC2 and build there:

```bash
# On EC2
cd /opt/network
mkdir -p frontend

# Build frontend (requires Node.js on EC2, or use CI/CD)
npm install
export VITE_API=http://YOUR_EC2_IP/api
npm run build:web:production
cp -r apps/web/dist/* frontend/
```

## Step 6: Start Services

```bash
cd /opt/network

# Pull latest images (if using remote images)
docker compose -f docker-compose.prod.yml pull

# Build and start services
docker compose -f docker-compose.prod.yml up -d --build

# Check status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

## Step 7: Run Database Migrations

```bash
# Run migrations
docker compose -f docker-compose.prod.yml exec api sh -c "cd apps/api && npm run db:migrate:prod"

# Or if migrations need tsx:
docker compose -f docker-compose.prod.yml exec api sh -c "cd apps/api && npx tsx src/knexfile.ts migrate:latest"
```

## Step 8: Verify Deployment

```bash
# Check API health
curl http://localhost:3000/health
# or
curl http://YOUR_EC2_IP/health

# Check API endpoint
curl http://YOUR_EC2_IP/api/health

# Check frontend
curl http://YOUR_EC2_IP/
```

## Database Backups

### Option 1: Backup to S3 (Recommended)

**Note**: Create the S3 bucket in the us-east-1 region for consistency with other AWS services.

Create backup script `/opt/network/scripts/backup-db.sh`:

```bash
#!/bin/bash
set -e

BACKUP_DIR="/opt/network/backups"
S3_BUCKET="your-network-backups"  # Create this bucket in us-east-1 region
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="network_db_${TIMESTAMP}.sql.gz"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
docker compose -f /opt/network/docker-compose.prod.yml exec -T db \
  pg_dump -U postgres network_prod | gzip > "$BACKUP_DIR/$BACKUP_FILE"

# Upload to S3 (uses IAM role)
aws s3 cp --region us-east-1 "$BACKUP_DIR/$BACKUP_FILE" "s3://$S3_BUCKET/"

# Keep last 7 days locally, delete older backups
find "$BACKUP_DIR" -name "network_db_*.sql.gz" -mtime +7 -delete

# Keep last 30 days in S3
aws s3 ls --region us-east-1 "s3://$S3_BUCKET/" | while read -r line; do
  BACKUP_DATE=$(echo "$line" | awk '{print $1" "$2}')
  BACKUP_NAME=$(echo "$line" | awk '{print $4}')
  if [ -n "$BACKUP_NAME" ]; then
    BACKUP_AGE=$(($(date +%s) - $(date -d "$BACKUP_DATE" +%s)))
    if [ $BACKUP_AGE -gt 2592000 ]; then  # 30 days in seconds
      aws s3 rm --region us-east-1 "s3://$S3_BUCKET/$BACKUP_NAME"
    fi
  fi
done

echo "Backup completed: $BACKUP_FILE"
```

Make it executable:

```bash
chmod +x /opt/network/scripts/backup-db.sh
```

### Option 2: Local Backups Only

Simpler version without S3:

```bash
#!/bin/bash
set -e

BACKUP_DIR="/opt/network/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="network_db_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

docker compose -f /opt/network/docker-compose.prod.yml exec -T db \
  pg_dump -U postgres network_prod | gzip > "$BACKUP_DIR/$BACKUP_FILE"

# Keep last 7 days
find "$BACKUP_DIR" -name "network_db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

### Set Up Cron Job

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/network/scripts/backup-db.sh >> /opt/network/backups/backup.log 2>&1
```

## Observability

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f db
docker compose -f docker-compose.prod.yml logs -f proxy

# Last 100 lines
docker compose -f docker-compose.prod.yml logs --tail=100 api
```

### Log Rotation

Docker handles log rotation by default. To configure:

Create `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:

```bash
sudo systemctl restart docker
```

### Optional: CloudWatch Agent

For centralized logging:

1. Install CloudWatch agent on EC2
2. Configure to send Docker logs
3. View logs in CloudWatch Logs console

## Rollback Strategy

### Rollback to Previous Image

```bash
cd /opt/network

# List available images
docker images | grep network-api

# Stop current service
docker compose -f docker-compose.prod.yml stop api

# Update docker-compose.prod.yml to use previous image tag
# Then restart
docker compose -f docker-compose.prod.yml up -d api
```

### Rollback Database Migration

```bash
# Rollback last migration
docker compose -f docker-compose.prod.yml exec api sh -c "cd apps/api && npm run db:rollback"

# Or restore from backup
gunzip < /opt/network/backups/network_db_YYYYMMDD_HHMMSS.sql.gz | \
  docker compose -f docker-compose.prod.yml exec -T db psql -U postgres network_prod
```

## Maintenance

### Update Application

```bash
cd /opt/network

# Pull latest code
git pull

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build

# Run migrations if needed
docker compose -f docker-compose.prod.yml exec api sh -c "cd apps/api && npm run db:migrate:prod"
```

### Update Frontend

```bash
# Rebuild frontend
npm run build:web:production
cp -r apps/web/dist/* frontend/

# Restart proxy (to pick up new files)
docker compose -f docker-compose.prod.yml restart proxy
```

### Clean Up

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes (be careful!)
docker volume prune

# View disk usage
docker system df
```

## Security Hardening

### 1. Keep System Updated

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

### 2. Use Strong Passwords

- Database password: Use a strong, random password
- JWT secret: Use a strong, random secret (at least 32 characters)

### 3. Restrict Database Access

The database is only accessible from within the Docker network (not exposed to host).

### 4. Use IAM Roles

Avoid storing AWS credentials in `.env` files. Use IAM instance roles instead.

### 5. Regular Backups

Ensure backups are running and tested regularly.

### 6. Monitor Logs

Regularly check logs for suspicious activity:

```bash
docker compose -f docker-compose.prod.yml logs api | grep -i error
```

## ARM64 (t4g.micro) Specific Notes

### Architecture Verification

To verify your EC2 instance is ARM64:

```bash
# Check system architecture
uname -m
# Should output: aarch64 (ARM64)

# Check Docker architecture
docker info | grep Architecture
# Should output: Architecture: aarch64
```

### Building Images on ARM64

When building Docker images directly on the EC2 instance:

```bash
# Images will automatically build for ARM64
docker compose -f docker-compose.prod.yml build

# Verify image architecture
docker inspect network-api:prod | grep Architecture
# Should show: "Architecture": "arm64"
```

### GitHub Actions ARM64 Builds

The GitHub Actions workflow uses Docker Buildx to build ARM64 images on x86_64 runners. This works transparently - images are built for ARM64 and transferred to your EC2 instance.

If you encounter build issues:

1. Ensure `docker/setup-buildx-action@v3` is in the workflow
2. Check that `--platform linux/arm64` is specified in the build command
3. Verify the image loads correctly on EC2: `docker load < /tmp/network-api-image.tar.gz`

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs

# Check container status
docker compose -f docker-compose.prod.yml ps

# Check if ports are in use
sudo netstat -tulpn | grep -E ':(80|443|3000)'
```

### Database Connection Issues

```bash
# Check database is running
docker compose -f docker-compose.prod.yml ps db

# Check database logs
docker compose -f docker-compose.prod.yml logs db

# Test connection
docker compose -f docker-compose.prod.yml exec db psql -U postgres -d network_prod
```

### Frontend Not Loading

```bash
# Check proxy logs
docker compose -f docker-compose.prod.yml logs proxy

# Verify frontend files exist
ls -la /opt/network/frontend/

# Check Caddyfile syntax
docker compose -f docker-compose.prod.yml exec proxy caddy validate --config /etc/caddy/Caddyfile
```

### Health Check Failing

```bash
# Test API directly
curl http://localhost:3000/health

# Check API logs
docker compose -f docker-compose.prod.yml logs api
```

### ARM64 Architecture Issues

If you see errors about "exec format error" or "platform not supported":

```bash
# Verify Docker is running on ARM64
docker info | grep Architecture

# Rebuild images for correct architecture
docker compose -f docker-compose.prod.yml build --no-cache

# Check image platform
docker inspect network-api:prod | grep -A 5 Architecture
```

If building on a different architecture (e.g., local x86_64 machine), use buildx:

```bash
docker buildx build --platform linux/arm64 -t network-api:prod .
```

## Directory Structure on EC2

```
/opt/network/
├── apps/
│   └── api/
│       └── .env                    # Environment variables
├── frontend/                       # Static frontend files
├── backups/                        # Database backups
├── scripts/
│   └── backup-db.sh               # Backup script
├── docker-compose.prod.yml        # Production compose file
├── Caddyfile                      # Caddy configuration
└── .git/                          # Git repository (optional)
```

## Next Steps

1. Set up automated deployments via GitHub Actions (see CI/CD documentation)
2. Configure monitoring and alerting
3. Set up domain and enable HTTPS
4. Review and test backup/restore procedures
5. Document any custom configurations

## Cost Estimate

For a personal app with low usage:

- **EC2 t4g.micro** (ARM64): ~$6-8/month (or free tier eligible) - **Recommended**
- **EC2 t3.micro** (x86_64): ~$7-10/month (or free tier eligible)
- **EBS Storage (20GB)**: ~$2/month
- **Data Transfer**: Minimal for low usage
- **Total**: ~$8-12/month (t4g.micro) or ~$10-15/month (t3.micro)

With AWS free tier (first 12 months): ~$0-5/month

**Note**: t4g.micro instances are typically 10-20% cheaper than t3.micro and offer similar performance for this workload.
