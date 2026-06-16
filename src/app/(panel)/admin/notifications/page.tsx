"use client";
import { Bell, Mail, MessageSquare, ToggleLeft, ToggleRight } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api.client";

const channelIcons: Record<string, any> = { Email: Mail, SMS: MessageSquare };

export default function NotificationsPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await api.get("/settings");
      const allSettings = res.data || {};
      const tmpl = [
        { title: "Order Confirmation", channel: "Email", trigger: "After successful order", enabled: allSettings.order_confirmation !== "disabled" },
        { title: "Order Shipped", channel: "Email", trigger: "When order is shipped", enabled: allSettings.order_shipped !== "disabled" },
        { title: "Delivery Confirmation", channel: "Email", trigger: "When order is delivered", enabled: allSettings.delivery_confirmation !== "disabled" },
        { title: "Order Cancelled", channel: "Email", trigger: "When order is cancelled", enabled: allSettings.order_cancelled !== "disabled" },
        { title: "Welcome Email", channel: "Email", trigger: "New customer registration", enabled: allSettings.welcome_email !== "disabled" },
        { title: "Back in Stock", channel: "SMS", trigger: "Product stock restored", enabled: allSettings.back_in_stock !== "disabled" },
      ];
      setTemplates(tmpl);
      setLoading(false);
    })();
  }, []);

  const toggle = async (title: string, current: boolean) => {
    const key = title.toLowerCase().replace(/\s+/g, "_");
    const res = await api.put("/settings", { [key]: current ? "disabled" : "enabled" });
    if (res.status) {
      setTemplates(prev => prev.map(t => t.title === title ? { ...t, enabled: !current } : t));
    } else alert(res.message);
  };

  const stats = { total: templates.length, active: templates.filter(t => t.enabled).length, disabled: templates.filter(t => !t.enabled).length };

  return (
    <div className="space-y-6 pb-10">
      <div><h1 className="text-2xl font-bold text-gray-900">Email & SMS Templates</h1><p className="text-sm text-gray-500 mt-1">Manage notification templates and triggers</p></div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">{Array.from({length:3}).map((_,i) => <div key={i} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><div className="animate-pulse bg-gray-100 h-8 w-12 rounded" /></div>)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-gray-900">{stats.total}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Total Templates</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-green-600">{stats.active}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Active</p></div>
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-3 lg:p-5"><p className="text-xl lg:text-3xl font-black text-gray-400">{stats.disabled}</p><p className="text-[10px] lg:text-xs text-gray-500 mt-1">Disabled</p></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map(t => {
          const Icon = channelIcons[t.channel] || Bell;
          return (
            <div key={t.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"><Icon size={18} className="text-gray-500" /></div>
                <div><h3 className="text-sm font-bold text-gray-800">{t.title}</h3><p className="text-xs text-gray-400">{t.channel} · {t.trigger}</p></div>
              </div>
              <button onClick={() => toggle(t.title, t.enabled)} className={`p-1.5 rounded-lg transition-colors ${t.enabled ? "text-green-500" : "text-gray-300"}`}>
                {t.enabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}