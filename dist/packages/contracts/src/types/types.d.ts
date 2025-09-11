import type { ContactMethod } from '../enums/ContactMethod';
export type ReplaceProp<T, K extends PropertyKey, V, Opt extends boolean = true> = Omit<T, Extract<K, keyof T>> & (Opt extends true ? {
    [P in K]?: V;
} : {
    [P in K]-?: V;
});
export type SetRequired<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: NonNullable<T[P]>;
};
export type Contact = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    preferredMethod: ContactMethod;
    suggestion: string;
    email?: string;
    phone?: string;
    notes?: string;
    intervalDays: number;
    paused?: boolean;
    snoozedUntil?: string;
    nextDueAt?: string;
    lastTouchedAt?: string;
    createdAt?: string;
    updatedAt?: string;
};
export type Touch = {
    id: string;
    userId: string;
    contactId: string;
    method: ContactMethod;
    message?: string;
    outcome?: string;
    createdAt?: string;
};
export type User = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    dailyGoal: number;
    passwordHash: string;
    lastLoginAt: string;
};
export type ContactDTO = ReplaceProp<Contact, 'preferredMethod', string, false>;
export type TouchDTO = ReplaceProp<Touch, 'method', string, false>;
export type UserDTO = User;
export type PlanDTO = {
    items: ContactDTO[];
    date: string;
};
export type DailyPlanDTO = {
    items: ContactDTO[];
    date: string;
};
export type ContactDTOPartial = ReplaceProp<Partial<Contact>, 'preferredMethod', string>;
export type TouchDTOPartial = ReplaceProp<Partial<Touch>, 'method', string>;
export type UserDTOPartial = Partial<User>;
export type ContactListDTO = ContactDTO[];
export type TouchListDTO = TouchDTO[];
//# sourceMappingURL=types.d.ts.map