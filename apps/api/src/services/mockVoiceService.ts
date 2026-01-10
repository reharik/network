import { Response } from '@network/contracts';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';
import { asyncOperationToResponse } from '../utils/responseUtils';

export interface MockVoiceService {
  makeCall: (to: string, from: string) => Promise<Response<{ contactId: string }>>;
}

export const createMockVoiceService = ({ logger }: Container): MockVoiceService => {
  return {
    makeCall: async (to: string, from: string): Promise<Response<{ contactId: string }>> => {
      logger.info(`📞 Mock voice call initiated: ${from} → ${to}`);
      logger.info(`📞 This would normally connect via AWS Connect`);

      return asyncOperationToResponse(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          // Simulate a realistic contact ID
          const mockContactId = `mock-contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          return { contactId: mockContactId };
        },
        logger,
        `mockMakeCall to=${to}`,
      );
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createMockVoiceService as any)[RESOLVER] = { lifetime: 'SINGLETON' };
