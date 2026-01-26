import { PublishCommand, SNSClient, SNSClientConfig } from '@aws-sdk/client-sns';
import type { Response } from '@network/contracts';
import { config } from '../config';
import type { Container } from '../container';
import { asyncOperationToResponse } from '../utils/responseUtils';

export interface SmsProvider {
  sendSms: (
    toPhoneNumber: string,
    messageBody: string,
    userEmail: string,
    userFirstName?: string,
  ) => Promise<Response<{ messageId: string }>>;
}

/**
 * Email-based SMS provider that sends an email with an sms: link
 * and copy/paste instructions instead of sending via AWS SNS.
 */
export const createEmailHandoffSmsProvider = ({ logger, emailService }: Container): SmsProvider => {
  const appName = 'Network'; // Could be moved to config if needed

  const buildSmsLink = (toPhoneNumber: string, messageBody: string): string => {
    return `sms:${toPhoneNumber}?body=${encodeURIComponent(messageBody)}`;
  };

  const buildEmailBody = (
    toPhoneNumber: string,
    messageBody: string,
    smsLink: string,
    firstName?: string,
  ): string => {
    const firstNameOrThere = firstName || 'there';
    const messageBodyWithBreaks = messageBody.replace(/\n/g, '\n');

    return `Hi ${firstNameOrThere},

You asked us to help you send a text message. Tap the link below on your phone to open your Messages app with the message pre-filled. You can edit it before sending.

MOBILE (tap to open Messages):
${smsLink}

DESKTOP (Messages for Web / desktop SMS apps):
If you're on a desktop, the link may open on your phone instead of your browser. In that case, just copy and paste the details below into Messages for Web (messages.google.com/web) or your preferred SMS app:

To:
${toPhoneNumber}

Message:
${messageBodyWithBreaks}

That's it — once you hit Send, the message will be sent from your own phone number.

— ${appName}`;
  };

  return {
    sendSms: async (
      toPhoneNumber: string,
      messageBody: string,
      userEmail: string,
      userFirstName?: string,
    ): Promise<Response<{ messageId: string }>> => {
      logger.info('Sending SMS via email handoff', {
        toPhoneNumber,
        userEmail,
        messageLength: messageBody.length,
      });

      const smsLink = buildSmsLink(toPhoneNumber, messageBody);
      const emailBody = buildEmailBody(toPhoneNumber, messageBody, smsLink, userFirstName);
      const emailSubject = 'Send this text from your phone';

      const emailResult = await emailService.sendEmail(
        userEmail,
        emailSubject,
        emailBody,
        config.fromEmail,
        'Back in Touch',
      );

      if (!emailResult.success) {
        return emailResult;
      }

      logger.info('SMS email handoff sent successfully', {
        toPhoneNumber,
        userEmail,
        messageId: emailResult.data.messageId,
      });

      return {
        success: true,
        data: { messageId: emailResult.data.messageId },
      };
    },
  };
};

/**
 * AWS SNS-based SMS provider (legacy, not currently used).
 * This provider is kept for future use but should not be invoked
 * when SMS_DELIVERY_MODE is set to 'email_handoff'.
 */
export const createAwsSnsSmsProvider = ({ logger }: Container): SmsProvider => {
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

  const snsClientConfig: SNSClientConfig = {
    region: config.awsRegion,
    credentials: hasExplicitCredentials
      ? {
          accessKeyId: config.awsAccessKeyId,
          secretAccessKey: config.awsSecretAccessKey,
        }
      : undefined, // Let AWS SDK use default credential chain (IAM roles on EC2, etc.)
    endpoint: config.awsEndpoint, // Will be undefined in production, LocalStack URL in development
  };

  const snsClient = new SNSClient(snsClientConfig);

  return {
    sendSms: async (
      toPhoneNumber: string,
      messageBody: string,
    ): Promise<Response<{ messageId: string }>> => {
      logger.info('Sending SMS via AWS SNS', {
        toPhoneNumber,
        messageLength: messageBody.length,
      });

      return asyncOperationToResponse(
        async () => {
          const command = new PublishCommand({
            PhoneNumber: toPhoneNumber,
            Message: messageBody,
          });

          const result = await snsClient.send(command);
          const messageId = result.MessageId || 'unknown';
          logger.info('SMS sent successfully via AWS SNS', {
            toPhoneNumber,
            messageId,
          });
          return { messageId };
        },
        logger,
        `sendSms to=${toPhoneNumber}`,
      );
    },
  };
};
