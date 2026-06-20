'use client';

import { create } from 'zustand';
import { initApiClient, apiPost, apiGet } from '@/lib/apiClient';
import { useCartStore } from '@/app/components/landing/cartStore';

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

function writeCartAccount(email: string | null) {
  if (typeof window === 'undefined') return;
  if (email) {
    const payload = JSON.stringify({ email });
    window.localStorage.setItem('sampriti-session', payload);
    window.localStorage.setItem('sampriti-account', payload);
  } else {
    window.localStorage.removeItem('sampriti-session');
    window.localStorage.removeItem('sampriti-account');
  }
}

function migrateGuestCart(email: string) {
  try {
    const { cartsByAccount, primaryItemIdByAccount } = useCartStore.getState();

    const guestItems = cartsByAccount['_guest'];
    if (!guestItems?.length) return;

    const userItems = cartsByAccount[email] || [];
    const existingIds = new Set(userItems.map((i: any) => i.id));
    const newItems = guestItems.filter((i: any) => !existingIds.has(i.id));

    const nextCart = { ...cartsByAccount, [email]: [...newItems, ...userItems] };
    delete nextCart['_guest'];

    const nextPrimary = { ...primaryItemIdByAccount };
    if (!nextPrimary[email] && nextPrimary['_guest']) {
      nextPrimary[email] = nextPrimary['_guest'];
    }
    delete nextPrimary['_guest'];

    useCartStore.setState({
      cartsByAccount: nextCart,
      primaryItemIdByAccount: nextPrimary,
      items: nextCart[email] ?? [],
      primaryItemId: nextPrimary[email] ?? null,
      activeAccountEmail: email,
    });
  } catch {}
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Wire the API client to read/write the store's accessToken
  initApiClient(
    () => get().accessToken,
    (token) => set({ accessToken: token }),
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
      const userEmail = data.user?.email || null;
      writeCartAccount(userEmail);
      if (userEmail) migrateGuestCart(userEmail);
      return { redirectTo: data.redirectTo || '/' };
    },

    logout: async () => {
      try {
        await apiPost('/api/auth/logout', {});
      } catch {}
      writeCartAccount(null);
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
          writeCartAccount(meData.data?.email || null);
        } else {
          set({ isLoading: false });
        }
      } catch {
        set({ isLoading: false });
      }
    },
  };
});
