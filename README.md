# Network Application - Development Setup

This guide will help you get the Network application running in development mode.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Docker** and **Docker Compose** (for containerized development)
- **PostgreSQL** (if running database locally instead of Docker)

## Quick Start

### Option 1: Docker Compose (Recommended)

The easiest way to get started is using Docker Compose, which sets up all services (API, database, and LocalStack) automatically.

```bash
# Start all services
docker-compose -f docker-compose-dev.yml up

# Or use the Makefile
make docker/up/dev
```

This will:
- Start PostgreSQL database
- Start LocalStack (for local AWS service emulation)
- Start the API server with hot reload
- Run database migrations automatically
- Run database seeds automatically

### Option 2: Local Development

If you prefer to run services locally without Docker:

#### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# This will also install dependencies for all workspaces (apps/api, apps/web, packages/*)
```

#### 2. Set Up Environment Variables

Create a `.env` file in `apps/api/`:

```bash
# Application Configuration
NODE_ENV=development
PORT=3000

# Database Configuration (if running PostgreSQL locally)
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_DB=network

# JWT Security (change this in production!)
JWT_SECRET=your-secret-key-change-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:8080

# AWS Configuration (for LocalStack - use test values)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
# AWS_ENDPOINT will be set automatically by docker-compose
# For local dev without Docker, set: AWS_ENDPOINT=http://localhost:4566

# Email Configuration
FROM_EMAIL=test@example.com

# SMS Configuration
SMS_FROM_NUMBER=+1234567890

# Voice Configuration
CONNECT_INSTANCE_ID=test-instance-id
CONNECT_CONTACT_FLOW_ID=test-contact-flow-id

# Logging (optional)
LOG_LEVEL=debug
```

#### 3. Start LocalStack (for AWS service emulation)

```bash
# Start LocalStack
docker-compose -f docker-compose-dev.yml up localstack -d

# Or use the npm script
cd apps/api
npm run localstack:setup

# Verify LocalStack is running
npm run localstack:check
```

#### 4. Set Up Database

```bash
# Run migrations
npm run db:migrate

# Run seeds (optional, for test data)
npm run db:seed
```

#### 5. Start the API Server

```bash
# From the root directory
npm run dev:api

# Or from apps/api directory
cd apps/api
npm run dev
```

#### 6. Start the Web Application

In a separate terminal:

```bash
# From the root directory
npm run dev:web

# Or from apps/web directory
cd apps/web
npm run dev
```

## Accessing Services

Once everything is running:

- **API Server**: http://localhost:3000
- **Web Application**: http://localhost:8080 (or check the Vite output)
- **LocalStack Dashboard**: http://localhost:4566/_localstack/health
- **LocalStack SES (Emails)**: http://localhost:4566/_localstack/ses
- **LocalStack SNS (SMS)**: http://localhost:4566/_localstack/sns
- **PostgreSQL**: localhost:5432 (if exposed)

## Project Structure

```
network/
├── apps/
│   ├── api/          # Backend API (Koa, TypeScript)
│   └── web/          # Frontend Web App (React, Vite)
├── packages/
│   └── contracts/    # Shared types and validators
├── docker-compose-dev.yml  # Development Docker setup
└── package.json      # Root package.json with workspace scripts
```

## Common Development Tasks

### Database Operations

```bash
# Run migrations
npm run db:migrate

# Rollback last migration
cd apps/api
npm run db:rollback

# Create a new migration
cd apps/api
npm run db:make migration_name

# Run seeds
npm run db:seed
```

### Code Generation

```bash
# Generate dependency injection container types
npm run gen:container

# This runs automatically after npm install
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests for CI
npm run test:ci
```

### Linting and Formatting

```bash
# Lint all projects
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Communication Services Testing

The app uses LocalStack to emulate AWS services (SES, SNS, Connect) locally:

```bash
# Test communication services
cd apps/api
npm run test:communication

# Retrieve messages from LocalStack
npm run test:retrieve:messages
```

See [COMMUNICATION_TESTING_SETUP.md](./COMMUNICATION_TESTING_SETUP.md) for more details.

## Docker Commands

```bash
# Start all services
docker-compose -f docker-compose-dev.yml up

# Start in detached mode
docker-compose -f docker-compose-dev.yml up -d

# Stop all services
docker-compose -f docker-compose-dev.yml down

# Stop and remove volumes (clean slate)
docker-compose -f docker-compose-dev.yml down --volumes

# Rebuild containers
make docker/rebuild/dev

# View logs
docker-compose -f docker-compose-dev.yml logs -f api
docker-compose -f docker-compose-dev.yml logs -f db
docker-compose -f docker-compose-dev.yml logs -f localstack
```

## Troubleshooting

### Port Already in Use

If you get port conflicts:

```bash
# Check what's using the port
lsof -i :3000  # API port
lsof -i :5432  # PostgreSQL port
lsof -i :4566  # LocalStack port
lsof -i :8080  # Web app port

# Kill the process or change the port in your .env file
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep network_db

# Check database logs
docker-compose -f docker-compose-dev.yml logs db

# Restart the database
docker-compose -f docker-compose-dev.yml restart db
```

### LocalStack Not Working

```bash
# Check LocalStack status
cd apps/api
npm run localstack:check

# View LocalStack logs
docker logs network_localstack

# Restart LocalStack
docker-compose -f docker-compose-dev.yml restart localstack
```

### API Not Starting

```bash
# Check API logs
docker-compose -f docker-compose-dev.yml logs -f api

# Verify environment variables
docker-compose -f docker-compose-dev.yml exec api env | grep -E 'POSTGRES|AWS|JWT'

# Rebuild the API container
docker-compose -f docker-compose-dev.yml up --build api
```

### TypeScript Errors

```bash
# Regenerate container types (fixes DI-related type errors)
npm run gen:container

# Clean and rebuild
npm run build:clean
```

### Module Resolution Issues

```bash
# Clean install
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install

# Rebuild everything
npm run build:clean
```

## Development Workflow

1. **Start services**: `docker-compose -f docker-compose-dev.yml up` or run locally
2. **Make changes**: Edit code in `apps/api/src` or `apps/web/src`
3. **Hot reload**: Changes are automatically picked up (Docker uses nodemon, local uses Vite/NX)
4. **Test changes**: Use the web app or API directly
5. **Check logs**: Monitor Docker logs or terminal output
6. **Run tests**: `npm run test` to verify changes

## Environment-Specific Notes

### Development Mode Features

- **Hot reload** enabled for both API and web app
- **LocalStack** for AWS service emulation (no real AWS charges)
- **Debug logging** enabled by default
- **Source maps** for better error messages
- **Automatic migrations** on container startup

### Important Warnings

⚠️ **Never set `AWS_ENDPOINT` in production!** This is only for LocalStack testing.

⚠️ **Change `JWT_SECRET` in production!** The default value is insecure.

⚠️ **Database data persists** in Docker volumes. Use `docker-compose down --volumes` to reset.

## Next Steps

- Read [COMMUNICATION_TESTING_SETUP.md](./COMMUNICATION_TESTING_SETUP.md) for testing email/SMS/voice features
- Read [PRODUCTION_SETUP_GUIDE.md](./PRODUCTION_SETUP_GUIDE.md) for production deployment
- Read [BUILD_PROMPT.md](./BUILD_PROMPT.md) for build and architecture details

## Getting Help

- Check the logs: `docker-compose -f docker-compose-dev.yml logs`
- Review the troubleshooting section above
- Check other documentation files in the root directory
