import * as __typia_transform__isFormatUuid from "typia/lib/internal/_isFormatUuid.js";
import * as __typia_transform__isFormatEmail from "typia/lib/internal/_isFormatEmail.js";
import * as __typia_transform__isTypeInt32 from "typia/lib/internal/_isTypeInt32.js";
import * as __typia_transform__isFormatDateTime from "typia/lib/internal/_isFormatDateTime.js";
import * as __typia_transform__validateReport from "typia/lib/internal/_validateReport.js";
import { Contact, Touch, UpdateContact, UpdateUser, User } from '@network/contracts';
// Export validation functions using typia.validate for runtime validation
export const validateContact = (data: unknown) => (() => { const _io0 = (input: any): boolean => "string" === typeof input.id && __typia_transform__isFormatUuid._isFormatUuid(input.id) && ("string" === typeof input.userId && __typia_transform__isFormatUuid._isFormatUuid(input.userId)) && ("string" === typeof input.firstName && (1 <= input.firstName.length && input.firstName.length <= 200)) && ("string" === typeof input.lastName && (1 <= input.lastName.length && input.lastName.length <= 200)) && (undefined === input.email || "string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email)) && ("number" === typeof input.intervalDays && (__typia_transform__isTypeInt32._isTypeInt32(input.intervalDays) && 1 <= input.intervalDays && input.intervalDays <= 365)) && (undefined === input.snoozedUntil || "string" === typeof input.snoozedUntil && __typia_transform__isFormatDateTime._isFormatDateTime(input.snoozedUntil)) && (undefined === input.nextDueAt || "string" === typeof input.nextDueAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.nextDueAt)) && (undefined === input.lastTouchedAt || "string" === typeof input.lastTouchedAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.lastTouchedAt)) && (undefined === input.createdAt || "string" === typeof input.createdAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt)) && (undefined === input.updatedAt || "string" === typeof input.updatedAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.updatedAt)) && ("object" === typeof input.preferredMethod && null !== input.preferredMethod && _io1(input.preferredMethod)) && (undefined === input.phone || "string" === typeof input.phone) && (undefined === input.notes || "string" === typeof input.notes) && "string" === typeof input.suggestion && (undefined === input.paused || "boolean" === typeof input.paused); const _io1 = (input: any): boolean => "string" === typeof input.key && "string" === typeof input.value && (undefined === input.display || "string" === typeof input.display) && (undefined === input.index || "number" === typeof input.index) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true === input.__smart_enum_brand && (undefined === input.__smart_enum_type || "string" === typeof input.__smart_enum_type) && true && true; const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (__typia_transform__isFormatUuid._isFormatUuid(input.id) || _report(_exceptionable, {
        path: _path + ".id",
        expected: "string & Format<\"uuid\">",
        value: input.id
    })) || _report(_exceptionable, {
        path: _path + ".id",
        expected: "(string & Format<\"uuid\">)",
        value: input.id
    }), "string" === typeof input.userId && (__typia_transform__isFormatUuid._isFormatUuid(input.userId) || _report(_exceptionable, {
        path: _path + ".userId",
        expected: "string & Format<\"uuid\">",
        value: input.userId
    })) || _report(_exceptionable, {
        path: _path + ".userId",
        expected: "(string & Format<\"uuid\">)",
        value: input.userId
    }), "string" === typeof input.firstName && (1 <= input.firstName.length || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "string & MinLength<1>",
        value: input.firstName
    })) && (input.firstName.length <= 200 || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "string & MaxLength<200>",
        value: input.firstName
    })) || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "(string & MinLength<1> & MaxLength<200>)",
        value: input.firstName
    }), "string" === typeof input.lastName && (1 <= input.lastName.length || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "string & MinLength<1>",
        value: input.lastName
    })) && (input.lastName.length <= 200 || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "string & MaxLength<200>",
        value: input.lastName
    })) || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "(string & MinLength<1> & MaxLength<200>)",
        value: input.lastName
    }), undefined === input.email || "string" === typeof input.email && (__typia_transform__isFormatEmail._isFormatEmail(input.email) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "string & Format<\"email\">",
        value: input.email
    })) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "((string & Format<\"email\">) | undefined)",
        value: input.email
    }), "number" === typeof input.intervalDays && (__typia_transform__isTypeInt32._isTypeInt32(input.intervalDays) || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "number & Type<\"int32\">",
        value: input.intervalDays
    })) && (1 <= input.intervalDays || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "number & Minimum<1>",
        value: input.intervalDays
    })) && (input.intervalDays <= 365 || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "number & Maximum<365>",
        value: input.intervalDays
    })) || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "(number & Type<\"int32\"> & Minimum<1> & Maximum<365>)",
        value: input.intervalDays
    }), undefined === input.snoozedUntil || "string" === typeof input.snoozedUntil && (__typia_transform__isFormatDateTime._isFormatDateTime(input.snoozedUntil) || _report(_exceptionable, {
        path: _path + ".snoozedUntil",
        expected: "string & Format<\"date-time\">",
        value: input.snoozedUntil
    })) || _report(_exceptionable, {
        path: _path + ".snoozedUntil",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.snoozedUntil
    }), undefined === input.nextDueAt || "string" === typeof input.nextDueAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.nextDueAt) || _report(_exceptionable, {
        path: _path + ".nextDueAt",
        expected: "string & Format<\"date-time\">",
        value: input.nextDueAt
    })) || _report(_exceptionable, {
        path: _path + ".nextDueAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.nextDueAt
    }), undefined === input.lastTouchedAt || "string" === typeof input.lastTouchedAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.lastTouchedAt) || _report(_exceptionable, {
        path: _path + ".lastTouchedAt",
        expected: "string & Format<\"date-time\">",
        value: input.lastTouchedAt
    })) || _report(_exceptionable, {
        path: _path + ".lastTouchedAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.lastTouchedAt
    }), undefined === input.createdAt || "string" === typeof input.createdAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "string & Format<\"date-time\">",
        value: input.createdAt
    })) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.createdAt
    }), undefined === input.updatedAt || "string" === typeof input.updatedAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.updatedAt) || _report(_exceptionable, {
        path: _path + ".updatedAt",
        expected: "string & Format<\"date-time\">",
        value: input.updatedAt
    })) || _report(_exceptionable, {
        path: _path + ".updatedAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.updatedAt
    }), ("object" === typeof input.preferredMethod && null !== input.preferredMethod || _report(_exceptionable, {
        path: _path + ".preferredMethod",
        expected: "EnumItem<__type, ContactMethodItem>",
        value: input.preferredMethod
    })) && _vo1(input.preferredMethod, _path + ".preferredMethod", true && _exceptionable) || _report(_exceptionable, {
        path: _path + ".preferredMethod",
        expected: "EnumItem<__type, ContactMethodItem>",
        value: input.preferredMethod
    }), undefined === input.phone || "string" === typeof input.phone || _report(_exceptionable, {
        path: _path + ".phone",
        expected: "(string | undefined)",
        value: input.phone
    }), undefined === input.notes || "string" === typeof input.notes || _report(_exceptionable, {
        path: _path + ".notes",
        expected: "(string | undefined)",
        value: input.notes
    }), "string" === typeof input.suggestion || _report(_exceptionable, {
        path: _path + ".suggestion",
        expected: "string",
        value: input.suggestion
    }), undefined === input.paused || "boolean" === typeof input.paused || _report(_exceptionable, {
        path: _path + ".paused",
        expected: "(boolean | undefined)",
        value: input.paused
    })].every((flag: boolean) => flag); const _vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.key || _report(_exceptionable, {
        path: _path + ".key",
        expected: "string",
        value: input.key
    }), "string" === typeof input.value || _report(_exceptionable, {
        path: _path + ".value",
        expected: "string",
        value: input.value
    }), undefined === input.display || "string" === typeof input.display || _report(_exceptionable, {
        path: _path + ".display",
        expected: "(string | undefined)",
        value: input.display
    }), undefined === input.index || "number" === typeof input.index || _report(_exceptionable, {
        path: _path + ".index",
        expected: "(number | undefined)",
        value: input.index
    }), undefined === input.deprecated || "boolean" === typeof input.deprecated || _report(_exceptionable, {
        path: _path + ".deprecated",
        expected: "(boolean | undefined)",
        value: input.deprecated
    }), true === input.__smart_enum_brand || _report(_exceptionable, {
        path: _path + ".__smart_enum_brand",
        expected: "true",
        value: input.__smart_enum_brand
    }), undefined === input.__smart_enum_type || "string" === typeof input.__smart_enum_type || _report(_exceptionable, {
        path: _path + ".__smart_enum_type",
        expected: "(string | undefined)",
        value: input.__smart_enum_type
    }), true || _report(_exceptionable, {
        path: _path + ".link",
        expected: "unknown",
        value: input.link
    }), true || _report(_exceptionable, {
        path: _path + ".handle",
        expected: "unknown",
        value: input.handle
    })].every((flag: boolean) => flag); const __is = (input: any): input is Contact => "object" === typeof input && null !== input && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<Contact> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input || _report(true, {
            path: _path + "",
            expected: "Contact",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "Contact",
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
export const validateUpdateContact = (data: unknown) => (() => { const _io0 = (input: any): boolean => (undefined === input.id || "string" === typeof input.id && __typia_transform__isFormatUuid._isFormatUuid(input.id)) && (undefined === input.userId || "string" === typeof input.userId && __typia_transform__isFormatUuid._isFormatUuid(input.userId)) && (undefined === input.firstName || "string" === typeof input.firstName && (1 <= input.firstName.length && input.firstName.length <= 200)) && (undefined === input.lastName || "string" === typeof input.lastName && (1 <= input.lastName.length && input.lastName.length <= 200)) && (undefined === input.email || "string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email)) && (undefined === input.intervalDays || "number" === typeof input.intervalDays && (__typia_transform__isTypeInt32._isTypeInt32(input.intervalDays) && 1 <= input.intervalDays && input.intervalDays <= 365)) && (undefined === input.snoozedUntil || "string" === typeof input.snoozedUntil && __typia_transform__isFormatDateTime._isFormatDateTime(input.snoozedUntil)) && (undefined === input.nextDueAt || "string" === typeof input.nextDueAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.nextDueAt)) && (undefined === input.lastTouchedAt || "string" === typeof input.lastTouchedAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.lastTouchedAt)) && (undefined === input.createdAt || "string" === typeof input.createdAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt)) && (undefined === input.updatedAt || "string" === typeof input.updatedAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.updatedAt)) && (undefined === input.preferredMethod || "object" === typeof input.preferredMethod && null !== input.preferredMethod && _io1(input.preferredMethod)) && (undefined === input.phone || "string" === typeof input.phone) && (undefined === input.notes || "string" === typeof input.notes) && (undefined === input.suggestion || "string" === typeof input.suggestion) && (undefined === input.paused || "boolean" === typeof input.paused); const _io1 = (input: any): boolean => "string" === typeof input.key && "string" === typeof input.value && (undefined === input.display || "string" === typeof input.display) && (undefined === input.index || "number" === typeof input.index) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true === input.__smart_enum_brand && (undefined === input.__smart_enum_type || "string" === typeof input.__smart_enum_type) && true && true; const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.id || "string" === typeof input.id && (__typia_transform__isFormatUuid._isFormatUuid(input.id) || _report(_exceptionable, {
        path: _path + ".id",
        expected: "string & Format<\"uuid\">",
        value: input.id
    })) || _report(_exceptionable, {
        path: _path + ".id",
        expected: "((string & Format<\"uuid\">) | undefined)",
        value: input.id
    }), undefined === input.userId || "string" === typeof input.userId && (__typia_transform__isFormatUuid._isFormatUuid(input.userId) || _report(_exceptionable, {
        path: _path + ".userId",
        expected: "string & Format<\"uuid\">",
        value: input.userId
    })) || _report(_exceptionable, {
        path: _path + ".userId",
        expected: "((string & Format<\"uuid\">) | undefined)",
        value: input.userId
    }), undefined === input.firstName || "string" === typeof input.firstName && (1 <= input.firstName.length || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "string & MinLength<1>",
        value: input.firstName
    })) && (input.firstName.length <= 200 || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "string & MaxLength<200>",
        value: input.firstName
    })) || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "((string & MinLength<1> & MaxLength<200>) | undefined)",
        value: input.firstName
    }), undefined === input.lastName || "string" === typeof input.lastName && (1 <= input.lastName.length || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "string & MinLength<1>",
        value: input.lastName
    })) && (input.lastName.length <= 200 || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "string & MaxLength<200>",
        value: input.lastName
    })) || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "((string & MinLength<1> & MaxLength<200>) | undefined)",
        value: input.lastName
    }), undefined === input.email || "string" === typeof input.email && (__typia_transform__isFormatEmail._isFormatEmail(input.email) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "string & Format<\"email\">",
        value: input.email
    })) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "((string & Format<\"email\">) | undefined)",
        value: input.email
    }), undefined === input.intervalDays || "number" === typeof input.intervalDays && (__typia_transform__isTypeInt32._isTypeInt32(input.intervalDays) || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "number & Type<\"int32\">",
        value: input.intervalDays
    })) && (1 <= input.intervalDays || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "number & Minimum<1>",
        value: input.intervalDays
    })) && (input.intervalDays <= 365 || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "number & Maximum<365>",
        value: input.intervalDays
    })) || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "((number & Type<\"int32\"> & Minimum<1> & Maximum<365>) | undefined)",
        value: input.intervalDays
    }), undefined === input.snoozedUntil || "string" === typeof input.snoozedUntil && (__typia_transform__isFormatDateTime._isFormatDateTime(input.snoozedUntil) || _report(_exceptionable, {
        path: _path + ".snoozedUntil",
        expected: "string & Format<\"date-time\">",
        value: input.snoozedUntil
    })) || _report(_exceptionable, {
        path: _path + ".snoozedUntil",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.snoozedUntil
    }), undefined === input.nextDueAt || "string" === typeof input.nextDueAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.nextDueAt) || _report(_exceptionable, {
        path: _path + ".nextDueAt",
        expected: "string & Format<\"date-time\">",
        value: input.nextDueAt
    })) || _report(_exceptionable, {
        path: _path + ".nextDueAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.nextDueAt
    }), undefined === input.lastTouchedAt || "string" === typeof input.lastTouchedAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.lastTouchedAt) || _report(_exceptionable, {
        path: _path + ".lastTouchedAt",
        expected: "string & Format<\"date-time\">",
        value: input.lastTouchedAt
    })) || _report(_exceptionable, {
        path: _path + ".lastTouchedAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.lastTouchedAt
    }), undefined === input.createdAt || "string" === typeof input.createdAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "string & Format<\"date-time\">",
        value: input.createdAt
    })) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.createdAt
    }), undefined === input.updatedAt || "string" === typeof input.updatedAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.updatedAt) || _report(_exceptionable, {
        path: _path + ".updatedAt",
        expected: "string & Format<\"date-time\">",
        value: input.updatedAt
    })) || _report(_exceptionable, {
        path: _path + ".updatedAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.updatedAt
    }), undefined === input.preferredMethod || ("object" === typeof input.preferredMethod && null !== input.preferredMethod || _report(_exceptionable, {
        path: _path + ".preferredMethod",
        expected: "(EnumItem<__type, ContactMethodItem> | undefined)",
        value: input.preferredMethod
    })) && _vo1(input.preferredMethod, _path + ".preferredMethod", true && _exceptionable) || _report(_exceptionable, {
        path: _path + ".preferredMethod",
        expected: "(EnumItem<__type, ContactMethodItem> | undefined)",
        value: input.preferredMethod
    }), undefined === input.phone || "string" === typeof input.phone || _report(_exceptionable, {
        path: _path + ".phone",
        expected: "(string | undefined)",
        value: input.phone
    }), undefined === input.notes || "string" === typeof input.notes || _report(_exceptionable, {
        path: _path + ".notes",
        expected: "(string | undefined)",
        value: input.notes
    }), undefined === input.suggestion || "string" === typeof input.suggestion || _report(_exceptionable, {
        path: _path + ".suggestion",
        expected: "(string | undefined)",
        value: input.suggestion
    }), undefined === input.paused || "boolean" === typeof input.paused || _report(_exceptionable, {
        path: _path + ".paused",
        expected: "(boolean | undefined)",
        value: input.paused
    })].every((flag: boolean) => flag); const _vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.key || _report(_exceptionable, {
        path: _path + ".key",
        expected: "string",
        value: input.key
    }), "string" === typeof input.value || _report(_exceptionable, {
        path: _path + ".value",
        expected: "string",
        value: input.value
    }), undefined === input.display || "string" === typeof input.display || _report(_exceptionable, {
        path: _path + ".display",
        expected: "(string | undefined)",
        value: input.display
    }), undefined === input.index || "number" === typeof input.index || _report(_exceptionable, {
        path: _path + ".index",
        expected: "(number | undefined)",
        value: input.index
    }), undefined === input.deprecated || "boolean" === typeof input.deprecated || _report(_exceptionable, {
        path: _path + ".deprecated",
        expected: "(boolean | undefined)",
        value: input.deprecated
    }), true === input.__smart_enum_brand || _report(_exceptionable, {
        path: _path + ".__smart_enum_brand",
        expected: "true",
        value: input.__smart_enum_brand
    }), undefined === input.__smart_enum_type || "string" === typeof input.__smart_enum_type || _report(_exceptionable, {
        path: _path + ".__smart_enum_type",
        expected: "(string | undefined)",
        value: input.__smart_enum_type
    }), true || _report(_exceptionable, {
        path: _path + ".link",
        expected: "unknown",
        value: input.link
    }), true || _report(_exceptionable, {
        path: _path + ".handle",
        expected: "unknown",
        value: input.handle
    })].every((flag: boolean) => flag); const __is = (input: any): input is UpdateContact => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<UpdateContact> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
            path: _path + "",
            expected: "Partial<Contact>",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "Partial<Contact>",
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
export const validateInsertContact = (data: unknown) => (() => { const _io0 = (input: any): boolean => (undefined === input.email || "string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email)) && ("string" === typeof input.userId && __typia_transform__isFormatUuid._isFormatUuid(input.userId)) && ("string" === typeof input.firstName && (1 <= input.firstName.length && input.firstName.length <= 200)) && ("string" === typeof input.lastName && (1 <= input.lastName.length && input.lastName.length <= 200)) && ("number" === typeof input.intervalDays && (__typia_transform__isTypeInt32._isTypeInt32(input.intervalDays) && 1 <= input.intervalDays && input.intervalDays <= 365)) && (undefined === input.snoozedUntil || "string" === typeof input.snoozedUntil && __typia_transform__isFormatDateTime._isFormatDateTime(input.snoozedUntil)) && (undefined === input.nextDueAt || "string" === typeof input.nextDueAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.nextDueAt)) && (undefined === input.lastTouchedAt || "string" === typeof input.lastTouchedAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.lastTouchedAt)) && (undefined === input.createdAt || "string" === typeof input.createdAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt)) && (undefined === input.updatedAt || "string" === typeof input.updatedAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.updatedAt)) && ("object" === typeof input.preferredMethod && null !== input.preferredMethod && _io1(input.preferredMethod)) && (undefined === input.phone || "string" === typeof input.phone) && (undefined === input.notes || "string" === typeof input.notes) && "string" === typeof input.suggestion && (undefined === input.paused || "boolean" === typeof input.paused); const _io1 = (input: any): boolean => "string" === typeof input.key && "string" === typeof input.value && (undefined === input.display || "string" === typeof input.display) && (undefined === input.index || "number" === typeof input.index) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true === input.__smart_enum_brand && (undefined === input.__smart_enum_type || "string" === typeof input.__smart_enum_type) && true && true; const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.email || "string" === typeof input.email && (__typia_transform__isFormatEmail._isFormatEmail(input.email) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "string & Format<\"email\">",
        value: input.email
    })) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "((string & Format<\"email\">) | undefined)",
        value: input.email
    }), "string" === typeof input.userId && (__typia_transform__isFormatUuid._isFormatUuid(input.userId) || _report(_exceptionable, {
        path: _path + ".userId",
        expected: "string & Format<\"uuid\">",
        value: input.userId
    })) || _report(_exceptionable, {
        path: _path + ".userId",
        expected: "(string & Format<\"uuid\">)",
        value: input.userId
    }), "string" === typeof input.firstName && (1 <= input.firstName.length || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "string & MinLength<1>",
        value: input.firstName
    })) && (input.firstName.length <= 200 || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "string & MaxLength<200>",
        value: input.firstName
    })) || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "(string & MinLength<1> & MaxLength<200>)",
        value: input.firstName
    }), "string" === typeof input.lastName && (1 <= input.lastName.length || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "string & MinLength<1>",
        value: input.lastName
    })) && (input.lastName.length <= 200 || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "string & MaxLength<200>",
        value: input.lastName
    })) || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "(string & MinLength<1> & MaxLength<200>)",
        value: input.lastName
    }), "number" === typeof input.intervalDays && (__typia_transform__isTypeInt32._isTypeInt32(input.intervalDays) || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "number & Type<\"int32\">",
        value: input.intervalDays
    })) && (1 <= input.intervalDays || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "number & Minimum<1>",
        value: input.intervalDays
    })) && (input.intervalDays <= 365 || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "number & Maximum<365>",
        value: input.intervalDays
    })) || _report(_exceptionable, {
        path: _path + ".intervalDays",
        expected: "(number & Type<\"int32\"> & Minimum<1> & Maximum<365>)",
        value: input.intervalDays
    }), undefined === input.snoozedUntil || "string" === typeof input.snoozedUntil && (__typia_transform__isFormatDateTime._isFormatDateTime(input.snoozedUntil) || _report(_exceptionable, {
        path: _path + ".snoozedUntil",
        expected: "string & Format<\"date-time\">",
        value: input.snoozedUntil
    })) || _report(_exceptionable, {
        path: _path + ".snoozedUntil",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.snoozedUntil
    }), undefined === input.nextDueAt || "string" === typeof input.nextDueAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.nextDueAt) || _report(_exceptionable, {
        path: _path + ".nextDueAt",
        expected: "string & Format<\"date-time\">",
        value: input.nextDueAt
    })) || _report(_exceptionable, {
        path: _path + ".nextDueAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.nextDueAt
    }), undefined === input.lastTouchedAt || "string" === typeof input.lastTouchedAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.lastTouchedAt) || _report(_exceptionable, {
        path: _path + ".lastTouchedAt",
        expected: "string & Format<\"date-time\">",
        value: input.lastTouchedAt
    })) || _report(_exceptionable, {
        path: _path + ".lastTouchedAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.lastTouchedAt
    }), undefined === input.createdAt || "string" === typeof input.createdAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "string & Format<\"date-time\">",
        value: input.createdAt
    })) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.createdAt
    }), undefined === input.updatedAt || "string" === typeof input.updatedAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.updatedAt) || _report(_exceptionable, {
        path: _path + ".updatedAt",
        expected: "string & Format<\"date-time\">",
        value: input.updatedAt
    })) || _report(_exceptionable, {
        path: _path + ".updatedAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.updatedAt
    }), ("object" === typeof input.preferredMethod && null !== input.preferredMethod || _report(_exceptionable, {
        path: _path + ".preferredMethod",
        expected: "EnumItem<__type, ContactMethodItem>",
        value: input.preferredMethod
    })) && _vo1(input.preferredMethod, _path + ".preferredMethod", true && _exceptionable) || _report(_exceptionable, {
        path: _path + ".preferredMethod",
        expected: "EnumItem<__type, ContactMethodItem>",
        value: input.preferredMethod
    }), undefined === input.phone || "string" === typeof input.phone || _report(_exceptionable, {
        path: _path + ".phone",
        expected: "(string | undefined)",
        value: input.phone
    }), undefined === input.notes || "string" === typeof input.notes || _report(_exceptionable, {
        path: _path + ".notes",
        expected: "(string | undefined)",
        value: input.notes
    }), "string" === typeof input.suggestion || _report(_exceptionable, {
        path: _path + ".suggestion",
        expected: "string",
        value: input.suggestion
    }), undefined === input.paused || "boolean" === typeof input.paused || _report(_exceptionable, {
        path: _path + ".paused",
        expected: "(boolean | undefined)",
        value: input.paused
    })].every((flag: boolean) => flag); const _vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.key || _report(_exceptionable, {
        path: _path + ".key",
        expected: "string",
        value: input.key
    }), "string" === typeof input.value || _report(_exceptionable, {
        path: _path + ".value",
        expected: "string",
        value: input.value
    }), undefined === input.display || "string" === typeof input.display || _report(_exceptionable, {
        path: _path + ".display",
        expected: "(string | undefined)",
        value: input.display
    }), undefined === input.index || "number" === typeof input.index || _report(_exceptionable, {
        path: _path + ".index",
        expected: "(number | undefined)",
        value: input.index
    }), undefined === input.deprecated || "boolean" === typeof input.deprecated || _report(_exceptionable, {
        path: _path + ".deprecated",
        expected: "(boolean | undefined)",
        value: input.deprecated
    }), true === input.__smart_enum_brand || _report(_exceptionable, {
        path: _path + ".__smart_enum_brand",
        expected: "true",
        value: input.__smart_enum_brand
    }), undefined === input.__smart_enum_type || "string" === typeof input.__smart_enum_type || _report(_exceptionable, {
        path: _path + ".__smart_enum_type",
        expected: "(string | undefined)",
        value: input.__smart_enum_type
    }), true || _report(_exceptionable, {
        path: _path + ".link",
        expected: "unknown",
        value: input.link
    }), true || _report(_exceptionable, {
        path: _path + ".handle",
        expected: "unknown",
        value: input.handle
    })].every((flag: boolean) => flag); const __is = (input: any): input is Omit<Contact, 'id'> => "object" === typeof input && null !== input && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<Omit<Contact, 'id'>> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input || _report(true, {
            path: _path + "",
            expected: "Omit<Contact, \"id\">",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "Omit<Contact, \"id\">",
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
export const validateTouch = (data: unknown) => (() => { const _io0 = (input: any): boolean => "string" === typeof input.id && __typia_transform__isFormatUuid._isFormatUuid(input.id) && ("string" === typeof input.userId && __typia_transform__isFormatUuid._isFormatUuid(input.userId)) && ("string" === typeof input.contactId && __typia_transform__isFormatUuid._isFormatUuid(input.contactId)) && (undefined === input.createdAt || "string" === typeof input.createdAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt)) && ("object" === typeof input.method && null !== input.method && _io1(input.method)) && (undefined === input.message || "string" === typeof input.message) && (undefined === input.outcome || "string" === typeof input.outcome); const _io1 = (input: any): boolean => "string" === typeof input.key && "string" === typeof input.value && (undefined === input.display || "string" === typeof input.display) && (undefined === input.index || "number" === typeof input.index) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true === input.__smart_enum_brand && (undefined === input.__smart_enum_type || "string" === typeof input.__smart_enum_type) && true && true; const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (__typia_transform__isFormatUuid._isFormatUuid(input.id) || _report(_exceptionable, {
        path: _path + ".id",
        expected: "string & Format<\"uuid\">",
        value: input.id
    })) || _report(_exceptionable, {
        path: _path + ".id",
        expected: "(string & Format<\"uuid\">)",
        value: input.id
    }), "string" === typeof input.userId && (__typia_transform__isFormatUuid._isFormatUuid(input.userId) || _report(_exceptionable, {
        path: _path + ".userId",
        expected: "string & Format<\"uuid\">",
        value: input.userId
    })) || _report(_exceptionable, {
        path: _path + ".userId",
        expected: "(string & Format<\"uuid\">)",
        value: input.userId
    }), "string" === typeof input.contactId && (__typia_transform__isFormatUuid._isFormatUuid(input.contactId) || _report(_exceptionable, {
        path: _path + ".contactId",
        expected: "string & Format<\"uuid\">",
        value: input.contactId
    })) || _report(_exceptionable, {
        path: _path + ".contactId",
        expected: "(string & Format<\"uuid\">)",
        value: input.contactId
    }), undefined === input.createdAt || "string" === typeof input.createdAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "string & Format<\"date-time\">",
        value: input.createdAt
    })) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.createdAt
    }), ("object" === typeof input.method && null !== input.method || _report(_exceptionable, {
        path: _path + ".method",
        expected: "EnumItem<__type, ContactMethodItem>",
        value: input.method
    })) && _vo1(input.method, _path + ".method", true && _exceptionable) || _report(_exceptionable, {
        path: _path + ".method",
        expected: "EnumItem<__type, ContactMethodItem>",
        value: input.method
    }), undefined === input.message || "string" === typeof input.message || _report(_exceptionable, {
        path: _path + ".message",
        expected: "(string | undefined)",
        value: input.message
    }), undefined === input.outcome || "string" === typeof input.outcome || _report(_exceptionable, {
        path: _path + ".outcome",
        expected: "(string | undefined)",
        value: input.outcome
    })].every((flag: boolean) => flag); const _vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.key || _report(_exceptionable, {
        path: _path + ".key",
        expected: "string",
        value: input.key
    }), "string" === typeof input.value || _report(_exceptionable, {
        path: _path + ".value",
        expected: "string",
        value: input.value
    }), undefined === input.display || "string" === typeof input.display || _report(_exceptionable, {
        path: _path + ".display",
        expected: "(string | undefined)",
        value: input.display
    }), undefined === input.index || "number" === typeof input.index || _report(_exceptionable, {
        path: _path + ".index",
        expected: "(number | undefined)",
        value: input.index
    }), undefined === input.deprecated || "boolean" === typeof input.deprecated || _report(_exceptionable, {
        path: _path + ".deprecated",
        expected: "(boolean | undefined)",
        value: input.deprecated
    }), true === input.__smart_enum_brand || _report(_exceptionable, {
        path: _path + ".__smart_enum_brand",
        expected: "true",
        value: input.__smart_enum_brand
    }), undefined === input.__smart_enum_type || "string" === typeof input.__smart_enum_type || _report(_exceptionable, {
        path: _path + ".__smart_enum_type",
        expected: "(string | undefined)",
        value: input.__smart_enum_type
    }), true || _report(_exceptionable, {
        path: _path + ".link",
        expected: "unknown",
        value: input.link
    }), true || _report(_exceptionable, {
        path: _path + ".handle",
        expected: "unknown",
        value: input.handle
    })].every((flag: boolean) => flag); const __is = (input: any): input is Touch => "object" === typeof input && null !== input && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<Touch> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input || _report(true, {
            path: _path + "",
            expected: "Touch",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "Touch",
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
export const validateInsertTouch = (data: unknown) => (() => { const _io0 = (input: any): boolean => "string" === typeof input.userId && __typia_transform__isFormatUuid._isFormatUuid(input.userId) && (undefined === input.createdAt || "string" === typeof input.createdAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt)) && ("string" === typeof input.contactId && __typia_transform__isFormatUuid._isFormatUuid(input.contactId)) && ("object" === typeof input.method && null !== input.method && _io1(input.method)) && (undefined === input.message || "string" === typeof input.message) && (undefined === input.outcome || "string" === typeof input.outcome); const _io1 = (input: any): boolean => "string" === typeof input.key && "string" === typeof input.value && (undefined === input.display || "string" === typeof input.display) && (undefined === input.index || "number" === typeof input.index) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true === input.__smart_enum_brand && (undefined === input.__smart_enum_type || "string" === typeof input.__smart_enum_type) && true && true; const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.userId && (__typia_transform__isFormatUuid._isFormatUuid(input.userId) || _report(_exceptionable, {
        path: _path + ".userId",
        expected: "string & Format<\"uuid\">",
        value: input.userId
    })) || _report(_exceptionable, {
        path: _path + ".userId",
        expected: "(string & Format<\"uuid\">)",
        value: input.userId
    }), undefined === input.createdAt || "string" === typeof input.createdAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "string & Format<\"date-time\">",
        value: input.createdAt
    })) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.createdAt
    }), "string" === typeof input.contactId && (__typia_transform__isFormatUuid._isFormatUuid(input.contactId) || _report(_exceptionable, {
        path: _path + ".contactId",
        expected: "string & Format<\"uuid\">",
        value: input.contactId
    })) || _report(_exceptionable, {
        path: _path + ".contactId",
        expected: "(string & Format<\"uuid\">)",
        value: input.contactId
    }), ("object" === typeof input.method && null !== input.method || _report(_exceptionable, {
        path: _path + ".method",
        expected: "EnumItem<__type, ContactMethodItem>",
        value: input.method
    })) && _vo1(input.method, _path + ".method", true && _exceptionable) || _report(_exceptionable, {
        path: _path + ".method",
        expected: "EnumItem<__type, ContactMethodItem>",
        value: input.method
    }), undefined === input.message || "string" === typeof input.message || _report(_exceptionable, {
        path: _path + ".message",
        expected: "(string | undefined)",
        value: input.message
    }), undefined === input.outcome || "string" === typeof input.outcome || _report(_exceptionable, {
        path: _path + ".outcome",
        expected: "(string | undefined)",
        value: input.outcome
    })].every((flag: boolean) => flag); const _vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.key || _report(_exceptionable, {
        path: _path + ".key",
        expected: "string",
        value: input.key
    }), "string" === typeof input.value || _report(_exceptionable, {
        path: _path + ".value",
        expected: "string",
        value: input.value
    }), undefined === input.display || "string" === typeof input.display || _report(_exceptionable, {
        path: _path + ".display",
        expected: "(string | undefined)",
        value: input.display
    }), undefined === input.index || "number" === typeof input.index || _report(_exceptionable, {
        path: _path + ".index",
        expected: "(number | undefined)",
        value: input.index
    }), undefined === input.deprecated || "boolean" === typeof input.deprecated || _report(_exceptionable, {
        path: _path + ".deprecated",
        expected: "(boolean | undefined)",
        value: input.deprecated
    }), true === input.__smart_enum_brand || _report(_exceptionable, {
        path: _path + ".__smart_enum_brand",
        expected: "true",
        value: input.__smart_enum_brand
    }), undefined === input.__smart_enum_type || "string" === typeof input.__smart_enum_type || _report(_exceptionable, {
        path: _path + ".__smart_enum_type",
        expected: "(string | undefined)",
        value: input.__smart_enum_type
    }), true || _report(_exceptionable, {
        path: _path + ".link",
        expected: "unknown",
        value: input.link
    }), true || _report(_exceptionable, {
        path: _path + ".handle",
        expected: "unknown",
        value: input.handle
    })].every((flag: boolean) => flag); const __is = (input: any): input is Omit<Touch, 'id'> => "object" === typeof input && null !== input && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<Omit<Touch, 'id'>> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input || _report(true, {
            path: _path + "",
            expected: "Omit<Touch, \"id\">",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "Omit<Touch, \"id\">",
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
export const validateUser = (data: unknown) => (() => { const _io0 = (input: any): boolean => "string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email) && ("number" === typeof input.dailyGoal && (__typia_transform__isTypeInt32._isTypeInt32(input.dailyGoal) && 0 <= input.dailyGoal && input.dailyGoal <= 500)) && (undefined === input.createdAt || "string" === typeof input.createdAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt)) && ("string" === typeof input.lastLoginAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.lastLoginAt)) && "string" === typeof input.id && (null === input.firstName || "string" === typeof input.firstName) && (null === input.lastName || "string" === typeof input.lastName) && "string" === typeof input.passwordHash; const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.email && (__typia_transform__isFormatEmail._isFormatEmail(input.email) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "string & Format<\"email\">",
        value: input.email
    })) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "(string & Format<\"email\">)",
        value: input.email
    }), "number" === typeof input.dailyGoal && (__typia_transform__isTypeInt32._isTypeInt32(input.dailyGoal) || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "number & Type<\"int32\">",
        value: input.dailyGoal
    })) && (0 <= input.dailyGoal || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "number & Minimum<0>",
        value: input.dailyGoal
    })) && (input.dailyGoal <= 500 || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "number & Maximum<500>",
        value: input.dailyGoal
    })) || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "(number & Type<\"int32\"> & Minimum<0> & Maximum<500>)",
        value: input.dailyGoal
    }), undefined === input.createdAt || "string" === typeof input.createdAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "string & Format<\"date-time\">",
        value: input.createdAt
    })) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.createdAt
    }), "string" === typeof input.lastLoginAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.lastLoginAt) || _report(_exceptionable, {
        path: _path + ".lastLoginAt",
        expected: "string & Format<\"date-time\">",
        value: input.lastLoginAt
    })) || _report(_exceptionable, {
        path: _path + ".lastLoginAt",
        expected: "(string & Format<\"date-time\">)",
        value: input.lastLoginAt
    }), "string" === typeof input.id || _report(_exceptionable, {
        path: _path + ".id",
        expected: "string",
        value: input.id
    }), null === input.firstName || "string" === typeof input.firstName || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "(null | string)",
        value: input.firstName
    }), null === input.lastName || "string" === typeof input.lastName || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "(null | string)",
        value: input.lastName
    }), "string" === typeof input.passwordHash || _report(_exceptionable, {
        path: _path + ".passwordHash",
        expected: "string",
        value: input.passwordHash
    })].every((flag: boolean) => flag); const __is = (input: any): input is User => "object" === typeof input && null !== input && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<User> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input || _report(true, {
            path: _path + "",
            expected: "User",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "User",
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
export const validateUpdateUser = (data: unknown) => (() => { const _io0 = (input: any): boolean => (undefined === input.email || "string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email)) && (undefined === input.dailyGoal || "number" === typeof input.dailyGoal && (__typia_transform__isTypeInt32._isTypeInt32(input.dailyGoal) && 0 <= input.dailyGoal && input.dailyGoal <= 500)) && (undefined === input.createdAt || "string" === typeof input.createdAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt)) && (undefined === input.lastLoginAt || "string" === typeof input.lastLoginAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.lastLoginAt)) && (undefined === input.id || "string" === typeof input.id) && (null === input.firstName || undefined === input.firstName || "string" === typeof input.firstName) && (null === input.lastName || undefined === input.lastName || "string" === typeof input.lastName) && (undefined === input.passwordHash || "string" === typeof input.passwordHash); const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.email || "string" === typeof input.email && (__typia_transform__isFormatEmail._isFormatEmail(input.email) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "string & Format<\"email\">",
        value: input.email
    })) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "((string & Format<\"email\">) | undefined)",
        value: input.email
    }), undefined === input.dailyGoal || "number" === typeof input.dailyGoal && (__typia_transform__isTypeInt32._isTypeInt32(input.dailyGoal) || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "number & Type<\"int32\">",
        value: input.dailyGoal
    })) && (0 <= input.dailyGoal || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "number & Minimum<0>",
        value: input.dailyGoal
    })) && (input.dailyGoal <= 500 || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "number & Maximum<500>",
        value: input.dailyGoal
    })) || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "((number & Type<\"int32\"> & Minimum<0> & Maximum<500>) | undefined)",
        value: input.dailyGoal
    }), undefined === input.createdAt || "string" === typeof input.createdAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "string & Format<\"date-time\">",
        value: input.createdAt
    })) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.createdAt
    }), undefined === input.lastLoginAt || "string" === typeof input.lastLoginAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.lastLoginAt) || _report(_exceptionable, {
        path: _path + ".lastLoginAt",
        expected: "string & Format<\"date-time\">",
        value: input.lastLoginAt
    })) || _report(_exceptionable, {
        path: _path + ".lastLoginAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.lastLoginAt
    }), undefined === input.id || "string" === typeof input.id || _report(_exceptionable, {
        path: _path + ".id",
        expected: "(string | undefined)",
        value: input.id
    }), null === input.firstName || undefined === input.firstName || "string" === typeof input.firstName || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "(null | string | undefined)",
        value: input.firstName
    }), null === input.lastName || undefined === input.lastName || "string" === typeof input.lastName || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "(null | string | undefined)",
        value: input.lastName
    }), undefined === input.passwordHash || "string" === typeof input.passwordHash || _report(_exceptionable, {
        path: _path + ".passwordHash",
        expected: "(string | undefined)",
        value: input.passwordHash
    })].every((flag: boolean) => flag); const __is = (input: any): input is UpdateUser => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<UpdateUser> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
            path: _path + "",
            expected: "Partial<User>",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "Partial<User>",
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
export const validateInsertUser = (data: unknown) => (() => { const _io0 = (input: any): boolean => "string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email) && (null === input.firstName || "string" === typeof input.firstName) && (null === input.lastName || "string" === typeof input.lastName) && (undefined === input.createdAt || "string" === typeof input.createdAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt)) && ("number" === typeof input.dailyGoal && (__typia_transform__isTypeInt32._isTypeInt32(input.dailyGoal) && 0 <= input.dailyGoal && input.dailyGoal <= 500)) && ("string" === typeof input.lastLoginAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.lastLoginAt)) && "string" === typeof input.passwordHash; const _vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.email && (__typia_transform__isFormatEmail._isFormatEmail(input.email) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "string & Format<\"email\">",
        value: input.email
    })) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "(string & Format<\"email\">)",
        value: input.email
    }), null === input.firstName || "string" === typeof input.firstName || _report(_exceptionable, {
        path: _path + ".firstName",
        expected: "(null | string)",
        value: input.firstName
    }), null === input.lastName || "string" === typeof input.lastName || _report(_exceptionable, {
        path: _path + ".lastName",
        expected: "(null | string)",
        value: input.lastName
    }), undefined === input.createdAt || "string" === typeof input.createdAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "string & Format<\"date-time\">",
        value: input.createdAt
    })) || _report(_exceptionable, {
        path: _path + ".createdAt",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.createdAt
    }), "number" === typeof input.dailyGoal && (__typia_transform__isTypeInt32._isTypeInt32(input.dailyGoal) || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "number & Type<\"int32\">",
        value: input.dailyGoal
    })) && (0 <= input.dailyGoal || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "number & Minimum<0>",
        value: input.dailyGoal
    })) && (input.dailyGoal <= 500 || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "number & Maximum<500>",
        value: input.dailyGoal
    })) || _report(_exceptionable, {
        path: _path + ".dailyGoal",
        expected: "(number & Type<\"int32\"> & Minimum<0> & Maximum<500>)",
        value: input.dailyGoal
    }), "string" === typeof input.lastLoginAt && (__typia_transform__isFormatDateTime._isFormatDateTime(input.lastLoginAt) || _report(_exceptionable, {
        path: _path + ".lastLoginAt",
        expected: "string & Format<\"date-time\">",
        value: input.lastLoginAt
    })) || _report(_exceptionable, {
        path: _path + ".lastLoginAt",
        expected: "(string & Format<\"date-time\">)",
        value: input.lastLoginAt
    }), "string" === typeof input.passwordHash || _report(_exceptionable, {
        path: _path + ".passwordHash",
        expected: "string",
        value: input.passwordHash
    })].every((flag: boolean) => flag); const __is = (input: any): input is Omit<User, 'id'> => "object" === typeof input && null !== input && _io0(input); let errors: any; let _report: any; return (input: any): import("typia").IValidation<Omit<User, 'id'>> => {
    if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input || _report(true, {
            path: _path + "",
            expected: "Omit<User, \"id\">",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "Omit<User, \"id\">",
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
