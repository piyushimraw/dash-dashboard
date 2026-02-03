import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import routerPlugin from "@tanstack/router-plugin/vite";
import path from "path";
import fs from "fs";
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

// Resolve @packages/* to source files in dev for HMR support
const packagesRoot = path.resolve(__dirname, "../../packages");
const devPackageAliases = {
  "@packages/ui/lib/utils": path.resolve(packagesRoot, "ui/src/lib/utils.ts"),
  "@packages/ui": path.resolve(packagesRoot, "ui/src/index.ts"),
  "@packages/api-client": path.resolve(packagesRoot, "api-client/src/index.ts"),
  "@packages/event-bus": path.resolve(packagesRoot, "event-bus/src/index.ts"),
  "@packages/mfe-types": path.resolve(packagesRoot, "mfe-types/src/index.ts"),
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE || '/',
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
        start_url: ".",
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
        // Use index.html as the SPA shell for navigation requests
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/offline\.html$/],
        runtimeCaching: [
          // Serve offline.html when navigation fails (network error)
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3,
              plugins: [
                {
                  handlerDidError: async () => {
                    return caches.match('/offline.html');
                  },
                },
              ],
            },
          },
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
      // In dev mode, resolve packages to source for HMR
      ...(mode === "development" ? devPackageAliases : {
        "@packages/event-bus": path.resolve(packagesRoot, "event-bus/dist/index.js"),
        "@packages/api-client": path.resolve(packagesRoot, "api-client/dist/index.js"),
        "@packages/ui": path.resolve(packagesRoot, "ui/dist/index.js"),
        "@packages/mfe-types": path.resolve(packagesRoot, "mfe-types/dist/index.js"),
      }),
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
  preview: {
    ...(fs.existsSync(path.resolve(__dirname, 'certs/localhost+2-key.pem')) && {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+2-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+2.pem')),
      },
    }),
    port: 4173,
  },
    test: {
    environment: "jsdom",
    globals: true,
    // setupFiles: "./src/setupTests.ts",
        setupFiles: [path.resolve(__dirname, 'test/setupTests.ts')],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
}));