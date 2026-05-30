"use client";
import { FileText, Plus, Edit2, Trash2, X, ToggleRight } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";
import ImageUpload from "@/app/components/admin/ImageUpload";

interface Post { id: number; title: string; slug: string; category: string; content: string; excerpt: string; image: string; views: number; status: string; publishDate: string; createdAt: string; }

const categories = ["Wellness", "Hair Care", "Skin Care", "Ayurveda", "Supplements", "Lifestyle", "News"];

export default function ContentPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: "", category: "Wellness", content: "", excerpt: "", image: "", status: "published", publishDate: "" });

  const load = async () => {
    setLoading(true);
    const res = await api.get<Post[]>("/content");
    if (res.status) setPosts(res.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: "", category: "Wellness", content: "", excerpt: "", image: "", status: "published", publishDate: "" }); setShowForm(true); };
  const openEdit = (p: Post) => { setEditing(p); setForm({ title: p.title, category: p.category || "Wellness", content: p.content || "", excerpt: p.excerpt || "", image: p.image || "", status: p.status, publishDate: p.publishDate || "" }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { publishDate, ...rest } = form;
    const payload = form.status !== "scheduled" || !form.publishDate ? rest : form;
    const res = editing ? await api.put(`/content/${editing.id}`, payload) : await api.post("/content", payload);
    if (res.status) { setShowForm(false); load(); } else alert(res.message);
  };

  const toggleStatus = async (id: number) => {
    const res = await api.patch(`/content/${id}/toggle`);
    if (res.status) load(); else alert(res.message);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    const res = await api.delete(`/content/${id}`);
    if (res.status) load(); else alert(res.message);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Content Management</h1><p className="text-sm text-gray-500 mt-1">Manage blog posts and articles</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"><Plus size={16} /> Add Post</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Edit Post" : "Add New Post"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 bg-white text-black">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 bg-white text-black"><option value="published">Published</option><option value="scheduled">Scheduled</option></select></div>
              {form.status === "scheduled" && <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Publish Date</label><input type="date" value={form.publishDate} onChange={e => setForm({...form, publishDate: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>}
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt</label><textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 resize-none text-black" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Content</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={10} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-black" /></div>
              <ImageUpload label="Featured Image" value={form.image} onChange={v => setForm({...form, image: v})} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">{editing ? "Update" : "Add"} Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">{Array.from({length:5}).map((_,i) => <div key={i} className="animate-pulse p-4 border-b border-gray-50"><div className="bg-gray-100 h-4 w-64 rounded mb-2" /><div className="bg-gray-100 h-3 w-32 rounded" /></div>)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50/60">{["Title", "Category", "Status", "Date", "Views", "Actions"].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><FileText size={16} className="text-gray-400" /><span className="font-medium text-gray-800">{p.title}</span></div></td>
                  <td className="px-6 py-4 text-gray-500">{p.category || "—"}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === "published" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>{p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span></td>
                  <td className="px-6 py-4 text-gray-400">{p.publishDate || p.createdAt?.split("T")[0]}</td>
                  <td className="px-6 py-4 text-gray-500">{p.views || 0}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-1"><button onClick={() => toggleStatus(p.id)} className={`p-1.5 rounded-lg transition-colors ${p.status === "published" ? "text-green-500 hover:bg-green-50" : "text-blue-500 hover:bg-blue-50"}`}><ToggleRight size={16} /></button><button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button><button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}