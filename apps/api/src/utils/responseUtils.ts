import { Response, fromParseResult } from '@network/contracts';
import { ParseResult } from 'parse-fetch';

// Convert ParseResult to our Response type
export const parseResultToResponse = <T>(parseResult: ParseResult<T>): Response<T> => {
  return fromParseResult(parseResult);
};

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

// Utility to handle database operations that might throw
export const dbOperationToResponse = async <T>(
  operation: () => Promise<T>,
): Promise<Response<T>> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    console.error('Database operation failed:', error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Database operation failed'],
    };
  }
};
