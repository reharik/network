import { Contact, ImportContactsDTO, UpdateContact } from '@network/contracts';
import { validateUpdateContact } from '@network/validators';
import { ParseResult } from 'parse-fetch';
import { useApiFetch } from './useApiFetch';

export const useContactService = () => {
  const { apiFetch } = useApiFetch();

  const getContact = async (id: string): Promise<ParseResult<Contact>> => {
    return apiFetch<Contact>(`/contacts/${encodeURIComponent(id)}`);
  };

  const createContact = async (contact: UpdateContact): Promise<ParseResult<Contact>> => {
    const result = validateUpdateContact(contact);
    if (!result.success) {
      return {
        success: false,
        errors: result.errors.map((error) => `${error.path} expected ${error.expected}`),
      };
    }

    return apiFetch<Contact>(`/contacts`, {
      method: 'POST',
      body: result.data,
    });
  };

  const updateContact = (contact: UpdateContact & { id: string }) =>
    apiFetch<Contact>(`/contacts/${encodeURIComponent(contact.id)}`, {
      method: 'PATCH',
      body: contact,
    });

  const deleteContact = (id: string) =>
    apiFetch<void>(`/contacts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

  const importContacts = (rows: ImportContactsDTO[]) =>
    apiFetch<{ inserted: number; skipped?: number }>(`/contacts/import`, {
      method: 'POST',
      body: { rows },
    });

  return {
    getContact,
    createContact,
    updateContact,
    deleteContact,
    importContacts,
  };
};
