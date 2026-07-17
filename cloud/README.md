# Cloud run (high-memory)

These scripts boot **NeuroOS** on a high-memory Linux server and expose the GUI via **VNC** so you can connect from macOS.

## What you need

- A Linux server (recommended: **Ubuntu 24.04** or **Debian 12**) with **8GB+ RAM**
- SSH access from your Mac
- Inbound access to VNC **5901** (or use the SSH tunnel method below)

## One-command flow from macOS

Set these environment variables and run:

```bash
export NEUROOS_SERVER_HOST="ubuntu@YOUR_SERVER_IP"
export NEUROOS_SSH_KEY="$HOME/.ssh/your_key.pem"
./cloud/mac-push-build-boot.sh
```

Then connect with Screen Sharing:

- **Secure tunnel (recommended)**:

```bash
./cloud/mac-vnc-tunnel.sh
```

Then open `vnc://localhost:5901`

## What it does

- Uploads this repo to `~/my-amazing-project` on the server
- Installs build deps (`mkosi`, `qemu`, `ovmf`, etc.)
- Builds `os/mkosi/out/*.qcow2`
- Boots QEMU and listens on `:1` (TCP **5901**)

