#!/usr/bin/env bash
# Restore a .tar.gz backup into a Docker named volume (created if missing).
# Usage: ./restore-volume.sh <backup.tar.gz> <target-volume>
set -euo pipefail
ARCHIVE="${1:?usage: restore-volume.sh <backup.tar.gz> <target-volume>}"
VOL="${2:?usage: restore-volume.sh <backup.tar.gz> <target-volume>}"
docker volume create "$VOL" >/dev/null
docker run --rm \
  -v "$VOL":/data \
  -v "$(cd "$(dirname "$ARCHIVE")" && pwd)":/backup \
  alpine sh -c "tar xzf /backup/$(basename "$ARCHIVE") -C /data"
echo "restored $ARCHIVE -> volume '$VOL'"
