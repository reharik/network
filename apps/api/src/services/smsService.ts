import { PublishCommand, SNSClient, SNSClientConfig } from '@aws-sdk/client-sns';
import type { Response } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { config } from '../config';
import type { Container } from '../container';
import { asyncOperationToResponse } from '../utils/responseUtils';

export interface SmsService {
  sendSms: (to: string, message: string) => Promise<Response<{ messageId: string }>>;
}

export const createSmsService = ({ logger }: Container): SmsService => {
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
      logger.info('Sending SMS', {
        to,
        messageLength: message.length,
      });

      return asyncOperationToResponse(
        async () => {
          const command = new PublishCommand({
            PhoneNumber: to,
            Message: message,
          });

          const result = await snsClient.send(command);
          const messageId = result.MessageId || 'unknown';
          logger.info('SMS sent successfully', {
            to,
            messageId,
          });
          return { messageId };
        },
        logger,
        `sendSms to=${to}`,
      );
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createSmsService as any)[RESOLVER] = { lifetime: 'SINGLETON' };
