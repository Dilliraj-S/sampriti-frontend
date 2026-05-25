"use client";
import { useEffect, useState, useCallback } from "react";
import { Users, Package, RefreshCw, ArrowRight, Sparkles, ShoppingBag, CreditCard } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/services/api.client";
import { getSettings, formatPrice } from "@/services/settings";

interface DashData { kpi: { revenue: number; orders: number; customers: number; products: number; }; charts: { revenueOverTime: { label: string; value: number }[]; ordersByCategory: { label: string; value: number }[]; }; lists: { recentOrders: { id: string; customer: string; total: number; status: string; date: string }[]; }; }

function ClientDate() {
  const [date, setDate] = useState("");
  useEffect(() => { setDate(new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })); }, []);
  return <>{date}</>;
}

const PIE_PALETTE = ["#111827", "#4B5563", "#9CA3AF", "#D1D5DB", "#C4923A"];

function Skeleton({ className }: { className?: string }) { return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />; }

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return <div className="bg-white text-gray-900 text-xs rounded-xl px-3 py-2.5 shadow-xl border border-gray-100"><p className="font-semibold text-gray-400 mb-0.5 text-[10px] uppercase tracking-wider">{label}</p><p className="text-xl font-black">{payload[0].value}</p></div>;
}

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"><h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6">Revenue Growth</h3><div style={{height:300}}><ResponsiveContainer width="100%" height="100%"><AreaChart data={data?.charts.revenueOverTime || []} margin={{top:10,right:10,left:0,bottom:0}}><defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#111827" stopOpacity={0.1}/><stop offset="95%" stopColor="#111827" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/><XAxis dataKey="label" tick={{fill:"#6B7280",fontSize:12}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#6B7280",fontSize:12}} axisLine={false} tickLine={false}/><Tooltip content={<ChartTooltip/>}/><Area type="monotone" dataKey="value" stroke="#111827" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)"/></AreaChart></ResponsiveContainer></div></div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col shadow-sm"><h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6">Sales by Category</h3><div className="flex-1 min-h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data?.charts.ordersByCategory || []} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">{(data?.charts.ordersByCategory || []).map((_: any, i: number) => <Cell key={i} fill={PIE_PALETTE[i%PIE_PALETTE.length]}/>)}</Pie><Tooltip content={<ChartTooltip/>}/></PieChart></ResponsiveContainer></div></div>
        </div>
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