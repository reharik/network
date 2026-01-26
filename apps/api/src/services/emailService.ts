import { SESClient, SESClientConfig, SendEmailCommand } from '@aws-sdk/client-ses';
import type { Response } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { config } from '../config';
import type { Container } from '../container';
import { asyncOperationToResponse } from '../utils/responseUtils';

export interface EmailService {
  sendEmail: (
    to: string,
    subject: string,
    body: string,
    fromEmail?: string,
    replyToEmail?: string,
  ) => Promise<Response<{ messageId: string }>>;
}

export const createEmailService = ({ logger }: Container): EmailService => {
  // Check if explicit credentials are provided
  // If not, AWS SDK will use default credential chain (IAM roles, environment variables, etc.)
  const hasExplicitCredentials =
    config.awsAccessKeyId &&
    config.awsAccessKeyId.trim() !== '' &&
    config.awsSecretAccessKey &&
    config.awsSecretAccessKey.trim() !== '';

  if (!hasExplicitCredentials && !config.awsEndpoint) {
    logger.info(
      'No explicit AWS credentials configured. Using default credential chain (IAM roles, environment variables, etc.).',
    );
  }

  const sesClientConfig: SESClientConfig = {
    region: config.awsRegion,
    credentials: hasExplicitCredentials
      ? {
          accessKeyId: config.awsAccessKeyId,
          secretAccessKey: config.awsSecretAccessKey,
        }
      : undefined, // Let AWS SDK use default credential chain (IAM roles on EC2, etc.)
    endpoint: config.awsEndpoint, // Will be undefined in production, LocalStack URL in development
  };

  const sesClient = new SESClient(sesClientConfig);

  return {
    sendEmail: async (
      to: string,
      subject: string,
      body: string,
      fromEmail?: string,
      replyToEmail?: string,
    ): Promise<Response<{ messageId: string }>> => {
      const fromAddress = fromEmail || config.fromEmail;
      logger.info('Sending email', {
        to,
        subject,
        from: fromAddress,
        replyTo: replyToEmail,
      });

      return asyncOperationToResponse(
        async () => {
          const command = new SendEmailCommand({
            Source: fromAddress,
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
            ReplyToAddresses: replyToEmail ? [replyToEmail] : undefined,
          });

          const result = await sesClient.send(command);
          const messageId = result.MessageId || 'unknown';
          logger.info('Email sent successfully', {
            to,
            subject,
            messageId,
            from: fromAddress,
            replyTo: replyToEmail,
          });
          return { messageId };
        },
        logger,
        `sendEmail to=${to}`,
      );
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createEmailService as any)[RESOLVER] = { lifetime: 'SINGLETON' };
