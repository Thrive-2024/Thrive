import { crx, defineManifest } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const manifest = defineManifest({
  manifest_version: 3,
  name: "Thrive",
  version: "1.0.0",
  description: "Thrive Google Extension",
  icons: {
    "16": "public/assets/img/16.png",
    "32": "public/assets/img/32.png",
    "48": "public/assets/img/48.png",
    "96": "public/assets/img/96.png",
    "128": "public/assets/img/128.png",
  },
  action: {
    default_popup: "src/pomodoro/index.html",
  },
  "background": {
    "service_worker": "src/pomodoro/background/main.ts"
  },
  permissions: ["storage", "tabs", "notifications", "background"],
  host_permissions:["http://*/*", "https://*/*"],
  commands: {
    toggle_timer_status: {
      suggested_key: {
        default: "Ctrl+Shift+T",
        mac: "Command+Shift+T",
      },
      description: "pomodoro timer",
    },
  },
  options_page: "src/pomodoro/expire.html",
  "content_scripts": [{
    "matches": ["http://*/*", "https://*/*"],
    "js": ["src/siteBlocker/background/contentScript.ts"]
  }]
});

export default defineConfig({
  publicDir: "public",
  build: {
    minify: false,
    emptyOutDir: true,
    outDir: "build",
    rollupOptions: {
      output: {
        chunkFileNames: "assets/chunk-[hash].js",
      },
    },
  },
  plugins: [react(), crx({ manifest }), tsconfigPaths()],
});
