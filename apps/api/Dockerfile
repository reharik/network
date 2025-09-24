ARG NODE_VERSION=22

# =============================================================================
# BASE IMAGE SETUP
# =============================================================================
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /repo
# Install git for GitHub dependencies
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
RUN corepack enable || true

# =============================================================================
# DEPENDENCY PREPARATION STAGES
# =============================================================================

# Development and staging dependencies - includes all dependencies
FROM base AS deps-dev-staging
COPY package.json package-lock.json ./
# Create workspace directories first
RUN mkdir -p apps/api packages/contracts
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN npm ci --workspaces --include-workspace-root --ignore-scripts

# Production dependencies - only production dependencies
FROM base AS deps-prod
COPY package.json package-lock.json ./
# Create workspace directories first
RUN mkdir -p apps/api packages/contracts
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN npm ci --workspaces --include-workspace-root --only=production --ignore-scripts

# =============================================================================
# BUILD STAGE
# =============================================================================

# Build stage - creates production build for staging and production
FROM base AS build
WORKDIR /repo
COPY --from=deps-dev-staging /repo/node_modules ./node_modules
COPY . .
# Generate container types after source code is available
RUN cd apps/api && npm run gen:container
RUN npx nx build @app/api --configuration=production

# =============================================================================
# RUNTIME STAGES
# =============================================================================

# Development runtime - full environment with hot reloading
FROM node:${NODE_VERSION}-slim AS dev
ENV NODE_ENV=development
WORKDIR /app
COPY --from=deps-dev-staging /repo/node_modules ./node_modules
COPY . .
RUN npm install -g nodemon
EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace=@app/api"]

# Production runtime - minimal dependencies, optimized for production
FROM node:${NODE_VERSION}-slim AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=deps-prod /repo/node_modules ./node_modules
COPY apps/api/package.json ./apps/api/package.json
EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]

# Staging/CI runtime - production base with CI tools
FROM production AS staging
ENV NODE_ENV=staging
COPY --from=deps-dev-staging /repo/node_modules ./node_modules
COPY eslint-shared.js ./

