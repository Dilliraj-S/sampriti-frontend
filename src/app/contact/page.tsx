"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/app/components/landing/Navbar";
import dynamic from "next/dynamic";

const Footer = dynamic(
  () => import("@/app/components/landing/Footer"),
  { ssr: true }
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled />

      <div className="pt-50 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-[#A48662] text-xs tracking-[0.4em] uppercase mb-4">
              Get in Touch
            </p>
            <h1
              className="text-[#2B2925] text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Contact Us
            </h1>
            <p className="text-[#5A554E] mt-4 max-w-md mx-auto">
              Have a question about our products or need guidance on your ritual? 
              We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2
                className="text-[#2B2925] text-2xl mb-8"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Visit Our Studio
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-[#A48662] text-xs tracking-[0.2em] uppercase mb-2">
                    Address
                  </p>
                  <p className="text-[#5A554E]">
                    Samprīti Botanicals<br />
                    123 Botanical Lane<br />
                    Kerala, India 695001
                  </p>
                </div>
                <div>
                  <p className="text-[#A48662] text-xs tracking-[0.2em] uppercase mb-2">
                    Email
                  </p>
                  <p className="text-[#5A554E]">hello@sampritibotanicals.com</p>
                </div>
                <div>
                  <p className="text-[#A48662] text-xs tracking-[0.2em] uppercase mb-2">
                    Phone
                  </p>
                  <p className="text-[#5A554E]">+91 98765 43210</p>
                </div>
                <div>
                  <p className="text-[#A48662] text-xs tracking-[0.2em] uppercase mb-2">
                    Hours
                  </p>
                  <p className="text-[#5A554E]">
                    Mon - Sat: 10:00 AM - 7:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-2 border-[#A48662] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="text-[#A48662]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    className="text-[#2B2925] text-2xl mb-4"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Thank You
                  </h3>
                  <p className="text-[#5A554E]">
                    Your message has been sent. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-[#5A554E] text-xs tracking-[0.2em] uppercase block mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-[#A48662]/30 text-[#2B2925] px-4 py-3 focus:border-[#A48662] focus:outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-[#5A554E] text-xs tracking-[0.2em] uppercase block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-[#A48662]/30 text-[#2B2925] px-4 py-3 focus:border-[#A48662] focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="text-[#5A554E] text-xs tracking-[0.2em] uppercase block mb-2">
                      Subject
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-[#A48662]/30 text-[#2B2925] px-4 py-3 focus:border-[#A48662] focus:outline-none transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="product">Product Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#5A554E] text-xs tracking-[0.2em] uppercase block mb-2">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-[#A48662]/30 text-[#2B2925] px-4 py-3 focus:border-[#A48662] focus:outline-none transition-colors resize-none"
                      placeholder="Write your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#2B2925] text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}