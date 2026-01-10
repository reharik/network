import type { Contact } from '@network/contracts';
import { ApiResult } from '../types/ApiResult';
import { useApiFetch } from './apiFetch/useApiFetch';

export const useContactListService = () => {
  const { apiFetch } = useApiFetch();

  const fetchContacts = async (): Promise<ApiResult<{ contacts: Contact[] }>> => {
    return apiFetch<{ contacts: Contact[] }>(`/contacts`);
  };

  return {
    fetchContacts,
  };
};
