"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCartStore } from "@/app/components/landing/cartStore";
import SaveButton from "@/app/components/landing/SaveButton";
import { formatPrice, getSettings } from "@/services/settings";
import { api } from "@/services/api.client";
import ProductImage from "@/app/components/landing/ProductImage";

type ApiProduct = {
  slug: string;
  name: string;
  subtitle?: string;
  price?: string | number;
  image?: string;
  hoverImage?: string;
  description?: string;
};

const fallbackData = {
  id: "black-turmeric",
  name: "Black Turmeric",
  subtitle: "Curcuma Caesia",
  price: 45,
  image: "/assets/black turmeric hd.webp",
  hoverImage: "/assets/black turmeric hover.webp",
  description: "A rare Kaya Kalpa agent for profound recovery and cellular longevity.",
};

export default function BlackTurmericSection() {
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [product, setProduct] = useState(fallbackData);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    (async () => {
      const [settings, pRes] = await Promise.all([
        getSettings().catch(() => ({ currency: "INR", exchange_rate: "85" })),
        api.get<ApiProduct>("/products/slug/black-turmeric").catch(() => ({ status: false } as { status: boolean })),
      ]);
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      if (pRes.status && "data" in pRes && pRes.data) {
        const d = pRes.data;
        setProduct({
          id: "black-turmeric",
          name: d.name ?? fallbackData.name,
          subtitle: d.subtitle ?? fallbackData.subtitle,
          price: d.price !== undefined ? parseFloat(String(d.price)) || 0 : fallbackData.price,
          image: d.image ?? fallbackData.image,
          hoverImage: d.hoverImage ?? fallbackData.hoverImage,
          description: d.description ?? fallbackData.description,
        });
      }
    })();
  }, []);

  return (
    <div className="md:-ml-12 lg:-ml-20 flex flex-col md:flex-row md:items-stretch" style={{ marginBottom: "60px" }}>
      <div className="relative overflow-hidden md:w-1/2">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/5 via-black/5 to-black/15 md:bg-gradient-to-r md:from-black/5 md:via-transparent md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-20 flex px-8 pb-8 pt-6 md:inset-y-0 md:left-0 md:right-6 lg:right-8 md:items-end md:pl-20 lg:pl-28 md:pb-24">
          <div className="max-w-[19rem] md:max-w-none mt-12 md:mt-16">
            <h2 className="text-white text-[28px] leading-[38px] md:text-[32px] md:leading-[42px] md:text-white font-[400] md:font-[400] mb-3" style={{ fontFamily: '"Tenor Sans", "Tenor Sans Fallback", "Tenor Sans", system-ui, sans-serif' }}> 
              A rare botanical phenomenon
            </h2>
            <p className="text-white/85 text-[14px] md:text-[15px] leading-[20px] md:leading-[26px] font-[400] md:font-[400]">
              With Black Turmeric, the subterranean titan of Siddha medicine takes its deserved turn in the spotlight&mdash;with an uncompromising gesture in deep muscle and joint recovery.
            </p>
            <Link
              href="/category/infusions"
              className="mt-5 inline-flex h-11 items-center justify-center border border-white/70 bg-black/25 px-7 text-[12px] leading-[22px] tracking-[0.2em] font-[400] text-[rgb(255,254,242)] backdrop-blur-sm transition-colors duration-300 hover:bg-[#2C2A26]"
              style={{ fontFamily: '"Inter", "Inter Fallback"' }}
            >
              Explore Black Turmeric
            </Link>
          </div>
        </div>
        <Image
          src="/assets/Black Turmeric Side display.webp"
          alt="Black Turmeric"
          width={600}
          height={900}
          className="w-full h-auto object-contain"
          sizes="50vw"
        />
      </div>
      <div className="group flex flex-col px-6 py-6 md:py-0 md:w-1/2 md:pl-3 lg:pl-4 md:pr-3 lg:pr-4 md:px-0 md:justify-center">
        <div className="flex flex-col w-full md:max-w-[45%] md:mx-auto">
        <Link href="/product/black-turmeric" className="block">
          <div className="relative mb-3 flex mx-auto w-full aspect-square shrink-0 items-center justify-center overflow-hidden bg-white" onMouseEnter={() => setHoveredProduct("black-turmeric")} onMouseLeave={() => setHoveredProduct(null)}>
            <SaveButton item={{ id: "black-turmeric", name: product.name, price: product.price, image: product.image, subtitle: product.subtitle }} />
            <ProductImage
              src={product.image}
              alt="Black Turmeric"
              fill
              className={`object-contain p-0 transition-all duration-500 mix-blend-multiply ${hoveredProduct === "black-turmeric" ? "opacity-0" : "opacity-100"}`}
              sizes="33vw"
            />
            <ProductImage
              src={product.hoverImage}
              alt="Black Turmeric"
              fill
              className={`object-cover object-center p-0 transition-all duration-500 ${hoveredProduct === "black-turmeric" ? "opacity-100" : "opacity-0"}`}
              sizes="33vw"
            />
          </div>
          <div className="text-center" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
            <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: '"Inter", "Inter Fallback"' }}>{product.name}</h3>
            <p className="mt-3 text-[16px] leading-[24px] font-[400] text-[#666666]" style={{ fontFamily: '"Tenor Sans", sans-serif', overflowWrap: "break-word", wordBreak: "break-word" }}>{product.subtitle}</p>
            <p className="mx-auto mt-3 text-[16px] leading-[24px] font-[300] text-[#666666] line-clamp-2" style={{ fontFamily: "Inter, sans-serif", overflowWrap: "break-word", wordBreak: "break-word" }}>{product.description}</p>
            <p className="mt-3 text-[#333333] text-[16px] leading-[22px] font-[400]" style={{ fontFamily: "Inter, sans-serif" }}>{formatPrice(product.price, currency, exchangeRate)}</p>
          </div>
        </Link>
        <button onClick={() => { addItem({ id: "black-turmeric", name: product.name, subtitle: product.subtitle, format: "", price: product.price, quantity: 1, image: product.image }); openCart(); }} className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center bg-[#333333] text-[#FFFEF2] text-[12px] font-[400] hover:bg-black transition-all duration-300 mx-[0.3rem]" suppressHydrationWarning>Add To Cart</button>
        </div>
      </div>
    </div>
  );
}
