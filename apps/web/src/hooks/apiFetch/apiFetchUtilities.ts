import { Validator } from '@network/contracts';
import type { ParseResult, SuccessResult } from 'parse-fetch';
import {
  createValidationError,
  type ApiError,
  type ApiResult,
  type ValidationError,
} from '../../types/ApiResult';
import { ApiErrorResponse, TypiaValidationError } from './apiFetchTypes';

/**
 * Check if the response data is an API error response
 * Only returns true if the response has actual error content
 */
export const isApiErrorResponse = (data: unknown): data is ApiErrorResponse => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  // Check for non-empty issues array or truthy error message
  const hasIssues = Array.isArray(obj.issues) && obj.issues.length > 0;
  const hasError = typeof obj.error === 'string' && obj.error.length > 0;
  return hasIssues || hasError;
};

/**
 * Transform API validation errors (typia format) to frontend ValidationError format
 * API returns paths like "$input.firstName", we need just "firstName"
 */
export const transformApiErrors = (issues: TypiaValidationError[]): ValidationError[] => {
  return issues.map((issue) => ({
    kind: 'validation' as const,
    source: 'typia' as const,
    // Strip "$input." prefix from path
    path: issue.path.replace(/^\$input\./, ''),
    expected: issue.expected,
    message: `${issue.path.replace(/^\$input\./, '')} expected ${issue.expected}`,
    originalError: issue,
  }));
};

/**
 * Validate a successful safe-parse result with the provided typia validator.
 * If parsing failed, return the original parse failure. If validation fails,
 * map typia errors to a ParseResult failure.
 */
export const validateResponse = <T>(
  validator: Validator,
  parseResult: SuccessResult<T>,
): ApiResult<T> => {
  const validation = validator.validate(parseResult.data);
  if (validation.success) {
    return { success: true, data: parseResult.data };
  }

  return {
    success: false,
    errors: validation.errors.map(createValidationError),
  };
};

export const handleParseResult = <T>(safeParseResult: ParseResult<T>): ApiResult<T> => {
  if (!safeParseResult.success) {
    return {
      success: false,
      errors: safeParseResult.errors as ApiError[],
    };
  }

  // Check if the response is an API error (e.g., validation errors)
  if (isApiErrorResponse(safeParseResult.data)) {
    const errorData = safeParseResult.data;
    if (errorData.issues && errorData.issues.length > 0) {
      return {
        success: false,
        errors: transformApiErrors(errorData.issues),
      };
    }
    // Generic error without specific issues
    if (errorData.error) {
      return {
        success: false,
        errors: [
          {
            kind: 'parse' as const,
            message: errorData.error,
          },
        ],
      };
    }
  }
  return safeParseResult;
};
