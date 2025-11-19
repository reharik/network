import { Enums, enumRegistry, type EnumRegistry } from '@network/contracts';
import { asValue, createContainer } from 'awilix';
import type { Knex } from 'knex';
import { initializeSmartEnumMappings } from 'smart-enums';
import { AutoLoadedContainer } from './di/awilix.autoload';
import { registerModulesFromGlob } from './di/loadModules';
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

registerModulesFromGlob(container);

// Initialize the global smart enum configuration early, before any services are created
initializeSmartEnumMappings({ enumRegistry });
// Type-safe enum resolver using __smart_enum_type metadata
export { container };
export type Container = BaseContainer & AutoLoadedContainer;
