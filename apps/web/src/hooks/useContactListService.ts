import type { Contact } from '@network/contracts';
import { ParseResult } from 'parse-fetch';
import { useApiFetch } from './useApiFetch';

export const useContactListService = () => {
  const { apiFetch } = useApiFetch();

  const fetchContacts = async (): Promise<ParseResult<{ contacts: Contact[] }>> => {
    return apiFetch<{ contacts: Contact[] }>(`/contacts`);
  };

  return {
    fetchContacts,
  };
};
