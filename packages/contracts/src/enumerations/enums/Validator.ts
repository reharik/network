import { enumeration, Enumeration } from 'smart-enums';
import typia from 'typia';
import {
  validateContact,
  validateInsertContact,
  validateInsertTouch,
  validateInsertUser,
  validateTouch,
  validateUpdateContact,
  validateUpdateUser,
  validateUser,
} from '../../validators/registry/registry';

// Validator enum items map to validator function names
// The actual validator functions are in the validators module
type ValidatorItem = {
  validate: (data: unknown) => typia.IValidation<unknown>;
};

const input = {
  contact: { validate: validateContact },
  insertContact: { validate: validateInsertContact },
  updateContact: { validate: validateUpdateContact },
  touch: { validate: validateTouch },
  insertTouch: { validate: validateInsertTouch },
  user: { validate: validateUser },
  insertUser: { validate: validateInsertUser },
  updateUser: { validate: validateUpdateUser },
};

export const Validator = enumeration<typeof input, ValidatorItem>('Validator', {
  input,
});
export type Validator = Enumeration<typeof Validator>;
