import { User } from '@network/contracts';
import { ApiResult } from '../types/ApiResult';
import { useApiFetch } from './useApiFetch';

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
    return apiFetch<User>('/me/profile', {
      method: 'PUT',
      body: updates,
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
