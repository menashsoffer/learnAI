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
  build: {
    target: 'es2020',
    // Committed to git and served two ways: GitHub Pages "deploy from branch -> /docs"
    // reads it directly, and the Actions workflow uploads this same directory. One build
    // output means the two paths can never drift apart.
    outDir: 'docs',
    emptyOutDir: true,
  },
});
