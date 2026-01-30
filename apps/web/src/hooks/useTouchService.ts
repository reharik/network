import { Contact, CreateTouchInput, Touch, validateCreateTouchInput } from '@network/contracts';
import { ApiResult, createValidationError } from '../types/ApiResult';
import { useApiFetch } from './apiFetch/useApiFetch';

export const useTouchService = () => {
  const { apiFetch } = useApiFetch();

  const getContactTouches = async (
    contactId: string,
  ): Promise<ApiResult<{ touches: Touch[] }>> => {
    return apiFetch<{ touches: Touch[] }>(
      `/contacts/${encodeURIComponent(contactId)}/touches`,
      { method: 'GET' },
    );
  };

  // Create a touch - userId is added by server from JWT token
  const logTouch = async (touchData: CreateTouchInput): Promise<ApiResult<Touch>> => {
    const result = validateCreateTouchInput(touchData);
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
    getContactTouches,
    logTouch,
    snoozeContact,
  };
};
