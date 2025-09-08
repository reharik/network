import { createContainer, asFunction, asValue } from 'awilix';
import type { Knex } from 'knex';
import { database } from './knex';

// Import all repository factories
import { createUserRepository } from './repositories/userRepository';
import { createContactRepository } from './repositories/contactRepository';
import { createPlanRepository } from './repositories/planRepository';
import { createTouchesRepository } from './repositories/touchesRepository';
import { createSuggestionRepository } from './repositories/suggestionRepository';

// Import mapper factory
import { createMappers } from './repositories/mappers';

// Import service factories
import { createAuthService } from './services/authService';

// Import all controller factories
import { createUserController } from './controllers/userController';
import { createContactsController } from './controllers/contactsController';
import { createPlanController } from './controllers/planController';
import { createTouchesController } from './controllers/touchesController';
import { createAuthController } from './controllers/authController';

// Import all route factories
import { createUserRoutes } from './routes/userRoutes';
import { createContactRoutes } from './routes/contactRoutes';
import { createPlanRoutes } from './routes/planRoutes';
import { createTouchesRoutes } from './routes/touchesRoutes';
import { createAuthRoutes } from './routes/authRoutes';
import { createRoutes } from './routes/index';

// Import types
import type { UserRepository } from './repositories/userRepository';
import type { ContactRepository } from './repositories/contactRepository';
import type { PlanRepository } from './repositories/planRepository';
import type { TouchesRepository } from './repositories/touchesRepository';
import type { SuggestionRepository } from './repositories/suggestionRepository';
import type { Mappers } from './repositories/mappers';
import type { AuthService } from './services/authService';
import type { UserController } from './controllers/userController';
import type { ContactsController } from './controllers/contactsController';
import type { PlanController } from './controllers/planController';
import type { TouchesController } from './controllers/touchesController';
import type { AuthController } from './controllers/authController';
import type { UserRoutes } from './routes/userRoutes';
import type { ContactRoutes } from './routes/contactRoutes';
import type { PlanRoutes } from './routes/planRoutes';
import type { TouchesRoutes } from './routes/touchesRoutes';
import type { AuthRoutes } from './routes/authRoutes';
import type { Routes } from './routes/index';

// Define the container interface
interface ContainerInterface {
  // Database
  connection: Knex;

  // Services
  authService: AuthService;

  // Repositories
  userRepository: UserRepository;
  contactRepository: ContactRepository;
  planRepository: PlanRepository;
  touchesRepository: TouchesRepository;
  suggestionRepository: SuggestionRepository;

  // Mappers
  mappers: Mappers;

  // Controllers
  userController: UserController;
  contactsController: ContactsController;
  planController: PlanController;
  touchesController: TouchesController;
  authController: AuthController;

  // Routes
  userRoutes: UserRoutes;
  contactRoutes: ContactRoutes;
  planRoutes: PlanRoutes;
  touchesRoutes: TouchesRoutes;
  authRoutes: AuthRoutes;
  routes: Routes;
}

// Create the container
const container = createContainer<ContainerInterface>({
  injectionMode: 'PROXY',
});

// Register the database connection
container.register({
  connection: asValue(database),
});

// Register service factories
container.register({
  authService: asFunction(createAuthService),
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
