import { asFunction, asValue, createContainer } from 'awilix';
import { database } from './knex';

// Import all repository factories
import { createContactRepository } from './repositories/contactRepository';
import { createPlanRepository } from './repositories/planRepository';
import { createTouchesRepository } from './repositories/touchesRepository';
import { createUserRepository } from './repositories/userRepository';

// Import mapper factory
import { createMappers } from './repositories/mappers';

// Import service factories
import { createAuthService } from './services/authService';
import { createImportService } from './services/importService';

// Import middleware factories
import { createAuthMiddleware, createOptionalAuthMiddleware } from './middleware/authMiddleware';

// Import all controller factories
import { createAuthController } from './controllers/authController';
import { createContactsController } from './controllers/contactsController';
import { createPlanController } from './controllers/planController';
import { createTouchesController } from './controllers/touchesController';
import { createUserController } from './controllers/userController';

// Import all route factories
import { createSmartEnumJSONReviver, smartEnumRegistry } from '@network/contracts';
import { createAuthRoutes } from './routes/authRoutes';
import { createContactRoutes } from './routes/contactRoutes';
import { createRoutes } from './routes/index';
import { createPlanRoutes } from './routes/planRoutes';
import { createTouchesRoutes } from './routes/touchesRoutes';
import { createUserRoutes } from './routes/userRoutes';

// Import server factory
import { createKoaServer } from './koaServer';

// Define the container type for better type safety
interface Container {
  // Database
  connection: typeof database;

  // Services
  authService: ReturnType<typeof createAuthService>;
  importService: ReturnType<typeof createImportService>;

  // Middleware
  authMiddleware: ReturnType<typeof createAuthMiddleware>;
  optionalAuthMiddleware: ReturnType<typeof createOptionalAuthMiddleware>;
  smartEnumRegistry: typeof smartEnumRegistry;
  smartEnumReviver: ReturnType<typeof createSmartEnumJSONReviver>;

  // Mappers
  mappers: ReturnType<typeof createMappers>;

  // Repositories
  userRepository: ReturnType<typeof createUserRepository>;
  contactRepository: ReturnType<typeof createContactRepository>;
  planRepository: ReturnType<typeof createPlanRepository>;
  touchesRepository: ReturnType<typeof createTouchesRepository>;

  // Controllers
  userController: ReturnType<typeof createUserController>;
  contactsController: ReturnType<typeof createContactsController>;
  planController: ReturnType<typeof createPlanController>;
  touchesController: ReturnType<typeof createTouchesController>;
  authController: ReturnType<typeof createAuthController>;

  // Routes
  userRoutes: ReturnType<typeof createUserRoutes>;
  contactRoutes: ReturnType<typeof createContactRoutes>;
  planRoutes: ReturnType<typeof createPlanRoutes>;
  touchesRoutes: ReturnType<typeof createTouchesRoutes>;
  authRoutes: ReturnType<typeof createAuthRoutes>;
  routes: ReturnType<typeof createRoutes>;

  // Server
  koaServer: ReturnType<typeof createKoaServer>;
}

// Create the container with type inference
const container = createContainer<Container>({
  injectionMode: 'PROXY',
});

// Register the database connection
container.register({
  connection: asValue(database),
});

// Register service factories
container.register({
  authService: asFunction(createAuthService),
  importService: asFunction(createImportService),
});

// Register middleware factories
container.register({
  authMiddleware: asFunction(createAuthMiddleware),
  optionalAuthMiddleware: asFunction(createOptionalAuthMiddleware),
  smartEnumRegistry: asFunction(() => smartEnumRegistry),
  smartEnumReviver: asFunction(createSmartEnumJSONReviver).inject(() => ({
    registry: 'smartEnumRegistry',
  })),
});

// Register mapper factory
container.register({
  mappers: asFunction(createMappers),
});

// Register all repository factories
container.register({
  // Repository instances
  userRepository: asFunction(createUserRepository),
  contactRepository: asFunction(createContactRepository),
  planRepository: asFunction(createPlanRepository),
  touchesRepository: asFunction(createTouchesRepository),
});

// Register all controller factories
container.register({
  // Controller instances
  userController: asFunction(createUserController),
  contactsController: asFunction(createContactsController),
  planController: asFunction(createPlanController),
  touchesController: asFunction(createTouchesController),
  authController: asFunction(createAuthController),
});

// Register all route factories
container.register({
  userRoutes: asFunction(createUserRoutes),
  contactRoutes: asFunction(createContactRoutes),
  planRoutes: asFunction(createPlanRoutes),
  touchesRoutes: asFunction(createTouchesRoutes),
  authRoutes: asFunction(createAuthRoutes),
  routes: asFunction(createRoutes),
});

// Register server factory
container.register({
  koaServer: asFunction(createKoaServer).inject(() => ({
    smartEnumReviver: 'smartEnumReviver',
    routes: 'routes',
    optionalAuthMiddleware: 'optionalAuthMiddleware',
  })),
});

export { container };
export type { Container };
