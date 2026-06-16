"use client";
import { Settings, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/services/api.client";

export default function SettingsPage() {
  const [form, setForm] = useState({ store_name: "", store_email: "", store_phone: "", currency: "INR", exchange_rate: "85", gst_number: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await api.get<any>("/settings");
      if (res.status && res.data) setForm(prev => ({ ...prev, ...res.data }));
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    const res = await api.put("/settings", form);
    setToast(res.status ? "Settings saved!" : (res.message || "Something went wrong"));
    setSaving(false);
  };

  if (loading) return <div className="space-y-6 pb-10"><div className="animate-pulse bg-gray-100 h-8 w-48 rounded mb-6" /><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Array.from({length:4}).map((_,i) => <div key={i} className="animate-pulse bg-gray-100 h-20 rounded-xl" />)}</div></div>;

  return (
    <div className="space-y-6 pb-10 max-w-3xl">
      <div className="flex items-center gap-3 mb-2"><Settings size={24} className="text-gray-700" /><div><h1 className="text-2xl font-bold text-gray-900">Site Settings</h1><p className="text-sm text-gray-500 mt-1">Manage store configuration</p></div></div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4">Store Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Name</label><input type="text" value={form.store_name} onChange={e => setForm({...form, store_name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Email</label><input type="email" value={form.store_email} onChange={e => setForm({...form, store_email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label><input type="tel" value={form.store_phone} onChange={e => setForm({...form, store_phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4">Regional & Tax</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label><select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 bg-white text-black"><option value="INR">INR (₹)</option><option value="USD">USD ($)</option></select></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Exchange Rate (1 USD to INR)</label><input type="number" step="1" value={form.exchange_rate} onChange={e => setForm({...form, exchange_rate: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" placeholder="85" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">GST Number</label><input type="text" value={form.gst_number} onChange={e => setForm({...form, gst_number: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50">
        <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
      </button>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 bg-[#262420] border border-[#A48662] text-[#F9F7F3] px-6 py-4 z-50 shadow-lg"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <p className="text-sm">{toast}</p>
        </motion.div>
      )}
    </div>
  );
}