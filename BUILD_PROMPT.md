# Application Architecture & Technology Stack Prompt

Build a full-stack TypeScript application with the following architecture and technologies:

## Project Structure

Use an **Nx monorepo** with npm workspaces, organizing code into:

- `apps/web` - React frontend application
- `apps/api` - Node.js backend API server
- `packages/contracts` - Shared types and validation between frontend and backend

## Frontend Stack (`apps/web`)

### Core Technologies

- **React 19** with TypeScript
- **Vite 6** as the build tool and dev server (using `@nx/vite`)
- **React Router DOM 7** for client-side routing
- **Styled Components 6** for CSS-in-JS styling with theme support
- **TanStack React Query 5** for server state management and data fetching
- **TypeScript 5.9** with strict mode enabled

### Key Patterns & Libraries

1. **Type-Safe API Client**:
   - Use `parse-fetch` (^0.0.9) for type-safe HTTP requests with automatic JSON parsing
   - Create custom hooks (e.g., `useApiFetch`) that wrap `parse-fetch` with:
     - Authentication token injection
     - Smart enum revival using `smart-enums` after transport
     - Typia-based response validation with custom error mapping
   - Return a custom `ApiResult<T>` type with structured error handling:
     ```typescript
     type ApiResult<T> = { success: true; data: T } | { success: false; errors: ApiError[] };
     ```
   - Define error types with discriminators: `ValidationError`, `ParseError`, `HttpError`, `NetworkError`
   - Each error must have a `message` property and optional `originalError`
   - Validation errors should include `path`, `expected`, and `message` for field-specific errors

2. **Runtime Validation**:
   - Use **Typia 9** for compile-time validation code generation
   - Create a shared `packages/contracts` package that exports:
     - Entity types (shared between frontend and backend)
     - Typia validation functions (e.g., `validateContact`, `validateUpdateContact`)
     - Smart enum definitions using `smart-enums` (^0.0.22)
   - Generate Typia validators using `typia generate` in the contracts package
   - Use precompiled validators in the frontend to validate API responses

3. **Smart Enums**:
   - Use `smart-enums` for type-safe enum-like structures with:
     - `.value` for serialization
     - `.display` for human-readable labels
     - `.fromValue()` and `.tryFromValue()` for deserialization
     - `.toOptions()` for dropdown/select options
   - Initialize global mappings with `initializeSmartEnumMappings({ enumRegistry })`
   - Use `reviveAfterTransport` to convert serialized enum values back to enum instances after API calls

4. **Form Components**:
   - Build a polymorphic `FormInput` component using TypeScript generics:
     - Accepts `as?: 'input' | 'select' | 'textarea'` prop to render different HTML elements
     - Uses discriminated union types for proper prop inference based on `as` prop
     - Integrates with validation error system to show field-specific errors
     - Uses styled-components with error state styling (red borders, error messages)
     - Supports optional labels (for use inside Field wrappers)
   - All event handlers must be explicitly typed (e.g., `React.ChangeEvent<HTMLInputElement>`)
   - Never use `any` types - use `unknown` for truly unknown types

5. **Error Handling**:
   - Create type guards for error discrimination (e.g., `isValidationError`)
   - Map API errors to user-friendly messages
   - Display field-specific validation errors inline with form inputs
   - Show general errors at the top of forms

6. **Code Style & Quality**:
   - Use arrow functions exclusively (never `function` keyword)
   - Always use explicit return types for public functions
   - Never use `any` without justification - prefer `unknown` and type guards
   - Never use type assertions (`as`) without explicit justification
   - Validate all inputs before use
   - Use ESLint with TypeScript strict rules
   - Use Prettier for code formatting

## Backend Stack (`apps/api`)

### Core Technologies

- **Node.js** with TypeScript
- **Koa 2** as the web framework (not Express)
- **Knex 3** for SQL query builder and migrations (PostgreSQL)
- **Awilix 12** for dependency injection
- **JWT** (jsonwebtoken) for authentication
- **Luxon 3** for date/time handling
- **Typia 9** for request validation (same as frontend - use shared validators from contracts package)

### Architecture Patterns

