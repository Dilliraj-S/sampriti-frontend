"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/landing/Navbar";
import { useCartStore } from "@/app/components/landing/cartStore";

export default function OrdersPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled />

      <div className="pt-44 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 border border-[#2B2925] bg-white px-5 py-3 text-[#2B2925] hover:bg-[#2B2925] hover:text-white transition-all duration-300 text-sm tracking-[0.2em] font-medium mb-10 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            BACK
          </button>

          <div className="text-center mb-12">
            <h1
              className="text-[#2B2925] text-4xl md:text-5xl font-light"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              My Orders
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#5A554E] mb-6">No orders yet</p>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center bg-[#2B2925] text-white px-8 text-xs tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 cursor-pointer"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 md:gap-6 md:p-6 bg-white"
                >
                  <Link href={`/product/${item.id}`} className="w-24 h-24 md:w-28 md:h-28 bg-white shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={112}
                      height={112}
                      className="w-full h-full object-contain p-3"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col justify-center">
                    <Link href={`/product/${item.id}`}>
                      <h3
                        className="text-[#2B2925] text-lg md:text-xl mb-1 hover:text-[#A48662] transition-colors"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-[#A48662] text-sm mb-1">
                      ${item.price} × {item.quantity}
                    </p>
                    <p className="text-[#2B2925] text-base font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-6 text-right">
                <p className="text-[#2B2925] text-xl font-light">
                  Total: ${items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
