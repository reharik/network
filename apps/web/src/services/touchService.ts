// src/services/touchService.ts
import { apiFetch } from '../api';

// If you want to log the *actual* method, you can extend this to fetch contact first.
export const logTouch = async (contactId: string) =>
  apiFetch(`/api/touches`, {
    method: 'POST',
    body: { contactId, method: 'OTHER' },
  });

export const snoozeContact = async (contactId: string, days: number) => {
  const until = new Date(Date.now() + days * 86_400_000).toISOString();
  return apiFetch(`/api/contacts/${encodeURIComponent(contactId)}`, {
    method: 'PATCH',
    body: { snoozedUntil: until },
  });
};
