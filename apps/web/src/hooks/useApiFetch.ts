// useApiFetch.ts
import { enumRegistry, Validator } from '@network/contracts';
import { type SuccessResult, withSafeParse } from 'parse-fetch';
import { initializeSmartEnumMappings, reviveAfterTransport } from 'smart-enums';
import { config } from '../config';
import { useAuth } from '../contexts/AuthContext';
import type { ApiError, ApiResult } from '../types/ApiResult';
import { createValidationError } from '../types/ApiResult';

// Initialize the global smart enum configuration
initializeSmartEnumMappings({ enumRegistry });

type JsonInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** which precompiled validator to use for this response */
  validator?: Validator;
};

/**
 * Validate a successful safe-parse result with the provided typia validator.
 * If parsing failed, return the original parse failure. If validation fails,
 * map typia errors to a ParseResult failure.
 */
const validateResponse = <T>(validator: Validator, parseResult: SuccessResult<T>): ApiResult<T> => {
  const validation = validator.validate(parseResult.data);
  if (validation.success) {
    return { success: true, data: parseResult.data };
  }

  return {
    success: false,
    errors: validation.errors.map(createValidationError),
  };
};

export const useApiFetchBase = (token?: string) => {
  const apiFetch = async <T = unknown>(
    path: string,
    init: JsonInit = {},
  ): Promise<ApiResult<T>> => {
    const parseFetch = withSafeParse(fetch);
    const API = config.apiBaseUrl.endsWith('/')
      ? config.apiBaseUrl.slice(0, -1)
      : config.apiBaseUrl;
    const url = `${API}${path.startsWith('/') ? '' : '/'}${path}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers as Record<string, string> | undefined),
    };

    if (token) headers.Authorization = `Bearer ${token}`;
    const safeParse = parseFetch(url, {
      credentials: 'include',
      ...init,
      headers,
      body: init.body ? JSON.stringify(init.body) : undefined,
    }).parse<T>({
      reviver: (key, value) => reviveAfterTransport<T>(value),
    });
    const safeParseResult = await safeParse;

    if (!safeParseResult.success) {
      return {
        success: false,
        errors: safeParseResult.errors as ApiError[],
      };
    }

    if (init.validator) {
      return validateResponse<T>(init.validator, safeParseResult);
    }

    return { success: true, data: safeParseResult.data };
  };

  return { apiFetch };
};

export const useApiFetch = () => {
  const { token } = useAuth();
  return useApiFetchBase(token);
};
