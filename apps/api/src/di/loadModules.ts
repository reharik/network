// src/di/load-modules.ts
import type { AwilixContainer } from 'awilix';
import { asFunction } from 'awilix';
import fg from 'fast-glob';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from '../config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convention-over-config registration using import.meta.glob (production) or runtime scanning (dev):
 * - Scans services, repositories, controllers, middleware, routes, koaServer
 * - Uses named exports only (no default exports required)
 * - Registers only functions, via asFunction
 * - Applies your "createX" -> "x" naming rule
 */
export const registerModulesFromGlob = async (container: AwilixContainer): Promise<void> => {
  // In production, Vite transforms import.meta.glob at build time
  // In development, we use runtime file scanning
  if (config.nodeEnv === 'production') {
    // Production mode: use Vite's import.meta.glob (transformed at build time)
    // This will work because Vite has already processed it during the build
    registerForProduction(container);
  } else {
    // Dev mode: use runtime file scanning with fast-glob
    await registerForDevelopment(container);
  }
};

/**
 * Register exports from a module
 */
const registerModuleExports = (
  container: AwilixContainer,
  moduleExports: Record<string, unknown>,
): void => {
  for (const [exportName, value] of Object.entries(moduleExports)) {
    // Ignore non-functions (types, constants, helpers you don't want registered)
    if (typeof value !== 'function') continue;

    // Optional: skip "private" exports
    if (exportName.startsWith('_')) continue;

    const registrationName = formatName(exportName);
    console.log(`[loadModules] Registering: ${exportName} -> ${registrationName}`);

    container.register({
      [registrationName]: asFunction(value as (...args: unknown[]) => unknown),
    });
  }
};

const registerForProduction = (container: AwilixContainer): void => {
  const modules = import.meta.glob(
    [
      '../services/**/*.{ts,js}',
      '../repositories/**/*.{ts,js}',
      '../controllers/**/*.{ts,js}',
      '../middleware/**/*.{ts,js}',
      '../routes/**/*.{ts,js}',
      '../koaServer.{ts,js}',
    ],
    {
      eager: true,
    },
  );

  for (const [, mod] of Object.entries(modules)) {
    const moduleExports = mod as Record<string, unknown>;
    registerModuleExports(container, moduleExports);
  }
};

const registerForDevelopment = async (container: AwilixContainer): Promise<void> => {
  const patterns = [
    'services/**/*.{ts,js}',
    'repositories/**/*.{ts,js}',
    'controllers/**/*.{ts,js}',
    'middleware/**/*.{ts,js}',
    'routes/**/*.{ts,js}',
    'koaServer.{ts,js}',
  ];

  const srcDir = path.resolve(__dirname, '..');
  console.log(`[loadModules] Scanning for modules in: ${srcDir}`);
  console.log(`[loadModules] Patterns:`, patterns);

  const files = await fg(patterns, {
    cwd: srcDir,
    absolute: true,
  });

  console.log(`[loadModules] Found ${files.length} files:`, files);

  for (const filePath of files) {
    try {
      // Use file:// URL for ES module imports
      const fileUrl = pathToFileURL(filePath).href;
      console.log(`[loadModules] Loading module: ${filePath}`);
      const mod = (await import(fileUrl)) as Record<string, unknown>;
      console.log(`[loadModules] Module exports:`, Object.keys(mod));
      registerModuleExports(container, mod);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`[loadModules] Failed to load module ${filePath}:`, errorMessage);
      if (error instanceof Error && error.stack) {
        console.warn(`[loadModules] Stack:`, error.stack);
      }
    }
  }
};

/**
 * Mirrors your loadModules `formatName` behavior:
 * - If name starts with "create", strip it and lowercase the next char:
 *   "createUserService" -> "userService"
 * - Otherwise, leave name as-is (or lowerCamelCase it if you prefer).
 */
const formatName = (name: string): string => {
  if (name.startsWith('create') && name.length > 6) {
    const rest = name.slice(6);
    return rest.charAt(0).toLowerCase() + rest.slice(1);
  }

  // If you want strict parity with Awilix' default, you could just return name.
  // I'm keeping a tiny bit of safety: normalize first char to lower case.
  return name.charAt(0).toLowerCase() + name.slice(1);
};
