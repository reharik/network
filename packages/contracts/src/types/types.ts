import type { ContactMethod } from '../enums/ContactMethod';

export type ReplaceProp<
  T,
  K extends PropertyKey,
  V,
  Opt extends boolean = true,
> = Omit<T, Extract<K, keyof T>> &
  (Opt extends true ? { [P in K]?: V } : { [P in K]-?: V });

export type SetRequired<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};

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
  nextDueAt?: string; // ISO
  lastTouchedAt?: string | null; // ISO
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
};

export type DailyPlan = {
  items: Contact[];
  date: string; // ISO
};

export type User = {
  id: string;
  email: string;
  dailyGoal: number;
};

export type Touch = {
  id: string;
  userId: string;
  contactId: string;
  method: ContactMethod;
  message?: string;
  outcome?: string;
  createdAt?: string; // ISO
};
