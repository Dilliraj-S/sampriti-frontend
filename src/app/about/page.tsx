"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/app/components/landing/Navbar";
import dynamic from "next/dynamic";

const Footer = dynamic(
  () => import("@/app/components/landing/Footer"),
  { ssr: true }
);

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled />

      {/* Hero Section */}
      <section className="relative pt-50 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#A48662] text-xs tracking-[0.4em] uppercase mb-4"
          >
            The House
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#2B2925] text-5xl md:text-7xl mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#5A554E] text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Rooted in ancient Ayurvedic wisdom and refined through modern craftsmanship, 
            Samprīti Botanicals brings you nature's most potent ingredients, 
            transformed into rituals of transformation.
          </motion.p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] bg-[#A48662]/10"
          >
            <Image
              src="/Assets/distillation.jpg"
              alt="Art of distillation"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#A48662] text-xs tracking-[0.3em] uppercase mb-4">
              Our Philosophy
            </p>
            <h2
              className="text-[#2B2925] text-4xl mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Slow Beauty, Deep Rituals
            </h2>
            <p className="text-[#5A554E] mb-6 leading-relaxed">
              We believe in the power of time-honored traditions. Each product is 
              crafted in small batches, allowing the botanical essences to reach 
              their full potency. Our formulations honor the wisdom of generations 
              of Ayurvedic practitioners.
            </p>
            <p className="text-[#5A554E] leading-relaxed">
              From seed to serum, every step is infused with intention and care. 
              We source our ingredients directly from sustainable farms and 
              traditional cultivators who share our commitment to purity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-[#A48662]/[0.045]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#A48662] text-xs tracking-[0.3em] uppercase mb-4">
              Our Values
            </p>
            <h2
              className="text-[#2B2925] text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              The Pillars of Our Practice
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Pure Origins",
                desc: "Every ingredient traced back to its source, ensuring authenticity and potency.",
              },
              {
                title: "Conscious Craft",
                desc: "Sustainable practices at every step, from harvesting to packaging.",
              },
              {
                title: "Time-True Formulas",
                desc: "Ancient recipes refined with modern science for optimal results.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 border border-[#A48662]/15"
              >
                <h3
                  className="text-[#2B2925] text-2xl mb-4"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {item.title}
                </h3>
                <p className="text-[#5A554E]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#A48662] text-xs tracking-[0.3em] uppercase mb-4">
            The Vision
          </p>
          <h2
            className="text-[#2B2925] text-4xl mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            A Message from Our Founder
          </h2>
          <p className="text-[#5A554E] text-lg leading-relaxed mb-8">
            "Samprīti was born from a deep reverence for nature's healing power. 
            I wanted to create a space where ancient wisdom meets contemporary 
            beauty—a place where each product tells a story of tradition, 
            sustainability, and transformation."
          </p>
          <p className="text-[#A48662] italic text-xl" style={{ fontFamily: "var(--font-serif)" }}>
            — The Founder
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}