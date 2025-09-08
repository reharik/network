import type { Contact } from '@network/contracts';
import { useApiFetch } from './useApiFetch';

export const useContactListService = () => {
  const { apiFetch } = useApiFetch();

  const fetchContacts = async (): Promise<{ contacts: Contact[] }> => {
    const rows = await apiFetch<Contact[]>(`/contacts`);
    return { contacts: rows };
  };

  return {
    fetchContacts,
  };
};
