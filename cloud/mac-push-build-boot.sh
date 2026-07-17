#!/usr/bin/env bash
set -euo pipefail

: "${NEUROOS_SERVER_HOST:?Set NEUROOS_SERVER_HOST like ubuntu@1.2.3.4}"
: "${NEUROOS_SSH_KEY:?Set NEUROOS_SSH_KEY to your private key path}"

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ssh_common=(
  -i "${NEUROOS_SSH_KEY}"
  -o StrictHostKeyChecking=accept-new
)

echo "== Uploading repo to server =="
rsync -az --delete \
  -e "ssh ${ssh_common[*]}" \
  "${root_dir}/" \
  "${NEUROOS_SERVER_HOST}:~/my-amazing-project/"

echo "== Installing deps and building qcow2 on server =="
ssh "${ssh_common[@]}" "${NEUROOS_SERVER_HOST}" \
  "bash -lc '~/my-amazing-project/cloud/server-bootstrap-build.sh ~/my-amazing-project'"

echo "== Booting VM with VNC on server (port 5901) =="
echo "Tip: run ./cloud/mac-vnc-tunnel.sh in another terminal, then open vnc://localhost:5901"
ssh "${ssh_common[@]}" "${NEUROOS_SERVER_HOST}" \
  "bash -lc '~/my-amazing-project/cloud/server-boot-vnc.sh ~/my-amazing-project 5901'"

