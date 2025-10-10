import { Contact, Touch, UpdateTouch } from '@network/contracts';
import { ParseResult } from 'parse-fetch';
import { useApiFetch } from './useApiFetch';

export const useTouchService = () => {
  const { apiFetch } = useApiFetch();

  // Create a touch with full data
  const logTouch = async (touchData: UpdateTouch): Promise<ParseResult<Touch>> =>
    apiFetch<Touch>(`/touches`, {
      method: 'POST',
      body: touchData,
    });

  const snoozeContact = async (contactId: string, days: number): Promise<ParseResult<Contact>> => {
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
