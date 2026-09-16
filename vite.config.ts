import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Hosted target (PWA app). The single-file offline target lives in vite.config.singlefile.ts.
export default defineConfig({
  // GitHub Pages serves this as a PROJECT site at /learnAI/, so assets must be requested
  // from that prefix. With the default '/' every asset 404s and the page renders blank.
  base: '/learnAI/',
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@content', replacement: fileURLToPath(new URL('./content', import.meta.url)) },
    ],
  },
  define: {
    'import.meta.env.VITE_TARGET': JSON.stringify(process.env.VITE_TARGET ?? 'hosted'),
  },
  // Vite does not read PORT on its own — it just takes its 5173 / 4173 defaults and fails
  // when something already holds them. Honouring PORT lets the preview harness assign a
  // free port instead. Nothing here is pinned to a port (no OAuth callback, no webhook),
  // and `base` is a path, so moving ports changes nothing about how the site behaves.
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  preview: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  build: {
    target: 'es2020',
    // Never committed. The Pages workflow builds this directory and uploads it as the
    // deployment artifact; nothing reads it from the repository.
    outDir: 'dist',
    emptyOutDir: true,
  },
});
