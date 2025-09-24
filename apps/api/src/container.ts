import { Enums, createSmartEnumJSONReviver } from '@network/contracts';
import { asFunction, asValue, createContainer } from 'awilix';
import type { Knex } from 'knex';
import { AutoLoadedContainer } from './di/awilix.autoload';
import { database } from './knex';

// Helper type to convert enum names to camelCase container keys with proper types
type EnumContainerTypes = {
  [K in keyof typeof Enums as K extends string ? K : never]: (typeof Enums)[K];
};

// Base container for manually registered services
interface BaseContainer extends EnumContainerTypes {
  connection: Knex;
  smartEnumReviver: (key: string, value: unknown) => unknown;
  Enums: typeof Enums; // All enums as a single object
}

// Create the container with type inference
const container = createContainer<Container>({
  injectionMode: 'PROXY',
});

// Register the database connection manually
container.register({
  connection: asValue(database),
});

// Register smart enum utilities manually (they need special injection)
container.register({
  smartEnumReviver: asFunction(createSmartEnumJSONReviver),
});

// Register the Enums object and individual enums from contracts
container.register({
  Enums: asValue(Enums), // Register the full Enums object for createSmartEnumJSONReviver
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

// Type-safe enum resolver using __smart_enum_type metadata
export { container };
export type Container = BaseContainer & AutoLoadedContainer;
