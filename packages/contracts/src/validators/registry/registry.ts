import typia from 'typia';
import type {
  Contact,
  CreateTouchInput,
  SignupCredentials,
  Touch,
  UpdateContact,
  UpdateUser,
  User,
} from '../../types/entities';

// Export validation functions using typia.validate for runtime validation
export const validateContact = (data: unknown) => typia.validate<Contact>(data);
export const validateUpdateContact = (data: unknown) => typia.validate<UpdateContact>(data);
export const validateInsertContact = (data: unknown) => typia.validate<Omit<Contact, 'id'>>(data);
export const validateTouch = (data: unknown) => typia.validate<Touch>(data);
export const validateInsertTouch = (data: unknown) => typia.validate<Omit<Touch, 'id'>>(data);
// Client-side validator - doesn't require userId (server adds from JWT)
export const validateCreateTouchInput = (data: unknown) => typia.validate<CreateTouchInput>(data);
export const validateUser = (data: unknown) => typia.validate<User>(data);
export const validateUpdateUser = (data: unknown) => typia.validate<UpdateUser>(data);
export const validateInsertUser = (data: unknown) => typia.validate<Omit<User, 'id'>>(data);
export const validateSignupCredentials = (data: unknown) => typia.validate<SignupCredentials>(data);

export const validators = {
  contact: validateContact,
  insertContact: validateInsertContact,
  updateContact: validateUpdateContact,
  touch: validateTouch,
  insertTouch: validateInsertTouch,
  createTouchInput: validateCreateTouchInput,
  user: validateUser,
  insertUser: validateInsertUser,
  updateUser: validateUpdateUser,
  signupCredentials: validateSignupCredentials,
} as const;

export type ValidatorKey = keyof typeof validators;

export function validate<K extends ValidatorKey>(key: K, data: unknown) {
  return validators[key](data);
}
