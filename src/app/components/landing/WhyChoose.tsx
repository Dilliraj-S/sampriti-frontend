"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const features = [
  {
    number: "01",
    title: "Single-Origin Botanicals",
    description: "Harvested from specific regions known for potency and purity.",
  },
  {
    number: "02",
    title: "Siddha & Ayurvedic Lineage",
    description: "Formulations verified by traditional practitioners.",
  },
  {
    number: "03",
    title: "Lab-Tested Purity",
    description: "Every batch tested for heavy metals and contaminants.",
  },
  {
    number: "04",
    title: "Regenerative Sourcing",
    description: "Partnering with farmers who restore soil health.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-white py-24 md:py-32 lg:py-40 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20 md:mb-28"
        >
          <p
            className="text-[#A48662] text-[11px] font-medium tracking-[0.25em] uppercase mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Our Promise
          </p>

          <h2
            className="text-[#2B2925] text-4xl md:text-5xl lg:text-[3.5rem] font-normal leading-tight mb-6"
            style={{
              fontFamily: "var(--font-serif)",
              letterSpacing: "0.02em",
            }}
          >
            Why Choose Sampr&#299;ti
          </h2>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-[1px] bg-[#A48662]/40" />
          </div>

          <p
            className="text-[#5A554E] text-[15px] md:text-[17px] leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Rooted in ancient wisdom. Crafted for modern living.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group bg-[#FFFCF8] border border-[#E8DFD2] rounded-[60px] p-7 md:p-8 text-center transition-all duration-500 hover:shadow-[0_8px_30px_-6px_rgba(43,41,37,0.08)]"
            >
              {/* Number Circle */}
              <div className="mx-auto w-10 h-10 rounded-full border border-[#A48662]/30 flex items-center justify-center mb-6 transition-all duration-500 group-hover:border-[#A48662] group-hover:bg-[#A48662]/5">
                <span
                  className="text-[#A48662] text-xs font-medium tracking-wider"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {feature.number}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-[#2B2925] text-[14px] font-medium tracking-[0.08em] uppercase mb-3"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {feature.title}
              </h3>

              {/* Divider */}
              <div className="flex justify-center mb-4">
                <div className="w-8 h-[1px] bg-[#A48662]/30 group-hover:w-12 group-hover:bg-[#A48662]/50 transition-all duration-500" />
              </div>

              {/* Description */}
              <p
                className="text-[#6B6560] text-[13px] leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}