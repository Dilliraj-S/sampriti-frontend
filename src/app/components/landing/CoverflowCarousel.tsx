"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
//  PREMIUM CINEMATIC 3D COVERFLOW CAROUSEL
// ═══════════════════════════════════════════════════════════════

type Position = "left" | "center" | "right";

interface SlideImage {
  src: string;
  alt: string;
  label: string;
  sublabel: string;
  objectPosition: string;
  imageFilter: string;
}

const CAROUSEL_IMAGES: SlideImage[] = [
  {
    src: "/Assets/The house 1.webp",
    alt: "A Botanical Pilgrimage",
    label: "The House",
    sublabel: "Origins & Lineage",
    objectPosition: "center 40%",
    imageFilter: "brightness(0.88) contrast(1.12) saturate(1.1) sepia(0.08)",
  },
  {
    src: "/Assets/forest girl.webp",
    alt: "Forest Girl",
    label: "Forest Ritual",
    sublabel: "Wild Botanicals",
    objectPosition: "center 30%",
    imageFilter: "brightness(0.92) contrast(1.05) saturate(1.0)",
  },
  {
    src: "/Assets/perume distillation.webp",
    alt: "Perfume Distillation",
    label: "Distillation",
    sublabel: "Sacred Process",
    objectPosition: "center 20%",
    imageFilter: "brightness(0.78) contrast(1.1) saturate(0.75) hue-rotate(-8deg)",
  },
];

const INTERVAL_MS = 4200;

function getSlotVariant(pos: Position) {
  switch (pos) {
    case "center":
      return {
        x: "-50%",
        y: "-50%",
        scale: 1,
        rotateY: 0,
        z: 0,
        opacity: 1,
        filter: "blur(0px) brightness(1)",
        zIndex: 40,
      };
    case "left":
      return {
        x: "-120%",
        y: "-50%",
        scale: 0.7,
        rotateY: 28,
        z: -320,
        opacity: 0.7,
        filter: "blur(2.5px) brightness(0.5)",
        zIndex: 10,
      };
    case "right":
      return {
        x: "20%",
        y: "-50%",
        scale: 0.7,
        rotateY: -28,
        z: -320,
        opacity: 0.7,
        filter: "blur(2.5px) brightness(0.5)",
        zIndex: 10,
      };
  }
}

function getPositions(active: number, total: number): Position[] {
  return Array.from({ length: total }, (_, i) => {
    if (i === active) return "center";
    if (i === (active - 1 + total) % total) return "left";
    return "right";
  });
}

