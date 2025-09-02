import type { ContactMethod } from '../enums/ContactMethod';
export type Contact = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    preferredMethod: ContactMethod;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    intervalDays: number;
    paused?: boolean;
    snoozedUntil?: string | null;
    nextDueAt?: string;
    lastTouchedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};
export type CreateContactBody = {
    firstName: string;
    lastName: string;
    preferredMethod?: ContactMethod;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    intervalDays?: number;
};
export type PatchContactBody = Partial<Omit<CreateContactBody, 'intervalDays'>> & {
    paused?: boolean;
    snoozedUntil?: string | null;
    intervalDays?: number;
};
export type DailyPlan = {
    items: Contact[];
    date: string;
};
