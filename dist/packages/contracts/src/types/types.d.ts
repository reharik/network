import typia from 'typia';
import type { ContactMethod } from '../enums/ContactMethod';
import type { tags } from 'typia';
export type ReplaceProp<T, K extends PropertyKey, V, Opt extends boolean = true> = Omit<T, Extract<K, keyof T>> & (Opt extends true ? {
    [P in K]?: V;
} : {
    [P in K]: V;
});
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
export interface ImportContactsDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    notes?: string;
    tags?: string;
    suggestion?: string;
}
export declare const validateUpsertContact: ((input: unknown) => typia.IValidation<UpsertContactDTO>) & import("@standard-schema/spec").StandardSchemaV1<unknown, UpsertContactDTO>;
export declare const validateListContactsQuery: ((input: unknown) => typia.IValidation<ListContactsQueryDTO>) & import("@standard-schema/spec").StandardSchemaV1<unknown, ListContactsQueryDTO>;
export declare const validateCreateTouch: ((input: unknown) => typia.IValidation<CreateTouchDTO>) & import("@standard-schema/spec").StandardSchemaV1<unknown, CreateTouchDTO>;
export declare const validatePlanQuery: ((input: unknown) => typia.IValidation<PlanQueryDTO>) & import("@standard-schema/spec").StandardSchemaV1<unknown, PlanQueryDTO>;
export declare const validateUpsertDailyGoal: ((input: unknown) => typia.IValidation<UpsertDailyGoalDTO>) & import("@standard-schema/spec").StandardSchemaV1<unknown, UpsertDailyGoalDTO>;
//# sourceMappingURL=types.d.ts.map