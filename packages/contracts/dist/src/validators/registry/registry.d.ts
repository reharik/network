import typia from 'typia';
import type { Contact, Touch, User } from '../../types/entities';
export declare const validateContact: (data: unknown) => typia.IValidation<Contact>;
export declare const validateUpdateContact: (data: unknown) => typia.IValidation<Partial<Contact>>;
export declare const validateInsertContact: (data: unknown) => typia.IValidation<Omit<Contact, "id">>;
export declare const validateTouch: (data: unknown) => typia.IValidation<Touch>;
export declare const validateInsertTouch: (data: unknown) => typia.IValidation<Omit<Touch, "id">>;
export declare const validateUser: (data: unknown) => typia.IValidation<User>;
export declare const validateUpdateUser: (data: unknown) => typia.IValidation<Partial<User>>;
export declare const validateInsertUser: (data: unknown) => typia.IValidation<Omit<User, "id">>;
export declare const validators: {
    readonly contact: (data: unknown) => typia.IValidation<Contact>;
    readonly insertContact: (data: unknown) => typia.IValidation<Omit<Contact, "id">>;
    readonly updateContact: (data: unknown) => typia.IValidation<Partial<Contact>>;
    readonly touch: (data: unknown) => typia.IValidation<Touch>;
    readonly insertTouch: (data: unknown) => typia.IValidation<Omit<Touch, "id">>;
    readonly user: (data: unknown) => typia.IValidation<User>;
    readonly insertUser: (data: unknown) => typia.IValidation<Omit<User, "id">>;
    readonly updateUser: (data: unknown) => typia.IValidation<Partial<User>>;
};
export type ValidatorKey = keyof typeof validators;
export declare function validate<K extends ValidatorKey>(key: K, data: unknown): typia.IValidation.IFailure | typia.IValidation.ISuccess<Partial<Contact>> | typia.IValidation.ISuccess<Omit<Contact, "id">> | typia.IValidation.ISuccess<Omit<Touch, "id">> | typia.IValidation.ISuccess<Partial<User>> | typia.IValidation.ISuccess<Omit<User, "id">>;
//# sourceMappingURL=registry.d.ts.map