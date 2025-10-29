// useApiFetch.ts
import { enumRegistry, Validator } from '@network/contracts';
import { type ParseResult, withParseSafe } from 'parse-fetch';
import { initializeSmartEnumMappings, reviveAfterTransport } from 'smart-enums';
import { config } from '../config';
import { useAuth } from '../contexts/AuthContext';

// Initialize the global smart enum configuration
initializeSmartEnumMappings({ enumRegistry });

type JsonInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** which precompiled validator to use for this response */
  validator?: Validator;
};

/** Curry the validator so the shape matches parse-fetch's expected { validate(data) } */
const createTypiaValidator = <T>(validator: Validator) => ({
  validate: (data: unknown): ParseResult<T> => {
    const result = validator.validate(data); // <-- uses your precompiled registry

    if (result.success) {
      return { success: true, data: result.data as T };
    }

    // Typia error has { path, expected, value }
    const errors = result.errors.map((e) => `${e.path} expected ${e.expected}`);
    return { success: false, errors };
  },
});

export const useApiFetchBase = (token?: string) => {
  const apiFetch = async <T = unknown>(
    path: string,
    init: JsonInit = {},
  ): Promise<ParseResult<T>> => {
    const parseFetch = withParseSafe(fetch);
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
    const validator = init.validator ? createTypiaValidator<T>(init.validator) : undefined;

    const data = await parseFetch(url, {
      credentials: 'include',
      ...init,
      headers,
      body: init.body ? JSON.stringify(init.body) : undefined,
    }).parse<T>({
      validator,
      reviver: (key, value) => reviveAfterTransport<T>(value),
      ...(validator ? { validator } : {}),
    });
    return data;
  };

  return { apiFetch };
};

export const useApiFetch = () => {
  const { token } = useAuth();
  return useApiFetchBase(token);
};
