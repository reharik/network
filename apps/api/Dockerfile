ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-bookworm AS base
WORKDIR /repo
RUN corepack enable || true

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci --workspaces --include-workspace-root

FROM base AS build
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
RUN npx nx build @app/api --configuration=production || npx nx build @app/api

FROM node:${NODE_VERSION}-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/package.json
EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]
