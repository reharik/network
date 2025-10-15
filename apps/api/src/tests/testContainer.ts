import { asFunction } from 'awilix';
import { container as baseContainer } from '../container';
import { createMockVoiceService } from '../services/mockVoiceService';

/**
 * Test container that uses mock services instead of real AWS services
 * This ensures test code doesn't leak into production
 */
export const createTestContainer = () => {
  // Create a child container that inherits from the base container
  const testContainer = baseContainer.createScope();

  // Override voiceService with mock implementation
  testContainer.register({
    voiceService: asFunction(createMockVoiceService),
  });

  return testContainer;
};

// Export a singleton test container instance
export const testContainer = createTestContainer();
