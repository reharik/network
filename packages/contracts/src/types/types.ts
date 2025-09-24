import typia from 'typia';
import type { ContactMethod } from '../enums/ContactMethod';

// Import typia tags for cleaner syntax
import type { tags } from 'typia';

export type ReplaceProp<T, K extends PropertyKey, V, Opt extends boolean = true> = Omit<
  T,
  Extract<K, keyof T>
> &
  (Opt extends true ? { [P in K]?: V } : { [P in K]: V });

// API Response DTOs (with validation and smart enums)
export interface ContactDTO {
  id: string & tags.Format<'uuid'>;
  userId: string & tags.Format<'uuid'>;
  firstName: string & tags.MinLength<1> & tags.MaxLength<200>;
  lastName: string & tags.MinLength<1> & tags.MaxLength<200>;
  preferredMethod: ContactMethod;
  email?: string & tags.Format<'email'>;
  phone?: string;
  notes?: string;
  suggestion: string;
  intervalDays: number & tags.Type<'int32'> & tags.Minimum<1> & tags.Maximum<365>;
  paused: boolean;
  snoozedUntil?: string & tags.Format<'date-time'>;
  nextDueAt?: string & tags.Format<'date-time'>;
  lastTouchedAt?: string & tags.Format<'date-time'>;
  createdAt?: string & tags.Format<'date-time'>;
  updatedAt?: string & tags.Format<'date-time'>;
}

export interface TouchDTO {
  id: string & tags.Format<'uuid'>;
  userId: string & tags.Format<'uuid'>;
  contactId: string & tags.Format<'uuid'>;
  method: ContactMethod;
  message?: string;
  outcome?: string;
  createdAt?: string & tags.Format<'date-time'>;
}

export interface UserDTO {
  id: string & tags.Format<'uuid'>;
  email: string & tags.Format<'email'>;
  dailyGoal: number & tags.Type<'int32'> & tags.Minimum<0> & tags.Maximum<500>;
  createdAt?: string & tags.Format<'date-time'>;
  lastLoginAt: string & tags.Format<'date-time'>;
}

// API Request DTOs (partial versions for updates)
export interface ContactDTOPartial {
  id?: string & tags.Format<'uuid'>;
  userId?: string & tags.Format<'uuid'>;
  firstName?: string & tags.MinLength<1> & tags.MaxLength<200>;
  lastName?: string & tags.MinLength<1> & tags.MaxLength<200>;
  preferredMethod?: ContactMethod;
  email?: string & tags.Format<'email'>;
  phone?: string;
  notes?: string;
  suggestion?: string;
  intervalDays?: number & tags.Type<'int32'> & tags.Minimum<1> & tags.Maximum<365>;
  paused?: boolean;
  snoozedUntil?: string & tags.Format<'date-time'>;
  nextDueAt?: string & tags.Format<'date-time'>;
  lastTouchedAt?: string & tags.Format<'date-time'>;
  createdAt?: string & tags.Format<'date-time'>;
  updatedAt?: string & tags.Format<'date-time'>;
}

export interface TouchDTOPartial {
  id?: string & tags.Format<'uuid'>;
  userId?: string & tags.Format<'uuid'>;
  contactId?: string & tags.Format<'uuid'>;
  method?: ContactMethod;
  message?: string;
  outcome?: string;
  createdAt?: string & tags.Format<'date-time'>;
}

export interface UserDTOPartial {
  id?: string & tags.Format<'uuid'>;
  email?: string & tags.Format<'email'>;
  dailyGoal?: number & tags.Type<'int32'> & tags.Minimum<0> & tags.Maximum<500>;
  createdAt?: string & tags.Format<'date-time'>;
  lastLoginAt?: string & tags.Format<'date-time'>;
}

// Additional DTO types for API requests
export interface UpsertContactDTO {
  id?: string & tags.Format<'uuid'>;
  userId?: string & tags.Format<'uuid'>;
  firstName?: string & tags.MinLength<1> & tags.MaxLength<200>;
  lastName?: string & tags.MinLength<1> & tags.MaxLength<200>;
  preferredMethod?: ContactMethod;
  email?: string & tags.Format<'email'>;
  phone?: string;
  notes?: string;
  suggestion?: string;
  intervalDays?: number & tags.Type<'int32'> & tags.Minimum<1> & tags.Maximum<365>;
  paused?: boolean;
  snoozedUntil?: string & tags.Format<'date-time'>;
  nextDueAt?: string & tags.Format<'date-time'>;
  lastTouchedAt?: string & tags.Format<'date-time'>;
  createdAt?: string & tags.Format<'date-time'>;
  updatedAt?: string & tags.Format<'date-time'>;
}

export interface CreateTouchDTO {
  contactId: string & tags.Format<'uuid'>;
  method: ContactMethod;
  message?: string;
  outcome?: string;
}

export interface ListContactsQueryDTO {
  dueOnly?: boolean;
  q?: string & tags.MinLength<1>;
}

export interface PlanQueryDTO {
  date?: string & tags.Format<'date-time'>;
}

export interface UpsertDailyGoalDTO {
  dailyGoal: number & tags.Type<'int32'> & tags.Minimum<0> & tags.Maximum<500>;
}

// Import/Export types
export interface ImportContactsDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  tags?: string;
  suggestion?: string;
}

// Export validation functions
export const validateUpsertContact = typia.createValidate<UpsertContactDTO>();
export const validateListContactsQuery = typia.createValidate<ListContactsQueryDTO>();
export const validateCreateTouch = typia.createValidate<CreateTouchDTO>();
export const validatePlanQuery = typia.createValidate<PlanQueryDTO>();
export const validateUpsertDailyGoal = typia.createValidate<UpsertDailyGoalDTO>();
