"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/landing/Navbar";
import { useCartStore } from "@/app/components/landing/cartStore";
import { useAuthStore } from "@/app/stores/authStore";

interface ShippingZone {
  id: number; name: string; pinCodes: string; rate: string; freeAbove: string; deliveryTime: string; status: string;
}

interface OrderResult {
  orderId: number;
  paypalOrderId?: string;
  total: number;
  currency?: string;
}

type Step = "form" | "paypal" | "processing" | "success" | "error";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace("/api/admin", "");
const ADMIN_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

export default function CheckoutPage() {
  const router           = useRouter();
  const isAuthenticated   = useAuthStore(s => s.isAuthenticated);
  const authLoading       = useAuthStore(s => s.isLoading);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("form");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

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
    if (!authLoading && !isAuthenticated) {
      const encoded = encodeURIComponent("/checkout");
      router.replace("/login?redirect=" + encoded);
      return;
    }
    (async () => {
      try {
        const res = await fetch(ADMIN_API + "/shipping-zones").then(r => r.json());
        if (res.status) {
          const active = res.data?.filter((z: ShippingZone) => z.status === "active") || [];
          setShippingZones(active);
          if (active.length > 0) setSelectedZone(active[0].id);
        }
      } catch {}
    })();
  }, [authLoading, isAuthenticated, router]);

  const handlePaypalApprove = useCallback(async (data: { orderID: string }) => {
    const currentOrderResult = orderResult;
    if (!currentOrderResult) return;
    setStep("processing");

    try {
      const res = await fetch(API + "/api/payments/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: currentOrderResult.orderId,
          paypalOrderId: data.orderID,
        }),
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

  const cartTotal = getTotal();
  const activeZone = shippingZones.find(z => z.id === selectedZone);
  const shipping = activeZone
    ? (parseFloat(activeZone.freeAbove) > 0 && cartTotal >= parseFloat(activeZone.freeAbove) ? 0 : parseFloat(activeZone.rate))
    : 0;
  const total = cartTotal + shipping;

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
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            subtitle: i.subtitle,
            format: i.format,
          })),
          total,
          shipping,
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

  return (
    <main className="min-h-screen" style={{ background: "#FDFAF5" }}>
      <Toaster position="top-center" richColors />
      <Navbar forceScrolled={true} />

      <div className="pt-48 pb-16 px-6">
        <div className="max-w-6xl mx-auto">

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 transition-colors"
              style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span className="text-xs tracking-[0.2em]">BACK TO CART</span>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>
              SECURE CHECKOUT
            </p>
            <h1 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
              {step === "success" ? "Order Confirmed!" : "Complete Your Order"}
            </h1>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === "success" ? (
              <motion.div key="success" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center">
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
                  and payment is confirmed. We&apos;ll send a confirmation to {formData.email || "your email"}.
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
                  <Link href="/account"
                    className="text-xs tracking-[0.2em] uppercase transition-colors hover:opacity-70"
                    style={{ color: "#A48662", fontFamily: "var(--font-sans)" }}>
                    View My Orders
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-5 gap-16">
                <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">

                  {/* 1. Customer Information */}
                  <div className="mb-10">
                    <h2 className="text-xl mb-6" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                      1. Customer Information
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                          Full Name <span style={{ color: "#A48662" }}>*</span>
                        </label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                          Phone Number <span style={{ color: "#A48662" }}>*</span>
                        </label>
                        <p className="text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>10-digit mobile number</p>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                          Email Address
                        </label>
                        <p className="text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Optional</p>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                    </div>
                  </div>

                  {/* 2. Shipping Address */}
                  <div className="mb-10">
                    <h2 className="text-xl mb-6" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                      2. Shipping Address
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                          House / Flat / Building Number <span style={{ color: "#A48662" }}>*</span>
                        </label>
                        <input type="text" name="building" value={formData.building} onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                          Street / Area <span style={{ color: "#A48662" }}>*</span>
                        </label>
                        <input type="text" name="street" value={formData.street} onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                            City <span style={{ color: "#A48662" }}>*</span>
                          </label>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                            className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                        </div>
                        <div>
                          <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                            State <span style={{ color: "#A48662" }}>*</span>
                          </label>
                          <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                            className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                            Postal Code (PIN) <span style={{ color: "#A48662" }}>*</span>
                          </label>
                          <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange}
                            className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                        </div>
                        <div>
                          <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                            Country <span style={{ color: "#A48662" }}>*</span>
                          </label>
                          <select name="country" value={formData.country} onChange={handleInputChange}
                            className={`${inputBase} ${inputFocus}`}
                            style={{ ...inputStyle, cursor: "pointer" }} disabled={step !== "form"}>
                            <option value="India">India</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="UAE">UAE</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                          Landmark (Optional)
                        </label>
                        <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange}
                          className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                          Delivery Instructions (Optional)
                        </label>
                        <textarea name="deliveryInstructions" value={formData.deliveryInstructions} onChange={handleInputChange}
                          rows={3} className={`${inputBase} ${inputFocus}`} style={inputStyle} disabled={step !== "form"} />
                      </div>
                    </div>
                  </div>

                  {/* 3. Payment Method */}
                  <div className="mb-10">
                    <h2 className="text-xl mb-6" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                      3. Payment Method
                    </h2>

                    {step === "form" ? (
                      <>
                        <div className="space-y-4">
                          {[
                            { value: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, AMEX, RuPay" },
                            { value: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm" },
                            { value: "paypal", label: "PayPal", desc: "Pay securely with PayPal" },
                          ].map((pm) => (
                            <label key={pm.value}
                              className="flex items-center gap-4 p-4 cursor-pointer transition-colors"
                              style={{
                                border: paymentMethod === pm.value ? "1px solid #A48662" : "1px solid rgba(164,134,98,0.25)",
                                background: paymentMethod === pm.value ? "rgba(164,134,98,0.06)" : "transparent",
                              }}
                            >
                              <input type="radio" name="payment" checked={paymentMethod === pm.value}
                                onChange={() => setPaymentMethod(pm.value)} style={{ accentColor: "#A48662" }} />
                              <div className="flex-1">
                                <p style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>{pm.label}</p>
                                <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>{pm.desc}</p>
                              </div>
                            </label>
                          ))}
                        </div>

                        <button
                          onClick={placeOrder}
                          disabled={loading}
                          className="w-full py-4 mt-8 text-xs tracking-[0.2em] uppercase text-[#F9F7F3] hover:opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-50"
                          style={{ fontFamily: "var(--font-sans)", fontWeight: 500, background: "#262420" }}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Processing...
                            </span>
                          ) : "Place Order"}
                        </button>
                      </>
                    ) : (
                      <div className="p-6" style={{ background: "rgba(164,134,98,0.04)", border: "1px solid rgba(164,134,98,0.2)" }}>
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
                    )}

                    {step === "processing" && (
                      <div className="mt-8 text-center py-8">
                        <svg className="animate-spin h-8 w-8 mx-auto mb-4" viewBox="0 0 24 24" fill="none" style={{ color: "#A48662" }}>
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p style={{ color: "#5A554E" }}>Processing your payment...</p>
                      </div>
                    )}
                  </div>

                </motion.div>

                {/* Right: Order Summary */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
                  <div className="p-6 sticky top-28" style={{ background: "#FDFAF5" }}>
                    <h2 className="text-xl mb-6" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                      Order Summary
                    </h2>
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64} height={64}
                              className="w-full h-full object-contain p-2"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>{item.name}</p>
                            <p className="text-xs mt-1" style={{ color: "#5A554E" }}>Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm whitespace-nowrap" style={{ fontFamily: "var(--font-serif)", color: "#A48662" }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between py-2">
                      <span style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Subtotal</span>
                      <span style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Shipping</span>
                      <span style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-t mt-2 pt-4" style={{ borderColor: "rgba(164,134,98,0.2)" }}>
                      <span style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>Total</span>
                      <span className="text-xl" style={{ fontFamily: "var(--font-serif)", color: "#A48662" }}>${total.toFixed(2)}</span>
                    </div>
                    <div className="mt-6 pt-4 border-t" style={{ borderColor: "rgba(164,134,98,0.15)" }}>
                      <Link href="/"
                        className="flex items-center justify-center gap-2 py-3 text-xs tracking-[0.2em] uppercase transition-colors"
                        style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
