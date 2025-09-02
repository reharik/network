import { z } from 'zod';

export const uuidParam = z.string().uuid();

// Contacts
export const listContactsQuerySchema = z.object({
  dueOnly: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => v === 'true'),
  q: z.string().trim().min(1).optional(),
});

export const createContactBodySchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  preferredMethod: z.enum(['EMAIL', 'SMS', 'CALL', 'OTHER']).optional(),
  email: z.string().email().nullable().optional(),
  phoneE164: z.string().trim().min(1).nullable().optional(),
  notes: z.string().trim().nullable().optional(),
  intervalDays: z.coerce.number().int().min(1).max(365).optional(),
});

export const patchContactBodySchema = z
  .object({
    fullName: z.string().trim().min(1).max(200).optional(),
    preferredMethod: z.enum(['EMAIL', 'SMS', 'CALL', 'OTHER']).optional(),
    email: z.string().email().nullable().optional(),
    phoneE164: z.string().trim().min(1).nullable().optional(),
    notes: z.string().trim().nullable().optional(),
    paused: z.boolean().optional(),
    snoozedUntil: z.string().datetime().nullable().optional(),
    intervalDays: z.coerce.number().int().min(1).max(365).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: 'At least one field must be provided',
  });

// Touches
export const createTouchBodySchema = z.object({
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
export const updateDailyGoalBodySchema = z.object({
  dailyGoal: z.coerce.number().int().min(0).max(500),
});
