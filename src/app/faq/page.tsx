"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import Link from "next/link";
import { faqCategories } from "@/data/faq";

export default function FAQPage() {
  return (
    <Suspense fallback={<div />}>
      <FAQContent />
    </Suspense>
  );
}

function FAQContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (categoryParam && faqCategories.some((c) => c.id === categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const category = faqCategories.find((c) => c.id === activeCategory) || faqCategories[0];

  const toggleQuestion = (key: string) => {
    setOpenQuestion(openQuestion === key ? null : key);
  };

  const allQuestions = useMemo(() => {
    const result: { key: string; question: string; answer: string }[] = [];
    for (const sub of category.subCategories) {
      for (const item of sub.items) {
        result.push({ key: item.question, question: item.question, answer: item.answer });
      }
    }
    return result;
  }, [category]);

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />

      <section className="bg-[#FDFAF5] px-6 pb-28 pt-32 md:px-12 lg:px-20 lg:pt-44 lg:pb-36">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] mb-8 md:mb-10" style={{ color: "#333333" }}>
            <a href="/" className="hover:opacity-70 transition-opacity capitalize">Home</a>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link href="/faq" className="hover:opacity-70 transition-opacity capitalize">Faq</Link>
            {category.id !== faqCategories[0].id && (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="capitalize">{category.title}</span>
              </>
            )}
          </div>

          {/* Page heading */}
          <div className="mb-10 md:mb-12" style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: "'Tenor Sans', 'Tenor Sans Fallback', system-ui, sans-serif", fontWeight: 400, fontSize: "clamp(24px, 5vw, 32px)", lineHeight: "1.3", color: "rgb(51, 51, 51)", letterSpacing: "0.02em" }}>
              Frequently Asked Questions
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-10 md:mb-12">
            <a
              href="/contact"
              className="inline-flex h-10 items-center gap-2 border px-5 text-[11px] tracking-[0.15em] uppercase transition-colors cursor-pointer"
              style={{ borderColor: "rgba(164,134,98,0.25)", color: "#5A554E" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Submit an enquiry
            </a>
            <a
              href="/account/orders"
              className="inline-flex h-10 items-center gap-2 border px-5 text-[11px] tracking-[0.15em] uppercase transition-colors cursor-pointer"
              style={{ borderColor: "rgba(164,134,98,0.25)", color: "#5A554E" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Track your order
            </a>
          </div>

          {/* Main layout: sidebar + content */}
          <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-16">
            {/* Sidebar */}
            <aside className="lg:w-56 xl:w-64 shrink-0 mb-8 lg:mb-0">
              <nav>
                <ul className="space-y-1">
                  {faqCategories.map((cat) => {
                    const isActive = cat.id === activeCategory;
                    return (
                      <li key={cat.id}>
                        <Link
                          href={`/faq?category=${cat.id}`}
                          onClick={() => { setActiveCategory(cat.id); setOpenQuestion(null); }}
                          className="block w-full text-left px-4 py-3 text-sm cursor-pointer"
                          style={{
                            fontFamily: "var(--font-sans)",
                            color: isActive ? "#2B2925" : "#5A554E",
                            background: isActive ? "rgba(164,134,98,0.08)" : "transparent",
                            border: "none",
                          }}
                        >
                          {cat.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-8">
                <h2 className="text-[#2B2925] text-[20px] md:text-[24px] font-light tracking-[0.04em] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                  {category.title}
                </h2>
                <p className="text-[#5A554E] text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div style={{ borderTop: "1px solid rgba(164,134,98,0.1)" }}>
                {allQuestions.map((item) => {
                  const isOpen = openQuestion === item.key;
                  return (
                    <div
                      key={item.key}
                      style={{ borderBottom: "1px solid rgba(164,134,98,0.08)" }}
                    >
                      <button
                        onClick={() => toggleQuestion(item.key)}
                        className="w-full flex items-center justify-between gap-4 py-4 md:py-5 text-left cursor-pointer transition-colors hover:bg-[rgba(164,134,98,0.03)]"
                      >
                        <span className="text-sm md:text-[15px] text-[#2B2925] leading-relaxed flex-1">
                          {item.question}
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#A48662"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 transition-transform duration-300"
                          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>

                      <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: isOpen ? "500px" : "0",
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <div className="pb-5 md:pb-6 pr-8">
                          <p className="text-sm text-[#5A554E] leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Contact us */}
              <div className="mt-12 pt-8 text-center" style={{ borderTop: "1px solid rgba(164,134,98,0.1)" }}>
                <p className="text-[#5A554E] text-sm mb-5">
                  Cannot find what you are looking for? We warmly invite you to contact us.
                </p>
                <a
                  href="/contact"
                  className="inline-flex h-11 cursor-pointer items-center justify-center bg-[#262420] px-7 text-[11px] tracking-[0.2em] text-[#F9F7F3] transition-opacity hover:opacity-90"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
