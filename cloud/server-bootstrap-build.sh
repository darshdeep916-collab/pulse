#!/usr/bin/env bash
set -euo pipefail

repo_dir="${1:-$HOME/my-amazing-project}"

if [[ ! -d "${repo_dir}" ]]; then
  echo "Repo dir not found: ${repo_dir}" >&2
  exit 1
fi

sudo apt-get update
sudo apt-get install -y --no-install-recommends \
  ca-certificates curl git \
  mkosi qemu-utils qemu-system-x86 ovmf \
  openssh-client

cd "${repo_dir}"

sudo ./build/os-build.sh

echo "Build complete. Latest qcow2:"
ls -1t os/mkosi/out/*.qcow2 | head -n 1

