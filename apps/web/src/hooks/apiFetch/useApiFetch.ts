// useApiFetch.ts
import { enumRegistry } from '@network/contracts';
import { withSafeParse } from 'parse-fetch';
import { initializeSmartEnumMappings, reviveAfterTransport } from 'smart-enums';
import { config } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import type { ApiResult } from '../../types/ApiResult';
import { JsonInit } from './apiFetchTypes';
import { handleParseResult, validateResponse } from './apiFetchUtilities';

// Initialize the global smart enum configuration
initializeSmartEnumMappings({ enumRegistry });

export const useApiFetchBase = (token?: string) => {
  const apiFetch = async <T = unknown>(
    path: string,
    init: JsonInit = {},
  ): Promise<ApiResult<T>> => {
    const parseFetch = withSafeParse(fetch);

    // Build the API URL
    const API = config.apiBaseUrl.endsWith('/')
      ? config.apiBaseUrl.slice(0, -1)
      : config.apiBaseUrl;
    const url = `${API}${path.startsWith('/') ? '' : '/'}${path}`;

    // Build the headers
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers as Record<string, string> | undefined),
    };

    // Make the API call
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

    let result = handleParseResult<T>(safeParseResult);

    if (result.success && init.validator) {
      result = validateResponse<T>(init.validator, result);
    }

    return result;
  };

  return { apiFetch };
};

export const useApiFetch = () => {
  const { token } = useAuth();
  return useApiFetchBase(token);
};
