"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseContactMethod = exports.ContactMethod = void 0;
var smart_enums_1 = require("smart-enums");
var input = ['email', 'sms', 'call', 'other'];
exports.ContactMethod = (0, smart_enums_1.enumeration)({
    input: input,
});
var parseContactMethod = function (s) {
    var _a, _b;
    return (_b = (_a = exports.ContactMethod.tryFromValue(s)) !== null && _a !== void 0 ? _a : exports.ContactMethod.tryFromKey(s)) !== null && _b !== void 0 ? _b : exports.ContactMethod.tryFromDisplay(s);
};
exports.parseContactMethod = parseContactMethod;
