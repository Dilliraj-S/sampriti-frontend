"use client";

import { useState } from "react";

const standards = [
  { label: "Ethically Sourced",   sub: "Traced from origin to bottle" },
  { label: "Clean Formulations",  sub: "Zero synthetic fillers or binders" },
  { label: "Dosage Specific",     sub: "Precision-calibrated every batch" },
  { label: "Small-Batch Crafted", sub: "Hand-reviewed and approved" },
  { label: "No Additives",        sub: "Pure. Nothing more, nothing less" },
  { label: "No Animal Testing",   sub: "Cruelty-free across every stage" },
  { label: "Vegan",               sub: "Entirely plant-derived" },
  { label: "Gluten Free",         sub: "Safe for every body, by design" },
];

export default function OurStandards() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ background: "#F5F0EA", marginTop: "0", marginBottom: "120px" }}>
      <style>{`
        @keyframes bloomIn {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .standard-tile {
          position: relative;
          background: rgba(255,255,255,0.45);
          transition: background 0.5s ease, box-shadow 0.5s ease, transform 0.4s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 22px 20px;
          min-height: 90px;
          cursor: pointer;
          backdrop-filter: blur(2px);
        }
        .standard-tile:hover {
          background: rgba(255,255,255,0.92);
          box-shadow:
            0 0 0 1px rgba(164,134,98,0.2),
            0 8px 32px rgba(164,134,98,0.13),
            0 2px 8px rgba(164,134,98,0.08);
          transform: translateY(-2px) scale(1.012);
          z-index: 2;
        }
        .tile-label {
          font-family: "Tenor Sans", sans-serif;
          font-weight: 400;
          letter-spacing: 0.1em;
          color: #2B2925;
          margin: 0;
          line-height: 24px;
          transition: color 0.4s ease, transform 0.4s ease;
        }
        .standard-tile:hover .tile-label {
          color: #333333;
          transform: translateY(-3px);
        }
        .tile-rule {
          margin-top: 8px;
          height: 1px;
          background: linear-gradient(90deg, #A48662, rgba(164,134,98,0));
          width: 14px;
          opacity: 0.4;
          transition: width 0.4s ease, opacity 0.45s ease;
        }
        .standard-tile:hover .tile-rule {
          width: 28px;
          opacity: 0.85;
        }
        .tile-sub {
          font-family: var(--font-sans);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #333333;
          margin: 7px 0 0;
          line-height: 1.6;
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 0.35s ease, transform 0.35s ease;
          max-width: 90%;
        }
        .standard-tile:hover .tile-sub {
          opacity: 0.85;
          transform: translateY(0);
        }
        .tile-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 60%, rgba(164,134,98,0.10) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .standard-tile:hover .tile-glow {
          opacity: 1;
        }
        .corner-tl {
          position: absolute; top: 10px; left: 10px;
          width: 9px; height: 9px;
          border-top: 1px solid rgba(164,134,98,0.25);
          border-left: 1px solid rgba(164,134,98,0.25);
          transition: border-color 0.4s ease, width 0.4s ease, height 0.4s ease;
        }
        .standard-tile:hover .corner-tl {
          border-color: rgba(164,134,98,0.65);
          width: 13px; height: 13px;
        }
        .corner-br {
          position: absolute; bottom: 10px; right: 10px;
          width: 9px; height: 9px;
          border-bottom: 1px solid rgba(164,134,98,0.25);
          border-right: 1px solid rgba(164,134,98,0.25);
          transition: border-color 0.4s ease, width 0.4s ease, height 0.4s ease;
        }
        .standard-tile:hover .corner-br {
          border-color: rgba(164,134,98,0.65);
          width: 13px; height: 13px;
        }
      `}</style>

      <div
        className="px-6 md:px-14"
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 56px 60px" }}
      >
        {/* Centered heading */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <h2 style={{
            fontFamily: '"Tenor Sans", sans-serif',
            fontSize: "clamp(22px, 2.8vw, 32px)",
            fontWeight: 400,
            letterSpacing: "0.08em",
            color: "#2B2925",
            margin: 0,
          }}>
            Our Standards
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px]"
          style={{ background: "rgba(164,134,98,0.15)" }}>
          {standards.map((item, i) => (
            <div key={i} className="standard-tile">
              <div className="tile-glow" />
              <span className="corner-tl" />
              <span className="corner-br" />

              <p className="tile-label" style={{ fontSize: "16px" }}>
                {item.label}
              </p>

              <p className="tile-sub">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}