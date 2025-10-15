import { SESClient, SESClientConfig, SendEmailCommand } from '@aws-sdk/client-ses';
import { Response } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { config } from '../config';
import { asyncOperationToResponse } from '../utils/responseUtils';

export interface EmailService {
  sendEmail: (
    to: string,
    subject: string,
    body: string,
    fromEmail?: string,
  ) => Promise<Response<{ messageId: string }>>;
}

export const createEmailService = (): EmailService => {
  const sesClientConfig: SESClientConfig = {
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
    endpoint: config.awsEndpoint, // Will be undefined in production, LocalStack URL in development
  };

  const sesClient = new SESClient(sesClientConfig);

  return {
    sendEmail: async (
      to: string,
      subject: string,
      body: string,
      fromEmail?: string,
    ): Promise<Response<{ messageId: string }>> => {
      return asyncOperationToResponse(async () => {
        const command = new SendEmailCommand({
          Source: fromEmail || config.fromEmail,
          Destination: {
            ToAddresses: [to],
          },
          Message: {
            Subject: {
              Data: subject,
              Charset: 'UTF-8',
            },
            Body: {
              Text: {
                Data: body,
                Charset: 'UTF-8',
              },
            },
          },
        });

        const result = await sesClient.send(command);
        return { messageId: result.MessageId || 'unknown' };
      });
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createEmailService as any)[RESOLVER] = { lifetime: 'SINGLETON' };
