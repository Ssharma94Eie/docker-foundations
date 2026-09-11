# 08 - Docker Security Basics

Companion code for [Docker Security Basics: Non-Root, Read-Only, Image Scanning, and Secrets](https://www.techdevmantra.com/guides/docker-security-basics).

## Files

- `Dockerfile` - hardened image: slim Alpine base, runs as the non-root `node` user.
- `Dockerfile.buildsecret` - the right way to use a secret at build time (`RUN --mount=type=secret`).
- `Dockerfile.baked` - the anti-pattern (`ARG` into `ENV`) that leaks a token into `docker history`. Do not use.
- `docker-compose.yml` - hardened runtime: `read_only`, `tmpfs`, `cap_drop: ALL`, `no-new-privileges`, and a mounted secret.
- `scan.sh <image>` - scan an image for HIGH/CRITICAL CVEs with Trivy.
- `server.js` - a tiny zero-dependency server that reports its uid and whether the secret is mounted.

## Hardening checklist

1. Start from a slim base (Alpine or distroless) and scan it: `./scan.sh node:22-alpine`.
2. Run as a non-root user (`USER node`, or `user:` in Compose).
3. Make the root filesystem read-only (`read_only: true`) and add a `tmpfs` for the paths that must be writable.
4. Drop all Linux capabilities (`cap_drop: ALL`) and add back only what you need.
5. Set `no-new-privileges:true`.
6. Keep secrets out of the image: use Compose `secrets:` at run time and `RUN --mount=type=secret` at build time. Never `ENV` or `COPY` a secret.

## Run it

```bash
cp api_token.txt.example api_token.txt
docker compose up -d
curl localhost:8080      # running as uid 1000, secret mounted: true
docker compose down
```
