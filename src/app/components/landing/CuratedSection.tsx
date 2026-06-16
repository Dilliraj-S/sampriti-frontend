"use client";


import Link from "next/link";
import { useCartStore } from "@/app/components/landing/cartStore";
import SaveButton from "@/app/components/landing/SaveButton";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import { normalizeImagePath } from "@/app/utils/normalizeImagePath";
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
    { id: "black-turmeric", name: "Black Turmeric", subtitle: "Curcuma Caesia", price: 45, image: "/assets/black turmeric hd.webp", hoverImage: "/assets/black turmeric hover.webp", description: "A rare Kaya Kalpa agent for profound recovery and cellular longevity." },
  ],
  influence: [
    { id: "vatari", name: "Vatari", subtitle: "Botanical Botox", price: 48, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", description: "A potent botanical formulation for rejuvenation." },
  ],
  skincare: [
    { id: "kanti", name: "Kanti", subtitle: "Red Radiance", price: 48, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", description: "A radiant botanical essence for skin vitality." },
    { id: "blue-ojas", name: "Blue Ojas", subtitle: "Vitality Concentrate", price: 48, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", description: "A potent concentrate for cellular vitality." },
  ],
  fragrance: [
    { id: "parjanya", name: "Parjanya", subtitle: "The First Rain", price: 54, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", description: "First rain fragrance captured in botanical form." },
    { id: "jawa", name: "Jawa", subtitle: "Embers", price: 54, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", description: "Warm ember fragrance for deep atmosphere." },
    { id: "kha", name: "Kha", subtitle: "The Zero Point", price: 54, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", description: "Zero point fragrance of stillness." },
  ],
  atmosphere: [
    { id: "sandalwood-shavings", name: "Sandalwood Shavings", subtitle: "Mysore Sandalwood", price: 38, image: "/assets/black turmeric hd.webp", hoverImage: "/assets/black turmeric hover.webp", description: "Pure sandalwood for ambient purification." },
    { id: "deodar-discs", name: "Deodar Discs", subtitle: "Cedar of the Gods", price: 32, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", description: "Himalayan cedar discs for sacred space." },
    { id: "black-sambrani", name: "Black Sambrani", subtitle: "Sacred Resin", price: 36, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", description: "Traditional resin for deep meditative smoke." },
  ],
};

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
        const hasField = (obj: any, key: string) => obj !== null && obj !== undefined && key in obj;
        const fbFallback = fallbackBySection[section] || [];
        const fbMap = new Map(fbFallback.map(f => [f.id, f]));
        const filtered = pRes.data
          .filter((p: ApiProduct) => p.homepageSection === section)
          .map((p: ApiProduct) => {
            const fb = fbMap.get(p.slug);
            return {
              id: p.slug,
              name: p.name,
              subtitle: p.subtitle ?? "",
              price: hasField(p, "price") ? parseFloat(String(p.price)) || 0 : 0,
              image: normalizeImagePath(p.image) ?? fb?.image ?? "",
              hoverImage: normalizeImagePath(p.hoverImage) ?? fb?.hoverImage ?? "",
              description: p.description ?? fb?.description ?? "",
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
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-[#2C2A26] text-3xl md:text-4xl lg:text-5xl font-light" style={{ fontFamily: "var(--font-serif)" }}>{title}</h2>
          {description && <p className="mx-auto mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-[#8A847C]">{description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="group flex min-w-0 flex-col h-full w-full">
              <Link href={`/product/${product.id}`} className="flex flex-col flex-1 cursor-pointer" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                <div className="relative flex mx-auto w-full aspect-square shrink-0 items-center justify-center overflow-hidden bg-white pointer-events-none" draggable={false}>
                  <SaveButton item={{ id: product.id, name: product.name, price: product.price, image: product.image, subtitle: product.subtitle }} />
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    fill
                                            className={`object-contain p-4 md:p-8 transition-all duration-500 mix-blend-multiply ${hoveredProduct === product.id && product.hoverImage ? "opacity-0" : "opacity-100"}`}
                    sizes="33vw"
                  />
                  {product.hoverImage && (
                    <ProductImage
                      src={product.hoverImage}
                      alt={product.name}
                      fill
                      className={`object-cover object-center p-0 transition-all duration-500 ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}
                      sizes="33vw"
                    />
                  )}
                </div>
                <div className="text-center pointer-events-none mt-4 flex flex-col flex-1 justify-between pb-3">
                  <div>
                    <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: "Inter, sans-serif" }}>{product.name}</h3>
                    <p className="mt-1 text-sm leading-[20px] font-[400] text-[#666666]" style={{ fontFamily: '"Tenor Sans", sans-serif' }}>{product.subtitle}</p>
                    {product.description && <p className="mx-auto mt-1 text-sm leading-[22px] font-[300] text-[#666666]" style={{ fontFamily: "Inter, sans-serif" }}>{product.description}</p>}
                  </div>
                  <p className="mt-3 text-[#666666] text-[20px] leading-[22px] font-[300]" style={{ fontFamily: "Inter, sans-serif" }}>{formatPrice(product.price, currency, exchangeRate)}</p>
                </div>
              </Link>
              <button onClick={() => { addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }); openCart(); }}                className="mt-auto flex h-11 w-full items-center justify-center bg-[#333333] text-[#FFFEF2] text-[12px] font-[400] hover:bg-black transition-all duration-300 mx-[0.3rem] cursor-pointer" suppressHydrationWarning>Add To Cart</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
