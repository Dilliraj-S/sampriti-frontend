"use client";

import { ChevronDown, LogOut, User, Settings, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NotificationPanel } from "./NotificationPanel";

export function AdminHeader() {
  const router = useRouter();
  
  // Mocked user for Sampriti Botanicals until AuthContext is integrated
  const user = {
    first_name: "Admin",
    email: "admin@sampritibotanicals.com",
    roles: [{ role_id: "1", role_name: "ADMIN" }]
  };
  const activeRole = "1";
  const switchRole = (id: string) => {};
  const logout = () => router.push("/login");
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const displayName = user?.first_name || user?.email?.split("@")[0] || "User";
  const currentRoleName = user?.roles.find((r) => r.role_id === activeRole)?.role_name || "Admin";

  const getBackendOrigin = () => {
    const envBase = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (envBase) return envBase.replace(/\/api\/?$/, "").replace(/\/$/, "");
    if (typeof window !== "undefined") return `${window.location.protocol}//${window.location.host}`;
    return "";
  };

  const resolveProfileImage = (path?: string, cacheBuster?: string) => {
    if (!path) return "";
    if (/^(https?:|data:|blob:)/i.test(path)) return path;

    const trimmedPath = path.trim();
    const apiPath = `/api/profile/image/${trimmedPath}`;
    const backendOrigin = getBackendOrigin();
    const url = backendOrigin ? `${backendOrigin}${apiPath}` : apiPath;
    const cacheBustParam = cacheBuster || Date.now();
    return `${url}?v=${cacheBustParam}`;
  };

  const profileImage = resolveProfileImage((user as any)?.avatar || (user as any)?.profile, Date.now().toString());

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setImgError(false);
  }, [profileImage]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Page breadcrumb area */}
      <div className="flex items-center pl-8 lg:pl-0">
        <h1 className="text-base font-heading text-gray-900 tracking-tight">
          Sanctum Panel
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
          <ShieldCheck size={14} className="text-gray-700" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Sampriti Botanicals</span>
        </div>

        {/* Role switcher (only if multiple roles) */}
        {user && user.roles.length > 1 && (
          <div ref={roleRef} className="relative">
            <button
              onClick={() => setRoleOpen(!roleOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/20 text-sm font-semibold text-deep-green hover:bg-gold/20 transition-colors"
            >
              {currentRoleName}
              <ChevronDown size={14} className={`transition-transform ${roleOpen ? "rotate-180" : ""}`} />
            </button>
            {roleOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                {user.roles.map((role) => (
                  <button
                    key={role.role_id}
                    onClick={() => {
                      switchRole(role.role_id);
                      setRoleOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${role.role_id === activeRole
                      ? "bg-fresh-green/10 text-fresh-green font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {role.role_name}
                    {role.role_id === activeRole && (
                      <span className="ml-2 text-xs text-fresh-green">●</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        <NotificationPanel />

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 text-xs font-bold">
              {profileImage && !imgError ? (
                <img
                  src={profileImage}
                  alt={displayName}
                  onError={() => setImgError(true)}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                displayName[0]?.toUpperCase()
              )}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-900">{displayName}</span>
            <ChevronDown size={14} className="hidden sm:block text-gray-500" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/admin/profile");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2"
              >
                <User size={16} /> Profile
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/admin/settings");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2"
              >
                <Settings size={16} /> Settings
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={logout}
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
