import {
  CreateTouchDTO,
  ListContactsQueryDTO,
  PlanQueryDTO,
  UpsertContactDTO,
  UpsertDailyGoalDTO,
} from '@network/contracts';
import typia from 'typia';

// Export validation functions using typia.validate for runtime validation
export const validateUpsertContact = (data: unknown) => typia.validate<UpsertContactDTO>(data);
export const validateListContactsQuery = (data: unknown) =>
  typia.validate<ListContactsQueryDTO>(data);
export const validateCreateTouch = (data: unknown) => typia.validate<CreateTouchDTO>(data);
export const validatePlanQuery = (data: unknown) => typia.validate<PlanQueryDTO>(data);
export const validateUpsertDailyGoal = (data: unknown) => typia.validate<UpsertDailyGoalDTO>(data);

export const validators = {
  upsertContact: validateUpsertContact,
  listContactsQuery: validateListContactsQuery,
  createTouch: validateCreateTouch,
  planQuery: validatePlanQuery,
  upsertDailyGoal: validateUpsertDailyGoal,
} as const;

export type ValidatorKey = keyof typeof validators;

export function validate<K extends ValidatorKey>(key: K, data: unknown) {
  return validators[key](data);
}
