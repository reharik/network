import { Enums, enumRegistry, type EnumRegistry } from '@network/contracts';
import { asFunction, asValue, createContainer } from 'awilix';
import type { Knex } from 'knex';
import { initializeSmartEnumMappings } from 'smart-enums';
import { AutoLoadedContainer } from './di/awilix.autoload';
import { database } from './knex';

// Helper type to convert enum names to camelCase container keys with proper types
type EnumContainerTypes = {
  [K in keyof typeof Enums as K extends string ? K : never]: (typeof Enums)[K];
};

// Base container for manually registered services
interface BaseContainer extends EnumContainerTypes {
  connection: Knex;
  Enums: typeof Enums; // All enums as a single object
  enumRegistry: EnumRegistry; // Properly typed enum registry for smart-enums functions
}

// Create the container with type inference
const container = createContainer<Container>({
  injectionMode: 'PROXY',
});

// Register the database connection manually
container.register({
  connection: asValue(database),
});

// Register the Enums object and individual enums from contracts
container.register({
  Enums: asValue(Enums), // Register the full Enums object for reviveSmartEnums
  enumRegistry: asValue(enumRegistry), // Register the properly typed enum registry
  ...Object.fromEntries(Object.entries(Enums).map(([key, value]) => [key, asValue(value)])),
});

// Use loadModules to discover and register files (synchronous)
// Load all directories that contain create functions with RESOLVER metadata
container.loadModules(
  [
    'services/**/*.@(ts|js)',
    'repositories/**/*.@(ts|js)',
    'controllers/**/*.@(ts|js)',
    'middleware/**/*.@(ts|js)',
    'routes/**/*.@(ts|js)',
    'koaServer.@(ts|js)',
  ],
  {
    cwd: __dirname,
    resolverOptions: {
      register: asFunction,
    },
    // Configure naming strategy to remove 'create' prefix
    formatName: (name) => {
      if (name.startsWith('create')) {
        return name.substring(6).charAt(0).toLowerCase() + name.substring(7);
      }
      return name;
    },
  },
);

// Initialize the global smart enum configuration early, before any services are created
initializeSmartEnumMappings({ enumRegistry });
console.log(`************enumRegistry************`);
console.log(enumRegistry);
console.log(`********END enumRegistry************`);
// Type-safe enum resolver using __smart_enum_type metadata
export { container };
export type Container = BaseContainer & AutoLoadedContainer;
