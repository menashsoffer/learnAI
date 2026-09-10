import { defineConfig, mergeConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath, URL } from 'node:url';
import base from './vite.config';

/**
 * Offline single-file target: one self-contained HTML per deck, ZERO network requests at runtime.
 * - every asset inlined (fonts, images) into the HTML
 * - no code splitting (inlineDynamicImports)
 * - `src/studio/*` compile-excluded via alias stub  (studio is hosted-only)
 * - `import.meta.env.VITE_TARGET === 'singlefile'` lets runtime code drop the Zod validator path
 *
 * Usage: VITE_TARGET=singlefile DECK_ID=<id> vite build --config vite.config.singlefile.ts
 */
export default mergeConfig(
  base,
  defineConfig({
    plugins: [viteSingleFile({ removeViteModuleLoader: true })],
    define: {
      'import.meta.env.VITE_TARGET': JSON.stringify('singlefile'),
      'import.meta.env.VITE_DECK_ID': JSON.stringify(process.env.DECK_ID ?? 'ai-cadets-2026'),
    },
    resolve: {
      alias: [
        // Keep the authoring studio out of the offline artifact entirely.
        {
          find: /^@\/studio\/.*$/,
          replacement: fileURLToPath(new URL('./src/studio/empty.ts', import.meta.url)),
        },
      ],
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
