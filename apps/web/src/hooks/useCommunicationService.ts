import { ApiResult } from '../types/ApiResult';
import { useApiFetch } from './useApiFetch';

export interface CommunicationRequest {
  type: 'email' | 'sms' | 'call';
}

export interface SendEmailRequest extends CommunicationRequest {
  to: string;
  subject: string;
  body: string;
}

export interface SendSmsRequest extends CommunicationRequest {
  to: string;
  message: string;
}

export interface MakeCallRequest extends CommunicationRequest {
  to: string;
  from?: string;
}

export const useCommunicationService = () => {
  const { apiFetch } = useApiFetch();

  const sendMessage = async <T extends CommunicationRequest>(
    request: T,
  ): Promise<ApiResult<{ message: string; messageId: string }>> => {
    const path =
      request.type === 'email' ? '/email' : request.type === 'sms' ? '/sms' : '/voice/call';
    return apiFetch<{ message: string; messageId: string }>(path, {
      method: 'POST',
      body: request,
    });
  };

  return {
    sendMessage,
  };
};
