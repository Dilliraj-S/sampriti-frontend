"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const processSteps = [
  {
    stage: "01",
    label: "Plant",
    sublabel: "Botanical Selection",
    description: "Wildcrafted from verified terroirs across the subcontinent",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="26" height="26">
        <path d="M24 40V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 26C24 18 16 14 10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 30C24 22 32 16 38 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    stage: "02",
    label: "Harvest",
    sublabel: "Seasonal Timing",
    description: "Hand-harvested at peak potency, aligned with lunar cycles",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="26" height="26">
        <path d="M10 36L20 20L28 28L36 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 12h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="36" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    stage: "03",
    label: "Dry",
    sublabel: "Shade Drying",
    description: "Slow shade-dried to preserve volatile oils and enzymatic activity",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="26" height="26">
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13.5 13.5l2.8 2.8M31.7 31.7l2.8 2.8M13.5 34.5l2.8-2.8M31.7 16.3l2.8-2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    stage: "04",
    label: "Extract",
    sublabel: "Cold Process",
    description: "Cold-extracted without heat to retain full phytochemical complexity",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="26" height="26">
        <path d="M18 8l-6 18h24L30 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="26" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 33h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    stage: "05",
    label: "Blend",
    sublabel: "Formulation",
    description: "Precisely calibrated ratios, guided by classical pharmacopoeia",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="26" height="26">
        <circle cx="18" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="30" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    stage: "06",
    label: "Package",
    sublabel: "The Vessel",
    description: "Glass, cork, recycled fibre — no footprint, only a legacy of wellness",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="26" height="26">
        <rect x="16" y="14" width="16" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 14V10a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 26h8M20 31h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function ProcessFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-36 relative overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      <style>{`
        /* ── Box fill sweep ──────────────────────────────────────────────────
           The dark fill starts at width:0 and sweeps right on hover.
           No glow, no shadow — just a clean directional wipe.
        ────────────────────────────────────────────────────────────────────── */
        .process-box {
          position: relative;
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(164,134,98,0.3);
          background: transparent;
          color: #A48662;
          overflow: hidden;
          transition: border-color 0.3s ease, color 0.2s ease 0.1s;
        }

        /* The sweep fill */
        .process-box::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0%;
          height: 100%;
          background: #2B2925;
          transition: width 0.32s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }

        .process-step:hover .process-box::after {
          width: 100%;
        }

        /* Icon floats above the fill */
        .process-box > svg {
          position: relative;
          z-index: 1;
        }

        .process-step:hover .process-box {
          border-color: #2B2925;
          color: #F9F7F3;
        }

        /* Drop connector */
        .process-connector {
          width: 1px;
          height: 20px;
          background: rgba(164,134,98,0.3);
          flex-shrink: 0;
          transition: background 0.3s ease;
        }

        .process-step:hover .process-connector {
          background: #A48662;
        }

        /* Stage number */
        .process-stage {
          transition: opacity 0.25s ease;
        }

        .process-step:hover .process-stage {
          opacity: 0.8 !important;
        }

        /* Label — subtle lift */
        .process-label {
          transition: transform 0.25s ease;
        }

        .process-step:hover .process-label {
          transform: translateY(-1px);
        }

        /* Description — slides up from rest */
        .process-desc {
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .process-step:hover .process-desc {
          opacity: 1;
          transform: translateY(0);
        }

        /* Mobile box */
        .process-box-sm {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(164,134,98,0.3);
          background: transparent;
          color: #A48662;
          position: relative;
          overflow: hidden;
        }

        .process-box-sm::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0%;
          height: 100%;
          background: #2B2925;
          transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }

        .process-box-sm:active::after {
          width: 100%;
        }

        .process-box-sm > svg {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* ── Section header ── */}
      <div className="px-6 md:px-14 mb-16 md:mb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-12" style={{ background: "#2B2925" }} />
            <p
              className="text-xs tracking-[0.38em] uppercase"
              style={{ color: "#2B2925", fontFamily: "var(--font-sans)" }}
            >
              The Process
            </p>
          </div>
          <h2
            className="text-4xl md:text-5xl font-light leading-tight max-w-lg"
            style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
          >
            From Living Plant<br className="hidden md:block" /> to Ritual
          </h2>
        </motion.div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block px-14 max-w-7xl mx-auto">

        {/* Scroll-driven progress line */}
        <div className="relative" style={{ height: "1px", marginBottom: "0" }}>
          <div
            className="absolute inset-0"
            style={{ background: "rgba(44,41,37,0.12)" }}
          />
          <motion.div
            className="absolute left-0 top-0 h-full origin-left"
            style={{ background: "#2B2925", width: lineWidth }}
          />
        </div>

        {/* Steps grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${processSteps.length}, 1fr)`,
          }}
        >
          {processSteps.map((step, i) => (
            <motion.div
              key={step.stage}
              className="process-step flex flex-col items-center"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Vertical drop connector */}
              <div className="process-connector" />

              {/* Square icon box with sweep fill */}
              <div className="process-box">
                {step.icon}
              </div>

              {/* Stage */}
              <p
                className="process-stage"
                style={{
                  marginTop: "13px",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "#A48662",
                  opacity: 0.45,
                  fontFamily: "var(--font-sans)",
                  textAlign: "center",
                }}
              >
                {step.stage}
              </p>

              {/* Label */}
              <h4
                className="process-label"
                style={{
                  marginTop: "4px",
                  fontSize: "15px",
                  fontWeight: 300,
                  fontFamily: "var(--font-serif)",
                  color: "#2B2925",
                  textAlign: "center",
                }}
              >
                {step.label}
              </h4>

              {/* Sublabel */}
              <p
                style={{
                  marginTop: "3px",
                  fontSize: "11px",
                  fontStyle: "italic",
                  color: "#A48662",
                  fontFamily: "var(--font-sans)",
                  textAlign: "center",
                }}
              >
                {step.sublabel}
              </p>

              {/* Description — slides up on hover */}
              <p
                className="process-desc"
                style={{
                  marginTop: "10px",
                  fontSize: "11px",
                  lineHeight: 1.75,
                  color: "#5A554E",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 300,
                  textAlign: "center",
                  padding: "0 6px",
                  minHeight: "52px",
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── MOBILE — vertical stack ── */}
      <div className="md:hidden px-6 space-y-0 max-w-2xl mx-auto">
        {processSteps.map((step, i) => (
          <motion.div
            key={step.stage}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.07 }}
            className="flex items-start gap-5 py-6"
            style={{
              borderBottom: i < processSteps.length - 1
                ? "1px solid rgba(164,134,98,0.15)"
                : "none",
            }}
          >
            {/* Left: icon box + vertical line */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="process-box-sm">
                {step.icon}
              </div>
              {i < processSteps.length - 1 && (
                <div
                  style={{
                    width: "1px",
                    height: "100%",
                    minHeight: "20px",
                    marginTop: "8px",
                    background: "rgba(164,134,98,0.18)",
                  }}
                />
              )}
            </div>

            {/* Right: text */}
            <div className="pt-1">
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "#A48662",
                  opacity: 0.5,
                  fontFamily: "var(--font-sans)",
                  marginBottom: "3px",
                }}
              >
                {step.stage}
              </p>
              <h4
                style={{
                  fontSize: "17px",
                  fontWeight: 300,
                  fontFamily: "var(--font-serif)",
                  color: "#2B2925",
                  marginBottom: "2px",
                }}
              >
                {step.label}
              </h4>
              <p
                style={{
                  fontSize: "11px",
                  fontStyle: "italic",
                  color: "#A48662",
                  fontFamily: "var(--font-sans)",
                  marginBottom: "6px",
                }}
              >
                {step.sublabel}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.75,
                  color: "#5A554E",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 300,
                }}
              >
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}