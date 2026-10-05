import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
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
          { src: "/imgs/zanbus_blue.png", sizes: "192x192", type: "image/png" },
          { src: "/imgs/zanbus_blue.png", sizes: "512x512", type: "image/png" },
          {
            src: "/imgs/zanbus_blue.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: { navigateFallback: "/index.html" },
    }),
  ],
  build: {
    outDir: "dist",
  },
});
