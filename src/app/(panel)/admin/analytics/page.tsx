"use client";
import { TrendingUp, ShoppingBag, Users, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { getSettings, formatPrice } from "@/services/settings";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [res, sRes] = await Promise.all([api.get("/dashboard"), getSettings()]);
      if (res.status) setData(res.data);
      if (sRes?.currency) setCurrency(sRes.currency);
      if (sRes?.exchange_rate) setExchangeRate(parseFloat(sRes.exchange_rate));
      setLoading(false);
    })();
  }, []);

  const stats = [
    { label: "Total Revenue", val: formatPrice(data?.kpi?.revenue || 0, currency, exchangeRate), icon: DollarSign, color: "text-green-600" },
    { label: "Total Orders", val: data?.kpi?.orders || 0, icon: ShoppingBag, color: "text-blue-600" },
    { label: "New Customers", val: data?.kpi?.customers || 0, icon: Users, color: "text-purple-600" },
    { label: "Products", val: data?.kpi?.products || 0, icon: TrendingUp, color: "text-amber-600" },
  ];

  const topProducts = data?.lists?.recentOrders?.slice(0, 5).map((o: any, i: number) => ({
    name: o.customer || `Order #${o.id}`, category: "Order", units: i + 1, revenue: o.amount,
  })) || [];

  return (
    <div className="space-y-6 pb-10">
      <div><h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1><p className="text-sm text-gray-500 mt-1">Performance metrics and business insights</p></div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({length:4}).map((_,i) => <div key={i} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><div className="animate-pulse bg-gray-100 h-8 w-24 rounded mb-2" /><div className="animate-pulse bg-gray-100 h-3 w-16 rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5">
              <div className="flex items-center justify-between mb-2"><s.icon size={18} className={s.color} /></div>
              <p className={`text-xl lg:text-2xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-[10px] lg:text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50"><h2 className="text-base font-bold text-gray-800">Recent Orders</h2></div>
        {loading ? (
          <div className="p-6">{Array.from({length:5}).map((_,i) => <div key={i} className="animate-pulse bg-gray-100 h-4 w-full rounded mb-3" />)}</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50/60">{["Order", "Customer", "Revenue", "Status"].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {(data?.lists?.recentOrders || []).map((o: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-700">{o.id}</td>
                  <td className="px-6 py-4 text-gray-800">{o.customer}</td>
                  <td className="px-6 py-4 font-semibold text-green-700">{o.amount}</td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}