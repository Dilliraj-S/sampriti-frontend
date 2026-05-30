"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/landing/Navbar";
import { api } from "@/services/api.client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const fallbackArticles: {
  category: string; title: string; excerpt: string; image: string; slug: string;
}[] = [
  {
    category: "Botanical Profile",
    title: "The Crimson Catalyst: Hibiscus in Practice",
    excerpt: "Hibiscus (Japa) is a high-functioning botanical characterized by its dense concentration of anthocyanins and organic acids. Discover how these compounds provide remarkable resilience.",
    image: "/Assets/Botanical profile.webp",
    slug: "hibiscus-in-practice"
  },
  {
    category: "Siddha Wisdom",
    title: "The Shadow Catalyst: Siddha Wisdom and Dual Black Recovery",
    excerpt: "In the ancient Siddha tradition - the oldest medical lineage of South India - certain botanicals are classified as Kaya Kalpa, agents of longevity. Among these, Black Turmeric is the rarest.",
    image: "/Assets/siddha wisdom.webp",
    slug: "dual-black-recovery"
  },
  {
    category: "Moon Rhythms",
    title: "The Lunar Pulse: Moon Rhythms and the Vitality of Herbs",
    excerpt: "The Moon is far more than a celestial body; it is the universal moistening principle that governs the flow of all liquids.",
    image: "/Assets/Moon Rhythms.webp",
    slug: "moon-rhythms"
  },
  {
    category: "Ritual Science",
    title: "The Art of Infusion",
    excerpt: "Explore the delicate balance of time, temperature, and botanical integrity in crafting the perfect herbal infusion.",
    image: "/Assets/art of infusion.webp",
    slug: "art-of-infusion"
  },
  {
    category: "Distillation",
    title: "The Science of Scent",
    excerpt: "Understanding how aromatic compounds interact with our nervous system to induce calm and clarity.",
    image: "/Assets/distillation.webp",
    slug: "science-of-scent"
  },
  {
    category: "Seasonal Rhythms",
    title: "Seasonal Rhythms",
    excerpt: "Aligning your daily rituals with the changing seasons to optimize vitality and well-being.",
    image: "/Assets/seasonal rhythms.webp",
    slug: "seasonal-rhythms"
  }
];

export default function ArchivePage() {
  const [articles, setArticles] = useState(fallbackArticles);

  useEffect(() => {
    (async () => {
      const res = await api.get<any[]>("/content");
      if (res.status && res.data?.length) {
        const today = new Date().toISOString().split("T")[0];
        const published = res.data
          .filter((p: any) => p.status === "published" || (p.status === "scheduled" && p.publishDate && p.publishDate <= today))
          .map((p: any) => ({
            category: p.category || "Journal",
            title: p.title,
            excerpt: p.excerpt || (p.content || "").slice(0, 120),
            image: p.image || "/Assets/img 4.webp",
            slug: p.slug,
          }));
        if (published.length) setArticles(published);
      }
    })();
  }, []);

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
                key={article.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/archive/${article.slug}`} className="block group text-center">
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
