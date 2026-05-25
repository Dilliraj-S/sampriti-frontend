"use client";
import { Package, Plus, Search, X, Upload, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import { getSettings, formatPrice } from "@/services/settings";
import ImageUpload from "@/app/components/admin/ImageUpload";
import { toast } from "sonner";

interface Product {
  id: number; name: string; categoryId: number; price: number; stock: number; status: string;
  slug: string; subtitle: string; description: string; image: string; hoverImage: string;
  essenceTitle: string; essence: string; keyIngredients: string; howToUse: string; usageDetails: any;
  aroma: string; suitedTo: string; benefits: string; format: string;
  category?: { id: number; name: string; slug: string };
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const [formData, setFormData] = useState<any>({
    name: "", slug: "", subtitle: "", categoryId: "", price: "", stock: "",
    description: "", image: "", hoverImage: "", essenceTitle: "", essence: "",
    keyIngredients: "", howToUse: "", usageDetails: [], aroma: "", suitedTo: "", benefits: "", format: "", status: "active",
  });

  const load = async () => {
    setLoading(true);
    const [pRes, cRes, sRes] = await Promise.all([api.get<Product[]>("/products"), api.get<any[]>("/categories"), getSettings()]);
    if (pRes.status) setProducts(pRes.data || []);
    if (cRes.status) setCategories(cRes.data || []);
    if (sRes?.currency) setCurrency(sRes.currency);
    if (sRes?.exchange_rate) setExchangeRate(parseFloat(sRes.exchange_rate));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setFormData({ name: "", slug: "", subtitle: "", categoryId: "", price: "", stock: "", description: "", image: "", hoverImage: "", essenceTitle: "", essence: "", keyIngredients: "", howToUse: "", usageDetails: [], aroma: "", suitedTo: "", benefits: "", format: "", status: "active" }); setShowForm(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    let usageArr = p.usageDetails;
    if (typeof usageArr === "string") { try { usageArr = JSON.parse(usageArr); } catch { usageArr = []; } }
    if (!Array.isArray(usageArr)) usageArr = [];
    setFormData({ ...p, usageDetails: usageArr, categoryId: p.categoryId?.toString() || "", price: p.price?.toString() || "", stock: p.stock?.toString() || "" });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usageDetails = Array.isArray(formData.usageDetails) ? formData.usageDetails.filter((u: any) => u.title || u.desc) : null;
    const payload = { ...formData, usageDetails, price: parseFloat(formData.price) || 0, stock: parseInt(formData.stock) || 0, categoryId: formData.categoryId ? parseInt(formData.categoryId) : null };
    const res = editing ? await api.put("/products/" + editing.id, payload) : await api.post("/products", payload);
    if (res.status) { setShowForm(false); load(); toast.success(editing ? "Product updated" : "Product added"); } else toast.error(res.message || "Failed to save product");
  };

  const handleDelete = async (id: number) => {
    const res = await api.delete("/products/" + id);
    if (res.status) { load(); toast.success("Product deleted"); } else toast.error(res.message);
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Product Management</h1><p className="text-sm text-gray-500 mt-1">Manage your Sampriti Botanicals product catalog</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"><Plus size={16} /> Add Product</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Subtitle</label><input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} placeholder="e.g. The Elixir of Vitality" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug</label><input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="Auto-generated from name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label><select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 bg-white text-black"> <option value="">Select Category</option>{categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Price ($)</label><input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock</label><input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Format</label><input type="text" value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})} placeholder="e.g. 35g powder" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 resize-none text-black" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Key Ingredients</label><textarea value={formData.keyIngredients} onChange={e => setFormData({...formData, keyIngredients: e.target.value})} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 resize-none text-black" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Benefits</label><textarea value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 resize-none text-black" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Essence Title</label><input type="text" value={formData.essenceTitle} onChange={e => setFormData({...formData, essenceTitle: e.target.value})} placeholder="e.g. Shakti Pehya" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Essence / Adaptogen Info</label><textarea value={formData.essence} onChange={e => setFormData({...formData, essence: e.target.value})} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 resize-none text-black" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">How to Use / Servings</label><textarea value={formData.howToUse} onChange={e => setFormData({...formData, howToUse: e.target.value})} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 resize-none text-black" /></div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Usage Details</label>
                  <div className="space-y-2">
                    {(Array.isArray(formData.usageDetails) ? formData.usageDetails : []).map((item: any, i: number) => (
                      <div key={i} className="flex gap-2 items-start bg-gray-50 p-2 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <input type="text" value={item.title || ""} onChange={e => { const arr = [...formData.usageDetails]; arr[i] = { ...arr[i], title: e.target.value }; setFormData({...formData, usageDetails: arr }); }} placeholder="Title" className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black mb-1" />
                          <input type="text" value={item.desc || ""} onChange={e => { const arr = [...formData.usageDetails]; arr[i] = { ...arr[i], desc: e.target.value }; setFormData({...formData, usageDetails: arr }); }} placeholder="Description" className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" />
                        </div>
                        <button type="button" onClick={() => { const arr = formData.usageDetails.filter((_: any, idx: number) => idx !== i); setFormData({...formData, usageDetails: arr }); }} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 mt-1 cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => { const arr = [...(Array.isArray(formData.usageDetails) ? formData.usageDetails : []), { title: "", desc: "" }]; setFormData({...formData, usageDetails: arr }); }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors w-full cursor-pointer"><Plus size={14} /> Add Detail</button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Aroma</label><input type="text" value={formData.aroma} onChange={e => setFormData({...formData, aroma: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Suited To</label><input type="text" value={formData.suitedTo} onChange={e => setFormData({...formData, suitedTo: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ImageUpload label="Main Image" value={formData.image} onChange={v => setFormData({...formData, image: v})} />
                <ImageUpload label="Hover Image" value={formData.hoverImage} onChange={v => setFormData({...formData, hoverImage: v})} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">{editing ? "Update" : "Add"} Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({length:4}).map((_,i) => <div key={i} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><div className="animate-pulse bg-gray-100 h-8 w-20 rounded mb-2" /><div className="animate-pulse bg-gray-100 h-3 w-16 rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-gray-900">{products.length}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Total Products</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-green-600">{products.filter(p => p.status === "active").length}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Active</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-red-500">{products.filter(p => p.status === "out_of_stock").length}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Out of Stock</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-amber-500">{products.filter(p => p.status === "low_stock").length}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Low Stock</p></div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="text-base font-bold text-gray-800">All Products</h2>
          <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 w-52 text-black" /></div>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50/60">{["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center"><Package size={16} className="text-green-500" /></div><span className="font-medium text-gray-800">{p.name}</span></div></td>
                <td className="px-6 py-4 text-gray-500">{p.category?.name || "—"}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{formatPrice(Number(p.price), currency, exchangeRate)}</td>
                <td className="px-6 py-4 text-gray-600">{p.stock}</td>
                <td className="px-6 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === "active" ? "bg-green-50 text-green-700" : p.status === "out_of_stock" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>{p.status === "active" ? "Active" : p.status === "out_of_stock" ? "Out of Stock" : "Low Stock"}</span></td>
                <td className="px-6 py-4"><div className="flex items-center gap-1"><button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button><button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}