"use client";
import { Package, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";

interface InventoryItem { id: number; name: string; sku: string; category: string; stock: number; reorderPoint: number; status: string; }

const statusConfig: Record<string, {label:string,color:string}> = {
  in_stock: { label: "In Stock", color: "bg-green-100 text-green-800" },
  low_stock: { label: "Low Stock", color: "bg-amber-100 text-amber-800" },
  out_of_stock: { label: "Out of Stock", color: "bg-red-100 text-red-800" },
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get<InventoryItem[]>("/inventory");
    if (res.status) setItems(res.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStock = async (id: number, stock: number) => {
    const res = await api.put(`/inventory/${id}/stock`, { stock });
    if (res.status) load(); else alert(res.message);
  };

  const needsAttention = items.filter(i => i.status !== "in_stock");

  return (
    <div className="space-y-6 pb-10">
      <div><h1 className="text-2xl font-bold text-gray-900">Inventory & Stock Management</h1><p className="text-sm text-gray-500 mt-1">Track product stock levels and manage inventory</p></div>

      {needsAttention.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">{needsAttention.length} product(s) need attention — stock is low or out of stock.</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">{Array.from({length:6}).map((_,i) => <div key={i} className="animate-pulse p-4 border-b border-gray-50"><div className="bg-gray-100 h-4 w-48 rounded mb-2" /><div className="bg-gray-100 h-3 w-32 rounded" /></div>)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50/60">{["Product", "SKU", "Category", "Stock", "Status", "Actions"].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => {
                const cfg = statusConfig[item.status] || statusConfig.out_of_stock;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><Package size={16} className="text-gray-400" /><span className="font-medium text-gray-800">{item.name}</span></div></td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.sku}</td>
                    <td className="px-6 py-4 text-gray-500">{item.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[120px]"><div className="h-2 rounded-full bg-gray-900" style={{width:`${Math.min(100,(item.stock/250)*100)}%`}} /></div>
                        <span className="font-semibold text-gray-700 text-xs">{item.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span></td>
                    <td className="px-6 py-4">
                      <input type="number" defaultValue={item.stock} onBlur={e => { const v = parseInt(e.target.value); if (v !== item.stock) updateStock(item.id, v); }} className="w-20 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 text-black" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}