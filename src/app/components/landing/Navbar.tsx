"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, User, ShoppingBag, LogOut, Package, ChevronRight } from "lucide-react";
import { useCartStore } from "@/app/components/landing/cartStore";
import { formatPrice, getSettings } from "@/services/settings";

interface NavbarProps {
  forceScrolled?: boolean;
}

interface Account {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Infusions", href: "/category/infusions" },
  { label: "Skincare", href: "/category/skincare" },
  { label: "Fragrance", href: "/category/fragrance" },
  { label: "Ceremony", href: "/category/ceremony" },
  { label: "Atmospheric", href: "/category/atmospheric" },
  { label: "The House", href: "/the-house" },
  { label: "The Archive", href: "/archive" },
  { label: "Provenance", href: "/provenance" },
];

const accountKey = "sampriti-account";
const sessionKey = "sampriti-session";
const legacyGoogleEmail = "google.customer@sampriti.local";

function getCurrentAccount(): Account | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(accountKey);
    if (!saved) return null;
    const account = JSON.parse(saved);
    const session = localStorage.getItem(sessionKey);
    if (!session) return null;
    const parsedSession = JSON.parse(session);
    return parsedSession.email === account.email ? account : null;
  } catch {
    return null;
  }
}

function NavbarLogo({ scrolled }: { scrolled: boolean }) {
  return (
    <span
      className="relative block"
      aria-label="Sampriti"
    >
      <Image
        src="/Assets/sampriti-logo-transparent.png"
        alt="Sampriti"
        width={590}
        height={128}
        priority
          className="h-auto w-auto max-h-[35px] sm:max-h-[45px]"
        style={{
          filter: scrolled
            ? "none"
            : "brightness(0) invert(1) drop-shadow(0 2px 10px rgba(0,0,0,0.75))",
        }}
      />
    </span>
  );
}