1. **Dependency Injection with Awilix**:
   - Structure: Routes → Controllers → Repositories → Database
   - Use factory pattern for all services: `createRepository`, `createController`, `createRoutes`
   - Auto-register all factories using Awilix container
   - Generate TypeScript types for the container (`gen:container` script)
   - Use `LIFETIME.SINGLETON` for shared services, `LIFETIME.SCOPED` for request-scoped services

2. **Repository Pattern**:
   - Each entity has a repository (e.g., `ContactRepository`, `UserRepository`)
   - Repositories take `Knex` database connection as dependency
   - Return interfaces with typed methods
   - Handle all database queries and data transformation
   - Use Knex query builder (not raw SQL)
   - Convert `null` to `undefined` in post-processing hooks

3. **Controller Pattern**:
   - Controllers take repositories as dependencies
   - Handle Koa context (request/response)
   - Implement business logic
   - Return properly typed responses
   - Use async/await throughout

4. **Route Pattern**:
   - Routes take controllers as dependencies
   - Return configured Koa Router instances
   - Handle HTTP method mapping (GET, POST, PUT, DELETE, etc.)
   - Apply middleware where needed (auth, validation, etc.)

5. **Middleware Stack** (in order):
   - Error handler (first)
   - Request logger
   - CORS middleware
   - Body parser (with custom reviver for smart enums)
   - Smart enum request revival (after body parsing)
   - Authentication middleware (optional for some routes)
   - Routes
   - Smart enum response serialization (last)

6. **Database**:
   - Use **PostgreSQL** via Knex
   - Migration-based schema management
   - Seed data support
   - Convert database `null` values to JavaScript `undefined` in Knex config
   - Use UUIDs for primary keys
   - Index frequently queried columns

7. **Authentication**:
   - JWT-based authentication
   - Store tokens in HTTP-only cookies
   - Optional auth middleware (some routes public, some protected)
   - Extract user from JWT token in middleware

8. **Smart Enum Support**:
   - Serialize smart enums to their `.value` when sending JSON responses
   - Revive smart enums from `.value` when receiving JSON requests
   - Use middleware hooks for automatic conversion

9. **Configuration Pattern**:
   - **Backend (`apps/api/src/config.ts`)**:
     - Use `dotenv` to load environment variables from `.env` file
     - Create a `setupConfig()` function that:
       - Validates `NODE_ENV` against allowed values (development, test, production, prod)
       - Provides sensible defaults for all configuration values
       - Implements production safety checks with warnings:
         - Warn if `AWS_ENDPOINT` is set in production (LocalStack should only be used in dev)
         - Warn if default JWT secret is used in production
         - Warn if AWS credentials are missing in production
       - Returns a strongly-typed `Config` object
     - Export a singleton `config` object: `export const config = setupConfig()`
     - Use `getValidValue<T>()` utility function to validate enum-like values
     - Load `.env` file from `../.env` relative to the compiled output directory
     - Use `override: false` in dotenv to respect existing environment variables
   - **Frontend (`apps/web/src/config.ts`)**:
     - Use Vite's `import.meta.env` for environment variables (prefixed with `VITE_`)
     - Export a typed `WebConfig` object with defaults
     - Use `import.meta.env.VITE_*` for environment-specific values
     - Provide sensible defaults for all configuration values
   - **Environment Files**:
     - Create `.env.example` or `.env_sample` files showing all required variables
     - Document each variable's purpose and default value
     - Never commit actual `.env` files (add to `.gitignore`)
     - Use different `.env` files for different environments (local, dev, staging, prod)

## Shared Contracts Package (`packages/contracts`)

- Export all entity types shared between frontend and backend
- Export Typia validation functions
- Export smart enum registries
- Build process:
  1. Generate Typia validators: `typia generate --input src/validators/registry --output src/validators/_typia`
  2. Compile TypeScript
  3. Export compiled code

## Development Workflow

1. **Monorepo Management**:
   - Use Nx for build orchestration and caching
   - Use npm workspaces for dependency management
   - Separate `tsconfig.json` files per package/app with path references

