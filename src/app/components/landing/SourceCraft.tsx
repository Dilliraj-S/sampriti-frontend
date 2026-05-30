"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SourceCraft() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

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

  return (
    <section ref={sectionRef} style={{ background: "#FFFFFF" }}>
      <div className="grid md:grid-cols-2 items-stretch">
          {/* Left: Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full min-h-[400px] md:min-h-full overflow-hidden"
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/assests/videos/black%20turmeric.mp4" type="video/mp4" />
            </video>

            {/* Video Controls */}
            <div className="absolute bottom-5 right-5 z-10 flex gap-2 md:bottom-8 md:right-8 md:gap-3">
              <button
                onClick={togglePlay}
                className="flex h-10 w-10 cursor-pointer items-center justify-center border border-white/35 bg-black/20 text-white transition-colors hover:bg-white/15 md:h-12 md:w-12"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              <button
                onClick={toggleMute}
                className="flex h-10 w-10 cursor-pointer items-center justify-center border border-white/35 bg-black/20 text-white transition-colors hover:bg-white/15 md:h-12 md:w-12"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center px-4 md:px-16 lg:px-20 py-16 md:py-32"
          >
            <p
              className="text-xs tracking-[0.42em] uppercase mb-6"
              style={{ color: "#A48662", fontFamily: "var(--font-sans)", letterSpacing: "0.42em" }}
            >
              SOURCE & CRAFT
            </p>
            <div className="w-8 h-px mb-8" style={{ background: "#A48662" }} />
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6"
              style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
            >
              The Power of Botanicals
            </h2>
            <p
              className="text-sm md:text-base leading-relaxed max-w-lg"
              style={{ fontFamily: "var(--font-sans)", color: "#5A554E", fontWeight: 300, lineHeight: 1.9 }}
            >
              Nature provides an abundance of potent, restorative ingredients. Our formulations harness the pure essence of these botanicals, carefully selected for their efficacy and gentle harmony with the skin. Experience the transformative power of plant-based care.
            </p>
            <Link
              href="/provenance"
              className="mt-10 inline-flex h-12 items-center justify-center border border-[#2C2A26] px-12 text-[#2C2A26] text-sm font-medium transition-colors duration-300 hover:bg-[#2C2A26] hover:text-white w-fit"
            >
              Explore Provenance
            </Link>
          </motion.div>
      </div>
    </section>
  );
}
