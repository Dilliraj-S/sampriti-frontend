"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

export default function ProvenanceHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={ref}
      id="provenance"
      className="relative w-full min-h-screen flex items-end overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ scale: bgScale, y: bgY }}
      >
        <img
          src="/Assets/provenance hero.jpg"
          alt="Provenance hero"
          className="w-full h-full object-cover object-center"
        />
        {/* Multi-layer overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.2) 100%)",
          }}
        />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 pb-20 md:pb-28"
        style={{ y: textY, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Decorative top rule */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "#A48662" }} />
          <p
            className="text-xs tracking-[0.45em] uppercase"
            style={{ color: "#A48662", fontFamily: "var(--font-sans)", letterSpacing: "0.45em" }}
          >
            Provenance
          </p>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] text-white mb-5 sm:mb-7"
          style={{ fontFamily: "var(--font-serif)", maxWidth: "820px" }}
        >
          High-functioning botanicals,{" "}
          <em className="italic" style={{ color: "rgba(255,255,255,0.7)" }}>
            sourced from their most potent geographical origins.
          </em>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl"
          style={{
            color: "rgba(255,255,255,0.8)",
            fontFamily: "var(--font-sans)",
            fontWeight: 300,
          }}
        >
          Every formulation begins long before the vessel — in the soil, the altitude, the silence
          of ancient landscapes where plants have been refined by millennia of precise conditions.
        </motion.p>

        {/* Scroll cue */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <div className="w-px h-10 mx-auto" style={{ background: "#A48662", opacity: 0.6 }}>
              <motion.div
                className="w-full"
                style={{ background: "#A48662", height: "40%" }}
                animate={{ y: ["0%", "160%", "0%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-sans)" }}
          >
            Scroll to explore
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}