2. **Type Safety**:
   - Share types through the `contracts` package
   - Use Typia for runtime validation
   - Generate validation code, don't write it manually
   - Use `ts-patch` for TypeScript transformer plugins if needed

3. **Code Quality**:
   - ESLint with TypeScript rules
   - Prettier for formatting
   - Never suppress errors with `@ts-ignore` without explanation
   - Always provide proper error handling

4. **Build & Deploy**:
   - Frontend: Vite production build
   - Backend: Nx build with esbuild or TypeScript compiler
   - Generate Typia validators before building contracts package

## Docker & Containerization

### Docker Setup

1. **Dockerfile Structure** (for API):
   - Use multi-stage builds with separate targets: `base`, `deps-dev-staging`, `deps-prod`, `build`, `dev`, `staging`, `production`
   - Base stage: Use `node:22-slim` with git and vim installed
   - Dependencies: Separate dev/staging dependencies from production dependencies
   - Build stage: Generate Typia validators and container types, then build application
   - Runtime stages:
     - `dev`: Full development environment with hot reloading via nodemon
     - `staging`: Production build with dev tools for CI/testing
     - `production`: Minimal production image with only runtime dependencies
   - Use `.dockerignore` to exclude `node_modules`, `.nx/cache`, and development files

2. **Docker Compose Configuration**:
   - Create `docker-compose-dev.yml` for local development with:
     - PostgreSQL service (postgres:16-alpine) with health checks
     - LocalStack service (for AWS services like SES, SNS) for local testing
     - API service with volume mounts for hot reloading
     - Health checks and service dependencies
     - Volume mounts: source code (excluding node_modules), packages
     - Environment variables via `.env` file
   - Create `docker-compose-local-prod.yml` for production-like local testing
   - Services should wait for dependencies using `condition: service_healthy`

