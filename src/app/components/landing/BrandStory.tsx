"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
//  3D COVERFLOW CAROUSEL
// ═══════════════════════════════════════════════════════════════

type Position = "left" | "center" | "right";

interface SlideImage {
  src: string;
  alt: string;
  label: string;
  sublabel: string;
}

const CAROUSEL_IMAGES: SlideImage[] = [
  { src: "/Assets/The house 1.webp",           alt: "A Botanical Pilgrimage", label: "The House",    sublabel: "Origins & Lineage" },
  { src: "/Assets/forest girl.webp",          alt: "Forest Girl",            label: "Forest Ritual", sublabel: "Wild Botanicals"   },
  { src: "/Assets/perume distillation.webp",  alt: "Perfume Distillation",   label: "Distillation",  sublabel: "Sacred Process"    },
];

const INTERVAL_MS = 3000;

function getSlotVariant(pos: Position) {
  switch (pos) {
    case "center": return { x: "0%",    y: "-50%", scale: 1,    rotateY: 0,   z: 0,    opacity: 1,    filter: "blur(0px) brightness(1)",            zIndex: 30 };
    case "left":   return { x: "-64%",  y: "-50%", scale: 0.76, rotateY: 24,  z: -200, opacity: 0.88, filter: "blur(3.5px) brightness(0.52)",        zIndex: 10 };
    case "right":  return { x: "64%",   y: "-50%", scale: 0.76, rotateY: -24, z: -200, opacity: 0.88, filter: "blur(3.5px) brightness(0.52)",        zIndex: 10 };
  }
}

function getPositions(active: number, total: number): Position[] {
  return Array.from({ length: total }, (_, i) => {
    if (i === active) return "center";
    if (i === (active - 1 + total) % total) return "left";
    return "right";
  });
}

const CARD_TRANSITION = { duration: 0.85, ease: [0.43, 0.13, 0.23, 0.96] as [number,number,number,number] };

function CoverflowCarousel() {
  const [active, setActive] = useState(0);
  const total = CAROUSEL_IMAGES.length;

  const advance = useCallback(() => setActive((p) => (p + 1) % total), [total]);
  const goTo = (i: number) => setActive(i);

  useEffect(() => {
    const t = setInterval(advance, INTERVAL_MS);
    return () => clearInterval(t);
  }, [advance]);

  const positions = getPositions(active, total);

  return (
    <div className="relative w-full select-none">
      {/* 3D Stage */}
      <div className="relative w-full overflow-hidden" style={{ perspective: "1400px", perspectiveOrigin: "50% 40%" }}>
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            paddingLeft: "20%",
            paddingRight: "20%",
            height: "clamp(360px, 42vw, 620px)",
          }}
        >
          {CAROUSEL_IMAGES.map((img, i) => {
            const pos = positions[i];
            const variant = getSlotVariant(pos);
            return (
              <motion.div
                key={img.src}
                animate={variant}
                transition={CARD_TRANSITION}
                onClick={() => pos !== "center" && goTo(i)}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: "clamp(300px, 34vw, 620px)",
                  marginLeft: "calc(clamp(300px, 34vw, 620px) / -2)",
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                  willChange: "transform, filter, opacity",
                  cursor: pos !== "center" ? "pointer" : "default",
                }}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    borderRadius: "18px",
                    boxShadow: pos === "center"
                      ? "0 40px 90px rgba(0,0,0,0.25), 0 10px 30px rgba(0,0,0,0.15)"
                      : "0 14px 40px rgba(0,0,0,0.20)",
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={900}
                    height={1100}
                    className="w-full h-auto block"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 55vw, 40vw"
                    priority={i === 0}
                    draggable={false}
                  />

                  {pos === "center" && (
                    <>
                      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(140deg,rgba(255,255,255,0.12) 0%,transparent 55%,rgba(0,0,0,0.08) 100%)", borderRadius: "18px" }} />
                      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(to top,rgba(244,241,234,0.88) 0%,rgba(244,241,234,0.3) 55%,transparent 100%)", borderRadius: "0 0 18px 18px" }} />
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`lbl-${active}`}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.42, delay: 0.28 }}
                          className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10"
                        >
                          <p style={{ fontFamily: "var(--font-sans,'DM Sans',sans-serif)", fontSize: "0.58rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#A48662", marginBottom: "5px" }}>{img.sublabel}</p>
                          <p style={{ fontFamily: "var(--font-serif,Georgia,serif)", fontSize: "1.2rem", fontWeight: 300, color: "#2B2925", letterSpacing: "0.05em" }}>{img.label}</p>
                        </motion.div>
                      </AnimatePresence>
                    </>
                  )}

                  {pos !== "center" && (
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(244,241,234,0.18)", borderRadius: "18px" }} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3 mt-8">
        <p style={{ fontFamily: "var(--font-sans,'DM Sans',sans-serif)", fontSize: "0.6rem", letterSpacing: "0.42em", textTransform: "uppercase", color: "#A48662" }}>
          {String(active + 1).padStart(2, "0")}&nbsp;&nbsp;/&nbsp;&nbsp;{String(total).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-2">
          {CAROUSEL_IMAGES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} style={{ width: 36, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.span
                animate={{ width: i === active ? 26 : 5, opacity: i === active ? 1 : 0.28, backgroundColor: i === active ? "#A48662" : "rgba(164,134,98,0.4)" }}
                transition={{ duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ display: "block", height: 3, borderRadius: 99 }}
              />
            </button>
          ))}
        </div>
        <div style={{ width: 90, height: 1, background: "rgba(164,134,98,0.15)", borderRadius: 99, overflow: "hidden" }}>
          <motion.div
            key={`prog-${active}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: INTERVAL_MS / 1000, ease: "linear" }}
            style={{ height: "100%", background: "#A48662", borderRadius: 99 }}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  BRAND STORY  (original — all sections intact)
// ═══════════════════════════════════════════════════════════════

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

export default function BrandStory() {
  return (
    <section id="the-house" className="bg-white overflow-x-hidden scroll-mt-28">
      <div className="pt-36 pb-12 md:pt-40 md:pb-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <p className="text-[#A48662] text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: "var(--font-sans)" }}>THE HOUSE</p>
            <h2 className="text-[#2B2925] text-4xl md:text-5xl lg:text-6xl font-light" style={{ fontFamily: "var(--font-serif)" }}>
              Explore the foundations of our practice
            </h2>
            <p className="text-[#5A554E] mt-4 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              that transform raw botanicals into ritualized care.
            </p>
          </motion.div>

          {/* 3D Coverflow Carousel */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="mb-8"
          >
            <CoverflowCarousel />
          </motion.div>

          {/* Title Below Images */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="max-w-4xl mx-auto text-center mb-16">
            <h3 className="text-[#2B2925] text-2xl md:text-3xl font-light" style={{ fontFamily: "var(--font-serif)" }}>A Botanical Pilgrimage</h3>
          </motion.div>

          {/* Explore More Button */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="text-center">
            <Link 
              href="/the-house/overview"
              className="inline-block bg-[#262420] text-[#F9F7F3] px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-black transition-all duration-300"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            >
              Explore More
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
