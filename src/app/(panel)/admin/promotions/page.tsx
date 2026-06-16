"use client";
import { Tag, Plus, Edit2, Trash2, Copy, X } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { getSettings, formatPrice } from "@/services/settings";

interface Coupon { id: number; code: string; type: string; value: string; minOrder: string; usedCount: number; limit: number; expiry: string; status: string; }

export default function PromotionsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrder: "", limit: "", expiry: "", status: "active" });

  const load = async () => {
    setLoading(true);
    const [res, sRes] = await Promise.all([api.get<Coupon[]>("/coupons"), getSettings()]);
    if (res.status) setCoupons(res.data || []);
    if (sRes?.currency) setCurrency(sRes.currency);
    if (sRes?.exchange_rate) setExchangeRate(parseFloat(sRes.exchange_rate));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ code: "", type: "percentage", value: "", minOrder: "", limit: "", expiry: "", status: "active" }); setShowForm(true); };
  const openEdit = (c: Coupon) => { setEditing(c); setForm({ code: c.code, type: c.type, value: c.value, minOrder: c.minOrder, limit: c.limit?.toString(), expiry: c.expiry || "", status: c.status }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, value: parseFloat(form.value) || 0, minOrder: parseFloat(form.minOrder) || 0, limit: parseInt(form.limit) || 100 };
    const res = editing ? await api.put(`/coupons/${editing.id}`, payload) : await api.post("/coupons", payload);
    if (res.status) { setShowForm(false); load(); } else alert(res.message);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this coupon?")) return;
    const res = await api.delete(`/coupons/${id}`);
    if (res.status) load(); else alert(res.message);
  };

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Coupons & Discounts</h1><p className="text-sm text-gray-500 mt-1">Create and manage promotional coupons</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"><Plus size={16} /> Add Coupon</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Edit Coupon" : "Add New Coupon"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Coupon Code</label><input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 uppercase text-black" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 bg-white text-black"><option value="percentage">Percentage</option><option value="flat">Flat</option></select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Value</label><input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Min Order</label><input type="number" value={form.minOrder} onChange={e => setForm({...form, minOrder: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Usage Limit</label><input type="number" value={form.limit} onChange={e => setForm({...form, limit: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Expiry Date</label><input type="date" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div className="flex items-center gap-3"><input type="checkbox" id="copStatus" checked={form.status === "active"} onChange={e => setForm({...form, status: e.target.checked ? "active" : "inactive"})} className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-100" /><label htmlFor="copStatus" className="text-sm font-semibold text-gray-700">Active</label></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">{editing ? "Update" : "Add"} Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({length:4}).map((_,i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"><div className="bg-gray-100 h-6 w-24 rounded mb-3" /><div className="bg-gray-100 h-3 w-32 rounded mb-2" /><div className="bg-gray-100 h-2 w-full rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map(c => {
            const usagePct = c.limit > 0 ? Math.round((c.usedCount / c.limit) * 100) : 0;
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center"><Tag size={18} className="text-pink-500" /></div>
                    <div><h3 className="text-lg font-bold text-gray-900 font-mono">{c.code}</h3><p className="text-xs text-gray-400">{c.type === "percentage" ? `${c.value}% off` : `${formatPrice(Number(c.value), currency, exchangeRate)} off`} · Min: {formatPrice(parseFloat(c.minOrder || "0"), currency, exchangeRate)}</p></div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.status === "active" ? "Active" : "Inactive"}</span>
                </div>
                {c.expiry && <p className="text-xs text-gray-400 mb-3">Expires: {c.expiry}</p>}
                <div className="mb-3"><div className="flex justify-between text-xs text-gray-500 mb-1"><span>Usage: {c.usedCount}/{c.limit}</span><span>{usagePct}%</span></div><div className="bg-gray-100 rounded-full h-2"><div className="h-2 rounded-full bg-gray-900" style={{width:`${usagePct}%`}} /></div></div>
                <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-50">
                  <button onClick={() => copyCode(c.code)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><Copy size={14} /></button>
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}