import {
  ConnectClient,
  ConnectClientConfig,
  StartOutboundVoiceContactCommand,
} from '@aws-sdk/client-connect';
import type { Response } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { config } from '../config';
import type { Container } from '../container';
import { asyncOperationToResponse } from '../utils/responseUtils';

export interface VoiceService {
  makeCall: (to: string, from: string) => Promise<Response<{ contactId: string }>>;
}

export const createVoiceService = ({ logger }: Container): VoiceService => {
  const connectClientConfig: ConnectClientConfig = {
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
    endpoint: config.awsEndpoint, // Will be undefined in production, LocalStack URL in development
  };

  const connectClient = new ConnectClient(connectClientConfig);

  return {
    makeCall: async (to: string, from: string): Promise<Response<{ contactId: string }>> => {
      logger.info('Initiating voice call', {
        to,
        from,
        instanceId: config.connectInstanceId,
      });

      return asyncOperationToResponse(
        async () => {
          const command = new StartOutboundVoiceContactCommand({
            InstanceId: config.connectInstanceId,
            ContactFlowId: config.connectContactFlowId,
            DestinationPhoneNumber: to,
            SourcePhoneNumber: from,
          });

          const result = await connectClient.send(command);
          const contactId = result.ContactId || 'unknown';
          logger.info('Voice call initiated successfully', {
            to,
            from,
            contactId,
          });
          return { contactId };
        },
        logger,
        `makeCall to=${to}`,
      );
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createVoiceService as any)[RESOLVER] = { lifetime: 'SINGLETON' };
