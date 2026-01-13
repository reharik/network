import { DailyContact } from '@network/contracts';
import { ApiResult } from '../types/ApiResult';
import { useApiFetch } from './apiFetch/useApiFetch';

export const usePlanService = () => {
  const { apiFetch } = useApiFetch();

  const getTodaysContacts = async (): Promise<ApiResult<DailyContact[]>> =>
    apiFetch<DailyContact[]>(`/plan`);

  return {
    getTodaysContacts,
  };
};
