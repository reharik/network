# EC2 Deployment Guide

## Prerequisites

- EC2 instance running (t4g.small - ARM-based)
- SSH access to EC2
- Docker and Docker Compose installed on EC2
- AWS credentials configured (for SES, SNS, Connect)

## Step 1: Test Production Build Locally First ✅

**Yes, you should test locally first!** This will catch issues before deploying to EC2.

### Test Production Docker Compose Locally

1. **Create production `.env` file** in `apps/api/.env`:

```bash
# Application Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-db-password
POSTGRES_DB=network_prod

# JWT Security (CHANGE THIS!)
JWT_SECRET=your-very-secure-jwt-secret-key-change-this-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:8080

# AWS Configuration (REAL AWS - NO LocalStack!)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-real-aws-access-key
AWS_SECRET_ACCESS_KEY=your-real-aws-secret-key
# ⚠️ DO NOT SET AWS_ENDPOINT in production!

# Email Configuration
FROM_EMAIL=noreply@backintouch.net

# SMS Configuration
SMS_FROM_NUMBER=+1234567890

# Voice Configuration
CONNECT_INSTANCE_ID=your-connect-instance-id
CONNECT_CONTACT_FLOW_ID=your-contact-flow-id
```

2. **Test the production build locally**:

```bash
# Build and run production containers
docker compose -f docker-compose.yml up --build

# Watch the logs to ensure migrations run successfully
docker compose -f docker-compose.yml logs -f api

# In another terminal, test the API
curl http://localhost:3000/health  # or whatever your health endpoint is

# Check if database migrations ran
docker compose -f docker-compose.yml exec db psql -U postgres -d network_prod -c "\dt"
```

3. **Verify everything works**:
   - Database connects
   - API starts successfully
   - Migrations run
   - No errors in logs

4. **Stop the local test**:

```bash
docker compose -f docker-compose.yml down
```

## Step 2: Prepare for EC2 Deployment

### On Your Local Machine

1. **Ensure your code is committed** (or at least know what you're deploying):

```bash
git status
git add .
git commit -m "Prepare for EC2 deployment"
```

2. **Create a deployment package** (optional - you can also clone from git on EC2):

```bash
# Create a tarball of the project (excluding node_modules, .git, etc.)
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='*.log' \
    -czf network-deploy.tar.gz .
```

## Step 3: Deploy to EC2

### Option A: Clone from Git (Recommended)

If your code is in a git repository:

```bash
# SSH into EC2
ssh your-ec2-user@your-ec2-ip

# Install git if not already installed
sudo yum install git -y  # Amazon Linux
# OR
sudo apt-get update && sudo apt-get install git -y  # Ubuntu

# Clone your repository
cd ~
git clone your-repo-url network
cd network

# Create .env file
nano apps/api/.env
# Paste your production environment variables (see Step 1)
# Save and exit (Ctrl+X, Y, Enter)
```

### Option B: Transfer Files via SCP

If you created a tarball:

```bash
# From your local machine
scp network-deploy.tar.gz your-ec2-user@your-ec2-ip:~/

# SSH into EC2
ssh your-ec2-user@your-ec2-ip

# Extract
cd ~
mkdir network
cd network
tar -xzf ../network-deploy.tar.gz

# Create .env file
nano apps/api/.env
# Paste your production environment variables
```

## Step 4: Configure EC2 Environment

### On EC2

1. **Verify Docker and Docker Compose**:

```bash
docker --version
docker compose version
```

2. **Set up environment file**:

```bash
cd ~/network
nano apps/api/.env
# Make sure all production values are set correctly
# Especially:
# - POSTGRES_PASSWORD (strong password)
# - JWT_SECRET (strong secret)
# - AWS credentials
# - DO NOT include AWS_ENDPOINT
```

3. **Configure security groups** (if not already done):
   - Allow inbound traffic on port 3000 (or your chosen port)
   - Allow inbound SSH (port 22) from your IP
   - Consider using a load balancer or reverse proxy (nginx) in front

## Step 5: Build and Run on EC2

### On EC2

1. **Build and start the services**:

```bash
cd ~/network
docker compose -f docker-compose.yml up -d --build
```

2. **Check logs**:

```bash
# View all logs
docker compose -f docker-compose.yml logs

# Follow logs
docker compose -f docker-compose.yml logs -f

# Check specific service
docker compose -f docker-compose.yml logs api
docker compose -f docker-compose.yml logs db
```

3. **Verify services are running**:

```bash
docker compose -f docker-compose.yml ps
```

4. **Test the API**:

```bash
# From EC2
curl http://localhost:3000/health

# Or from your local machine (if security group allows)
curl http://your-ec2-ip:3000/health
```

## Step 6: Post-Deployment

### Set up Auto-restart (Optional but Recommended)

Create a systemd service for auto-restart on reboot:

```bash
sudo nano /etc/systemd/system/network-app.service
```

Add:

```ini
[Unit]
Description=Network App Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/your-user/network
ExecStart=/usr/bin/docker compose -f docker-compose.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable network-app.service
sudo systemctl start network-app.service
```

### Set up Reverse Proxy (Optional but Recommended)

Install nginx:

```bash
sudo yum install nginx -y  # Amazon Linux
# OR
sudo apt-get install nginx -y  # Ubuntu
```

Configure nginx:

```bash
sudo nano /etc/nginx/conf.d/network.conf
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or EC2 IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Start nginx:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Troubleshooting

### Check Docker Logs

```bash
docker compose -f docker-compose.yml logs api
docker compose -f docker-compose.yml logs db
```

### Check Container Status

```bash
docker compose -f docker-compose.yml ps
docker ps -a
```

### Restart Services

```bash
docker compose -f docker-compose.yml restart
# OR
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml up -d
```

### Database Issues

```bash
# Check if database is accessible
docker compose -f docker-compose.yml exec db psql -U postgres -d network_prod

# Run migrations manually if needed (from inside the container)
docker compose -f docker-compose.yml exec api sh -c "cd apps/api && npm run db:migrate:prod"

# If db:migrate:prod doesn't work (knexfile.js not found), you may need to:
# 1. Check if dist/knexfile.js exists in the container
# 2. Or use tsx to run TypeScript migrations (requires tsx in production deps)
docker compose -f docker-compose.yml exec api sh -c "cd apps/api && npx tsx src/knexfile.ts migrate:latest"
```

### ARM Architecture Note

Your EC2 is t4g.small (ARM-based). The Docker images should work, but if you encounter issues:

1. **Rebuild on EC2** (recommended):

   ```bash
   docker compose -f docker-compose.yml build --no-cache
   ```

2. **Or use multi-platform builds** (if building locally):
   ```bash
   docker buildx build --platform linux/arm64 -t network-api:prod .
   ```

## Security Checklist

- [ ] Strong `POSTGRES_PASSWORD` set
- [ ] Strong `JWT_SECRET` set (not default)
- [ ] AWS credentials configured
- [ ] `AWS_ENDPOINT` NOT set (for production)
- [ ] Security groups configured properly
- [ ] Firewall rules in place
- [ ] Consider using secrets management (AWS Secrets Manager)
- [ ] Regular backups of database volume

## Next Steps

- Set up SSL/TLS (Let's Encrypt with nginx)
- Configure domain name
- Set up monitoring and logging
- Configure automated backups
- Set up CI/CD pipeline
