import { defineConfig, mergeConfig } from 'vitest/config';
import base from './vite.config';

/**
 * Inherits `resolve.alias` from the app config — declaring the aliases a second time here
 * is how they drift, and a drifted test alias fails in ways that look like product bugs.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      environment: 'node',
      include: ['src/**/*.test.{ts,tsx}'],
      // CSS imports become no-ops (we don't assert on styles). A component test opts into
      // jsdom per-file with `// @vitest-environment jsdom`.
      css: false,
    },
  }),
);
