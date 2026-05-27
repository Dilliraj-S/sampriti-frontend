"use client";

import { useRef } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

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
      { heading: "Origins", description: "Sampriti was born from a quiet pilgrimage across India's living landscapes of plant wisdom—Himalayan ridges, coastal plains, temple gardens, and rain-soaked forests of the South." },
      { heading: "Wisdom", description: "Our foundational philosophy is built on more than just texts; it is a synthesis of ancestral field knowledge and the rigorous observation of plant intelligence. In our tradition, health is defined not merely as the absence of illness, but as the active presence of luminous balance." },
      { heading: "Devotion", description: "We advocate for a state of systemic vitality, where the body becomes a vessel of clarity and sustained joy. To honour the biological form through refined ritual is, for us, the ultimate act of devotion." },
    ],
  },
  {
    id: 2,
    title: "Our Foundations",
    image: "/Assets/perume distillation.webp",
    imageAlt: "Our Foundations",
    content: [
      { heading: "Lineage (Parampara)", description: "We honour the 4,000-year-old Siddha and Ayurvedic traditions. Our formulations are rooted in time-tested wisdom passed down through generations of practitioners." },
      { heading: "Purity (Shuddhi)", description: "Wildcrafted botanicals. Vegan formulations. Zero synthetics. Every ingredient is meticulously sourced to ensure the highest quality and purity." },
      { heading: "Presence (Dhyana)", description: "Every infusion is a ritual, crafted in small batches to preserve the plant's subtle intelligence. We infuse each creation with mindful attention." },
    ],
  },
  {
    id: 3,
    title: "The Slow Botanical Movement",
    image: "/Assets/img.webp",
    imageAlt: "The Slow Botanical Movement",
    content: [
      { heading: "Conscious Scaling", description: "We prioritize the integrity of the soil over the speed of the market." },
      { heading: "The Vessel", description: "We choose glass, cork, and paper. Our goal is to leave no footprint, only a legacy of wellness." },
      { heading: "Super Health", description: "Bridging the gap between traditional 'Kayakalpa' (rejuvenation) and the global seeker of clarity and joy." },
    ],
  },
];

function ParallaxImage({ src, alt, side }: { src: string; alt: string; side: "left" | "right" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className={`relative w-full h-[40vh] md:h-[50vh] lg:h-[calc(100vh-96px)] lg:min-h-[600px] lg:w-[50vw] overflow-hidden group ${side === "left" ? "lg:-ml-[max(0px,calc((100vw-1280px)/2))]" : "lg:-mr-[max(0px,calc((100vw-1280px)/2))]"}`}>
      <motion.div style={{ y }} className="absolute inset-0">
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw" 
        />
      </motion.div>
    </div>
  );
}

function AlternatingSection({ section, index }: { section: SectionData; index: number }) {
  const isEven = index % 2 === 1;

  return (
    <motion.div 
      variants={fadeUp} 
      initial="hidden" 
      whileInView="show" 
      viewport={{ once: true, margin: "-100px" }} 
      className="mb-20 md:mb-28"
    >
      <div className={`flex flex-col lg:flex-row ${isEven ? 'lg:flex-row-reverse' : ''}`}>
        <motion.div 
          variants={isEven ? fadeInRight : fadeInLeft} 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true }} 
          className="lg:w-1/2 w-full"
        >
          <ParallaxImage src={section.image} alt={section.imageAlt} side={isEven ? "right" : "left"} />
        </motion.div>
        <motion.div 
          variants={isEven ? fadeInLeft : fadeInRight} 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true }} 
          className="lg:w-1/2 w-full flex items-center"
        >
          <div className="px-6 py-10 md:px-12 lg:px-16 w-full bg-[#FFFFFF]">
            <div className="max-w-lg">
              <span className="text-xs tracking-[0.3em] uppercase mb-4 block" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>0{section.id}</span>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 leading-tight" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>{section.title}</h3>
              <div className="space-y-5">
                {section.content.map((item, idx) => (
                  <div key={idx}>
                    <h4 className="text-base md:text-lg mb-2 font-normal" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>{item.heading}</h4>
                    <p className="text-sm md:text-base leading-[1.8]" style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "#5A554E" }}>{item.description}</p>
                  </div>
                ))}
                {section.id === 1 && (
                  <p className="text-sm tracking-wider mt-4" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>— The House of Sampriti</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function TheHouseOverview() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ fontFamily: "var(--font-sans)", background: "#FFFFFF" }}>
      <Navbar forceScrolled={true} />
      
      <div className="pt-36 pb-16 md:pt-40 md:pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16 md:mb-20">
            <span className="text-xs tracking-[0.4em] uppercase mb-6 block" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>THE HOUSE</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
              Explore the foundations<br className="hidden md:block" /> of our practice
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed" style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "#5A554E" }}>That transform raw botanicals into ritualized care.</p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="text-center mb-16 md:mb-20">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>— A Botanical Pilgrimage —</h2>
          </motion.div>

          {sections.map((section, index) => (
            <AlternatingSection key={section.id} section={section} index={index} />
          ))}

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
            <div className="relative py-12 md:py-16 px-8" style={{ borderLeft: "1px solid rgba(164,134,98,0.2)", borderRight: "1px solid rgba(164,134,98,0.2)" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12" style={{ background: "linear-gradient(to bottom, rgba(164,134,98,0.6), transparent)" }} />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12" style={{ background: "linear-gradient(to top, rgba(164,134,98,0.6), transparent)" }} />
              <p className="text-lg md:text-xl lg:text-2xl leading-[1.8] italic mb-6" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>&quot;To honour the biological form through refined ritual is, for us, the ultimate act of devotion.&quot;</p>
              <p className="text-sm tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>— The House of Sampriti</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full">
        <div className="px-6 pt-8 pb-4 text-center">
          <p className="text-[0.58rem] tracking-[0.38em] uppercase" style={{ fontFamily: "var(--font-sans)", color: "#C9A76A" }}>Closing Ritual</p>
        </div>
        
        <div className="relative aspect-[16/9] md:aspect-[16/7] lg:aspect-[21/8]">
          <Image src="/Assets/house bottom banner.webp" alt="The House of Sampriti" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)" }} />
          <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(to top, rgba(8,7,5,0.82) 0%, rgba(8,7,5,0.34) 42%, rgba(8,7,5,0.04) 100%)" }} />
          
          <div className="absolute inset-x-0 bottom-0 md:hidden px-7 py-6" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}>
            <h3 className="text-xl font-light leading-tight mb-3" style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}>The House of Sampriti</h3>
            <p className="text-xs leading-relaxed mb-4" style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "rgba(255,255,255,0.8)" }}>Honouring the biological form through refined ritual</p>
            <Link href="/#shop" className="inline-block px-6 py-2 text-[0.6rem] tracking-[0.28em] uppercase hover:opacity-80 transition-all duration-500" style={{ fontFamily: "var(--font-sans)", fontWeight: 600, background: "#262420", color: "#F9F7F3" }}>Explore Collection</Link>
          </div>
          
          <div className="hidden md:flex absolute inset-0 items-center justify-center">
            <div className="text-center px-6 max-w-2xl">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 font-light leading-tight" style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}>The House of Sampriti</h3>
              <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-8 leading-relaxed" style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "rgba(255,255,255,0.8)" }}>Honouring the biological form through refined ritual is the ultimate act of devotion.</p>
              <Link href="/#shop" className="inline-block px-10 py-4 text-xs tracking-[0.2em] uppercase hover:opacity-80 transition-all duration-500 hover:scale-105" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, background: "#262420", color: "#F9F7F3" }}>Explore Collection</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
