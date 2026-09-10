# The optimized way: multi-stage build, slim base, production deps only,
# and cache-friendly ordering so code changes do not reinstall dependencies.

# Stage 1: install only production dependencies.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: the final runtime image. It carries only the app and its
# production node_modules, on a small Alpine base.
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY server.js ./
EXPOSE 3000
CMD ["node", "server.js"]
