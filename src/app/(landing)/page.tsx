import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/app/components/landing/Hero";
import Navbar from "@/app/components/landing/Navbar";

const SignatureRituals = dynamic(
  () => import("@/app/components/landing/SignatureRituals"),
  { ssr: true }
);

const VideoSection = dynamic(
  () => import("@/app/components/landing/VideoSection"),
  { ssr: true }
);

const ProvenancePreview = dynamic(
  () => import("@/app/components/landing/ProvenancePreview"),
  { ssr: true }
);

const Archive = dynamic(
  () => import("@/app/components/landing/Archive"),
  { ssr: true }
);

const SectionBanner = dynamic(
  () => import("@/app/components/landing/SectionBanner")
);

const Footer = dynamic(
  () => import("@/app/components/landing/Footer"),
  { ssr: true }
);

function SectionPlaceholder() {
  return <div className="min-h-[200px]" aria-hidden="true" />;
}

export default function HomePage() {
  return (
    <main className="bg-white" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />
      <Hero />
      <Suspense fallback={<SectionPlaceholder />}>
        <SignatureRituals />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <VideoSection />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <Archive />
      </Suspense>
      <Suspense fallback={null}>
        <SectionBanner />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <ProvenancePreview />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <Footer />
      </Suspense>
    </main>
  );
}
