"use client";

import Link from "next/link";
import { useCartStore } from "@/app/components/landing/cartStore";
import SaveButton from "@/app/components/landing/SaveButton";
import { useState, useEffect } from "react";
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
  { id: "shakti-peya", name: "Shakti Peya", subtitle: "Energy Elixir", category: "Activation", benefits: "Activation · Anti-Aging · Radiance", format: "9 Test Tube Kit", price: 54, image: "/assets/shakti peya product hd.webp", hoverImage: "/assets/shakti peya hover.webp" },
  { id: "chandra-rasa", name: "Chandra Rasa", subtitle: "Sleep Potion", category: "Calm", benefits: "Calm · Settling · Restorative", format: "9 Test Tube Kit", price: 54, image: "/assets/Chandra rasa product hd.webp", hoverImage: "/assets/chandra rasa hover.webp" },
  { id: "shotharaha", name: "Shotharaha", subtitle: "Dual Black Recovery", category: "Restorative", benefits: "", format: "", description: "", price: 54, image: "/assets/shakti peya product hd.webp", hoverImage: "/assets/shakti peya hover.webp" },
  { id: "rose", name: "Rose", subtitle: "Rosa Damascena", category: "Floral", benefits: "", format: "", description: "A delicate floral essence to soothe the heart and refine natural radiance.", price: 42, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp" },
  { id: "hibiscus", name: "Hibiscus", subtitle: "Rosa-Sinensis", category: "Antioxidant", benefits: "", format: "", description: "A vibrant botanical infusion rich in antioxidants for cardiovascular resilience.", price: 42, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp" },
  { id: "blue-butterfly-pea", name: "Blue Butterfly Pea", subtitle: "Clitoria Ternatea", category: "Azure", benefits: "", format: "", description: "A brilliant blue infusion to enhance cognitive function and reduce stress.", price: 42, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp" },
  { id: "vatari", name: "Vatari", subtitle: "Botanical Botox", category: "Skincare", benefits: "", format: "", description: "", price: 48, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp" },
  { id: "kanti", name: "Kanti", subtitle: "Red Radiance", category: "Skincare", benefits: "", format: "", description: "", price: 48, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp" },
  { id: "blue-ojas", name: "Blue Ojas", subtitle: "Vitality Concentrate", category: "Skincare", benefits: "", format: "", description: "", price: 48, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp" },
  { id: "parjanya", name: "Parjanya", subtitle: "The First Rain", category: "Fragrance", benefits: "", format: "", description: "", price: 54, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp" },
  { id: "jawa", name: "Jawa", subtitle: "Embers", category: "Fragrance", benefits: "", format: "", description: "", price: 54, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp" },
  { id: "kha", name: "Kha", subtitle: "The Zero Point", category: "Fragrance", benefits: "", format: "", description: "", price: 54, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp" },
];

const categoryPageSections = new Set(["infusions", "skincare", "fragrance", "ceremony", "atmosphere"]);

export default function SignatureRituals() {
  const [products, setProducts] = useState<RitualProduct[]>(fallbackProducts);
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
      const assignments = getSectionAssignments();
      if (pRes.status && pRes.data?.length) {
        const hasField = (obj: any, key: string) => obj !== null && obj !== undefined && key in obj;
        const fbMap = new Map(fallbackProducts.map(f => [f.id, f]));
        const merged = pRes.data.map((p: ApiProduct) => {
          const fb = fbMap.get(p.slug);
          const section = p.homepageSection ? p.homepageSection : (assignments[String(p.id)] || assignments[p.slug] || "");
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
            image: normalizeImagePath(p.image) ?? fb?.image ?? "",
            hoverImage: normalizeImagePath(p.hoverImage) ?? fb?.hoverImage ?? "",
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

  const featuredProducts = products.filter((p) => !p.homepageSection).slice(0, 2);

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, subtitle: product.subtitle, format: product.format });
    openCart();
  };

  return (
    <section id="shop" className="bg-[#FDFAF5] px-6 md:px-36 lg:px-60" style={{ marginTop: "120px", marginBottom: "120px" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center" style={{ marginBottom: "24px" }}>
          <h2 className="text-[#333333] text-[28px] leading-[34px] md:text-[32px] md:leading-[42px] font-[400] tracking-[0.08em]" style={{ fontFamily: '"Tenor Sans", "Tenor Sans Fallback", "Tenor Sans", system-ui, sans-serif' }}>Signature Rituals</h2>
          <p className="text-[#333333] mt-5 text-[16px] leading-[29px] font-[400] max-w-5xl mx-auto" style={{ fontFamily: '"Inter", "Inter Fallback"' }}>A collection of precisely composed formulations honoring the body&apos;s essential cycles: activation and restoration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6" style={{ marginBottom: "120px" }}>
          {featuredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col w-full">
              <Link href={`/product/${product.id}`} className="flex flex-col flex-1">
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                  <SaveButton item={{ id: product.id, name: product.name, price: product.price, image: product.image, subtitle: product.subtitle }} />
                  <div className="relative w-full h-full transition-all duration-500">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className={`object-contain p-8 md:p-12 transition-all duration-500 mix-blend-multiply ${hoveredProduct === product.id && product.hoverImage ? "opacity-0" : "opacity-100"}`}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {product.hoverImage && (
                    <ProductImage
                      src={product.hoverImage}
                      alt={product.name}
                      fill
                      className={`object-cover object-center p-0 transition-all duration-500 ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    )}
                  </div>
                </div>
                <div className="text-center mt-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: '"Inter", "Inter Fallback"' }}>{product.name} | {product.subtitle}</h3>
                    {product.benefits && <p className="mt-3 text-[16px] leading-[24px] font-[400] text-[#666666]" style={{ fontFamily: '"Tenor Sans", sans-serif' }}>{product.benefits}</p>}
                  </div>
                  <div>
                    {product.format && <p className="mx-auto mt-3 text-[16px] leading-[24px] font-[300] text-[#666666]" style={{ fontFamily: "Inter, sans-serif" }}>{product.format}</p>}
                    <p className="mt-3 text-[#666666] text-[20px] leading-[22px] font-[300]" style={{ fontFamily: "Inter, sans-serif" }}>{formatPrice(product.price, currency, exchangeRate)}</p>
                  </div>
                </div>
              </Link>
              <button onClick={() => handleAddToCart(product)} className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center bg-[#333333] text-[#FFFEF2] text-[12px] font-[400] hover:bg-black transition-all duration-300 mx-[0.3rem]" suppressHydrationWarning>Add To Cart</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
