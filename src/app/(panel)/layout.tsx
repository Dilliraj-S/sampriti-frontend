"use client";

import { useEffect } from "react";
import { AdminSidebar } from "@/app/components/admin/AdminSidebar";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { RealtimeNotifications } from "@/app/components/admin/RealtimeNotifications";
import { Toaster } from "sonner";
import { useAuthStore } from "@/app/stores/authStore";

/**
 * PanelGuard — real role-based auth guard for the admin panel.
 * 
 * Flow:
 * 1. While silentRefresh is running (isLoading) → show spinner
 * 2. Not authenticated → redirect to /login
 * 3. Authenticated but not admin/superadmin → redirect to / (customer)
 * 4. Authenticated and admin → render panel
 */
function PanelGuard({ children }: { children: React.ReactNode }) {
  const isLoading       = useAuthStore(s => s.isLoading);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user            = useAuthStore(s => s.user);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      window.location.href = "/admin/login";
      return;
    }
    if (!isAdmin) {
      window.location.href = "/";
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  // Show loading spinner while session is being restored
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFAF5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8D0C6] border-t-[#2C2A26]" />
          <p className="text-sm text-[#6C6258] tracking-wide">Loading…</p>
        </div>
      </div>
    );
  }

  // Not authenticated or wrong role — show nothing while redirect fires
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      <RealtimeNotifications />
      <Toaster richColors position="top-right" />
      <AdminSidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <AdminHeader />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <PanelGuard>{children}</PanelGuard>;
}
