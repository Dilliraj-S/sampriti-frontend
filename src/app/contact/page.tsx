"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
    phone: "",
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.comment.trim()) errs.comment = "Comment is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled />

      {/* Hero Image */}
      <div className="relative w-full h-screen h-dvh max-h-dvh overflow-hidden">
        <Image
          src="/assets/img.webp"
          alt="Get in touch"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex flex-col items-center">
          <div className="h-[calc(50vh+76px)]"></div>
          <span
            className="text-white text-[22px] md:text-[28px] font-[400] tracking-[0.08em]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Contact Us
          </span>
        </div>
      </div>

      <div className="py-16 px-6 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {/* Left — Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-10">
                <h2
                  className="text-[#2B2925] text-[22px] md:text-[26px] font-[400] tracking-[0.08em] mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Get in touch
                </h2>
                <p className="text-[#7A756D] text-sm font-light leading-relaxed">
                  Whether seeking a botanical consultation, ritual guidance or a professional collaboration, we invite you to initiate the conversation below.
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-2 border-[#A48662] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="text-[#A48662]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    className="text-[#2B2925] text-[22px] font-[400] tracking-[0.08em] mb-4"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Thank You
                  </h3>
                  <p className="text-[#7A756D] font-light">
                    Your message has been sent. We&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <label className="text-[#2B2925] text-xs tracking-[0.2em] uppercase block mb-1.5">
                      Name <span className="text-[#A48662]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-[#D4CFC5] text-[#2B2925] px-4 py-3 focus:border-[#A48662] focus:outline-none transition-colors text-sm"
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-[#2B2925] text-xs tracking-[0.2em] uppercase block mb-1.5">
                      Email <span className="text-[#A48662]">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-[#D4CFC5] text-[#2B2925] px-4 py-3 focus:border-[#A48662] focus:outline-none transition-colors text-sm"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-[#2B2925] text-xs tracking-[0.2em] uppercase block mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-[#D4CFC5] text-[#2B2925] px-4 py-3 focus:border-[#A48662] focus:outline-none transition-colors text-sm"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-[#2B2925] text-xs tracking-[0.2em] uppercase block mb-1.5">
                      Comment <span className="text-[#A48662]">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full bg-white border border-[#D4CFC5] text-[#2B2925] px-4 py-3 focus:border-[#A48662] focus:outline-none transition-colors text-sm resize-none"
                      placeholder="Write your message..."
                    />
                    {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#2B2925] text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 cursor-pointer"
                  >
                    Submit
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right — Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:pt-2"
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-[#2B2925] text-xs tracking-[0.25em] uppercase mb-3 font-[400]" style={{ fontFamily: "var(--font-serif)" }}>
                    General Inquiries
                  </h3>
                  <a
                    href="mailto:sampritibotanicals@gmail.com"
                    className="text-[#7A756D] text-sm font-light hover:text-[#A48662] transition-colors"
                  >
                    sampritibotanicals@gmail.com
                  </a>
                </div>

                <div>
                  <h3 className="text-[#2B2925] text-xs tracking-[0.25em] uppercase mb-3 font-[400]" style={{ fontFamily: "var(--font-serif)" }}>
                    Address
                  </h3>
                  <address className="text-[#7A756D] text-sm font-light not-italic leading-relaxed">
                    Sampriti Chez nous Maitreya, Ami Road,
                    <br />
                    Near Sun Farm Auroville 605101,
                    <br />
                    Tamil Nadu, India
                  </address>
                </div>

                <div className="pt-4 border-t border-[#EBE7DF]">
                  <h3 className="text-[#2B2925] text-xs tracking-[0.25em] uppercase mb-4 font-[400]" style={{ fontFamily: "var(--font-serif)" }}>
                    Follow us on
                  </h3>
<div className="flex items-center gap-4">
                    <a href="https://www.instagram.com/sampritibotanicals" target="_blank" rel="noopener noreferrer" className="text-[#2C2A26] hover:text-[#A48662] transition-colors" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
                    <a href="https://www.facebook.com/sampritibotanicals" target="_blank" rel="noopener noreferrer" className="text-[#2C2A26] hover:text-[#A48662] transition-colors" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg></a>
                    <a href="https://x.com/sampritibotanicals" target="_blank" rel="noopener noreferrer" className="text-[#2C2A26] hover:text-[#A48662] transition-colors" aria-label="X (Twitter)"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                    <a href="https://pinterest.com/sampritibotanicals" target="_blank" rel="noopener noreferrer" className="text-[#2C2A26] hover:text-[#A48662] transition-colors" aria-label="Pinterest"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.633 0 12.017 0z"/></svg></a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
