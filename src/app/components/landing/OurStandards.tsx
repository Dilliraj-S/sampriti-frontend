"use client";

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
  return (
    <section style={{ background: "#F5F0EA", marginTop: "0", marginBottom: "120px" }}>
      <style>{`
        .standards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border-top: 1px solid rgba(164,134,98,0.12);
          border-bottom: 1px solid rgba(164,134,98,0.12);
        }
        .standard-tile {
          padding: 32px 24px;
          position: relative;
          background: transparent;
          border-right: 1px solid rgba(164,134,98,0.08);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .standard-tile:nth-child(2n) {
          border-right: none;
        }
        .standard-tile:nth-child(n+3) {
          border-top: 1px solid rgba(164,134,98,0.08);
        }
        .tile-label {
          font-family: "Tenor Sans", sans-serif;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: #2B2925;
          margin: 0 0 6px;
          line-height: 24px;
          font-size: 16px;
        }
        @media (max-width: 767px) {
          .tile-label {
            font-size: 14px;
            line-height: 20px;
          }
          .standard-tile {
            padding: 24px 16px;
          }
        }
        .tile-sub {
          font-family: var(--font-sans);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: capitalize;
          color: #7A7670;
          margin: 0;
          line-height: 1.5;
          opacity: 0.7;
        }
        @media (min-width: 1024px) {
          .standards-grid {
            grid-template-columns: repeat(8, 1fr);
          }
          .standard-tile {
            padding: 36px 18px;
            border-bottom: none;
          }
          .standard-tile:nth-child(4n) {
            border-right: 1px solid rgba(164,134,98,0.08);
          }
          .standard-tile:nth-child(8n) {
            border-right: none;
          }
          .standard-tile:nth-child(n+5) {
            border-top: none;
          }
        }
      `}</style>

      <div style={{ padding: "20px 26px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <h2 style={{
            fontFamily: '"Tenor Sans", sans-serif',
            fontSize: "clamp(22px, 2.8vw, 32px)",
            fontWeight: 400,
            letterSpacing: "0.08em",
            color: "#2B2925",
            margin: 0,
            whiteSpace: "nowrap",
          }}>
            Our Standards
          </h2>
        </div>

        <div className="standards-grid">
          {standards.map((item, i) => (
            <div key={i} className="standard-tile">
              <p className="tile-label">
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