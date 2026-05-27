"use client";

import React from "react";
import ProvenanceHero from "./ProvenanceHero";
import JourneyTimeline from "./JourneyTimeline";
import ProcessFlow from "./ProcessFlow";
import RitualSection from "./RitualSection";
import { motion } from "framer-motion";

function VideoSection() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const videoContainer = document.getElementById('video-container');
    if (videoContainer) observer.observe(videoContainer);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section id="video-container" className="relative w-full py-24 md:py-32 overflow-hidden">
      <div className="w-full px-0 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 px-6 md:px-14"
        >
          <p 
            className="text-black text-xs tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Our Process
          </p>
          <h2 
            className="text-black text-3xl md:text-4xl font-light"
            style={{ fontFamily: "var(--font-serif)" }}
          >
             Nature’s Purity, Bottled Beautifully
          </h2>
        </motion.div>

        {/* Video Container - Full Width */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full overflow-hidden group cursor-pointer"
          style={{ borderRadius: "0px" }}
          onClick={togglePlay}
        >
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
            <video
              ref={videoRef}
              muted={isMuted}
              loop
              playsInline
              preload="none"
              className="w-full h-full object-cover"
            >
              <source src="/Assets/Sampriti Hero Video V 7.mp4" type="video/mp4" />
            </video>
            
            {/* Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)",
              }}
            />

          </div>

          {/* Controls */}
          <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex items-center gap-2 md:gap-3 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-10 h-10 md:w-12 md:h-12 border flex items-center justify-center transition-all duration-300 hover:bg-white/10"
              style={{
                background: "rgba(0,0,0,0.35)",
                borderColor: "rgba(255,255,255,0.55)",
                color: "white",
                backdropFilter: "blur(8px)",
              }}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="w-10 h-10 md:w-12 md:h-12 border flex items-center justify-center transition-all duration-300 hover:bg-white/10"
              style={{
                background: "rgba(0,0,0,0.35)",
                borderColor: "rgba(255,255,255,0.55)",
                color: "white",
                backdropFilter: "blur(8px)",
              }}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg className="w-[18px] h-[18px] md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                  <path d="m22 9-6 6" />
                  <path d="m16 9 6 6" />
                </svg>
              ) : (
                <svg className="w-[18px] h-[18px] md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ProvenanceSection() {
  return (
    <main
      style={{
        background: "#FFFFFF",
      }}
    >
      <ProvenanceHero />
      <VideoSection />
      <JourneyTimeline />
      <ProcessFlow />
      <RitualSection />
    </main>
  );
}
