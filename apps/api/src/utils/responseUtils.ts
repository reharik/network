import { Response } from '@network/contracts';
import type { LoggerInterface } from '../logger';

// Utility to handle async operations that might throw
export const asyncOperationToResponse = async <T>(
  operation: () => Promise<T>,
  logger: LoggerInterface,
  context: string,
): Promise<Response<T>> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    logger.error(`Operation failed (${context}): ${errorMessage}`, {
      stack,
    });
    return {
      success: false,
      errors: [errorMessage],
    };
  }
};

// seems we are not using this.

// Utility to handle database operations that might throw
// export const dbOperationToResponse = async <T>(
//   operation: () => Promise<T>,
// ): Promise<Response<T>> => {
//   try {
//     const data = await operation();
//     return { success: true, data };
//   } catch (error) {
//     console.error('Database operation failed:', error);
//     return {
//       success: false,
//       errors: [error instanceof Error ? error.message : 'Database operation failed'],
//     };
//   }
// };
