import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setupTests.ts'], // your global setup
    include: ['apps/**/src/**/*.test.{ts,tsx}'], // include all apps
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'apps/shell/src'), // adjust per app if needed
      // "@ui": path.resolve(__dirname, "packages/ui/src"),
    },
  },
});
