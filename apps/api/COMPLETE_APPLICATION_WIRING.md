# Complete Application Wiring with Awilix

This document describes how the entire application is wired up using Awilix dependency injection, from repositories up to the Koa server.

## Architecture Overview

The application follows a clean dependency hierarchy:

```
Koa Server
    ↓
Routes (Factory)
    ↓
Controllers (Factory)
    ↓
Repositories (Factory)
    ↓
Database (Knex)
```

## Dependency Flow

### 1. Repositories (Data Layer)

- Take database connection as dependency
- Return objects with data access methods
- Handle all database operations

### 2. Controllers (Business Logic Layer)

- Take repositories as dependencies
- Return objects with HTTP handler methods
- Handle request/response logic

### 3. Routes (Routing Layer)

- Take controllers as dependencies
- Return configured Koa routers
- Handle URL mapping

### 4. Application (Server Layer)

- Resolves routes from container
- Mounts routes on Koa app
- Handles server setup

## Implementation Details

### Repository Pattern

Each repository follows this pattern:

```typescript
export interface RepositoryName {
  method1: (param1: string) => Promise<any>;
  method2: (param2: number) => Promise<any>;
}

export const createRepositoryName = (db: Knex): RepositoryName => ({
  method1: async (param1: string) => {
    // Implementation using db
  },
  method2: async (param2: number) => {
    // Implementation using db
  },
});
```

### Controller Pattern

Each controller follows this pattern:

```typescript
export interface ControllerName {
  handler1: (ctx: Context) => Promise<Context>;
  handler2: (ctx: Context) => Promise<Context>;
}

export const createControllerName = (
  repository: Repository,
): ControllerName => ({
  handler1: async (ctx: Context) => {
    // Implementation using repository
  },
  handler2: async (ctx: Context) => {
    // Implementation using repository
  },
});
```

### Route Pattern

Each route follows this pattern:

```typescript
export interface RouteName {
  router: Router;
}

export const createRouteName = (controller: Controller): RouteName => {
  const router = new Router({ prefix: '/api/endpoint' });
  router.get('/', controller.handler1);
  router.post('/', controller.handler2);
  return { router };
};
```

## Container Configuration

The container registers all dependencies in the correct order:

```typescript
// 1. Database (singleton)
container.register({
  db: asValue(db),
});

// 2. Repositories (factories)
container.register({
  userRepository: asFunction(createUserRepository),
  contactRepository: asFunction(createContactRepository),
  // ... other repositories
});

// 3. Controllers (factories with repository dependencies)
container.register({
  userController: asFunction(createUserController),
  contactsController: asFunction(createContactsController),
  // ... other controllers
});

// 4. Routes (factories with controller dependencies)
container.register({
  userRoutes: asFunction(createUserRoutes),
  contactRoutes: asFunction(createContactRoutes),
  // ... other routes
});

// 5. Main routes (factory with all route dependencies)
container.register({
  routes: asFunction(createRoutes),
});
```

## Application Startup

The Koa server resolves dependencies and mounts routes:

```typescript
const app = new Koa();

// Setup middleware
app.use(errorHandler);
app.use(requestLogger);
app.use(koaBody());

// Resolve and mount routes from container
const routes = container.resolve('routes');
routes.mountRoutes(app);
```

## Benefits of This Architecture

### 1. **Dependency Inversion**

- High-level modules don't depend on low-level modules
- Both depend on abstractions
- Dependencies flow in one direction

### 2. **Testability**

- Easy to mock any layer for testing
- Dependencies are injected, not hardcoded
- Unit tests can focus on single responsibilities

### 3. **Maintainability**

- Clear separation of concerns
- Easy to add new features
- Easy to modify existing functionality

### 4. **Scalability**

- Easy to add new repositories, controllers, routes
- Consistent patterns across the application
- Clear dependency relationships

### 5. **Type Safety**

- TypeScript interfaces ensure correct contracts
- Compile-time checking of dependencies
- IntelliSense support throughout

## Example: Adding a New Feature

To add a new feature (e.g., notifications):

1. **Create Repository**

```typescript
export interface NotificationRepository {
  createNotification: (userId: string, message: string) => Promise<any>;
}

export const createNotificationRepository = (
  db: Knex,
): NotificationRepository => ({
  createNotification: async (userId: string, message: string) => {
    // Implementation
  },
});
```

2. **Create Controller**

```typescript
export interface NotificationController {
  sendNotification: (ctx: Context) => Promise<Context>;
}

export const createNotificationController = (
  notificationRepository: NotificationRepository,
): NotificationController => ({
  sendNotification: async (ctx: Context) => {
    // Implementation
  },
});
```

3. **Create Routes**

```typescript
export interface NotificationRoutes {
  router: Router;
}

export const createNotificationRoutes = (
  notificationController: NotificationController,
): NotificationRoutes => {
  const router = new Router({ prefix: '/api/notifications' });
  router.post('/', notificationController.sendNotification);
  return { router };
};
```

4. **Register in Container**

```typescript
container.register({
  notificationRepository: asFunction(createNotificationRepository),
  notificationController: asFunction(createNotificationController),
  notificationRoutes: asFunction(createNotificationRoutes),
});
```

5. **Update Main Routes**

```typescript
export const createRoutes = (
  // ... existing dependencies
  notificationRoutes: NotificationRoutes,
): Routes => ({
  mountRoutes: (app: Koa) => {
    // ... existing routes
    root.use(
      notificationRoutes.router.routes(),
      notificationRoutes.router.allowedMethods(),
    );
  },
});
```

## Testing Strategy

### Unit Tests

- Test each layer in isolation
- Mock dependencies using container
- Focus on single responsibilities

### Integration Tests

- Test complete request/response flow
- Use real database for data layer tests
- Test dependency resolution

### Example Test

```typescript
describe('UserController', () => {
  it('should get user by id', async () => {
    const mockUserRepository = {
      getUser: jest.fn().mockResolvedValue({ id: '1', name: 'John' }),
    };

    const userController = createUserController(mockUserRepository);
    const ctx = { state: { user: { id: '1' } } } as any;

    await userController.getMe(ctx);

    expect(mockUserRepository.getUser).toHaveBeenCalledWith('1');
    expect(ctx.body).toEqual({ id: '1', name: 'John' });
  });
});
```

## Conclusion

This architecture provides a clean, testable, and maintainable foundation for the application. The dependency injection pattern ensures loose coupling while maintaining type safety and clear separation of concerns.
