"use client";

import { ChevronDown, LogOut, User, Settings, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NotificationPanel } from "./NotificationPanel";
import { useAuthStore } from "@/app/stores/authStore";

export function AdminHeader() {
  const router      = useRouter();
  const authUser    = useAuthStore(s => s.user);
  const storeLogout = useAuthStore(s => s.logout);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = authUser?.full_name || authUser?.email?.split("@")[0] || "Admin";

  const handleLogout = async () => {
    setProfileOpen(false);
    await storeLogout();
    router.push("/login");
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Panel label */}
      <div className="flex items-center pl-8 lg:pl-0">
        <h1 className="text-base font-heading text-gray-900 tracking-tight">Sanctum Panel</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Brand badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
          <ShieldCheck size={14} className="text-gray-700" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Sampriti Botanicals</span>
        </div>

        {/* Notifications */}
        <NotificationPanel />

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#E8E0D5] border border-gray-200 flex items-center justify-center text-[#2C2A26] text-xs font-bold">
              {displayName[0]?.toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-900">{displayName}</span>
            <ChevronDown size={14} className={`hidden sm:block text-gray-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">{authUser?.email}</p>
                {authUser?.role && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-[#F6F1E8] text-[#7A5C3A] rounded">
                    {authUser.role}
                  </span>
                )}
              </div>
              <button
                onClick={() => { setProfileOpen(false); router.push("/admin/profile"); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2"
              >
                <User size={16} /> Profile
              </button>
              <button
                onClick={() => { setProfileOpen(false); router.push("/admin/settings"); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2"
              >
                <Settings size={16} /> Settings
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
