"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "@/app/stores/authStore";

// ── Schemas ────────────────────────────────────────────────────────────────────
const signInSchema = z.object({
  email:    z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const signUpSchema = z.object({
  full_name: z.string().min(1, "Full name is required.").max(150),
  email:     z.string().email("Enter a valid email address."),
  password:  z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character."),
});

type Mode   = "signin" | "signup";
type Fields = Record<string, string>;

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function GoogleMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const login    = useAuthStore(s => s.login);
  const redirectTo = searchParams.get("redirect") || "";

  const [mode,         setMode]         = useState<Mode>("signin");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [fullName,     setFullName]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors,       setErrors]       = useState<Fields>({});
  const [message,      setMessage]      = useState<{ text: string; type: "error" | "success" | "warning" }>({ text: "", type: "error" });
  const [loading,      setLoading]      = useState(false);

  const clearState = () => { setErrors({}); setMessage({ text: "", type: "error" }); };
  const switchMode = (m: Mode) => { setMode(m); clearState(); };

  // ── Sign In ──────────────────────────────────────────────────────────────────
  const handleSignIn = async () => {
    const result = signInSchema.safeParse({ email: email.trim().toLowerCase(), password });
    if (!result.success) {
      const errs: Fields = {};
      result.error.issues.forEach(e => { errs[e.path[0] as string] = e.message; });
      setErrors(errs); return;
    }
    setLoading(true);
    try {
      const { redirectTo: roleRedirect } = await login(email.trim().toLowerCase(), password);
      setMessage({ text: "Signed in successfully. Redirecting…", type: "success" });
      const target = redirectTo || roleRedirect || "/";
      setTimeout(() => { window.location.href = target; }, 500);
    } catch (err: unknown) {
      const e = err as Error & { code?: string };
      if (e.code === "EMAIL_NOT_VERIFIED") {
        setMessage({ text: e.message, type: "warning" });
        setTimeout(() => { window.location.href = `/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`; }, 1200);
      } else {
        setMessage({ text: e.message || "Something went wrong.", type: "error" });
      }
    } finally { setLoading(false); }
  };

  // ── Sign Up ──────────────────────────────────────────────────────────────────
  const handleSignUp = async () => {
    const result = signUpSchema.safeParse({
      full_name: fullName.trim(), email: email.trim().toLowerCase(), password,
    });
    if (!result.success) {
      const errs: Fields = {};
      result.error.issues.forEach(e => { errs[e.path[0] as string] = e.message; });
      setErrors(errs); return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ full_name: fullName.trim(), email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!data.status) { setMessage({ text: data.message, type: "error" }); return; }
      setMessage({ text: "Account created! Check your email for the 6-digit OTP.", type: "success" });
      setTimeout(() => { window.location.href = `/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`; }, 1000);
    } catch { setMessage({ text: "Network error. Please try again.", type: "error" }); }
    finally   { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    if (mode === "signin") await handleSignIn();
    else await handleSignUp();
  };

  const msgColor = message.type === "success" ? "#2D6A4F" : message.type === "warning" ? "#7A4F34" : "#B91C1C";

  return (
    <section className="mx-auto flex w-full max-w-md flex-col justify-center px-5 pt-[150px] md:pt-[120px] pb-16">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-light tracking-[0.08em]" style={{ fontFamily: "var(--font-heading)" }}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
      </div>

      {/* Mode toggle */}
      <div className="mb-5 grid grid-cols-2 gap-2 border border-[#D8D0C6] bg-white">
        {(["signin", "signup"] as Mode[]).map(m => (
          <button key={m} type="button" onClick={() => switchMode(m)}
            className={`h-12 text-sm font-semibold tracking-[0.05em] transition-colors ${mode === m ? "bg-[#2C2A26] text-white" : "text-[#6C6258] hover:bg-[#F6F1E8]"}`}
          >
            {m === "signin" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {mode === "signup" && (
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-[#6C6258]">Full Name</label>
            <input id="full_name" type="text" autoComplete="name" value={fullName}
              onChange={e => setFullName(e.target.value)}
              className={`h-12 w-full border px-4 text-base outline-none transition-colors focus:border-[#2C2A26] bg-white ${errors.full_name ? "border-red-400" : "border-[#D8D0C6]"}`}
            />
            {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name}</p>}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-[#6C6258]">Email</label>
          <input id="email" type="email" autoComplete="email" value={email}
            onChange={e => setEmail(e.target.value)}
            className={`h-12 w-full border px-4 text-base outline-none transition-colors focus:border-[#2C2A26] bg-white ${errors.email ? "border-red-400" : "border-[#D8D0C6]"}`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-[#6C6258]">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"} value={password}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              onChange={e => setPassword(e.target.value)}
              className={`h-12 w-full border px-4 pr-12 text-base outline-none transition-colors focus:border-[#2C2A26] bg-white ${errors.password ? "border-red-400" : "border-[#D8D0C6]"}`}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C6258] hover:text-[#2C2A26]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} strokeWidth={1.7}/> : <Eye size={20} strokeWidth={1.7}/>}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        {mode === "signin" && (
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-[#6C6258] hover:text-[#2C2A26] underline underline-offset-2">
              Forgot password?
            </Link>
          </div>
        )}

        {message.text && (
          <p className="text-sm font-medium" role="alert" style={{ color: msgColor }}>
            {message.text}
          </p>
        )}

        <button type="submit" disabled={loading}
          className="mt-1 flex h-12 w-full items-center justify-center bg-[#2C2A26] text-sm font-semibold tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#D8D0C6]" />
        <span className="text-xs uppercase tracking-[0.18em] text-[#8A7766]">or</span>
        <span className="h-px flex-1 bg-[#D8D0C6]" />
      </div>

      <button type="button"
        className="flex h-12 w-full items-center justify-center gap-3 border border-[#D8D0C6] bg-white text-sm font-semibold text-[#2C2A26] transition-colors hover:border-[#2C2A26]"
        onClick={() => setMessage({ text: "Google sign-in coming soon.", type: "warning" })}
      >
        <GoogleMark /> Continue with Google
      </button>

      <div className="mt-5 flex items-center justify-between text-sm text-[#6C6258]">
        <Link href="/shop" className="hover:text-[#2C2A26]">Continue shopping</Link>
        <Link href="/contact" className="hover:text-[#2C2A26]">Need help?</Link>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <section className="mx-auto flex w-full max-w-md flex-col justify-center px-5 pt-[150px] md:pt-[120px] pb-16">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.08em]" style={{ fontFamily: "var(--font-heading)" }}>
            Sign in
          </h1>
        </div>
      </section>
    }>
      <LoginContent />
    </Suspense>
  );
}
