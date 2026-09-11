# 07 - Operating Containers

Companion code for [Operating Containers: Healthchecks, Resource Limits, Restart Policies, and Env Config](https://www.techdevmantra.com/guides/operating-docker-containers).

A Compose stack that shows the four things that make containers behave in production:

- **Healthchecks** on both services, and `depends_on: condition: service_healthy` so `web` starts only after `db` is healthy.
- **Resource limits** via `deploy.resources.limits` (memory and CPU per service).
- **Restart policy** `restart: unless-stopped` so a crashed container comes back.
- **Env config** via `env_file` (the `.env` file), kept out of the image.

## Files

- `docker-compose.yml` - the two services with healthchecks, limits, restart policies, and an env_file.
- `app/server.js` - a tiny zero-dependency Node server with a `/health` endpoint.
- `.env.example` - copy to `.env`; the web service loads it via `env_file`.

## Run it

```bash
cp .env.example .env
docker compose up -d
docker compose ps          # web is Up only after db is healthy
curl localhost:8080
curl localhost:8080/health
docker compose down
```
