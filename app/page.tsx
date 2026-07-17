import Link from "next/link";

import { CopyButton } from "../components/CopyButton";
import { featuredFlatpaks, featuredPwas } from "./catalogData";

function Code({ children }: { children: string }) {
  return (
    <code className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[13px] text-white/90">
      {children}
    </code>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f16] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
              VM-first OS
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
              Web/PWA + Flatpak (+ Android later)
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            NeuroOS App Catalog (MVP)
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-white/70">
            The fastest path to “100 million apps” is to treat compatibility layers as
            first-class citizens: PWAs from the open web, sandboxed Linux apps via
            Flatpak, and (later) Android apps via a containerized compatibility layer.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-medium">Flatpak apps (Linux ecosystem)</h2>
            <p className="mt-2 text-sm text-white/70">
              Flathub remote is expected. Install using:
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                <Code>flatpak install -y flathub &lt;appId&gt;</Code>
                <CopyButton value="flatpak install -y flathub <appId>" label="Copy template" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                <Code>flatpak update -y</Code>
                <CopyButton value="flatpak update -y" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                <Code>flatpak list --app</Code>
                <CopyButton value="flatpak list --app" />
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-medium text-white/90">Featured</h3>
              <ul className="mt-2 space-y-2">
                {featuredFlatpaks.map((app) => {
                  const installCmd = `flatpak install -y flathub ${app.appId}`;
                  return (
                    <li
                      key={app.appId}
                      className="rounded-xl border border-white/10 bg-black/20 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="mt-1 text-xs text-white/60">
                            {app.description}
                          </div>
                          <div className="mt-2 text-xs text-white/80">
                            <Code>{app.appId}</Code>
                          </div>
                        </div>
                        <CopyButton value={installCmd} label="Copy install" />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-medium">Web &amp; PWAs (open web)</h2>
            <p className="mt-2 text-sm text-white/70">
              In Chromium-based browsers, look for an “Install app” action in the
              address bar menu after opening a site.
            </p>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/70">
              <div className="font-medium text-white/85">Install flow</div>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>Open the site.</li>
                <li>Choose “Install app”.</li>
                <li>The OS should treat the installed PWA as an app with per-origin permissions.</li>
              </ol>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-medium text-white/90">Featured</h3>
              <ul className="mt-2 space-y-2">
                {featuredPwas.map((app) => (
                  <li
                    key={app.url}
                    className="rounded-xl border border-white/10 bg-black/20 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{app.name}</div>
                        <div className="mt-1 text-xs text-white/60">
                          {app.description}
                        </div>
                        <div className="mt-2 text-xs">
                          <Link
                            className="text-sky-300 hover:text-sky-200"
                            href={app.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {app.url}
                          </Link>
                        </div>
                      </div>
                      <CopyButton value={app.url} label="Copy URL" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/60">
              Android apps are a later milestone (Waydroid-style container + Wayland windowing).
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}