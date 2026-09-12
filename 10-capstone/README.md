# 10 - Capstone: Dockerize Your Own App End to End

Companion code for the [Docker Foundations capstone](https://www.techdevmantra.com/guides/dockerize-app-end-to-end). It pulls the whole series together: a lean multi-stage image, a hardened production Compose stack (healthchecks, limits, read-only, non-root), a CI build that pushes to GHCR, and a deploy behind Caddy with automatic HTTPS.

Verified on real Docker: built and run on Docker Engine 29.8.0 (image 233MB), deployed on an Ubuntu 24.04 VM.

## What you build

A small Express + Postgres app (a visit counter with a `/healthz` probe), containerized the way you would actually ship it.

## Files

- `app/` - the application (`server.js`, `package.json`, `package-lock.json`).
- `Dockerfile` - multi-stage build; non-root `node` user; `HEALTHCHECK`.
- `.dockerignore` - keeps the build context small.
- `compose.prod.yml` - app + Postgres + Caddy, with healthchecks, `depends_on: service_healthy`, memory/CPU limits, `read_only`, `tmpfs`, `cap_drop: ALL`, and `no-new-privileges`.
- `Caddyfile` - reverse proxy with HTTPS (Let's Encrypt on a public IP, or a local CA on a lab box).
- `.env.example` - copy to `.env` and fill in.
- `../.github/workflows/capstone-ghcr.yml` - CI that builds the image and pushes it to GHCR.

## Run it locally

```bash
cp .env.example .env        # set POSTGRES_PASSWORD; SITE_ADDRESS=localhost
docker build -t tdm-capstone:local .
docker compose -f compose.prod.yml up -d
curl -k https://localhost   # the counter page, over HTTPS via Caddy
docker compose -f compose.prod.yml ps   # all healthy
docker compose -f compose.prod.yml down -v
```

## Ship it (CI + deploy)

1. **CI to GHCR:** pushing to `main` runs `capstone-ghcr.yml`, which builds and pushes `ghcr.io/<you>/tdm-capstone`.
2. **Deploy on a VPS:** copy this folder to the server, set `.env` with `SITE_ADDRESS=<public-ip>.sslip.io` and `APP_IMAGE` pointing at your GHCR image (or build on the box), remove `tls internal` from the `Caddyfile` for a real Let's Encrypt certificate, then `docker compose -f compose.prod.yml up -d`. Caddy fetches HTTPS automatically, no domain purchase required.

## The whole series

This capstone uses every earlier post: [install](https://www.techdevmantra.com/guides/install-docker-macos-windows-wsl2-linux), [first containers](https://www.techdevmantra.com/guides/run-your-first-docker-containers), [Compose](https://www.techdevmantra.com/guides/docker-compose-multi-service-stack), [lean images](https://www.techdevmantra.com/guides/lean-docker-images-multi-stage-builds), [volumes and networks](https://www.techdevmantra.com/guides/docker-volumes-bind-mounts-networks), [operating](https://www.techdevmantra.com/guides/operating-docker-containers), and [security](https://www.techdevmantra.com/guides/docker-security-basics).
