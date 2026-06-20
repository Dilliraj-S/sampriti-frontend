"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/landing/Navbar";
import { useAuthStore } from "@/app/stores/authStore";
import { apiGet } from "@/lib/apiClient";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: number;
  items: OrderItem[];
  total: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:    { label: "Pending",    color: "bg-amber-50 text-amber-700 border-amber-200" },
  processing: { label: "Processing", color: "bg-blue-50 text-blue-700 border-blue-200" },
  shipped:    { label: "Shipped",    color: "bg-purple-50 text-purple-700 border-purple-200" },
  delivered:  { label: "Delivered",  color: "bg-green-50 text-green-700 border-green-200" },
  cancelled:  { label: "Cancelled",  color: "bg-red-50 text-red-600 border-red-200" },
};

function getEstimatedDelivery(createdAt: string): string {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function OrdersPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res: any = await apiGet("/api/auth/my-orders");
        if (res.status) setOrders(res.data || []);
      } catch {} finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

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

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-pulse space-y-4 max-w-md mx-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded" />
                ))}
              </div>
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center py-16">
              <p className="text-[#5A554E] mb-4">Please sign in to view your orders</p>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center bg-[#2B2925] text-white px-8 text-xs tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          ) : orders.length === 0 ? (
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
              {orders.map((order) => {
                const cfg = statusConfig[order.status] || statusConfig.pending;
                return (
                  <div
                    key={order.id}
                    className="border border-gray-100 bg-white p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="font-mono font-semibold text-gray-700">
                          #ORD-{String(order.id).padStart(4, "0")}
                        </span>
                        <span className="text-gray-300 mx-2">|</span>
                        <span className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>

                    <div className="divide-y divide-gray-50">
                      {(order.items || []).slice(0, 3).map((item: OrderItem) => (
                        <div key={item.id} className="flex items-center gap-4 py-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 object-contain bg-white border"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-[#2B2925] font-medium">{item.name}</p>
                            <p className="text-sm text-gray-400">
                              ${item.price} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-[#2B2925]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      {(order.items || []).length > 3 && (
                        <p className="text-sm text-gray-400 pt-2 text-center">
                          +{order.items.length - 3} more item(s)
                        </p>
                      )}
                    </div>

                    {order.status === "shipped" && (
                      <div className="flex items-center gap-2 pt-3 pb-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span className="text-xs text-purple-700 font-medium">Estimated delivery: {getEstimatedDelivery(order.createdAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2">
                      <p className="text-xs text-gray-400">
                        {order.paymentMethod?.toUpperCase()} · {order.paymentStatus}
                      </p>
                      <p className="text-lg font-semibold text-[#2B2925]">
                        ${parseFloat(order.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}