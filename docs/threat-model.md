# Threat model (baseline)

This is a pragmatic baseline to keep the “100M app” goal from turning into “100M ways to get owned”.

## Assets to protect

- User data (home dir, documents, browser storage)
- Credentials (saved passwords, tokens, SSH keys)
- Network identity (cookies, sessions)
- System integrity (boot chain, OS partitions, update mechanism)

## Attacker model

- **Malicious app publisher**: ships a trojan app (Flatpak/PWA/APK).
- **Compromised upstream repo**: remote metadata or binaries replaced.
- **Web attacker**: drive-by content, phishing, XSS in web runtime.
- **Local attacker**: unprivileged user process attempting privilege escalation.

## Security principles

- **Default-deny**: apps start with minimal filesystem/device access.
- **Defense in depth**: sandbox + MAC/LSM + kernel hardening + signed updates.
- **Reproducible distribution** (where feasible): deterministic builds and signed metadata.
- **Transparency**: clear, unified permission prompts and per-app inspection.

## Sandboxing by app type

### Flatpak apps

- Use Flatpak sandboxing + **xdg-desktop-portal** for mediated access.
- Provide a permissions UI (Flatseal or equivalent) for inspection/overrides.

### PWAs / Web apps

- Chromium site isolation + per-origin permissions.
- OS maps “camera/mic/notifications/files” to the browser permission model.
- Storage quotas enforced per-origin and surfaced in settings.

### Android apps (later milestone)

- Android permission system + SELinux in container.
- Host integration limited to well-defined bridges (graphics/input/audio).
- Explicit UX warnings for sideloaded APKs.

## Update / supply-chain (target state)

- **Signed repository metadata** (catalog indices, Flatpak remotes, Android images).
- **Signed system images** with rollback.
- **Key management**:
  - offline root key
  - online signing key with rotation + revocation mechanism

## Hardening checklist (MVP to target)

- Enable kernel hardening sysctls and keep a minimal attack surface.
- Prefer sandboxed services; minimize long-running privileged daemons.
- Ship a firewall default (deny inbound).
- Disable password SSH by default (if SSH included at all).

