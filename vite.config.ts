import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setupTests.ts'], // your global setup
    include: [
      'apps/**/src/**/*.test.{ts,tsx}', // include all apps
      'packages/**/src/**/*.test.{ts,tsx}', // include all packages
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'apps/shell/src'),
      '@packages/ui': path.resolve(__dirname, 'packages/ui/src'),
      '@packages/api-client': path.resolve(__dirname, 'packages/api-client/src'),
      '@packages/event-bus': path.resolve(__dirname, 'packages/event-bus/src'),
      '@packages/mfe-types': path.resolve(__dirname, 'packages/mfe-types/src'),
    },
  },
});
