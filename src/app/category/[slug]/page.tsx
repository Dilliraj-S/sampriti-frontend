"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import ProductImage from "@/app/components/landing/ProductImage";
import { useCartStore } from "@/app/components/landing/cartStore";
import SaveButton from "@/app/components/landing/SaveButton";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import { normalizeImagePath } from "@/app/utils/normalizeImagePath";
import { getSectionAssignments } from "@/app/components/landing/sectionStorage";

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  subtitle?: string;
  price?: string | number;
  image?: string;
  hoverImage?: string;
  homepageSection?: string | null;
  category?: { name?: string; slug?: string };
  description?: string;
  createdAt?: string;
};

type DisplayProduct = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  hoverImage: string;
  description?: string;
  createdAt?: string;
};

const categoryTitles: Record<string, string> = {
  infusions: "Infusions",
  skincare: "Skincare",
  fragrance: "Fragrance",
  ceremony: "Ceremony",
  atmospheric: "Atmospheric",
};

const categoryProductMap: Record<string, string[]> = {
  infusions: ["shakti-peya", "chandra-rasa", "shotharaha", "rose", "hibiscus", "blue-butterfly-pea"],
  skincare: ["vatari", "kanti", "blue-ojas"],
  fragrance: ["parjanya", "jawa", "kha"],
  ceremony: ["the-sahane", "rakta-chandanam", "shveta-chandanam"],
  atmospheric: ["sandalwood-shavings", "deodar-discs", "black-sambrani"],
};

const categorySectionMap: Record<string, string> = {
  infusions: "infusions",
  skincare: "skincare",
  fragrance: "fragrance",
  ceremony: "ceremony",
  atmospheric: "atmosphere",
};

const carouselOnlyCategories = new Set(["skincare", "fragrance", "ceremony", "atmospheric"]);
const fullGridCategories = new Set(["infusions"]);

const heroCategoryImages: Record<string, string> = {
  // infusions: "/assets/art of infusion.webp",
  infusions: "/assets/Infusions 1.webp",
  skincare: "/assets/Skincare (1).webp",
  fragrance: "/assets/Fragrance (1).webp",
  ceremony: "/assets/Ceremony.webp",
  atmospheric: "/assets/Atmospheric 1.webp",
};

const heroMobileImages: Record<string, string> = {
  // infusions: "/assets/Minfusion2.webp",
  // skincare: "/assets/Mskincare.webp",
  // fragrance: "/assets/MFragrance.webp",
  // ceremony: "/assets/MCaremony.webp",
  // atmospheric: "/assets/Matmospheric.webp",
  infusions: "/assets/Infusions 1.webp",
  skincare: "/assets/Skincare (1).webp",
  fragrance: "/assets/Fragrance (1).webp",
  ceremony: "/assets/Ceremony.webp",
  atmospheric: "/assets/Atmospheric 1.webp",
};

const heroSubtitles: Record<string, string> = {
  infusions: "High-functioning botanical infusions for vitality and balance",
  skincare: "Botanical formulations for radiant skin and holistic care",
  fragrance: "Natural fragrances crafted from ancestral botanicals",
  ceremony: "Sacred tools for ritual and meditative practice",
  atmospheric: "Botanical elements to transform your living space",
};

