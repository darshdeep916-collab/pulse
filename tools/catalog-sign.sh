#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
keys_dir="${root_dir}/keys"
catalog="${root_dir}/catalog/index.json"
sig="${root_dir}/catalog/index.json.sig"

priv="${keys_dir}/catalog_ed25519.pem"

[[ -f "${catalog}" ]] || { echo "Missing catalog: ${catalog}"; exit 1; }
[[ -f "${priv}" ]] || { echo "Missing private key: ${priv}"; exit 1; }

openssl pkeyutl -sign -inkey "${priv}" -rawin -in "${catalog}" -out "${sig}"

echo "Signed:"
echo "  ${catalog}"
echo "  -> ${sig}"

