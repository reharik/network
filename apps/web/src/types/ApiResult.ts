// ApiResult.ts
import type typia from 'typia';

export type BaseApiError = {
  kind: 'validation' | 'parse' | 'http' | 'network';
  message: string;
  originalError?: unknown;
};
export type ValidationError = BaseApiError & {
  kind: 'validation';
  source: 'typia';
  path: string;
  expected: string;
};
export type ParseError = BaseApiError & {
  kind: 'parse';
};
export type HttpError = BaseApiError & {
  kind: 'http';
  status: number;
  statusText: string;
  bodyText?: string;
};

export type NetworkError = BaseApiError & {
  kind: 'network';
};

export type ApiError = ValidationError | ParseError | HttpError | NetworkError;

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; errors: ApiError[] };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export const createParseError = (message: string): ParseError => ({
  kind: 'parse',
  message: message,
});

export const createNetworkError = (params: {
  message: string;
  originalError?: Error;
}): NetworkError => ({
  kind: 'network',
  message: params.message,
  originalError: params.originalError,
});

export const createHttpError = (response: Response): HttpError => ({
  kind: 'http',
  status: response.status,
  statusText: response.statusText,
  message: `${response.status} ${response.statusText}`,
});

export const createValidationError = (error: typia.IValidation.IError): ValidationError => {
  // Strip "$input." prefix from path so it matches form field IDs
  const normalizedPath = error.path.replace(/^\$input\./, '');
  return {
    kind: 'validation',
    source: 'typia',
    path: normalizedPath,
    expected: error.expected,
    message: `${normalizedPath} expected ${error.expected}`,
    originalError: error,
  };
};

export const isValidationError = (e: BaseApiError): e is ValidationError => e.kind === 'validation';
