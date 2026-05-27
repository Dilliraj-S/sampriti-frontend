"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PRODUCT CAROUSEL DATA — 5 real Sampriti products
   Copy product images to /public/images/products/ using the
   exact filenames listed in the comment at the bottom.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const PRODUCTS = [
  {
    id: "shakti-peya",
    src: "/images/products/shakti-peya-tubes.png",   // sampriti__14_.png
    alt: "Shakti Peya — Sampriti Botanicals",
    label: "Shakti Peya",
    latin: "Herba Vita",
    glow: "rgba(168,130,80,0.18)",
    screenBlend: true,   // white bg → use mix-blend-mode: screen
    aspectRatio: "2/5",
  },
  {
    id: "rose",
    src: "/images/products/rose-jar.png",            // sampriti_rose_1.png
    alt: "Rose — Sampriti Botanicals",
    label: "Rosa Centifolia",
    latin: "Rosa Centifolia",
    glow: "rgba(180,90,110,0.16)",
    screenBlend: false,  // lifestyle shot — has own bg colour
    aspectRatio: "4/3",
  },
  {
    id: "hibiscus",
    src: "/images/products/hibiscus-jar.png",        // Sanpriti_Hibiscus_zoom_out.png
    alt: "Hibiscus — Sampriti Botanicals",
    label: "Hibiscus",
    latin: "Hibiscus Rosa-sinensis",
    glow: "rgba(180,50,70,0.15)",
    screenBlend: true,
    aspectRatio: "3/4",
  },
  {
    id: "butterfly-pea",
    src: "/images/products/butterfly-pea-jar.png",   // Sampriti_Butterfly_Pea_Zoom_out.png
    alt: "Blue Butterfly Pea — Sampriti Botanicals",
    label: "Butterfly Pea",
    latin: "Clitoria Ternatea",
    glow: "rgba(50,70,180,0.15)",
    screenBlend: true,
    aspectRatio: "3/4",
  },
  {
    id: "black-turmeric",
    src: "/images/products/black-turmeric-jar.png",  // Sampriti_Black_Turmeric_Zoom_out.png
    alt: "Black Turmeric — Sampriti Botanicals",
    label: "Black Turmeric",
    latin: "Curcuma Caesia",
    glow: "rgba(120,80,20,0.18)",
    screenBlend: true,
    aspectRatio: "3/4",
  },
] as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BOTANICAL SVG ILLUSTRATIONS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function LeafCluster() {
  return (
    <svg className="absolute top-16 right-[8%] w-72 h-72 opacity-[0.07] pointer-events-none select-none"
      viewBox="0 0 200 200" fill="none" stroke="#7A9A72" strokeWidth="0.6" aria-hidden="true"
      style={{ animation: "botanicalDrift 22s ease-in-out infinite" }}>
      <path d="M100 18 C125 55,168 78,100 182 C32 78,75 55,100 18Z" />
      <path d="M100 38 L100 178" />
      <path d="M100 68 C78 52,60 58,50 70" />
      <path d="M100 92 C122 76,140 82,150 94" />
      <path d="M100 114 C76 98,56 104,46 118" />
      <path d="M100 136 C124 120,144 126,152 140" />
    </svg>
  );
}
function BranchLeft() {
  return (
    <svg className="absolute bottom-28 left-[4%] w-52 h-52 opacity-[0.06] pointer-events-none select-none"
      viewBox="0 0 200 200" fill="none" stroke="#7A9A72" strokeWidth="0.6" aria-hidden="true"
      style={{ animation: "botanicalDriftReverse 28s ease-in-out infinite" }}>
      <path d="M20 185 C58 145,78 105,98 42" />
      <path d="M58 145 C36 122,28 100,34 78" />
      <path d="M79 112 C100 92,112 72,106 50" />
      <ellipse cx="32" cy="73" rx="14" ry="22" transform="rotate(-22 32 73)" />
      <ellipse cx="108" cy="46" rx="13" ry="21" transform="rotate(16 108 46)" />
      <ellipse cx="62" cy="148" rx="10" ry="18" transform="rotate(-8 62 148)" />
    </svg>
  );
}
function SmallLeaf() {
  return (
    <svg className="absolute top-[38%] left-[28%] w-28 h-28 opacity-[0.05] pointer-events-none select-none"
      viewBox="0 0 100 100" fill="none" stroke="#C8973A" strokeWidth="0.5" aria-hidden="true"
      style={{ animation: "botanicalDriftSlow 35s ease-in-out infinite" }}>
      <path d="M50 8 C62 28,74 52,50 92 C26 52,38 28,50 8Z" />
      <path d="M50 18 L50 88" /><path d="M50 40 C38 32,28 36,22 44" />
      <path d="M50 60 C62 52,72 56,78 64" />
    </svg>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   AMBIENT VIDEO — right panel Z1
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function AmbientVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.addEventListener("canplaythrough", () => setLoaded(true), { once: true });
  }, []);
  return (
    <>
      {/* Fallback while loading */}
      <div className="absolute inset-0"
        style={{ background: "#050805", opacity: loaded ? 0 : 1, transition: "opacity 1.2s ease" }} />
      {/* Full screen video */}
      <video ref={ref} className="absolute inset-0 w-full h-full object-cover"
        src="/assests/videos/mp.mp4"
        autoPlay muted loop playsInline
        style={{ opacity: loaded ? 0.45 : 0, transition: "opacity 1.8s ease 0.4s" }} />
      {/* Full screen dark overlay for text readability */}
      <div className="absolute inset-0" style={{ background: "rgba(5,8,5,0.65)" }} />
      {/* Radial vignette for edges */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, transparent 15%, rgba(5,8,5,0.85) 100%)" }} />
      {/* Bottom fade */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, #050805 100%)" }} />
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LATIN TEXT OVERLAY — Z5, updates per product
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function LatinText({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.span key={text}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(52px,7vw,96px)",
            fontStyle: "italic", fontWeight: 300, color: "rgba(237,233,222,0.042)",
            transform: "rotate(-90deg)", whiteSpace: "nowrap", letterSpacing: "0.18em",
            position: "absolute", right: "-8%" }}
          aria-hidden="true">
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FLOATING PRODUCT CAROUSEL — Z4
   mix-blend-mode: screen removes white backgrounds in CSS —
   no Photoshop cutouts needed for the jar images.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProductCarousel({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const p = PRODUCTS[active];
  return (
    <div className="absolute pointer-events-none"
      style={{ right: "5%", top: "50%", transform: "translateY(-50%)",
        width: "clamp(155px,15vw,245px)", display: "flex",
        flexDirection: "column", alignItems: "center", gap: "18px" }}>

      {/* Ambient glow — colour changes per product */}
      <AnimatePresence mode="wait">
        <motion.div key={p.id + "-glow"}
          className="absolute -z-10"
          style={{ inset: "-25%", borderRadius: "50%", filter: "blur(44px)",
            background: `radial-gradient(ellipse,${p.glow} 0%,transparent 70%)` }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }} />
      </AnimatePresence>

      {/* Floating product image */}
      <motion.div className="relative w-full"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        <AnimatePresence mode="wait">
          <motion.div key={p.id} className="relative w-full" style={{ aspectRatio: p.aspectRatio }}
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -14 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <Image src={p.src} alt={p.alt} fill
              className="object-contain object-center"
              sizes="(max-width:1024px) 0vw, 245px"
              priority={active === 0}
              style={{
                mixBlendMode: p.screenBlend ? "screen" : "normal",
                /*
                  screen blend: white pixels become invisible on dark bg.
                  The amber glass jar floats naturally — no cutout needed.
                  Disable only for lifestyle shots with coloured backgrounds.
                */
              }} />
            {/* Scrim for lifestyle images */}
            {!p.screenBlend && (
              <div className="absolute inset-0 rounded-sm"
                style={{ background: "rgba(10,18,10,0.22)",
                  border: "0.5px solid rgba(200,151,58,0.14)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }} />
            )}
          </motion.div>
        </AnimatePresence>
        {/* Ground shadow */}
        <div style={{ position: "absolute", bottom: "-22px", left: "10%", right: "10%",
          height: "22px", background: "radial-gradient(ellipse,rgba(0,0,0,0.38) 0%,transparent 70%)",
          filter: "blur(8px)" }} />
      </motion.div>

      {/* Product name label */}
      <AnimatePresence mode="wait">
        <motion.div key={p.id + "-lbl"} className="text-center"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.6 }}>
          {/* Replaced wordmark with provided logo image */}
          <div
            style={{
              width: 160,
              height: 26,
              marginBottom: 6,
              opacity: 0.95,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "visible",
            }}
          >
            <img
              src="/Assets/1.webp"
              alt="Sampriti"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
          <p style={{ fontSize: "13px", color: "rgba(237,233,222,0.68)", fontFamily: "var(--font-serif)",
            fontStyle: "italic", fontWeight: 300, letterSpacing: "0.04em" }}>
            {p.label}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dot nav */}
      <div className="flex gap-[6px] pointer-events-auto" role="tablist">
        {PRODUCTS.map((_, i) => (
          <button key={i} role="tab" aria-selected={i === active} onClick={() => onSelect(i)}
            style={{ width: i === active ? "20px" : "5px", height: "5px", borderRadius: "3px",
              border: "none", cursor: "pointer", padding: 0,
              background: i === active ? "rgba(200,151,58,0.82)" : "rgba(237,233,222,0.18)",
              transition: "all 0.4s ease" }} />
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   THUMBNAIL STRIP — bottom of right panel
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Thumbnails({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <motion.div className="absolute flex gap-2 pointer-events-auto"
      style={{ bottom: "7%", right: "4%", left: "4%" }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.8 }}>
      {PRODUCTS.map((p, i) => (
        <button key={p.id} onClick={() => onSelect(i)} aria-label={p.label}
          style={{ flex: 1, maxWidth: "52px", aspectRatio: "3/4",
            border: i === active ? "0.5px solid rgba(200,151,58,0.55)" : "0.5px solid rgba(237,233,222,0.08)",
            borderRadius: "3px", overflow: "hidden", position: "relative",
            background: "rgba(14,22,14,0.65)", cursor: "pointer", padding: 0,
            transform: i === active ? "scale(1.06)" : "scale(1)",
            transition: "border-color 0.3s, transform 0.3s" }}>
          <Image src={p.src} alt={p.alt} fill sizes="52px" className="object-contain"
            style={{ mixBlendMode: p.screenBlend ? "screen" : "normal" }} />
          {i !== active && (
            <div className="absolute inset-0" style={{ background: "rgba(10,18,10,0.48)" }} />
          )}
        </button>
      ))}
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CORNER GOLD MARKS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CornerTL() {
  return (
    <motion.div className="absolute top-8 right-8 pointer-events-none select-none"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M1 32 L1 1 L32 1" stroke="rgba(200,151,58,0.2)" strokeWidth="0.5" />
      </svg>
    </motion.div>
  );
}
function CornerBR() {
  return (
    <motion.div className="absolute pointer-events-none select-none"
      style={{ bottom: "22%", right: "8px" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 1 }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M1 1 L32 1 M32 1 L32 32" stroke="rgba(200,151,58,0.15)" strokeWidth="0.5" />
      </svg>
      <p style={{ position: "absolute", top: "100%", right: 0, marginTop: "6px",
        fontSize: "7px", letterSpacing: "0.22em", textTransform: "uppercase",
        color: "rgba(237,233,222,0.17)", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>
        Est. 2024 · India
      </p>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SCROLL INDICATOR
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ScrollIndicator({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}>
          <motion.div style={{ width: "0.5px", height: 40, background: "rgba(237,233,222,0.2)", transformOrigin: "top" }}
            initial={{ scaleY: 0 }} animate={{ scaleY: [0,1,1,0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
          <span style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(237,233,222,0.27)", fontFamily: "var(--font-sans)" }}>
            Scroll
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN HERO EXPORT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Hero() {
  const [scrolled, setScrolled]     = useState(false);
  const [active, setActive]         = useState(0);
  const intervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null);
  const { scrollY }                 = useScroll();
  const rightPanelY                 = useTransform(scrollY, [0, 700], [0, 55]);
  const bgY                         = useTransform(scrollY, [0, 1000], [0, 150]);

  const resetCarousel = useCallback((next?: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (next !== undefined) setActive(next);
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % PRODUCTS.length);
    }, 4200);
  }, []);

  useEffect(() => { resetCarousel(); return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, [resetCarousel]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSelect = (i: number) => resetCarousel(i);

  const BASE = 0.1, S = 0.15;

  return (
    <>
      <style>{`
        @keyframes botanicalDrift        { 0%,100%{transform:translateY(0)rotate(0)} 50%{transform:translateY(-10px)rotate(2deg)} }
        @keyframes botanicalDriftReverse { 0%,100%{transform:translateY(0)rotate(0)} 50%{transform:translateY(8px)rotate(-1.5deg)} }
        @keyframes botanicalDriftSlow    { 0%,100%{transform:translateY(0)rotate(0)} 33%{transform:translateY(-6px)rotate(1deg)} 66%{transform:translateY(5px)rotate(-1deg)} }
        @keyframes shimmerGold           { 0%,100%{opacity:0.18} 50%{opacity:0.42} }
      `}</style>

      <section id="hero" className="relative min-h-screen overflow-hidden bg-[#050805]"
        aria-label="Hero — Sampriti Botanicals">

        {/* ══ FULL SCREEN AMBIENT VIDEO ══ */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
          <AmbientVideo />
        </motion.div>

        {/* Left-side botanical illustrations */}
        <LeafCluster /><BranchLeft /><SmallLeaf />

        {/* ══ RIGHT PANEL (Floating Elements) ══ */}
        <motion.div className="absolute inset-y-0 right-0 hidden lg:block"
          style={{ width: "45%", y: rightPanelY }}>
          <LatinText text={PRODUCTS[active].latin} />
          <ProductCarousel active={active} onSelect={handleSelect} />
          <Thumbnails active={active} onSelect={handleSelect} />
          <CornerTL /><CornerBR />
        </motion.div>

        {/* ══ LEFT CONTENT ══ */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="w-full lg:w-[55%] px-6 sm:px-10 lg:px-16 xl:px-24 py-32">

            {/* Gold hairline */}
            <motion.div className="mb-8"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: BASE, ease: [0.25,0.46,0.45,0.94] }}
              style={{ transformOrigin: "left" }}>
              <div style={{ height: "0.5px", width: "clamp(48px,8vw,96px)",
                background: "rgba(200,151,58,0.38)", animation: "shimmerGold 4s ease-in-out infinite 2s" }} />
            </motion.div>

            {/* Eyebrow */}
            <motion.p style={{ fontSize: "11px", letterSpacing: "0.32em", textTransform: "uppercase",
              color: "#C8973A", marginBottom: "1.5rem", fontFamily: "var(--font-sans)" }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: BASE + S, ease: "easeOut" }}>
              A Botanical House of Ritual Science
            </motion.p>

            {/* H1 staggered */}
            <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "2rem" }}>
              {["Rooted In", "Living Herbal", "Lineages"].map((line, i) => (
                <motion.span key={line} className="block"
                  style={{ fontSize: "clamp(3rem,7vw,6.5rem)", fontWeight: 300,
                    fontStyle: "italic", lineHeight: 1.15, color: "#EDE9DE" }}
                  initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: BASE + S*2 + i*0.18, ease: [0.16,1,0.3,1] }}>
                  {line}
                </motion.span>
              ))}
            </h1>

            {/* Body */}
            <motion.p style={{ fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(237,233,222,0.58)",
              lineHeight: 1.75, fontWeight: 300, maxWidth: "420px",
              fontFamily: "var(--font-sans)", marginBottom: "2.5rem" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: BASE + S*2 + 0.54 + 0.1, ease: "easeOut" }}>
              Emerging from India&apos;s ancient Siddha and Ayurvedic traditions.
              Formulated for the modern seeker of systemic vitality.
            </motion.p>

            {/* CTAs */}
            <motion.div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "3rem" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: BASE + S*2 + 0.54 + 0.28, ease: "easeOut" }}>
              <Link href="#shop"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px",
                  border: "0.5px solid rgba(237,233,222,0.75)", color: "#EDE9DE",
                  padding: "14px 32px", fontSize: "11px", letterSpacing: "0.22em",
                  textTransform: "uppercase", fontFamily: "var(--font-sans)",
                  fontWeight: 500, textDecoration: "none",
                  transition: "background 0.45s ease, color 0.45s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#EDE9DE"; (e.currentTarget as HTMLElement).style.color="#0A120A"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.color="#EDE9DE"; }}>
                Discover the Collection
              </Link>
              <Link href="#the-house"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px",
                  color: "rgba(237,233,222,0.5)", padding: "14px 8px", fontSize: "11px",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  fontFamily: "var(--font-sans)", fontWeight: 400, textDecoration: "none",
                  transition: "color 0.3s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color="#EDE9DE"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color="rgba(237,233,222,0.5)"; }}>
                The House <span style={{ display: "inline-block", transition: "transform 0.3s" }}>→</span>
              </Link>
            </motion.div>

            {/* Trust */}
            <motion.p style={{ fontSize: "9px", letterSpacing: "0.24em", textTransform: "uppercase",
              color: "rgba(237,233,222,0.22)", fontFamily: "var(--font-sans)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: BASE + S*2 + 0.54 + 0.55 }}>
              Wildcrafted · Vegan · Small Batch · Zero Synthetics
            </motion.p>

            {/* Mobile thumbnail row */}
            <motion.div className="lg:hidden mt-12 flex gap-3 overflow-x-auto pb-2"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              style={{ scrollbarWidth: "none" }}>
              {PRODUCTS.map((p, i) => (
                <button key={p.id} onClick={() => setActive(i)} aria-label={p.label}
                  style={{ flexShrink: 0, width: "72px", height: "72px", position: "relative",
                    border: i === active ? "0.5px solid rgba(200,151,58,0.6)" : "0.5px solid rgba(237,233,222,0.1)",
                    borderRadius: "4px", background: "rgba(14,22,14,0.7)", overflow: "hidden",
                    cursor: "pointer", padding: 0, transition: "border-color 0.3s" }}>
                  <Image src={p.src} alt={p.alt} fill sizes="72px" className="object-contain"
                    style={{ mixBlendMode: p.screenBlend ? "screen" : "normal" }} />
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom blend */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: "120px", background: "linear-gradient(to bottom,transparent 0%,#0A120A 100%)" }} />

        <ScrollIndicator visible={!scrolled} />
      </section>
    </>
  );
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  3 VIDEO RECOMMENDATIONS — best match for Sampriti brand
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🥇 BEST — Rose petals on pure black, slow cinematic drift
     URL: https://www.pexels.com/video/beautiful-close-up-of-rose-petals-8547602/
     Why: Deep crimson petals on black — directly mirrors your Rose
          + Hibiscus jar products. Very dark, almost no overlay needed.
     Set opacity: 0.75

  🥈 SECOND — Herbs & spices macro on dark stone surface
     URL: https://www.pexels.com/video/close-up-shot-of-herbs-and-spices-3773897/
     Why: Warm earthy turmeric/cardamom tones match Black Turmeric +
          Butterfly Pea story. Reinforces "Ayurvedic" authenticity.
     Set opacity: 0.65

  🥉 THIRD — Ritual smoke / steam on black background
     URL: https://www.pexels.com/video/smoke-on-black-background-855282/
     Why: Abstract rising smoke on pure black. Most evocative of
          "Ritual Science" brand language. Most premium look overall.
     Set opacity: 0.55

  STEPS:
  1. Open URL → click "Free Download" → choose 1080p
  2. Save to: /public/videos/hero-botanicals.mp4
  3. Update opacity value in AmbientVideo() above
  4. Deploy — the dark gradient fallback shows while loading

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PRODUCT IMAGE FILENAMES — copy to /public/images/products/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  shakti-peya-tubes.png    ← rename from: sampriti__14_.png
  rose-jar.png             ← rename from: sampriti_rose_1.png
  hibiscus-jar.png         ← rename from: Sanpriti_Hibiscus_zoom_out.png
  butterfly-pea-jar.png    ← rename from: Sampriti_Butterfly_Pea_Zoom_out.png
  black-turmeric-jar.png   ← rename from: Sampriti_Black_Turmeric_Zoom_out.png

  WHY mix-blend-mode: screen WORKS FOR WHITE-BG JARS:
  screen blend formula: result = 1 - (1-src)*(1-bg)
  On a dark (#0A120A) background:
    white pixels (1.0) → 1 - (0)(~0) = 1.0 → becomes transparent-ish
    amber jar glass    → blends naturally, preserving rich tones
  Net result: jar floats with no white box. Zero Photoshop needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TAILWIND TOKENS (tailwind.config.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  colors: {
    gold:             '#C8973A',
    bark:             '#0A120A',
    'parchment-text': '#EDE9DE',
    sage:             '#7A9A72',
  },
  fontFamily: {
    serif: ['Cormorant Garamond', 'serif'],
    sans:  ['DM Sans', 'sans-serif'],
  },
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/