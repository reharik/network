# ---- base version shared across stages ----
ARG NODE_VERSION=22

# ---- Base ----
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /repo

# ---- Builder (used in CI to build & test) ----
FROM base AS builder

# 1) copy manifests first for caching
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
# If you have internal packages with their own package.json files, uncomment:
# COPY packages/*/package.json packages/*/package.json

# 2) full install (monorepo)
RUN npm ci

# 3) copy the rest and build just the API via Nx
COPY . .
RUN npx nx build @app/api

# ---- Runtime (lean prod image) ----
FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app

# bring over built artifact & node_modules then prune dev deps
COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/package.json ./package.json
COPY --from=builder /repo/node_modules ./node_modules
RUN npm prune --omit=dev

EXPOSE 3000
CMD ["node", "dist/index.js"]
