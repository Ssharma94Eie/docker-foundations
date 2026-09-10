#!/usr/bin/env bash
# Back up a Docker named volume to a .tar.gz using a throwaway container.
# Usage: ./backup-volume.sh <volume-name> [output-dir]
set -euo pipefail
VOL="${1:?usage: backup-volume.sh <volume-name> [output-dir]}"
OUT="${2:-.}"
mkdir -p "$OUT"
docker run --rm \
  -v "$VOL":/data:ro \
  -v "$(cd "$OUT" && pwd)":/backup \
  alpine tar czf "/backup/${VOL}.tar.gz" -C /data .
echo "backed up volume '$VOL' -> $OUT/${VOL}.tar.gz"
