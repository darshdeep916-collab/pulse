# OS build (VM-first)

This directory contains the configuration for building a **bootable Linux disk image** for a VM-first OS that can scale app availability via Web/PWA + Flatpak (+ Android compatibility later).

## Why this approach

- **Base**: Debian (via mkosi + debootstrap) to keep the foundation boring and well supported.
- **Artifacts**:
  - mkosi builds a **raw disk image**
  - we convert raw → **qcow2** for QEMU/UTM

## Quick start (Linux host)

You need a Linux machine (or Linux VM) with `mkosi` and `qemu-img` available.

```bash
./build/os-build.sh
```

Outputs land in `os/out/`.

## Quick start (macOS host)

Build inside a privileged Linux container:

```bash
./build/os-build-container.sh
```

This requires Docker Desktop and uses `--privileged` so mkosi can create images.

