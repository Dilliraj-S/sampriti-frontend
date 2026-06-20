"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/components/landing/cartStore";
import Navbar from "@/app/components/landing/Navbar";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast, Toaster } from "sonner";

interface OrderResult {
  orderId: number;
  paypalOrderId?: string;
  total: number;
  currency?: string;
}

type Step = "form" | "paypal" | "processing" | "success" | "error";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace("/api/admin", "");

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);
  const getCount = useCartStore((s) => s.getCount);
  const clearCart = useCartStore((s) => s.clearCart);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [step, setStep] = useState<Step>("form");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePaypalApprove = useCallback(async (data: { orderID: string }) => {
    const currentOrderResult = orderResult;
    if (!currentOrderResult) return;
    setStep("processing");

    try {
      const res = await fetch(API + "/api/payments/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: currentOrderResult.orderId, paypalOrderId: data.orderID }),
      });

      const result = await res.json();
      if (!result.status) throw new Error(result.message || "Payment capture failed");

      clearCart();
      setStep("success");
      toast.success("Payment successful! Your order has been placed.");
    } catch (err: any) {
      setErrorMsg(err.message);
      setStep("paypal");
      toast.error(err.message || "Payment failed. Please try again.");
    }
  }, [orderResult, clearCart]);

  const handlePaypalError = useCallback(() => {
    toast.error("PayPal encountered an error. Please try again.");
  }, []);

  const handlePaypalCancel = useCallback(() => {
    toast.warning("Payment was cancelled. You can try again when ready.");
  }, []);

  if (!mounted) return null;

  const cartCount = getCount();
  const cartTotal = getTotal();
  const total = cartTotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!formData.fullName || !formData.phone || !formData.building || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(API + "/api/payments/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo: {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
          },
          shippingAddress: {
            building: formData.building,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
            landmark: formData.landmark,
            deliveryInstructions: formData.deliveryInstructions,
          },
          items: items.map(i => ({
            id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image,
            subtitle: i.subtitle, format: i.format,
          })),
          total,
          shipping: 0,
          paymentMethod: "paypal",
        }),
      });

      const data = await res.json();
      if (!data.status) throw new Error(data.message || "Failed to create order");

      setOrderResult({ orderId: data.data.orderId, total: data.data.total });
      setStep("paypal");
      toast.success("Order created! Complete payment with PayPal below.");
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full px-4 py-3 text-sm transition-colors";
  const inputStyle: React.CSSProperties = {
    background: "#FDFAF5",
    border: "1px solid rgba(164,134,98,0.25)",
    color: "#2B2925",
    fontFamily: "var(--font-sans)",
  };
  const inputFocus = "focus:outline-none focus:border-[#A48662]";

  const SectionBadge = ({ num }: { num: string }) => (
    <span
      className="inline-flex items-center justify-center w-8 h-8 text-xs flex-shrink-0"
      style={{ background: "#2B2925", color: "#FDFAF5", fontFamily: "var(--font-sans)" }}
    >
      {num}
    </span>
  );

  return (
    <main className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Toaster position="top-center" richColors />
      <Navbar forceScrolled={true} />

      <div className="pt-36 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

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
              {step === "success" ? "ORDER CONFIRMED" : "SECURE CHECKOUT"}
            </p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-12">
            <h1 className="text-[32px] leading-[42px] font-[400]" style={{ fontFamily: '"Tenor Sans", "Tenor Sans Fallback", "Tenor Sans", system-ui, sans-serif', color: "#333333" }}>
              {step === "success" ? "Order Confirmed!" : "Complete Your Order"}
            </h1>
            <p className="text-sm mt-2" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
              {step === "success" ? `Order #${orderResult?.orderId}` : `${cartCount} ${cartCount === 1 ? "item" : "items"} in your basket`}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === "success" ? (
              <motion.div key="success" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(76,175,80,0.1)", border: "2px solid rgba(76,175,80,0.3)" }}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-2xl mb-1" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                  Thank You, {formData.fullName}!
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="text-sm mb-8" style={{ color: "#5A554E" }}>
                  Your order <strong style={{ color: "#A48662" }}>#{orderResult?.orderId}</strong> has been placed
                  and payment is confirmed. We&apos;ll send you a confirmation email shortly.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="p-6 mb-8 text-left" style={{ background: "#FDFAF5", border: "1px solid rgba(164,134,98,0.2)", borderRadius: "8px" }}>
                  <div className="flex justify-between items-center pb-4 mb-4" style={{ borderBottom: "1px solid rgba(164,134,98,0.12)" }}>
                    <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "#A48662" }}>Order</span>
                    <span className="text-sm font-mono" style={{ color: "#2B2925" }}>#{orderResult?.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 mb-4" style={{ borderBottom: "1px solid rgba(164,134,98,0.12)" }}>
                    <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "#A48662" }}>Payment</span>
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: "#4CAF50" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                      Confirmed
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "#A48662" }}>Total Paid</span>
                    <span className="text-2xl font-light" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>${Number(orderResult?.total || 0).toFixed(2)}</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  className="flex flex-col items-center gap-3">
                  <Link href="/"
                    className="w-full py-3.5 text-xs tracking-[0.2em] uppercase text-center text-[#F9F7F3] transition-all duration-300 hover:opacity-90"
                    style={{ background: "#262420", fontFamily: "var(--font-sans)" }}>
                    Continue Shopping
                  </Link>
                  <Link href="/account/orders"
                    className="text-xs tracking-[0.2em] uppercase transition-colors hover:opacity-70"
                    style={{ color: "#A48662", fontFamily: "var(--font-sans)" }}>
                    View My Orders
                  </Link>
                </motion.div>
              </motion.div>
            ) : cartCount === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="mb-6">
                  <svg className="mx-auto" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "rgba(164,134,98,0.3)" }}>
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
                <p className="mb-6" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                  Your ritual cart is empty.
                </p>
                <Link href="/#shop" className="inline-block px-8 py-4 text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, background: "#262420", color: "#F9F7F3" }}>
                  Discover the Collection
                </Link>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-7">

                  {/* Items List */}
                  <div className="divide-y" style={{ borderColor: "rgba(164,134,98,0.15)" }}>
                    {items.map((item, index) => (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="py-3 sm:py-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 overflow-hidden">
                            <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-contain" unoptimized />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm truncate" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>{item.name}</p>
                            <p className="text-[11px] sm:text-xs mt-0.5" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>${item.price}</p>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="p-1 transition-colors cursor-pointer self-start mt-1" style={{ color: "#2B2925" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3 sm:mt-4 pl-0 sm:pl-20">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs transition-colors cursor-pointer" style={{ border: "1px solid rgba(164,134,98,0.3)", color: "#5A554E" }}>−</button>
                            <span className="w-5 sm:w-6 text-center text-xs sm:text-sm" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs transition-colors cursor-pointer" style={{ border: "1px solid rgba(164,134,98,0.3)", color: "#5A554E" }}>+</button>
                          </div>
                          <p className="text-xs sm:text-sm" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>${item.price * item.quantity}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 mb-8 sm:mb-12">
                    <Link href="/#shop" className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                      CONTINUE SHOPPING
                    </Link>
                  </div>

                  <div className="border-t mb-8 sm:mb-10" style={{ borderColor: "rgba(164,134,98,0.15)" }} />

                  {/* 1. Customer Information */}
                  <div className="mb-8 sm:mb-10">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <SectionBadge num="1" />
                      <h2 className="text-base sm:text-lg ml-3" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>Customer Information</h2>
                    </div>
                    <div className="space-y-4 sm:ml-11">
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Full Name <span style={{ color: "#A48662" }}>*</span></label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Phone Number <span style={{ color: "#A48662" }}>*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile number" className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Email Address <span style={{ color: "rgba(164,134,98,0.5)" }}>(Optional)</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                    </div>
                  </div>

                  {/* 2. Shipping Address */}
                  <div className="mb-8 sm:mb-10">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <SectionBadge num="2" />
                      <h2 className="text-base sm:text-lg ml-3" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>Shipping Address</h2>
                    </div>
                    <div className="space-y-4 sm:ml-11">
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>House / Flat / Building Number <span style={{ color: "#A48662" }}>*</span></label>
                        <input type="text" name="building" value={formData.building} onChange={handleInputChange} placeholder="e.g. 42, Sunrise Apartments" className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Street / Area <span style={{ color: "#A48662" }}>*</span></label>
                        <input type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="e.g. MG Road, Indiranagar" className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>City <span style={{ color: "#A48662" }}>*</span></label>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                        </div>
                        <div>
                          <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>State <span style={{ color: "#A48662" }}>*</span></label>
                          <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>PIN Code <span style={{ color: "#A48662" }}>*</span></label>
                          <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                        </div>
                        <div>
                          <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Country <span style={{ color: "#A48662" }}>*</span></label>
                          <select name="country" value={formData.country} onChange={handleInputChange} className={`${inputBase} ${inputFocus}`} style={{ ...inputStyle, cursor: "pointer" }} disabled={step !== "form"}>
                            <option value="India">India</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="UAE">UAE</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "rgba(90,85,78,0.6)" }}>Landmark <span style={{ color: "rgba(164,134,98,0.5)" }}>(Optional)</span></label>
                        <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="e.g. Near City Mall" className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "rgba(90,85,78,0.6)" }}>Delivery Instructions <span style={{ color: "rgba(164,134,98,0.5)" }}>(Optional)</span></label>
                        <textarea name="deliveryInstructions" value={formData.deliveryInstructions} onChange={handleInputChange} rows={2} placeholder="Leave at the door, ring bell, etc." className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                    </div>
                  </div>

                  {/* 3. Payment Method */}
                  <div className="mb-8 sm:mb-10">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <SectionBadge num="3" />
                      <h2 className="text-base sm:text-lg ml-3" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>Payment Method</h2>
                    </div>

                    {step === "form" ? (
                      <>
                        <div className="space-y-3 sm:ml-11">
                          {[
                            { key: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, AMEX, RuPay" },
                            { key: "paypal", label: "PayPal", desc: "Pay securely with PayPal" },
                            { key: "upi", label: "UPI", desc: "Google Pay" },
                          ].map((opt) => (
                            <label key={opt.key} className="flex items-center gap-3 p-3.5 cursor-pointer transition-all" style={{
                              border: paymentMethod === opt.key ? "1.5px solid #A48662" : "1px solid rgba(164,134,98,0.15)",
                              background: paymentMethod === opt.key ? "rgba(164,134,98,0.04)" : "transparent",
                            }}>
                              <input type="radio" name="payment" checked={paymentMethod === opt.key} onChange={() => setPaymentMethod(opt.key)} style={{ accentColor: "#A48662" }} />
                              <div>
                                <p className="text-sm" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>{opt.label}</p>
                                <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>{opt.desc}</p>
                              </div>
                            </label>
                          ))}
                        </div>

                        <div className="sm:ml-11 pt-6 border-t mt-6" style={{ borderColor: "rgba(164,134,98,0.15)" }}>
                          <button
                            onClick={placeOrder}
                            disabled={loading}
                            className="w-full bg-[#2B2925] text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 cursor-pointer disabled:opacity-50"
                          >
                            {loading ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Processing...
                              </span>
                            ) : `Place Order — $${cartTotal}`}
                          </button>
                          <p className="text-[11px] text-center mt-3" style={{ fontFamily: "var(--font-sans)", color: "rgba(90,85,78,0.5)" }}>
                            Secure checkout &middot; SSL encrypted
                          </p>
                        </div>
                      </>
                    ) : step === "paypal" ? (
                      <div className="sm:ml-11 p-6" style={{ background: "rgba(164,134,98,0.04)", border: "1px solid rgba(164,134,98,0.2)" }}>
                        <p className="text-sm mb-4 text-center" style={{ color: "#2B2925" }}>
                          Complete payment to confirm your order
                        </p>
                        <PayPalScriptProvider
                          options={{
                            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
                            currency: "USD",
                            intent: "capture",
                          }}
                        >
                          <PayPalButtons
                            style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                            createOrder={async () => {
                              const res = await fetch(API + "/api/payments/paypal/create-paypal-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ orderId: orderResult?.orderId }),
                              });
                              const data = await res.json();
                              if (!data.status) throw new Error(data.message || "Failed to create PayPal order");
                              setOrderResult(prev => prev ? { ...prev, paypalOrderId: data.data.paypalOrderId } : prev);
                              return data.data.paypalOrderId;
                            }}
                            onApprove={handlePaypalApprove}
                            onError={handlePaypalError}
                            onCancel={handlePaypalCancel}
                          />
                        </PayPalScriptProvider>
                        {errorMsg && (
                          <p className="text-xs mt-3 text-center" style={{ color: "#dc2626" }}>{errorMsg}</p>
                        )}
                      </div>
                    ) : step === "processing" ? (
                      <div className="sm:ml-11 text-center py-8">
                        <svg className="animate-spin h-8 w-8 mx-auto mb-4" viewBox="0 0 24 24" fill="none" style={{ color: "#A48662" }}>
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p style={{ color: "#5A554E" }}>Processing your payment...</p>
                      </div>
                    ) : null}
                  </div>

                </div>

                {/* RIGHT: Order Summary */}
                <div className="lg:col-span-5">
                  <div className="p-5 sm:p-6 lg:p-8 lg:sticky lg:top-28" style={{ background: "rgba(164,134,98,0.04)", border: "1px solid rgba(164,134,98,0.12)" }}>
                    <h3 className="text-xs sm:text-sm tracking-[0.25em] uppercase mb-5 sm:mb-6" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>
                      Order Summary
                    </h3>
                    <div className="space-y-3 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden" style={{ background: "#FDFAF5", border: "1px solid rgba(164,134,98,0.1)" }}>
                            <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-contain p-1" unoptimized />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] sm:text-xs truncate" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>{item.name}</p>
                            <p className="text-[10px] sm:text-[11px]" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Qty: {item.quantity}</p>
                          </div>
                          <p className="text-[11px] sm:text-xs whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>${item.price * item.quantity}</p>
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
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
