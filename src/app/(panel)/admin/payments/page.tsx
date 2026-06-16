"use client";
import { CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { getSettings, formatPrice } from "@/services/settings";

export default function PaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [res, sRes] = await Promise.all([api.get("/orders"), getSettings()]);
      if (res.status) setOrders(res.data || []);
      if (sRes?.currency) setCurrency(sRes.currency);
      if (sRes?.exchange_rate) setExchangeRate(parseFloat(sRes.exchange_rate));
      setLoading(false);
    })();
  }, []);

  const payments = orders.map(o => ({
    id: `PAY-${String(o.id).padStart(4,"0")}`, orderRef: `#ORD-${String(o.id).padStart(4,"0")}`,
    customer: o.customer?.name || "Guest", amount: parseFloat(o.total || "0"),
    method: o.paymentMethod || "COD", status: o.paymentStatus || "pending", date: o.createdAt?.split("T")[0] || "—",
  }));

  const totalCollected = payments.reduce((s, p) => s + (p.status === "success" ? p.amount : 0), 0);
  const totalPending = payments.reduce((s, p) => s + (p.status === "pending" ? p.amount : 0), 0);
  const totalRefunded = payments.reduce((s, p) => s + (p.status === "refunded" ? p.amount : 0), 0);

  const statusColors: Record<string, string> = {
    success: "bg-green-50 text-green-700", pending: "bg-amber-50 text-amber-700",
    refunded: "bg-red-50 text-red-600", failed: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="space-y-6 pb-10">
      <div><h1 className="text-2xl font-bold text-gray-900">Payment Management</h1><p className="text-sm text-gray-500 mt-1">Track transactions and payment activity</p></div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({length:4}).map((_,i) => <div key={i} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><div className="animate-pulse bg-gray-100 h-8 w-20 rounded mb-2" /><div className="animate-pulse bg-gray-100 h-3 w-16 rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
<div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-green-600">{formatPrice(totalCollected, currency, exchangeRate)}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Total Collected</p></div>

          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-amber-500">{formatPrice(totalPending, currency, exchangeRate)}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Pending</p></div>

          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-red-500">{formatPrice(totalRefunded, currency, exchangeRate)}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Refunded</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-gray-900">{payments.length}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Transactions</p></div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50"><h2 className="text-base font-bold text-gray-800">Transaction History</h2></div>
        {loading ? (
          <div className="p-6">{Array.from({length:4}).map((_,i) => <div key={i} className="animate-pulse bg-gray-100 h-4 w-full rounded mb-3" />)}</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50/60">{["Payment ID", "Order", "Customer", "Amount", "Method", "Date", "Status"].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="px-6 py-4 font-mono text-gray-700">{p.orderRef}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{p.customer}</td>
                  <td className="px-6 py-4 font-bold">{formatPrice(p.amount, currency, exchangeRate)}</td>
                  <td className="px-6 py-4 text-gray-500">{p.method}</td>
                  <td className="px-6 py-4 text-gray-400">{p.date}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[p.status] || "bg-gray-100 text-gray-500"}`}>{p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}