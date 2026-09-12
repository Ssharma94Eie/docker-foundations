# syntax=docker/dockerfile:1

# ---- deps: install production dependencies against the lockfile ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY app/package.json app/package-lock.json ./
RUN npm ci --omit=dev

# ---- runtime: minimal image, non-root, with a healthcheck ----
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY app/ ./
# The node:alpine image ships an unprivileged "node" user (uid 1000).
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:3000/healthz || exit 1
CMD ["node", "server.js"]
