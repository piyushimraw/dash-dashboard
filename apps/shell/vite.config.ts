import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import routerPlugin from "@tanstack/router-plugin/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    routerPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
        type: "module",
      },
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Hertz",
        short_name: "Hertz",
        description: "Hertz pwa",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@dash/shared-ui": path.resolve(__dirname, "../../packages/shared-ui/src"),
      "@dash/shared-utils": path.resolve(__dirname, "../../packages/shared-utils/src"),
      "@dash/shared-state": path.resolve(__dirname, "../../packages/shared-state/src"),
      "@dash/mfe-types": path.resolve(__dirname, "../../packages/mfe-types/src"),
      "@dash/mfe-rentals": path.resolve(__dirname, "../../packages/mfe-rentals/src"),
      "@dash/mfe-returns": path.resolve(__dirname, "../../packages/mfe-returns/src"),
      "@dash/mfe-aao": path.resolve(__dirname, "../../packages/mfe-aao/src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
});
