import { Contact, Touch, UpdateTouch, validateInsertTouch } from '@network/contracts';
import { ApiResult, createValidationError } from '../types/ApiResult';
import { useApiFetch } from './apiFetch/useApiFetch';

export const useTouchService = () => {
  const { apiFetch } = useApiFetch();

  // Create a touch with full data
  const logTouch = async (touchData: UpdateTouch): Promise<ApiResult<Touch>> => {
    const result = validateInsertTouch(touchData);
    if (!result.success) {
      return {
        success: false,
        errors: result.errors.map(createValidationError),
      };
    }

    return apiFetch<Touch>(`/touches`, {
      method: 'POST',
      body: result.data,
    });
  };

  const snoozeContact = async (contactId: string, days: number): Promise<ApiResult<Contact>> => {
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
