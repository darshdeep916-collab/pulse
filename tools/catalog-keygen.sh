#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
keys_dir="${root_dir}/keys"

mkdir -p "${keys_dir}"

priv="${keys_dir}/catalog_ed25519.pem"
pub="${keys_dir}/catalog_ed25519.pub.pem"

if [[ -f "${priv}" || -f "${pub}" ]]; then
  echo "Key files already exist in ${keys_dir}."
  echo "Refusing to overwrite."
  exit 1
fi

openssl genpkey -algorithm ED25519 -out "${priv}"
openssl pkey -in "${priv}" -pubout -out "${pub}"

echo "Wrote:"
echo "  ${priv}"
echo "  ${pub}"

