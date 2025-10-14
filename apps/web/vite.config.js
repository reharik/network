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
    // Note: JSON.stringify() is required for strings because Vite's define does literal string replacement
    // Without JSON.stringify(), strings wouldn't have quotes in the final code
    'import.meta.env.VITE_API': JSON.stringify('http://localhost:3000/api'),
    'import.meta.env.VITE_DEFAULT_REMINDER_TIME': JSON.stringify('09:00'),
    'import.meta.env.VITE_DEFAULT_INTERVAL_DAYS': 30, // Numbers don't need JSON.stringify()
    'import.meta.env.VITE_DEFAULT_PREFERRED_METHOD': JSON.stringify('email'),
    'import.meta.env.VITE_APP_NAME': JSON.stringify('Network'),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify('1.0.0'),
  },
});
