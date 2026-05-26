"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/landing/Navbar";
import { useCartStore } from "@/app/components/landing/cartStore";

interface ShippingZone {
  id: number; name: string; pinCodes: string; rate: string; freeAbove: string; deliveryTime: string; status: string;
}

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);

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
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/admin';
        const res = await fetch(base + '/shipping-zones').then(r => r.json());
        if (res.status) {
          const active = res.data?.filter((z: ShippingZone) => z.status === 'active') || [];
          setShippingZones(active);
          if (active.length > 0) setSelectedZone(active[0].id);
        }
      } catch {}
    })();
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

  const inputBase = "w-full px-4 py-3 text-sm transition-colors";
  const inputStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid rgba(164,134,98,0.25)",
    color: "#2B2925",
    fontFamily: "var(--font-sans)",
  };
  const inputFocus = "focus:outline-none focus:border-[#A48662]";

  return (
    <main className="min-h-screen" style={{ background: "#FFFFFF" }}>
      <Navbar forceScrolled={true} />

      <div className="pt-48 pb-16 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Back Link */}
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

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}>
              SECURE CHECKOUT
            </p>
            <h1 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
              Complete Your Order
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left: Form Sections */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">

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
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`${inputBase} ${inputFocus}`}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                      Phone Number <span style={{ color: "#A48662" }}>*</span>
                    </label>
                    <p className="text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>10-digit mobile number</p>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`${inputBase} ${inputFocus}`}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                      Email Address
                    </label>
                    <p className="text-xs mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Optional</p>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`${inputBase} ${inputFocus}`}
                      style={inputStyle}
                    />
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
                    <input
                      type="text"
                      name="building"
                      value={formData.building}
                      onChange={handleInputChange}
                      className={`${inputBase} ${inputFocus}`}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                      Street / Area <span style={{ color: "#A48662" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`${inputBase} ${inputFocus}`}
                      style={inputStyle}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
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
                      <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
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
                      <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
                        Postal Code (PIN) <span style={{ color: "#A48662" }}>*</span>
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
                      <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
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
                    <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className={`${inputBase} ${inputFocus}`}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      name="deliveryInstructions"
                      value={formData.deliveryInstructions}
                      onChange={handleInputChange}
                      rows={3}
                      className={`${inputBase} ${inputFocus}`}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="mb-10">
                <h2 className="text-xl mb-6" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                  3. Payment Method
                </h2>
                <div className="space-y-4">
                  {/* Credit / Debit Card */}
                  <label
                    className="flex items-center gap-4 p-4 cursor-pointer transition-colors"
                    style={{
                      border: paymentMethod === "card" ? "1px solid #A48662" : "1px solid rgba(164,134,98,0.25)",
                      background: paymentMethod === "card" ? "rgba(164,134,98,0.06)" : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      style={{ accentColor: "#A48662" }}
                    />
                    <div className="flex-1">
                      <p style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>Credit / Debit Card</p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                        Visa, Mastercard, AMEX, RuPay
                      </p>
                    </div>
                  </label>

                  {/* UPI */}
                  <label
                    className="flex items-center gap-4 p-4 cursor-pointer transition-colors"
                    style={{
                      border: paymentMethod === "upi" ? "1px solid #A48662" : "1px solid rgba(164,134,98,0.25)",
                      background: paymentMethod === "upi" ? "rgba(164,134,98,0.06)" : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      style={{ accentColor: "#A48662" }}
                    />
                    <div className="flex-1">
                      <p style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>UPI</p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                        Google Pay, PhonePe, Paytm
                      </p>
                    </div>
                  </label>

                  {/* PayPal */}
                  <label
                    className="flex items-center gap-4 p-4 cursor-pointer transition-colors"
                    style={{
                      border: paymentMethod === "paypal" ? "1px solid #A48662" : "1px solid rgba(164,134,98,0.25)",
                      background: paymentMethod === "paypal" ? "rgba(164,134,98,0.06)" : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      style={{ accentColor: "#A48662" }}
                    />
                    <div className="flex-1">
                      <p style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>PayPal</p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                        Pay securely with PayPal
                      </p>
                    </div>
                  </label>
                </div>

                {/* Card Fields (only when card is selected) */}
                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-5">
                    <div>
                      <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
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
                        <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
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
                        <label className="block text-sm mb-1.5" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>
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

                {/* Place Order Button */}
                <button
                  className="w-full py-4 mt-8 text-xs tracking-[0.2em] uppercase text-[#F9F7F3] hover:opacity-90 transition-all duration-300 cursor-pointer"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 500, background: "#262420" }}
                >
                  Place Order
                </button>
              </div>

            </motion.div>

            {/* Right: Order Summary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <div className="p-6 sticky top-28" style={{ background: "#FFFFFF" }}>
                <h2 className="text-xl mb-6" style={{ fontFamily: "var(--font-serif)", color: "#2B2925" }}>
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => {
                      return (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain p-2"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate" style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => { const s = useCartStore.getState(); const i = s.items.find(x => x.id === item.id); if (i && i.quantity > 1) s.updateQuantity(item.id, i.quantity - 1); }}
                              className="w-7 h-7 flex items-center justify-center border text-sm cursor-pointer hover:bg-gray-50"
                              style={{ borderColor: "rgba(164,134,98,0.25)", color: "#5A554E" }}
                            >−</button>
                            <span className="text-sm w-5 text-center" style={{ color: "#2B2925" }}>{item.quantity}</span>
                            <button
                              onClick={() => { const s = useCartStore.getState(); const i = s.items.find(x => x.id === item.id); if (i) s.updateQuantity(item.id, i.quantity + 1); }}
                              className="w-7 h-7 flex items-center justify-center border text-sm cursor-pointer hover:bg-gray-50"
                              style={{ borderColor: "rgba(164,134,98,0.25)", color: "#5A554E" }}
                            >+</button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-sm whitespace-nowrap" style={{ fontFamily: "var(--font-serif)", color: "#A48662" }}>${item.price * item.quantity}</p>
                          <button
                            onClick={() => useCartStore.getState().removeItem(item.id)}
                            className="text-xs cursor-pointer hover:opacity-60 transition-opacity"
                            style={{ color: "#A48662", fontFamily: "var(--font-sans)" }}
                          >Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between py-2">
                  <span style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Subtotal</span>
                  <span style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>${cartTotal}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>Shipping</span>
                  <span style={{ fontFamily: "var(--font-sans)", color: "#5A554E" }}>
                    {shipping === 0 ? "Free" : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t mt-2 pt-4" style={{ borderColor: "rgba(164,134,98,0.2)" }}>
                  <span style={{ fontFamily: "var(--font-sans)", color: "#2B2925" }}>Total</span>
                  <span className="text-xl" style={{ fontFamily: "var(--font-serif)", color: "#A48662" }}>${total}</span>
                </div>
                <div className="mt-6 pt-4 border-t" style={{ borderColor: "rgba(164,134,98,0.15)" }}>
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 py-3 text-xs tracking-[0.2em] uppercase transition-colors"
                    style={{ fontFamily: "var(--font-sans)", color: "#A48662" }}
                  >
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
        </div>
      </div>
    </main>
  );
}
