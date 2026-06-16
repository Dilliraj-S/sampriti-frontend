"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/landing/Navbar";
import ProvenanceHero from "@/app/components/landing/ProvenanceHero";
import Footer from "@/app/components/landing/Footer";

const carouselItems = [
  {
    num: "I",
    title: "The Palani Altitude: Hibiscus",
    subtitle: "The High-Altitude Bloom",
    terrain: "The Palani Massif. 2,000 meters.",
    description:
      "Our Hibiscus is defined by the thin air and intense solar radiation of the Western Ghats. Harvested from the same contours where Siddha lineages first codified the science of rejuvenation. This is a botanical of rare clarity — refined by altitude and the silence of the peaks.",
    image: "/assets/pexels-frostydog-10369138.webp",
    link: "/product/hibiscus",
  },
  {
    num: "II",
    title: "The Eastern Ghats: Cardamom",
    subtitle: "The Kolli Anomaly",
    terrain: "The Kolli Hills. The Mountain of Seventy Forests.",
    description:
      "Sourced from the mist-shrouded 'Mountain of Death' in the Eastern Ghats — a landscape of ancient biodiversity and vertical forests. Our Cardamom carries a singular aromatic profile, nurtured by a micro-climate that has remained undisturbed for centuries.",
    image: "/assets/img 3.webp",
    link: "/product/cardamom",
  },
  {
    num: "III",
    title: "The Arid Contours: Rose",
    subtitle: "The Aravalli Bloom",
    terrain: "The Arid Contours. Rajasthan.",
    description:
      "Sourced from the ancient, mineral-rich foothills of the Aravalli Range - the ancient granite barrier that guards the edge of the Thar Desert. Our Rose is defined by an atmospheric anomaly: the intense, desiccating heat of the desert meeting the hidden springs of the green hills. This 'Stress-Potency' creates a bloom of rare concentration.",
    image: "/assets/img 4.webp",
    link: "/product/rose",
  },
  {
    num: "IV",
    title: "The Southern Integrity: Coastal Plains",
    subtitle: "The Biodynamic Core",
    terrain: "Coastal plains. Regenerative soil.",
    description:
      "Our Southern partners operate on a timeline of seasons, not markets. No synthetics. No interference. Only the raw integrity of the plant.",
    image: "/assets/img-10.webp",
    link: "/product/coastal-plains",
  },
];

export default function ProvenancePage() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <ProvenanceHero />

      <style>{`
        #prov-carousel-track::-webkit-scrollbar { height: 3px; }
        #prov-carousel-track::-webkit-scrollbar-thumb { background: #333333; border-radius: 2px; }
        #prov-carousel-track::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* Prov Duo — two image grid */}
      <section className="pt-12 md:pt-20 pb-20 md:pb-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[30px] items-end">
          <div>
            <div className="relative w-full aspect-[3/4]">
              <Image src="/assets/img 2.webp" alt="Palani Hills Detail" fill className="object-cover object-center" sizes="50vw" />
            </div>
          </div>
          <div>
            <div className="relative w-full aspect-[3/4]">
              <Image src="/assets/pexels-rahibyaqubov-14989568.webp" alt="Misty Palani Hills" fill className="object-cover object-center" sizes="50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* The Chapter of Sages — media row */}
      <section>
        <div className="flex flex-col md:flex-row min-h-[650px]">
          <div className="relative w-full md:w-1/2 min-h-[400px] md:min-h-[650px]">
            <Image src="/assets/pexels-2160239255-36617477.webp" alt="The Sacred Peaks" fill className="object-cover object-center" sizes="50vw" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-start px-6 pt-12 pb-12 md:px-20 md:pt-20 md:pb-16" style={{ background: "#f5f0ea" }}>
            <h2 className="font-light mb-5 tracking-[0.05em]" style={{ fontFamily: "var(--font-serif)", color: "#2a2a2a", fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)" }}>
              The Chapter of Sages
            </h2>
            <p className="text-sm md:text-[0.9rem] leading-relaxed" style={{ color: "#666", fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              Where Siddha sages once meditated on the subtle intelligence of plants. Here, we source herbs that carry the vibration of ancient silence.
            </p>
          </div>
        </div>
      </section>

      {/* Boutique Provenance + Carousel (I-IV) */}
      <section className="pb-20 md:pb-[120px]" style={{ marginTop: "120px" }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-[60px] items-start">
          <div className="pl-6 md:pl-10">
            <h2 className="font-light mb-5 tracking-[0.1em]" style={{ fontFamily: "var(--font-serif)", color: "#2a2a2a", fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)" }}>
              Boutique Provenance
            </h2>
            <p className="text-sm md:text-[0.9rem] leading-relaxed" style={{ color: "#666", fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              A curated selection of our most potent botanicals, sourced from specific terroirs across the Indian subcontinent.
            </p>
          </div>
          <div id="prov-carousel-track" className="flex flex-col gap-8 md:flex-row md:gap-6 md:overflow-x-auto md:pb-2" style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
            {carouselItems.map((item) => (
              <Link
                key={item.num}
                href={item.link}
                className="flex-shrink-0 no-underline w-full md:w-auto"
                style={{ color: "inherit", flex: "0 0 280px", scrollSnapAlign: "start" }}
              >
                <div className="relative w-full aspect-[4/3] md:aspect-square mb-4 overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover object-center transition-transform duration-500 hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 280px" />
                </div>
                <div className="px-6 md:px-0">
                <h3 className="text-lg md:text-[1.15rem] font-light mb-2 tracking-[0.05em]" style={{ fontFamily: "var(--font-serif)", color: "#2a2a2a" }}>
                  {item.subtitle}
                </h3>
                <p className="text-xs md:text-[0.85rem] leading-relaxed" style={{ color: "#777", fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                  {item.terrain}<br /><br />
                  {item.description}
                </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* V. The Vessel — media row reverse */}
      <section>
        <div className="flex flex-col md:flex-row min-h-[750px]">
          <div className="relative w-full md:w-1/2 min-h-[500px] md:min-h-[750px]">
            <Image src="/assets/pomelli-image (42).webp" alt="The Vessel" fill className="object-cover object-center" sizes="50vw" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-start px-6 pt-16 pb-20 md:px-20 md:pt-20 md:pb-24" style={{ background: "#f5f0ea" }}>
            <h2 className="text-xl md:text-[1.5rem] font-light mb-5 tracking-[0.05em]" style={{ fontFamily: "var(--font-serif)", color: "#2a2a2a" }}>
              The Conscious Artifact
            </h2>
            <p className="text-sm md:text-[0.9rem] leading-relaxed mb-6" style={{ color: "#666", fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              Protection, not just packaging. A precise calibration of light and material designed for botanical longevity.
            </p>
            <ul className="list-none p-0 m-0 text-sm md:text-[0.95rem] leading-relaxed" style={{ color: "#666", fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              <li className="mb-3">
                <strong>The Glass:</strong> Architectural transparency for our whole botanicals. Ultraviolet-filtering amber for our potent powders.
              </li>
              <li className="mb-3">
                <strong>The Seal:</strong> Hand-fitted natural cork for our whole-leaf rituals. Airtight apothecary seals for our concentrated infusions.
              </li>
              <li>
                <strong>The Intent:</strong> Recycled fiber. A deliberate avoidance of unnecessary plastic.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom full-width image */}
      <section className="py-16 md:py-20">
        <div className="relative w-full aspect-[3/2] md:aspect-[16/7]">
          <Image src="/assets/pexels-tranthangnhat-27792454.webp" alt="Indian Landscape" fill className="object-cover object-center" sizes="100vw" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
