"use client";
import { ShoppingCart, Search, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { getSettings, formatPrice } from "@/services/settings";

interface Order { id: number; customerId: number; items: any; total: string; status: string; paymentMethod: string; paymentStatus: string; createdAt: string; customer?: { id: number; name: string; email: string; }; }

const statusColors: Record<string, string> = {
  delivered: "bg-green-50 text-green-700", processing: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700", pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);

  const load = async () => {
    setLoading(true);
    const [res, sRes] = await Promise.all([api.get<Order[]>("/orders"), getSettings()]);
    if (res.status) setOrders(res.data || []);
    if (sRes?.currency) setCurrency(sRes.currency);
    if (sRes?.exchange_rate) setExchangeRate(parseFloat(sRes.exchange_rate));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    const res = await api.put(`/orders/${id}/status`, { status });
    if (res.status) load(); else alert(res.message);
  };

  const filtered = orders.filter(o =>
    o.id?.toString().includes(search) || o.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = (s: string) => orders.filter(o => o.status === s).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Order Management</h1><p className="text-sm text-gray-500 mt-1">Track and manage customer orders</p></div>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">{Array.from({length:5}).map((_,i) => <div key={i} className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5"><div className="animate-pulse bg-gray-100 h-8 w-12 rounded mb-2" /><div className="animate-pulse bg-gray-100 h-3 w-16 rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[{label:"Total",val:orders.length,clr:"text-gray-900"},{label:"Pending",val:stats("pending"),clr:"text-amber-500"},{label:"Processing",val:stats("processing"),clr:"text-blue-600"},{label:"Delivered",val:stats("delivered"),clr:"text-green-600"},{label:"Cancelled",val:stats("cancelled"),clr:"text-red-500"}].map(s => (
            <div key={s.label} className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5"><p className={`text-2xl md:text-3xl font-black ${s.clr}`}>{s.val}</p><p className="text-[10px] md:text-xs text-gray-500 mt-1">{s.label}</p></div>
          ))}
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="text-base font-bold text-gray-800">All Orders</h2>
          <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 w-52 text-black" /></div>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50/60">{["Order ID", "Customer", "Items", "Total", "Date", "Status", "Actions"].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(o => (
              <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-mono font-semibold text-gray-700">#ORD-{String(o.id).padStart(4,"0")}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{o.customer?.name || "Guest"}</td>
                <td className="px-6 py-4 text-gray-500">{Array.isArray(o.items) ? o.items.length : 0}</td>
                <td className="px-6 py-4 font-bold text-green-700">{formatPrice(parseFloat(o.total || "0"), currency, exchangeRate)}</td>
                <td className="px-6 py-4 text-gray-400">{o.createdAt?.split("T")[0]}</td>
                <td className="px-6 py-4">
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border ${statusColors[o.status] || "bg-gray-50 text-gray-500"}`}>
                    {["pending","processing","shipped","delivered","cancelled"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4"><button onClick={() => updateStatus(o.id, o.status === "cancelled" ? "pending" : "cancelled")} className="text-xs text-gray-400 hover:text-red-500 transition-colors">{o.status === "cancelled" ? "Restore" : "Cancel"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}