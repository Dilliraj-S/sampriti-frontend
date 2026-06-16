"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      scrollToTop();
    }
  };

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    setSubmitted(true);
    setEmail("");
    window.setTimeout(() => setSubmitted(false), 3000);
  };

  const exploreLinks = [
    { label: "Our story", href: "/the-house" },
    { label: "Sustainability", href: "/provenance" },
    { label: "Curated Works", href: "/archive" },
    { label: "Customer Review", href: "/reviews" },
  ];

  const helpLinks = [
    { label: "Contact us", href: "/contact" },
    { label: "FAQ", href: "/" },
    { label: "Shipping", href: "/" },
    { label: "Terms of use", href: "/terms" },
  ];

  return (
    <footer className="border-t border-black/10" style={{ background: "#FDFAF5" }}>
      <div className="mx-auto max-w-[1500px] px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.9fr_1.45fr] lg:gap-10 xl:gap-14">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6 w-[140px]">
              <Image
                src="/assets/sampriti-logo-transparent.webp"
                alt="Sampriti"
                width={586}
                height={124}
                className="h-auto w-full brightness-[0.5]"
              />
            </Link>
            <p className="text-sm text-[#5A554E] mb-6 max-w-xs">A botanical house of ritual science and disciplined formulation, guided by the quiet intelligence of the earth.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#5A554E]">Follow us on</span>
              <a href="https://www.instagram.com/sampritibotanicals" target="_blank" rel="noopener noreferrer" className="text-[#2C2A26] hover:opacity-70" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
              <a href="https://www.facebook.com/sampritibotanicals" target="_blank" rel="noopener noreferrer" className="text-[#2C2A26] hover:opacity-70" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg></a>
              <a href="https://x.com/sampritibotanicals" target="_blank" rel="noopener noreferrer" className="text-[#2C2A26] hover:opacity-70" aria-label="X (Twitter)"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="https://pinterest.com/sampritibotanicals" target="_blank" rel="noopener noreferrer" className="text-[#2C2A26] hover:opacity-70" aria-label="Pinterest"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.633 0 12.017 0z"/></svg></a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-[14px] tracking-[0.25em] mb-6 text-[#333333]">About</h4>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#5A554E] hover:text-[#2C2A26]">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[14px] tracking-[0.25em] mb-6 text-[#333333]">Orders And Support</h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm text-[#5A554E] hover:text-[#2C2A26]">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div className="md:col-span-2 lg:col-span-1">
              <h4 className="text-[14px] tracking-[0.25em] mb-4 text-[#333333]">The Inner Circle</h4>
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
                  suppressHydrationWarning
                />
              </label>
              <button
                type="submit"
                className="mt-4 h-11 w-full cursor-pointer bg-[#262420] px-6 text-xs font-normal tracking-[0.2em] text-[#F9F7F3] transition-opacity hover:opacity-90"
                style={{ fontFamily: "var(--font-sans)" }}
                suppressHydrationWarning
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
          <p className="text-xs text-[#5A554E]">� 2025 Sampriti Botanicals. All rights reserved.</p>
          <p className="text-xs text-[#5A554E]">Curated Works � Customer Review</p>
        </div>
      </div>
    </footer>
  );
}
