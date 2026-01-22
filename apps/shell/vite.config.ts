import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import routerPlugin from "@tanstack/router-plugin/vite";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    routerPlugin({
      autoCodeSplitting: true,
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
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
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/dummyjson\.com\/.*$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'reservations-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 150,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // For pnpm, path structure is:
            // node_modules/.pnpm/react@19.2.3/node_modules/react/...
            // node_modules/.pnpm/@radix-ui+react-id@1.1.1.../node_modules/@radix-ui/react-id/...
            // We need to get the actual package name from the last node_modules segment
            const nodeModulesSegments = id.split('node_modules/');
            const lastSegment = nodeModulesSegments[nodeModulesSegments.length - 1];
            const parts = lastSegment.split('/');
            const packageName = parts[0].startsWith('@')
              ? `${parts[0]}/${parts[1]}`
              : parts[0];

            if (packageName.startsWith('@radix-ui')) return 'vendor-radix';
            if (packageName === 'react' || packageName === 'react-dom' || packageName === 'scheduler') return 'vendor-react';
            if (packageName.startsWith('@tanstack')) return 'vendor-tanstack';
            if (packageName === 'zustand') return 'vendor-zustand';
            return 'vendor-other';
          }
        },
      },
    },
  },
});
