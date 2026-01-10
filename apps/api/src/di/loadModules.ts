// src/di/load-modules.ts
import type { AwilixContainer } from 'awilix';
import { asFunction } from 'awilix';
import fg from 'fast-glob';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from '../config';
import type { LoggerInterface } from '../logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convention-over-config registration using import.meta.glob (production bundle) or runtime scanning:
 * - Scans services, repositories, controllers, middleware, routes, koaServer
 * - Uses named exports only (no default exports required)
 * - Registers only functions, via asFunction
 * - Applies your "createX" -> "x" naming rule
 */
export const registerModulesFromGlob = async (
  container: AwilixContainer,
  logger: LoggerInterface,
): Promise<void> => {
  // import.meta.glob is a Vite build-time feature - only exists in bundled output
  // When running source directly (tsx/ts-node), we must use runtime file scanning
  const hasViteGlob = typeof import.meta.glob === 'function';

  if (config.nodeEnv === 'production' && hasViteGlob) {
    // Production bundle: use Vite's import.meta.glob (transformed at build time)
    registerForProduction(container, logger);
  } else {
    // Dev mode OR running source in prod: use runtime file scanning with fast-glob
    await registerForDevelopment(container, logger);
  }
};

/**
 * Register exports from a module
 */
const registerModuleExports = (
  container: AwilixContainer,
  moduleExports: Record<string, unknown>,
  logger: LoggerInterface,
): void => {
  for (const [exportName, value] of Object.entries(moduleExports)) {
    // Ignore non-functions (types, constants, helpers you don't want registered)
    if (typeof value !== 'function') continue;

    // Optional: skip "private" exports
    if (exportName.startsWith('_')) continue;

    const registrationName = formatName(exportName);
    logger.debug(`[loadModules] Registering: ${exportName} -> ${registrationName}`);

    container.register({
      [registrationName]: asFunction(value as (...args: unknown[]) => unknown),
    });
  }
};

const registerForProduction = (container: AwilixContainer, logger: LoggerInterface): void => {
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
    registerModuleExports(container, moduleExports, logger);
  }
};

const registerForDevelopment = async (
  container: AwilixContainer,
  logger: LoggerInterface,
): Promise<void> => {
  const patterns = [
    'services/**/*.{ts,js}',
    'repositories/**/*.{ts,js}',
    'controllers/**/*.{ts,js}',
    'middleware/**/*.{ts,js}',
    'routes/**/*.{ts,js}',
    'koaServer.{ts,js}',
  ];

  const srcDir = path.resolve(__dirname, '..');
  logger.debug(`[loadModules] Scanning for modules in: ${srcDir}`, { patterns });

  const files = await fg(patterns, {
    cwd: srcDir,
    absolute: true,
  });

  logger.debug(`[loadModules] Found ${files.length} files`, { fileCount: files.length, files });

  for (const filePath of files) {
    try {
      // Use file:// URL for ES module imports
      const fileUrl = pathToFileURL(filePath).href;
      logger.debug(`[loadModules] Loading module: ${filePath}`);
      const mod = (await import(fileUrl)) as Record<string, unknown>;
      logger.debug(`[loadModules] Module exports`, { filePath, exports: Object.keys(mod) });
      registerModuleExports(container, mod, logger);
    } catch (error: unknown) {
      logger.warn(`[loadModules] Failed to load module ${filePath}`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
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
