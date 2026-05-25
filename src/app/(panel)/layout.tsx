"use client";

import { AdminSidebar } from "@/app/components/admin/AdminSidebar";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
function PanelGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // For now, assume admin role and bypass strict checks
  // since the AuthContext has been removed in the transition.
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-cream">
        <Toaster richColors position="top-right" />
        <AdminSidebar />
        <div className="lg:ml-64 transition-all duration-300">
          <AdminHeader />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    );
  }

  // Default: show with admin sidebar for any other case
  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <AdminHeader />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}



export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelGuard>{children}</PanelGuard>
  );
}
