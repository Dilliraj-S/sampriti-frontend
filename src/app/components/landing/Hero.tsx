"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const fadeInSlow = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2 } },
};

const fadeInDelay = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, delay: 0.3 } },
};

const fadeInDelay2 = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, delay: 0.6 } },
};

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
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/admin';
        const [bRes, cRes] = await Promise.all([
          fetch(base + '/banners').then(r => r.json()),
          fetch(base + '/coupons').then(r => r.json())
        ]);
        if (bRes.status) setBanners(bRes.data?.filter((b: any) => b.status === 'active') || []);
        if (cRes.status) {
          const active = cRes.data?.find((c: any) => c.status === 'active');
          if (active) setPromoCoupon(active);
        }
      } catch {}
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
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      videoRef.current?.play().catch(() => {});
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
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y, scale }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/Assets/Sampriti Hero Video V 7.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" />
        {heroBanners.map((banner, i) => (
          <motion.div
            key={banner.id || i}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === currentBanner ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          />
        ))}
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-end justify-center px-6 pb-32 md:pb-[74px]">
        <motion.div
          variants={fadeInSlow}
          initial="hidden"
          animate="show"
          className="w-full max-w-3xl text-center"
        >
          {heroBanners.length > 0 ? (
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="mb-3 text-[14px] font-medium tracking-[0.08em] text-white/90 uppercase">
                {heroBanners[currentBanner]?.title || "Rooted In"}
              </p>
            </motion.div>
          ) : (
            <p className="mb-3 text-[14px] font-medium tracking-[0.08em] text-white">
              Rooted In
            </p>
          )}

          <h1
            className="mb-4 text-white text-3xl font-light leading-[1.15] tracking-[0.1em] sm:text-4xl sm:tracking-[0.18em] md:text-5xl md:tracking-[0.22em]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {heroBanners.length > 0 ? "Discover Our Collection" : "Living Herbal Lineages"}
          </h1>

          <motion.p
            variants={fadeInDelay}
            initial="hidden"
            animate="show"
            className="mx-auto mb-6 max-w-[94vw] text-center text-[clamp(10px,3vw,20px)] font-semibold leading-relaxed text-white/85"
          >
            <span className="block whitespace-nowrap">
              A botanical house of ritual science and disciplined formulation,
            </span>
            <span className="block whitespace-nowrap">
              guided by the quiet intelligence of the earth.
            </span>
          </motion.p>

          <motion.div variants={fadeInDelay2} initial="hidden" animate="show">
            <Link
              href="/shop"
              className="inline-flex min-h-16 items-center justify-center border-2 border-white px-7 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Discover the collection
            </Link>
          </motion.div>
        </motion.div>
      </div>

      

      {heroBanners.length > 1 && (
        <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-28">
          {heroBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentBanner ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

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
    </section>
  );
}
