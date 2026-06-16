"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import ProductImage from "@/app/components/landing/ProductImage";
import { useCartStore } from "@/app/components/landing/cartStore";
import SaveButton from "@/app/components/landing/SaveButton";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import { normalizeImagePath } from "@/app/utils/normalizeImagePath";

const fallbackProducts = [
  { id: "shakti-peya", name: "Shakti Peya", subtitle: "Energy Elixir", benefits: "Activation \u00b7 Anti-Aging \u00b7 Radiance", format: "9 Test Tube Kit", price: 54, image: "/assets/shakti peya product hd.webp", hoverImage: "/assets/shakti peya hover.webp", description: "Shakti Peya is designed to support sustained vitality, circulation, digestion, and metabolic balance." },
  { id: "chandra-rasa", name: "Chandra Rasa", subtitle: "Sleep Potion", benefits: "Calm \u00b7 Settling \u00b7 Restorative", format: "9 Test Tube Kit", price: 54, image: "/assets/Chandra rasa product hd.webp", hoverImage: "/assets/chandra rasa hover.webp", description: "A lunar-calming adaptogenic brew formulation for restful sleep and nervous system balance." },
  { id: "shotharaha", name: "Shotharaha", subtitle: "Dual Black Recovery", benefits: "", format: "9 Test Tube Kit", price: 54, image: "/assets/shakti peya product hd.webp", hoverImage: "/assets/shakti peya hover.webp", description: "A potent adaptogenic brew rooted in the ancient Siddha tradition." },
  { id: "rose", name: "Rose", subtitle: "Rosa Damascena", benefits: "Hydrating \u00b7 Softening \u00b7 Heart", format: "Botanical Profile", price: 42, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", description: "A sacred petal infusion crafted from heirloom roses for the heart and senses." },
  { id: "hibiscus", name: "Hibiscus", subtitle: "Rosa-Sinensis", benefits: "Antioxidant \u00b7 Cooling \u00b7 Gloss", format: "Botanical Profile", price: 42, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", description: "A vibrant floral infusion for radiant skin and hair, rich in antioxidants." },
  { id: "blue-butterfly-pea", name: "Blue Butterfly Pea", subtitle: "Clitoria Ternatea", benefits: "Azure \u00b7 Clarity \u00b7 Calm", format: "Botanical Profile", price: 42, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", description: "A rare Kaya Kalpa agent for profound recovery and cellular longevity." },
  { id: "vatari", name: "Vatari", subtitle: "Botanical Botox", benefits: "", format: "Botanical Profile", price: 48, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", description: "" },
  { id: "kanti", name: "Kanti", subtitle: "Red Radiance", benefits: "", format: "Botanical Profile", price: 48, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", description: "" },
  { id: "blue-ojas", name: "Blue Ojas", subtitle: "Vitality Concentrate", benefits: "", format: "Botanical Profile", price: 48, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", description: "" },
  { id: "the-sahane", name: "The Sahane", subtitle: "Stone", benefits: "", format: "", price: 36, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", description: "" },
  { id: "rakta-chandanam", name: "Rakta Chandanam", subtitle: "Red Sandalwood", benefits: "", format: "", price: 42, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", description: "" },
  { id: "shveta-chandanam", name: "Shveta Chandanam", subtitle: "White Sandalwood", benefits: "", format: "", price: 42, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", description: "" },
  { id: "parjanya", name: "Parjanya", subtitle: "The First Rain", benefits: "", format: "Botanical Profile", price: 54, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", description: "" },
  { id: "jawa", name: "Jawa", subtitle: "Embers", benefits: "", format: "Botanical Profile", price: 54, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", description: "" },
  { id: "kha", name: "Kha", subtitle: "The Zero Point", benefits: "", format: "Botanical Profile", price: 54, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", description: "" },
  { id: "sandalwood-shavings", name: "Sandalwood Shavings", subtitle: "", benefits: "", format: "", price: 28, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", description: "" },
  { id: "deodar-discs", name: "Deodar Discs", subtitle: "", benefits: "", format: "", price: 28, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", description: "" },
  { id: "black-sambrani", name: "Black Sambrani", subtitle: "", benefits: "", format: "", price: 28, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", description: "" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function ShopPage() {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [products, setProducts] = useState(fallbackProducts);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  useEffect(() => {
    (async () => {
      const [pRes, settings] = await Promise.all([
        api.get<any[]>("/products"),
        getSettings().catch(() => ({ currency: "INR", exchange_rate: "85" })),
      ]);
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      if (pRes.status && pRes.data?.length) {
        const hasField = (obj: any, key: string) => obj !== null && obj !== undefined && key in obj;
        const apiMap = new Map(pRes.data.map((p: any) => [p.slug, p]));
        const merged = fallbackProducts.map((fb) => {
          const api = apiMap.get(fb.id);
          if (!api) return fb;
          return {
            id: fb.id,
            name: api.name ?? fb.name,
            subtitle: api.subtitle ?? fb.subtitle ?? "",
            benefits: api.benefits ?? fb.benefits ?? "",
            format: api.format ?? fb.format ?? "",
            description: api.description ?? fb.description ?? "",
            price: hasField(api, "price") ? parseFloat(String(api.price)) || 0 : (fb.price ?? 0),
            image: normalizeImagePath(api.image) ?? fb.image ?? "",
            hoverImage: normalizeImagePath(api.hoverImage) ?? fb.hoverImage ?? "",
            createdAt: api.createdAt,
          };
        });
        pRes.data.forEach((p: any) => {
          if (!fallbackProducts.find(f => f.id === p.slug)) {
            merged.push({
              id: p.slug,
              name: p.name,
              subtitle: p.subtitle ?? "",
              benefits: p.benefits ?? "",
              format: p.format ?? "",
              description: p.description ?? "",
              price: hasField(p, "price") ? parseFloat(String(p.price)) || 0 : 0,
              image: normalizeImagePath(p.image) ?? "",
              hoverImage: normalizeImagePath(p.hoverImage) ?? "",
              createdAt: p.createdAt,
            });
          }
        });
        merged.sort((a, b) => {
          const ca = (a as any).createdAt ?? 0;
          const cb = (b as any).createdAt ?? 0;
          return new Date(ca).getTime() - new Date(cb).getTime();
        });
        setProducts(merged);
      }
    })();
  }, []);

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({ id: product.id, name: product.name, subtitle: product.subtitle, format: product.format, price: product.price, quantity: 1, image: product.image });
    openCart();
  };

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />

      {/* HERO SECTION */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative flex min-h-screen items-end justify-center overflow-hidden px-6 pb-24 text-center md:px-12 md:pb-28 lg:px-20"
      >
        <Image
          src="/assets/img 4.webp"
          alt="Sampriti botanical ritual collection"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-[900px]">
          <h1
            className="text-white font-[200] leading-[1.1] tracking-[0.1em] mx-auto mb-2"
            style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.05rem,2.0vw,2.05rem)", textShadow: "0 2px 10px rgba(0,0,0,0.3)", maxWidth: "900px" }}
          >
            Signature Rituals
          </h1>
          <p
            className="mx-auto text-center text-[clamp(0.75rem,1.3vw,0.9rem)] font-[400] leading-[1.6] text-white/90 whitespace-nowrap"
            style={{ fontFamily: "var(--font-body)", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
          >
            A collection of precisely composed formulations honoring the body&apos;s essential cycles: activation and restoration.
          </p>
        </div>
      </motion.div>

      {/* PRODUCT GRID — all products in 3-column rows, no carousel */}
      <div id="shop-products" className="relative scroll-mt-24 pt-20 pb-24">
        <div className="grid grid-cols-1 gap-10 md:relative md:left-1/2 md:w-screen md:-translate-x-1/2 md:grid-cols-3 md:gap-x-4 md:gap-y-16 px-6 md:px-16 lg:px-24">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial="hidden"
                animate="show"
                variants={{
                  ...fadeUp,
                  show: {
                    ...fadeUp.show,
                    transition: { ...fadeUp.show.transition, delay: index * 0.05 },
                  },
                }}
                className="group flex flex-col h-full w-full"
              >
                <Link href={`/product/${product.id}`} className="flex flex-col flex-1 cursor-pointer" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                  <div className="relative flex mx-auto w-full aspect-square shrink-0 items-center justify-center overflow-hidden bg-white pointer-events-none"
                    draggable={false}
                  >
                    <SaveButton item={{ id: product.id, name: product.name, price: product.price, image: product.image, subtitle: product.subtitle }} />
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className={`object-contain p-4 md:p-8 transition-all duration-500 mix-blend-multiply ${
                        hoveredProduct === product.id && product.hoverImage ? "opacity-0" : "opacity-100"
                      }`}
                      sizes="33vw"
                    />
                    {product.hoverImage && (
                      <ProductImage
                        src={product.hoverImage}
                        alt={product.name}
                        fill
                        className={`object-cover object-center p-0 transition-all duration-500 ${
                          hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                        }`}
                        sizes="33vw"
                      />
                    )}
                  </div>
                  <div className="text-center pointer-events-none mt-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: "Inter, sans-serif" }}>{product.name}</h3>
                      {product.subtitle && <p className="mt-3 text-sm leading-[20px] font-[400] italic text-[#666666]" style={{ fontFamily: '"Tenor Sans", sans-serif' }}>{product.subtitle}</p>}
                      {product.description && <p className="mx-auto mt-3 text-sm leading-[22px] font-[300] text-[#666666]" style={{ fontFamily: "Inter, sans-serif" }}>{product.description}</p>}
                    </div>
                    <p className="mt-3 text-[#666666] text-[20px] leading-[22px] font-[300]" style={{ fontFamily: "Inter, sans-serif" }}>{formatPrice(product.price, currency, exchangeRate)}</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 flex h-11 w-full items-center justify-center bg-[#333333] text-[#FFFEF2] text-[12px] font-[400] hover:bg-black transition-all duration-300 mx-[0.3rem] cursor-pointer"
                  suppressHydrationWarning
                >
                  Add To Cart
                </button>
              </motion.div>
            ))}
          </div>
      </div>

      <Footer />
    </main>
  );
}
