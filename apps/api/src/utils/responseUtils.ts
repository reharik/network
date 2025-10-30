import { Response } from '@network/contracts';

// Utility to handle async operations that might throw
export const asyncOperationToResponse = async <T>(
  operation: () => Promise<T>,
): Promise<Response<T>> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
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
