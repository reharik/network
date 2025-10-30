import { Contact } from '@network/contracts';
import { useApiFetch } from './useApiFetch';
import { ApiResult } from '../types/ApiResult';

export const usePlanService = () => {
  const { apiFetch } = useApiFetch();

  const getTodaysContacts = async (): Promise<ApiResult<Contact[]>> => apiFetch<Contact[]>(`/plan`);

  return {
    getTodaysContacts,
  };
};
