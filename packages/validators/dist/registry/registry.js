import * as __typia_transform__isFormatUuid from "typia/lib/internal/_isFormatUuid.js";
import * as __typia_transform__isFormatEmail from "typia/lib/internal/_isFormatEmail.js";
import * as __typia_transform__isTypeInt32 from "typia/lib/internal/_isTypeInt32.js";
import * as __typia_transform__isFormatDateTime from "typia/lib/internal/_isFormatDateTime.js";
import * as __typia_transform__validateReport from "typia/lib/internal/_validateReport.js";
import typia from 'typia';
// Export validation functions using typia.validate for runtime validation
export const validateUpsertContact = (data) => (() => { const _io0 = input => (undefined === input.id || "string" === typeof input.id && __typia_transform__isFormatUuid._isFormatUuid(input.id)) && (undefined === input.userId || "string" === typeof input.userId && __typia_transform__isFormatUuid._isFormatUuid(input.userId)) && (undefined === input.firstName || "string" === typeof input.firstName && (1 <= input.firstName.length && input.firstName.length <= 200)) && (undefined === input.lastName || "string" === typeof input.lastName && (1 <= input.lastName.length && input.lastName.length <= 200)) && (undefined === input.preferredMethod || "object" === typeof input.preferredMethod && null !== input.preferredMethod && _io1(input.preferredMethod)) && (undefined === input.email || "string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email)) && (undefined === input.phone || "string" === typeof input.phone) && (undefined === input.notes || "string" === typeof input.notes) && (undefined === input.suggestion || "string" === typeof input.suggestion) && (undefined === input.intervalDays || "number" === typeof input.intervalDays && (__typia_transform__isTypeInt32._isTypeInt32(input.intervalDays) && 1 <= input.intervalDays && input.intervalDays <= 365)) && (undefined === input.paused || "boolean" === typeof input.paused) && (undefined === input.snoozedUntil || "string" === typeof input.snoozedUntil && __typia_transform__isFormatDateTime._isFormatDateTime(input.snoozedUntil)) && (undefined === input.nextDueAt || "string" === typeof input.nextDueAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.nextDueAt)) && (undefined === input.lastTouchedAt || "string" === typeof input.lastTouchedAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.lastTouchedAt)) && (undefined === input.createdAt || "string" === typeof input.createdAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.createdAt)) && (undefined === input.updatedAt || "string" === typeof input.updatedAt && __typia_transform__isFormatDateTime._isFormatDateTime(input.updatedAt)); const _io1 = input => "string" === typeof input.key && "string" === typeof input.value && (undefined === input.display || "string" === typeof input.display) && (undefined === input.index || "number" === typeof input.index) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true === input.__smart_enum_brand && true && true; const _vo0 = (input, _path, _exceptionable = true) => [undefined === input.id || "string" === typeof input.id && (__typia_transform__isFormatUuid._isFormatUuid(input.id) || _report(_exceptionable, {
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
    }), undefined === input.preferredMethod || ("object" === typeof input.preferredMethod && null !== input.preferredMethod || _report(_exceptionable, {
        path: _path + ".preferredMethod",
        expected: "(EnumItem<__type, ContactMethodItem> | undefined)",
        value: input.preferredMethod
    })) && _vo1(input.preferredMethod, _path + ".preferredMethod", true && _exceptionable) || _report(_exceptionable, {
        path: _path + ".preferredMethod",
        expected: "(EnumItem<__type, ContactMethodItem> | undefined)",
        value: input.preferredMethod
    }), undefined === input.email || "string" === typeof input.email && (__typia_transform__isFormatEmail._isFormatEmail(input.email) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "string & Format<\"email\">",
        value: input.email
    })) || _report(_exceptionable, {
        path: _path + ".email",
        expected: "((string & Format<\"email\">) | undefined)",
        value: input.email
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
    }), undefined === input.paused || "boolean" === typeof input.paused || _report(_exceptionable, {
        path: _path + ".paused",
        expected: "(boolean | undefined)",
        value: input.paused
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
    })].every(flag => flag); const _vo1 = (input, _path, _exceptionable = true) => ["string" === typeof input.key || _report(_exceptionable, {
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
    }), true || _report(_exceptionable, {
        path: _path + ".link",
        expected: "unknown",
        value: input.link
    }), true || _report(_exceptionable, {
        path: _path + ".handle",
        expected: "unknown",
        value: input.handle
    })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input); let errors; let _report; return input => {
    if (false === __is(input)) {
        errors = [];
        _report = __typia_transform__validateReport._validateReport(errors);
        ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
            path: _path + "",
            expected: "UpsertContactDTO",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "UpsertContactDTO",
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
        };
    }
    return {
        success: true,
        data: input
    };
}; })()(data);
export const validateListContactsQuery = (data) => (() => { const _io0 = input => (undefined === input.dueOnly || "boolean" === typeof input.dueOnly) && (undefined === input.q || "string" === typeof input.q && 1 <= input.q.length); const _vo0 = (input, _path, _exceptionable = true) => [undefined === input.dueOnly || "boolean" === typeof input.dueOnly || _report(_exceptionable, {
        path: _path + ".dueOnly",
        expected: "(boolean | undefined)",
        value: input.dueOnly
    }), undefined === input.q || "string" === typeof input.q && (1 <= input.q.length || _report(_exceptionable, {
        path: _path + ".q",
        expected: "string & MinLength<1>",
        value: input.q
    })) || _report(_exceptionable, {
        path: _path + ".q",
        expected: "((string & MinLength<1>) | undefined)",
        value: input.q
    })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input); let errors; let _report; return input => {
    if (false === __is(input)) {
        errors = [];
        _report = __typia_transform__validateReport._validateReport(errors);
        ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
            path: _path + "",
            expected: "ListContactsQueryDTO",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "ListContactsQueryDTO",
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
        };
    }
    return {
        success: true,
        data: input
    };
}; })()(data);
export const validateCreateTouch = (data) => (() => { const _io0 = input => "string" === typeof input.contactId && __typia_transform__isFormatUuid._isFormatUuid(input.contactId) && ("object" === typeof input.method && null !== input.method && _io1(input.method)) && (undefined === input.message || "string" === typeof input.message) && (undefined === input.outcome || "string" === typeof input.outcome); const _io1 = input => "string" === typeof input.key && "string" === typeof input.value && (undefined === input.display || "string" === typeof input.display) && (undefined === input.index || "number" === typeof input.index) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true === input.__smart_enum_brand && true && true; const _vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.contactId && (__typia_transform__isFormatUuid._isFormatUuid(input.contactId) || _report(_exceptionable, {
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
    })].every(flag => flag); const _vo1 = (input, _path, _exceptionable = true) => ["string" === typeof input.key || _report(_exceptionable, {
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
    }), true || _report(_exceptionable, {
        path: _path + ".link",
        expected: "unknown",
        value: input.link
    }), true || _report(_exceptionable, {
        path: _path + ".handle",
        expected: "unknown",
        value: input.handle
    })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
    if (false === __is(input)) {
        errors = [];
        _report = __typia_transform__validateReport._validateReport(errors);
        ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
            path: _path + "",
            expected: "CreateTouchDTO",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "CreateTouchDTO",
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
        };
    }
    return {
        success: true,
        data: input
    };
}; })()(data);
export const validatePlanQuery = (data) => (() => { const _io0 = input => undefined === input.date || "string" === typeof input.date && __typia_transform__isFormatDateTime._isFormatDateTime(input.date); const _vo0 = (input, _path, _exceptionable = true) => [undefined === input.date || "string" === typeof input.date && (__typia_transform__isFormatDateTime._isFormatDateTime(input.date) || _report(_exceptionable, {
        path: _path + ".date",
        expected: "string & Format<\"date-time\">",
        value: input.date
    })) || _report(_exceptionable, {
        path: _path + ".date",
        expected: "((string & Format<\"date-time\">) | undefined)",
        value: input.date
    })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input); let errors; let _report; return input => {
    if (false === __is(input)) {
        errors = [];
        _report = __typia_transform__validateReport._validateReport(errors);
        ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
            path: _path + "",
            expected: "PlanQueryDTO",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "PlanQueryDTO",
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
        };
    }
    return {
        success: true,
        data: input
    };
}; })()(data);
export const validateUpsertDailyGoal = (data) => (() => { const _io0 = input => "number" === typeof input.dailyGoal && (__typia_transform__isTypeInt32._isTypeInt32(input.dailyGoal) && 0 <= input.dailyGoal && input.dailyGoal <= 500); const _vo0 = (input, _path, _exceptionable = true) => ["number" === typeof input.dailyGoal && (__typia_transform__isTypeInt32._isTypeInt32(input.dailyGoal) || _report(_exceptionable, {
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
    })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
    if (false === __is(input)) {
        errors = [];
        _report = __typia_transform__validateReport._validateReport(errors);
        ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
            path: _path + "",
            expected: "UpsertDailyGoalDTO",
            value: input
        })) && _vo0(input, _path + "", true) || _report(true, {
            path: _path + "",
            expected: "UpsertDailyGoalDTO",
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
        };
    }
    return {
        success: true,
        data: input
    };
}; })()(data);
export const validators = {
    upsertContact: validateUpsertContact,
    listContactsQuery: validateListContactsQuery,
    createTouch: validateCreateTouch,
    planQuery: validatePlanQuery,
    upsertDailyGoal: validateUpsertDailyGoal,
};
export function validate(key, data) {
    return validators[key](data);
}
