import { ContactDTO } from '@network/contracts';
import { ParseResult } from 'parse-fetch';
import { useApiFetch } from './useApiFetch';

export const usePlanService = () => {
  const { apiFetch } = useApiFetch();

  const getTodaysContacts = async (): Promise<ParseResult<ContactDTO[]>> =>
    apiFetch<ContactDTO[]>(`/plan`);

  return {
    getTodaysContacts,
  };
};
