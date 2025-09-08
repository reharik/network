import { useAuth } from '../contexts/AuthContext';

type JsonInit = Omit<RequestInit, 'body'> & { body?: unknown };

export const useApiFetchBase = (token?: string) => {
  const apiFetch = async <T = unknown>(path: string, init: JsonInit = {}): Promise<T> => {
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

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `HTTP ${res.status} ${res.statusText}`);
    }

    // handle 204
    if (res.status === 204) return undefined as T;

    return (await res.json()) as T;
  };

  return { apiFetch };
};

export const useApiFetch = () => {
  const { token } = useAuth();
  return useApiFetchBase(token);
};
