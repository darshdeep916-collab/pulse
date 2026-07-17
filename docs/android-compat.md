# Android compatibility layer (Waydroid-style)

## Goal

Run Android apps (APKs) in a **containerized Android environment** and present them as regular windows inside the Wayland desktop session.

## Approach (target)

- **Container runtime**: LXC (Waydroid model)
- **Android system image**: downloaded/signed image set
- **Kernel requirements**:
  - binder support (binderfs)
  - ashmem (or modern alternatives used by Waydroid)
- **Graphics**: Android → host via Wayland integration
- **Input/audio**: bridged to host (PipeWire)

## Why this is “later”

Android compatibility is a big surface area and is hardware/kernel sensitive. The MVP focuses on:

- Flatpak (strong sandboxing, easy packaging)
- Web/PWA (massive availability)

…then we add Android once update/signing + threat model are solid.

## Security posture

- Treat Android container as **untrusted**.
- Prefer **verified images** and signed update channels for Android system images.
- Limit host integration to narrow bridges:
  - graphics/input/audio
  - explicit file sharing portals
- UX: strong warnings for sideloaded APKs.

## Integration points (planned)

- `neuroos-android doctor`: check kernel + services for readiness
- `neuroos-android init`: provision Android images
- `neuroos-android install-apk <path>`: install with warnings
- App catalog can list Android apps and route install flows to this tool.

