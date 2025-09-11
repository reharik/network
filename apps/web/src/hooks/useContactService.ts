import { Contact, ContactDTO } from '@network/contracts';
import { mappers } from '../mappers';
import { useApiFetch } from './useApiFetch';

export const useContactService = () => {
  const { apiFetch } = useApiFetch();

  const getContact = async (id: string) => {
    const contact = await apiFetch<ContactDTO>(`/contacts/${encodeURIComponent(id)}`);
    return mappers.toContact(contact);
  };

  const updateContact = (contact: Partial<Contact> & { id: string }) =>
    apiFetch<Contact>(`/contacts/${encodeURIComponent(contact.id)}`, {
      method: 'PATCH',
      body: contact,
    });

  const deleteContact = (id: string) =>
    apiFetch<void>(`/contacts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

  const importContacts = (rows: ImportRow[]) =>
    apiFetch<{ inserted: number; skipped?: number }>(`/contacts/import`, {
      method: 'POST',
      body: { rows },
    });

  return {
    getContact,
    updateContact,
    deleteContact,
    importContacts,
  };
};

export type ImportRow = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  tags?: string | string[];
};
