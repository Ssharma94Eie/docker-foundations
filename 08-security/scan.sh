#!/usr/bin/env bash
# Scan an image for HIGH and CRITICAL CVEs with Trivy (run in a container).
# Usage: ./scan.sh <image>
set -euo pipefail
IMG="${1:?usage: scan.sh <image>}"
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image --severity HIGH,CRITICAL --scanners vuln "$IMG"
