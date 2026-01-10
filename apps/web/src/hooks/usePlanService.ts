import { Contact } from '@network/contracts';
import { ApiResult } from '../types/ApiResult';
import { useApiFetch } from './apiFetch/useApiFetch';

export const usePlanService = () => {
  const { apiFetch } = useApiFetch();

  const getTodaysContacts = async (): Promise<ApiResult<Contact[]>> => apiFetch<Contact[]>(`/plan`);

  return {
    getTodaysContacts,
  };
};
