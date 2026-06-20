'use client';

import { create } from 'zustand';
import { initApiClient, apiPost, apiGet } from '@/lib/apiClient';

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin' | 'superadmin';
  avatar_url?: string;
  created_at?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<{ redirectTo: string }>;
  logout: () => Promise<void>;
  silentRefresh: () => Promise<void>;
  setUser: (user: AuthUser | null, token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Wire the API client to read/write the store's accessToken
  initApiClient(
    () => get().accessToken,
    (token) => set({ accessToken: token, isAuthenticated: !!token }),
    () => get().refreshToken,
    (token) => set({ refreshToken: token }),
  );

  return {
    user:            null,
    accessToken:     null,
    refreshToken:    null,
    isLoading:       true,
    isAuthenticated: false,

    setUser: (user, token) =>
      set({ user, accessToken: token, isAuthenticated: !!token, isLoading: false }),

    login: async (email, password) => {
      const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${BASE}/api/auth/login`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.status) throw Object.assign(new Error(data.message), { code: data.code });
      set({
        user:            data.user,
        accessToken:     data.accessToken,
        refreshToken:    data.refreshToken,
        isAuthenticated: true,
        isLoading:       false,
      });
      return { redirectTo: data.redirectTo || '/' };
    },

    logout: async () => {
      try {
        await apiPost('/api/auth/logout', {});
      } catch {}
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false });
    },

    /**
     * Called on app mount. Uses the HttpOnly refresh token cookie to silently
     * restore the session — no credentials stored in localStorage/sessionStorage.
     */
    silentRefresh: async () => {
      set({ isLoading: true });
      try {
        const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const existingRefreshToken = get().refreshToken;
        const res = await fetch(`${BASE}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: existingRefreshToken ? JSON.stringify({ refreshToken: existingRefreshToken }) : undefined,
        });
        if (!res.ok) { set({ isLoading: false }); return; }
        const refreshData = await res.json();
        if (!refreshData.accessToken) { set({ isLoading: false }); return; }

        // Fetch user profile with the new token
        const meRes = await fetch(`${BASE}/api/auth/me`, {
          credentials: 'include',
          headers: { Authorization: `Bearer ${refreshData.accessToken}` },
        });
        const meData = await meRes.json();
        if (meData.status) {
          set({
            user:            meData.data,
            accessToken:     refreshData.accessToken,
            refreshToken:    refreshData.refreshToken,
            isAuthenticated: true,
            isLoading:       false,
          });
        } else {
          set({ isLoading: false });
        }
      } catch {
        set({ isLoading: false });
      }
    },
  };
});
