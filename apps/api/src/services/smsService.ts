import type { Response } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { config } from '../config';
import type { Container } from '../container';
import {
  createAwsSnsSmsProvider,
  createEmailHandoffSmsProvider,
  type SmsProvider,
} from './smsProviders';

export interface SmsService {
  sendSms: (
    to: string,
    message: string,
    userEmail: string,
    userFirstName?: string,
  ) => Promise<Response<{ messageId: string }>>;
}

export const createSmsService = (container: Container): SmsService => {
  // Select provider based on configuration
  let provider: SmsProvider;
  if (config.smsDeliveryMode === 'aws_sns') {
    provider = createAwsSnsSmsProvider(container);
  } else {
    // Default to email_handoff
    provider = createEmailHandoffSmsProvider(container);
  }

  return {
    sendSms: async (
      to: string,
      message: string,
      userEmail: string,
      userFirstName?: string,
    ): Promise<Response<{ messageId: string }>> => {
      return provider.sendSms(to, message, userEmail, userFirstName);
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createSmsService as any)[RESOLVER] = { lifetime: 'SINGLETON' };
