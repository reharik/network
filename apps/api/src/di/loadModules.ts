// src/di/load-modules.ts
import type { AwilixContainer } from 'awilix';
import { asFunction } from 'awilix';

/**
 * Convention-over-config registration using import.meta.glob:
 * - Scans services, repositories, controllers, middleware, routes, koaServer
 * - Uses named exports only (no default exports required)
 * - Registers only functions, via asFunction
 * - Applies your "createX" -> "x" naming rule
 */
export const registerModulesFromGlob = (container: AwilixContainer) => {
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
      eager: true, // we want actual module objects at build time
      // no `import: 'default'` -> we get full module namespace objects
    },
  );

  for (const [path, mod] of Object.entries(modules)) {
    const moduleExports = mod as Record<string, unknown>;

    for (const [exportName, value] of Object.entries(moduleExports)) {
      // Ignore non-functions (types, constants, helpers you don't want registered)
      if (typeof value !== 'function') continue;

      // Optional: skip "private" exports
      if (exportName.startsWith('_')) continue;

      const registrationName = formatName(exportName);

      container.register({
        [registrationName]: asFunction(value as (...args: unknown[]) => unknown),
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
