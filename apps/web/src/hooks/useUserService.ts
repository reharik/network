import { User } from '@network/contracts';
import { ParseResult } from 'parse-fetch';
import { useApiFetch } from './useApiFetch';

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const useUserService = () => {
  const { apiFetch } = useApiFetch();

  const getMe = async (): Promise<ParseResult<User>> => {
    return apiFetch<User>('/me');
  };

  const updateProfile = async (updates: UpdateUserProfileRequest): Promise<ParseResult<User>> => {
    return apiFetch<User>('/me/profile', {
      method: 'PUT',
      body: updates,
    });
  };

  const updateDailyGoal = async (dailyGoal: number): Promise<ParseResult<User>> => {
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
