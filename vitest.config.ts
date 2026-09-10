import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@content', replacement: fileURLToPath(new URL('./content', import.meta.url)) },
    ],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'tests/**/*.test.ts'],
    // CSS imports become no-ops (we don't test styles here). Component tests opt into jsdom
    // per-file via `// @vitest-environment jsdom`.
    css: false,
  },
});
