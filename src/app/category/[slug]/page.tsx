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

const heroCategoryImages: Record<string, string> = {
  infusions: "/Assets/art of infusion.webp",
  skincare: "/assests/images/skincare.webp",
  fragrance: "/assests/images/fragrance.webp",
  ceremony: "/assests/images/Caremony.webp",
  atmospheric: "/assests/images/atmospheric.webp",
};

const heroMobileImages: Record<string, string> = {
  infusions: "/assests/images/Minfusion.webp",
  skincare: "/assests/images/Mskincare.webp",
  fragrance: "/assests/images/MFragrance.webp",
  ceremony: "/assests/images/MCaremony.webp",
  atmospheric: "/assests/images/Matmospheric.webp",
};

const heroSubtitles: Record<string, string> = {
  infusions: "High-functioning botanical infusions for vitality and balance",
  skincare: "Botanical formulations for radiant skin and holistic care",
  fragrance: "Natural fragrances crafted from ancestral botanicals",
  ceremony: "Sacred tools for ritual and meditative practice",
  atmospheric: "Botanical elements to transform your living space",
};

const fallbackProducts: Record<string, { name: string; subtitle: string; price: number; image: string; hoverImage: string; description?: string }> = {
  "shakti-peya": { name: "Shakti Peya", subtitle: "Energy Elixir", price: 54, image: "/Assets/shakti peya product hd.png", hoverImage: "/Assets/shakti peya hover.png", description: "Shakti Peya is designed to support sustained vitality, circulation, digestion, and metabolic balance." },
  "chandra-rasa": { name: "Chandra Rasa", subtitle: "Sleep Potion", price: 54, image: "/Assets/Chandra rasa product hd.webp", hoverImage: "/Assets/chandra rasa hover.webp", description: "A lunar-calming adaptogenic brew formulation for restful sleep and nervous system balance." },
  "shotharaha": { name: "Shotharaha", subtitle: "Dual Black Recovery", price: 54, image: "/Assets/shakti peya product hd.png", hoverImage: "/Assets/shakti peya hover.png", description: "A potent adaptogenic brew rooted in the ancient Siddha tradition." },
  "rose": { name: "Rose", subtitle: "Rosa Damascena", price: 42, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", description: "A sacred petal infusion crafted from heirloom roses for the heart and senses." },
  "hibiscus": { name: "Hibiscus", subtitle: "Rosa-Sinensis", price: 42, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png", description: "A vibrant floral infusion for radiant skin and hair, rich in antioxidants." },
  "blue-butterfly-pea": { name: "Blue Butterfly Pea", subtitle: "Clitoria Ternatea", price: 42, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", description: "A rare Kaya Kalpa agent for profound recovery and cellular longevity." },
  "vatari": { name: "Vatari", subtitle: "Botanical Botox", price: 48, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png" },
  "kanti": { name: "kanti", subtitle: "Red Radiance", price: 48, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp" },
  "blue-ojas": { name: "Blue Ojas", subtitle: "Vitality Concentrate", price: 48, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp" },
  "the-sahane": { name: "The Sahane", subtitle: "Stone", price: 36, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png" },
  "rakta-chandanam": { name: "Rakta Chandanam", subtitle: "Red Sandalwood", price: 42, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp" },
  "shveta-chandanam": { name: "Shveta Chandanam", subtitle: "White Sandalwood", price: 42, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp" },
  "parjanya": { name: "Parjanya", subtitle: "The First Rain", price: 54, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png" },
  "jawa": { name: "Jawa", subtitle: "Embers", price: 54, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp" },
  "kha": { name: "Kha", subtitle: "The Zero Point", price: 54, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp" },
  "sandalwood-shavings": { name: "Sandalwood Shavings", subtitle: "", price: 28, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png" },
  "deodar-discs": { name: "Deodar Discs", subtitle: "", price: 28, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp" },
  "black-sambrani": { name: "Black Sambrani", subtitle: "", price: 28, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp" },
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
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
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
        name: api?.name || fb.name,
        subtitle: api?.subtitle || fb.subtitle || "",
        price: parseFloat(String(api?.price || 0)) || fb.price || 0,
        image: normalizeImagePath(api?.image || "") || fb.image || "",
        hoverImage: normalizeImagePath(api?.hoverImage || "") || fb.hoverImage || "",
        description: api?.description || fb.description || "",
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
    addItem({ id: slugKey, name: p.name, price: p.price, quantity: 1, image: p.image });
    openCart();
  };

  const scrollBotanicals = (direction: "back" | "forward") => {
    setBotanicalSlide((current) => {
      if (direction === "forward") return Math.min(maxBotanicalSlide, current + 1);
      return Math.max(0, current - 1);
    });
  };

  const renderProductCard = (p: DisplayProduct, slugKey: string, isFeatured: boolean) => (
    <div key={slugKey} className="group flex flex-col justify-between">
      <Link href={`/product/${slugKey}`} className="block">
        <div className={`relative mb-3 flex ${isFeatured ? 'aspect-[1.9/1]' : 'h-[310px]'} items-center justify-center overflow-hidden bg-white`} onMouseEnter={() => setHoveredProduct(slugKey)} onMouseLeave={() => setHoveredProduct(null)}>
          <ProductImage
            src={p.image}
            alt={p.name}
            fill
            className={`object-contain p-0 transition-all duration-500 mix-blend-multiply group-hover:scale-[1.03] ${hoveredProduct === slugKey && p.hoverImage ? "opacity-0" : "opacity-100"}`}
            sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "33vw"}
          />
          {p.hoverImage && (
            <ProductImage
              src={p.hoverImage}
              alt={p.name}
              fill
              className={`object-contain p-0 transition-all duration-500 mix-blend-multiply group-hover:scale-[1.03] ${hoveredProduct === slugKey ? "opacity-100" : "opacity-0"}`}
              sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "33vw"}
            />
          )}
        </div>
        <div className="text-center">
          <h3 className="text-[#2C2A26] text-xl font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)" }}>{p.name}</h3>
          {p.subtitle && <p className="mt-1 text-base italic tracking-[0.08em] text-[#6F6A64]">{p.subtitle}</p>}
          {'description' in p && p.description && <p className="mx-auto mt-3 text-base leading-relaxed text-[#8A847C]">{(p as any).description}</p>}
          <p className="mt-4 text-[#2C2A26] text-2xl font-light">{formatPrice(p.price, currency, exchangeRate)}</p>
        </div>
      </Link>
      <button onClick={() => handleAddToCart(p, slugKey)} className="mt-2 flex h-12 px-8 items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-colors duration-300 cursor-pointer">Add To Cart</button>
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
          <div className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-20 text-center">
            <div className="max-w-3xl">
              <p className="mb-5 text-xs uppercase tracking-[0.42em]" style={{ color: "#C9A76A" }}>{title}</p>
              <h1 className="mb-5 text-4xl font-light leading-tight md:text-6xl lg:text-7xl" style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}>{title}</h1>
              <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed md:text-lg" style={{ fontWeight: 300, color: "rgba(255,255,255,0.82)" }}>{heroSubtitles[slug]}</p>
              <div>
                <button type="button" onClick={scrollToProducts} className="inline-flex min-h-16 max-sm:min-h-12 items-center justify-center border-2 border-white px-7 max-sm:px-5 text-sm max-sm:text-xs font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black cursor-pointer">Explore The Collection</button>
              </div>
            </div>
          </div>
        </section>
      )}
      <section ref={productsRef} className="scroll-mt-20 px-6 pt-32 pb-20 md:pt-44 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {!heroBg && <h1 className="text-[#2C2A26] text-3xl md:text-5xl font-light text-center mb-16 md:mb-20" style={{ fontFamily: "var(--font-serif)" }}>{title}</h1>}

          {displayProducts.length === 0 && <p className="text-center text-[#8A847C]">Products coming soon.</p>}

          {/* 3-product categories: all in one row */}
          {isThreeProductCategory && !isCarouselOnlyCategory && (
            <div className="grid grid-cols-1 gap-10 md:relative md:left-1/2 md:w-screen md:-translate-x-1/2 md:grid-cols-3 md:gap-16 px-6 md:px-12 lg:px-20">
              {displayProducts.map((p) => renderProductCard(p, p.slug, false))}
            </div>
          )}

          {/* Categories with >3 products: first 2 featured, rest in carousel */}
          {!isThreeProductCategory && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-20">
              {featuredProducts.map((p) => {
                const slugKey = p.slug;
                return (
                    <motion.div key={slugKey} variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="group">
                    <Link href={`/product/${slugKey}`} className="block">
                      <div className="relative mb-4 flex aspect-[1.9/1] items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(slugKey)} onMouseLeave={() => setHoveredProduct(null)}>
                        <ProductImage
                          src={p.image}
                          alt={p.name}
                          fill
                          className={`object-contain transition-all duration-500 mix-blend-multiply group-hover:scale-[1.03] ${hoveredProduct === slugKey && p.hoverImage ? "opacity-0" : "opacity-100"}`}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        {p.hoverImage && (
                          <ProductImage
                            src={p.hoverImage}
                            alt={p.name}
                            fill
                            className={`object-contain transition-all duration-500 mix-blend-multiply group-hover:scale-[1.03] ${hoveredProduct === slugKey ? "opacity-100" : "opacity-0"}`}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="text-center">
                      <h3 className="mb-1 text-[#2C2A26] text-[20px] font-normal tracking-[0.16em]" style={{ fontFamily: "var(--font-sans)" }}>{p.name} | {p.subtitle}</h3>
                      {p.description && <p className="mx-auto mt-3 text-[15px] leading-relaxed text-[#8A847C]">{p.description}</p>}
                      <p className="mt-4 text-[#2C2A26] text-xl font-light">{formatPrice(p.price, currency, exchangeRate)}</p>
                    </div>
                    <button onClick={() => handleAddToCart(p, slugKey)} className="mt-5 flex h-12 w-full items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-all duration-300 cursor-pointer">Add To Cart</button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Botanical products — remaining items in 3-at-a-time carousel */}
          {(!isThreeProductCategory || isCarouselOnlyCategory) && botanicalProducts.length > 0 && (
            <div>
              {/* Mobile: single column */}
              <div className="grid grid-cols-1 gap-10 md:hidden">
                {botanicalProducts.map((p) => {
                  const slugKey = p.slug;
                  return (
                    <motion.div key={slugKey} variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="group flex min-w-0 flex-col justify-between">
                      <Link href={`/product/${slugKey}`} className="block">
                        <div className="relative mb-3 flex h-[310px] items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(slugKey)} onMouseLeave={() => setHoveredProduct(null)}>
                          <ProductImage
                            src={p.image}
                            alt={p.name}
                            fill
                            className={`object-contain p-0 transition-all duration-500 mix-blend-multiply group-hover:scale-[1.03] ${hoveredProduct === slugKey && p.hoverImage ? "opacity-0" : "opacity-100"}`}
                            sizes="100vw"
                          />
                          {p.hoverImage && (
                            <ProductImage
                              src={p.hoverImage}
                              alt={p.name}
                              fill
                              className={`object-contain p-0 transition-all duration-500 mix-blend-multiply group-hover:scale-[1.03] ${hoveredProduct === slugKey ? "opacity-100" : "opacity-0"}`}
                              sizes="100vw"
                            />
                          )}
                        </div>
                        <div className="text-center">
                          <h3 className="text-[#2C2A26] text-xl font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)" }}>{p.name}</h3>
                          {p.subtitle && <p className="mt-1 text-base italic tracking-[0.08em] text-[#6F6A64]">{p.subtitle}</p>}
                          {p.description && <p className="mx-auto mt-3 text-base leading-relaxed text-[#8A847C]">{p.description}</p>}
                          <p className="mt-4 text-[#2C2A26] text-2xl font-light">{formatPrice(p.price, currency, exchangeRate)}</p>
                        </div>
                      </Link>
                      <button onClick={() => handleAddToCart(p, slugKey)} className="mt-2 flex h-12 px-8 items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-colors duration-300 cursor-pointer">Add To Cart</button>
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
                  <motion.div key={botanicalSlide} initial={{ opacity: 0.85, x: canScrollBack ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className={`hidden md:grid ${desktopGridClass} gap-16 px-6 md:px-12 lg:px-20`}>
                    {visibleBotanicalProducts.map((p) => {
                      const slugKey = p.slug;
                      return renderProductCard(p, slugKey, false);
                    })}
                  </motion.div>
                </div>
              )}

              {/* Desktop: single row when no carousel is needed */}
              {botanicalProducts.length > 0 && botanicalProducts.length <= visibleProductCount && (
                <div className={`relative left-1/2 hidden w-screen -translate-x-1/2 md:grid ${desktopGridClass} gap-16 px-6 md:px-12 lg:px-20`}>
                  {botanicalProducts.map((p) => {
                    const slugKey = p.slug;
                    return renderProductCard(p, slugKey, false);
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
