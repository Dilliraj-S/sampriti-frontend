"use client";
import { FolderTree, Plus, Edit2, Trash2, Package, X } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import ImageUpload from "@/app/components/admin/ImageUpload";

interface Category { id: number; name: string; slug: string; description: string; image: string; status: string; productCount: number; }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "", status: "active" });

  const load = async () => {
    setLoading(true);
    const res = await api.get<Category[]>("/categories");
    if (res.status) setCategories(res.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", slug: "", description: "", image: "", status: "active" }); setShowForm(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description || "", image: c.image || "", status: c.status }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = editing ? await api.put(`/categories/${editing.id}`, form) : await api.post("/categories", form);
    if (res.status) { setShowForm(false); load(); } else alert(res.message);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    const res = await api.delete(`/categories/${id}`);
    if (res.status) load(); else alert(res.message);
  };

  const totalProducts = categories.reduce((a, c) => a + (c.productCount || 0), 0);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Category Management</h1><p className="text-sm text-gray-500 mt-1">Organize your product catalog with categories</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"><Plus size={16} /> Add Category</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Edit Category" : "Add New Category"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 resize-none text-black" /></div>
              <ImageUpload label="Category Image" value={form.image} onChange={v => setForm({...form, image: v})} />
              <div className="flex items-center gap-3"><input type="checkbox" id="catStatus" checked={form.status === "active"} onChange={e => setForm({...form, status: e.target.checked ? "active" : "inactive"})} className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-100" /><label htmlFor="catStatus" className="text-sm font-semibold text-gray-700">Active</label></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">{editing ? "Update" : "Add"} Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">{Array.from({length:3}).map((_,i) => <div key={i} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><div className="animate-pulse bg-gray-100 h-8 w-16 rounded mb-2" /><div className="animate-pulse bg-gray-100 h-3 w-20 rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-gray-900">{categories.length}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Total Categories</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-green-600">{categories.filter(c => c.status === "active").length}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Active</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-gray-900">{totalProducts}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Total Products</p></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><FolderTree size={18} className="text-green-600" /></div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cat.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{cat.status === "active" ? "Active" : "Inactive"}</span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">{cat.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{cat.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500"><Package size={13} /><span>{cat.productCount || 0} products</span></div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-[10px] text-gray-300 mt-2 font-mono">/{cat.slug}</p>
          </div>
        ))}
        <button onClick={openAdd} className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:border-green-300 hover:bg-green-50/30 transition-all">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"><Plus size={18} className="text-gray-400" /></div>
          <span className="text-sm font-medium text-gray-400">Add New Category</span>
        </button>
      </div>
    </div>
  );
}