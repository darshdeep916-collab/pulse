export type FlatpakApp = {
  name: string;
  appId: string;
  description: string;
};

export type PwaApp = {
  name: string;
  url: string;
  description: string;
};

export const featuredFlatpaks: FlatpakApp[] = [
  {
    name: "Firefox",
    appId: "org.mozilla.firefox",
    description: "Web browser (Flatpak).",
  },
  {
    name: "GIMP",
    appId: "org.gimp.GIMP",
    description: "Image editor (Flatpak).",
  },
  {
    name: "VLC",
    appId: "org.videolan.VLC",
    description: "Media player (Flatpak).",
  },
  {
    name: "Steam",
    appId: "com.valvesoftware.Steam",
    description: "Games platform (Flatpak).",
  },
];

export const featuredPwas: PwaApp[] = [
  {
    name: "YouTube Music",
    url: "https://music.youtube.com/",
    description: "Music streaming (installable PWA in Chromium-based browsers).",
  },
  {
    name: "Google Calendar",
    url: "https://calendar.google.com/",
    description: "Calendar (installable PWA in Chromium-based browsers).",
  },
  {
    name: "Slack",
    url: "https://app.slack.com/",
    description: "Team chat (often installable as a web app).",
  },
];

