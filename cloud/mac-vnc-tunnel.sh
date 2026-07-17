#!/usr/bin/env bash
set -euo pipefail

: "${NEUROOS_SERVER_HOST:?Set NEUROOS_SERVER_HOST like ubuntu@1.2.3.4}"
: "${NEUROOS_SSH_KEY:?Set NEUROOS_SSH_KEY to your private key path}"

exec ssh -i "${NEUROOS_SSH_KEY}" \
  -o StrictHostKeyChecking=accept-new \
  -L 5901:localhost:5901 \
  "${NEUROOS_SERVER_HOST}"

