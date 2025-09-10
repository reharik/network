import type { Contact, ContactDTO } from '@network/contracts';
import { mappers } from '../mappers';
import { useApiFetch } from './useApiFetch';

export const useContactListService = () => {
  const { apiFetch } = useApiFetch();

  const fetchContacts = async (): Promise<{ contacts: Contact[] }> => {
    const rows = await apiFetch<ContactDTO[]>(`/contacts`);
    return { contacts: rows.map((x) => mappers.toContact(x)).filter((x) => !!x) };
  };

  return {
    fetchContacts,
  };
};
