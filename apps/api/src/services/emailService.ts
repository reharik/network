import { SESClient, SESClientConfig, SendRawEmailCommand } from '@aws-sdk/client-ses';
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
    fromEmail: string,
    fromDisplayName?: string,
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
      fromEmail: string,
      fromDisplayName?: string,
      replyToEmail?: string,
    ): Promise<Response<{ messageId: string }>> => {
      logger.info('Sending email', {
        to,
        subject,
        from: fromEmail,
        fromDisplayName,
        replyTo: replyToEmail,
      });

      return asyncOperationToResponse(
        async () => {
          // Build raw email with headers
          const headers: string[] = [];

          if (fromDisplayName) {
            const safeName = fromDisplayName.replace(/"/g, '\\"');
            headers.push(`From: "${safeName}" <${fromEmail}>`);
          } else {
            headers.push(`From: ${fromEmail}`);
          }

          headers.push(`To: ${to}`);
          
          if (replyToEmail) {
            headers.push(`Reply-To: ${replyToEmail}`);
          }
          
          headers.push(`Subject: ${subject}`);
          headers.push('MIME-Version: 1.0');
          headers.push('Content-Type: text/plain; charset=UTF-8');
          
          const rawEmail = headers.join('\r\n') + '\r\n\r\n' + body;
          const rawMessage = Buffer.from(rawEmail, 'utf-8');
          
          const command = new SendRawEmailCommand({
            Source: fromEmail, // IMPORTANT: bare email for SES identity check
            RawMessage: { Data: rawMessage },
          });
          
          const result = await sesClient.send(command);
          
          const messageId = result.MessageId || 'unknown';
          logger.info('Email sent successfully', {
            to,
            subject,
            messageId,
            from: fromEmail,
            fromDisplayName,
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
