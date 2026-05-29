"use client";



export default function RitualSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "#000000", height: "calc(100dvh - 3cm)" }}
    >
      {/* Background image — fills exactly the display size, no overflow */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/Assets/pexels-tranthangnhat-27792454.webp"
          alt="The Vessel"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </div>

      {/* Content: flex column, label at top — quote at bottom */}
      <div
        className="relative z-10 flex flex-col justify-between h-full px-6 md:px-14 py-10 md:py-30 max-w-7xl mx-auto w-full"
      >
        {/* TOP: The Vessel label — no gap, no rule below it */}
        <div className="flex items-center gap-4">
          <div className="h-px w-12" style={{ background: "#A48662" }} />
          <p
            className="text-xs tracking-[0.4em] uppercase"
            style={{ color: "#A48662", fontFamily: "var(--font-sans)" }}
          >
            The Vessel
          </p>
        </div>

        {/* BOTTOM: Quote + body copy */}
        <div className="max-w-4xl">
          <blockquote
            className="text-2xl md:text-3xl lg:text-4xl font-light leading-[1.15] mb-6"
            style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}
          >
            "This is not consumption.
            <br />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>This is ritual."</span>
          </blockquote>

          <p
            className="text-sm md:text-base leading-relaxed max-w-4xl mb-6"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            Sampriti was born from a quiet pilgrimage across India's living landscapes of plant
            wisdom — Himalayan ridges, coastal plains, temple gardens, and rain-soaked forests of
            the South. Our foundational philosophy is built on more than just texts; it is a
            synthesis of ancestral field knowledge and the rigorous observation of plant intelligence.
          </p>

          <p
            className="text-sm md:text-base leading-relaxed max-w-2xl mb-10"
            style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            In our tradition, health is defined not merely as the absence of illness, but as the
            active presence of luminous balance. To honour the biological form through refined
            ritual is, for us, the ultimate act of devotion.
          </p>

          <div className="flex items-center gap-4">
            <div className="h-px w-8" style={{ background: "#A48662", opacity: 0.6 }} />
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "#A48662", fontFamily: "var(--font-sans)" }}
            >
              — The House of Sampriti
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}