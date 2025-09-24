import { ContactDTO, ImportContactsDTO } from '@network/contracts';
import { ParseResult } from 'parse-fetch';
import { useApiFetch } from './useApiFetch';

export const useContactService = () => {
  const { apiFetch } = useApiFetch();

  const getContact = async (id: string): Promise<ParseResult<ContactDTO>> => {
    return apiFetch<ContactDTO>(`/contacts/${encodeURIComponent(id)}`);
  };

  const updateContact = (contact: Partial<ContactDTO> & { id: string }) =>
    apiFetch<ContactDTO>(`/contacts/${encodeURIComponent(contact.id)}`, {
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
    updateContact,
    deleteContact,
    importContacts,
  };
};
