"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import ProductImage from "@/app/components/landing/ProductImage";
import { useCartStore } from "@/app/components/landing/cartStore";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
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
  createdAt?: string;
};

type DisplayProduct = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  hoverImage: string;
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

const fallbackProducts: Record<string, { name: string; subtitle: string; price: number; image: string; hoverImage: string }> = {
  "shakti-peya": { name: "Shakti Peya", subtitle: "Energy Elixir", price: 54, image: "/Assets/shakti peya product hd.png", hoverImage: "/Assets/shakti peya hover.png" },
  "chandra-rasa": { name: "Chandra Rasa", subtitle: "Sleep Potion", price: 54, image: "/Assets/Chandra rasa product hd.webp", hoverImage: "/Assets/chandra rasa hover.webp" },
  "shotharaha": { name: "Shotharaha", subtitle: "Dual Black Recovery", price: 54, image: "/Assets/shakti peya product hd.png", hoverImage: "/Assets/shakti peya hover.png" },
  "rose": { name: "Rose", subtitle: "Rosa Damascena", price: 42, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp" },
  "hibiscus": { name: "Hibiscus", subtitle: "Rosa-Sinensis", price: 42, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png" },
  "blue-butterfly-pea": { name: "Blue Butterfly Pea", subtitle: "Clitoria Ternatea", price: 42, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp" },
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
  const fallbackDisplayProducts: DisplayProduct[] = productSlugs
    .map((productSlug) => {
      const product = fallbackProducts[productSlug];
      return product ? { slug: productSlug, ...product } : null;
    })
    .filter(Boolean) as DisplayProduct[];
  const fallbackSlugSet = new Set(fallbackDisplayProducts.map((product) => product.slug));
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
      image: product.image || "",
      hoverImage: product.hoverImage || "",
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
        <div className={`relative mb-3 flex ${isFeatured ? 'aspect-[1.9/1]' : 'h-[270px]'} items-center justify-center overflow-hidden bg-white`} onMouseEnter={() => setHoveredProduct(slugKey)} onMouseLeave={() => setHoveredProduct(null)}>
          <ProductImage
            src={p.image}
            alt={p.name}
            fill
            className={`object-contain p-0 transition-opacity duration-500 mix-blend-multiply ${hoveredProduct === slugKey && p.hoverImage ? "opacity-0" : "opacity-100"}`}
            sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "33vw"}
          />
          {p.hoverImage && (
            <ProductImage
              src={p.hoverImage}
              alt={p.name}
              fill
              className={`object-contain p-0 transition-opacity duration-500 mix-blend-multiply ${hoveredProduct === slugKey ? "opacity-100" : "opacity-0"}`}
              sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "33vw"}
            />
          )}
        </div>
        <div className="min-h-[152px] text-center">
          <h3 className="text-[#2C2A26] text-[19px] font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)" }}>{p.name}</h3>
          {p.subtitle && <p className="mt-1 text-[15px] italic tracking-[0.08em] text-[#6F6A64]">{p.subtitle}</p>}
          <p className="mt-4 text-[#2C2A26] text-xl font-light">{formatPrice(p.price, currency, exchangeRate)}</p>
        </div>
      </Link>
      <button onClick={() => handleAddToCart(p, slugKey)} className="mt-2 flex h-12 w-full items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-colors duration-300 cursor-pointer">Add To Cart</button>
    </div>
  );

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled={true} />
      <div className="px-6 pt-32 pb-20 md:pt-44 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-[#2C2A26] text-3xl md:text-5xl font-light text-center mb-16 md:mb-20" style={{ fontFamily: "var(--font-serif)" }}>{title}</h1>

          {displayProducts.length === 0 && <p className="text-center text-[#8A847C]">Products coming soon.</p>}

          {/* 3-product categories: all in one row */}
          {isThreeProductCategory && !isCarouselOnlyCategory && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                          src={hoveredProduct === slugKey && p.hoverImage ? p.hoverImage : p.image}
                          alt={p.name}
                          fill
                          className="object-contain transition-opacity duration-500 mix-blend-multiply"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </Link>
                    <div className="text-center">
                      <h3 className="mb-1 text-[#2C2A26] text-[20px] font-normal tracking-[0.16em]" style={{ fontFamily: "var(--font-sans)" }}>{p.name} | {p.subtitle}</h3>
                      <p className="mt-2 text-[#2C2A26] text-xl font-light">{formatPrice(p.price, currency, exchangeRate)}</p>
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
                        <div className="relative mb-3 flex h-[270px] items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(slugKey)} onMouseLeave={() => setHoveredProduct(null)}>
                          <ProductImage
                            src={p.image}
                            alt={p.name}
                            fill
                            className={`object-contain p-0 transition-opacity duration-500 mix-blend-multiply ${hoveredProduct === slugKey && p.hoverImage ? "opacity-0" : "opacity-100"}`}
                            sizes="100vw"
                          />
                          {p.hoverImage && (
                            <ProductImage
                              src={p.hoverImage}
                              alt={p.name}
                              fill
                              className={`object-contain p-0 transition-opacity duration-500 mix-blend-multiply ${hoveredProduct === slugKey ? "opacity-100" : "opacity-0"}`}
                              sizes="100vw"
                            />
                          )}
                        </div>
                        <div className="min-h-[152px] text-center">
                          <h3 className="text-[#2C2A26] text-[19px] font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)" }}>{p.name}</h3>
                          {p.subtitle && <p className="mt-1 text-[15px] italic tracking-[0.08em] text-[#6F6A64]">{p.subtitle}</p>}
                          <p className="mt-4 text-[#2C2A26] text-xl font-light">{formatPrice(p.price, currency, exchangeRate)}</p>
                        </div>
                      </Link>
                      <button onClick={() => handleAddToCart(p, slugKey)} className="mt-2 flex h-12 w-full items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-colors duration-300 cursor-pointer">Add To Cart</button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Desktop: carousel with arrows */}
              {botanicalProducts.length > visibleProductCount && (
                <div className="relative left-1/2 hidden w-screen -translate-x-1/2 overflow-hidden pb-4 md:block">
                  {canScrollBack && (
                    <button type="button" onClick={() => scrollBotanicals("back")} className="absolute left-5 top-[50%] z-10 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white text-[#2C2A26] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-gray-50 flex">
                      <ChevronLeft size={26} strokeWidth={1.8} />
                    </button>
                  )}
                  {canScrollForward && (
                    <button type="button" onClick={() => scrollBotanicals("forward")} className="absolute right-5 top-[50%] z-10 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white text-[#2C2A26] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-gray-50 flex">
                      <ChevronRight size={26} strokeWidth={1.8} />
                    </button>
                  )}
                  <motion.div key={botanicalSlide} initial={{ opacity: 0.85, x: canScrollBack ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className={`hidden md:grid ${desktopGridClass} gap-8`}>
                    {visibleBotanicalProducts.map((p) => {
                      const slugKey = p.slug;
                      return renderProductCard(p, slugKey, false);
                    })}
                  </motion.div>
                </div>
              )}

              {/* Desktop: single row when no carousel is needed */}
              {botanicalProducts.length > 0 && botanicalProducts.length <= visibleProductCount && (
                <div className={`hidden md:grid ${desktopGridClass} gap-8`}>
                  {botanicalProducts.map((p) => {
                    const slugKey = p.slug;
                    return renderProductCard(p, slugKey, false);
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
