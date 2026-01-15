# GitHub Actions Workflows

This directory contains CI/CD workflows for the Network application.

## Workflows

### CI (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
- **Lint**: Runs ESLint and Prettier checks
- **Test**: Runs all tests with Jest
- **Build**: Builds all projects to verify they compile

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

### Deploy to EC2 (`deploy-ec2.yml`)

Deploys the application to an EC2 instance using Docker Compose.

**Jobs:**
- **Deploy Backend**: Builds Docker image, transfers to EC2, runs deployment script
- **Deploy Frontend**: Builds frontend, transfers to EC2, restarts proxy

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch (with options to deploy backend/frontend separately)

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

### EC2 Deployment Secrets

- **`EC2_HOST`**: EC2 instance IP or DNS name
  - Example: `ec2-1-2-3-4.compute-1.amazonaws.com` or `1.2.3.4`
- **`EC2_USER`**: SSH user for EC2
  - Example: `ubuntu` (default)
- **`EC2_SSH_KEY`**: Private SSH key for EC2 access
  - Generate with: `ssh-keygen -t ed25519 -f ~/.ssh/network-ec2`
  - Copy public key to EC2: `ssh-copy-id -i ~/.ssh/network-ec2.pub ubuntu@YOUR_EC2_IP`
  - Add private key content to GitHub secret
- **`VITE_API`**: API endpoint URL for frontend builds
  - Example: `http://YOUR_EC2_IP/api` or `https://yourdomain.com/api`

## Setting Up SSH Access

### 1. Generate SSH Key Pair

```bash
ssh-keygen -t ed25519 -f ~/.ssh/network-ec2 -N ""
```

### 2. Copy Public Key to EC2

```bash
ssh-copy-id -i ~/.ssh/network-ec2.pub ubuntu@YOUR_EC2_IP
```

### 3. Test SSH Connection

```bash
ssh -i ~/.ssh/network-ec2 ubuntu@YOUR_EC2_IP
```

### 4. Add Private Key to GitHub Secrets

```bash
# Copy private key content
cat ~/.ssh/network-ec2

# Add to GitHub: Settings → Secrets and variables → Actions → New repository secret
# Name: EC2_SSH_KEY
# Value: (paste entire private key including -----BEGIN and -----END lines)
```

## Workflow Customization

### Skipping Deployment

You can skip deployment by including `[skip deploy]` in your commit message:

```bash
git commit -m "Update docs [skip deploy]"
```

Add this to the workflow:

```yaml
if: "!contains(github.event.head_commit.message, '[skip deploy]')"
```

### Manual Deployment

You can manually trigger deployment from the Actions tab:
1. Go to Actions → Deploy to EC2
2. Click "Run workflow"
3. Choose which components to deploy (backend/frontend)

### Environment-Specific Deployments

To add staging/production environments, create separate workflow files:
- `.github/workflows/deploy-ec2-staging.yml`
- `.github/workflows/deploy-ec2-production.yml`

Or use GitHub Environments with protection rules.

## Troubleshooting

### Build Failures

- Check Node.js version matches local (currently 22)
- Verify all dependencies are in `package.json`
- Check Nx cache issues (try `nx reset`)

### Deployment Failures

**SSH Connection Issues:**
- Verify `EC2_HOST` and `EC2_USER` are correct
- Check SSH key is properly formatted in GitHub secrets
- Ensure EC2 security group allows SSH (port 22) from GitHub Actions IPs
- Test SSH connection manually

**EC2 Deployment Issues:**
- Check EC2 instance is running
- Verify Docker is installed on EC2
- Check deployment script exists: `/opt/network/scripts/deploy-ec2.sh`
- View logs on EC2: `docker compose -f /opt/network/docker-compose.prod.yml logs`

**Health Check Failures:**
- Verify API is running: `curl http://localhost:3000/health` on EC2
- Check API logs for errors
- Verify environment variables are set correctly

**Frontend Deployment Issues:**
- Verify frontend directory exists: `/opt/network/frontend`
- Check file permissions
- Verify Caddyfile is configured correctly

## Security Notes

- Never commit secrets to the repository
- Use SSH keys instead of passwords
- Rotate SSH keys regularly
- Use least-privilege security groups on EC2
- Enable branch protection on `main`
- Require pull request reviews before merging
- Keep EC2 instance updated with security patches

## Deployment Flow

1. **CI runs** (lint, test, build)
2. **CD triggers** on push to `main`
3. **Backend job**:
   - Builds Docker image
   - Transfers to EC2 via SSH
   - Loads image on EC2
   - Runs deployment script
   - Verifies health
4. **Frontend job**:
   - Builds production frontend
   - Transfers to EC2
   - Restarts proxy

## Resources

- [EC2 Deployment Guide](../docs/deployment-ec2.md)
- [EC2 Quick Start](../docs/EC2_DEPLOYMENT_QUICKSTART.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
