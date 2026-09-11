#!/usr/bin/env bash
# Rootless Podman setup on Ubuntu 24.04 (matches the post's Tier-B lab).
# Docker Foundations post 9: Docker vs Podman.
set -euo pipefail

# Podman, the drop-in compose tool, and pasta (rootless networking).
sudo apt-get update
sudo apt-get install -y podman podman-compose passt uidmap

# Rootless prerequisites. Ubuntu already adds a subuid/subgid range for your
# user; this just shows it. Each is "user:firstID:count".
grep -H . /etc/subuid /etc/subgid

# Optional: allow rootless containers to bind ports below 1024 (default is 1024).
# Leave this commented unless you actually need a privileged port rootless.
#   echo 'net.ipv4.ip_unprivileged_port_start=80' | sudo tee /etc/sysctl.d/99-podman-ports.conf
#   sudo sysctl --system

podman --version
podman-compose --version
echo "Rootless Podman ready. Try:  podman run --rm docker.io/library/alpine echo hello"
