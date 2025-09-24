import type { ContactDTO } from '@network/contracts';
import { ParseResult } from 'parse-fetch';
import { useApiFetch } from './useApiFetch';

export const useContactListService = () => {
  const { apiFetch } = useApiFetch();

  const fetchContacts = async (): Promise<ParseResult<{ contacts: ContactDTO[] }>> => {
    return apiFetch<{ contacts: ContactDTO[] }>(`/contacts`);
  };

  return {
    fetchContacts,
  };
};
