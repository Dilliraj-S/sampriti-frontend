"use client";

import { useRef, useState, useEffect } from "react";

const steps = [
  {
    id: 1,
    image: "/assets/forest girl.webp",
    label: "A Botanical Pilgrimage",
    title: "Origins",
    description:
      "Sampriti was born from a quiet pilgrimage across India's living landscapes of plant wisdom — Himalayan ridges, coastal plains, temple gardens, and rain-soaked forests of the South.",
  },
  {
    id: 2,
    image: "/assets/the -house-3.webp",
    label: "A Botanical Pilgrimage",
    title: "Wisdom",
    description:
      "Our foundational philosophy is built on more than just texts; it is a synthesis of ancestral field knowledge and the rigorous observation of plant intelligence. In our tradition, health is defined not merely as the absence of illness, but as the active presence of luminous balance.",
  },
  {
    id: 3,
    image: "/assets/pomelli-image (46).webp",
    label: "A Botanical Pilgrimage",
    title: "Devotion",
    description:
      "We advocate for a state of systemic vitality, where the body becomes a vessel of clarity and sustained joy. To honour the biological form through refined ritual is, for us, the ultimate act of devotion.",
  },
];

// Total scroll container = 4 × 100vh → 3 steps × 100vh each + 1 × 100vh hold on step 3
const TOTAL_VH = (steps.length + 1) * 100; // 400

export default function ScrollPilgrimage() {
  const [activeStep, setActiveStep] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const calc = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // Each step occupies exactly 1 × vh of scroll travel
      // Total scrollable range = container height − vh = (4×vh) − vh = 3×vh
      const total = wrap.offsetHeight - vh; // 3 × window.innerHeight
      if (total <= 0) return;

      // How far past the top the container has scrolled
      const scrolled = Math.min(Math.max(-rect.top, 0), total);

      // Each step owns total/steps.length = vh pixels of scroll
      const perStep = total / steps.length;
      const idx = Math.min(Math.floor(scrolled / perStep), steps.length - 1);
      setActiveStep(idx);
    };

    calc();
    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
    };
  }, []);

  const step = steps[activeStep];

  return (
    // This outer div IS the scroll container — 400vh tall
    // No extra wrappers, no section padding, nothing interfering
    <div
      ref={wrapRef}
      style={{ position: "relative", height: `${TOTAL_VH}vh`, background: "#fff" }}
    >
      {/* Sticky panel — 100vh tall, sticks at top:0 for the full 400vh scroll */}
      <div
        className="flex flex-col md:grid md:grid-cols-2 md:overflow-hidden"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          zIndex: 10,
          gap: "16px",
        }}
      >
        {/* ── LEFT: image ── */}
        <div
          className="flex-shrink-0 h-[55vh] md:h-full"
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            background: "#1a1816",
          }}
        >
          {steps.map((s, i) => (
            <img
              key={s.id}
              src={s.image}
              alt={s.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                opacity: i === activeStep ? 1 : 0,
                transition: "opacity 0.7s ease",
              }}
            />
          ))}

          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.28) 100%)",
            }}
          />

          {/* Dot indicators */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              left: 32,
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            {steps.map((_, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  height: 2,
                  width: i === activeStep ? 32 : 16,
                  background:
                    i === activeStep ? "#333333" : "#eae8e0",
                  transition: "all 0.5s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT: content ── */}
        <div
          className="flex-1 md:h-full md:overflow-y-auto"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "24px 24px 32px",
            background: "#FDFAF5",
            borderColor: "rgba(164,134,98,0.18)",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            {/* Label */}
            {step.label && (
              <p
                style={{
                  fontSize: 13,
                  letterSpacing: "0.42em",
                  marginBottom: 20,
                  color: "#2B2925",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {step.label}
              </p>
            )}

            {/* Title */}
            {step.title && (
              <h2
                style={{
                  fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)",
                  fontWeight: 300,
                  lineHeight: 1.2,
                  marginBottom: 24,
                  fontFamily: "var(--font-serif)",
                  color: "#2B2925",
                }}
              >
                {step.title}
              </h2>
            )}

            {/* Description */}
            {step.description.split("\n\n").map((para, pi) => (
              <p
                key={pi}
                style={{
                  fontSize: 15,
                  lineHeight: 1.9,
                  marginTop: pi > 0 ? 16 : 0,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 300,
                  color: para.startsWith("—")
                    ? "#A48662"
                    : "rgba(64,59,59,0.82)",
                  fontStyle: para.startsWith("—") ? "italic" : "normal",
                  letterSpacing: para.startsWith("—") ? "0.04em" : undefined,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}