import { CreateTouchDTO, ListContactsQueryDTO, PlanQueryDTO, UpsertContactDTO, UpsertDailyGoalDTO } from '@network/contracts';
import typia from 'typia';
export declare const validateUpsertContact: (data: unknown) => typia.IValidation<UpsertContactDTO>;
export declare const validateListContactsQuery: (data: unknown) => typia.IValidation<ListContactsQueryDTO>;
export declare const validateCreateTouch: (data: unknown) => typia.IValidation<CreateTouchDTO>;
export declare const validatePlanQuery: (data: unknown) => typia.IValidation<PlanQueryDTO>;
export declare const validateUpsertDailyGoal: (data: unknown) => typia.IValidation<UpsertDailyGoalDTO>;
export declare const validators: {
    readonly upsertContact: (data: unknown) => typia.IValidation<UpsertContactDTO>;
    readonly listContactsQuery: (data: unknown) => typia.IValidation<ListContactsQueryDTO>;
    readonly createTouch: (data: unknown) => typia.IValidation<CreateTouchDTO>;
    readonly planQuery: (data: unknown) => typia.IValidation<PlanQueryDTO>;
    readonly upsertDailyGoal: (data: unknown) => typia.IValidation<UpsertDailyGoalDTO>;
};
export type ValidatorKey = keyof typeof validators;
export declare function validate<K extends ValidatorKey>(key: K, data: unknown): typia.IValidation.IFailure | typia.IValidation.ISuccess<UpsertContactDTO> | typia.IValidation.ISuccess<ListContactsQueryDTO> | typia.IValidation.ISuccess<CreateTouchDTO> | typia.IValidation.ISuccess<PlanQueryDTO> | typia.IValidation.ISuccess<UpsertDailyGoalDTO>;
