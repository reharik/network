"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyPlanSchema = exports.patchContactBodySchema = exports.createContactBodySchema = exports.contactSchema = void 0;
var zod_1 = require("zod");
var ContactMethod_1 = require("../enums/ContactMethod");
// Utility parser → normalized to enum .value
var contactMethodValueSchema = zod_1.z.string().transform(function (s, ctx) {
    var item = (0, ContactMethod_1.parseContactMethod)(s);
    if (!item) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Invalid contact method: ".concat(s),
        });
        return zod_1.z.NEVER;
    }
    return item.value; // "EMAIL" | "SMS" | "CALL" | "OTHER"
});
/** Runtime validation schemas; keep them aligned with the TS types above. */
exports.contactSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    firstName: zod_1.z.string().min(1).max(200),
    lastName: zod_1.z.string().min(1).max(200),
    preferredMethod: contactMethodValueSchema,
    email: zod_1.z.string().email().nullable().optional(),
    phone: zod_1.z.string().trim().nullable().optional(),
    notes: zod_1.z.string().trim().nullable().optional(),
    intervalDays: zod_1.z.number().int().min(1).max(365),
    paused: zod_1.z.boolean().optional(),
    snoozedUntil: zod_1.z.string().datetime().nullable().optional(),
    nextDueAt: zod_1.z.string().datetime().optional(),
    lastTouchedAt: zod_1.z.string().datetime().nullable().optional(),
    createdAt: zod_1.z.string().datetime().optional(),
    updatedAt: zod_1.z.string().datetime().optional(),
});
exports.createContactBodySchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(200),
    lastName: zod_1.z.string().min(1).max(200),
    preferredMethod: contactMethodValueSchema.optional(),
    email: zod_1.z.string().email().nullable().optional(),
    phone: zod_1.z.string().trim().nullable().optional(),
    notes: zod_1.z.string().trim().nullable().optional(),
    intervalDays: zod_1.z.coerce.number().int().min(1).max(365).optional(),
});
exports.patchContactBodySchema = zod_1.z
    .object({
    firstName: zod_1.z.string().min(1).max(200).optional(),
    lastName: zod_1.z.string().min(1).max(200).optional(),
    preferredMethod: contactMethodValueSchema.optional(),
    email: zod_1.z.string().email().nullable().optional(),
    phone: zod_1.z.string().trim().nullable().optional(),
    notes: zod_1.z.string().trim().nullable().optional(),
    paused: zod_1.z.boolean().optional(),
    snoozedUntil: zod_1.z.string().datetime().nullable().optional(),
    intervalDays: zod_1.z.coerce.number().int().min(1).max(365).optional(),
})
    .refine(function (v) { return Object.keys(v).length > 0; }, {
    message: 'At least one field must be provided',
});
exports.dailyPlanSchema = zod_1.z.object({
    items: zod_1.z.array(exports.contactSchema),
    date: zod_1.z.string().datetime(),
});
