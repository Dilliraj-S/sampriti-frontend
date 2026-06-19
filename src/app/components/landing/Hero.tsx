"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";


export default function Hero() {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [banners, setBanners] = useState<any[]>([]);
  const [promoCoupon, setPromoCoupon] = useState<any>(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/admin';
        const [bRes, cRes] = await Promise.all([
          fetch(base + '/banners').then(r => r.json()),
          fetch(base + '/coupons').then(r => r.json())
        ]);
        if (bRes.status) setBanners(bRes.data?.filter((b: any) => b.status === 'active') || []);
        if (cRes.status) {
          const active = cRes.data?.find((c: any) => c.status === 'active');
          if (active) setPromoCoupon(active);
        }
      } catch { }
    })();
  }, []);

  const heroBanners = banners.filter((b: any) => b.location === 'homepage_hero');

  useEffect(() => {
    if (heroBanners.length < 2) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => { });
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      videoRef.current?.play().catch(() => { });
    }, 100);
    return () => clearTimeout(timer);
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
    <section ref={ref} className="relative w-full min-h-screen bg-[#F6F1E8] flex flex-col overflow-hidden">
      {/* Video Background - Cinematic */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/assets/Sampriti Hero Video V 7.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-end justify-center px-6 pb-32 md:pb-24">
        <div className="w-full max-w-[900px] text-center">
          {heroBanners.length > 0 ? (
            <div key={currentBanner}>
              <p className="mb-3 text-[clamp(0.6rem,1.5vw,0.75rem)] tracking-[0.1em] text-white/90" style={{ fontFamily: "var(--font-heading)" }}>
                Rooted In
              </p>
            </div>
          ) : (
            <p className="mb-3 text-[clamp(0.6rem,1.5vw,0.75rem)] tracking-[0.1em] text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Rooted In
            </p>
          )}

          <h1
            className="text-white font-[400] mx-auto mb-4 text-[24px] md:text-[34px] leading-[26px] md:leading-[44px]"
            style={{ fontFamily: "\"Tenor Sans\", \"Tenor Sans Fallback\", \"Tenor Sans\", system-ui, sans-serif", letterSpacing: "0.1em", textShadow: "0 2px 10px rgba(0,0,0,0.3)", maxWidth: "900px" }}
          >
            Living Herbal Lineages
          </h1>

          <p
            className="mx-auto text-center font-[400] text-white/90 max-w-[700px] text-[14px] md:text-[17px] leading-[22px] md:leading-[27px]"
            style={{ fontFamily: "Inter, sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
          >
            A botanical house of ritual science and disciplined formulation, guided<br />by the quiet intelligence of the earth.
          </p>
        </div>
      </div>


      {heroBanners.length > 1 && (
        <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-28">
          {heroBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentBanner ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
            />
          ))}
        </div>
      )}

      {/* Desktop: discover button centered */}
      <div className="absolute bottom-5 left-0 right-0 z-10 hidden justify-center px-8 md:flex md:bottom-8">
        <Link
          href="/category/infusions"
          className="inline-flex h-11 cursor-pointer items-center justify-center border border-white/70 bg-black/25 px-7 text-[12px] leading-[22px] tracking-[0.2em] font-[400] text-[rgb(255,254,242)] backdrop-blur-sm transition-colors duration-300 hover:bg-[#2C2A26]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Discover The Collection
        </Link>
      </div>

      {/* Desktop: controls bottom right */}
      <div className="absolute bottom-5 right-8 z-10 hidden gap-3 md:flex md:bottom-8">
        <button
          onClick={togglePlay}
          className="flex h-12 w-12 cursor-pointer items-center justify-center border border-white/35 bg-black/20 text-white transition-colors hover:bg-[#2C2A26]"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          onClick={toggleMute}
          className="flex h-12 w-12 cursor-pointer items-center justify-center border border-white/35 bg-black/20 text-white transition-colors hover:bg-[#2C2A26]"
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

      {/* Mobile: discover button centered above */}
      <div className="absolute bottom-17 left-0 right-0 z-10 flex justify-center px-6 md:hidden">
        <Link
          href="/category/infusions"
          className="inline-flex h-11 cursor-pointer items-center justify-center border border-white/70 bg-black/25 px-5 text-[12px] leading-[22px] tracking-[0.2em] font-[400] text-[rgb(255,254,242)] backdrop-blur-sm transition-colors duration-300 hover:bg-[#2C2A26]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Discover The Collection
        </Link>
      </div>

      {/* Mobile: controls bottom right */}
      <div className="absolute bottom-1 right-2 z-10 flex gap-2 md:hidden">
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 cursor-pointer items-center justify-center border border-white/35 bg-black/20 text-white transition-colors hover:bg-[#2C2A26]"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          onClick={toggleMute}
          className="flex h-10 w-10 cursor-pointer items-center justify-center border border-white/35 bg-black/20 text-white transition-colors hover:bg-[#2C2A26]"
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
    </section>
  );
}
