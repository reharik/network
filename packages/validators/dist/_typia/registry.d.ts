import { CreateTouchDTO, ListContactsQueryDTO, PlanQueryDTO, UpsertContactDTO, UpsertDailyGoalDTO } from '@network/contracts';
export declare const validateUpsertContact: (data: unknown) => import("typia").IValidation<UpsertContactDTO>;
export declare const validateListContactsQuery: (data: unknown) => import("typia").IValidation<ListContactsQueryDTO>;
export declare const validateCreateTouch: (data: unknown) => import("typia").IValidation<CreateTouchDTO>;
export declare const validatePlanQuery: (data: unknown) => import("typia").IValidation<PlanQueryDTO>;
export declare const validateUpsertDailyGoal: (data: unknown) => import("typia").IValidation<UpsertDailyGoalDTO>;
export declare const validators: {
    readonly upsertContact: (data: unknown) => import("typia").IValidation<UpsertContactDTO>;
    readonly listContactsQuery: (data: unknown) => import("typia").IValidation<ListContactsQueryDTO>;
    readonly createTouch: (data: unknown) => import("typia").IValidation<CreateTouchDTO>;
    readonly planQuery: (data: unknown) => import("typia").IValidation<PlanQueryDTO>;
    readonly upsertDailyGoal: (data: unknown) => import("typia").IValidation<UpsertDailyGoalDTO>;
};
export type ValidatorKey = keyof typeof validators;
export declare function validate<K extends ValidatorKey>(key: K, data: unknown): import("typia").IValidation.IFailure | import("typia").IValidation.ISuccess<UpsertContactDTO> | import("typia").IValidation.ISuccess<ListContactsQueryDTO> | import("typia").IValidation.ISuccess<CreateTouchDTO> | import("typia").IValidation.ISuccess<PlanQueryDTO> | import("typia").IValidation.ISuccess<UpsertDailyGoalDTO>;
