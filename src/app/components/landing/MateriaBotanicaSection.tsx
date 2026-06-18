"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import ProductImage from "@/app/components/landing/ProductImage";
import { getSectionAssignments } from "@/app/components/landing/sectionStorage";
import { normalizeImagePath } from "@/app/utils/normalizeImagePath";
import { useCartStore } from "@/app/components/landing/cartStore";
import SaveButton from "@/app/components/landing/SaveButton";

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
  sections?: string[];
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
  sections?: string[];
  createdAt?: string;
  updatedAt?: string;
};

const fallbackProducts = [
  { id: "hibiscus", name: "Hibiscus", subtitle: "Rosa-Sinensis", category: "Antioxidant", benefits: "", format: "", description: "A vibrant botanical infusion rich in antioxidants for cardiovascular resilience.", price: 42, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp" },
  { id: "rose", name: "Rose", subtitle: "Rosa Damascena", category: "Floral", benefits: "", format: "", description: "A delicate floral essence to soothe the heart and refine natural radiance.", price: 42, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp" },
  { id: "blue-butterfly-pea", name: "Blue Butterfly Pea", subtitle: "Clitoria Ternatea", category: "Azure", benefits: "", format: "", description: "A brilliant blue infusion to enhance cognitive function and reduce stress.", price: 42, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp" },
  { id: "black-turmeric", name: "Black Turmeric", subtitle: "Curcuma Caesia", category: "Restorative", benefits: "", format: "", description: "A rare Kaya Kalpa agent for profound recovery and cellular longevity.", price: 45, image: "/assets/black turmeric hd.webp", hoverImage: "/assets/black turmeric hover.webp" },
];

const productImageFallbacks = new Map([
  ["black-turmeric", { image: "/assets/black turmeric hd.webp", hoverImage: "/assets/black turmeric hover.webp" }],
]);

function ProductSection({
  label,
  sectionProducts,
  currency,
  exchangeRate,
}: {
  label: string;
  sectionProducts: RitualProduct[];
  currency: string;
  exchangeRate: number;
}) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const maxStartIndex = Math.max(0, sectionProducts.length - 3);
  const totalDots = maxStartIndex + 1;
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  const isDragging = useRef(false);
  const wasDragged = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const getStep = useCallback(() => {
    if (!scrollRef.current) return 0;
    const firstCard = scrollRef.current.firstElementChild as HTMLElement | null;
    return (firstCard?.offsetWidth || 0) + 12;
  }, []);

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const step = getStep();
    if (step === 0) return;
    const index = Math.round(scrollRef.current.scrollLeft / step);
    const clampedIndex = Math.max(0, Math.min(index, maxStartIndex));
    setActiveIndex(clampedIndex);
    setCanScrollBack(clampedIndex > 0);
    setCanScrollForward(clampedIndex < maxStartIndex);
  }, [getStep, maxStartIndex]);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    if (!scrollRef.current) return;
    const step = getStep();
    if (step === 0) return;
    const clampedIndex = Math.max(0, Math.min(index, maxStartIndex));
    scrollRef.current.scrollTo({ left: step * clampedIndex, behavior });
    setActiveIndex(clampedIndex);
    setCanScrollBack(clampedIndex > 0);
    setCanScrollForward(clampedIndex < maxStartIndex);
  }, [getStep, maxStartIndex]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    e.preventDefault();
    wasDragged.current = false;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = scrollRef.current.scrollLeft;
  };

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging.current || !scrollRef.current) return;
      e.preventDefault();
      const dx = e.clientX - dragStartX.current;
      if (Math.abs(dx) > 5) wasDragged.current = true;
      if (wasDragged.current) scrollRef.current.scrollLeft = dragStartScroll.current - dx;
    };
    const handleUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      updateScrollState();
    };
    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
    };
  }, [updateScrollState]);

  const handleScroll = () => updateScrollState();

  const scrollProducts = (direction: "back" | "forward") => {
    scrollToIndex(direction === "forward" ? activeIndex + 1 : activeIndex - 1);
    window.setTimeout(updateScrollState, 350);
  };

  useEffect(() => {
    updateScrollState();
    const current = scrollRef.current;
    if (!current) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(current);
    return () => observer.disconnect();
  }, [sectionProducts.length, updateScrollState, getStep]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        el.scrollLeft += e.deltaX;
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div style={{ marginBottom: "80px" }}>
      {label && (
        <div className="text-center mb-10">
          <h3 className="text-[#2C2A26] text-2xl md:text-3xl font-light tracking-[0.08em]" style={{ fontFamily: "var(--font-serif)" }}>{label}</h3>
        </div>
      )}
      <div className="relative md:left-1/2 md:w-screen md:-translate-x-1/2">
        {canScrollBack && (
          <button type="button" onClick={() => scrollProducts("back")} className="absolute left-3 md:left-8 lg:left-12 top-[50%] z-10 -translate-y-1/2 h-8 w-8 cursor-pointer items-center justify-center bg-white text-[#2C2A26] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition hover:bg-gray-50 hidden md:flex"><ChevronLeft size={18} strokeWidth={2} /></button>
        )}
        {canScrollForward && (
          <button type="button" onClick={() => scrollProducts("forward")} className="absolute right-3 md:right-8 lg:right-12 top-[50%] z-10 -translate-y-1/2 h-8 w-8 cursor-pointer items-center justify-center bg-white text-[#2C2A26] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition hover:bg-gray-50 hidden md:flex"><ChevronRight size={18} strokeWidth={2} /></button>
        )}
        <div className="hidden md:block overflow-hidden select-none px-6 md:px-16 lg:px-24">
          <div
            ref={scrollRef}
            className="flex cursor-grab active:cursor-grabbing gap-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", overflowY: "hidden", overflowX: "hidden" }}
            onPointerDown={handlePointerDown}
            onScroll={handleScroll}
          >
            {sectionProducts.map((product) => (
              <div key={product.id} className="group flex min-w-0 shrink-0 overflow-hidden" style={{ flex: "0 0 calc((100% - 24px) / 3)" }}>
                <div className="flex flex-col h-full w-full">
                <div
                  onClick={(e) => {
                    if (wasDragged.current) { wasDragged.current = false; return; }
                    router.push(`/product/${product.id}`);
                  }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="flex flex-col flex-1 cursor-pointer"
                >
                  <div className="relative flex mx-auto w-full aspect-square shrink-0 items-center justify-center overflow-hidden bg-white pointer-events-none" draggable={false}>
                    <SaveButton item={{ id: product.id, name: product.name, price: product.price, image: product.image, subtitle: product.subtitle }} />
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className={`object-contain p-4 md:p-8 transition-all duration-500 mix-blend-multiply  ${hoveredProduct === product.id && product.hoverImage ? "opacity-0" : "opacity-100"}`}
                      sizes="33vw"
                    />
                    {product.hoverImage && (
                      <ProductImage
                        src={product.hoverImage}
                        alt={product.name}
                        fill
                        className={`object-cover object-center p-0 transition-all duration-500  ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}
                        sizes="33vw"
                      />
                    )}
                  </div>
                  <div className="text-center pointer-events-none mt-4 flex flex-col flex-1 justify-between" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                    <div>
                      <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: '"Inter", "Inter Fallback"' }}>{product.name}</h3>
                      {product.subtitle && <p className="mt-3 text-[16px] leading-[24px] font-[400] text-[#666666]" style={{ fontFamily: '"Tenor Sans", sans-serif', overflowWrap: "break-word", wordBreak: "break-word" }}>{product.subtitle}</p>}
                      {product.description && <p className="mx-auto mt-3 text-[16px] leading-[24px] font-[300] text-[#666666] line-clamp-2" style={{ fontFamily: "Inter, sans-serif", overflowWrap: "break-word", wordBreak: "break-word" }}>{product.description}</p>}
                    </div>
                    <p className="mt-3 text-[#333333] text-[16px] leading-[22px] font-[400]" style={{ fontFamily: "Inter, sans-serif" }}>{formatPrice(product.price, currency, exchangeRate)}</p>
                  </div>
                </div>
                <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { if (wasDragged.current) { wasDragged.current = false; return; } const s = useCartStore.getState(); s.addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, subtitle: product.subtitle, format: product.format }); s.openCart(); }} className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center bg-[#333333] text-[#FFFEF2] text-[12px] font-[400] hover:bg-black transition-all duration-300 mx-[0.3rem]" suppressHydrationWarning>Add To Cart</button>
              </div>
            </div>
          ))}
        </div>
        </div>
        {totalDots > 1 && (
          <div className="hidden md:flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: totalDots }).map((_, i) => (
              <button
                key={i}
                onClick={() => { if (!scrollRef.current) return; scrollToIndex(i); window.setTimeout(updateScrollState, 350); }}
                className={`swiper-pagination-bullet h-0.5 rounded-none transition-all duration-300 cursor-pointer ${i === activeIndex ? "swiper-pagination-bullet-active w-8 bg-[#333]" : "w-4 bg-[#eae8e0]"}`}
              />
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 gap-10 md:hidden">
          {sectionProducts.map((product) => (
            <div key={product.id} className="group flex min-w-0 flex-col justify-between">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative flex mx-auto w-full aspect-square shrink-0 items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                  <SaveButton item={{ id: product.id, name: product.name, price: product.price, image: product.image, subtitle: product.subtitle }} />
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    fill
                      className={`object-contain p-4 md:p-8 transition-all duration-500 mix-blend-multiply  ${hoveredProduct === product.id && product.hoverImage ? "opacity-0" : "opacity-100"}`}
                      sizes="100vw"
                    />
                    {product.hoverImage && (
                      <ProductImage
                        src={product.hoverImage}
                        alt={product.name}
                        fill
                        className={`object-contain p-0 transition-all duration-500 mix-blend-multiply  ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}
                      sizes="100vw"
                    />
                  )}
                </div>
                  <div className="text-center mt-2" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                  <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: '"Inter", "Inter Fallback"' }}>{product.name}</h3>
                  {product.subtitle && <p className="mt-3 text-[16px] leading-[24px] font-[400] text-[#2C2A26]" style={{ fontFamily: '"Inter", "Inter Fallback"', overflowWrap: "break-word", wordBreak: "break-word" }}>{product.subtitle}</p>}
                  {product.description && <p className="mx-auto mt-3 text-[16px] leading-[24px] font-[400] text-[#2C2A26] line-clamp-2" style={{ fontFamily: '"Inter", "Inter Fallback"', overflowWrap: "break-word", wordBreak: "break-word" }}>{product.description}</p>}
                  <p className="mt-3 text-[#333333] text-[16px] leading-[22px] font-[400]" style={{ fontFamily: '"Inter", "Inter Fallback"' }}>{formatPrice(product.price, currency, exchangeRate)}</p>
                </div>
              </Link>
              <button onClick={() => { useCartStore.getState().addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, subtitle: product.subtitle, format: product.format }); useCartStore.getState().openCart(); }} className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center bg-[#333333] text-[#FFFEF2] text-[12px] font-[400] hover:bg-black transition-all duration-300" suppressHydrationWarning>Add To Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MateriaBotanicaSection() {
  const [products, setProducts] = useState<RitualProduct[]>(fallbackProducts);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);

  useEffect(() => {
    (async () => {
      const [pRes, settings] = await Promise.all([api.get<ApiProduct[]>("/products"), getSettings().catch(() => ({ currency: "INR", exchange_rate: "85" }))]);
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      const assignments = getSectionAssignments();
      if (pRes.status && pRes.data?.length) {
        const hasField = (obj: any, key: string) => obj !== null && obj !== undefined && key in obj;
        const fbMap = new Map(fallbackProducts.map(f => [f.id, f]));
        const merged = pRes.data.map((p: ApiProduct) => {
          const fb = fbMap.get(p.slug);
          const imageFallback = productImageFallbacks.get(p.slug);
          const secs = p.sections && p.sections.length ? p.sections : (assignments[String(p.id)] ? [assignments[String(p.id)]] : assignments[p.slug] ? [assignments[p.slug]] : []);
          return {
            id: p.slug,
            productId: p.id,
            name: p.name ?? fb?.name ?? "",
            subtitle: p.subtitle ?? fb?.subtitle ?? "",
            category: p.category?.name ?? fb?.category ?? "",
            benefits: p.benefits ?? fb?.benefits ?? "",
            format: p.format ?? fb?.format ?? "",
            price: hasField(p, "price") ? parseFloat(String(p.price)) || 0 : (fb?.price ?? 0),
            description: p.description ?? fb?.description ?? "",
            image: imageFallback?.image || normalizeImagePath(p.image) || fb?.image || "",
            hoverImage: imageFallback?.hoverImage || normalizeImagePath(p.hoverImage) || fb?.hoverImage || "",
            sections: secs,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt || p.createdAt,
          };
        }).filter((product) => (product.sections || []).includes('home') && !["shakti-peya", "chandra-rasa", "parjanya", "jawa", "kha"].includes(product.id));
        merged.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        setProducts(merged);
      }
    })();
  }, []);

  return (
    <section className="bg-[#FDFAF5] px-6 md:px-12 lg:px-20" style={{ marginBottom: "120px" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center" style={{ marginBottom: "60px" }}>
          <h2 className="text-[#333333] text-[28px] leading-[34px] md:text-[32px] md:leading-[42px] font-[400] tracking-[0.08em]" style={{ fontFamily: '"Tenor Sans", "Tenor Sans Fallback", "Tenor Sans", system-ui, sans-serif' }}>Materia Botanica</h2>
          <p className="mx-auto mt-5 max-w-5xl text-[16px] leading-[29px] font-[400] text-[#2C2A26]" style={{ fontFamily: '"Inter", "Inter Fallback"' }}>A collection of high-functioning botanical infusions, each chosen for its unique therapeutic profile and ancestral significance.</p>
        </div>

        <ProductSection
          label=""
          sectionProducts={products}
          currency={currency}
          exchangeRate={exchangeRate}
        />
      </div>
    </section>
  );
}
