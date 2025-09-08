import { useApiFetch } from './useApiFetch';

export const useTouchService = () => {
  const { apiFetch } = useApiFetch();

  // If you want to log the *actual* method, you can extend this to fetch contact first.
  const logTouch = async (contactId: string) =>
    apiFetch(`/touches`, {
      method: 'POST',
      body: { contactId, method: 'OTHER' },
    });

  const snoozeContact = async (contactId: string, days: number) => {
    const until = new Date(Date.now() + days * 86_400_000).toISOString();
    return apiFetch(`/contacts/${encodeURIComponent(contactId)}`, {
      method: 'PATCH',
      body: { snoozedUntil: until },
    });
  };

  return {
    logTouch,
    snoozeContact,
  };
};
