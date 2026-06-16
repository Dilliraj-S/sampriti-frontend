"use client";
import { Users, Plus, Search, MapPin, X } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { getSettings, formatPrice } from "@/services/settings";

interface Customer { id: number; name: string; email: string; phone: string; city: string; ordersCount: number; totalSpent: string; status: string; createdAt: string; }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", status: "active" });

  const load = async () => {
    setLoading(true);
    const [cRes, , settings] = await Promise.all([api.get<Customer[]>("/customers"), api.get<any>("/customers/stats"), getSettings()]);
    if (cRes.status) setCustomers(cRes.data || []);
    if (settings?.currency) setCurrency(settings.currency);
    if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", email: "", phone: "", city: "", status: "active" }); setShowForm(true); };
  const openEdit = (c: Customer) => { setEditing(c); setForm({ name: c.name, email: c.email, phone: c.phone || "", city: c.city || "", status: c.status }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = editing ? await api.put(`/customers/${editing.id}`, form) : await api.post("/customers", form);
    if (res.status) { setShowForm(false); load(); } else alert(res.message);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this customer?")) return;
    const res = await api.delete(`/customers/${id}`);
    if (res.status) load(); else alert(res.message);
  };

  const filtered = customers.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));
  const totalOrders = customers.reduce((a, c) => a + (c.ordersCount || 0), 0);
  const totalSpent = customers.reduce((a, c) => a + parseFloat(c.totalSpent || "0"), 0);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Customer Management</h1><p className="text-sm text-gray-500 mt-1">View and manage your customer base</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"><Plus size={16} /> Add Customer</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Edit Customer" : "Add New Customer"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label><input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div className="flex items-center gap-3"><input type="checkbox" id="cStatus" checked={form.status === "active"} onChange={e => setForm({...form, status: e.target.checked ? "active" : "inactive"})} className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-100" /><label htmlFor="cStatus" className="text-sm font-semibold text-gray-700">Active</label></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">{editing ? "Update" : "Add"} Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({length:4}).map((_,i) => <div key={i} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><div className="animate-pulse bg-gray-100 h-8 w-16 rounded mb-2" /><div className="animate-pulse bg-gray-100 h-3 w-20 rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-gray-900">{customers.length}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Total Customers</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-green-600">{customers.filter(c => c.status === "active").length}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Active</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-blue-600">{totalOrders}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Total Orders</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-purple-600">{formatPrice(totalSpent, currency, exchangeRate)}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Total Revenue</p></div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="text-base font-bold text-gray-800">All Customers</h2>
          <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 w-56 text-black" /></div>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50/60">{["Customer", "Location", "Orders", "Total Spent", "Status", "Actions"].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{c.name?.[0]}</div><div><p className="font-semibold text-gray-800">{c.name}</p><p className="text-xs text-gray-400">{c.email}</p></div></div></td>
                <td className="px-6 py-4"><div className="flex items-center gap-1 text-gray-500"><MapPin size={12} /><span>{c.city || "—"}</span></div></td>
                <td className="px-6 py-4 font-semibold text-gray-700">{c.ordersCount || 0}</td>
                <td className="px-6 py-4 font-bold text-green-700">{formatPrice(parseFloat(c.totalSpent || "0"), currency, exchangeRate)}</td>
                <td className="px-6 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.status === "active" ? "Active" : "Inactive"}</span></td>
                <td className="px-6 py-4"><button onClick={() => openEdit(c)} className="text-xs text-blue-600 hover:underline">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}