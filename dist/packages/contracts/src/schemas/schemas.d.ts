import { z } from 'zod';
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
export declare const contactSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    preferredMethod: z.ZodEffects<z.ZodString, string, string>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    intervalDays: z.ZodNumber;
    paused: z.ZodOptional<z.ZodBoolean>;
    snoozedUntil: z.ZodOptional<z.ZodString>;
    nextDueAt: z.ZodOptional<z.ZodString>;
    lastTouchedAt: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    preferredMethod: string;
    intervalDays: number;
    email?: string | undefined;
    phone?: string | undefined;
    notes?: string | undefined;
    paused?: boolean | undefined;
    snoozedUntil?: string | undefined;
    nextDueAt?: string | undefined;
    lastTouchedAt?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}, {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    preferredMethod: string;
    intervalDays: number;
    email?: string | undefined;
    phone?: string | undefined;
    notes?: string | undefined;
    paused?: boolean | undefined;
    snoozedUntil?: string | undefined;
    nextDueAt?: string | undefined;
    lastTouchedAt?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}>;
export declare const touchSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    contactId: z.ZodString;
    method: z.ZodEffects<z.ZodString, string, string>;
    message: z.ZodOptional<z.ZodString>;
    outcome: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    contactId: string;
    method: string;
    createdAt?: string | undefined;
    message?: string | undefined;
    outcome?: string | undefined;
}, {
    id: string;
    userId: string;
    contactId: string;
    method: string;
    createdAt?: string | undefined;
    message?: string | undefined;
    outcome?: string | undefined;
}>;
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    dailyGoal: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    email: string;
    id: string;
    dailyGoal: number;
}, {
    email: string;
    id: string;
    dailyGoal: number;
}>;
export declare const upsertContactSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    preferredMethod: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    paused: z.ZodOptional<z.ZodBoolean>;
    snoozedUntil: z.ZodOptional<z.ZodString>;
    intervalDays: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    id?: string | undefined;
    userId?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    preferredMethod?: string | undefined;
    phone?: string | undefined;
    notes?: string | undefined;
    intervalDays?: number | undefined;
    paused?: boolean | undefined;
    snoozedUntil?: string | undefined;
}, {
    email?: string | undefined;
    id?: string | undefined;
    userId?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    preferredMethod?: string | undefined;
    phone?: string | undefined;
    notes?: string | undefined;
    intervalDays?: number | undefined;
    paused?: boolean | undefined;
    snoozedUntil?: string | undefined;
}>, {
    email?: string | undefined;
    id?: string | undefined;
    userId?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    preferredMethod?: string | undefined;
    phone?: string | undefined;
    notes?: string | undefined;
    intervalDays?: number | undefined;
    paused?: boolean | undefined;
    snoozedUntil?: string | undefined;
}, {
    email?: string | undefined;
    id?: string | undefined;
    userId?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    preferredMethod?: string | undefined;
    phone?: string | undefined;
    notes?: string | undefined;
    intervalDays?: number | undefined;
    paused?: boolean | undefined;
    snoozedUntil?: string | undefined;
}>;
export declare const dailyPlanSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        preferredMethod: z.ZodEffects<z.ZodString, string, string>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        intervalDays: z.ZodNumber;
        paused: z.ZodOptional<z.ZodBoolean>;
        snoozedUntil: z.ZodOptional<z.ZodString>;
        nextDueAt: z.ZodOptional<z.ZodString>;
        lastTouchedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        preferredMethod: string;
        intervalDays: number;
        email?: string | undefined;
        phone?: string | undefined;
        notes?: string | undefined;
        paused?: boolean | undefined;
        snoozedUntil?: string | undefined;
        nextDueAt?: string | undefined;
        lastTouchedAt?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }, {
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        preferredMethod: string;
        intervalDays: number;
        email?: string | undefined;
        phone?: string | undefined;
        notes?: string | undefined;
        paused?: boolean | undefined;
        snoozedUntil?: string | undefined;
        nextDueAt?: string | undefined;
        lastTouchedAt?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }>, "many">;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    items: {
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        preferredMethod: string;
        intervalDays: number;
        email?: string | undefined;
        phone?: string | undefined;
        notes?: string | undefined;
        paused?: boolean | undefined;
        snoozedUntil?: string | undefined;
        nextDueAt?: string | undefined;
        lastTouchedAt?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }[];
}, {
    date: string;
    items: {
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        preferredMethod: string;
        intervalDays: number;
        email?: string | undefined;
        phone?: string | undefined;
        notes?: string | undefined;
        paused?: boolean | undefined;
        snoozedUntil?: string | undefined;
        nextDueAt?: string | undefined;
        lastTouchedAt?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }[];
}>;
export declare const uuidParam: z.ZodString;
export declare const listContactsQuerySchema: z.ZodObject<{
    dueOnly: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"true">, z.ZodLiteral<"false">]>>, boolean, "true" | "false" | undefined>;
    q: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    dueOnly: boolean;
    q?: string | undefined;
}, {
    dueOnly?: "true" | "false" | undefined;
    q?: string | undefined;
}>;
export declare const createTouchSchema: z.ZodObject<{
    contactId: z.ZodString;
    method: z.ZodEnum<["EMAIL", "SMS", "CALL", "OTHER"]>;
    message: z.ZodOptional<z.ZodString>;
    outcome: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    contactId: string;
    method: "EMAIL" | "SMS" | "CALL" | "OTHER";
    message?: string | undefined;
    outcome?: string | undefined;
}, {
    contactId: string;
    method: "EMAIL" | "SMS" | "CALL" | "OTHER";
    message?: string | undefined;
    outcome?: string | undefined;
}>;
export declare const planQuerySchema: z.ZodObject<{
    date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date?: string | undefined;
}, {
    date?: string | undefined;
}>;
export declare const upsertDailyGoalSchema: z.ZodObject<{
    dailyGoal: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    dailyGoal: number;
}, {
    dailyGoal: number;
}>;
//# sourceMappingURL=schemas.d.ts.map