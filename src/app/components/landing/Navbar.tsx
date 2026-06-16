"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut, Package, User } from "lucide-react";
import { useCartStore } from "@/app/components/landing/cartStore";
import { formatPrice, getSettings } from "@/services/settings";
import { useAuthStore } from "@/app/stores/authStore";

interface NavbarProps {
  forceScrolled?: boolean;
}

const navLinks = [
  { label: "Infusions", href: "/category/infusions" },
  { label: "Skincare", href: "/category/skincare" },
  { label: "Fragrance", href: "/category/fragrance" },
  { label: "Ceremony", href: "/category/ceremony" },
  { label: "Atmospheric", href: "/category/atmospheric" },
  { label: "The House", href: "/the-house" },
  { label: "The Archive", href: "/archive" },
  { label: "Provenance", href: "/provenance" },
];

function IconButton({
  children,
  label,
  onClick,
  colorClass,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  colorClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-10 w-9 items-center justify-center transition-opacity hover:opacity-75 cursor-pointer ${colorClass}`}
      aria-label={label}
      suppressHydrationWarning
    >
      {children}
    </button>
  );
}

export default function Navbar({ forceScrolled = false }: NavbarProps) {
  const pathname = usePathname();
  const router   = useRouter();

  // ── Auth state from Zustand store (replaces localStorage) ────────────────
  const authUser        = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const storeLogout     = useAuthStore(s => s.logout);

  const [scrolled,     setScrolled]     = useState(forceScrolled || false);
  const [visible,      setVisible]      = useState(true);
  const lastScrollY = useRef(0);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [currency,     setCurrency]     = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const items          = useCartStore((s) => s.items);
  const openCart       = useCartStore((s) => s.openCart);
  const syncCartAccount = useCartStore((s) => s.syncAccount);
  const cartCount      = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const cartTotal      = useCartStore((s) => s.getTotal());

  useEffect(() => {
    syncCartAccount();
  }, [syncCartAccount, isAuthenticated]);

  useEffect(() => {
    getSettings()
      .then((settings) => {
        if (settings?.currency) setCurrency(settings.currency);
        if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (!forceScrolled) setScrolled(currentY > 100);
      if (currentY > 100) {
        setVisible(currentY < lastScrollY.current);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceScrolled]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || profileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, profileOpen]);

  const navColor = scrolled || pathname !== "/" ? "text-[#333333] hover:text-black" : "text-white group-hover:text-black";
  const mutedNavColor = scrolled || pathname !== "/" ? "text-[#333333] hover:text-black" : "text-white/90 group-hover:text-black";

  const handleProfile = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setProfileOpen(true);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await storeLogout();
    router.push("/login");
  };

  const cartBadge =
    cartCount > 0 ? (
      <span
        className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium ${
          scrolled || pathname !== "/" ? "bg-[#2C2A26] text-white" : "bg-white text-[#2C2A26]"
        }`}
      >
        {cartCount}
      </span>
    ) : null;

  return (
    <>
      <style>{`
        .nav-link-reserve {
          display: inline-grid;
          grid-template-columns: 1fr;
        }
        .nav-link-reserve::after {
          content: attr(data-label);
          grid-row: 1;
          grid-column: 1;
          font-weight: 600;
          font-size: 16px;
          line-height: 29px;
          letter-spacing: 0.1em;
          height: 0;
          overflow: hidden;
          visibility: hidden;
          pointer-events: none;
        }
      `}</style>
      <div className="group">
        <nav
          className={`fixed left-0 top-0 z-[9999] w-full transition-all duration-300 ${
            scrolled
              ? visible ? "bg-white shadow-sm translate-y-0 py-1" : "bg-white shadow-sm -translate-y-full py-1"
              : pathname === "/"
                ? "bg-gradient-to-b from-black/70 via-black/40 to-transparent text-white group-hover:bg-white group-hover:bg-none group-hover:shadow-sm"
                : "bg-white shadow-sm"
          }`}
        >
          {scrolled && (
            <div className="flex w-full items-center justify-center bg-[#333333] py-5 md:py-6 px-2">
              <p className="text-[9px] md:text-[10px] tracking-[0.04em] md:tracking-[0.08em] text-white whitespace-nowrap">"Rooted in nature. Crafted with purpose. Designed for mindful living".</p>
            </div>
          )}
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-12">
            {/* Mobile layout: logo + icons in a row (always visible on mobile) */}
            <div className="flex items-center justify-between pt-5 pb-1 pr-3 lg:hidden">
              <Link href="/" className="shrink-0 pt-[5px] pr-4">
                <span className="relative block">
                  <Image
                    src="/assets/sampriti-logo-transparent.webp"
                    alt="Sampriti"
                    width={586}
                    height={124}
                    priority
                    className={`h-auto w-auto max-h-[29px] sm:max-h-[41px] brightness-[0.5] ${pathname === "/" ? "logo-white" : ""}`}
                  />
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <IconButton label="Search" colorClass={navColor}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </IconButton>
                <IconButton label="Account login" colorClass={navColor} onClick={handleProfile}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0116 0" />
                  </svg>
                </IconButton>
                <IconButton label="Open cart" colorClass={navColor} onClick={openCart}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  {cartBadge}
                </IconButton>
                <IconButton label="Open menu" colorClass={navColor} onClick={() => setMobileOpen(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </svg>
                </IconButton>
              </div>
            </div>

            {/* Desktop layouts */}
            {/* Unscrolled: two-row layout (logo centered, nav below) */}
            {!scrolled && (
              <div className="hidden lg:block">
                <div className="flex flex-col items-center lg:pb-2">
                      <Link href="/" className="max-w-[55%] sm:max-w-[60%] lg:mt-7 lg:mb-0 lg:max-w-none pt-[5px]">
                    <span className="relative block flex justify-center">
                      <style>{`
                        .logo-white { filter: brightness(0) invert(1) drop-shadow(0 1px 6px rgba(0,0,0,0.1)); }
                        .group:hover .logo-white { filter: none; }
                      `}</style>
                      <Image
                        src="/assets/sampriti-logo-transparent.webp"
                        alt="Sampriti"
                        width={586}
                        height={124}
                        priority
                    className={`h-auto w-auto max-h-[29px] sm:max-h-[41px] brightness-[0.5] ${pathname === "/" ? "logo-white" : ""}`}
                      />
                    </span>
                  </Link>
                  <div className="flex w-full items-center justify-end gap-3 xl:gap-6 lg:-mt-4">
                    <IconButton label="Search" colorClass={navColor}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </IconButton>
                    <IconButton label="Account login" colorClass={navColor} onClick={handleProfile}>
                      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0116 0" />
                      </svg>
                    </IconButton>
                    <IconButton label="Open cart" colorClass={navColor} onClick={openCart}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      {cartBadge}
                    </IconButton>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center gap-3 xl:gap-6">
                      {navLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                      data-label={link.label}
                      className={`text-[13px] xl:text-[15px] font-[300] leading-[29px] tracking-[0.1em] ${mutedNavColor} hover:font-[600] nav-link-reserve`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scrolled: single-row layout (logo left, nav center, icons right) */}
            {scrolled && (
              <div className="hidden items-center justify-between lg:flex">
<Link href="/" className="shrink-0 pt-[5px]">
                  <span className="relative block">
                    <Image
                      src="/assets/sampriti-logo-transparent.webp"
                      alt="Sampriti"
                      width={586}
                      height={124}
                      priority
                      className="h-auto w-auto max-h-[24px] sm:max-h-[30px] brightness-[0.65]"
                    />
                  </span>
                </Link>

                <div className="flex items-center">
                  <div className="flex items-center gap-2 xl:gap-5">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        data-label={link.label}
                        className="text-[13px] xl:text-[15px] font-[300] leading-[29px] tracking-[0.1em] text-[#333333] hover:text-black hover:font-[600] nav-link-reserve"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <IconButton label="Search" colorClass="text-[#333333]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </IconButton>
                  <IconButton label="Account login" colorClass="text-[#333333]" onClick={handleProfile}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21a8 8 0 0116 0" />
                    </svg>
                  </IconButton>
                  <IconButton label="Open cart" colorClass="text-[#333333]" onClick={openCart}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-medium bg-[#2C2A26] text-white">
                        {cartCount}
                      </span>
                    )}
                  </IconButton>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-[10000] bg-[#0F0D0A]/55 backdrop-blur-[2px]" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 z-[10010] flex h-[100dvh] w-full flex-col bg-[#F8F4ED] shadow-[-24px_0_70px_rgba(15,13,10,0.18)] sm:max-w-[460px]">
              <div className="flex shrink-0 items-center justify-between border-b border-[#E6E1D6] bg-white px-5 py-5 sm:px-6">
                <Image src="/assets/sampriti-logo-transparent.webp" alt="Sampriti" width={160} height={40} className="h-auto w-[140px] brightness-[0.65]" />
                <button onClick={() => setMobileOpen(false)} className="flex h-10 w-10 cursor-pointer items-center justify-center text-[#5A554E]" aria-label="Close menu"><span className="text-[28px] leading-none">&times;</span></button>
              </div>
              <nav className="flex-1 overflow-y-auto px-5 py-8 sm:px-6">
                {navLinks.map((link) => (
                  <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}                    className="flex items-center justify-between border-b border-[#E6E1D6] py-5 text-base tracking-[0.12em] text-[#5A554E] hover:text-[#2C2A26]">
                    {link.label}<ChevronRight size={16} className="text-[#A48662]/45" />
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileOpen && isAuthenticated && authUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileOpen(false)} className="fixed inset-0 z-[10000] bg-[#0F0D0A]/55 backdrop-blur-[2px]" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 z-[10010] flex h-[100dvh] w-full flex-col bg-[#F8F4ED] shadow-[-24px_0_70px_rgba(15,13,10,0.18)] sm:max-w-[460px]">
              <div className="flex shrink-0 items-start justify-between border-b border-[#E6E1D6] bg-white px-5 py-5 sm:px-6">
                <div>
                  <Image src="/assets/sampriti-logo-transparent.webp" alt="Sampriti" width={160} height={40} className="mb-2 h-auto w-[140px] brightness-[0.65]" />
                  <h2 className="text-2xl leading-none text-[#2B2925]">Your Account</h2>
                </div>
                <button onClick={() => setProfileOpen(false)} className="flex h-10 w-10 cursor-pointer items-center justify-center text-[#5A554E]" aria-label="Close account"><span className="text-[28px] leading-none">&times;</span></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-6">
                {/* User info */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8E0D5] text-lg font-semibold text-[#2C2A26]">
                    {authUser.full_name?.[0]?.toUpperCase() || <User size={20} />}
                  </div>
                  <div>
                    <p className="text-base font-medium text-[#2B2925]">{authUser.full_name}</p>
                    <p className="text-sm text-[#5A554E]">{authUser.email}</p>
                  </div>
                </div>

                {/* Account links */}
                <Link href="/account/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-4 border-b border-[#E6E1D6] py-4 text-sm text-[#5A554E] hover:text-[#2C2A26]">
                  <Package size={18} /><span>My Orders</span>
                </Link>
                <Link href="/account" onClick={() => setProfileOpen(false)} className="flex items-center gap-4 border-b border-[#E6E1D6] py-4 text-sm text-[#5A554E] hover:text-[#2C2A26]">
                  <User size={18} /><span>My Profile</span>
                </Link>
                <button onClick={handleLogout} className="flex w-full cursor-pointer items-center gap-4 border-b border-[#E6E1D6] py-4 text-left text-sm text-[#5A554E] hover:text-[#2C2A26]">
                  <LogOut size={18} /><span>Log Out</span>
                </button>

                {/* Cart summary */}
                {items.length > 0 && (
                  <div className="mt-8">
                    <p className="mb-3 text-[10px] uppercase tracking-[0.32em] text-[#A48662]">Cart Summary</p>
                    <div className="space-y-3">
                      {items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3">
                          <p className="truncate text-base text-[#2B2925]">{item.name} x{item.quantity}</p>
                          <span className="text-sm text-[#A48662]">{formatPrice(item.price * item.quantity, currency, exchangeRate)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#E6E1D6] pt-4">
                      <span className="text-base font-medium text-[#2B2925]">Total</span>
                      <span className="text-xl text-[#A48662]">{formatPrice(cartTotal, currency, exchangeRate)}</span>
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
