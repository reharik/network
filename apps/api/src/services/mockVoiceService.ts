import { Response } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { asyncOperationToResponse } from '../utils/responseUtils';

export interface MockVoiceService {
  makeCall: (to: string, from: string) => Promise<Response<{ contactId: string }>>;
}

export const createMockVoiceService = (): MockVoiceService => {
  return {
    makeCall: async (to: string, from: string): Promise<Response<{ contactId: string }>> => {
      // eslint-disable-next-line @typescript-eslint/require-await
      return asyncOperationToResponse(async () => {
        console.log(`📞 Mock voice call initiated: ${from} → ${to}`);
        console.log(`📞 This would normally connect via AWS Connect`);
        console.log(`📞 In production, this will use real AWS Connect`);

        // Simulate a realistic contact ID
        const mockContactId = `mock-contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return { contactId: mockContactId };
      });
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createMockVoiceService as any)[RESOLVER] = { lifetime: 'SINGLETON' };
