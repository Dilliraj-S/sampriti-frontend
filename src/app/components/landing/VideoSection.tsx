"use client";

import { useState, useRef, useEffect } from "react";
export default function VideoSection() {
  const sectionRef = useRef(null);
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

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
    <section
      ref={sectionRef}
      className="bg-[#FDFAF5]"
      style={{ marginBottom: "120px" }}
    >
      <div className="grid min-h-[445px] grid-cols-1 items-stretch md:h-[calc(100vh-14rem)] md:min-h-[560px] md:grid-cols-[35vw_minmax(0,1fr)] md:pl-12 md:pt-6 lg:pl-20">
        <div className="flex max-w-[640px] flex-col justify-start px-6 pt-1 pb-4 md:px-0 md:py-0 md:pr-8 lg:pr-12"
        >
          <h2 className="text-[#333333] text-[20px] font-[500] tracking-[0.15em] mb-3" style={{ fontFamily: '"Tenor Sans", sans-serif' }}>
            The Intelligence of Ancient<br />Botanicals
          </h2>
          <p className="text-[#333333] text-[16px] leading-[29px] font-[300]" style={{ fontFamily: "Inter, sans-serif" }}>
            Emerging from India&apos;s diverse herbal traditions and regional pharmacopoeias, our formulations draw from centuries of botanical wisdom practiced,and perfected across generations. Each blend honours the intelligence of classical herbal alchemy, cultivating vitality and balance through ritual and sustained practice.
          </p>
          <div className="flex justify-start w-full mt-8">
            <a
              href="/the-house"
              className="inline-flex w-fit items-center justify-center border border-[#333333] px-6 py-4 text-[12px] tracking-[0.05em] text-[#333333] transition-all duration-300 hover:bg-[#333333] hover:text-[#FFFEF2]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Discover The House
            </a>
          </div>
        </div>

        <div className="relative h-full min-h-[300px] overflow-hidden md:min-h-[400px]"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/assets/second.mp4" type="video/mp4" />
          </video>

          <div className="absolute bottom-8 right-8 z-10 flex gap-3">
            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center border border-white/70 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/35 cursor-pointer"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            <button
              onClick={toggleMute}
              className="flex h-12 w-12 items-center justify-center border border-white/70 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/35 cursor-pointer"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