const fallbackProducts: Record<string, { name: string; subtitle: string; price: number; image: string; hoverImage: string; description?: string }> = {
  "shakti-peya": { name: "Shakti Peya", subtitle: "Energy Elixir", price: 54, image: "/assets/shakti peya product hd.webp", hoverImage: "/assets/shakti peya hover.webp", description: "Shakti Peya is designed to support sustained vitality, circulation, digestion, and metabolic balance." },
  "chandra-rasa": { name: "Chandra Rasa", subtitle: "Sleep Potion", price: 54, image: "/assets/Chandra rasa product hd.webp", hoverImage: "/assets/chandra rasa hover.webp", description: "A lunar-calming adaptogenic brew formulation for restful sleep and nervous system balance." },
  "shotharaha": { name: "Shotharaha", subtitle: "Dual Black Recovery", price: 54, image: "/assets/shakti peya product hd.webp", hoverImage: "/assets/shakti peya hover.webp", description: "A potent adaptogenic brew rooted in the ancient Siddha tradition." },
  "rose": { name: "Rose", subtitle: "Rosa Damascena", price: 42, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", description: "A sacred petal infusion crafted from heirloom roses for the heart and senses." },
  "hibiscus": { name: "Hibiscus", subtitle: "Rosa-Sinensis", price: 42, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", description: "A vibrant floral infusion for radiant skin and hair, rich in antioxidants." },
  "blue-butterfly-pea": { name: "Blue Butterfly Pea", subtitle: "Clitoria Ternatea", price: 42, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", description: "A rare Kaya Kalpa agent for profound recovery and cellular longevity." },
  "vatari": { name: "Vatari", subtitle: "Botanical Botox", price: 48, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp" },
  "kanti": { name: "kanti", subtitle: "Red Radiance", price: 48, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp" },
  "blue-ojas": { name: "Blue Ojas", subtitle: "Vitality Concentrate", price: 48, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp" },
  "the-sahane": { name: "The Sahane", subtitle: "Stone", price: 36, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp" },
  "rakta-chandanam": { name: "Rakta Chandanam", subtitle: "Red Sandalwood", price: 42, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp" },
  "shveta-chandanam": { name: "Shveta Chandanam", subtitle: "White Sandalwood", price: 42, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp" },
  "parjanya": { name: "Parjanya", subtitle: "The First Rain", price: 54, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp" },
  "jawa": { name: "Jawa", subtitle: "Embers", price: 54, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp" },
  "kha": { name: "Kha", subtitle: "The Zero Point", price: 54, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp" },
  "sandalwood-shavings": { name: "Sandalwood Shavings", subtitle: "", price: 28, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp" },
  "deodar-discs": { name: "Deodar Discs", subtitle: "", price: 28, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp" },
  "black-sambrani": { name: "Black Sambrani", subtitle: "", price: 28, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp" },
};

const fadeInSlow = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 1.0 } } };

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const heroRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const heroBg = heroCategoryImages[slug];
  const mobileHeroBg = heroMobileImages[slug];
  const { scrollYProgress } = useScroll({ target: heroBg ? heroRef : undefined, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [botanicalSlide, setBotanicalSlide] = useState(0);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [sectionAssignments] = useState<Record<string, string>>(() => getSectionAssignments());
  const [suggestionSlugs, setSuggestionSlugs] = useState<string[]>([]);

  useEffect(() => {
    const pickRandom = () => {
      const otherCategories = Object.keys(categoryProductMap).filter((c) => c !== slug);
      const shuffled = [...otherCategories].sort(() => Math.random() - 0.5).slice(0, 3);
      const slugs = shuffled.map((cat) => {
        const products = categoryProductMap[cat];
        return products[Math.floor(Math.random() * products.length)];
      });
      setSuggestionSlugs(slugs);
    };
    pickRandom();
    const interval = setInterval(pickRandom, 8000);
    return () => clearInterval(interval);
  }, [slug]);

  useEffect(() => {
    (async () => {
      const [settings, productRes] = await Promise.all([
        getSettings().catch(() => null),
        api.get<ApiProduct[]>("/products").catch(() => ({ status: false, data: [] })),
      ]);
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      if (productRes.status) setApiProducts(productRes.data || []);
    })();
  }, []);

  const productSlugs = categoryProductMap[slug] || [];
  const selectedSection = categorySectionMap[slug] || slug;
  const title = categoryTitles[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  const fallbackSlugSet = new Set(productSlugs);
  const fallbackDisplayProducts: DisplayProduct[] = productSlugs
    .map((productSlug) => {
      const fb = fallbackProducts[productSlug];
      if (!fb) return null;
      const api = apiProducts.find((p) => p.slug === productSlug);
      return {
        slug: productSlug,
        name: api?.name ?? fb.name,
        subtitle: api?.subtitle ?? fb.subtitle ?? "",
        price: api && "price" in api ? parseFloat(String(api.price)) || 0 : (fb.price ?? 0),
        image: normalizeImagePath(api?.image || "") || fb.image || "",
        hoverImage: normalizeImagePath(api?.hoverImage || "") || fb.hoverImage || "",
        description: api?.description ?? fb.description ?? "",
      };
    })
    .filter(Boolean) as DisplayProduct[];
  const selectedSectionProducts: DisplayProduct[] = apiProducts
    .filter((product) => {
      const assignedSection = product.homepageSection || sectionAssignments[String(product.id)] || sectionAssignments[product.slug] || "";
      return assignedSection === selectedSection && !fallbackSlugSet.has(product.slug);
    })
    .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
    .map((product) => ({
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle || "",
      price: parseFloat(String(product.price || 0)) || 0,
      image: normalizeImagePath(product.image) || "",
      hoverImage: normalizeImagePath(product.hoverImage) || "",
      createdAt: product.createdAt,
    }));
  const displayProducts = [...fallbackDisplayProducts, ...selectedSectionProducts];

  const total = displayProducts.length;
  const isCarouselOnlyCategory = carouselOnlyCategories.has(slug);
  const showFullGrid = fullGridCategories.has(slug);
  const isThreeProductCategory = total === 3;

  const featuredProducts = isThreeProductCategory || isCarouselOnlyCategory ? [] : displayProducts.slice(0, 2);
  const botanicalProducts = isThreeProductCategory || isCarouselOnlyCategory ? displayProducts : displayProducts.slice(2);
  const visibleProductCount = 3;
  const desktopGridClass = "md:grid-cols-3";
  const maxBotanicalSlide = Math.max(0, botanicalProducts.length - visibleProductCount);
  const visibleBotanicalProducts = botanicalProducts.slice(botanicalSlide, botanicalSlide + visibleProductCount);
  const canScrollBack = botanicalSlide > 0;
  const canScrollForward = botanicalSlide < maxBotanicalSlide;

  const handleAddToCart = (p: DisplayProduct, slugKey: string) => {
    addItem({ id: slugKey, name: p.name, subtitle: p.subtitle, price: p.price, quantity: 1, image: p.image });
    openCart();
  };

  const scrollBotanicals = (direction: "back" | "forward") => {
    setBotanicalSlide((current) => {
      if (direction === "forward") return Math.min(maxBotanicalSlide, current + 1);
      return Math.max(0, current - 1);
    });
  };

  const renderProductCard = (p: DisplayProduct, slugKey: string, isFeatured: boolean, btnPadding?: string) => (
    <div key={slugKey} className="group flex flex-col h-full w-full">
      <Link href={`/product/${slugKey}`} className="flex flex-col flex-1 cursor-pointer" onMouseEnter={() => setHoveredProduct(slugKey)} onMouseLeave={() => setHoveredProduct(null)}>
        <div className="relative flex mx-auto w-full aspect-square shrink-0 items-center justify-center overflow-hidden bg-white pointer-events-none" draggable={false}>
          <SaveButton item={{ id: slugKey, name: p.name, price: p.price, image: p.image, subtitle: p.subtitle }} />
          <ProductImage
            src={p.image}
            alt={p.name}
            fill
            className={`object-contain p-4 md:p-8 transition-all duration-500 mix-blend-multiply ${hoveredProduct === slugKey && p.hoverImage ? "opacity-0" : "opacity-100"}`}
            sizes="33vw"
          />
          {p.hoverImage && (
            <ProductImage
              src={p.hoverImage}
              alt={p.name}
              fill
              className={`object-cover object-center p-0 transition-all duration-500 ${hoveredProduct === slugKey ? "opacity-100" : "opacity-0"}`}
              sizes="33vw"
            />
          )}
        </div>
        <div className="text-center pointer-events-none mt-4 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: "Inter, sans-serif" }}>{p.name}</h3>
            {p.subtitle && <p className="mt-3 text-sm leading-[20px] font-[400] text-[#666666]" style={{ fontFamily: '"Tenor Sans", sans-serif' }}>{p.subtitle}</p>}
            {p.description && <p className="mx-auto mt-3 text-sm leading-[22px] font-[300] text-[#666666]" style={{ fontFamily: "Inter, sans-serif" }}>{p.description}</p>}
          </div>
          <p className="mt-3 text-[#333333] text-[16px] leading-[22px] font-[400]" style={{ fontFamily: "Inter, sans-serif" }}>{formatPrice(p.price, currency, exchangeRate)}</p>
        </div>
      </Link>
      <button onClick={() => handleAddToCart(p, slugKey)} className="mt-6 w-full bg-[#2C2A26] text-white px-6 py-4 text-xs tracking-[0.2em] hover:bg-black transition-all duration-300 cursor-pointer" suppressHydrationWarning>Add To Cart</button>
    </div>
  );

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />
      {heroBg && (
        <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden bg-black">
          <motion.div className="absolute inset-0 w-full h-full" style={{ y: bgY, scale: bgScale }}>
            <Image src={heroBg} alt={title} fill priority className="hidden md:block object-cover object-center" sizes="100vw" />
            <Image src={mobileHeroBg} alt={title} fill priority className="block md:hidden object-cover object-center" sizes="100vw" />
          </motion.div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.24) 42%, rgba(0,0,0,0.78) 100%)" }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.42)_100%)]" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-48 px-6 text-center">
            <div className="max-w-3xl">
              <h1 className="mb-4 text-xl font-light leading-tight md:text-2xl lg:text-3xl" style={{ fontFamily: "var(--font-serif)", color: "#FDFAF5" }}>{title}</h1>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed md:text-lg" style={{ fontWeight: 300, color: "rgba(255,255,255,0.82)" }}>{heroSubtitles[slug]}</p>
            </div>
          </div>
        </section>
      )}
      <section ref={productsRef} className="scroll-mt-20 px-6 md:px-16 lg:px-24" style={{ paddingTop: "120px", paddingBottom: "120px" }}>
        <div className="max-w-6xl mx-auto">
          {!heroBg && <h1 className="text-[#2C2A26] text-3xl md:text-5xl font-light text-center mb-16 md:mb-20" style={{ fontFamily: "var(--font-serif)" }}>{title}</h1>}

          {displayProducts.length === 0 && <p className="text-center text-[#8A847C]">Products coming soon.</p>}

          {/* 3-product categories: all in one row */}
          {isThreeProductCategory && !isCarouselOnlyCategory && (
            <div className="grid grid-cols-1 gap-10 md:relative md:left-1/2 md:w-screen md:-translate-x-1/2 md:grid-cols-3 md:gap-x-4 md:gap-y-16 md:px-16 lg:px-24">
              {displayProducts.map((p) => renderProductCard(p, p.slug, false))}
            </div>
          )}

          {/* Full grid categories (infusions): all products in 3-column rows */}
          {showFullGrid && (
            <div className="grid grid-cols-1 gap-10 md:relative md:left-1/2 md:w-screen md:-translate-x-1/2 md:grid-cols-3 md:gap-x-4 md:gap-y-16 md:px-16 lg:px-24">
              {displayProducts.map((p) => renderProductCard(p, p.slug, false))}
            </div>
          )}

          {/* Categories with >3 products: first 2 featured, rest in carousel */}
          {!isThreeProductCategory && !showFullGrid && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-20">
                {featuredProducts.map((p) => {
                const slugKey = p.slug;
                return (
                    <motion.div key={slugKey} variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="group flex flex-col h-full w-full">
                    <Link href={`/product/${slugKey}`} className="flex flex-col flex-1 cursor-pointer" onMouseEnter={() => setHoveredProduct(slugKey)} onMouseLeave={() => setHoveredProduct(null)}>
                      <div className="relative flex mx-auto w-full aspect-square shrink-0 items-center justify-center overflow-hidden bg-white pointer-events-none" draggable={false}>
                        <ProductImage
                          src={p.image}
                          alt={p.name}
                          fill
                          className={`object-contain p-4 md:p-8 transition-all duration-500 mix-blend-multiply ${hoveredProduct === slugKey && p.hoverImage ? "opacity-0" : "opacity-100"}`}
                          sizes="33vw"
                        />
                        {p.hoverImage && (
                          <ProductImage
                            src={p.hoverImage}
                            alt={p.name}
                            fill
                            className={`object-cover object-center p-0 transition-all duration-500 ${hoveredProduct === slugKey ? "opacity-100" : "opacity-0"}`}
                            sizes="33vw"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="text-center pointer-events-none mt-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: "Inter, sans-serif" }}>{p.name} | {p.subtitle}</h3>
                        {p.description && <p className="mx-auto mt-3 text-sm leading-[22px] font-[300] text-[#666666]" style={{ fontFamily: "Inter, sans-serif" }}>{p.description}</p>}
                      </div>
                      <p className="mt-3 text-[#333333] text-[16px] leading-[22px] font-[400]" style={{ fontFamily: "Inter, sans-serif" }}>{formatPrice(p.price, currency, exchangeRate)}</p>
                    </div>
      <button onClick={() => handleAddToCart(p, slugKey)} className="mt-6 w-full bg-[#2C2A26] text-white px-6 py-4 text-xs tracking-[0.2em] hover:bg-black transition-all duration-300 cursor-pointer" suppressHydrationWarning>Add To Cart</button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Botanical products — remaining items in 3-at-a-time carousel */}
          {(!isThreeProductCategory || isCarouselOnlyCategory) && !showFullGrid && botanicalProducts.length > 0 && (
            <div>
              {/* Mobile: single column */}
              <div className="grid grid-cols-1 gap-10 md:hidden">
                {botanicalProducts.map((p) => {
                  const slugKey = p.slug;
                  return (
                    <motion.div key={slugKey} variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="group flex flex-col h-full w-full">
                    <Link href={`/product/${slugKey}`} className="flex flex-col flex-1 cursor-pointer" onMouseEnter={() => setHoveredProduct(slugKey)} onMouseLeave={() => setHoveredProduct(null)}>
                        <div className="relative flex mx-auto w-full aspect-square shrink-0 items-center justify-center overflow-hidden bg-white pointer-events-none" draggable={false}>
                          <SaveButton item={{ id: slugKey, name: p.name, price: p.price, image: p.image, subtitle: p.subtitle }} />
                          <ProductImage
                            src={p.image}
                            alt={p.name}
                            fill
                            className={`object-contain p-4 md:p-8 transition-all duration-500 mix-blend-multiply ${hoveredProduct === slugKey && p.hoverImage ? "opacity-0" : "opacity-100"}`}
                            sizes="100vw"
                          />
                          {p.hoverImage && (
                            <ProductImage
                              src={p.hoverImage}
                              alt={p.name}
                              fill
                              className={`object-cover object-center p-0 transition-all duration-500 ${hoveredProduct === slugKey ? "opacity-100" : "opacity-0"}`}
                              sizes="100vw"
                            />
                          )}
                        </div>
                        <div className="text-center pointer-events-none mt-4 flex flex-col flex-1 justify-between">
                          <div>
                            <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: "Inter, sans-serif" }}>{p.name}</h3>
                            {p.subtitle && <p className="mt-3 text-sm leading-[20px] font-[400] text-[#666666]" style={{ fontFamily: '"Tenor Sans", sans-serif' }}>{p.subtitle}</p>}
                            {p.description && <p className="mx-auto mt-3 text-sm leading-[22px] font-[300] text-[#666666]" style={{ fontFamily: "Inter, sans-serif" }}>{p.description}</p>}
                          </div>
                          <p className="mt-3 text-[#333333] text-[16px] leading-[22px] font-[400]" style={{ fontFamily: "Inter, sans-serif" }}>{formatPrice(p.price, currency, exchangeRate)}</p>
                        </div>
                      </Link>
      <button onClick={() => handleAddToCart(p, slugKey)} className="mt-6 w-full bg-[#2C2A26] text-white px-6 py-4 text-xs tracking-[0.2em] hover:bg-black transition-all duration-300 cursor-pointer" suppressHydrationWarning>Add To Cart</button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Desktop: carousel with arrows */}
              {botanicalProducts.length > visibleProductCount && (
                <div className="relative left-1/2 hidden w-screen -translate-x-1/2 pb-4 md:block">
                  {canScrollBack && (
                    <button type="button" onClick={() => scrollBotanicals("back")} className="absolute left-3 md:left-9 lg:left-16 top-[50%] z-10 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white text-[#2C2A26] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-gray-50 flex">
                      <ChevronLeft size={26} strokeWidth={1.8} />
                    </button>
                  )}
                  {canScrollForward && (
                    <button type="button" onClick={() => scrollBotanicals("forward")} className="absolute right-3 md:right-9 lg:right-16 top-[50%] z-10 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white text-[#2C2A26] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-gray-50 flex">
                      <ChevronRight size={26} strokeWidth={1.8} />
                    </button>
                  )}
                  <motion.div key={botanicalSlide} initial={{ opacity: 0.85, x: canScrollBack ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className={`hidden md:grid ${desktopGridClass} gap-4 px-6 md:px-16 lg:px-24`}>
                    {visibleBotanicalProducts.map((p) => {
                      const slugKey = p.slug;
                      return renderProductCard(p, slugKey, false);
                    })}
                  </motion.div>
                </div>
              )}

              {/* Desktop: single row when no carousel is needed */}
              {botanicalProducts.length > 0 && botanicalProducts.length <= visibleProductCount && (
                <div className={`relative left-1/2 hidden w-screen -translate-x-1/2 md:grid ${desktopGridClass} gap-4 px-6 md:px-16 lg:px-24`}>
                  {botanicalProducts.map((p) => {
                    const slugKey = p.slug;
                    return renderProductCard(p, slugKey, false);
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#D4CFC5] mx-auto max-w-6xl" style={{ marginTop: "120px", marginBottom: "80px" }} />

        {suggestionSlugs.length > 0 && (
          <div className="bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 md:mb-20">
                <h2 className="text-[#333333] text-[24px] leading-[31px] font-[400] tracking-[0.08em] whitespace-nowrap" style={{ fontFamily: '"Tenor Sans", sans-serif' }}>
                  You may also like
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-10 w-full md:relative md:left-1/2 md:w-screen md:-translate-x-1/2 md:grid-cols-3 md:gap-x-4 md:gap-y-16 md:px-16 lg:px-24">
                {suggestionSlugs.map((slugKey) => {
                  const fb = fallbackProducts[slugKey];
                  if (!fb) return null;
                  const api = apiProducts.find((p) => p.slug === slugKey);
                  const p: DisplayProduct = {
                    slug: slugKey,
                    name: api?.name ?? fb.name,
                    subtitle: api?.subtitle ?? fb.subtitle ?? "",
                    price: api && "price" in api ? parseFloat(String(api.price)) || 0 : (fb.price ?? 0),
                    image: normalizeImagePath(api?.image || "") || fb.image || "",
                    hoverImage: normalizeImagePath(api?.hoverImage || "") || fb.hoverImage || "",
                    description: api?.description ?? fb.description ?? "",
                  };
                  return renderProductCard(p, slugKey, false);
                })}
              </div>
            </div>
          </div>
        )}

      </section>
      <Footer />
    </main>
  );
}