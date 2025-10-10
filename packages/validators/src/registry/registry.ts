import { Contact, Touch, UpdateContact, UpdateUser, User } from '@network/contracts';
import typia from 'typia';

// Export validation functions using typia.validate for runtime validation
export const validateContact = (data: unknown) => typia.validate<Contact>(data);
export const validateUpdateContact = (data: unknown) => typia.validate<UpdateContact>(data);
export const validateInsertContact = (data: unknown) => typia.validate<Omit<Contact, 'id'>>(data);
export const validateTouch = (data: unknown) => typia.validate<Touch>(data);
export const validateInsertTouch = (data: unknown) => typia.validate<Omit<Touch, 'id'>>(data);
export const validateUser = (data: unknown) => typia.validate<User>(data);
export const validateUpdateUser = (data: unknown) => typia.validate<UpdateUser>(data);
export const validateInsertUser = (data: unknown) => typia.validate<Omit<User, 'id'>>(data);

export const validators = {
  contact: validateContact,
  insertContact: validateInsertContact,
  updateContact: validateUpdateContact,
  touch: validateTouch,
  insertTouch: validateInsertTouch,
  user: validateUser,
  insertUser: validateInsertUser,
  updateUser: validateUpdateUser,
} as const;

export type ValidatorKey = keyof typeof validators;

export function validate<K extends ValidatorKey>(key: K, data: unknown) {
  return validators[key](data);
}
