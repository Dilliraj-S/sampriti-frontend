"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";

interface SectionData {
  id: number;
  title: string;
  image: string;
  imageAlt: string;
  content: { heading: string; description: string }[];
}

const sections: SectionData[] = [
  {
    id: 1,
    title: "A Botanical Pilgrimage",
    image: "/Assets/forest girl.webp",
    imageAlt: "A Botanical Pilgrimage",
    content: [
      {
        heading: "Origins",
        description:
          "Sampriti was born from a quiet pilgrimage across India's living landscapes of plant wisdom - Himalayan ridges, coastal plains, temple gardens, and rain-soaked forests of the South.",
      },
      {
        heading: "Wisdom",
        description:
          "Our foundational philosophy is built on more than just texts; it is a synthesis of ancestral field knowledge and the rigorous observation of plant intelligence. In our tradition, health is defined not merely as the absence of illness, but as the active presence of luminous balance.",
      },
      {
        heading: "Devotion",
        description:
          "We advocate for a state of systemic vitality, where the body becomes a vessel of clarity and sustained joy. To honour the biological form through refined ritual is, for us, the ultimate act of devotion.",
      },
    ],
  },
  {
    id: 2,
    title: "Our Foundations",
    image: "/Assets/perume distillation.webp",
    imageAlt: "Our Foundations",
    content: [
      {
        heading: "Lineage (Parampara)",
        description:
          "We honour the 4,000-year-old Siddha and Ayurvedic traditions. Our formulations are rooted in time-tested wisdom passed down through generations of practitioners.",
      },
      {
        heading: "Purity (Shuddhi)",
        description:
          "Wildcrafted botanicals. Vegan formulations. Zero synthetics. Every ingredient is meticulously sourced to ensure the highest quality and purity.",
      },
      {
        heading: "Presence (Dhyana)",
        description:
          "Every infusion is a ritual, crafted in small batches to preserve the plant's subtle intelligence. We infuse each creation with mindful attention.",
      },
    ],
  },
  {
    id: 3,
    title: "The Slow Botanical Movement",
    image: "/Assets/img.webp",
    imageAlt: "The Slow Botanical Movement",
    content: [
      {
        heading: "Conscious Scaling",
        description: "We prioritize the integrity of the soil over the speed of the market.",
      },
      {
        heading: "The Vessel",
        description:
          "We choose glass, cork, and paper. Our goal is to leave no footprint, only a legacy of wellness.",
      },
      {
        heading: "Super Health",
        description:
          "Bridging the gap between traditional 'Kayakalpa' (rejuvenation) and the global seeker of clarity and joy.",
      },
    ],
  },
];

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative h-[560px] w-full overflow-hidden md:h-[720px] lg:h-[82vw] lg:max-h-[920px] lg:min-h-[760px]"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function AlternatingSection({ section, index }: { section: SectionData; index: number }) {
  const isEven = index % 2 === 1;

  return (
    <div className="last:mb-0">
      <div className="grid lg:grid-cols-2">
        <div className={isEven ? "lg:order-2" : ""}>
          <ParallaxImage src={section.image} alt={section.imageAlt} />
        </div>

        <div className={`flex min-h-[420px] items-center bg-white md:min-h-[560px] lg:min-h-[760px] ${isEven ? "lg:order-1" : ""}`}>
          <div className="w-full px-6 py-12 md:px-16 lg:px-24">
            <div className="max-w-lg">
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 leading-tight"
                style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
              >
                {section.title}
              </h2>

              <div className="space-y-7">
                {section.content.map((item) => (
                  <div key={item.heading}>
                    <h3
                      className="text-base md:text-lg mb-2 font-normal"
                      style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
                    >
                      {item.heading}
                    </h3>
                    <p
                      className="text-sm md:text-base leading-[1.8]"
                      style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "#5A554E" }}
                    >
                      {item.description}
                    </p>
                  </div>
                ))}

                {section.id === 1 && (
                  <p
                    className="text-sm tracking-wider mt-4"
                    style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}
                  >
                    - The House of Sampriti
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TheHousePage() {
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />

      <section className="relative min-h-screen w-full overflow-hidden bg-black">
        <Image
          src="/Assets/The house 1.webp"
          alt="The House of Sampriti"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.24)_42%,rgba(0,0,0,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.42)_100%)]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-24 text-center">
          <div className="max-w-3xl">
            <p
              className="mb-5 text-xs uppercase tracking-[0.42em]"
              style={{ fontFamily: "var(--font-sans)", color: "#C9A76A" }}
            >
              The House
            </p>
            <h1
              className="mb-5 text-4xl font-light leading-tight md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}
            >
              The House of Sampriti
            </h1>
            <p
              className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed md:text-lg"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "rgba(255,255,255,0.82)" }}
            >
              Honouring the biological form through refined ritual is the ultimate act of devotion.
            </p>
            <button
              type="button"
              onClick={scrollToStory}
              className="inline-flex min-h-16 items-center justify-center border-2 border-white px-7 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Discover The House
            </button>
          </div>
        </div>
      </section>

      <section ref={storyRef} className="scroll-mt-20 pb-24 pt-44 md:pb-36 md:pt-52">
        <div className="w-full">
          <div className="mb-20 text-center md:mb-28">
            <span
              className="mb-6 block text-xs uppercase tracking-[0.4em]"
              style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}
            >
              Explore the House
            </span>
            <h2
              className="mx-auto max-w-3xl text-3xl font-light leading-tight md:text-5xl"
              style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
            >
              Explore the foundations of our practice
            </h2>
          </div>

          <div className="w-full">
            {sections.map((section, index) => (
              <AlternatingSection key={section.id} section={section} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <Image
          src="/Assets/house bottom banner.webp"
          alt="Explore The House"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-20 text-center">
          <div className="max-w-3xl">
            <h2 className="mb-5 text-4xl font-light leading-tight text-white md:text-6xl lg:text-7xl" style={{ fontFamily: "var(--font-serif)" }}>
              The House of Sampriti
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-white/80 md:text-lg" style={{ fontWeight: 300 }}>
              Honouring the biological form through refined ritual is the ultimate act of devotion.
            </p>
            <button
              type="button"
              onClick={() => { window.location.href = "/"; }}
              className="inline-flex min-h-16 items-center justify-center border-2 border-white px-7 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Explore The Collection
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
