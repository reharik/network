import { z } from 'zod';
import { parseContactMethod } from '../enums/ContactMethod';
// Utility parser → normalized to enum .value
const contactMethodValueSchema = z.string().transform((s, ctx) => {
    const item = parseContactMethod(s);
    if (!item) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid contact method: ${s}`,
        });
        return z.NEVER;
    }
    return item.value; // "EMAIL" | "SMS" | "CALL" | "OTHER"
});
/** Runtime validation schemas; keep them aligned with the TS types above. */
export const contactSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    firstName: z.string().min(1).max(200),
    lastName: z.string().min(1).max(200),
    preferredMethod: contactMethodValueSchema,
    email: z.string().email().nullable().optional(),
    phone: z.string().trim().nullable().optional(),
    notes: z.string().trim().nullable().optional(),
    intervalDays: z.number().int().min(1).max(365),
    paused: z.boolean().optional(),
    snoozedUntil: z.string().datetime().nullable().optional(),
    nextDueAt: z.string().datetime().optional(),
    lastTouchedAt: z.string().datetime().nullable().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});
export const createContactBodySchema = z.object({
    firstName: z.string().min(1).max(200),
    lastName: z.string().min(1).max(200),
    preferredMethod: contactMethodValueSchema.optional(),
    email: z.string().email().nullable().optional(),
    phone: z.string().trim().nullable().optional(),
    notes: z.string().trim().nullable().optional(),
    intervalDays: z.coerce.number().int().min(1).max(365).optional(),
});
export const patchContactBodySchema = z
    .object({
    firstName: z.string().min(1).max(200).optional(),
    lastName: z.string().min(1).max(200).optional(),
    preferredMethod: contactMethodValueSchema.optional(),
    email: z.string().email().nullable().optional(),
    phone: z.string().trim().nullable().optional(),
    notes: z.string().trim().nullable().optional(),
    paused: z.boolean().optional(),
    snoozedUntil: z.string().datetime().nullable().optional(),
    intervalDays: z.coerce.number().int().min(1).max(365).optional(),
})
    .refine((v) => Object.keys(v).length > 0, {
    message: 'At least one field must be provided',
});
export const dailyPlanSchema = z.object({
    items: z.array(contactSchema),
    date: z.string().datetime(),
});
