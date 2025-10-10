// packages/validators/src/index.ts

// Re-export public types/helpers defined in source (stable import paths)
export type { ValidatorKey } from './registry/registry';

export {
  validate,
  validateContact,
  validateInsertContact,
  validateInsertTouch,
  validateInsertUser,
  validateTouch,
  validateUpdateContact,
  validateUpdateUser,
  validateUser,
  validators,
} from './registry/registry';

// Re-export generated validators for tree-shaking and direct imports.
// After generation, _typia contains .ts; after build, those become JS/DTS in dist/_typia.
// Consumers will import from the built paths (see package.json below).
export * from './_typia/registry';
