"use client";

import Image from "next/image";
import Navbar from "@/app/components/landing/Navbar";
import Archive from "@/app/components/landing/Archive";
import Footer from "@/app/components/landing/Footer";

export default function ArchivePage() {
  return (
    <main className="bg-[#FDFAF5] min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />
      <section className="relative min-h-screen w-full overflow-hidden bg-black">
        <Image
          src="/assets/The-archive-hero.webp"
          alt="The Archive"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-48 px-6 text-center">
          <div className="mx-auto max-w-3xl text-white">
            <h1
              className="mb-4 text-xl font-light leading-tight md:text-2xl lg:text-3xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              The Archive
            </h1>
            <p
              className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 md:text-lg"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              A collection of essays, stories, and botanical insights.
            </p>
          </div>
        </div>
      </section>
      <Archive initialExpanded showHeader={false} sectionId="all-articles" />

      <Footer />
    </main>
  );
}
