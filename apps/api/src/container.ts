import { createContainer, asFunction, asValue } from 'awilix';
import type { Knex } from 'knex';
import { db } from './knex';

// Import all repository factories
import { createUserRepository } from './repositories/userRepository';
import { createContactRepository } from './repositories/contactRepository';
import { createPlanRepository } from './repositories/planRepository';
import { createTouchesRepository } from './repositories/touchesRepository';
import { createSuggestionRepository } from './repositories/suggestionRepository';

// Import mapper factory
import { createMappers } from './repositories/mappers';

// Import all controller factories
import { createUserController } from './controllers/userController';
import { createContactsController } from './controllers/contactsController';
import { createPlanController } from './controllers/planController';
import { createTouchesController } from './controllers/touchesController';

// Import all route factories
import { createUserRoutes } from './routes/userRoutes';
import { createContactRoutes } from './routes/contactRoutes';
import { createPlanRoutes } from './routes/planRoutes';
import { createTouchesRoutes } from './routes/touchesRoutes';
import { createRoutes } from './routes/index';

// Import types
import type { UserRepository } from './repositories/userRepository';
import type { ContactRepository } from './repositories/contactRepository';
import type { PlanRepository } from './repositories/planRepository';
import type { TouchesRepository } from './repositories/touchesRepository';
import type { SuggestionRepository } from './repositories/suggestionRepository';
import type { Mappers } from './repositories/mappers';
import type { UserController } from './controllers/userController';
import type { ContactsController } from './controllers/contactsController';
import type { PlanController } from './controllers/planController';
import type { TouchesController } from './controllers/touchesController';
import type { UserRoutes } from './routes/userRoutes';
import type { ContactRoutes } from './routes/contactRoutes';
import type { PlanRoutes } from './routes/planRoutes';
import type { TouchesRoutes } from './routes/touchesRoutes';
import type { Routes } from './routes/index';

// Define the container interface
interface ContainerInterface {
  // Database
  db: Knex;
  
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
  
  // Routes
  userRoutes: UserRoutes;
  contactRoutes: ContactRoutes;
  planRoutes: PlanRoutes;
  touchesRoutes: TouchesRoutes;
  routes: Routes;
}

// Create the container
const container = createContainer<ContainerInterface>();

// Register the database connection
container.register({
  db: asValue(db),
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
});

// Register all route factories
container.register({
  // Route instances
  userRoutes: asFunction(createUserRoutes),
  contactRoutes: asFunction(createContactRoutes),
  planRoutes: asFunction(createPlanRoutes),
  touchesRoutes: asFunction(createTouchesRoutes),
  routes: asFunction(createRoutes),
});

export { container };
export type Container = typeof container;
