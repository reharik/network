import { createSmartEnumJSONReviver, Enums } from '@network/contracts';
import { parseFetchSafe, ParseResult } from 'parse-fetch';
import typia from 'typia';
import { useAuth } from '../contexts/AuthContext';

// Create a typia safe validator that returns ParseResult<T>
const createTypiaSafeValidator = <T>() => ({
  validate: (data: unknown): ParseResult<T> => {
    const validation = typia.validate<T>(data);
    if (validation.success) {
      return {
        success: true,
        data: validation.data,
      };
    }
    // Convert validation errors to string array
    const errorMessages = validation.errors.map((error) => error.path);
    return {
      success: false,
      errors: errorMessages,
    };
  },
});

type JsonInit = Omit<RequestInit, 'body'> & { body?: unknown };

export const useApiFetchBase = (token?: string) => {
  const apiFetch = async <T = unknown>(
    path: string,
    init: JsonInit = {},
  ): Promise<ParseResult<T>> => {
    const API = import.meta.env.VITE_API?.replace(/\/+$/, '') ?? '';
    const url = `${API}${path.startsWith('/') ? '' : '/'}${path}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers as Record<string, string> | undefined),
    };

    // Add authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(url, {
      credentials: 'include',
      ...init,
      headers,
      body: init.body ? JSON.stringify(init.body) : undefined,
    });

    // handle 204
    if (res.status === 204) return { success: true, data: undefined as T };

    // Use parseFetchSafe with typia safe validator and smart enum reviver
    return parseFetchSafe<T>(res, {
      reviver: createSmartEnumJSONReviver({ Enums }),
      validator: createTypiaSafeValidator<T>(),
    });
  };

  return { apiFetch };
};

export const useApiFetch = () => {
  const { token } = useAuth();
  return useApiFetchBase(token);
};
