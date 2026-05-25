"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-6 md:py-20 px-6" style={{ background: "#FFFFFF" }}>
      <div className="max-w-2xl mx-auto text-center">
        {/* Decorative botanical SVG line */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-center mb-8"
        >
          <svg
            width="120"
            height="24"
            viewBox="0 0 120 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className="text-gold/20"
          >
            <path d="M10 12 Q30 2 60 12 Q90 22 110 12" />
            <path d="M35 12 Q40 6 45 10" />
            <path d="M55 12 Q60 6 65 10" />
            <path d="M75 12 Q80 18 85 14" />
            {/* Small leaves */}
            <ellipse cx="42" cy="8" rx="6" ry="10" transform="rotate(-30 42 8)" />
<ellipse cx="62" cy="7" rx="6" ry="10" transform="rotate(-20 62 7)" />
<ellipse cx="82" cy="16" rx="6" ry="10" transform="rotate(20 82 16)" />
          </svg>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-gold text-xs tracking-[0.4em] uppercase mb-6"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          THE INNER CIRCLE
        </motion.p>

        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-3xl md:text-4xl mb-4"
          style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
        >
          Join the Botanical Lineage
        </motion.h2>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 max-w-md mx-auto"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 300, color: "#5A554E" }}
        >
          Receive our field notes on ancient formulations, seasonal rituals, and
          new botanical discoveries.
        </motion.p>

        {/* Email form */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 bg-transparent border-b"
            style={{ 
              fontFamily: "var(--font-sans)",
              borderColor: "rgba(43, 41, 37, 0.2)",
              color: "#2B2925",
              outline: "none",
              padding: "12px 4px",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            className="px-8 py-3 text-xs tracking-[0.2em] uppercase hover:opacity-80 transition-all duration-300 mt-4 sm:mt-0 cursor-pointer"
            style={{ 
              fontFamily: "var(--font-sans)", 
              fontWeight: 500,
              background: "#262420",
              color: "#F9F7F3",
            }}
          >
            {submitted ? "Welcomed ðŸŒ¿" : "Subscribe"}
          </button>
        </motion.form>

        {submitted && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sage-lt text-sm mt-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Welcome to the lineage. Your first field note is on its way.
          </motion.p>
        )}
      </div>
    </section>
  );
}
