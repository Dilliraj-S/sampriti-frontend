"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/app/components/landing/cartStore";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import ProductImage from "@/app/components/landing/ProductImage";

const fallbackProducts = [
  { id: "shakti-peya", name: "Shakti Peya", subtitle: "Energy Elixir", category: "Activation", benefits: "Activation · Anti-Aging · Radiance", format: "9 Test Tube Kit", price: 54, image: "/Assets/shakti peya product hd.png", hoverImage: "/Assets/shakti peya hover.png" },
  { id: "chandra-rasa", name: "Chandra Rasa", subtitle: "Sleep Potion", category: "Calm", benefits: "Calm · Settling · Restorative", format: "9 Test Tube Kit", price: 54, image: "/Assets/Chandra rasa product hd.webp", hoverImage: "/Assets/chandra rasa hover.webp" },
  { id: "hibiscus", name: "Hibiscus", subtitle: "Rosa-Sinensis", category: "Antioxidant", description: "A vibrant botanical infusion rich in antioxidants.", price: 42, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png" },
  { id: "rose", name: "Rose", subtitle: "Rosa Damascena", category: "Hydrating", description: "A delicate floral essence to soothe the heart.", price: 42, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp" },
  { id: "blue-butterfly-pea", name: "Blue Butterfly Pea", subtitle: "Clitoria Ternatea", category: "Azure", description: "A brilliant blue infusion to enhance cognitive function.", price: 42, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp" },
  { id: "black-turmeric", name: "Black Turmeric", subtitle: "Curcuma Caesia", category: "Kaya Kalpa", description: "A rare Kaya Kalpa agent for profound recovery.", price: 45, image: "/Assets/black turmeric hd.webp", hoverImage: "/Assets/black turmeric hover.webp" },
];

const fadeInSlow = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 1.0 } } };

export default function SignatureRituals() {
  const [products, setProducts] = useState(fallbackProducts);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [botanicalSlide, setBotanicalSlide] = useState(0);

  useEffect(() => {
    (async () => {
      const [pRes, settings] = await Promise.all([api.get<any[]>("/products"), getSettings().catch(() => ({ currency: "INR", exchange_rate: "85" }))]);
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      if (pRes.status && pRes.data?.length) {
        const fbMap = new Map(fallbackProducts.map(f => [f.id, f]));
        const merged = pRes.data.map((p: any) => {
          const fb = fbMap.get(p.slug);
          return {
            id: p.slug, name: p.name, subtitle: p.subtitle || "", category: p.category?.name || fb?.category || "",
            benefits: p.benefits || fb?.benefits || "", format: p.format || fb?.format || "",
            price: parseFloat(p.price) || fb?.price || 0,
            image: fb ? fb.image : (p.image || ""), hoverImage: fb ? fb.hoverImage : (p.hoverImage || ""),
            description: p.description || fb?.description || "",
            createdAt: p.createdAt,
          };
        });
        merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setProducts(merged);
      }
    })();
  }, []);

  const featuredProducts = products.slice(0, 2);
  const botanicalProducts = products.slice(2);
  const maxBotanicalSlide = Math.max(0, botanicalProducts.length - 3);
  const visibleBotanicalProducts = botanicalProducts.slice(botanicalSlide, botanicalSlide + 3);
  const canScrollBack = botanicalSlide > 0;
  const canScrollForward = botanicalSlide < maxBotanicalSlide;

  const handleAddToCart = (product: (typeof products)[0]) => { addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }); openCart(); };

  const scrollBotanicals = (direction: "back" | "forward") => {
    setBotanicalSlide((current) => {
      if (direction === "forward") return Math.min(maxBotanicalSlide, current + 1);
      return Math.max(0, current - 1);
    });
  };

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
              <div className="min-h-[176px] text-center">
                <h3 className="mb-1 text-[#2C2A26] text-[20px] font-normal tracking-[0.16em]" style={{ fontFamily: "var(--font-sans)" }}>{product.name} | {product.subtitle}</h3>
                <p className="mb-6 text-[#6F6A64] text-base">{product.benefits}</p>
                <p className="mb-8 text-[#6F6A64] text-base">{product.format}</p>
                <p className="text-[#2C2A26] text-xl font-light">{formatPrice(product.price, currency, exchangeRate)}</p>
              </div>
              <button onClick={() => handleAddToCart(product)} className="mt-3 flex h-12 w-full items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-semibold hover:bg-black transition-all duration-300 cursor-pointer">Add To Cart</button>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mt-10 md:mt-12 mb-16 md:mb-20">
          <h2 className="text-[#2C2A26] text-3xl md:text-4xl lg:text-5xl font-light" style={{ fontFamily: "var(--font-serif)" }}>Materia Botanica</h2>
          <p className="mx-auto mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-[#8A847C]">A collection of high-functioning botanical infusions, each chosen for its unique therapeutic profile and ancestral significance.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 md:hidden">
          {botanicalProducts.map((product) => (
            <motion.div key={product.id} variants={fadeInSlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="group flex min-w-0 flex-col justify-between">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative mb-3 flex h-[270px] items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
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
                <div className="min-h-[152px] text-center">
                  <h3 className="text-[#2C2A26] text-[19px] font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)" }}>{product.name}</h3>
                  <p className="mt-1 text-[15px] italic tracking-[0.08em] text-[#6F6A64]">{product.subtitle}</p>
                  <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-relaxed text-[#8A847C]">{product.description}</p>
                  <p className="mt-4 text-[#2C2A26] text-xl font-light">{formatPrice(product.price, currency, exchangeRate)}</p>
                </div>
              </Link>
              <button onClick={() => handleAddToCart(product)} className="mt-2 flex h-12 w-full items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-semibold hover:bg-black transition-colors duration-300 cursor-pointer">Add To Cart</button>
            </motion.div>
          ))}
        </div>

        {botanicalProducts.length > 3 && (
          <div className="relative left-1/2 hidden w-screen -translate-x-1/2 overflow-hidden pb-4 md:block">
            {canScrollBack && <button type="button" onClick={() => scrollBotanicals("back")} className="absolute left-5 top-[50%] z-10 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white text-[#2C2A26] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-gray-50 flex"><ChevronLeft size={26} strokeWidth={1.8} /></button>}
            {canScrollForward && <button type="button" onClick={() => scrollBotanicals("forward")} className="absolute right-5 top-[50%] z-10 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white text-[#2C2A26] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-gray-50 flex"><ChevronRight size={26} strokeWidth={1.8} /></button>}
            <motion.div key={botanicalSlide} initial={{ opacity: 0.85, x: canScrollBack ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="hidden md:grid md:grid-cols-3 gap-8">
              {visibleBotanicalProducts.map((product) => (
                <div key={product.id} className="group flex min-w-0 flex-col justify-between">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative mb-3 flex h-[270px] items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
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
                    <div className="min-h-[152px] text-center">
                      <h3 className="text-[#2C2A26] text-[19px] font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)" }}>{product.name}</h3>
                      <p className="mt-1 text-[15px] italic tracking-[0.08em] text-[#6F6A64]">{product.subtitle}</p>
                      <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-relaxed text-[#8A847C]">{product.description}</p>
                      <p className="mt-4 text-[#2C2A26] text-xl font-light">{formatPrice(product.price, currency, exchangeRate)}</p>
                    </div>
                  </Link>
                  <button onClick={() => handleAddToCart(product)} className="mt-2 flex h-12 w-full items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-semibold hover:bg-black transition-colors duration-300 cursor-pointer">Add To Cart</button>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
