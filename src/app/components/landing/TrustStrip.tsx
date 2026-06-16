"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

const trustItems = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
        <path d="M8 12c0-2 1-4 4-4s4 2 4 4-1 4-4 4-4-2-4-4" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    ),
    text: "4,000 Years of Siddha Wisdom",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ),
    text: "Zero Synthetics · Vegan",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V8" />
        <path d="M12 8C12 8 8 4 8 2c0 0 4 2 4 2s4-2 4-2c0 2-4 6-4 6z" />
        <path d="M5 22h14" />
        <path d="M12 14c-2 0-5 2-5 4" />
        <path d="M12 14c2 0 5 2 5 4" />
      </svg>
    ),
    text: "Wildcrafted Small Batch",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 17,8.5 22,12 17,15.5 12,22 7,15.5 2,12 7,8.5" />
      </svg>
    ),
    text: "Ancient Formulations, Modern Ritual",
  },
];

export default function TrustStrip() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full bg-moss border-y border-sage/20 py-5"
    >
      {/* Desktop: static row */}
      <div className="hidden md:flex items-center justify-center gap-6 max-w-6xl mx-auto px-6">
        {trustItems.map((t, i) => (
          <div key={i} className="flex items-center gap-3">
            {i > 0 && <span className="text-gold/30 mr-3">·</span>}
            <span className="text-gold/60">{t.icon}</span>
            <span
              className="text-cream/70 text-xs tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {t.text}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile: marquee */}
      <div className="md:hidden overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...trustItems, ...trustItems].map((t, i) => (
            <div key={i} className="flex items-center gap-3 mx-6 shrink-0">
              <span className="text-gold/60">{t.icon}</span>
              <span
                className="text-cream/70 text-xs tracking-[0.15em] uppercase"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
              >
                {t.text}
              </span>
              <span className="text-gold/30 ml-3">·</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
