"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/app/components/landing/cartStore";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import ProductImage from "@/app/components/landing/ProductImage";

type ApiProduct = {
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
};

interface CuratedSectionProps {
  section: string;
  title: string;
  description?: string;
}

const fallbackBySection: Record<string, { id: string; name: string; subtitle: string; price: number; image: string; hoverImage: string; description?: string }[]> = {
  home: [
    { id: "black-turmeric", name: "Black Turmeric", subtitle: "Curcuma Caesia", price: 45, image: "/Assets/black turmeric hd.webp", hoverImage: "/Assets/black turmeric hover.webp", description: "A rare Kaya Kalpa agent for profound recovery and cellular longevity." },
  ],
  influence: [
    { id: "vatari", name: "Vatari", subtitle: "Botanical Botox", price: 48, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png", description: "A potent botanical formulation for rejuvenation." },
  ],
  skincare: [
    { id: "kanti", name: "Kanti", subtitle: "Red Radiance", price: 48, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", description: "A radiant botanical essence for skin vitality." },
    { id: "blue-ojas", name: "Blue Ojas", subtitle: "Vitality Concentrate", price: 48, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", description: "A potent concentrate for cellular vitality." },
  ],
  fragrance: [
    { id: "parjanya", name: "Parjanya", subtitle: "The First Rain", price: 54, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png", description: "First rain fragrance captured in botanical form." },
    { id: "jawa", name: "Jawa", subtitle: "Embers", price: 54, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", description: "Warm ember fragrance for deep atmosphere." },
    { id: "kha", name: "Kha", subtitle: "The Zero Point", price: 54, image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", description: "Zero point fragrance of stillness." },
  ],
  atmosphere: [
    { id: "sandalwood-shavings", name: "Sandalwood Shavings", subtitle: "Mysore Sandalwood", price: 38, image: "/Assets/black turmeric hd.webp", hoverImage: "/Assets/black turmeric hover.webp", description: "Pure sandalwood for ambient purification." },
    { id: "deodar-discs", name: "Deodar Discs", subtitle: "Cedar of the Gods", price: 32, image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png", description: "Himalayan cedar discs for sacred space." },
    { id: "black-sambrani", name: "Black Sambrani", subtitle: "Sacred Resin", price: 36, image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", description: "Traditional resin for deep meditative smoke." },
  ],
};

const fadeInUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

export default function CuratedSection({ section, title, description }: CuratedSectionProps) {
  const [products, setProducts] = useState<(typeof fallbackBySection)[string]>(fallbackBySection[section] || []);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [pRes, settings] = await Promise.all([api.get<ApiProduct[]>("/products"), getSettings().catch(() => ({ currency: "INR", exchange_rate: "85" }))]);
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      if (pRes.status && pRes.data?.length) {
        const fbFallback = fallbackBySection[section] || [];
        const fbMap = new Map(fbFallback.map(f => [f.id, f]));
        const filtered = pRes.data
          .filter((p: ApiProduct) => p.homepageSection === section)
          .map((p: ApiProduct) => {
            const fb = fbMap.get(p.slug);
            return {
              id: p.slug,
              name: p.name,
              subtitle: p.subtitle || "",
              price: parseFloat(String(p.price || 0)) || 0,
              image: fb?.image || p.image || "",
              hoverImage: fb?.hoverImage || p.hoverImage || "",
              description: fb?.description || p.description || "",
            };
          });
        if (filtered.length) setProducts(filtered);
      }
    })();
  }, [section]);

  if (!products.length) return null;

  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16 md:mb-20">
          <h2 className="text-[#2C2A26] text-3xl md:text-4xl lg:text-5xl font-light" style={{ fontFamily: "var(--font-serif)" }}>{title}</h2>
          {description && <p className="mx-auto mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-[#8A847C]">{description}</p>}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {products.map((product) => (
            <motion.div key={product.id} variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="group flex min-w-0 flex-col justify-between">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative mb-3 flex h-[310px] items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                  <ProductImage
                    src={hoveredProduct === product.id && product.hoverImage ? product.hoverImage : product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-0 transition-opacity duration-500 mix-blend-multiply"
                    sizes="33vw"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-[#2C2A26] text-xl font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)" }}>{product.name}</h3>
                  <p className="mt-1 text-base italic tracking-[0.08em] text-[#6F6A64]">{product.subtitle}</p>
                  {'description' in product && product.description && <p className="mx-auto mt-3 text-base leading-relaxed text-[#8A847C]">{(product as any).description}</p>}
                  <p className="mt-4 text-[#2C2A26] text-2xl font-light">{formatPrice(product.price, currency, exchangeRate)}</p>
                </div>
              </Link>
              <button onClick={() => { addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }); openCart(); }} className="mt-2 flex h-12 px-8 items-center justify-center bg-[#333333] text-[#F9F7F3] text-base font-normal hover:bg-black transition-all duration-300 cursor-pointer">Add To Cart</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
