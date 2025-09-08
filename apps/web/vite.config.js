import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: __dirname, // apps/web
  cacheDir: '../../node_modules/.vite/web',
  plugins: [
    react({
      fastRefresh: true,
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 8080,
    host: 'localhost',
    hmr: {
      port: 8081,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  build: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true,
  },
  define: {
    'import.meta.env.VITE_API': JSON.stringify('http://localhost:3000/api'),
  },
});