3. **Docker Environment Variables**:
   - Load from `.env` files using `env_file` directive
   - Override specific vars in `environment` section
   - Use consistent naming: `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
   - Configure AWS LocalStack endpoints for development testing

4. **Development Docker Workflow**:

   ```bash
   # Build and start all services
   docker compose -f docker-compose-dev.yml up

   # Rebuild images
   docker compose -f docker-compose-dev.yml up --build

   # Stop and remove containers/volumes
   docker compose -f docker-compose-dev.yml down --rmi local --remove-orphans --volumes
   ```

5. **Production Docker Workflow**:
   - Build production image: `docker build --target production -t app-api:latest .`
   - Run with docker-compose or directly: `docker run -p 3000:3000 app-api:latest`
   - Use health checks and restart policies for production deployment

6. **Docker Best Practices**:
   - Use multi-stage builds to minimize final image size
   - Leverage build cache by ordering Dockerfile instructions properly
   - Copy package files before source code to maximize cache hits
   - Use specific node version (e.g., `node:22-slim`) for reproducibility
   - Exclude development files and dependencies from production image
   - Set `NODE_ENV=production` in production stage

## Testing

### Testing Stack

1. **Test Framework**:
   - Use **Jest 30** for unit and integration tests
   - Use `@testing-library/react` 16 for React component testing
   - Use `@testing-library/user-event` 14 for user interaction testing
   - Configure Jest with `jest-environment-jsdom` for React tests
   - Use `supertest` 7 for API endpoint testing

2. **Test Structure**:
   - **Unit Tests**: Test individual functions, utilities, and services in isolation
   - **Integration Tests**: Test API endpoints with database (use test database)
   - **Component Tests**: Test React components with React Testing Library
   - **E2E Tests**: Consider Playwright or Cypress for end-to-end testing (optional)

3. **Backend Testing**:
   - Test repositories with real database (use test DB or transactions)
   - Test controllers with mocked repositories
   - Test routes with supertest and full middleware stack
   - Test dependency injection container setup
   - Use test containers or in-memory databases for CI

4. **Frontend Testing**:
   - Test React components with React Testing Library
   - Test custom hooks with `@testing-library/react-hooks`
   - Test API client hooks with mocked fetch/parse-fetch
   - Test form validation and error handling
   - Use MSW (Mock Service Worker) for API mocking if needed

5. **Test Configuration**:
   - Configure Jest with TypeScript support (`ts-jest` or `@nx/jest`)
   - Set up separate test databases for integration tests
   - Use environment variables to configure test vs production databases
   - Run tests in `--runInBand` mode for integration tests to avoid database conflicts
   - Use `--detectOpenHandles` to find unclosed connections

6. **Test Utilities**:
   - Create test factories for entities (e.g., `createTestUser`, `createTestContact`)
   - Create test database helpers (setup/teardown, seed data)
   - Create test container setup for dependency injection testing
   - Create mock implementations for external services (AWS, email, etc.)

7. **Running Tests**:

   ```bash
   # Run all tests
   npm test

   # Run tests in watch mode
   npm run test:watch

   # Run tests in CI mode (single process, no cache)
   npm run test:ci

   # Run specific test file
   nx test api --testPathPattern=contactRepository
   ```

8. **Test Coverage**:
   - Aim for high coverage on business logic and utilities
   - Don't require 100% coverage - focus on critical paths
   - Use coverage reports to identify untested code
   - Configure coverage thresholds in Jest config

9. **Test Best Practices**:
   - Use descriptive test names that explain what is being tested
   - Arrange-Act-Assert pattern for test structure
   - Test behavior, not implementation details
   - Mock external dependencies (databases, APIs, file system)
   - Clean up test data after each test
   - Use test fixtures and factories for consistent test data
   - Test error cases and edge cases, not just happy paths

## Key Design Principles

1. **Type Safety First**: Leverage TypeScript's type system fully - no `any` types
2. **Separation of Concerns**: Clear layers (UI, hooks, services, API)
3. **Functional Style**: Arrow functions, immutable patterns
4. **Error Handling**: Structured errors with proper types
5. **Runtime Validation**: Validate all data at API boundaries using Typia
6. **Shared Contracts**: Single source of truth for types between frontend/backend
7. **Dependency Injection**: Use DI container for testability and modularity
8. **Smart Enums**: Type-safe enum-like structures that serialize properly

## Example Application Flow

1. User fills out a form in React (using polymorphic `FormInput`)
2. Form submits via custom hook (e.g., `useContactService().createContact`)
3. Hook calls `useApiFetch().apiFetch()` which:
   - Adds auth token
   - Serializes request body
   - Makes HTTP request via `parse-fetch`
   - Revives smart enums from response
   - Optionally validates response with Typia validator
   - Returns `ApiResult<T>` with success/error discriminated union
4. Backend receives request via Koa middleware stack
5. Route handler extracts controller from Awilix container
6. Controller calls repository method
7. Repository executes Knex query against PostgreSQL
8. Response flows back through middleware (smart enum serialization)
9. Frontend receives typed, validated response

## Additional Notes

### Prompt Size Considerations

This prompt is comprehensive and may be too large for some AI assistants to process in a single request. Consider:

- Breaking into sections when using with AI assistants
- Creating a template repository instead (see below)
- Using this as a reference document rather than a single prompt

### Template Repository

Consider extracting this into a **GitHub template repository** that includes:

1. **Complete Nx monorepo structure** with all configured packages
2. **Pre-configured Docker setup** with docker-compose files
3. **Example implementations** of key patterns:
   - Type-safe API client with `parse-fetch` and `ApiResult<T>`
   - Polymorphic `FormInput` component
   - Repository/Controller/Route examples
   - Typia validation setup
   - Smart enum definitions
4. **Pre-configured test setup** with Jest and testing libraries
5. **CI/CD workflows** (GitHub Actions, etc.)
6. **Documentation** including this prompt as `ARCHITECTURE.md`
7. **Environment variable templates** (`.env.example` files)
8. **Pre-commit hooks** for linting and formatting

This would allow developers to:

- Clone the template and start building immediately
- Learn patterns from working examples
- Follow best practices from day one
- Customize for their specific domain

The template would be particularly valuable because:

- The patterns are complex and benefit from working examples
- Configuration across multiple tools (Nx, Vite, Typia, Docker, Jest) is intricate
- Type-safe patterns require specific setup that's hard to get right from scratch
