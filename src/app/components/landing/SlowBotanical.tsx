"use client";

import { motion } from "framer-motion";

const fadeInSlow = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0 } },
};

// Subtle image scale on hover
const imageHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.6 } },
};

const items = [
  {
    title: "Conscious Scaling",
    description: "Botanical Profile",
    body: "We prioritise the integrity of the soil over the speed of the market. Growth is measured in the wellbeing of the land. Every botanical is wildcrafted from its native terroir, honored in season.",
    image: "/Assets/forest girl.webp"
  },
  {
    title: "The Vessel",
    description: "Siddha Wisdom",
    body: "We choose glass, cork, and paper. Our goal is to leave no footprint—only a legacy that nourishes the earth. Packaging designed for longevity.",
    image: "/Assets/distillation.webp"
  },
  {
    title: "Super Health",
    description: "Moon Rhythms",
    body: "We translate the 4,000-year-old Siddha traditions into daily rituals. Wellness that transcends geography and time.",
    image: "/Assets/art of infusion.webp"
  },
];

export default function SlowBotanical() {
  return (
    <section className="bg-white py-20 md:py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Heading - Editorial */}
        <motion.h2
          variants={fadeInSlow}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-[#2C2A26] text-3xl md:text-4xl lg:text-5xl text-center mb-12 md:mb-16"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          The Slow Botanical Movement
        </motion.h2>

        {/* 3-column layout - Clean cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInSlow}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              {/* Image - Subtle */}
              <div className="relative aspect-[4/3] w-full mb-5 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>
              
              {/* Divider */}
              <div className="w-12 h-px bg-[#A48662]/40 mb-5" />

              <h3 className="text-[#2C2A26] text-lg md:text-xl font-light mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                {item.title}
              </h3>
              <p className="text-[#A48662] text-[9px] tracking-[0.25em] uppercase mb-3">
                {item.description}
              </p>
              <p className="text-[#8A847C] text-sm leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}