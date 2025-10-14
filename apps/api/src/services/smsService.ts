import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Response } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { config } from '../config';
import { asyncOperationToResponse } from '../utils/responseUtils';

export interface SmsService {
  sendSms: (to: string, message: string) => Promise<Response<{ messageId: string }>>;
}

export const createSmsService = (): SmsService => {
  const snsClient = new SNSClient({
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
  });

  return {
    sendSms: async (to: string, message: string): Promise<Response<{ messageId: string }>> => {
      return asyncOperationToResponse(async () => {
        const command = new PublishCommand({
          PhoneNumber: to,
          Message: message,
        });

        const result = await snsClient.send(command);
        return { messageId: result.MessageId || 'unknown' };
      });
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createSmsService as any)[RESOLVER] = { lifetime: 'SINGLETON' };
