"use client";
import { Image as ImageIcon, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import ImageUpload from "@/app/components/admin/ImageUpload";

interface Banner { id: number; title: string; location: string; image: string; startDate: string; endDate: string; status: string; }

const locations = ["homepage_hero", "category_banner", "homepage_section", "announcement_bar", "popup_banner"];
const locLabels: Record<string, string> = { homepage_hero: "Homepage Hero", category_banner: "Category Banner", homepage_section: "Homepage Section", announcement_bar: "Announcement Bar", popup_banner: "Popup Banner" };

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: "", location: "homepage_hero", image: "", startDate: "", endDate: "", status: "active" });

  const load = async () => {
    setLoading(true);
    const res = await api.get<Banner[]>("/banners");
    if (res.status) setBanners(res.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: "", location: "homepage_hero", image: "", startDate: "", endDate: "", status: "active" }); setShowForm(true); };
  const openEdit = (b: Banner) => { setEditing(b); setForm({ title: b.title, location: b.location, image: b.image || "", startDate: b.startDate || "", endDate: b.endDate || "", status: b.status }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = editing ? await api.put(`/banners/${editing.id}`, form) : await api.post("/banners", form);
    if (res.status) { setShowForm(false); load(); } else alert(res.message);
  };

  const toggleStatus = async (id: number) => {
    const res = await api.patch(`/banners/${id}/toggle`);
    if (res.status) load(); else alert(res.message);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this banner?")) return;
    const res = await api.delete(`/banners/${id}`);
    if (res.status) load(); else alert(res.message);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Banner & Media Manager</h1><p className="text-sm text-gray-500 mt-1">Manage homepage banners, promotional images and media</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"><Plus size={16} /> Add Banner</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Edit Banner" : "Add New Banner"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Banner Title</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label><select value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 bg-white text-black">{locations.map(l => <option key={l} value={l}>{locLabels[l]}</option>)}</select></div>
              <ImageUpload label="Banner Image" value={form.image} onChange={v => setForm({...form, image: v})} />
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label><input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div></div>
              <div className="flex items-center gap-3"><input type="checkbox" id="bStatus" checked={form.status === "active"} onChange={e => setForm({...form, status: e.target.checked ? "active" : "inactive"})} className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-100" /><label htmlFor="bStatus" className="text-sm font-semibold text-gray-700">Active</label></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">{editing ? "Update" : "Add"} Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length:4}).map((_,i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"><div className="bg-gray-100 h-10 w-10 rounded-xl mb-3" /><div className="bg-gray-100 h-4 w-32 rounded mb-2" /><div className="bg-gray-100 h-3 w-24 rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center"><ImageIcon size={20} className="text-indigo-500" /></div>
                <button onClick={() => toggleStatus(b.id)} className={`p-1.5 rounded-lg transition-colors ${b.status === "active" ? "text-green-500 hover:bg-green-50" : "text-gray-300 hover:bg-gray-100"}`}>{b.status === "active" ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}</button>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{b.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{locLabels[b.location] || b.location}</p>
              {b.image && <img src={b.image} alt={b.title} className="w-full h-24 object-cover rounded-lg mb-3" />}
              <div className="flex items-center justify-between text-xs text-gray-400"><span>{b.startDate || "—"} → {b.endDate || "—"}</span></div>
              <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-50">
                <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}