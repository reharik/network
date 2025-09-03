import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: __dirname, // apps/web
  cacheDir: '../../node_modules/.vite/web',
  plugins: [react(), tsconfigPaths()],
  server: { port: 8080, host: 'localhost' },
  build: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true,
  },
});