export default function Navbar({ forceScrolled = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(forceScrolled);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const router = useRouter();
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const syncCartAccount = useCartStore((s) => s.syncAccount);
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const cartTotal = getTotal();
  const visibleCartCount = currentAccount ? cartCount : 0;
  const visibleCartTotal = currentAccount ? cartTotal : 0;
  const visibleCartItems = currentAccount ? items : [];
  const headerIsLight = scrolled || hovered;

  useEffect(() => {
    const refreshAccount = () => {
      setCurrentAccount(getCurrentAccount());
      syncCartAccount();
    };
    refreshAccount();
    window.addEventListener("storage", refreshAccount);
    window.addEventListener("sampriti-account-change", refreshAccount);
    return () => {
      window.removeEventListener("storage", refreshAccount);
      window.removeEventListener("sampriti-account-change", refreshAccount);
    };
  }, [syncCartAccount]);

  useEffect(() => {
    getSettings().then(s => { if (s?.currency) setCurrency(s.currency); if (s?.exchange_rate) setExchangeRate(parseFloat(s.exchange_rate)); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (mobileOpen || profileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, profileOpen]);

  useEffect(() => {
    if (forceScrolled) return;

    const handler = () => {
      const switchPoint = 100;
      setScrolled(window.scrollY > switchPoint);
    };

    handler();
    window.addEventListener("scroll", handler);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [forceScrolled, pathname]);

  const profileColorClass = headerIsLight
    ? "text-[#2C2A26]"
    : "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]";

  const handleProfileClick = () => {
    if (!currentAccount) {
      router.push("/login");
      return;
    }
    setProfileOpen(true);
  };

  const handleLogout = () => {
    window.localStorage.removeItem(sessionKey);
    window.dispatchEvent(new Event("sampriti-account-change"));
    setCurrentAccount(null);
    setProfileOpen(false);
    router.push("/login");
  };

  return (
    <>
      <nav
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ${
          headerIsLight
            ? "bg-[#FFFFFF]/95 backdrop-blur-md shadow-sm py-4"
            : "bg-gradient-to-b from-black/45 via-black/20 to-transparent py-6 text-white"
        }`}
      >
        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col items-start lg:items-center">
            <Link href="/" className="mb-0 max-w-[55%] shrink-0 sm:max-w-[60%] lg:mb-6 lg:max-w-none">
              <NavbarLogo scrolled={headerIsLight} />
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center lg:flex">
              <div className="flex items-center gap-6 xl:gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[14px] tracking-[0.1em] transition-colors duration-300 xl:text-[15px] ${
                      headerIsLight
                        ? pathname === link.href
                          ? "text-[#2C2A26] font-medium"
                          : "text-[#5A554E] hover:text-[#2C2A26]"
                        : pathname === link.href
                        ? "text-white font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]"
                        : "text-white/90 hover:text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="absolute right-6 bottom-0 flex items-center gap-6 lg:right-12">
                <button
                  className={`flex h-11 w-10 items-center justify-center transition-opacity hover:opacity-75 ${
                    headerIsLight ? "text-[#2C2A26]" : "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]"
                  }`}
                  aria-label="Search"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleProfileClick}
                  className={`flex h-11 w-10 items-center justify-center transition-opacity hover:opacity-75 ${profileColorClass}`}
                  aria-label="Account login"
                >
                  <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0116 0" />
                  </svg>
                </button>

                <button
                  className={`relative flex h-11 w-10 items-center justify-center transition-opacity hover:opacity-75 ${
                    headerIsLight ? "text-[#2C2A26]" : "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]"
                  }`}
                  onClick={openCart}
                  aria-label="Open cart"
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  {currentAccount && visibleCartCount > 0 && (
                    <span
                      className={`absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium ${
                        headerIsLight ? "bg-[#2C2A26] text-white" : "bg-[#FFFFFF] text-[#2C2A26]"
                      }`}
                    >
                      {visibleCartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile hamburger + icons */}
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-0.5 min-[360px]:gap-1 lg:hidden">
            <button
              className={`hidden h-10 w-7 items-center justify-center transition-opacity hover:opacity-75 min-[360px]:flex ${
                headerIsLight ? "text-[#2C2A26]" : "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]"
              }`}
              aria-label="Search"
            >
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleProfileClick}
              className={`flex h-10 w-7 items-center justify-center transition-opacity hover:opacity-75 min-[360px]:w-8 ${profileColorClass}`}
              aria-label="Account login"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0116 0" />
              </svg>
            </button>

            <button
              className={`relative flex h-10 w-7 items-center justify-center transition-opacity hover:opacity-75 min-[360px]:w-8 ${
                headerIsLight ? "text-[#2C2A26]" : "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]"
              }`}
              onClick={openCart}
              aria-label="Open cart"
            >
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {currentAccount && visibleCartCount > 0 && (
                <span
                  className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium ${
                    headerIsLight ? "bg-[#2C2A26] text-white" : "bg-[#FFFFFF] text-[#2C2A26]"
                  }`}
                >
                  {visibleCartCount}
                </span>
              )}
            </button>

            <button
              className={`flex h-10 w-7 items-center justify-center transition-opacity hover:opacity-75 min-[360px]:w-8 ${
                headerIsLight ? "text-[#2C2A26]" : "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]"
              }`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[10000] bg-[#0F0D0A]/55 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[10010] flex h-[100dvh] w-full flex-col shadow-[-24px_0_70px_rgba(15,13,10,0.18)] sm:max-w-[460px]"
              style={{ background: "#F8F4ED" }}
            >
              <div
                className="flex shrink-0 items-center justify-between border-b px-5 py-5 sm:px-6"
                style={{ borderColor: "rgba(164,134,98,0.18)", background: "#FFFFFF" }}
              >
                <div className="w-[100px]">
                  <Image
                    src="/Assets/sampriti-logo-transparent.png"
                    alt="Sampriti"
                    width={590}
                    height={128}
                    className="h-auto w-full"
                  />
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:bg-[#F4F1EA]"
                  style={{ color: "#5A554E" }}
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-6">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between border-b py-5 text-base tracking-[0.12em] transition-colors ${
                        pathname === link.href
                          ? "text-[#2C2A26] font-medium"
                          : "text-[#5A554E] hover:text-[#2C2A26]"
                      }`}
                      style={{
                        borderColor: "rgba(164,134,98,0.1)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {link.label}
                      <ChevronRight size={16} className="text-[#A48662]/40" />
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Profile drawer */}
      <AnimatePresence>
        {profileOpen && currentAccount && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="fixed inset-0 z-[10000] bg-[#0F0D0A]/55 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[10010] flex h-[100dvh] w-full flex-col shadow-[-24px_0_70px_rgba(15,13,10,0.18)] sm:max-w-[460px]"
              style={{ background: "#F8F4ED" }}
            >
              <div
                className="flex shrink-0 items-center justify-between border-b px-5 py-5 sm:px-6"
                style={{ borderColor: "rgba(164,134,98,0.18)", background: "#FFFFFF" }}
              >
                <div>
                  <div className="mb-1 w-[100px]">
                    <Image
                      src="/Assets/sampriti-logo-transparent.png"
                      alt="Sampriti"
                      width={590}
                      height={128}
                      className="h-auto w-full"
                    />
                  </div>
                  <h2
                    className="text-2xl leading-none"
                    style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
                  >
                    Your Account
                  </h2>
                </div>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:bg-[#F4F1EA]"
                  style={{ color: "#5A554E" }}
                  aria-label="Close account"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-6">
                <div className="mb-8">
                  <p className="text-lg font-medium text-[#2B2925]">
                    {currentAccount.firstName} {currentAccount.lastName}
                  </p>
                  <p className="text-sm text-[#5A554E]">{currentAccount.email}</p>
                </div>

                <nav className="flex flex-col gap-1">
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-4 border-b py-4 text-sm text-[#5A554E] hover:text-[#2C2A26] transition-colors"
                    style={{ borderColor: "rgba(164,134,98,0.1)" }}
                    onClick={() => setProfileOpen(false)}
                  >
                    <Package size={18} />
                    <span>My Orders</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 border-b py-4 text-sm text-[#5A554E] hover:text-[#2C2A26] transition-colors w-full text-left"
                    style={{ borderColor: "rgba(164,134,98,0.1)" }}
                  >
                    <LogOut size={18} />
                    <span>Log Out</span>
                  </button>
                </nav>

                {visibleCartItems.length > 0 && (
                  <div className="mt-8">
                    <p
                      className="mb-3 text-[10px] tracking-[0.32em] uppercase"
                      style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}
                    >
                      Cart Summary
                    </p>
                    <div className="space-y-3">
                      {visibleCartItems.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <p className="truncate text-base" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                            {item.name} x{item.quantity}
                          </p>
                          <span className="text-sm" style={{ fontFamily: "var(--font-serif)", color: "#A48662" }}>
                            {formatPrice(item.price * item.quantity, currency, exchangeRate)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: "rgba(164,134,98,0.15)" }}>
                      <span className="text-base font-medium" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                        Total
                      </span>
                      <span className="text-xl" style={{ fontFamily: "var(--font-serif)", color: "#A48662" }}>
                        {formatPrice(visibleCartTotal, currency, exchangeRate)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
