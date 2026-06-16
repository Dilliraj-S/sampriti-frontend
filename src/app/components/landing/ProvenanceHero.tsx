"use client";

export default function ProvenanceHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      <img
        src="/assets/provenance hero (2).webp"
        alt="Provenance hero"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-48 px-6 text-center">
        <div className="mx-auto max-w-3xl text-white">
          <h1
            className="text-xl font-light leading-tight md:text-2xl lg:text-3xl mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Provenance
          </h1>
          <p
            className="mx-auto max-w-2xl text-sm leading-relaxed md:text-lg"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "rgba(255,255,255,0.82)" }}
          >
            High-functioning botanicals, sourced from their most potent geographical origins.
          </p>
        </div>
      </div>
    </section>
  );
}
