"use client";

import Link from "next/link";
import { useCartStore } from "@/app/components/landing/cartStore";
import SaveButton from "@/app/components/landing/SaveButton";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import ProductImage from "@/app/components/landing/ProductImage";
import { normalizeImagePath } from "@/app/utils/normalizeImagePath";

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  subtitle?: string;
  price?: string | number;
  image?: string;
  hoverImage?: string;
  description?: string;
  homepageSection?: string;
  createdAt: string;
};

type DisplayProduct = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  hoverImage: string;
  description?: string;
};

const fallbackProducts: DisplayProduct[] = [
  { slug: "parjanya", name: "Parjanya", subtitle: "The First Rain", price: 54, image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", description: "First rain fragrance captured in botanical form." },
  { slug: "jawa", name: "Jawa", subtitle: "Embers", price: 54, image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", description: "Warm ember fragrance for deep atmosphere." },
  { slug: "kha", name: "Kha", subtitle: "The Zero Point", price: 54, image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", description: "Zero point fragrance of stillness." },
];

const fragranceSlugs = new Set(["parjanya", "jawa", "kha"]);

export default function RecommendedReading() {
  const [products, setProducts] = useState<DisplayProduct[]>(fallbackProducts);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [pRes, settings] = await Promise.all([
        api.get<ApiProduct[]>("/products"),
        getSettings().catch(() => ({ currency: "INR", exchange_rate: "85" })),
      ]);
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      if (pRes.status && pRes.data?.length) {
        const fbMap = new Map(fallbackProducts.map(f => [f.slug, f]));
        const apiProducts = pRes.data
          .filter((p: ApiProduct) => fragranceSlugs.has(p.slug))
          .map((p: ApiProduct) => {
            const fb = fbMap.get(p.slug);
            return {
              slug: p.slug,
              name: p.name,
              subtitle: p.subtitle || "",
              price: parseFloat(String(p.price || 0)) || 0,
              image: normalizeImagePath(p.image) || fb?.image || "",
              hoverImage: normalizeImagePath(p.hoverImage) || fb?.hoverImage || "",
              description: p.description || fb?.description || "",
            };
          });
        if (apiProducts.length === 3) setProducts(apiProducts);
      }
    })();
  }, []);

  if (!products.length) return null;

  return (
    <section className="bg-[#FDFAF5] px-6 md:px-12 lg:px-20" style={{ marginBottom: "120px" }}>
      <div className="text-center" style={{ marginBottom: "60px" }}>
        <h2 className="text-[#333333] text-[28px] leading-[34px] md:text-[32px] md:leading-[42px] font-[400]" style={{ fontFamily: '"Tenor Sans", "Tenor Sans Fallback", "Tenor Sans", system-ui, sans-serif' }}>Botanical Attars</h2>
      </div>
      <div className="grid grid-cols-1 gap-10 md:relative md:left-1/2 md:w-screen md:-translate-x-1/2 md:grid-cols-3 md:gap-x-4 md:gap-y-16 md:px-16 lg:px-24">
        {products.map((p) => {
          const slugKey = p.slug;
          return (
            <div key={slugKey} className="group flex flex-col h-full w-full">
              <Link href={`/product/${slugKey}`} className="flex flex-col flex-1 cursor-pointer" onMouseEnter={() => setHoveredProduct(slugKey)} onMouseLeave={() => setHoveredProduct(null)}>
                <div
                  className="relative flex mx-auto w-full aspect-square shrink-0 items-center justify-center overflow-hidden bg-white pointer-events-none"
                  draggable={false}
                >
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
                    <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: '"Inter", "Inter Fallback"' }}>{p.name}</h3>
                    {p.subtitle && <p className="mt-3 text-[16px] leading-[24px] font-[400] text-[#666666]" style={{ fontFamily: '"Tenor Sans", sans-serif' }}>{p.subtitle}</p>}
                    {p.description && <p className="mx-auto mt-3 text-[16px] leading-[24px] font-[300] text-[#666666]" style={{ fontFamily: "Inter, sans-serif" }}>{p.description}</p>}
                  </div>
                  <p className="mt-3 text-[#666666] text-[20px] leading-[22px] font-[300]" style={{ fontFamily: "Inter, sans-serif" }}>{formatPrice(p.price, currency, exchangeRate)}</p>
                </div>
              </Link>
              <button
                onClick={() => { addItem({ id: slugKey, name: p.name, subtitle: p.subtitle, price: p.price, quantity: 1, image: p.image }); openCart(); }}
                className="mt-4 flex h-11 w-full items-center justify-center bg-[#333333] text-[#FFFEF2] text-[12px] font-[400] hover:bg-black transition-all duration-300 mx-[0.3rem] cursor-pointer"
                suppressHydrationWarning
              >
                Add To Cart
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
