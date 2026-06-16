"use client";
import { Truck, Plus, Edit2, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { getSettings, formatPrice } from "@/services/settings";

interface Zone { id: number; name: string; pinCodes: string; rate: string; freeAbove: string; deliveryTime: string; status: string; }

export default function ShippingPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Zone | null>(null);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const [form, setForm] = useState({ name: "", pinCodes: "", rate: "", freeAbove: "", deliveryTime: "", status: "active" });

  const load = async () => {
    setLoading(true);
    const [res, sRes] = await Promise.all([api.get<Zone[]>("/shipping-zones"), getSettings()]);
    if (res.status) setZones(res.data || []);
    if (sRes?.currency) setCurrency(sRes.currency);
    if (sRes?.exchange_rate) setExchangeRate(parseFloat(sRes.exchange_rate));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", pinCodes: "", rate: "", freeAbove: "", deliveryTime: "", status: "active" }); setShowForm(true); };
  const openEdit = (z: Zone) => { setEditing(z); setForm({ name: z.name, pinCodes: z.pinCodes || "", rate: z.rate?.toString() || "", freeAbove: z.freeAbove?.toString() || "", deliveryTime: z.deliveryTime || "", status: z.status }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, rate: parseFloat(form.rate) || 0, freeAbove: parseFloat(form.freeAbove) || 0 };
    const res = editing ? await api.put(`/shipping-zones/${editing.id}`, payload) : await api.post("/shipping-zones", payload);
    if (res.status) { setShowForm(false); load(); } else alert(res.message);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this shipping zone?")) return;
    const res = await api.delete(`/shipping-zones/${id}`);
    if (res.status) load(); else alert(res.message);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Shipping Zones</h1><p className="text-sm text-gray-500 mt-1">Manage shipping rates and delivery zones</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"><Plus size={16} /> Add Zone</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Edit Zone" : "Add Shipping Zone"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Zone Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">PIN Codes / Area</label><input type="text" value={form.pinCodes} onChange={e => setForm({...form, pinCodes: e.target.value})} placeholder="e.g. 400001-400099" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Shipping Rate</label><input type="number" value={form.rate} onChange={e => setForm({...form, rate: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Free Above</label><input type="number" value={form.freeAbove} onChange={e => setForm({...form, freeAbove: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Time</label><input type="text" value={form.deliveryTime} onChange={e => setForm({...form, deliveryTime: e.target.value})} placeholder="e.g. 3-5 days" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div className="flex items-center gap-3"><input type="checkbox" id="sStatus" checked={form.status === "active"} onChange={e => setForm({...form, status: e.target.checked ? "active" : "inactive"})} className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-100" /><label htmlFor="sStatus" className="text-sm font-semibold text-gray-700">Active</label></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">{editing ? "Update" : "Add"} Zone</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({length:3}).map((_,i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"><div className="bg-gray-100 h-6 w-32 rounded mb-3" /><div className="bg-gray-100 h-3 w-24 rounded mb-2" /><div className="bg-gray-100 h-3 w-20 rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {zones.map(z => (
            <div key={z.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center"><Truck size={18} className="text-cyan-500" /></div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${z.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{z.status === "active" ? "Active" : "Inactive"}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{z.name}</h3>
              <p className="text-xs text-gray-500 mb-2">PIN: {z.pinCodes || "—"}</p>
              <div className="flex items-center gap-4 text-sm"><span className="font-semibold text-gray-800">{formatPrice(parseFloat(z.rate || "0"), currency, exchangeRate)}</span><span className="text-gray-400">Free above {formatPrice(parseFloat(z.freeAbove || "0"), currency, exchangeRate)}</span></div>
              <p className="text-xs text-gray-400 mt-1">{z.deliveryTime}</p>
              <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-50">
                <button onClick={() => openEdit(z)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(z.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}