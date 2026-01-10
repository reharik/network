import { User, validateUpdateUser } from '@network/contracts';
import { ApiResult, createValidationError } from '../types/ApiResult';
import { useApiFetch } from './apiFetch/useApiFetch';

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const useUserService = () => {
  const { apiFetch } = useApiFetch();

  const getMe = async (): Promise<ApiResult<User>> => {
    return apiFetch<User>('/me');
  };

  const updateProfile = async (updates: UpdateUserProfileRequest): Promise<ApiResult<User>> => {
    const result = validateUpdateUser(updates);
    if (!result.success) {
      return {
        success: false,
        errors: result.errors.map(createValidationError),
      };
    }

    return apiFetch<User>('/me/profile', {
      method: 'PUT',
      body: result.data,
    });
  };

  const updateDailyGoal = async (dailyGoal: number): Promise<ApiResult<User>> => {
    return apiFetch<User>('/me/daily-goal', {
      method: 'PUT',
      body: { dailyGoal },
    });
  };

  return {
    getMe,
    updateProfile,
    updateDailyGoal,
  };
};
