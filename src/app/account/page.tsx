"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, User, LogOut, Mail, Phone, ShieldCheck } from "lucide-react";
import Navbar from "@/app/components/landing/Navbar";
import { useAuthStore } from "@/app/stores/authStore";

export default function AccountPage() {
  const router          = useRouter();
  const user            = useAuthStore(s => s.user);
  const isLoading       = useAuthStore(s => s.isLoading);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const storeLogout     = useAuthStore(s => s.logout);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await storeLogout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FDFAF5]" style={{ fontFamily: "var(--font-sans)" }}>
        <Navbar forceScrolled />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8D0C6] border-t-[#2C2A26]" />
        </div>
      </main>
    );
  }

  if (!user) return null;

  const initials = user.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <main className="min-h-screen bg-[#FDFAF5] text-[#2C2A26]" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled />

      <section className="mx-auto max-w-2xl px-5 pt-[100px] md:pt-[120px] pb-16">
        {/* Profile header */}
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8E0D5] text-xl font-semibold text-[#2C2A26]">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-light tracking-[0.06em]" style={{ fontFamily: "var(--font-heading)" }}>
              {user.full_name}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-[#6C6258]">
                <ShieldCheck size={12} />
                {user.role === "admin" || user.role === "superadmin" ? "Admin Account" : "Customer Account"}
              </span>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="mb-6 space-y-px border border-[#D8D0C6] bg-white">
          <div className="flex items-center gap-4 px-5 py-4 border-b border-[#E6E1D6]">
            <Mail size={16} className="text-[#8A7766] shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8A7766]">Email</p>
              <p className="text-sm text-[#2C2A26]">{user.email}</p>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center gap-4 px-5 py-4 border-b border-[#E6E1D6]">
              <Phone size={16} className="text-[#8A7766] shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#8A7766]">Phone</p>
                <p className="text-sm text-[#2C2A26]">{user.phone}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 px-5 py-4">
            <User size={16} className="text-[#8A7766] shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8A7766]">Full Name</p>
              <p className="text-sm text-[#2C2A26]">{user.full_name}</p>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="mb-6 border border-[#D8D0C6] bg-white">
          <Link href="/account/orders"
            className="flex items-center justify-between px-5 py-4 border-b border-[#E6E1D6] text-sm text-[#5A554E] hover:text-[#2C2A26] hover:bg-[#F9F6F1] transition-colors"
          >
            <span className="flex items-center gap-3"><Package size={16} /> My Orders</span>
            <span className="text-[#A48662]">→</span>
          </Link>
          <Link href="/shop"
            className="flex items-center justify-between px-5 py-4 text-sm text-[#5A554E] hover:text-[#2C2A26] hover:bg-[#F9F6F1] transition-colors"
          >
            <span className="flex items-center gap-3"><Package size={16} /> Continue Shopping</span>
            <span className="text-[#A48662]">→</span>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 border border-[#D8D0C6] bg-white py-3 text-sm text-[#5A554E] transition-colors hover:border-[#2C2A26] hover:text-[#2C2A26]"
        >
          <LogOut size={16} /> Log out
        </button>

        <p className="mt-4 text-center text-xs text-[#8A7766]">
          Member since {new Date(user.created_at || Date.now()).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </section>
    </main>
  );
}
