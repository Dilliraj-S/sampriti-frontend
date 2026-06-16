"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navbar from "@/app/components/landing/Navbar";
import ScrollPilgrimage from "@/app/components/landing/ScrollPilgrimage";
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
    image: "/assets/forest girl.webp",
    imageAlt: "A Botanical Pilgrimage",
    content: [
      {
        heading: "Origins",
        description:
          "Sampriti was born from a quiet pilgrimage across India's living landscapes of plant wisdom - Himalayan ridges, coastal plains, temple gardens, and rain-soaked forests of the South.",
      },
      {
        heading: "",
        description:
          "Our foundational philosophy is built on more than just texts; it is a synthesis of ancestral field knowledge and the rigorous observation of plant intelligence. In our tradition, health is defined not merely as the absence of illness, but as the active presence of luminous balance.",
      },
      {
        heading: "",
        description:
          "We advocate for a state of systemic vitality, where the body becomes a vessel of clarity and sustained joy. To honour the biological form through refined ritual is, for us, the ultimate act of devotion.",
      },
    ],
  },
  {
    id: 2,
    title: "Our Foundations",
    image: "/assets/perume distillation.webp",
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
    image: "/assets/img9.webp",
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
  const isEven = index % 2 === 0;

  return (
    <div className="last:mb-0">
      <div className="grid lg:grid-cols-2">
        <div className={isEven ? "lg:order-2" : ""}>
          <ParallaxImage src={section.image} alt={section.imageAlt} />
        </div>

        <div className={`flex min-h-[420px] items-start bg-white md:min-h-[560px] lg:min-h-[760px] ${isEven ? "lg:order-1" : ""}`}>
          <div className="w-full px-6 py-12 md:px-16 lg:px-24">
            <div className="max-w-lg">
              <h2
                className="font-light mb-6 leading-tight"
                style={{ fontFamily: "var(--font-serif)", color: "#2B2925", fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)" }}
              >
                {section.title}
              </h2>

              <div className="space-y-8">
                {section.content.map((item, idx) => (
                  <div key={idx}>
                    {item.heading && (
                      <h3
                        className="text-base md:text-lg mb-2 font-normal"
                        style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
                      >
                        {item.heading}
                      </h3>
                    )}
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />

      <section className="relative min-h-screen w-full overflow-hidden bg-black">
        <Image
          src="/assets/The house 1.webp"
          alt="The House of Sampriti"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.24)_42%,rgba(0,0,0,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.42)_100%)]" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-48 px-6 text-center">
          <div className="max-w-3xl mt-10 md:mt-16">
            {/* <p
              className="mb-5 text-xs uppercase tracking-[0.42em]"
              style={{ fontFamily: "var(--font-sans)", color: "#C9A76A" }}
            >
              The House
            </p> */}
            <h1
              className="mb-4 text-xl font-light leading-tight md:text-2xl lg:text-3xl"
              style={{ fontFamily: "var(--font-serif)", color: "#FDFAF5" }}
            >
              The House
            </h1>
            <p
              className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed md:text-lg"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "rgba(255,255,255,0.82)" }}
            >
              Honouring the biological form through refined ritual is the ultimate act of devotion.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-16 md:mt-24">
        <ScrollPilgrimage />
      </div>

      <section className="scroll-mt-20 pt-16 md:pt-24 pb-24 md:pb-36">
        <div className="w-full">
          <div className="w-full space-y-16 md:space-y-24">
            {sections.slice(1).map((section, index) => (
              <AlternatingSection key={section.id} section={section} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="relative w-full aspect-[3/2] md:aspect-[16/7]">
          <Image
            src="/assets/house bottom banner.webp"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
