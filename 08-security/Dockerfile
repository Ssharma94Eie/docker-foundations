# Hardened: slim base, and run as the built-in non-root 'node' user.
FROM node:22-alpine
WORKDIR /app
COPY server.js ./
# node:22-alpine ships a non-root 'node' user (uid 1000)
USER node
EXPOSE 3000
CMD ["node", "server.js"]
