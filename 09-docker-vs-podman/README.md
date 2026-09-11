# 09 - Docker vs Podman

Companion code for [Docker vs Podman: A Hands-On Comparison and Migration](https://www.techdevmantra.com/guides/docker-vs-podman). Everything here was run on a real Ubuntu 24.04 (x86_64) box with Docker Engine 29.1.3 and Podman 4.9.3.

## Files

- `compose.yaml` - one nginx service; runs unchanged under `docker compose` and `podman-compose`.
- `rootless-podman-setup.sh` - install rootless Podman on Ubuntu 24.04 and confirm the subuid/subgid prerequisites.
- `nginx.container` - a Podman Quadlet unit (the modern replacement for `podman generate systemd`) that runs nginx rootless under `systemctl --user`.

## Quick start

```bash
# 1. install rootless Podman
./rootless-podman-setup.sh

# 2. run the same compose file under either engine
docker compose up -d       # or: podman-compose up -d
curl localhost:8080
docker compose down        # or: podman-compose down

# 3. run nginx as a rootless systemd service via Quadlet
mkdir -p ~/.config/containers/systemd && cp nginx.container ~/.config/containers/systemd/
systemctl --user daemon-reload
systemctl --user start nginx.service
curl localhost:8083
```

## What actually differs (observed on this box)

| | Docker | Podman |
|---|---|---|
| Architecture | Client + a root **daemon** (`dockerd`) | **Daemonless**; the CLI forks the container directly |
| Default user model | Root daemon (rootless is opt-in) | **Rootless by default** |
| A file a container writes to a bind mount | Owned by `root` | Owned by **you** (container root maps to your UID) |
| Bind a privileged port (`-p 80:80`) rootless | Daemon runs as root, so it works | **Fails** (`>= 1024` only, unless you tune `ip_unprivileged_port_start`) |
| CLI | `docker ...` | Same verbs; `alias docker=podman` works |
| Compose | `docker compose` | `podman-compose` on the same file |
| systemd | third-party units | First-class: **Quadlet** (`.container` files) |

## Migration notes

- Fully qualify image names (`docker.io/library/nginx:alpine`) so Podman resolves them the same on every distro.
- Expect rootless port limits: map to `>= 1024`, or set `net.ipv4.ip_unprivileged_port_start`.
- Replace `docker generate`-style systemd wiring with Quadlet `.container` units.
