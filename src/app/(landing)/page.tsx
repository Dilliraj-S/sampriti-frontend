import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/app/components/landing/Hero";
import Navbar from "@/app/components/landing/Navbar";

const SignatureRituals = dynamic(
  () => import("@/app/components/landing/SignatureRituals"),
  { ssr: true }
);

const BlackTurmericSection = dynamic(
  () => import("@/app/components/landing/BlackTurmericSection"),
  { ssr: true }
);

const MateriaBotanicaSection = dynamic(
  () => import("@/app/components/landing/MateriaBotanicaSection"),
  { ssr: true }
);

const VideoSection = dynamic(
  () => import("@/app/components/landing/VideoSection"),
  { ssr: true }
);

const BrowseByCategory = dynamic(
  () => import("@/app/components/landing/BrowseByCategory"),
  { ssr: true }
);

const Archive = dynamic(
  () => import("@/app/components/landing/Archive"),
  { ssr: true }
);

const OurStandards = dynamic(
  () => import("@/app/components/landing/OurStandards"),
  { ssr: true }
);

const NewFragranceSection = dynamic(
  () => import("@/app/components/landing/NewFragranceSection"),
  { ssr: true }
);

const RecommendedReading = dynamic(
  () => import("@/app/components/landing/RecommendedReading"),
  { ssr: true }
);

const BottomBanner = dynamic(
  () => import("@/app/components/landing/BottomBanner"),
  { ssr: true }
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
        <BlackTurmericSection />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <MateriaBotanicaSection />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <VideoSection />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <BrowseByCategory />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <NewFragranceSection />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <RecommendedReading />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <OurStandards />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <Archive />
      </Suspense>
      <Suspense fallback={null}>
        <BottomBanner />
      </Suspense>
      <Suspense fallback={<SectionPlaceholder />}>
        <Footer />
      </Suspense>
    </main>
  );
}
