import { apiFetch } from '../api';
import type { Contact } from '@network/contracts';

export const fetchContacts = async (): Promise<{ contacts: Contact[] }> => {
  const rows = await apiFetch<Contact[]>(`/api/contacts`);
  return { contacts: rows };
};
