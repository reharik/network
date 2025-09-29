// useApiFetch.ts
import { createSmartEnumJSONReviver, Enums } from '@network/contracts';
import { validate as runValidation, type ValidatorKey } from '@network/validators';
import { parseFetchSafe, type ParseResult } from 'parse-fetch';
import { useAuth } from '../contexts/AuthContext';

type JsonInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** which precompiled validator to use for this response */
  validatorKey?: ValidatorKey;
};

/** Curry the key so the shape matches parse-fetch's expected { validate(data) } */
const createTypiaValidator = <T>(key: ValidatorKey) => ({
  validate: (data: unknown): ParseResult<T> => {
    const result = runValidation(key, data); // <-- uses your precompiled registry

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
    const API = (import.meta.env.VITE_API ?? '').replace(/\/+$/, '');
    const url = `${API}${path.startsWith('/') ? '' : '/'}${path}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers as Record<string, string> | undefined),
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, {
      credentials: 'include',
      ...init,
      headers,
      body: init.body ? JSON.stringify(init.body) : undefined,
    });

    if (res.status === 204) return { success: true, data: undefined as T };

    // choose validator if provided; otherwise just parse/return without validation
    const validator = init.validatorKey ? createTypiaValidator<T>(init.validatorKey) : undefined;

    return parseFetchSafe<T>(res, {
      reviver: createSmartEnumJSONReviver({ Enums }),
      ...(validator ? { validator } : {}),
    });
  };

  return { apiFetch };
};

export const useApiFetch = () => {
  const { token } = useAuth();
  return useApiFetchBase(token);
};
