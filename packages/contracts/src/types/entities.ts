import { tags } from 'typia';
import { ContactMethod } from '../enumerations/enums/ContactMethod';

// Plain Entity Types (for database operations without typia conflicts)
export interface PlainContact {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  preferredMethod: ContactMethod;
  email?: string;
  phone?: string;
  notes?: string;
  suggestion: string;
  intervalDays: number;
  paused?: boolean;
  snoozedUntil?: string;
  nextDueAt?: string;
  lastTouchedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlainTouch {
  id: string;
  userId: string;
  contactId: string;
  method: ContactMethod;
  message?: string;
  outcome?: string;
  fromContactNow?: boolean;
  createdAt?: string;
}

export interface PlainUser {
  id: string;
  firstName: string | undefined;
  lastName: string | undefined;
  passwordHash: string;
  email: string;
  phone?: string;
  dailyGoal: number;
  defaultContactMessage?: string;
  defaultIntervalDays?: number;
  defaultPreferredMethod?: string;
  createdAt?: string;
  lastLoginAt: string;
}

// Typia-enhanced Entity Types (for validation and API contracts)
export interface Contact extends PlainContact {
  id: string & tags.Format<'uuid'>;
  userId: string & tags.Format<'uuid'>;
  firstName: string & tags.MinLength<1> & tags.MaxLength<200>;
  lastName: string & tags.MinLength<1> & tags.MaxLength<200>;
  email?: string & tags.Format<'email'>;
  intervalDays: number & tags.Type<'int32'> & tags.Minimum<1> & tags.Maximum<365>;
  snoozedUntil?: string & tags.Format<'date-time'>;
  nextDueAt?: string & tags.Format<'date-time'>;
  lastTouchedAt?: string & tags.Format<'date-time'>;
  createdAt?: string & tags.Format<'date-time'>;
  updatedAt?: string & tags.Format<'date-time'>;
}

// Contact with daily plan status - includes whether contact was touched today
export interface DailyContact extends Contact {
  touchedToday: boolean;
}

export interface Touch extends PlainTouch {
  id: string & tags.Format<'uuid'>;
  userId: string & tags.Format<'uuid'>;
  contactId: string & tags.Format<'uuid'>;
  fromContactNow?: boolean;
  createdAt?: string & tags.Format<'date-time'>;
}

export interface User extends PlainUser {
  email: string & tags.Format<'email'>;
  dailyGoal: number & tags.Type<'int32'> & tags.Minimum<0> & tags.Maximum<500>;
  defaultContactMessage?: string;
  defaultIntervalDays?: number;
  defaultPreferredMethod?: string;
  createdAt?: string & tags.Format<'date-time'>;
  lastLoginAt: string & tags.Format<'date-time'>;
}

// Update types for API operations
export type UpdateContact = Partial<Contact>;
export type UpdateTouch = Partial<Touch>;
export type UpdateUser = Partial<User>;

// Client-side input types (userId is added by server from JWT)
export interface CreateTouchInput {
  contactId: string & tags.Format<'uuid'>;
  method: ContactMethod;
  message?: string;
  outcome?: string;
  /** If true, this touch does not consume the daily goal (e.g. from "Contact Now") */
  fromContactNow?: boolean;
}

export interface ImportContactsDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  tags?: string;
  suggestion?: string;
}

// Signup credentials (client-side input for account creation)
export interface SignupCredentials {
  email: string & tags.Format<'email'>;
  password: string & tags.MinLength<8>;
  firstName?: string & tags.MaxLength<100>;
  lastName?: string & tags.MaxLength<100>;
}
