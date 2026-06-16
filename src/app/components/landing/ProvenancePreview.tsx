"use client";

import SourceCraft from "./SourceCraft";

export default function ProvenancePreview() {
  return (
    <section id="provenance-preview" className="bg-white py-10 md:py-24">
      <div className="w-full px-6 md:px-8 lg:px-10">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <p
            className="mb-4 text-[#A48662] text-[0.6rem] tracking-[0.45em] uppercase"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            SOURCE & CRAFT
          </p>
          <h2
            className="text-[#2B2925] text-4xl md:text-5xl font-light"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Provenance
          </h2>
        </div>

        <div className="mb-12 md:mb-20 -mx-6 md:-mx-8 lg:-mx-10">
          <SourceCraft />
        </div>
      </div>
    </section>
  );
}
