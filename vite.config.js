import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),

    VueI18nPlugin({
      include: resolve(__dirname, "./src/locales/**"),
    }),

    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],

      manifest: {
        name: "ZanBus",
        short_name: "ZanBus",
        description: "Top up, ride and manage your bus card",
        theme_color: "#fff",
        background_color: "#fff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",

        icons: [
          {
            src: "/imgs/zanbus192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/imgs/zanbus512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/imgs/zanbus512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        navigateFallback: "/index.html",
      },
    }),
  ],

  build: {
    outDir: "dist",
  },
});
