# Updates, signing, rollback (scaffold)

This repo intentionally separates three update domains:

1. **System image updates** (the OS itself)
2. **Catalog metadata updates** (what apps are available and how to install them)
3. **App updates** (Flatpak/PWA/Android)

## Catalog metadata signing (implemented in-repo)

- `catalog/index.json` is a small, signed JSON index.
- `tools/catalog-keygen.sh` generates a signing keypair.
- `tools/catalog-sign.sh` signs the catalog.
- `tools/catalog-verify.sh` verifies the signature.

This is the “control plane” that scales to huge app counts: the catalog can reference Flatpak appIds, PWA URLs, or Android package identifiers without bundling everything.

## App updates

- **Flatpak**: `flatpak update` (per-remote verification handled by Flatpak remotes)
- **PWA/web wrappers**: the web runtime updates itself; content updates are fetched from origin
- **Android (later)**: signed Android system images + app updates inside the container

## System image updates (MVP → target)

### MVP (now)

- VM-first: treat the built disk image as an artifact.
- Rollback is performed by VM snapshotting (e.g., qcow2 snapshots) while we iterate quickly.

### Target

- Move toward an **immutable base OS** with **A/B** rollback.
- Use a signed update channel for raw disk artifacts or partition payloads.

The exact mechanism can evolve (OSTree, systemd-sysupdate, or another proven approach), but the invariants remain:

- signed artifacts
- atomic switch
- rollback on failure

