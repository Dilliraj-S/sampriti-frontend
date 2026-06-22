"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "@/app/stores/authStore";

const schema = z.object({
  email:    z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export default function AdminLoginPage() {
  const login = useAuthStore(s => s.login);

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = schema.safeParse({ email: email.trim().toLowerCase(), password });
    if (!result.success) { setError(result.error.issues[0].message); return; }
    setLoading(true);
    try {
      const { redirectTo } = await login(email.trim().toLowerCase(), password);
      window.location.href = redirectTo || "/admin/dashboard";
    } catch (err: unknown) {
      const e = err as Error & { code?: string };
      if (e.code === "EMAIL_NOT_VERIFIED") {
        window.location.href = `/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`;
      } else {
        setError(e.message || "Invalid credentials.");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFAF5] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-[#2C2A26]">Sanctum Panel</h1>
          <p className="mt-1.5 text-sm text-[#6C6258]">Sign in to your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-[#6C6258]">Email</label>
            <input id="email" type="email" autoComplete="email" value={email}
              onChange={e => setEmail(e.target.value)}
              className={`h-11 w-full border px-3.5 text-sm outline-none transition-colors focus:border-[#2C2A26] bg-white ${error ? "border-red-400" : "border-[#D8D0C6]"}`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-[#6C6258]">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"}
                autoComplete="current-password" value={password}
                onChange={e => setPassword(e.target.value)}
                className={`h-11 w-full border px-3.5 pr-11 text-sm outline-none transition-colors focus:border-[#2C2A26] bg-white ${error ? "border-red-400" : "border-[#D8D0C6]"}`}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6C6258] hover:text-[#2C2A26]">
                {showPassword ? <EyeOff size={18} strokeWidth={1.7}/> : <Eye size={18} strokeWidth={1.7}/>}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600" role="alert">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="flex h-11 w-full items-center justify-center bg-[#2C2A26] text-sm font-semibold tracking-[0.06em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
