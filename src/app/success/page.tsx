"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) setOrderId(token);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFAF5]">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-light tracking-[0.08em] text-[#2C2A26] mb-2">Payment Successful</h1>
        <p className="text-[#6C6258] text-sm mb-8">
          {orderId ? `PayPal Order: ${orderId}` : "Your payment has been processed."}
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-[#2C2A26] text-white text-sm tracking-[0.08em] hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
