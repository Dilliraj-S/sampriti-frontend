"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/landing/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const articles = [
  {
    category: "Botanical Profile",
    title: "The Crimson Catalyst: Hibiscus in Practice",
    excerpt: "Hibiscus (Japa) is a high-functioning botanical characterized by its dense concentration of anthocyanins and organic acids.",
    image: "/Assets/hibiscus hd.webp"
  },
  {
    category: "Siddha Wisdom",
    title: "The Shadow Catalyst: Black Turmeric",
    excerpt: "In the ancient Siddha tradition, certain botanicals are classified as Kaya Kalpa, agents of longevity. Among these, Black Turmeric is the rarest.",
    image: "/Assets/black turmeric hd.webp"
  },
  {
    category: "Moon Rhythms",
    title: "The Lunar Pulse: Moon Rhythms and the Vitality of Herbs",
    excerpt: "The Moon is far more than a celestial body; it is the universal moistening principle that governs the flow of all liquids.",
    image: "/Assets/blue butterfly pea hd.webp"
  }
];

export default function ArchivePage() {
  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled={true} />

      <div className="pt-32 pb-16 px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[#A48662] text-xs tracking-[0.25em] uppercase mb-3">THE ARCHIVE</p>
          <h1 className="text-[#2C2A26] text-4xl md:text-5xl font-light" style={{ fontFamily: "var(--font-serif)" }}>
            Curated Works
          </h1>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href="#article" className="block group text-center">
                  <div className="relative aspect-square bg-white mb-4 flex items-center justify-center">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-contain p-8"
                      sizes="33vw"
                    />
                  </div>
                  <p className="text-[#A48662] text-[10px] tracking-[0.15em] uppercase mb-2">{article.category}</p>
                  <h2 className="text-[#2C2A26] text-lg font-light mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                    {article.title}
                  </h2>
                  <p className="text-[#5A554E] text-sm">{article.excerpt}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}