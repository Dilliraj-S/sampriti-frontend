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
            className="inline-flex min-h-16 items-center justify-center border-2 border-white px-7 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Explore All Articles
          </a>
        </div>
      </section>
      <Archive initialExpanded showHeader={false} sectionId="all-articles" />

      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <Image
          src="/assests/images/Img.webp"
          alt="Explore The Archive"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-20 text-center">
          <div className="max-w-3xl">
            <h2 className="mb-5 text-4xl font-light leading-tight text-white md:text-6xl lg:text-7xl" style={{ fontFamily: "var(--font-serif)" }}>
              The Archive
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-white/80 md:text-lg" style={{ fontWeight: 300 }}>
              A collection of essays, stories, and botanical insights.
            </p>
            <button
              type="button"
              onClick={() => { window.location.href = "/"; }}
              className="inline-flex min-h-16 items-center justify-center border-2 border-white px-7 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
