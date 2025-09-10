import { asFunction, asValue, createContainer } from 'awilix';
import { database } from './knex';

// Import all repository factories
import { createContactRepository } from './repositories/contactRepository';
import { createPlanRepository } from './repositories/planRepository';
import { createSuggestionRepository } from './repositories/suggestionRepository';
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
import { createAuthRoutes } from './routes/authRoutes';
import { createContactRoutes } from './routes/contactRoutes';
import { createRoutes } from './routes/index';
import { createPlanRoutes } from './routes/planRoutes';
import { createTouchesRoutes } from './routes/touchesRoutes';
import { createUserRoutes } from './routes/userRoutes';

// Create the container with type inference
const container = createContainer({
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
  suggestionRepository: asFunction(createSuggestionRepository),
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

export { container };
export type Container = typeof container;
