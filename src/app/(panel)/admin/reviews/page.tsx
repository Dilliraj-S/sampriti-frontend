"use client";
import { Star, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";

interface Review { id: number; productId: number; customer: string; rating: number; comment: string; status: string; createdAt: string; product?: { id: number; name: string; }; }

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });

  const load = async () => {
    setLoading(true);
    const [rRes, sRes] = await Promise.all([api.get<Review[]>("/reviews"), api.get<any>("/reviews/stats")]);
    if (rRes.status) setReviews(rRes.data || []);
    if (sRes.status) setStats(sRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    const res = await api.put(`/reviews/${id}/status`, { status });
    if (res.status) load(); else alert(res.message);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this review?")) return;
    const res = await api.delete(`/reviews/${id}`);
    if (res.status) load(); else alert(res.message);
  };

  return (
    <div className="space-y-6 pb-10">
      <div><h1 className="text-2xl font-bold text-gray-900">Review Moderation</h1><p className="text-sm text-gray-500 mt-1">Manage customer product reviews</p></div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">{Array.from({length:3}).map((_,i) => <div key={i} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><div className="animate-pulse bg-gray-100 h-8 w-12 rounded mb-2" /><div className="animate-pulse bg-gray-100 h-3 w-16 rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-gray-900">{stats.total}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Total Reviews</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-green-600">{stats.approved}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Approved</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-amber-500">{stats.pending}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Pending</p></div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{Array.from({length:3}).map((_,i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"><div className="bg-gray-100 h-4 w-48 rounded mb-2" /><div className="bg-gray-100 h-3 w-32 rounded mb-2" /><div className="bg-gray-100 h-3 w-full rounded" /></div>)}</div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{r.customer || "Anonymous"}</span>
                    <span className="text-xs text-gray-400">on</span>
                    <span className="text-xs font-medium text-blue-600">{r.product?.name || `Product #${r.productId}`}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />)}
                    <span className="text-xs text-gray-400 ml-1">{r.createdAt?.split("T")[0]}</span>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.status === "approved" ? "bg-green-50 text-green-700" : r.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{r.comment}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                {r.status !== "approved" && <button onClick={() => updateStatus(r.id, "approved")} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"><ThumbsUp size={12} /> Approve</button>}
                {r.status !== "rejected" && <button onClick={() => updateStatus(r.id, "rejected")} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"><ThumbsDown size={12} /> Reject</button>}
                <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors ml-auto"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No reviews yet.</p>}
        </div>
      )}
    </div>
  );
}