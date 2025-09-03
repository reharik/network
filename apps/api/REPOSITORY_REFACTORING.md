# Repository Refactoring with Awilix

This document describes the refactoring of repositories to use Awilix dependency injection with factory functions.

## Overview

All repositories have been refactored from individual exported functions to factory functions that take dependencies and return objects with all repository methods.

## Changes Made

### 1. Repository Structure

Each repository now follows this pattern:

```typescript
export interface RepositoryName {
  method1: (param1: string, param2: number) => Promise<any>;
  method2: (param1: string) => Promise<any>;
}

export const createRepositoryName = (db: Knex): RepositoryName => ({
  method1: async (param1: string, param2: number) => {
    // Implementation
  },
  method2: async (param1: string) => {
    // Implementation
  },
});
```

### 2. Repositories Refactored

- **userRepository**: `getUser`, `updateDailyGoal`
- **contactRepository**: `listContacts`, `createContact`, `getContact`, `patchContact`
- **planRepository**: `getDailyPlan`
- **touchesRepository**: `createTouch`
- **suggestionRepository**: `getSuggestionsForContact`

### 3. Dependency Injection Container

Created `src/container.ts` that registers all repository factories:

```typescript
container.register({
  userRepository: asFunction(createUserRepository),
  contactRepository: asFunction(createContactRepository),
  planRepository: asFunction(createPlanRepository),
  touchesRepository: asFunction(createTouchesRepository),
  suggestionRepository: asFunction(createSuggestionRepository),
});
```

### 4. Controller Updates

All controllers now resolve repository instances from the container:

```typescript
// Before
const getUser = ctx.container.resolve('getUser');
const user = await getUser(ctx.db, userId);

// After
const userRepository = ctx.container.resolve('userRepository');
const user = await userRepository.getUser(userId);
```

### 5. Koa Context Extension

Updated `src/types/koa.d.ts` to include the container in the context:

```typescript
declare module 'koa' {
  interface DefaultContext {
    db: Knex;
    user: User;
    container: Container;
  }
}
```

## Benefits

1. **Better Dependency Management**: Dependencies are injected rather than passed around
2. **Testability**: Easy to mock repositories for testing
3. **Consistency**: All repositories follow the same pattern
4. **Type Safety**: TypeScript interfaces ensure correct method signatures
5. **Scalability**: Easy to add new repositories and dependencies

## Usage

### In Controllers

```typescript
export const someController = async (ctx: Context) => {
  const userRepository = ctx.container.resolve('userRepository');
  const result = await userRepository.someMethod(params);
  // ...
};
```

### In Tests

```typescript
const userRepository = container.resolve('userRepository');
expect(typeof userRepository.getUser).toBe('function');
```

## Dependencies

- **awilix**: ^8.0.0 - Dependency injection container
- **knex**: ^3.1.0 - Database query builder (existing)
