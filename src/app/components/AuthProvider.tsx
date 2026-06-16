'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/app/stores/authStore';

/**
 * Mounts once at the app root and silently restores the session
 * by calling /api/auth/refresh using the HttpOnly cookie.
 * No user interaction needed — transparent session persistence.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const silentRefresh = useAuthStore(s => s.silentRefresh);

  useEffect(() => {
    silentRefresh();
  }, [silentRefresh]);

  return <>{children}</>;
}
