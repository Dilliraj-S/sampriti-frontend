"use client";

import Navbar from "@/app/components/landing/Navbar";
import ProvenanceHero from "@/app/components/landing/ProvenanceHero";
import JourneyTimeline from "@/app/components/landing/JourneyTimeline";
import ProcessFlow from "../components/landing/ProcessFlow";
import RitualSection from "@/app/components/landing/RitualSection";
//import FoundationsBlock from "@/app/components/landing/FoundationsBlock";

import Footer from "@/app/components/landing/Footer";

export default function ProvenancePage() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <ProvenanceHero />
      <JourneyTimeline />
      <ProcessFlow />
      <RitualSection />
      <Footer />
    </main>
  );
}
