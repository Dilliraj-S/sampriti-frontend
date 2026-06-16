"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-0 z-50 flex h-7 w-7 md:h-11 md:w-11 md:bottom-8 md:right-8 cursor-pointer items-center justify-center bg-[#2C2A26] text-[#FDFAF5] shadow-lg transition-all duration-300 hover:bg-black ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp size={14} strokeWidth={2} className="md:hidden" />
      <ArrowUp size={18} strokeWidth={1.8} className="hidden md:block" />
    </button>
  );
}
