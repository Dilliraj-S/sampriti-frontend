"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace("/api/admin", "");

const schema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character."),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: "Passwords do not match.", path: ["confirm"],
});

// ── Inner form — uses useSearchParams(), must be inside Suspense ─────────────
function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get("token") || "";

  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [message,      setMessage]      = useState({ text: "", type: "error" as "error" | "success" });
  const [loading,      setLoading]      = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); setMessage({ text: "", type: "error" });

    if (!token) {
      setMessage({ text: "Reset token is missing. Please use the link from your email.", type: "error" });
      return;
    }

    const result = schema.safeParse({ password, confirm });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(err => { errs[err.path[0] as string] = err.message; });
      setErrors(errs); return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/auth/reset-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!data.status) { setMessage({ text: data.message, type: "error" }); return; }
      setMessage({ text: "Password reset successfully! Redirecting to sign in…", type: "success" });
      setTimeout(() => router.push("/login"), 1500);
    } catch { setMessage({ text: "Network error. Please try again.", type: "error" }); }
    finally   { setLoading(false); }
  };

  if (!token) {
    return (
      <section className="mx-auto flex w-full max-w-md flex-col items-center justify-center px-5 pt-[120px] pb-16 text-center">
        <p className="text-sm text-[#6C6258]">Invalid or missing reset link.</p>
        <Link href="/forgot-password" className="mt-4 text-sm text-[#2C2A26] underline">Request a new one</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col justify-center px-5 pt-[100px] md:pt-[120px] pb-16">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-light tracking-[0.08em]" style={{ fontFamily: "var(--font-heading)" }}>
          Set new password
        </h1>
        <p className="mt-2 text-sm text-[#6C6258]">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-[#6C6258]">New Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"}
              autoComplete="new-password" value={password}
              onChange={e => setPassword(e.target.value)}
              className={`h-12 w-full border px-4 pr-12 text-base outline-none transition-colors focus:border-[#2C2A26] bg-white ${errors.password ? "border-red-400" : "border-[#D8D0C6]"}`}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C6258] hover:text-[#2C2A26]">
              {showPassword ? <EyeOff size={20} strokeWidth={1.7}/> : <Eye size={20} strokeWidth={1.7}/>}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-[#6C6258]">Confirm Password</label>
          <input id="confirm" type={showPassword ? "text" : "password"}
            autoComplete="new-password" value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className={`h-12 w-full border px-4 text-base outline-none transition-colors focus:border-[#2C2A26] bg-white ${errors.confirm ? "border-red-400" : "border-[#D8D0C6]"}`}
          />
          {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
        </div>

        {/* Password strength hint */}
        <ul className="space-y-1 text-xs text-[#8A7766]">
          {[
            [/.{8,}/, "At least 8 characters"],
            [/[A-Z]/, "One uppercase letter"],
            [/[0-9]/, "One number"],
            [/[^A-Za-z0-9]/, "One special character"],
          ].map(([re, label]) => (
            <li key={label as string} className={`flex items-center gap-1.5 ${(re as RegExp).test(password) ? "text-green-700" : ""}`}>
              <span>{(re as RegExp).test(password) ? "✓" : "○"}</span> {label as string}
            </li>
          ))}
        </ul>

        {message.text && (
          <p className="text-sm font-medium" role="alert"
            style={{ color: message.type === "success" ? "#2D6A4F" : "#B91C1C" }}>
            {message.text}
          </p>
        )}

        <button type="submit" disabled={loading}
          className="flex h-12 w-full items-center justify-center bg-[#2C2A26] text-sm font-semibold tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Reset password"}
        </button>

        <div className="text-center">
          <Link href="/login" className="text-sm text-[#6C6258] hover:text-[#2C2A26]">← Back to sign in</Link>
        </div>
      </form>
    </section>
  );
}

// ── Page — Suspense wraps the inner form that uses useSearchParams ────────────
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <section className="mx-auto flex w-full max-w-md flex-col items-center justify-center px-5 pt-[120px] pb-16 text-center">
        <p className="text-sm text-[#6C6258]">Loading…</p>
      </section>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
