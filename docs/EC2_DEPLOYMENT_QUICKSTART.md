# EC2 Deployment Quick Start

This is a condensed guide for deploying to EC2. For detailed instructions, see [deployment-ec2.md](./deployment-ec2.md).

## Prerequisites

- EC2 instance (Ubuntu 22.04+)
  - **t4g.micro** (ARM64) - Recommended for cost savings
  - **t3.micro** (x86_64) - Also supported
- Docker and Docker Compose installed
- SSH access to EC2

**Note**: This deployment supports ARM64 (t4g instances) natively. All Docker images are configured for ARM64.

## Quick Setup

### 1. On EC2: Install Docker

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
# Log out and back in
```

### 2. On EC2: Clone Repository

```bash
sudo mkdir -p /opt/network
sudo chown $USER:$USER /opt/network
cd /opt/network
git clone <your-repo-url> .
```

### 3. On EC2: Configure Environment

```bash
nano apps/api/.env
```

Set at minimum:

- `POSTGRES_PASSWORD` (strong password)
- `JWT_SECRET` (strong secret)
- `CORS_ORIGIN` (your EC2 IP or domain)

### 4. On EC2: Configure Caddy

Edit `Caddyfile` - use `:80` block for no domain, or domain name for HTTPS.

### 5. Build and Deploy Frontend

```bash
# On EC2 or locally
npm run build:web:production
mkdir -p frontend
cp -r apps/web/dist/* frontend/
```

### 6. Start Services

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 7. Run Migrations

```bash
docker compose -f docker-compose.prod.yml exec api sh -c "cd apps/api && npm run db:migrate:prod"
```

## GitHub Actions Setup

### Required Secrets

1. `EC2_HOST` - EC2 public IP or DNS
2. `EC2_USER` - SSH user (usually `ubuntu`)
3. `EC2_SSH_KEY` - Private SSH key
4. `VITE_API` - API URL (e.g., `http://YOUR_IP/api`)

### Generate SSH Key (if needed)

```bash
# On your local machine
ssh-keygen -t ed25519 -f ~/.ssh/network-ec2 -N ""

# Copy public key to EC2
ssh-copy-id -i ~/.ssh/network-ec2.pub ubuntu@YOUR_EC2_IP

# Add private key to GitHub Secrets as EC2_SSH_KEY
cat ~/.ssh/network-ec2
```

## Automated Deployment

Once GitHub Actions is configured, every push to `main` will:

1. Build Docker image
2. Transfer to EC2
3. Deploy and restart services
4. Run migrations
5. Verify health

## Manual Deployment

```bash
# On EC2
cd /opt/network
./scripts/deploy-ec2.sh latest
```

## Backup Setup

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/network/scripts/backup-db.sh >> /opt/network/backups/backup.log 2>&1
```

## Troubleshooting

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check health
curl http://localhost:3000/health

# Restart services
docker compose -f docker-compose.prod.yml restart
```

## Next Steps

- Set up domain and HTTPS (update Caddyfile)
- Configure backups to S3 (set `S3_BACKUP_BUCKET` env var)
- Review security settings
- Set up monitoring
