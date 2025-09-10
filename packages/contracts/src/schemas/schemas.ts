import { z } from 'zod';
import { ContactMethod } from '../enums/ContactMethod';

// Utility parser → normalized to enum .value
const contactMethodValueSchema = z.string().transform((s, ctx) => {
  const item = ContactMethod.tryFromValue(s);
  if (!item) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid contact method: ${s}`,
    });
    return z.NEVER;
  }
  return item.value; // "EMAIL" | "SMS" | "CALL" | "OTHER"
});

// Explicit TypeScript types for schemas
export type ContactSchema = z.infer<typeof contactSchema>;
export type TouchSchema = z.infer<typeof touchSchema>;
export type UserSchema = z.infer<typeof userSchema>;
export type DailyPlanSchema = z.infer<typeof dailyPlanSchema>;
export type CreateTouchSchema = z.infer<typeof createTouchSchema>;
export type UpsertContactSchema = z.infer<typeof upsertContactSchema>;
export type UpsertDailyGoalSchema = z.infer<typeof upsertDailyGoalSchema>;
export type ListContactsQuerySchema = z.infer<typeof listContactsQuerySchema>;
export type PlanQuerySchema = z.infer<typeof planQuerySchema>;

/** Runtime validation schemas; keep them aligned with the TS types above. */
export const contactSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  preferredMethod: contactMethodValueSchema,
  email: z.string().email().optional(),
  phone: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  intervalDays: z.number().int().min(1).max(365),
  paused: z.boolean().optional(),
  snoozedUntil: z.string().datetime().optional(),
  nextDueAt: z.string().datetime().optional(),
  lastTouchedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const touchSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  contactId: z.string().uuid(),
  method: contactMethodValueSchema,
  message: z.string().trim().optional(),
  outcome: z.string().trim().optional(),
  createdAt: z.string().datetime().optional(),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  dailyGoal: z.number().int().min(0).max(500),
});

export const upsertContactSchema = z
  .object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    firstName: z.string().min(1).max(200).optional(),
    lastName: z.string().min(1).max(200).optional(),
    preferredMethod: contactMethodValueSchema.optional(),
    email: z.string().email().optional(),
    phone: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    paused: z.boolean().optional(),
    snoozedUntil: z.string().datetime().optional(),
    intervalDays: z.coerce.number().int().min(1).max(365).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: 'At least one field must be provided',
  });

export const dailyPlanSchema = z.object({
  items: z.array(contactSchema),
  date: z.string().datetime(),
});

export const uuidParam = z.string().uuid();

// Contacts
export const listContactsQuerySchema = z.object({
  dueOnly: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => v === 'true'),
  q: z.string().trim().min(1).optional(),
});

// Touches
export const createTouchSchema = z.object({
  contactId: uuidParam,
  method: z.enum(['EMAIL', 'SMS', 'CALL', 'OTHER']),
  message: z.string().trim().optional(),
  outcome: z.string().trim().optional(),
});

// Plan
export const planQuerySchema = z.object({
  date: z.string().datetime().optional(),
});

// Users
export const upsertDailyGoalSchema = z.object({
  dailyGoal: z.coerce.number().int().min(0).max(500),
});
