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

// Internal Entity Types (with smart-enums)
export type Contact = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  preferredMethod: ContactMethod;
  email?: string;
  phone?: string;
  notes?: string;
  intervalDays: number;
  paused?: boolean;
  snoozedUntil?: string;
  nextDueAt?: string; // ISO
  lastTouchedAt?: string; // ISO
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
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

export type User = {
  id: string;
  email: string;
  dailyGoal: number;
};

// API Response DTOs (with required string values for enum fields)
export type ContactDTO = ReplaceProp<Contact, 'preferredMethod', string, false>;
export type TouchDTO = ReplaceProp<Touch, 'method', string, false>;
export type UserDTO = User; // No smart-enums, so same as entity

export type DailyPlanDTO = {
  items: ContactDTO[];
  date: string; // ISO
};

// API Request DTOs (partial versions for updates)
export type ContactDTOPartial = ReplaceProp<
  Partial<Contact>,
  'preferredMethod',
  string
>;
export type TouchDTOPartial = ReplaceProp<Partial<Touch>, 'method', string>;
export type UserDTOPartial = Partial<User>;

// List Response DTOs
export type ContactListDTO = ContactDTO[];
export type TouchListDTO = TouchDTO[];
