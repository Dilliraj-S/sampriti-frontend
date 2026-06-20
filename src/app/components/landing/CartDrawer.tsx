"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/components/landing/cartStore";
import { useAuthStore } from "@/app/stores/authStore";
import { formatPrice, getSettings } from "@/services/settings";

const suggestionProducts = [
  { id: "shakti-peya", name: "Shakti Peya", subtitle: "Energy Elixir", format: "9 Test Tube Kit", price: 54, image: "/assets/shakti peya product hd.webp" },
  { id: "vatari", name: "Vatari", subtitle: "Botanical Botox", format: "Botanical Profile", price: 48, image: "/assets/hibiscus hd.webp" },
  { id: "parjanya", name: "Parjanya", subtitle: "The First Rain", format: "Botanical Profile", price: 54, image: "/assets/hibiscus hover.webp" },
  { id: "the-sahane", name: "The Sahane", subtitle: "Stone", format: "", price: 36, image: "/assets/rose hd.webp" },
  { id: "sandalwood-shavings", name: "Sandalwood Shavings", subtitle: "Mysore Sandalwood", format: "", price: 28, image: "/assets/blue butterfly pea hd.webp" },
];

type SuggestionProduct = (typeof suggestionProducts)[number];

function QuantityStepper({ quantity, onMinus, onPlus, compact = false }: { quantity: number; onMinus: () => void; onPlus: () => void; compact?: boolean }) {
  return (
    <div className={`grid grid-cols-3 items-center border bg-white ${compact ? "h-10 w-[78px]" : "h-[34px] w-[116px]"}`} style={{ borderColor: "#D9D4CB" }}>
      <button type="button" onClick={onMinus} className="h-full text-[15px] text-[#1F1E1B] cursor-pointer" aria-label="Decrease quantity">-</button>
      <span className="text-center text-[15px] text-[#3D3A35]">{quantity}</span>
      <button type="button" onClick={onPlus} className="h-full text-[15px] font-medium text-[#1F1E1B] cursor-pointer" aria-label="Increase quantity">+</button>
    </div>
  );
}

