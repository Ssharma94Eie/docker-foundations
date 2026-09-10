# 06 - Volumes, Bind Mounts, and Networks

Companion code for [Where Your Data Lives: Docker Volumes, Bind Mounts, and Networks](https://www.techdevmantra.com/guides/docker-volumes-bind-mounts-networks).

## Files

- `docker-compose.yml` - a Postgres service on a **named volume** (`pgdata`) plus an nginx service with a **bind mount** (`./site`).
- `site/index.html` - the page nginx serves through the bind mount. Edit it and reload; no rebuild needed.
- `backup-volume.sh <volume> [out-dir]` - back up a named volume to `<volume>.tar.gz` via a throwaway container.
- `restore-volume.sh <backup.tar.gz> <target-volume>` - restore a backup into a (new) named volume.
- `net-demo/docker-compose.yml` - two services on a user-defined network; `client` reaches `web` by name.

## Try it

```bash
# named volume + bind mount
docker compose up -d
curl localhost:8080            # edit site/index.html and curl again

# back up and restore the database volume
./backup-volume.sh 06-volumes-networks_pgdata ./backup
./restore-volume.sh ./backup/06-volumes-networks_pgdata.tar.gz pgdata_restored

# service-to-service by name
cd net-demo && docker compose up -d && docker compose logs client
```

Tested on Docker Engine 29.8.0 (Ubuntu 24.04). See the lab notes for captured output.
