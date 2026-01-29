import {
  Contact,
  ImportContactsDTO,
  UpdateContact,
  validateUpdateContact,
} from '@network/contracts';
import { ApiResult, createValidationError } from '../types/ApiResult';
import { useApiFetch } from './apiFetch/useApiFetch';

export const useContactService = () => {
  const { apiFetch } = useApiFetch();

  const getContact = async (id: string): Promise<ApiResult<Contact>> => {
    return apiFetch<Contact>(`/contacts/${encodeURIComponent(id)}`);
  };

  const createContact = async (contact: UpdateContact): Promise<ApiResult<Contact>> => {
    const result = validateUpdateContact(contact);
    if (!result.success) {
      return {
        success: false,
        errors: result.errors.map(createValidationError),
      };
    }

    return apiFetch<Contact>(`/contacts`, {
      method: 'POST',
      body: result.data,
    });
  };

  const updateContact = async (
    contact: UpdateContact & { id: string },
  ): Promise<ApiResult<Contact>> => {
    const result = validateUpdateContact(contact);
    if (!result.success) {
      return {
        success: false,
        errors: result.errors.map(createValidationError),
      };
    }

    return apiFetch<Contact>(`/contacts/${encodeURIComponent(contact.id)}`, {
      method: 'PATCH',
      body: result.data,
    });
  };

  const deleteContact = (id: string) =>
    apiFetch<void>(`/contacts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

  const importContacts = (rows: ImportContactsDTO[]) =>
    apiFetch<{ inserted: number; skipped?: number }>(`/contacts/import`, {
      method: 'POST',
      body: { rows },
    });

  const suspendContact = async (contactId: string): Promise<ApiResult<Contact>> => {
    return apiFetch<Contact>(`/contacts/${encodeURIComponent(contactId)}`, {
      method: 'PATCH',
      body: { paused: true },
    });
  };

  const unsuspendContact = async (contactId: string): Promise<ApiResult<Contact>> => {
    return apiFetch<Contact>(`/contacts/${encodeURIComponent(contactId)}`, {
      method: 'PATCH',
      body: { paused: false },
    });
  };

  return {
    getContact,
    createContact,
    updateContact,
    deleteContact,
    importContacts,
    suspendContact,
    unsuspendContact,
  };
};
