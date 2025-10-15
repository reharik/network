import { PublishCommand, SNSClient, SNSClientConfig } from '@aws-sdk/client-sns';
import { Response } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { config } from '../config';
import { asyncOperationToResponse } from '../utils/responseUtils';

export interface SmsService {
  sendSms: (to: string, message: string) => Promise<Response<{ messageId: string }>>;
}

export const createSmsService = (): SmsService => {
  const snsClientConfig: SNSClientConfig = {
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
    endpoint: config.awsEndpoint, // Will be undefined in production, LocalStack URL in development
  };

  const snsClient = new SNSClient(snsClientConfig);

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
