"use client";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Users, Package, RefreshCw, ArrowRight, Sparkles, ShoppingBag, CreditCard } from "lucide-react";
import { api } from "@/services/api.client";
import { getSettings, formatPrice } from "@/services/settings";

const DashboardCharts = dynamic(() => import("@/app/components/admin/DashboardCharts").then(m => m.DashboardCharts), { ssr: false });

interface DashData { kpi: { revenue: number; orders: number; customers: number; products: number; }; charts: { revenueOverTime: { label: string; value: number }[]; ordersByCategory: { label: string; value: number }[]; }; lists: { recentOrders: { id: string; customer: string; total: number; status: string; date: string }[]; }; }

function ClientDate() {
  const [date, setDate] = useState("");
  useEffect(() => { setDate(new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })); }, []);
  return <>{date}</>;
}

function Skeleton({ className }: { className?: string }) { return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />; }

export default function AdminDashboard() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [res, sRes] = await Promise.all([api.get<DashData>("/dashboard"), getSettings()]);
      if (res.status && res.data) setData(res.data as DashData);
      if (sRes?.currency) setCurrency(sRes.currency);
      if (sRes?.exchange_rate) setExchangeRate(parseFloat(sRes.exchange_rate));
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const kpi = data?.kpi;

  return (
    <div className="space-y-6 pb-10 bg-[#FAFAFA] min-h-screen text-gray-900 px-6 py-6">
      <div className="relative rounded-2xl overflow-hidden px-8 py-8 border border-gray-200 bg-white shadow-sm">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2"><Sparkles size={14} className="text-gray-400" /><span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Sanctum Overview</span></div>
            <h1 className="text-3xl font-heading text-gray-900">Welcome back, Admin</h1>
            <p className="text-sm text-gray-500 mt-1 font-body"><ClientDate /></p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"><RefreshCw size={14} /> Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({length:4}).map((_,i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : data ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-6 shadow-sm"><div className="flex items-center justify-between mb-2 md:mb-4"><div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center"><CreditCard size={16} className="text-gray-700" /></div></div><p className="text-xl md:text-3xl font-heading text-gray-900 truncate">{formatPrice(kpi?.revenue || 0, currency, exchangeRate)}</p><p className="text-[10px] md:text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold truncate">Total Revenue</p></div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-6 shadow-sm"><div className="flex items-center justify-between mb-2 md:mb-4"><div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center"><ShoppingBag size={16} className="text-gray-700" /></div></div><p className="text-xl md:text-3xl font-heading text-gray-900 truncate">{kpi?.orders}</p><p className="text-[10px] md:text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold truncate">Total Orders</p></div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-6 shadow-sm"><div className="flex items-center justify-between mb-2 md:mb-4"><div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center"><Users size={16} className="text-gray-700" /></div></div><p className="text-xl md:text-3xl font-heading text-gray-900 truncate">{kpi?.customers}</p><p className="text-[10px] md:text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold truncate">Customers</p></div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-6 shadow-sm"><div className="flex items-center justify-between mb-2 md:mb-4"><div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center"><Package size={16} className="text-gray-700" /></div></div><p className="text-xl md:text-3xl font-heading text-gray-900 truncate">{kpi?.products}</p><p className="text-[10px] md:text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold truncate">Active Products</p></div>
        </div>
      ) : null}

      {!loading && data?.charts && (
        <DashboardCharts revenueOverTime={data.charts.revenueOverTime} ordersByCategory={data.charts.ordersByCategory} />
      )}

      {!loading && data?.lists && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mt-6 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Recent Orders</h3><a href="/admin/orders" className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">View all <ArrowRight size={14}/></a></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500"><tr><th className="px-6 py-4 font-bold border-b border-gray-100">Order ID</th><th className="px-6 py-4 font-bold border-b border-gray-100">Customer</th><th className="px-6 py-4 font-bold border-b border-gray-100">Amount</th><th className="px-6 py-4 font-bold border-b border-gray-100">Date</th><th className="px-6 py-4 font-bold border-b border-gray-100">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {(data?.lists.recentOrders || []).map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{order.customer}</td>
                    <td className="px-6 py-4">{formatPrice(order.total, currency, exchangeRate)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{order.date}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${order.status === 'Delivered' ? 'bg-gray-100 text-gray-700 border-gray-200' : order.status === 'Processing' ? 'bg-white text-gray-800 border-gray-300' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}