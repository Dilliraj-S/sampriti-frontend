"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";

const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace("/api/admin", "");
const emailSchema = z.string().email("Enter a valid email address.");

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [error,   setError]   = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMessage("");
    const result = emailSchema.safeParse(email.trim().toLowerCase());
    if (!result.success) { setError(result.error.issues[0].message); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/auth/forgot-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      // Always show success — backend never reveals if email exists
      setMessage(data.message || "If an account exists, a reset link has been sent.");
    } catch { setError("Network error. Please try again."); }
    finally   { setLoading(false); }
  };

  return (
    <section className="mx-auto flex w-full max-w-md flex-col justify-center px-5 pt-[100px] md:pt-[120px] pb-16">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-light tracking-[0.08em]" style={{ fontFamily: "var(--font-heading)" }}>
          Reset password
        </h1>
        <p className="mt-2 text-sm text-[#6C6258]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {message ? (
        <div className="space-y-4 text-center">
          <div className="border border-[#D8D0C6] bg-[#F6F1E8] p-5">
            <svg className="mx-auto mb-3 h-10 w-10 text-[#6C6258]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <p className="text-sm text-[#2C2A26]">{message}</p>
            <p className="mt-2 text-xs text-[#8A7766]">Check your inbox and spam folder.</p>
          </div>
          <Link href="/login" className="block text-sm text-[#6C6258] hover:text-[#2C2A26]">
            ← Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-[#6C6258]">Email</label>
            <input id="email" type="email" autoComplete="email" value={email}
              onChange={e => setEmail(e.target.value)}
              className={`h-12 w-full border px-4 text-base outline-none transition-colors focus:border-[#2C2A26] bg-white ${error ? "border-red-400" : "border-[#D8D0C6]"}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="flex h-12 w-full items-center justify-center bg-[#2C2A26] text-sm font-semibold tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-sm text-[#6C6258] hover:text-[#2C2A26]">
              ← Back to sign in
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}
