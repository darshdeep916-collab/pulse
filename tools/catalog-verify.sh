#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
keys_dir="${root_dir}/keys"
catalog="${root_dir}/catalog/index.json"
sig="${root_dir}/catalog/index.json.sig"

pub="${keys_dir}/catalog_ed25519.pub.pem"

[[ -f "${catalog}" ]] || { echo "Missing catalog: ${catalog}"; exit 1; }
[[ -f "${sig}" ]] || { echo "Missing signature: ${sig}"; exit 1; }
[[ -f "${pub}" ]] || { echo "Missing public key: ${pub}"; exit 1; }

openssl pkeyutl -verify -pubin -inkey "${pub}" -rawin -in "${catalog}" -sigfile "${sig}"

echo "OK: signature verified"

