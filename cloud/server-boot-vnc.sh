#!/usr/bin/env bash
set -euo pipefail

repo_dir="${1:-$HOME/my-amazing-project}"
port="${2:-5901}"

cd "${repo_dir}"

qcow2="$(ls -1t os/mkosi/out/*.qcow2 | head -n 1)"
if [[ -z "${qcow2}" ]]; then
  echo "No qcow2 found in ${repo_dir}/os/mkosi/out" >&2
  exit 1
fi

if [[ ! -r /usr/share/OVMF/OVMF_CODE.fd ]]; then
  echo "OVMF not found at /usr/share/OVMF/OVMF_CODE.fd (install ovmf)" >&2
  exit 1
fi

vnc_display=":1"
if [[ "${port}" != "5901" ]]; then
  # VNC ports are 5900 + display. For non-5901, approximate by choosing a display.
  # Keep it simple: only support default in this scaffold.
  echo "This scaffold currently supports port 5901 only." >&2
  exit 2
fi

echo "Booting ${qcow2}"
echo "VNC listening on 0.0.0.0${vnc_display} (tcp ${port})"

sudo qemu-system-x86_64 \
  -machine q35,accel=kvm \
  -cpu host \
  -smp 4 \
  -m 8192 \
  -drive if=pflash,format=raw,readonly=on,file=/usr/share/OVMF/OVMF_CODE.fd \
  -drive if=pflash,format=raw,file=/usr/share/OVMF/OVMF_VARS.fd \
  -drive file="${qcow2}",if=virtio \
  -net nic -net user \
  -display none \
  -vnc 0.0.0.0:1

