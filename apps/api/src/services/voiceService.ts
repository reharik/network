import {
  ConnectClient,
  ConnectClientConfig,
  StartOutboundVoiceContactCommand,
} from '@aws-sdk/client-connect';
import { Response } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { config } from '../config';
import { asyncOperationToResponse } from '../utils/responseUtils';

export interface VoiceService {
  makeCall: (to: string, from: string) => Promise<Response<{ contactId: string }>>;
}

export const createVoiceService = (): VoiceService => {
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
      return asyncOperationToResponse(async () => {
        const command = new StartOutboundVoiceContactCommand({
          InstanceId: config.connectInstanceId,
          ContactFlowId: config.connectContactFlowId,
          DestinationPhoneNumber: to,
          SourcePhoneNumber: from,
        });

        const result = await connectClient.send(command);
        return { contactId: result.ContactId || 'unknown' };
      });
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createVoiceService as any)[RESOLVER] = { lifetime: 'SINGLETON' };
