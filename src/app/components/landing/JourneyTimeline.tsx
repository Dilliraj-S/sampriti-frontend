"use client";

import { useState, useRef } from "react";

const steps = [
  {
    id: 1,
    subtitle: "Sourcing",
    location: "Palani Massif, Western Ghats — 2,000m",
    title: "The High-Altitude Bloom",
    description:
      "Our Hibiscus is defined by the thin air and intense solar radiation of the Western Ghats. Harvested from the same contours where Siddha lineages first codified the science of rejuvenation.",
    quote: "A botanical of rare clarity — refined by altitude and the silence of the peaks.",
    image: "/Assets/img 2.avif",
    tag: "Hibiscus · Rosa-Sinensis",
  },
  {
    id: 2,
    subtitle: "Finale",
    location: "Crafted with Devotion",
    title: "From Plant to Ritual",
    description:
      "Every infusion represents the culmination of ancient wisdom and modern craftsmanship. A ritual in itself, crafted to bring balance and vitality to your daily practice.",
    quote: "This is not consumption. This is devotion made drinkable.",
    image: "/Assets/pexels-rahibyaqubov-14989568.jpg",
    tag: "Crafted with Love",
  },
  {
    id: 3,
    subtitle: "Origins",
    location: "Ancient Siddha Traditions",
    title: "Where Wisdom Began",
    description:
      "Where Siddha sages once meditated on the subtle intelligence of plants. Here, we source herbs that carry the vibration of ancient silence — the foundation of all our botanical preparations.",
    quote: "The foundation of all our botanical preparations.",
    image: "/Assets/pexels-2160239255-36617477.jpg",
    tag: "Siddha Heritage",
  },
  {
    id: 4,
    subtitle: "Processing",
    location: "Kolli Hills — The Mountain of Seventy Forests",
    title: "The Kolli Anomaly",
    description:
      "Sourced from the mist-shrouded Eastern Ghats — a landscape of ancient biodiversity and vertical forests. Our Cardamom carries a singular aromatic profile, nurtured by a micro-climate undisturbed for centuries.",
    quote: "Small-batch dried and cold-pressed within 72 hours of harvest.",
    image: "/Assets/pexels-frostydog-10369138.jpg",
    tag: "Cardamom · Elettaria Cardamomum",
  },
  {
    id: 5,
    subtitle: "Formulation",
    location: "Aravalli Range, Rajasthan",
    title: "The Aravalli Bloom",
    description:
      "Sourced from the ancient, mineral-rich foothills of the Aravalli Range. Intense desiccating heat meeting hidden springs creates a Stress-Potency bloom of rare concentration.",
    quote: "Each formulation is a precise calibration — nothing added that does not serve.",
    image: "/Assets/img 3.avif",
    tag: "Rose · Rosa Damascena",
  },
  {
    id: 6,
    subtitle: "Ritual",
    location: "Coastal Plains — Regenerative Soil",
    title: "The Southern Integrity",
    description:
      "Our Southern partners operate on a timeline of seasons, not markets. No synthetics. No interference. Only the raw integrity of the plant, crafted in small batches.",
    quote: "This is not consumption. This is devotion made drinkable.",
    image: "/Assets/img 4.avif",
    tag: "Wildcrafted · Small Batch",
  },
  {
    id: 7,
    subtitle: "The Vessel",
    location: "Protection, not just packaging",
    title: "The Conscious Artifact",
    description:
      "A precise calibration of light and material designed for botanical longevity. Glass, cork, and recycled fibre — chosen deliberately because the integrity of the formula is only as strong as the vessel that holds it.",
    quote: "The integrity of the formula is only as strong as the vessel that holds it.",
    image: "/Assets/pomelli-image (42).png",
    tag: "Sustainable Packaging",
  },
];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function JourneyTimeline() {
  const [active, setActive] = useState(0);
  const [imgKey, setImgKey] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);

  const step = steps[active];
  const progress = (active / (steps.length - 1)) * 100;

  const go = (idx: number) => {
    if (idx < 0 || idx >= steps.length || idx === active) return;
    setContentVisible(false);
    setTimeout(() => {
      setActive(idx);
      setImgKey((k) => k + 1);
      setContentVisible(true);
    }, 200);
    const pill = navRef.current?.children[idx] as HTMLElement;
    pill?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const navBtn = (disabled: boolean): React.CSSProperties => ({
    background: "none",
    border: "none",
    padding: "8px 0",
    cursor: disabled ? "default" : "pointer",
    fontSize: "10px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#6F665D",
    opacity: disabled ? 0.18 : 0.65,
    transition: "opacity 0.2s",
    fontFamily: "var(--font-sans)",
  });

  return (
    <section
      className="py-20 md:py-28"
      style={{ background: "#FFFFFF" }}
      aria-label="Our process"
    >
      {/* ── Section heading ── */}
      <div className="mx-auto mb-10 max-w-3xl px-6 text-center md:mb-14">
        <p
          className="mb-4 text-xs uppercase tracking-[0.4em]"
          style={{ color: "#A48662", fontFamily: "var(--font-sans)" }}
        >
          Our Process
        </p>
        <h2
          className="text-3xl font-light leading-tight text-[#2B2925] md:text-5xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          From Nature to Bottle
        </h2>
        <p
          className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5A554E] md:text-base"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          Follow the quiet journey from living landscapes and seasonal harvests to
          the calibrated ritual held in each vessel.
        </p>
      </div>

      {/* ════════════════════════════════ DESKTOP ════════════════════════════════ */}
      <div
        className="hidden overflow-hidden border border-[#A48662]/20 md:block"
      >


        {/* ── Main body: image left (680px tall), content right ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "680px" }}>

          {/* LEFT — image: 680px tall, object-cover object-center (same as your working old code) */}
          <div style={{ position: "relative", overflow: "hidden", background: "#1a1816", height: "680px" }}>
            <div className="absolute inset-0">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
            </div>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.28) 100%)",
              }}
            />

            {/* Image overlay: tag + title + location */}
            <div className="absolute bottom-0 left-0 right-0" style={{ padding: "28px 32px" }}>
              <div>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#A48662",
                      border: "0.5px solid rgba(164,134,98,0.45)",
                      padding: "5px 12px",
                      marginBottom: "10px",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {step.tag}
                  </span>
                  <h3
                    style={{
                      color: "#fff",
                      fontFamily: "var(--font-serif)",
                      fontSize: "22px",
                      fontWeight: 300,
                      lineHeight: 1.25,
                      textShadow: "0 2px 16px rgba(0,0,0,0.5)",
                      marginBottom: "8px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "14px", height: "0.5px", background: "#A48662", flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.06em",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {step.location}
                    </span>
                  </div>
              </div>
          </div>
        </div>
          {/* RIGHT — content */}
          <div
            style={{
              borderLeft: "0.5px solid rgba(164,134,98,0.18)",
              display: "flex",
              flexDirection: "column",
              height: "680px",
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "40px 44px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                overflowY: "auto",
              }}
            >
              <div>
                  <p
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.42em",
                      textTransform: "uppercase",
                      color: "#A48662",
                      fontFamily: "var(--font-sans)",
                      marginBottom: "18px",
                    }}
                  >
                    {step.subtitle}
                  </p>

                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "#2B2925",
                      fontSize: "clamp(1.7rem, 2.5vw, 2.4rem)",
                      fontWeight: 300,
                      lineHeight: 1.2,
                      marginBottom: "20px",
                    }}
                  >
                    {step.title}
                  </h2>

                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.9,
                      color: "rgba(64,59,59,0.82)",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 300,
                      maxWidth: "380px",
                      marginBottom: "28px",
                    }}
                  >
                    {step.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "16px",
                      paddingTop: "22px",
                      borderTop: "0.5px solid rgba(164,134,98,0.18)",
                    }}
                  >
                    <div
                      style={{
                        width: "1px",
                        minHeight: "40px",
                        background: "#A48662",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "14px",
                        fontStyle: "italic",
                        lineHeight: 1.75,
                        color: "#2B2925",
                        fontFamily: "var(--font-serif)",
                      }}
                    >
                      {step.quote}
                    </p>
                  </div>
              </div>
            </div>

            {/* Prev / progress / Next */}
            <div
              style={{
                borderTop: "0.5px solid rgba(164,134,98,0.12)",
                padding: "14px 44px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                flexShrink: 0,
              }}
            >
              <button onClick={() => go(active - 1)} disabled={active === 0} style={navBtn(active === 0)}>
                ← Prev
              </button>
              <div style={{ flex: 1, height: "1px", background: "rgba(164,134,98,0.22)", position: "relative" }}>
                <div
                  style={{ height: "100%", background: "#A48662", position: "absolute", left: 0, top: 0, width: `${progress}%` }}
                />
              </div>
              <button
                onClick={() => go(active + 1)}
                disabled={active === steps.length - 1}
                style={navBtn(active === steps.length - 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom nav pills ── */}
        <div
          ref={navRef}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            borderTop: "0.5px solid rgba(164,134,98,0.18)",
          }}
        >
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              style={{
                padding: "16px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                border: "none",
                borderRight: i < steps.length - 1 ? "0.5px solid rgba(164,134,98,0.12)" : "none",
                borderTop: `2px solid ${i === active ? "#A48662" : "transparent"}`,
                background: i === active ? "rgba(164,134,98,0.06)" : "transparent",
                transition: "all 0.25s ease",
                fontFamily: "var(--font-sans)",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: i === active ? "#A48662" : "rgba(164,134,98,0.28)",
                  transform: i === active ? "scale(1.3)" : "scale(1)",
                  transition: "background 0.25s, transform 0.25s",
                }}
              />
              <span
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: i === active ? "#2B2925" : "rgba(43,41,37,0.32)",
                  transition: "color 0.25s",
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {s.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════ MOBILE ════════════════════════════════ */}
      <div className="overflow-hidden md:hidden">

        {/* Image — 75svh with object-cover object-center (same logic as old working code) */}
        <div className="relative overflow-hidden" style={{ height: "75svh" }}>
          <div className="absolute inset-0">
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-full"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.06) 55%, transparent 100%)",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.06) 55%, transparent 100%)",
            }}
          />

          {/* Step counter badge — top right */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "28px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1,
              }}
            >
              {pad(active + 1)}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.38)",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.1em",
              }}
            >
              /{pad(steps.length)}
            </span>
          </div>

          {/* Image bottom overlay */}
          <div className="absolute bottom-6 left-5 right-5">
            <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "9px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#A48662",
                    border: "0.5px solid rgba(164,134,98,0.4)",
                    padding: "4px 10px",
                    marginBottom: "8px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {step.tag}
                </span>
                <h3
                  style={{
                    color: "#fff",
                    fontFamily: "var(--font-serif)",
                    fontSize: "22px",
                    fontWeight: 300,
                    lineHeight: 1.25,
                    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                  }}
                >
                  {step.title}
                </h3>
              </div>
            </div>
        </div>

        {/* Scrollable nav pills */}
        <div
          ref={navRef}
          className="flex overflow-x-auto"
          style={{
            borderBottom: "0.5px solid rgba(164,134,98,0.2)",
            scrollbarWidth: "none",
            background: "#F8F5F0",
          }}
        >
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              style={{
                flex: "0 0 auto",
                padding: "12px 16px",
                border: "none",
                borderBottom: `2px solid ${i === active ? "#A48662" : "transparent"}`,
                background: "transparent",
                cursor: "pointer",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: i === active ? "#2B2925" : "rgba(43,41,37,0.36)",
                fontFamily: "var(--font-sans)",
                whiteSpace: "nowrap",
                transition: "all 0.25s ease",
              }}
            >
              {s.subtitle}
            </button>
          ))}
        </div>

        {/* Text content */}
        <div style={{ padding: "28px 24px" }}>
          <div>
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: "#A48662",
                  fontFamily: "var(--font-sans)",
                  marginBottom: "8px",
                }}
              >
                {step.subtitle}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ height: "1px", width: "14px", flexShrink: 0, background: "#A48662" }} />
                <p style={{ fontSize: "12px", color: "rgba(64,59,59,0.6)", fontFamily: "var(--font-sans)", letterSpacing: "0.06em" }}>
                  {step.location}
                </p>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "#2B2925",
                  fontSize: "24px",
                  fontWeight: 300,
                  lineHeight: 1.25,
                  marginBottom: "16px",
                }}
              >
                {step.title}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.85,
                  color: "rgba(64,59,59,0.88)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 300,
                  marginBottom: "20px",
                }}
              >
                {step.description}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  paddingTop: "18px",
                  borderTop: "0.5px solid rgba(164,134,98,0.2)",
                }}
              >
                <div style={{ width: "1px", minHeight: "40px", background: "#A48662", flexShrink: 0, marginTop: "2px" }} />
                <p
                  style={{
                    fontSize: "14px",
                    fontStyle: "italic",
                    lineHeight: 1.7,
                    color: "#2B2925",
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  {step.quote}
                </p>
              </div>
            </div>
        </div>

        {/* Mobile nav footer */}
        <div style={{ display: "flex", alignItems: "center", padding: "24px", gap: "16px" }}>
          <button onClick={() => go(active - 1)} disabled={active === 0} style={navBtn(active === 0)}>
            ← Prev
          </button>
          <div style={{ flex: 1, height: "1px", background: "rgba(164,134,98,0.22)", position: "relative" }}>
            <div
              style={{ height: "100%", background: "#A48662", position: "absolute", left: 0, top: 0, width: `${progress}%` }}
            />
          </div>
          <button
            onClick={() => go(active + 1)}
            disabled={active === steps.length - 1}
            style={navBtn(active === steps.length - 1)}
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}