import type { Contact } from '../types';
import { useApiFetch } from './useApiFetch';

export const useContactService = () => {
  const { apiFetch } = useApiFetch();

  const getContact = (id: string) => apiFetch<Contact>(`/contacts/${encodeURIComponent(id)}`);

  const updateContact = (contact: Partial<Contact> & { id: string }) =>
    apiFetch<Contact>(`/contacts/${encodeURIComponent(contact.id)}`, {
      method: 'PUT',
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
