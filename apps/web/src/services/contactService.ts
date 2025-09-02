import { apiFetch } from '../api';
import type { Contact } from '../types';

export const getContact = (id: string) =>
  apiFetch<Contact>(`/api/contacts/${encodeURIComponent(id)}`);

export const updateContact = (contact: Partial<Contact> & { id: string }) =>
  apiFetch<Contact>(`/api/contacts/${encodeURIComponent(contact.id)}`, {
    method: 'PUT',
    body: contact,
  });

export const deleteContact = (id: string) =>
  apiFetch<void>(`/api/contacts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

export type ImportRow = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  tags?: string | string[];
};

export const importContacts = (rows: ImportRow[]) =>
  apiFetch<{ inserted: number; skipped?: number }>(`/api/contacts/import`, {
    method: 'POST',
    body: { rows },
  });
