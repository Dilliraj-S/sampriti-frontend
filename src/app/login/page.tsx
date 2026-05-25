"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/app/components/landing/Navbar";

type Mode = "signin" | "signup";

type Account = {
  name: string;
  email: string;
  password: string;
};

const accountKey = "sampriti-account";
const sessionKey = "sampriti-session";
const rememberedEmailKey = "sampriti-remembered-email";
const legacyGoogleEmail = "google.customer@sampriti.local";

function GoogleMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(rememberedEmailKey) || "";
  });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(rememberedEmailKey));
  });
  const [showPassword, setShowPassword] = useState(false);

  const finishLogin = (account: Account, successMessage: string) => {
    if (account.email === legacyGoogleEmail) {
      setMessage("Please enter your real email before continuing.");
      return;
    }

    window.localStorage.setItem(accountKey, JSON.stringify(account));
    window.localStorage.setItem(sessionKey, JSON.stringify({ email: account.email }));
    if (rememberMe) {
      window.localStorage.setItem(rememberedEmailKey, account.email);
    } else {
      window.localStorage.removeItem(rememberedEmailKey);
    }
    window.dispatchEvent(new Event("sampriti-account-change"));
    setMessage(successMessage);
    setTimeout(() => router.push("/"), 700);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!normalizedEmail || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup") {
      if (!trimmedName) {
        setMessage("Please enter your name.");
        return;
      }

      const account: Account = {
        name: trimmedName,
        email: normalizedEmail,
        password,
      };

      finishLogin(account, "Account created. Taking you home...");
      return;
    }

    const savedAccount = window.localStorage.getItem(accountKey);
    if (!savedAccount) {
      setMessage("No account found for this email. Please use Sign up to create one.");
      return;
    }

    const account = JSON.parse(savedAccount) as Account;
    if (account.email !== normalizedEmail || account.password !== password) {
      setMessage("Email or password is incorrect.");
      return;
    }

    finishLogin(account, "Signed in. Taking you home...");
  };

  const handleGoogleLogin = () => {
    setMessage("");
    const typedEmail = email.trim().toLowerCase();

    if (!typedEmail || !typedEmail.includes("@")) {
      setMessage("Please enter your Google email first.");
      return;
    }

    if (typedEmail === legacyGoogleEmail) {
      setMessage("Please enter your real email before continuing.");
      return;
    }

    const account: Account = {
      name: name.trim() || typedEmail.split("@")[0],
      email: typedEmail,
      password: "google-auth",
    };

    finishLogin(account, "Signed in with Google. Taking you home...");
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#2C2A26]" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled />

      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 pt-[140px] md:pt-[170px]">
        <div className="mb-7 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#8A7766]">
            Account
          </p>
          <h1 className="text-3xl font-light tracking-[0.08em]" style={{ fontFamily: "var(--font-serif)" }}>
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
        </div>

        <div className="mb-6 grid grid-cols-2 border border-[#D8D0C6] bg-white">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setMessage("");
            }}
            className={`h-12 text-sm font-semibold ${mode === "signin" ? "bg-[#2C2A26] text-white" : "text-[#6C6258]"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setMessage("");
            }}
            className={`h-12 text-sm font-semibold ${mode === "signup" ? "bg-[#2C2A26] text-white" : "text-[#6C6258]"}`}
          >
            Sign up
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#6C6258]">
                Name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                autoComplete="name"
                className="h-12 w-full border border-[#D8D0C6] bg-white px-4 text-base outline-none transition-colors focus:border-[#2C2A26]"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#6C6258]">
              Email
            </span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              className="h-12 w-full border border-[#D8D0C6] bg-white px-4 text-base outline-none transition-colors focus:border-[#2C2A26]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#6C6258]">
              Password
            </span>
            <div className="relative">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="h-12 w-full border border-[#D8D0C6] bg-white px-4 pr-20 text-base outline-none transition-colors focus:border-[#2C2A26]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-[#6C6258] transition-colors hover:text-[#2C2A26]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} strokeWidth={1.7} /> : <Eye size={20} strokeWidth={1.7} />}
              </button>
            </div>
          </label>

          <label className="flex items-center gap-3 text-sm text-[#6C6258]">
            <input
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              type="checkbox"
              className="h-4 w-4 accent-[#2C2A26]"
            />
            <span>Remember me</span>
          </label>

          {message && (
            <p className="text-sm font-medium text-[#7A4F34]" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 flex h-12 w-full items-center justify-center bg-[#2C2A26] text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#D8D0C6]" />
          <span className="text-xs uppercase tracking-[0.18em] text-[#8A7766]">or</span>
          <span className="h-px flex-1 bg-[#D8D0C6]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-12 w-full items-center justify-center gap-3 border border-[#D8D0C6] bg-white text-sm font-semibold text-[#2C2A26] transition-colors hover:border-[#2C2A26]"
        >
          <GoogleMark />
          Continue with Google
        </button>

        <div className="mt-6 flex items-center justify-between text-sm text-[#6C6258]">
          <Link href="/shop" className="hover:text-[#2C2A26]">
            Continue shopping
          </Link>
          <Link href="/contact" className="hover:text-[#2C2A26]">
            Need help?
          </Link>
        </div>
      </section>

    </main>
  );
}