export default function CartDrawer() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const primaryItemId = useCartStore((s) => s.primaryItemId);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const getCount = useCartStore((s) => s.getCount);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const [view, setView] = useState<"added" | "full">("full");
  const prevPrimaryItemId = useRef<string | null>(null);
  const prevItemsLength = useRef(0);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const handleCheckout = () => {
    closeCart();
    if (isAuthenticated) {
      window.location.href = "/cart";
    } else {
      window.location.href = "/login?redirect=%2Fcart";
    }
  };

  useEffect(() => {
    getSettings().then((s) => { if (s?.currency) setCurrency(s.currency); if (s?.exchange_rate) setExchangeRate(parseFloat(s.exchange_rate)); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % suggestionProducts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const primaryChanged = primaryItemId && primaryItemId !== prevPrimaryItemId.current;
    const itemsIncreased = items.length > prevItemsLength.current;
    if (primaryChanged && itemsIncreased && items.length > 0) {
      setView("added");
    } else {
      setView("full");
    }
    prevPrimaryItemId.current = primaryItemId;
    prevItemsLength.current = items.length;
  }, [isOpen, primaryItemId, items.length]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const cartCount = getCount();
  const cartTotal = getTotal();
  const primaryItem = primaryItemId ? items.find((i) => i.id === primaryItemId) : null;

  const suggestions = [...suggestionProducts.slice(suggestionIndex), ...suggestionProducts.slice(0, suggestionIndex)].slice(0, 5);

  const handleAddSuggestion = (product: SuggestionProduct) => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, subtitle: product.subtitle, format: product.format });
    openCart();
  };

  const shippingRemainder = Math.max(0, 51 - cartTotal);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[10000] bg-[#171511]/55"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && view === "added" && primaryItem && (
          <motion.section
            key="added-popup"
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-[10010] flex max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-[563px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden bg-white shadow-[0_20px_60px_rgba(15,13,10,0.16)]"
            aria-modal="true"
            role="dialog"
          >
            <button type="button" onClick={closeCart} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-[#2C2A26] transition-opacity hover:opacity-60 cursor-pointer" aria-label="Close">
              <span className="text-[28px] leading-none">&times;</span>
            </button>

            <div className="overflow-y-auto px-6 pb-8 pt-12 sm:px-[45px]">
              <h2 className="text-center text-[18px] font-normal tracking-[0.13em] text-[#3A3833]">Added to your cart</h2>

              <div className="mt-9 grid grid-cols-[78px_1fr_auto] items-center gap-7">
                <div className="flex h-[75px] w-[78px] items-center justify-center bg-[#FBF7E9]">
                  <Image src={primaryItem.image} alt={primaryItem.name} width={78} height={75} className="h-full w-full object-contain p-2" unoptimized />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[16px] tracking-[0.04em] text-[#3A3833]">
                    {primaryItem.name}{primaryItem.subtitle ? ` | ${primaryItem.subtitle}` : ""}
                  </h3>
                  <p className="mt-3 text-[16px] text-[#77716B]">{formatPrice(primaryItem.price, currency, exchangeRate)}</p>
                  <div className="mt-4">
                    <QuantityStepper
                      quantity={primaryItem.quantity}
                      onMinus={() => updateQuantity(primaryItem.id, Math.max(1, primaryItem.quantity - 1))}
                      onPlus={() => updateQuantity(primaryItem.id, primaryItem.quantity + 1)}
                    />
                  </div>
                </div>
                <p className="self-center whitespace-nowrap text-[20px] font-semibold text-[#34312D]">
                  {formatPrice(primaryItem.price * primaryItem.quantity, currency, exchangeRate)}
                </p>
              </div>

              <div className="my-9 h-px bg-[#E5E0D6]" />

              <button
                type="button"
                onClick={() => setView("full")}
                className="flex h-[54px] w-full items-center justify-center bg-[#333230] text-[14px] font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
              >
                View your cart
              </button>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 flex h-[54px] w-full items-center justify-center border border-[#E1DDD5] bg-white text-[14px] tracking-[0.04em] text-[#4B4742] transition-colors hover:bg-[#FDFAF5] cursor-pointer"
              >
                Continue shopping
              </button>

              {suggestions.length > 0 && (
                <div className="mt-8">
                  <p className="mb-5 text-center text-[16px] tracking-[0.04em] text-[#403D38]">Others also considered</p>
                  <div className="overflow-x-auto scrollbar-gradient w-full pb-3">
                    <div className="flex gap-4 w-max">
                      {suggestions.map((product) => (
                        <div key={product.id} className="w-[96px] shrink-0 border border-[#EBE7DF] bg-white px-1.5 pt-2 text-center flex flex-col">
                          <Link href={`/product/${product.id}`} onClick={closeCart} className="block cursor-pointer">
                            <span className="block h-[68px] bg-[#FBF7E9]">
                              <Image src={product.image} alt={product.name} width={96} height={68} className="h-full w-full object-contain p-1.5" unoptimized />
                            </span>
                          </Link>
                          <Link href={`/product/${product.id}`} onClick={closeCart} className="block cursor-pointer">
                            <span className="mt-2 line-clamp-2 text-[11px] leading-[1.4] text-[#37342F] hover:text-[#171511]">{product.name} | {product.subtitle}</span>
                          </Link>
                          <span className="mt-auto block text-[11px] text-[#77716B] pt-2">{formatPrice(product.price, currency, exchangeRate)}</span>
                          <button type="button" onClick={() => handleAddSuggestion(product)} className="mt-2 mb-3 w-full py-1.5 text-[10px] tracking-[0.05em] bg-[#302F2D] text-white transition-opacity hover:opacity-90 cursor-pointer">
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && view === "full" && (
          <motion.aside
            key="full-cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[10010] flex h-[100dvh] w-full max-w-[505px] flex-col bg-[#FFFDF1] shadow-[-24px_0_60px_rgba(15,13,10,0.18)]"
            aria-modal="true"
            role="dialog"
          >
            <header className="flex h-[102px] shrink-0 items-center justify-between border-b border-[#E6E1D6] px-7">
              <h2 className="text-[19px] font-normal tracking-[0.08em] text-[#211F1C]">Your Cart</h2>
              <button type="button" onClick={closeCart} className="flex h-9 w-9 items-center justify-center text-[#101010] transition-opacity hover:opacity-60 cursor-pointer" aria-label="Close cart">
                <span className="text-[28px] leading-none">&times;</span>
              </button>
            </header>

            {cartCount > 0 && (
              <div className="shrink-0 border-b border-[#E6E1D6] px-7 py-7">
                <p className="text-[16px] tracking-[0.02em] text-[#322E28]">
                  {shippingRemainder > 0
                    ? `Spend ${formatPrice(shippingRemainder, currency, exchangeRate)} more to enjoy complimentary shipping.`
                    : "Enjoy complimentary shipping on this order."}
                </p>
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-7 py-7">
              {cartCount === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8A847C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <p className="mt-5 text-[17px] tracking-[0.04em] text-[#5A554E]">Your ritual cart is empty.</p>
                  <button type="button" onClick={closeCart} className="mt-8 border border-[#D9D4CB] bg-white px-10 py-3.5 text-[14px] tracking-[0.04em] text-[#34312D] transition-colors hover:bg-[#FDFAF5] cursor-pointer">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-7">
                    {items.map((item) => (
                      <div key={item.id} className="grid grid-cols-[90px_1fr_auto] gap-6 border-b border-[#E6E1D6] pb-7">
                        <div className="flex h-[114px] w-[90px] items-center justify-center bg-[#FBF7E9]">
                          <Image src={item.image} alt={item.name} width={90} height={114} className="h-full w-full object-contain p-2" unoptimized />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[16px] leading-[1.7] tracking-[0.04em] text-[#171511]">
                            {item.name}{item.subtitle ? ` | ${item.subtitle}` : ""}
                          </h3>
                          {item.format && <p className="mt-2 text-[15px] text-[#77716B]">{item.format}</p>}
                          <div className="mt-5">
                            <QuantityStepper
                              compact
                              quantity={item.quantity}
                              onMinus={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              onPlus={() => updateQuantity(item.id, item.quantity + 1)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <p className="whitespace-nowrap text-[16px] text-[#201E1B]">{formatPrice(item.price * item.quantity, currency, exchangeRate)}</p>
                          <button type="button" onClick={() => removeItem(item.id)} className="text-[14px] text-[#5E5952] underline underline-offset-2 transition-colors hover:text-[#201E1B] cursor-pointer">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {suggestions.length > 0 && (
                    <div className="mt-16 border-t border-[#E6E1D6] pt-9">
                      <p className="mb-6 text-[16px] tracking-[0.08em] text-[#211F1C]" style={{ fontFamily: "var(--font-serif)" }}>You may also like</p>
                      <div className="overflow-x-auto scrollbar-gradient w-full pb-3">
                        <div className="flex gap-4 w-max">
                          {suggestions.map((product) => (
                            <div key={product.id} className="w-[120px] shrink-0">
                              <Link href={`/product/${product.id}`} onClick={closeCart}>
                                <div className="flex h-[120px] items-center justify-center bg-white">
                                  <Image src={product.image} alt={product.name} width={120} height={120} className="h-full w-full object-contain p-2" unoptimized />
                                </div>
                              </Link>
                              <Link href={`/product/${product.id}`} onClick={closeCart} className="block cursor-pointer">
                                <p className="mt-2 line-clamp-2 min-h-[36px] text-[12px] font-normal leading-[1.45] text-[#2C2A26]">{product.name} | {product.subtitle}</p>
                              </Link>
                              <p className="mt-1 text-[11px] text-[#77716B]">{formatPrice(product.price, currency, exchangeRate)}</p>
                              <button type="button" onClick={() => handleAddSuggestion(product)} className="mt-2 flex h-8 w-full items-center justify-center bg-[#333333] text-[11px] font-normal text-[#FFFEF2] transition-all duration-300 hover:bg-black cursor-pointer">
                                Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {cartCount > 0 && (
              <footer className="shrink-0 border-t border-[#E6E1D6] bg-[#FFFDF1] px-7 pb-7 pt-6">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-[18px] text-[#3B3732]">Subtotal</span>
                  <span className="text-[20px] text-[#171511]">{formatPrice(cartTotal, currency, exchangeRate)}</span>
                </div>
                <button type="button" onClick={handleCheckout} className="flex h-[54px] w-full cursor-pointer items-center justify-center bg-[#302F2D] text-[14px] font-semibold text-white transition-opacity hover:opacity-90">
                  Checkout
                </button>
              </footer>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-gradient::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-gradient::-webkit-scrollbar-track {
          background: #E8E4DC;
          border-radius: 2px;
        }
        .scrollbar-gradient::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #FDFAF5 0%, #333230 50%, #FDFAF5 100%);
          border-radius: 2px;
        }
        .scrollbar-gradient {
          scrollbar-width: thin;
          scrollbar-color: #333230 #E8E4DC;
        }
      `}</style>
    </>
  );
}
