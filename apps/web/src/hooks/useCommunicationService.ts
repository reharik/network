import { ApiResult, ValidationError } from '../types/ApiResult';
import { useApiFetch } from './apiFetch/useApiFetch';

export interface CommunicationRequest {
  type: 'email' | 'sms' | 'call';
}

export interface SendEmailRequest extends CommunicationRequest {
  type: 'email';
  to: string;
  subject: string;
  body: string;
}

export interface SendSmsRequest extends CommunicationRequest {
  type: 'sms';
  to: string;
  message: string;
}

export interface MakeCallRequest extends CommunicationRequest {
  type: 'call';
  to: string;
  from?: string;
}

/**
 * Create a validation error in the same format as typia errors
 */
const createFieldError = (field: string, expected: string): ValidationError => ({
  kind: 'validation',
  source: 'typia',
  path: field,
  expected,
  message: `${field} ${expected}`,
});

/**
 * Validate email request - subject and body are required
 */
const validateEmailRequest = (
  request: SendEmailRequest,
): { success: true; data: SendEmailRequest } | { success: false; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!request.to || request.to.trim() === '') {
    errors.push(createFieldError('to', 'is required'));
  }
  if (!request.subject || request.subject.trim() === '') {
    errors.push(createFieldError('subject', 'is required'));
  }
  if (!request.body || request.body.trim() === '') {
    errors.push(createFieldError('body', 'is required'));
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }
  return { success: true, data: request };
};

/**
 * Validate SMS request - message is required
 */
const validateSmsRequest = (
  request: SendSmsRequest,
): { success: true; data: SendSmsRequest } | { success: false; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!request.to || request.to.trim() === '') {
    errors.push(createFieldError('to', 'is required'));
  }
  if (!request.message || request.message.trim() === '') {
    errors.push(createFieldError('message', 'is required'));
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }
  return { success: true, data: request };
};

/**
 * Validate call request - to is required
 */
const validateCallRequest = (
  request: MakeCallRequest,
): { success: true; data: MakeCallRequest } | { success: false; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!request.to || request.to.trim() === '') {
    errors.push(createFieldError('to', 'is required'));
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }
  return { success: true, data: request };
};

export const useCommunicationService = () => {
  const { apiFetch } = useApiFetch();

  const sendMessage = async <T extends CommunicationRequest>(
    request: T,
  ): Promise<ApiResult<{ message: string; messageId: string }>> => {
    // Validate based on request type
    if (request.type === 'email') {
      const validation = validateEmailRequest(request as SendEmailRequest);
      if (!validation.success) {
        return { success: false, errors: validation.errors };
      }
    } else if (request.type === 'sms') {
      const validation = validateSmsRequest(request as SendSmsRequest);
      if (!validation.success) {
        return { success: false, errors: validation.errors };
      }
    } else if (request.type === 'call') {
      const validation = validateCallRequest(request as MakeCallRequest);
      if (!validation.success) {
        return { success: false, errors: validation.errors };
      }
    }

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
