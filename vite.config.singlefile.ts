import { defineConfig, mergeConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import base from './vite.config';

/**
 * Offline single-file target: one self-contained HTML per deck, ZERO network requests at runtime.
 * - every asset inlined (fonts, images) into the HTML
 * - no code splitting (inlineDynamicImports)
 * - `import.meta.env.VITE_TARGET === 'singlefile'` lets runtime code drop the Zod validator path
 *
 * Usage: VITE_TARGET=singlefile DECK_ID=<id> vite build --config vite.config.singlefile.ts
 */
export default mergeConfig(
  base,
  defineConfig({
    plugins: [viteSingleFile({ removeViteModuleLoader: true })],
    // Opened from file:// off a USB stick — a host path prefix would break it.
    base: './',
    define: {
      'import.meta.env.VITE_TARGET': JSON.stringify('singlefile'),
      'import.meta.env.VITE_DECK_ID': JSON.stringify(process.env.DECK_ID ?? 'ai-cadets-2026'),
    },
    build: {
      target: 'es2020',
      outDir: 'dist/offline',
      cssCodeSplit: false,
      assetsInlineLimit: 100_000_000,
      modulePreload: { polyfill: false },
      reportCompressedSize: true,
      chunkSizeWarningLimit: 5000,
      rollupOptions: {
        output: { inlineDynamicImports: true, manualChunks: undefined },
      },
    },
  }),
);
