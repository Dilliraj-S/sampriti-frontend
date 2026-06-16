"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const OTP_LENGTH = 6;

// ── Inner form — uses useSearchParams(), must be inside Suspense ─────────────
function VerifyEmailForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const email        = searchParams.get("email") || "";

  const [otp,     setOtp]     = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [message, setMessage] = useState({ text: "", type: "error" as "error" | "success" });
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...otp];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) { setMessage({ text: "Please enter the full 6-digit code.", type: "error" }); return; }
    if (!email) { setMessage({ text: "Email is missing. Please go back and register again.", type: "error" }); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/auth/verify-email`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!data.status) { setMessage({ text: data.message, type: "error" }); return; }
      setMessage({ text: "Email verified! Redirecting to sign in…", type: "success" });
      setTimeout(() => router.push("/login"), 1200);
    } catch { setMessage({ text: "Network error. Please try again.", type: "error" }); }
    finally   { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    try {
      await fetch(`${BASE}/api/auth/resend-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      setMessage({ text: "A new code has been sent to your email.", type: "success" });
      setResendCooldown(60);
    } catch { setMessage({ text: "Failed to resend. Please try again.", type: "error" }); }
  };

  return (
    <section className="mx-auto flex w-full max-w-md flex-col justify-center px-5 pt-[100px] md:pt-[120px] pb-16">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-[#D8D0C6] bg-[#F6F1E8]">
          <svg className="h-8 w-8 text-[#6C6258]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-light tracking-[0.08em]" style={{ fontFamily: "var(--font-heading)" }}>
          Verify your email
        </h1>
        {email && (
          <p className="mt-2 text-sm text-[#6C6258]">
            We sent a 6-digit code to <span className="font-medium text-[#2C2A26]">{email}</span>
          </p>
        )}
        <p className="mt-1 text-xs text-[#8A7766]">The code expires in 10 minutes.</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        {/* OTP input boxes */}
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="h-14 w-12 border border-[#D8D0C6] bg-white text-center text-xl font-semibold text-[#2C2A26] outline-none transition-colors focus:border-[#2C2A26]"
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        {message.text && (
          <p className="text-center text-sm font-medium" role="alert"
            style={{ color: message.type === "success" ? "#2D6A4F" : "#B91C1C" }}>
            {message.text}
          </p>
        )}

        <button type="submit" disabled={loading}
          className="flex h-12 w-full items-center justify-center bg-[#2C2A26] text-sm font-semibold tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Verify Email"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-[#6C6258]">
        Didn&apos;t receive the code?{" "}
        <button onClick={handleResend} disabled={resendCooldown > 0}
          className="font-medium text-[#2C2A26] underline underline-offset-2 disabled:opacity-50"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
        </button>
      </div>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-[#6C6258] hover:text-[#2C2A26]">
          ← Back to sign in
        </Link>
      </div>
    </section>
  );
}

// ── Page — Suspense wraps the inner form that uses useSearchParams ────────────
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <section className="mx-auto flex w-full max-w-md flex-col items-center justify-center px-5 pt-[120px] pb-16 text-center">
        <p className="text-sm text-[#6C6258]">Loading…</p>
      </section>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
