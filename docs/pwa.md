# PWA / Web app model (MVP → target)

## MVP (now)

- Runtime is **Chromium**.
- “Installable PWAs” are installed via the browser’s native UI when supported by the site.
- For a predictable “installed app” experience even when a site isn’t a full PWA, we also support **web-app wrappers** (Chromium `--app=`) with **per-app isolated profiles**.

## Web-app wrapper strategy (Chromium `--app=`)

Each installed web-app wrapper has:

- its own **desktop entry**
- its own **profile directory** (`--user-data-dir=...`) to isolate cookies/storage
- a stable **name/icon** (icon support can be added incrementally)

This gives “app-like” behavior that scales with the open web.

## Permissions mapping (pragmatic)

Chromium already enforces per-origin permissions. The OS “settings” view should surface:

- camera/mic
- notifications
- location
- clipboard
- persistent storage

MVP approach: read/write Chromium policy + prefs (future work) and provide shortcuts to the browser’s site settings UI.

## Storage mapping (pragmatic)

- Storage is per profile and per origin.
- For wrappers, profile isolation yields per-“app” storage boundaries.

## Future target

- Unified OS permission UI that can enumerate:
  - Flatpak permissions (portals/overrides)
  - Web/PWA permissions (Chromium site settings)
  - Android permissions (Android framework)

