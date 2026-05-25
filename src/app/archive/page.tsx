"use client";

import Image from "next/image";
import Navbar from "@/app/components/landing/Navbar";
import Archive from "@/app/components/landing/Archive";
import Footer from "@/app/components/landing/Footer";

export default function ArchivePage() {
  return (
    <main className="bg-[#FFFFFF] min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />
      <section className="relative flex min-h-screen items-end justify-center overflow-hidden px-6 pb-24 pt-24 text-center md:px-12 md:pb-32 lg:px-20">
        <Image
          src="/Assets/libray 1.webp"
          alt="The Archive"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto max-w-3xl text-white -mt-[1cm]">
          <h1
            className="mb-6 text-5xl font-light leading-tight md:text-7xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The Archive
          </h1>
          <p
            className="mb-10 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            A collection of essays, stories, and botanical insights.
          </p>
          <a
            href="#all-articles"
            className="inline-flex items-center justify-center bg-[#262420] px-8 py-4 text-white text-[0.68rem] uppercase tracking-[0.28em] transition-colors duration-300 hover:bg-[#3A342D]"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
          >
            Explore All Articles
          </a>
        </div>
      </section>
      <Archive initialExpanded showHeader={false} sectionId="all-articles" />
      <Footer />
    </main>
  );
}