const CARD_TRANSITION = {
  duration: 1.05,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

// ─────────────────────────────────────────────────────────────
function CoverflowCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const total = CAROUSEL_IMAGES.length;

  const advance = useCallback(() => setActive((p) => (p + 1) % total), [total]);
  const goTo = (i: number) => setActive(i);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(advance, INTERVAL_MS);
    return () => clearInterval(t);
  }, [advance, paused]);

  const positions = getPositions(active, total);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: y * 6, ry: x * -6 });
  };
  const handleMouseLeave = () => {
    setPaused(false);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        // FIX A: isolation contains all 3D stacking contexts inside this boundary.
        // Prevents GPU-composited card layers from bleeding above the fixed navbar.
        isolation: "isolate",
        // FIX B: clip any card edges that would otherwise paint above this wrapper.
        // The side cards use negative x offsets and can creep upward in 3D space.
        overflow: "hidden",
      }}
    >
      {/* ── 3D Stage ───────────────────────────────────────────── */}
      <div
        className="relative w-full"
        onMouseMove={handleMouseMove}
        style={{
          perspective: "1800px",
          perspectiveOrigin: "50% 45%",
        }}
      >
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            // transformStyle: "preserve-3d" intentionally removed from this wrapper.
            // It was promoting the container to a GPU compositing layer that rendered
            // above the navbar. Individual cards below still have it — that's enough.
            paddingLeft: "20%",
            paddingRight: "20%",
            height: "clamp(420px, 46vw, 680px)",
          }}
        >
          {CAROUSEL_IMAGES.map((img, i) => {
            const pos = positions[i];
            const variant = getSlotVariant(pos);

            return (
              <motion.div
                key={img.src}
                animate={{
                  ...variant,
                  rotateX: pos === "center" ? tilt.rx : 0,
                  rotateY: pos === "center" ? tilt.ry : variant.rotateY,
                }}
                whileHover={pos === "center" ? { scale: 1.03 } : {}}
                transition={CARD_TRANSITION}
                onClick={() => pos !== "center" && goTo(i)}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "56%",
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                  willChange: "transform, filter, opacity",
                  cursor: pos !== "center" ? "pointer" : "default",
                }}
              >
                {/* Card shell */}
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    borderRadius: "18px",
                    boxShadow:
                      pos === "center"
                        ? "0 50px 120px rgba(0,0,0,0.45), 0 20px 50px rgba(0,0,0,0.25)"
                        : "0 18px 50px rgba(0,0,0,0.25)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: "125%",
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      style={{
                        objectFit: "cover",
                        objectPosition: img.objectPosition,
                        filter: img.imageFilter,
                        transition: "filter 1.05s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 55vw, 40vw"
                      priority={i === 0}
                      draggable={false}
                    />

                    {/* Cinematic overlays — center only */}
                    {pos === "center" && (
                      <>
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(120deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.12) 100%)",
                            borderRadius: "18px",
                            zIndex: 1,
                          }}
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(6,8,6,0.97) 0%, rgba(6,8,6,0.82) 30%, rgba(6,8,6,0.55) 55%, rgba(6,8,6,0.0) 78%)",
                            borderRadius: "0 0 18px 18px",
                            zIndex: 1,
                            height: "68%",
                          }}
                        />

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`lbl-${active}`}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.48, delay: 0.32 }}
                            className="absolute bottom-0 left-0 right-0 px-6 pb-7"
                            style={{ zIndex: 2 }}
                          >
                            <p
                              style={{
                                fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
                                fontSize: "0.55rem",
                                letterSpacing: "0.5em",
                                textTransform: "uppercase",
                                color: "rgba(201,168,76,1)",
                                marginBottom: "6px",
                                textShadow: "0 1px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)",
                              }}
                            >
                              {img.sublabel}
                            </p>
                            <p
                              style={{
                                fontFamily: "var(--font-serif, Georgia, serif)",
                                fontSize: "1.15rem",
                                fontWeight: 300,
                                color: "rgba(255,252,245,1)",
                                letterSpacing: "0.07em",
                                textShadow: "0 2px 16px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.7)",
                              }}
                            >
                              {img.label}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </>
                    )}

                    {/* Side card atmospheric veil */}
                    {pos !== "center" && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: "rgba(10,12,10,0.22)",
                          borderRadius: "18px",
                          zIndex: 1,
                        }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Controls ───────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 mt-8">
        <p
          style={{
            fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
            fontSize: "0.58rem",
            letterSpacing: "0.48em",
            textTransform: "uppercase",
            color: "rgba(201,168,76,0.7)",
          }}
        >
          {String(active + 1).padStart(2, "0")}&nbsp;&nbsp;/&nbsp;&nbsp;{String(total).padStart(2, "0")}
        </p>

        <div className="flex items-center gap-2">
          {CAROUSEL_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: 36,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.span
                animate={{
                  width: i === active ? 26 : 5,
                  opacity: i === active ? 1 : 0.28,
                  backgroundColor:
                    i === active ? "rgba(201,168,76,0.9)" : "rgba(164,134,98,0.35)",
                }}
                transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ display: "block", height: 3, borderRadius: 99 }}
              />
            </button>
          ))}
        </div>

        {!paused && (
          <div
            style={{
              width: 90,
              height: 1,
              background: "rgba(164,134,98,0.12)",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <motion.div
              key={`prog-${active}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: INTERVAL_MS / 1000, ease: "linear" }}
              style={{
                height: "100%",
                background: "rgba(201,168,76,0.75)",
                borderRadius: 99,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  BRAND STORY
// ═══════════════════════════════════════════════════════════════

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

export default function BrandStory() {
  return (
    <section id="the-house" className="bg-white">
      {/* pt-36/pt-40: extra clearance so the 3D cards never bleed into the fixed navbar
          on direct page load. pt-28 was enough for normal content but the side cards
          in preserve-3d space extend upward beyond the section's top edge. */}
      <div className="pt-36 pb-12 md:pt-40 md:pb-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <p
              className="text-[#A48662] text-xs tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              THE HOUSE
            </p>
            <h2
              className="text-[#2B2925] text-4xl md:text-5xl lg:text-6xl font-light"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Explore the foundations of our practice
            </h2>
            <p
              className="text-[#5A554E] mt-4 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              that transform raw botanicals into ritualized care.
            </p>
          </motion.div>

          {/* Cinematic 3D Coverflow */}
          {/* The extra paddingTop here acts as a second safety net:
              even if 3D card edges mathematically extend above the wrapper,
              they start far enough below the viewport top to never hit the navbar. */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="mb-8"
            style={{ paddingTop: "8px" }}
          >
            <CoverflowCarousel />
          </motion.div>

          {/* Title below carousel */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h3
              className="text-[#2B2925] text-2xl md:text-3xl font-light"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A Botanical Pilgrimage
            </h3>
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="text-center"
          >
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