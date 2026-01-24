import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the apps/web directory (where .env.production lives)
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, __dirname, '');

  // Debug: log mode and loaded env vars (only in production mode to avoid noise)
  if (mode === 'production') {
    console.log(`[vite.config] Building in ${mode} mode`);
    console.log(`[vite.config] Loaded VITE_API:`, env.VITE_API);
  }

  // Default values for development
  const defaults = {
    VITE_API: 'http://localhost:3000/api',
    VITE_DEFAULT_REMINDER_TIME: '09:00',
    VITE_DEFAULT_INTERVAL_DAYS: '14',
    VITE_DEFAULT_PREFERRED_METHOD: 'email',
    VITE_DEFAULT_CONTACT_MESSAGE: "Hi {{firstName}}, just checking in to see how you're doing.",
    VITE_APP_NAME: 'Network',
    VITE_APP_VERSION: '1.0.0',
  };

  // Use env vars if available, otherwise fall back to defaults
  const getEnv = (key) => {
    const value = env[key] || defaults[key] || '';
    if (mode === 'production' && key === 'VITE_API') {
      console.log(`[vite.config] getEnv(${key}):`, value);
    }
    return value;
  };

  const getEnvNumber = (key) => {
    const value = env[key] || defaults[key];
    return Number(value) || 0;
  };

  return {
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
      'import.meta.env.VITE_API': JSON.stringify(getEnv('VITE_API')),
      'import.meta.env.VITE_DEFAULT_REMINDER_TIME': JSON.stringify(
        getEnv('VITE_DEFAULT_REMINDER_TIME'),
      ),
      'import.meta.env.VITE_DEFAULT_INTERVAL_DAYS': getEnvNumber('VITE_DEFAULT_INTERVAL_DAYS'),
      'import.meta.env.VITE_DEFAULT_PREFERRED_METHOD': JSON.stringify(
        getEnv('VITE_DEFAULT_PREFERRED_METHOD'),
      ),
      'import.meta.env.VITE_DEFAULT_CONTACT_MESSAGE': JSON.stringify(
        getEnv('VITE_DEFAULT_CONTACT_MESSAGE'),
      ),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(getEnv('VITE_APP_NAME')),
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(getEnv('VITE_APP_VERSION')),
    },
  };
});
