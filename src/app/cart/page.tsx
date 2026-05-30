"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/components/landing/cartStore";
import Navbar from "@/app/components/landing/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);
  const getCount = useCartStore((s) => s.getCount);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    building: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    landmark: "",
    deliveryInstructions: "",
    cardNumber: "0000 0000 0000 0000",
    expiry: "MM / YY",
    cvv: "123",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cartCount = getCount();
  const cartTotal = getTotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputBase = "w-full px-4 py-3 text-sm transition-colors";
  const inputStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid rgba(164,134,98,0.25)",
    color: "#2B2925",
    fontFamily: "var(--font-sans)",
  };
  const inputFocus = "focus:outline-none focus:border-[#A48662]";

  const SectionBadge = ({ num }: { num: string }) => (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs flex-shrink-0"
      style={{ background: "#2B2925", color: "#FFFFFF", fontFamily: "var(--font-sans)" }}
    >
      {num}
    </span>
  );

  return (
    <main className="min-h-screen" style={{ background: "#FFFFFF" }}>
      <Navbar forceScrolled={true} />

      <div className="pt-36 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header Row */}
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] transition-colors cursor-pointer"
              style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              BACK
            </button>
            <p className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>
              SECURE CHECKOUT
            </p>
          </div>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
              Complete Your Order
            </h1>
            <p className="text-sm mt-2" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
              {cartCount} {cartCount === 1 ? "item" : "items"} in your basket
            </p>
          </motion.div>

          {cartCount === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="mb-6">
                <svg className="mx-auto" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "rgba(164,134,98,0.3)" }}>
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p className="mb-6" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                Your ritual cart is empty because you didn&apos;t login before adding items. Please login to view your cart items.
              </p>
              <Link
                href="/#shop"
                className="inline-block px-8 py-4 text-xs tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 500, background: "#262420", color: "#F9F7F3" }}
              >
                Discover the Collection
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

              {/* ─── LEFT: Items + Forms ─── */}
              <div className="lg:col-span-7">

                {/* Items List (compact) */}
                <div className="divide-y" style={{ borderColor: "rgba(164,134,98,0.15)" }}>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="py-3 sm:py-4"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm truncate" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                            {item.name}
                          </p>
                          <p className="text-[11px] sm:text-xs mt-0.5" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>
                            ${item.price}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 transition-colors cursor-pointer self-start mt-1"
                          style={{ color: "#2B2925" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 sm:mt-4 pl-0 sm:pl-20">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs transition-colors cursor-pointer"
                            style={{ border: "1px solid rgba(164,134,98,0.3)", color: "#5A554E" }}
                          >
                            −
                          </button>
                          <span className="w-5 sm:w-6 text-center text-xs sm:text-sm" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs transition-colors cursor-pointer"
                            style={{ border: "1px solid rgba(164,134,98,0.3)", color: "#5A554E" }}
                          >
                            +
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                          ${item.price * item.quantity}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 mb-8 sm:mb-12">
                  <Link
                    href="/#shop"
                    className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] transition-colors cursor-pointer"
                    style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    CONTINUE SHOPPING
                  </Link>
                </div>

                {/* ── Section Divider ── */}
                <div className="border-t mb-8 sm:mb-10" style={{ borderColor: "rgba(164,134,98,0.15)" }} />

                {/* 1. Customer Information */}
                <div className="mb-8 sm:mb-10">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <SectionBadge num="1" />
                    <h2 className="text-base sm:text-lg ml-3" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                      Customer Information
                    </h2>
                  </div>
                  <div className="space-y-4 sm:ml-11">
                    <div>
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                        Full Name <span style={{ color: "#A48662" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`${inputBase} ${inputFocus}`}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                        Phone Number <span style={{ color: "#A48662" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className={`${inputBase} ${inputFocus}`}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                        Email Address <span style={{ color: "rgba(164,134,98,0.5)" }}>(Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className={`${inputBase} ${inputFocus}`}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div className="mb-8 sm:mb-10">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <SectionBadge num="2" />
                    <h2 className="text-base sm:text-lg ml-3" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                      Shipping Address
                    </h2>
                  </div>
                  <div className="space-y-4 sm:ml-11">
                    <div>
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                        House / Flat / Building Number <span style={{ color: "#A48662" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="building"
                        value={formData.building}
                        onChange={handleInputChange}
                        placeholder="e.g. 42, Sunrise Apartments"
                        className={`${inputBase} ${inputFocus}`}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                        Street / Area <span style={{ color: "#A48662" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="e.g. MG Road, Indiranagar"
                        className={`${inputBase} ${inputFocus}`}
                        style={inputStyle}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                          City <span style={{ color: "#A48662" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                          State <span style={{ color: "#A48662" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                          PIN Code <span style={{ color: "#A48662" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                          Country <span style={{ color: "#A48662" }}>*</span>
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`}
                          style={{ ...inputStyle, cursor: "pointer" }}
                        >
                          <option value="India">India</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="UAE">UAE</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "rgba(90,85,78,0.6)" }}>
                        Landmark <span style={{ color: "rgba(164,134,98,0.5)" }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="e.g. Near City Mall"
                        className={`${inputBase} ${inputFocus}`}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "rgba(90,85,78,0.6)" }}>
                        Delivery Instructions <span style={{ color: "rgba(164,134,98,0.5)" }}>(Optional)</span>
                      </label>
                      <textarea
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Leave at the door, ring bell, etc."
                        className={`${inputBase} ${inputFocus}`}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div className="mb-8 sm:mb-10">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <SectionBadge num="3" />
                    <h2 className="text-base sm:text-lg ml-3" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                      Payment Method
                    </h2>
                  </div>
                  <div className="space-y-3 sm:ml-11">
                    {[
                      { key: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, AMEX, RuPay" },
                      { key: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm" },
                      { key: "paypal", label: "PayPal", desc: "Pay securely with PayPal" },
                    ].map((opt) => (
                      <label
                        key={opt.key}
                        className="flex items-center gap-3 p-3.5 cursor-pointer transition-all"
                        style={{
                          border: paymentMethod === opt.key ? "1.5px solid #A48662" : "1px solid rgba(164,134,98,0.15)",
                          background: paymentMethod === opt.key ? "rgba(164,134,98,0.04)" : "transparent",
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === opt.key}
                          onChange={() => setPaymentMethod(opt.key)}
                          style={{ accentColor: "#A48662" }}
                        />
                        <div>
                          <p className="text-sm" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>{opt.label}</p>
                          <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="mt-5 sm:ml-11 space-y-4 p-4" style={{ background: "rgba(164,134,98,0.03)", border: "1px solid rgba(164,134,98,0.1)" }}>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                          Card Number <span style={{ color: "#A48662" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`}
                          style={inputStyle}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                            Expiry Date <span style={{ color: "#A48662" }}>*</span>
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            className={`${inputBase} ${inputFocus}`}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                            CVV <span style={{ color: "#A48662" }}>*</span>
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={`${inputBase} ${inputFocus}`}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Place Order ── */}
                <div className="sm:ml-11 pt-6 border-t" style={{ borderColor: "rgba(164,134,98,0.15)" }}>
                  <button
                    className="w-full bg-[#2B2925] text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 cursor-pointer"
                  >
                    Place Order — ${cartTotal}
                  </button>
                  <p className="text-[11px] text-center mt-3" style={{ fontFamily: "var(--font-sans)", color: "rgba(90,85,78,0.5)" }}>
                    Secure checkout &middot; SSL encrypted
                  </p>
                </div>

              </div>

              {/* ─── RIGHT: Order Summary ─── */}
              <div className="lg:col-span-5">
                <div
                  className="p-5 sm:p-6 lg:p-8 lg:sticky lg:top-28"
                  style={{ background: "rgba(164,134,98,0.04)", border: "1px solid rgba(164,134,98,0.12)" }}
                >
                  <h3 className="text-xs sm:text-sm tracking-[0.25em] uppercase mb-5 sm:mb-6" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid rgba(164,134,98,0.1)" }}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain p-1"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] sm:text-xs truncate" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>{item.name}</p>
                          <p className="text-[10px] sm:text-[11px]" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Qty: {item.quantity}</p>
                        </div>
                        <p className="text-[11px] sm:text-xs whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                          ${item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2" style={{ borderColor: "rgba(164,134,98,0.15)" }}>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Subtotal</span>
                      <span style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>${cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Shipping</span>
                      <span style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t" style={{ borderColor: "rgba(164,134,98,0.15)" }}>
                    <span style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>Total</span>
                    <span className="text-base sm:text-lg" style={{ fontFamily: "var(--font-serif)", color: "#A48662" }}>${cartTotal}</span>
                  </div>

                  <div className="mt-5 sm:mt-6 pt-4 border-t flex items-center justify-center gap-2" style={{ borderColor: "rgba(164,134,98,0.15)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#5A554E" }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span className="text-[10px] sm:text-[11px]" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                      Your information is safe with us
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  );
}
