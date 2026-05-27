"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/app/components/landing/cartStore";
import { useState, useEffect, useRef } from "react";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import ProductImage from "@/app/components/landing/ProductImage";
import { getSectionAssignments } from "@/app/components/landing/sectionStorage";
import { normalizeImagePath } from "@/app/utils/normalizeImagePath";

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  subtitle?: string;
  category?: { name?: string };
  benefits?: string;
  format?: string;
  price?: string | number;
  image?: string;
  hoverImage?: string;
  description?: string;
  homepageSection?: string;
  createdAt: string;
  updatedAt?: string;
};

type RitualProduct = {
  id: string;
  productId?: number;
  name: string;
  subtitle: string;
  category: string;
  benefits: string;
  format: string;
  price: number;
  image: string;
  hoverImage?: string;
  description?: string;
  homepageSection?: string;
  createdAt?: string;
  updatedAt?: string;
};

const fallbackProducts = [
  { id: "shakti-peya", name: "Shakti Peya", subtitle: "Energy Elixir", category: "Activation", benefits: "Activation · Anti-Aging · Radiance", format: "9 Test Tube Kit", price: 54, image: "/Assets/shakti peya product hd.png", hoverImage: "/Assets/shakti peya hover.png" },
  { id: "chandra-rasa", name: "Chandra Rasa", subtitle: "Sleep Potion", category: "Calm", benefits: "Calm · Settling · Restorative", format: "9 Test Tube Kit", price: 54, image: "/Assets/Chandra rasa product hd.webp", hoverImage: "/Assets/chandra rasa hover.webp" },
  { id: "shotharaha", name: "Shotharaha", subtitle: "Dual Black Recovery", category: "Restorative", benefits: "", format: "", description: "", price: 54, image: "/Assets/shakti peya product hd.png", hoverImage: "/Assets/shakti peya hover.png" },
  { id: "rose", name: "Rose", subtitle: "Rosa Damascena", category: "Floral", benefits: "", format: "", description: "A delicate floral essence to soothe the heart.", price: 42, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp" },
  { id: "hibiscus", name: "Hibiscus", subtitle: "Rosa-Sinensis", category: "Antioxidant", benefits: "", format: "", description: "A vibrant botanical infusion rich in antioxidants.", price: 42, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png" },
  { id: "blue-butterfly-pea", name: "Blue Butterfly Pea", subtitle: "Clitoria Ternatea", category: "Azure", benefits: "", format: "", description: "A brilliant blue infusion to enhance cognitive function.", price: 42, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp" },
  { id: "vatari", name: "Vatari", subtitle: "Botanical Botox", category: "Skincare", benefits: "", format: "", description: "", price: 48, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png" },
  { id: "kanti", name: "Kanti", subtitle: "Red Radiance", category: "Skincare", benefits: "", format: "", description: "", price: 48, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp" },
  { id: "blue-ojas", name: "Blue Ojas", subtitle: "Vitality Concentrate", category: "Skincare", benefits: "", format: "", description: "", price: 48, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp" },
  { id: "parjanya", name: "Parjanya", subtitle: "The First Rain", category: "Fragrance", benefits: "", format: "", description: "", price: 54, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png" },
  { id: "jawa", name: "Jawa", subtitle: "Embers", category: "Fragrance", benefits: "", format: "", description: "", price: 54, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp" },
  { id: "kha", name: "Kha", subtitle: "The Zero Point", category: "Fragrance", benefits: "", format: "", description: "", price: 54, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp" },
];

const productImageFallbacks = new Map([
  ["black-turmeric", { image: "/Assets/black turmeric hd.webp", hoverImage: "/Assets/black turmeric hover.webp" }],
]);

const categoryPageSections = new Set(["infusions", "skincare", "fragrance", "ceremony", "atmosphere"]);

const fadeInSlow = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 1.0 } } };

export default function SignatureRituals() {
  const [products, setProducts] = useState<RitualProduct[]>(fallbackProducts);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [sectionSlides, setSectionSlides] = useState<Record<string, number>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    (async () => {
      const [pRes, settings] = await Promise.all([api.get<ApiProduct[]>("/products"), getSettings().catch(() => ({ currency: "INR", exchange_rate: "85" }))]);
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      const assignments = getSectionAssignments();
      console.log("[SignatureRituals] Assignments from localStorage:", assignments);
      console.log("[SignatureRituals] API products:", pRes.data?.map(p => ({ slug: p.slug, name: p.name })));
      if (pRes.status && pRes.data?.length) {
        const fbMap = new Map(fallbackProducts.map(f => [f.id, f]));
        const merged = pRes.data.map((p: ApiProduct) => {
          const fb = fbMap.get(p.slug);
          const imageFallback = productImageFallbacks.get(p.slug);
          const hasBackendSection = Object.prototype.hasOwnProperty.call(p, "homepageSection");
          const section = hasBackendSection ? (p.homepageSection || "") : (assignments[String(p.id)] || assignments[p.slug] || "");
          return {
            id: p.slug,
            productId: p.id,
            name: p.name || fb?.name || "",
            subtitle: p.subtitle || fb?.subtitle || "",
            category: p.category?.name || fb?.category || "",
            benefits: p.benefits || fb?.benefits || "",
            format: p.format || fb?.format || "",
            price: parseFloat(String(p.price || 0)) || fb?.price || 0,
            image: imageFallback?.image || normalizeImagePath(p.image) || fb?.image || "",
            hoverImage: imageFallback?.hoverImage || normalizeImagePath(p.hoverImage) || fb?.hoverImage || "",
            description: p.description || fb?.description || "",
            homepageSection: section,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt || p.createdAt,
          };
        }).filter((product) => !categoryPageSections.has(product.homepageSection || ""));
        merged.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        setProducts(merged);
      } else if (Object.keys(assignments).length) {
        setProducts((prev) => prev.map((p) => {
          if (assignments[p.id]) return { ...p, homepageSection: assignments[p.id] };
          return p;
        }));
      }
    })();
  }, []);

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
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) { videoRef.current.muted = !videoRef.current.muted; setIsMuted(videoRef.current.muted); }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); }
      else { videoRef.current.pause(); setIsPlaying(false); }
    }
  };

  const featuredProducts = products.filter((p) => !p.homepageSection).slice(0, 2);
  const featuredProductIds = new Set(featuredProducts.map((p) => p.id));
  const remainingProducts = products.filter((p) => !featuredProductIds.has(p.id));

  const sectionLabels: Record<string, string> = {
    home: "The Home Collection",
    infusions: "Infusions",
    skincare: "Skincare",
    fragrance: "Fragrance",
    ceremony: "Ceremony",
    atmosphere: "Atmosphere",
  };

  const groupedBySection = remainingProducts.reduce((acc, p) => {
    const section = (p as any).homepageSection || "__default";
    if (!acc[section]) acc[section] = [];
    acc[section].push(p);
    return acc;
  }, {} as Record<string, typeof remainingProducts>);

  const sectionOrder = ["home", "infusions", "skincare", "fragrance", "ceremony", "atmosphere", "__default"];

  const handleAddToCart = (product: (typeof products)[0]) => { addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }); openCart(); };

  return (
    <section id="shop" className="bg-white py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16 md:mb-20">
          <h2 className="text-[#2C2A26] text-3xl md:text-4xl lg:text-5xl font-light" style={{ fontFamily: "var(--font-serif)" }}>Signature Rituals</h2>
          <p className="text-[#8A847C] mt-6 text-base md:text-lg leading-relaxed max-w-4xl mx-auto md:whitespace-nowrap">A collection of precisely composed formulations honoring the body&apos;s essential cycles: activation and restoration.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-20">
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="group">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative mb-4 flex aspect-[1.9/1] items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                  <ProductImage
                    src={hoveredProduct === product.id && product.hoverImage ? product.hoverImage : product.image}
                    alt={product.name}
                    fill
                    className="object-contain transition-opacity duration-500 mix-blend-multiply"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </Link>
              <div className="text-center">
                <h3 className="mb-1 text-[#2C2A26] text-[20px] font-normal tracking-[0.16em]" style={{ fontFamily: "var(--font-sans)" }}>{product.name} | {product.subtitle}</h3>
                <p className="mb-6 text-[#6F6A64] text-base">{product.benefits}</p>
                <p className="mb-8 text-[#6F6A64] text-base">{product.format}</p>
                <p className="text-[#2C2A26] text-xl font-light">{formatPrice(product.price, currency, exchangeRate)}</p>
              </div>
              <button onClick={() => handleAddToCart(product)} className="mt-3 flex h-12 px-8 items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-all duration-300 cursor-pointer">Add To Cart</button>
            </motion.div>
          ))}
        </div>

        {/* Black Turmeric Video */}
        <motion.div variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative left-1/2 -translate-x-1/2 w-screen mb-20">
          <div className="flex flex-col md:flex-row md:items-stretch">
            <div className="relative h-full min-h-[300px] overflow-hidden md:min-h-[400px] md:w-[58%]">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src="/assests/videos/black turmeric vid.mp4" type="video/mp4" />
              </video>
              <div className="absolute bottom-8 right-8 z-10 flex gap-3">
                <button
                  onClick={togglePlay}
                  className="flex h-12 w-12 items-center justify-center border border-white/70 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/35 cursor-pointer"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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
            <div className="flex flex-col justify-center px-6 py-10 md:py-0 md:pl-12 md:pr-12 lg:pl-20 lg:pr-20 md:w-[42%]">
              <Link href="/product/black-turmeric" className="block">
                <div className="relative mb-3 flex h-[310px] items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct("black-turmeric")} onMouseLeave={() => setHoveredProduct(null)}>
                  <ProductImage
                    src="/Assets/black turmeric hd.webp"
                    alt="Black Turmeric"
                    fill
                    className={`object-contain p-0 transition-opacity duration-500 mix-blend-multiply ${hoveredProduct === "black-turmeric" ? "opacity-0" : "opacity-100"}`}
                    sizes="33vw"
                  />
                  <ProductImage
                    src="/Assets/black turmeric hover.webp"
                    alt="Black Turmeric"
                    fill
                    className={`object-contain p-0 transition-opacity duration-500 mix-blend-multiply ${hoveredProduct === "black-turmeric" ? "opacity-100" : "opacity-0"}`}
                    sizes="33vw"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-[#2C2A26] text-[19px] font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)" }}>Black Turmeric</h3>
                  <p className="mt-1 text-[15px] italic tracking-[0.08em] text-[#6F6A64]">Curcuma Caesia</p>
                  <p className="mx-auto mt-3 text-[15px] leading-relaxed text-[#8A847C]">A rare Kaya Kalpa agent for profound recovery and cellular longevity.</p>
                  <p className="mt-4 text-[#2C2A26] text-xl font-light">{formatPrice(45, currency, exchangeRate)}</p>
                </div>
              </Link>
              <button onClick={() => { addItem({ id: "black-turmeric", name: "Black Turmeric", price: 45, quantity: 1, image: "/Assets/black turmeric hd.webp" }); openCart(); }} className="mt-2 flex h-12 px-8 items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-colors duration-300 cursor-pointer">Add To Cart</button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mt-10 md:mt-12 mb-16 md:mb-20">
          <h2 className="text-[#2C2A26] text-3xl md:text-4xl lg:text-5xl font-light" style={{ fontFamily: "var(--font-serif)" }}>Materia Botanica</h2>
          <p className="mx-auto mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-[#8A847C]">A collection of high-functioning botanical infusions, each chosen for its unique therapeutic profile and ancestral significance.</p>
        </motion.div>

        {sectionOrder.map((sectionKey) => {
          const sectionProducts = groupedBySection[sectionKey];
          if (!sectionProducts?.length) return null;
          const label = sectionKey === "__default" ? "" : sectionLabels[sectionKey];
          const slide = sectionSlides[sectionKey] || 0;
          const maxSlide = Math.max(0, sectionProducts.length - 3);
          const visible = sectionProducts.slice(slide, slide + 3);
          return (
            <div key={sectionKey} className="mb-16 last:mb-0">
              {label && (
                <motion.div variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
                  <h3 className="text-[#2C2A26] text-2xl md:text-3xl font-light tracking-[0.08em]" style={{ fontFamily: "var(--font-serif)" }}>{label}</h3>
                </motion.div>
              )}
              <div className="relative md:left-1/2 md:w-screen md:-translate-x-1/2">
                {slide > 0 && (
                  <button type="button" onClick={() => setSectionSlides((prev) => ({ ...prev, [sectionKey]: Math.max(0, slide - 1) }))} className="absolute -left-3 top-[50%] z-10 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white text-[#2C2A26] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-gray-50 hidden md:flex"><ChevronLeft size={26} strokeWidth={1.8} /></button>
                )}
                {slide < maxSlide && (
                  <button type="button" onClick={() => setSectionSlides((prev) => ({ ...prev, [sectionKey]: Math.min(maxSlide, slide + 1) }))} className="absolute -right-3 top-[50%] z-10 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white text-[#2C2A26] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-gray-50 hidden md:flex"><ChevronRight size={26} strokeWidth={1.8} /></button>
                )}
                <div className="hidden md:grid md:grid-cols-3 gap-16">
                  {visible.map((product) => (
                    <div key={product.id} className="group flex min-w-0 flex-col justify-between">
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="relative mb-3 flex h-[310px] items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`object-contain p-0 transition-opacity duration-500 mix-blend-multiply ${hoveredProduct === product.id && product.hoverImage ? "opacity-0" : "opacity-100"}`}
                            sizes="33vw"
                          />
                          {product.hoverImage && (
                            <ProductImage
                              src={product.hoverImage}
                              alt={product.name}
                              fill
                              className={`object-contain p-0 transition-opacity duration-500 mix-blend-multiply ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}
                              sizes="33vw"
                            />
                          )}
                        </div>
                        <div className="text-center">
                          <h3 className="text-[#2C2A26] text-xl font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)" }}>{product.name}</h3>
                          <p className="mt-1 text-base italic tracking-[0.08em] text-[#6F6A64]">{product.subtitle}</p>
                          <p className="mx-auto mt-3 text-base leading-relaxed text-[#8A847C]">{product.description}</p>
                          <p className="mt-4 text-[#2C2A26] text-2xl font-light">{formatPrice(product.price, currency, exchangeRate)}</p>
                        </div>
                      </Link>
                      <button onClick={() => handleAddToCart(product)} className="mt-2 flex h-12 px-8 items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-colors duration-300 cursor-pointer">Add To Cart</button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-10 md:hidden">
                  {sectionProducts.map((product) => (
                    <motion.div key={product.id} variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="group flex min-w-0 flex-col justify-between">
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="relative mb-3 flex h-[310px] items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`object-contain p-0 transition-opacity duration-500 mix-blend-multiply ${hoveredProduct === product.id && product.hoverImage ? "opacity-0" : "opacity-100"}`}
                            sizes="100vw"
                          />
                          {product.hoverImage && (
                            <ProductImage
                              src={product.hoverImage}
                              alt={product.name}
                              fill
                              className={`object-contain p-0 transition-opacity duration-500 mix-blend-multiply ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}
                              sizes="100vw"
                            />
                          )}
                        </div>
                        <div className="text-center">
                          <h3 className="text-[#2C2A26] text-xl font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)" }}>{product.name}</h3>
                          <p className="mt-1 text-base italic tracking-[0.08em] text-[#6F6A64]">{product.subtitle}</p>
                          <p className="mx-auto mt-3 text-base leading-relaxed text-[#8A847C]">{product.description}</p>
                          <p className="mt-4 text-[#2C2A26] text-2xl font-light">{formatPrice(product.price, currency, exchangeRate)}</p>
                        </div>
                      </Link>
                      <button onClick={() => handleAddToCart(product)} className="mt-2 flex h-12 px-8 items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-colors duration-300 cursor-pointer">Add To Cart</button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
