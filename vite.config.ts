import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Hosted target (PWA app). The single-file offline target lives in vite.config.singlefile.ts.
export default defineConfig({
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
    outDir: 'dist/hosted',
  },
});
