"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    setSubmitted(true);
    setEmail("");
    window.setTimeout(() => setSubmitted(false), 3000);
  };

  const exploreLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "The House", href: "/the-house" },
    { label: "The Archive", href: "/archive" },
    { label: "Provenance", href: "/provenance" },
  ];

  const helpLinks = [
    { label: "FAQ", href: "/contact" },
    { label: "Shipping", href: "/contact" },
    { label: "Contact us", href: "/contact" },
  ];

  const legalLinks = [
    { label: "Terms of use", href: "#" },
    { label: "About", href: "/about" },
    { label: "Sustainability", href: "#" },
  ];

  return (
    <footer className="border-t border-black/10" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-[1500px] px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.9fr_0.75fr_1.45fr] lg:gap-10 xl:gap-14">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6 w-[200px]">
              <Image
                src="/Assets/sampriti-logo-transparent.png"
                alt="Sampriti"
                width={590}
                height={128}
                className="h-auto w-full"
              />
            </Link>
            <p className="text-sm text-[#5A554E] mb-6 max-w-xs">A botanical house of ritual science and disciplined formulation, guided by the quiet intelligence of the earth.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#5A554E]">Follow us on</span>
              <a href="#" className="text-[#2C2A26] hover:opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase mb-6 text-[#A48662]">Explore</h4>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm text-[#5A554E] hover:text-[#2C2A26]">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase mb-6 text-[#A48662]">Orders and support</h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm text-[#5A554E] hover:text-[#2C2A26]">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase mb-6 text-[#A48662]">About</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-[#5A554E] hover:text-[#2C2A26]">Our story</Link></li>
              {legalLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm text-[#5A554E] hover:text-[#2C2A26]">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="text-xs tracking-[0.25em] uppercase mb-4 text-[#A48662]">The Inner Circle</h4>
            <p className="mb-2 text-xl font-light leading-tight text-[#2B2925]" style={{ fontFamily: "var(--font-serif)" }}>
              Join the Botanical Lineage
            </p>
            <p className="mb-5 text-sm leading-6 text-[#5A554E]">
              Receive our field notes on ancient formulations, seasonal rituals, and new botanical discoveries.
            </p>

            <form onSubmit={handleSubscribe} className="w-full">
              <label>
                <span className="sr-only">Your email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  required
                  className="h-11 w-full border-0 border-b bg-transparent px-1 text-sm text-[#2B2925] outline-none placeholder:text-[#8A8379]"
                  style={{ borderColor: "rgba(43, 41, 37, 0.22)", fontFamily: "var(--font-sans)" }}
                />
              </label>
              <button
                type="submit"
                className="mt-4 h-11 w-full bg-[#262420] px-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#F9F7F3] transition-opacity hover:opacity-90"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {submitted ? "Subscribed" : "Subscribe"}
              </button>
              {submitted && (
                <p className="mt-3 text-sm text-[#A48662]">
                  Welcome to the lineage. Your first field note is on its way.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "#E5DCCF" }}>
          <p className="text-xs text-[#5A554E]">© 2025 Sampriti Botanicals. All rights reserved.</p>
          <p className="text-xs text-[#5A554E]">Curated Works · Customer Review</p>
        </div>
      </div>
    </footer>
  );
}



