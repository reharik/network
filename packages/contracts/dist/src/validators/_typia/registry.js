import * as __typia_transform__validateReport from "typia/lib/internal/_validateReport.js";
// Export validation functions using typia.validate for runtime validation
export const validateContact = (data) => (() => {
    const __is = (input) => true;
    let errors;
    let _report;
    return (input) => {
        if (false === __is(input)) {
            errors = [];
            _report = __typia_transform__validateReport._validateReport(errors);
            ((input, _path, _exceptionable = true) => true)(input, "$input", true);
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
    };
})()(data);
export const validateUpdateContact = (data) => (() => {
    const __is = (input) => true;
    let errors;
    let _report;
    return (input) => {
        if (false === __is(input)) {
            errors = [];
            _report = __typia_transform__validateReport._validateReport(errors);
            ((input, _path, _exceptionable = true) => true)(input, "$input", true);
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
    };
})()(data);
export const validateInsertContact = (data) => (() => {
    const _io0 = (input) => Object.keys(input).every((key) => {
        const value = input[key];
        if (undefined === value)
            return true;
        return true;
    });
    const _vo0 = (input, _path, _exceptionable = true) => [false === _exceptionable || Object.keys(input).map((key) => {
            const value = input[key];
            if (undefined === value)
                return true;
            return true;
        }).every((flag) => flag)].every((flag) => flag);
    const __is = (input) => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input);
    let errors;
    let _report;
    return (input) => {
        if (false === __is(input)) {
            errors = [];
            _report = __typia_transform__validateReport._validateReport(errors);
            ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
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
            };
        }
        return {
            success: true,
            data: input
        };
    };
})()(data);
export const validateTouch = (data) => (() => {
    const __is = (input) => true;
    let errors;
    let _report;
    return (input) => {
        if (false === __is(input)) {
            errors = [];
            _report = __typia_transform__validateReport._validateReport(errors);
            ((input, _path, _exceptionable = true) => true)(input, "$input", true);
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
    };
})()(data);
export const validateInsertTouch = (data) => (() => {
    const _io0 = (input) => Object.keys(input).every((key) => {
        const value = input[key];
        if (undefined === value)
            return true;
        return true;
    });
    const _vo0 = (input, _path, _exceptionable = true) => [false === _exceptionable || Object.keys(input).map((key) => {
            const value = input[key];
            if (undefined === value)
                return true;
            return true;
        }).every((flag) => flag)].every((flag) => flag);
    const __is = (input) => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input);
    let errors;
    let _report;
    return (input) => {
        if (false === __is(input)) {
            errors = [];
            _report = __typia_transform__validateReport._validateReport(errors);
            ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
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
            };
        }
        return {
            success: true,
            data: input
        };
    };
})()(data);
export const validateUser = (data) => (() => {
    const __is = (input) => true;
    let errors;
    let _report;
    return (input) => {
        if (false === __is(input)) {
            errors = [];
            _report = __typia_transform__validateReport._validateReport(errors);
            ((input, _path, _exceptionable = true) => true)(input, "$input", true);
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
    };
})()(data);
export const validateUpdateUser = (data) => (() => {
    const __is = (input) => true;
    let errors;
    let _report;
    return (input) => {
        if (false === __is(input)) {
            errors = [];
            _report = __typia_transform__validateReport._validateReport(errors);
            ((input, _path, _exceptionable = true) => true)(input, "$input", true);
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
    };
})()(data);
export const validateInsertUser = (data) => (() => {
    const _io0 = (input) => Object.keys(input).every((key) => {
        const value = input[key];
        if (undefined === value)
            return true;
        return true;
    });
    const _vo0 = (input, _path, _exceptionable = true) => [false === _exceptionable || Object.keys(input).map((key) => {
            const value = input[key];
            if (undefined === value)
                return true;
            return true;
        }).every((flag) => flag)].every((flag) => flag);
    const __is = (input) => "object" === typeof input && null !== input && false === Array.isArray(input) && _io0(input);
    let errors;
    let _report;
    return (input) => {
        if (false === __is(input)) {
            errors = [];
            _report = __typia_transform__validateReport._validateReport(errors);
            ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || _report(true, {
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
            };
        }
        return {
            success: true,
            data: input
        };
    };
})()(data);
export const validators = {
    contact: validateContact,
    insertContact: validateInsertContact,
    updateContact: validateUpdateContact,
    touch: validateTouch,
    insertTouch: validateInsertTouch,
    user: validateUser,
    insertUser: validateInsertUser,
    updateUser: validateUpdateUser,
};
export function validate(key, data) {
    return validators[key](data);
}
