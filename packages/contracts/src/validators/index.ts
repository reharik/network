// Re-export validation functions
export {
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

// Re-export Validator enum from enumerations
export { Validator } from '../enumerations/enums/Validator';
export type { Validator as ValidatorEnum } from '../enumerations/enums/Validator';
