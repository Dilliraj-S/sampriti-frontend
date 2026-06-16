"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  {
    id: "ethically-sourced",
    numeral: "I",
    sanskrit: "Shuddhi",
    title: "Ethically Sourced",
    tagline: "From soil to vessel — with integrity.",
    description:
      "Every botanical is wildcrafted or cultivated by small, independent growers across India's biodiverse landscapes. We visit our source communities personally, ensuring fair exchange and ecological stewardship in every harvest.",
    stat: "100% traceable origin",
  },
  {
    id: "small-batch",
    numeral: "II",
    sanskrit: "Dhyana",
    title: "Small Batch Crafted",
    tagline: "Precision over volume.",
    description:
      "Our formulations are prepared in quantities calibrated to the season's harvest — never mass-produced. This discipline preserves the plant's volatile oils, enzymatic activity, and the subtle intelligence that industrial processing destroys.",
    stat: "≤ 200 units per batch",
  },
  {
    id: "zero-synthetics",
    numeral: "III",
    sanskrit: "Vimala",
    title: "Zero Synthetics",
    tagline: "The plant. Nothing else.",
    description:
      "No excipients, no fillers, no synthetic preservatives. Every ingredient is chosen for its therapeutic integrity and ancestral record of safe, effective use. Vegan. Cruelty-free. Plant-complete.",
    stat: "0 synthetic compounds",
  },
  {
    id: "traditional-lineage",
    numeral: "IV",
    sanskrit: "Parampara",
    title: "Traditional Lineage",
    tagline: "4,000 years of botanical science.",
    description:
      "We are custodians of Siddha and Ayurvedic pharmacopoeia — the oldest living medical traditions on earth. Our formulations are developed in consultation with traditional practitioners, honouring a system of healing that has been tested across millennia.",
    stat: "4,000-year Siddha lineage",
  },
];

function TrustCard({ card, index }: { card: (typeof cards)[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group relative cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      style={{ borderRadius: "4px" }}
    >
      {/* Card surface */}
      <div
        className="relative overflow-hidden transition-all duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(201,168,76,0.03) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(201,168,76,0.14)",
          borderRadius: "4px",
          boxShadow: expanded
            ? "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.22), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Gold top line */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-all duration-500"
          style={{
            background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
            opacity: expanded ? 1 : 0.4,
          }}
        />

        {/* Glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="p-7 md:p-9">
          <div className="flex items-start justify-between mb-8">
            {/* Numeral + Sanskrit */}
            <div>
              <p
                className="text-xs tracking-[0.4em] uppercase mb-1"
                style={{ color: "rgba(201,168,76,0.5)", fontFamily: "var(--font-sans)" }}
              >
                {card.numeral}
              </p>
              <p
                className="text-lg italic"
                style={{ color: "rgba(201,168,76,0.7)", fontFamily: "var(--font-serif)" }}
              >
                {card.sanskrit}
              </p>
            </div>

            {/* Expand indicator */}
            <motion.div
              animate={{ rotate: expanded ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-7 h-7 flex items-center justify-center flex-shrink-0"
              style={{
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "50%",
                color: "#c9a84c",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.2" />
                <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </motion.div>
          </div>

          <h3
            className="text-xl md:text-2xl font-light mb-2"
            style={{ fontFamily: "var(--font-serif)", color: "#f0e8d2" }}
          >
            {card.title}
          </h3>
          <p
            className="text-xs mb-5 italic"
            style={{ color: "rgba(240,232,210,0.45)", fontFamily: "var(--font-serif)" }}
          >
            {card.tagline}
          </p>

          {/* Stat */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-4"
            style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "2px",
            }}
          >
            <div className="w-1 h-1 rounded-full" style={{ background: "#c9a84c" }} />
            <span
              className="text-xs tracking-wide"
              style={{ color: "#c9a84c", fontFamily: "var(--font-sans)" }}
            >
              {card.stat}
            </span>
          </div>

          {/* Expandable description */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div
                  className="pt-4 mt-4"
                  style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(240,232,210,0.55)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
                  >
                    {card.description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrustCards() {
  return (
    <section
      className="py-24 md:py-36 px-6 md:px-14 relative overflow-hidden"
      style={{ background: "#0b1a12" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(201,168,76,0.03) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-12" style={{ background: "#c9a84c" }} />
            <p
              className="text-xs tracking-[0.4em] uppercase"
              style={{ color: "#c9a84c", fontFamily: "var(--font-sans)" }}
            >
              Our Standards
            </p>
          </div>
          <h2
            className="text-4xl md:text-6xl font-light leading-tight max-w-lg"
            style={{ fontFamily: "var(--font-serif)", color: "#f0e8d2" }}
          >
            The disciplines that define us.
          </h2>
        </motion.div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {cards.map((card, i) => (
            <TrustCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xs text-center mt-12 tracking-wide"
          style={{
            color: "rgba(240,232,210,0.25)",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.12em",
          }}
        >
          Click any card to read more ↑
        </motion.p>
      </div>
    </section>
  );
}