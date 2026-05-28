"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/components/landing/cartStore";
import { formatPrice, getSettings } from "@/services/settings";

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const primaryItemId = useCartStore((s) => s.primaryItemId);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);
  const getCount = useCartStore((s) => s.getCount);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);

  useEffect(() => {
    getSettings().then(s => { if (s?.currency) setCurrency(s.currency); if (s?.exchange_rate) setExchangeRate(parseFloat(s.exchange_rate)); }).catch(() => {});
  }, []);

  const cartCount = getCount();
  const cartTotal = getTotal();

  const primaryItem = primaryItemId ? items.find(i => i.id === primaryItemId) : (items.length > 0 ? items[items.length - 1] : null);
  const otherItems = primaryItem ? items.filter(i => i.id !== primaryItem.id) : items;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#0F0D0A]/55 backdrop-blur-[2px] z-[10000]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:max-w-[460px] z-[10010] flex flex-col shadow-[-24px_0_70px_rgba(15,13,10,0.18)]"
            style={{ background: "#F8F4ED" }}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-5 border-b" style={{ borderColor: "rgba(164,134,98,0.18)", background: "#FFFFFF" }}>
              <div>
                <div className="mb-1 w-[90px]">
                    <Image
                      src="/Assets/sampriti-logo-transparent.webp"
                      alt="Sampriti"
                      width={590}
                      height={128}
                      className="h-auto w-full"
                    />
                  </div>
                <h2
                  className="text-2xl leading-none"
                  style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
                >
                  Your Ritual Cart
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-10 h-10 flex items-center justify-center rounded-full border transition-colors hover:bg-[#F4F1EA]"
                style={{ color: "#5A554E" }}
                aria-label="Close cart"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-5">
              {cartCount === 0 ? (
                <div className="text-center py-14">
                  <div className="mb-6">
                    <svg
                      className="mx-auto"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      style={{ color: "rgba(164,134,98,0.3)" }}
                    >
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  </div>
                  <p
                    className="mb-4"
                    style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}
                  >
                   Your ritual cart is empty because you didn't login before adding items. Please login to view your cart items.
                  </p>
                  <button
                    onClick={closeCart}
                    className="text-xs tracking-[0.2em] uppercase hover:underline"
                    style={{ color: "#A48662" }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Primary Item - Most Recently Added */}
                  {primaryItem && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <div className="absolute -top-2 left-4 text-[10px] px-3 py-1.5 rounded-full tracking-wide z-10" style={{ fontFamily: "var(--font-sans)", background: "#A48662", color: "#F9F7F3" }}>
                        JUST ADDED
                      </div>
                      <div className="border rounded-lg p-4 pt-6" style={{ borderColor: "rgba(164,134,98,0.2)", background: "#FFFFFF" }}>
                        <div className="flex gap-4 items-center">
                          {/* Image */}
                          <div className="w-24 h-24 rounded-md flex-shrink-0" style={{ background: "#F8F7F5" }}>
                            <Image
                              src={primaryItem.image}
                              alt={primaryItem.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-contain p-2"
                              unoptimized
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <h3
                              className="text-xl leading-snug"
                              style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
                            >
                              {primaryItem.name}
                            </h3>
                            <p
                              className="text-xl mt-2"
                              style={{ fontFamily: "var(--font-serif)", color: "#A48662" }}
                            >
                              {formatPrice(primaryItem.price * primaryItem.quantity, currency, exchangeRate)}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className="text-xs"
                                style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}
                              >
                                Qty: {primaryItem.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Divider */}
                  {otherItems.length > 0 && (
                    <div className="flex items-center gap-4 py-3">
                      <div className="h-px flex-1" style={{ background: "rgba(164,134,98,0.2)" }}></div>
                      <span className="text-xs tracking-[0.16em] uppercase whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                        OTHER ITEMS
                      </span>
                      <div className="h-px flex-1" style={{ background: "rgba(164,134,98,0.2)" }}></div>
                    </div>
                  )}

                  {/* Other Items */}
                  {otherItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b"
                      style={{ borderColor: "rgba(164,134,98,0.2)" }}
                    >
                      {/* Image */}
<div className="w-16 h-16 rounded-md flex-shrink-0" style={{ background: "#F8F7F5" }}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain p-1"
                              unoptimized
                            />
                          </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3
                          className="text-sm"
                          style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}
                        >
                          {item.name}
                        </h3>
                        <p
                          className="text-sm mt-0.5"
                          style={{ fontFamily: "var(--font-serif)", color: "#A48662" }}
                        >
                          {formatPrice(item.price * item.quantity, currency, exchangeRate)}
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="w-5 h-5 border flex items-center justify-center text-xs transition-colors"
                            style={{ borderColor: "rgba(164,134,98,0.3)", color: "#5A554E" }}
                          >
                            -
                          </button>
                          <span
                            className="text-xs"
                            style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-5 h-5 border flex items-center justify-center text-xs transition-colors"
                            style={{ borderColor: "rgba(164,134,98,0.3)", color: "#5A554E" }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="transition-colors self-start"
                        style={{ color: "#5A554E" }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartCount > 0 && (
              <div className="shrink-0 px-5 sm:px-6 py-5 border-t" style={{ borderColor: "rgba(164,134,98,0.2)", background: "#FFFFFF" }}>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-base"
                    style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}
                  >
                    Total ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                  </span>
                  <span
                    className="text-2xl"
                    style={{ fontFamily: "var(--font-serif)", color: "#A48662" }}
                  >
                    {formatPrice(cartTotal, currency, exchangeRate)}
                  </span>
                </div>
                <p
                  className="text-xs mb-5"
                  style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}
                >
                  Shipping & taxes calculated at checkout
                </p>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full py-4 text-xs tracking-[0.24em] uppercase text-center hover:opacity-90 transition-all duration-300"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 600, background: "#262420", color: "#F9F7F3" }}
                >
                  View Your Cart
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full border py-3 text-xs tracking-[0.2em] uppercase text-center mt-3 hover:bg-gray-50 transition-all duration-300"
                  style={{ fontFamily: "var(--font-sans)", borderColor: "rgba(43,41,37,0.2)", color: "#2B2925" }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

