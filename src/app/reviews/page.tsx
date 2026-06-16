"use client";

import { motion } from "framer-motion";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";

const reviews = [
  {
    name: "Ananya Sharma",
    location: "New Delhi, India",
    rating: 5,
    title: "A transformative ritual",
    text: "Shakti Peya has become my morning anchor. The warmth of the botanicals lingers long after the cup is empty — a quiet activation that carries me through the day. This is not just tea; it is a daily return to the body.",
    product: "Shakti Peya"
  },
  {
    name: "James Whitfield",
    location: "London, UK",
    rating: 5,
    title: "Deep restoration",
    text: "I was skeptical about herbal formulations until I experienced Chandra Rasa. My sleep cycles have shifted entirely — deeper, more coherent. The ritual of preparation itself is a meditation. Remarkable craftsmanship.",
    product: "Chandra Rasa"
  },
  {
    name: "Priya Mehta",
    location: "Mumbai, India",
    rating: 5,
    title: "Botanical intelligence",
    text: "Black Turmeric is unlike anything I have encountered. The depth of its recovery support is palpable. After three weeks of consistent use, my joint mobility and energy levels have noticeably transformed.",
    product: "Black Turmeric"
  },
  {
    name: "Sophie Laurent",
    location: "Paris, France",
    rating: 5,
    title: "Elegance in every sip",
    text: "The Hibiscus infusion is a masterpiece. Tart, vibrant, and deeply refreshing. I serve it both hot and chilled — it has replaced my morning coffee. My skin has never looked more radiant.",
    product: "Hibiscus"
  },
  {
    name: "Rajesh Krishnan",
    location: "Bangalore, India",
    rating: 5,
    title: "Ancient wisdom, modern delivery",
    text: "What draws me to Sampriti is the integrity behind each formulation. The glass vessels, the cork seals, the absence of synthetics — every detail communicates respect for the plant and the person.",
    product: "Rose"
  },
  {
    name: "Emily Chen",
    location: "San Francisco, USA",
    rating: 4,
    title: "A new standard",
    text: "Blue Butterfly Pea has become my afternoon ritual. The colour transformation with lemon is mesmerising, and the cognitive clarity it brings is subtle yet real. Beautifully packaged, thoughtfully made.",
    product: "Blue Butterfly Pea"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function ReviewsPage() {
  return (
    <main className="bg-[#FDFAF5] min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled />

      <div className="pt-32 pb-16 px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
          <h1 className="text-[#2C2A26] text-[28px] leading-[34px] md:text-[32px] md:leading-[42px] font-[400]" style={{ fontFamily: '"Tenor Sans", "Tenor Sans Fallback", "Tenor Sans", system-ui, sans-serif' }}>
            Customer Reviews
          </h1>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-[#EBE7DF] p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-[#C9A76A]" : "text-[#D4CFC5]"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <h3 className="text-[#2B2925] text-lg font-light mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                  {review.title}
                </h3>
                <p className="text-[#5A554E] text-sm leading-relaxed mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#EBE7DF]">
                  <div>
                    <p className="text-[#2B2925] text-sm font-medium">{review.name}</p>
                    <p className="text-[#7A756D] text-xs">{review.location}</p>
                  </div>
                  <span className="text-[#A48662] text-[10px] tracking-[0.15em] uppercase">{review.product}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
