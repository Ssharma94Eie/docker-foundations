# 03 - Compose Stack (Web + Postgres + Redis)

Companion code for [Docker Compose: Run a Multi-Service Stack](https://www.techdevmantra.com/guides/docker-compose-multi-service-stack).

A small Node API, Postgres, and Redis wired together and started with one command. The API increments a Redis counter and inserts a Postgres row on each request, which proves all three services talk over the Compose network.

## Files

- `docker-compose.yml` - the three services (api, postgres, redis).
- `app/` - a tiny Node HTTP server (no Dockerfile yet; it installs deps at start over a bind mount).
- `db/init.sql` - creates the `hits` table on first run.
- `.env.example` - copy to `.env`, which Compose reads for the Postgres credentials.

## Run it

```bash
cp .env.example .env
docker compose up -d
curl localhost:8080
curl localhost:8080/hello
docker compose down
```
