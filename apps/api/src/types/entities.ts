import type { ContactMethod } from '@network/contracts';

// Internal Entity Types (plain types for smart-enums compatibility)
// These live only in the API and are not shared with frontend
export interface Contact {
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
}

export interface Touch {
  id: string;
  userId: string;
  contactId: string;
  method: ContactMethod;
  message?: string;
  outcome?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  dailyGoal: number;
  passwordHash: string;
  lastLoginAt: string;
}
