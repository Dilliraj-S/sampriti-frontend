/**
 * Lightweight fetch-based API client for Sampriti frontend.
 * - Attaches Authorization header from Zustand auth store
 * - Silently refreshes access token on 401 TOKEN_EXPIRED
 * - withCredentials equivalent via `credentials: 'include'` (sends HttpOnly cookie)
 */

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api/admin', '');

let getAccessToken: (() => string | null) | null = null;
let setAccessToken: ((t: string | null) => void) | null = null;
let getRefreshToken: (() => string | null) | null = null;
let setRefreshToken: ((t: string | null) => void) | null = null;

export function initApiClient(
  getter: () => string | null,
  setter: (t: string | null) => void,
  refreshGetter?: () => string | null,
  refreshSetter?: (t: string | null) => void,
) {
  getAccessToken = getter;
  setAccessToken = setter;
  getRefreshToken = refreshGetter || null;
  setRefreshToken = refreshSetter || null;
}

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  refreshQueue.forEach(resolve => resolve(token));
  refreshQueue = [];
};

async function silentRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken?.() || undefined;
  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.refreshToken) setRefreshToken?.(data.refreshToken);
  return data.accessToken ?? null;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken?.();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  // Silent refresh on TOKEN_EXPIRED
  if (res.status === 401) {
    const body = await res.clone().json().catch(() => ({}));
    if (body.code === 'TOKEN_EXPIRED') {
      if (isRefreshing) {
        // Queue concurrent requests while refresh in-flight
        return new Promise((resolve, reject) => {
          refreshQueue.push(async (newToken) => {
            if (!newToken) { reject(new Error('Session expired')); return; }
            const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
            const retryRes = await fetch(`${BASE_URL}${path}`, {
              ...options,
              credentials: 'include',
              headers: retryHeaders,
            });
            resolve(retryRes.json() as T);
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await silentRefresh();
        setAccessToken?.(newToken);
        processQueue(newToken);

        if (!newToken) throw new Error('Session expired. Please sign in again.');

        const retryRes = await fetch(`${BASE_URL}${path}`, {
          ...options,
          credentials: 'include',
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        });
        return retryRes.json() as T;
      } finally {
        isRefreshing = false;
      }
    }
  }

  return res.json() as T;
}

// Convenience wrappers
export const apiGet  = <T>(path: string) => apiFetch<T>(path, { method: 'GET' });
export const apiPost = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) });
export const apiPut  = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) });
export const apiDel  = <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' });
