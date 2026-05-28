"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import PromoStrip from "@/app/components/landing/PromoStrip";
import ProductImage from "@/app/components/landing/ProductImage";
import { useCartStore } from "@/app/components/landing/cartStore";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import { normalizeImagePath } from "@/app/utils/normalizeImagePath";

const fallbackProducts = [
  { id: "shakti-peya", name: "Shakti Peya", subtitle: "Energy Elixir", benefits: "Activation · Anti-Aging · Radiance", format: "9 Test Tube Kit", price: 54, image: "/Assets/shakti peya product hd.webp", hoverImage: "/Assets/shakti peya hover.webp", description: "Shakti Peya is designed to support sustained vitality, circulation, digestion, and metabolic balance." },
  { id: "chandra-rasa", name: "Chandra Rasa", subtitle: "Sleep Potion", benefits: "Calm · Settling · Restorative", format: "9 Test Tube Kit", price: 54, image: "/Assets/Chandra rasa product hd.webp", hoverImage: "/Assets/chandra rasa hover.webp", description: "A lunar-calming adaptogenic brew formulation for restful sleep and nervous system balance." },
  { id: "shotharaha", name: "Shotharaha", subtitle: "Dual Black Recovery", benefits: "", format: "9 Test Tube Kit", price: 54, image: "/Assets/shakti peya product hd.webp", hoverImage: "/Assets/shakti peya hover.webp", description: "A potent adaptogenic brew rooted in the ancient Siddha tradition." },
  { id: "rose", name: "Rose", subtitle: "Rosa Damascena", benefits: "Hydrating · Softening · Heart", format: "Botanical Profile", price: 42, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", description: "A sacred petal infusion crafted from heirloom roses for the heart and senses." },
  { id: "hibiscus", name: "Hibiscus", subtitle: "Rosa-Sinensis", benefits: "Antioxidant · Cooling · Gloss", format: "Botanical Profile", price: 42, image: "/Assets/hibiscus hd.webp", hoverImage: "/Assets/hibiscus hover.webp", description: "A vibrant floral infusion for radiant skin and hair, rich in antioxidants." },
  { id: "blue-butterfly-pea", name: "Blue Butterfly Pea", subtitle: "Clitoria Ternatea", benefits: "Azure · Clarity · Calm", format: "Botanical Profile", price: 42, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", description: "A rare Kaya Kalpa agent for profound recovery and cellular longevity." },
  { id: "vatari", name: "Vatari", subtitle: "Botanical Botox", benefits: "", format: "Botanical Profile", price: 48, image: "/Assets/hibiscus hd.webp", hoverImage: "/Assets/hibiscus hover.webp", description: "" },
  { id: "kanti", name: "Kanti", subtitle: "Red Radiance", benefits: "", format: "Botanical Profile", price: 48, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", description: "" },
  { id: "blue-ojas", name: "Blue Ojas", subtitle: "Vitality Concentrate", benefits: "", format: "Botanical Profile", price: 48, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", description: "" },
  { id: "the-sahane", name: "The Sahane", subtitle: "Stone", benefits: "", format: "", price: 36, image: "/Assets/hibiscus hd.webp", hoverImage: "/Assets/hibiscus hover.webp", description: "" },
  { id: "rakta-chandanam", name: "Rakta Chandanam", subtitle: "Red Sandalwood", benefits: "", format: "", price: 42, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", description: "" },
  { id: "shveta-chandanam", name: "Shveta Chandanam", subtitle: "White Sandalwood", benefits: "", format: "", price: 42, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", description: "" },
  { id: "parjanya", name: "Parjanya", subtitle: "The First Rain", benefits: "", format: "Botanical Profile", price: 54, image: "/Assets/hibiscus hd.webp", hoverImage: "/Assets/hibiscus hover.webp", description: "" },
  { id: "jawa", name: "Jawa", subtitle: "Embers", benefits: "", format: "Botanical Profile", price: 54, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", description: "" },
  { id: "kha", name: "Kha", subtitle: "The Zero Point", benefits: "", format: "Botanical Profile", price: 54, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", description: "" },
  { id: "sandalwood-shavings", name: "Sandalwood Shavings", subtitle: "", benefits: "", format: "", price: 28, image: "/Assets/hibiscus hd.webp", hoverImage: "/Assets/hibiscus hover.webp", description: "" },
  { id: "deodar-discs", name: "Deodar Discs", subtitle: "", benefits: "", format: "", price: 28, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", description: "" },
  { id: "black-sambrani", name: "Black Sambrani", subtitle: "", benefits: "", format: "", price: 28, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", description: "" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

// Shared image container class
const imageContainerClass =
  "relative h-[310px] overflow-hidden bg-white md:h-[350px] lg:h-[400px]";

export default function ShopPage() {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [productSlide, setProductSlide] = useState(0);
  const [products, setProducts] = useState(fallbackProducts);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const [categoryBanners, setCategoryBanners] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [pRes, settings, bRes] = await Promise.all([
        api.get<any[]>("/products"),
        getSettings().catch(() => ({ currency: "INR", exchange_rate: "85" })),
        fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin") + "/banners").then(r => r.json()).catch(() => ({ status: false }))
      ]);
      if (bRes.status) {
        setCategoryBanners(bRes.data?.filter((b: any) => b.location === "category_banner" && b.status === "active") || []);
      }
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      if (pRes.status && pRes.data?.length) {
        const merged = pRes.data.map((p: any) => {
          const fb = fallbackProducts.find(f => f.id === p.slug);
          return {
            id: p.slug, name: p.name, subtitle: p.subtitle || "",
            benefits: p.benefits || fb?.benefits || "",
            format: p.format || fb?.format || "",
            description: p.description || fb?.description || "",
            price: parseFloat(p.price) || fb?.price || 0,
            image: normalizeImagePath(p.image) || fb?.image || "",
            hoverImage: normalizeImagePath(p.hoverImage) || fb?.hoverImage || "",
            createdAt: p.createdAt,
          };
        });
        merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setProducts(merged);
      }
    })();
  }, []);

  const maxProductSlide = Math.max(0, products.length - 3);
  const visibleProducts = products.slice(productSlide, productSlide + 3);
  const canScrollBack = productSlide > 0;
  const canScrollForward = productSlide < maxProductSlide;

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
    openCart();
  };

  const slideProducts = (direction: "back" | "forward") => {
    setProductSlide((current) => {
      if (direction === "forward") return Math.min(maxProductSlide, current + 3);
      return Math.max(0, current - 3);
    });
  };

  const getImageClasses = (productId: string, isHover: boolean) => {
    const isImmersive = productId === "shakti-peya" || productId === "chandra-rasa";
    const base = "absolute inset-0 w-full h-full transition-all duration-500 group-hover:scale-[1.03]";
    if (isImmersive && isHover) {
      return `${base} object-cover object-center scale-100`;
    }
    return `${base} object-contain object-center scale-100`;
  };

  const renderProductImages = (product: (typeof products)[0]) => (
    <div
      className={imageContainerClass}
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <ProductImage
        src={product.image}
        alt={product.name}
        fill
        className={`${getImageClasses(product.id, false)} mix-blend-multiply ${
          hoveredProduct === product.id && product.hoverImage ? "opacity-0" : "opacity-100"
        }`}
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      {product.hoverImage && (
        <ProductImage
          src={product.hoverImage}
          alt={product.name}
          fill
          className={`${getImageClasses(product.id, true)} mix-blend-multiply ${
            hoveredProduct === product.id ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      )}
    </div>
  );

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <PromoStrip />
      <Navbar />

      {/* HERO SECTION */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative flex min-h-screen items-end justify-center overflow-hidden px-6 pb-24 text-center md:px-12 md:pb-28 lg:px-20"
      >
        <Image
          src="/Assets/img 4.webp"
          alt="Sampriti botanical ritual collection"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/20 to-transparent" />
        <div className="relative z-10 max-w-4xl">
          <h1
            className="text-[#2C2A26] text-3xl md:text-4xl lg:text-5xl font-light"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Signature Rituals
          </h1>
          <p className="mx-auto mt-5 max-w-4xl text-[#4F4A43] text-base md:text-lg leading-relaxed md:whitespace-nowrap">
            A collection of precisely composed formulations honoring the body&apos;s essential cycles: activation and restoration.
          </p>
          <a
            href="#shop-products"
            className="mt-8 inline-flex h-12 items-center justify-center bg-[#333333] px-9 text-[#F9F7F3] text-base font-normal transition-colors duration-300 hover:bg-black"
          >
            Explore the collection
          </a>
        </div>
      </motion.div>

      {/* Category Banners */}
      {categoryBanners.length > 0 && (
        <div className="px-6 md:px-12 lg:px-20 mt-8 mb-12">
          {categoryBanners.map((banner) => (
            <div
              key={banner.id}
              className="relative h-40 md:h-56 w-full overflow-hidden rounded-xl bg-gray-100"
            >
              {banner.image && (
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-white text-2xl md:text-3xl font-light tracking-wider">
                  {banner.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCT PRESENTATION */}
      <div id="shop-products" className="relative scroll-mt-24 px-6 pt-20 md:px-12 lg:px-20 pb-24">
        <div className="max-w-6xl mx-auto">

        {/* ── Mobile grid (single column, all products) ───────────────────── */}
        <div className="grid grid-cols-1 items-stretch gap-y-16 md:hidden">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial="hidden"
              animate="show"
              variants={{
                ...fadeUp,
                show: {
                  ...fadeUp.show,
                  transition: { ...fadeUp.show.transition, delay: index * 0.08 },
                },
              }}
              className="group flex flex-col"
            >
              <Link href={`/product/${product.id}`}>
                {renderProductImages(product)}
              </Link>

              <div className="flex-1 text-center">
                <h3
                  className="mb-1 mt-3 text-[#2C2A26] text-xl font-normal tracking-[0.14em]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {product.name} | {product.subtitle}
                </h3>
                {product.description && <p className="mx-auto mt-3 mb-5 text-base leading-relaxed text-[#8A847C]">{product.description}</p>}
                <p className="mt-auto text-[#2C2A26] text-2xl font-light">{formatPrice(product.price, currency, exchangeRate)}</p>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-2 flex h-12 w-full items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
              >
                Add To Cart
              </button>
            </motion.div>
          ))}
        </div>

        {/* ── Desktop scroll arrows ────────────────────────────────────────── */}
        {canScrollBack && (
          <button
            type="button"
            aria-label="Previous products"
            onClick={() => slideProducts("back")}
            className="absolute -left-6 top-[32%] z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white text-[#2C2A26] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#F8F7F5] md:-left-8 md:flex"
          >
            <ChevronLeft size={26} strokeWidth={1.8} />
          </button>
        )}
        {canScrollForward && (
          <button
            type="button"
            aria-label="Next products"
            onClick={() => slideProducts("forward")}
            className="absolute -right-6 top-[32%] z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white text-[#2C2A26] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#F8F7F5] md:-right-8 md:flex"
          >
            <ChevronRight size={26} strokeWidth={1.8} />
          </button>
        )}

        {/* ── Desktop 3-column sliding grid ───────────────────────────────── */}
        <motion.div
          key={productSlide}
          initial={{ opacity: 0.85, x: canScrollBack ? 18 : -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="hidden md:grid md:grid-cols-3 md:items-stretch gap-16"
        >
          {visibleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial="hidden"
              animate="show"
              variants={{
                ...fadeUp,
                show: {
                  ...fadeUp.show,
                  transition: { ...fadeUp.show.transition, delay: index * 0.08 },
                },
              }}
              className="group flex flex-col"
            >
              <Link href={`/product/${product.id}`}>
                {renderProductImages(product)}
              </Link>

              {/* Product Info */}
              <div className="flex-1 text-center">
                <h3
                  className="mb-1 mt-3 text-[#2C2A26] text-xl font-normal tracking-[0.14em]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {product.name} | {product.subtitle}
                </h3>
                {product.description && <p className="mx-auto mt-3 mb-5 text-base leading-relaxed text-[#8A847C]">{product.description}</p>}
                <p className="text-[#2C2A26] text-2xl font-light">{formatPrice(product.price, currency, exchangeRate)}</p>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-2 flex h-12 w-full items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
              >
                Add To Cart
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
      </div>

      <Footer />
    </main>
  );
}
