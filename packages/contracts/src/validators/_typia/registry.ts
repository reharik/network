import * as __typia_transform__validateReport from "typia/lib/internal/_validateReport.js";
import * as __typia_transform__accessExpressionAsString from "typia/lib/internal/_accessExpressionAsString.js";
import type { Contact, Touch, UpdateContact, UpdateUser, User } from "../../types/entities";
// Export validation functions using typia.validate for runtime validation
export const validateContact = (data: unknown) => (() => { const __is = (input: any): input is Contact => true; let errors: any; let _report: any; return (input: any): import("typia").IValidation<Contact> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => true)(input, "$input", true);
        const success = 0 === errors.length;
        return success ? {
            success,
            data: input
        } : {
            success,
            errors,
            data: input
        } as any;
    }
    return {
        success: true,
        data: input
    } as any;
}; })()(data);
export const validateUpdateContact = (data: unknown) => (() => { const __is = (input: any): input is UpdateContact => true; let errors: any; let _report: any; return (input: any): import("typia").IValidation<UpdateContact> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => true)(input, "$input", true);
        const success = 0 === errors.length;
        return success ? {
            success,
            data: input
        } : {
            success,
            errors,
            data: input
        } as any;
    }
    return {
        success: true,
        data: input
    } as any;
}; })()(data);
export const validateInsertContact = (data: unknown) => (() => { const _io0 = (input: any): boolean => Object.keys(input).every((key: any) => {
    const value = input[key];
    if (undefined === value)
        return true;
    return true;
}); const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [false === _exceptionable || Object.keys(input).map((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        return true;
    }).every((flag: boolean) => flag)].every((flag: boolean) => flag); const __is = (input: any): input is Omit<Contact, 'id'> => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<Omit<Contact, 'id'>> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
            path: _path + "",
            expected: "Omit<__type, \"id\">",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "Omit<__type, \"id\">",
            value: input
        }))(input, "$input", true);
        const success = 0 === errors.length;
        return success ? {
            success,
            data: input
        } : {
            success,
            errors,
            data: input
        } as any;
    }
    return {
        success: true,
        data: input
    } as any;
}; })()(data);
export const validateTouch = (data: unknown) => (() => { const __is = (input: any): input is Touch => true; let errors: any; let _report: any; return (input: any): import("typia").IValidation<Touch> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => true)(input, "$input", true);
        const success = 0 === errors.length;
        return success ? {
            success,
            data: input
        } : {
            success,
            errors,
            data: input
        } as any;
    }
    return {
        success: true,
        data: input
    } as any;
}; })()(data);
export const validateInsertTouch = (data: unknown) => (() => { const _io0 = (input: any): boolean => Object.keys(input).every((key: any) => {
    const value = input[key];
    if (undefined === value)
        return true;
    return true;
}); const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [false === _exceptionable || Object.keys(input).map((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        return true;
    }).every((flag: boolean) => flag)].every((flag: boolean) => flag); const __is = (input: any): input is Omit<Touch, 'id'> => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<Omit<Touch, 'id'>> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
            path: _path + "",
            expected: "Omit<__type, \"id\">",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "Omit<__type, \"id\">",
            value: input
        }))(input, "$input", true);
        const success = 0 === errors.length;
        return success ? {
            success,
            data: input
        } : {
            success,
            errors,
            data: input
        } as any;
    }
    return {
        success: true,
        data: input
    } as any;
}; })()(data);
export const validateUser = (data: unknown) => (() => { const __is = (input: any): input is User => true; let errors: any; let _report: any; return (input: any): import("typia").IValidation<User> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => true)(input, "$input", true);
        const success = 0 === errors.length;
        return success ? {
            success,
            data: input
        } : {
            success,
            errors,
            data: input
        } as any;
    }
    return {
        success: true,
        data: input
    } as any;
}; })()(data);
export const validateUpdateUser = (data: unknown) => (() => { const __is = (input: any): input is UpdateUser => true; let errors: any; let _report: any; return (input: any): import("typia").IValidation<UpdateUser> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => true)(input, "$input", true);
        const success = 0 === errors.length;
        return success ? {
            success,
            data: input
        } : {
            success,
            errors,
            data: input
        } as any;
    }
    return {
        success: true,
        data: input
    } as any;
}; })()(data);
export const validateInsertUser = (data: unknown) => (() => { const _io0 = (input: any): boolean => Object.keys(input).every((key: any) => {
    const value = input[key];
    if (undefined === value)
        return true;
    return true;
}); const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [false === _exceptionable || Object.keys(input).map((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        return true;
    }).every((flag: boolean) => flag)].every((flag: boolean) => flag); const __is = (input: any): input is Omit<User, 'id'> => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<Omit<User, 'id'>> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
            path: _path + "",
            expected: "Omit<__type, \"id\">",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "Omit<__type, \"id\">",
            value: input
        }))(input, "$input", true);
        const success = 0 === errors.length;
        return success ? {
            success,
            data: input
        } : {
            success,
            errors,
            data: input
        } as any;
    }
    return {
        success: true,
        data: input
    } as any;
}; })()(data);
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
