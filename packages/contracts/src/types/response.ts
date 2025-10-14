// Response types for consistent API responses
export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type FailureResponse = {
  success: false;
  errors: string[];
};

export type Response<T> = SuccessResponse<T> | FailureResponse;

// Utility functions for Response handling
export const createSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
});

export const createFailureResponse = (errors: string[]): FailureResponse => ({
  success: false,
  errors,
});

export const createFailureResponseFromError = (error: Error): FailureResponse => ({
  success: false,
  errors: [error.message],
});

// Convert ParseResult to our Response type
export const fromParseResult = <T>(parseResult: {
  success: boolean;
  data?: T;
  errors?: string[];
}): Response<T> => {
  if (parseResult.success) {
    return createSuccessResponse(parseResult.data as T);
  }
  return createFailureResponse(parseResult.errors || ['Unknown error']);
};

// Transform Response data type (useful for service-to-service calls)
export const mapResponse = <T, U>(response: Response<T>, mapper: (data: T) => U): Response<U> => {
  if (response.success) {
    try {
      return createSuccessResponse(mapper(response.data));
    } catch (error) {
      return createFailureResponseFromError(error as Error);
    }
  }
  return response; // Pass through failure responses unchanged
};

// Chain multiple operations that return Response
export const chainResponse = async <T, U>(
  response: Response<T>,
  nextOperation: (data: T) => Promise<Response<U>>,
): Promise<Response<U>> => {
  if (response.success) {
    return nextOperation(response.data);
  }
  return response; // Pass through failure responses unchanged
};

// Utility to handle async operations that might throw
export const fromAsyncOperation = async <T>(operation: () => Promise<T>): Promise<Response<T>> => {
  try {
    const data = await operation();
    return createSuccessResponse(data);
  } catch (error) {
    return createFailureResponseFromError(error as Error);
  }
};
