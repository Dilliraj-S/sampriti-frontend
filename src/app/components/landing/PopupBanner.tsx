"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function PopupBanner() {
  const [banner, setBanner] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1500);
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
        const res = await fetch(base + "/banners").then(r => r.json());
        if (res.status) {
          const active = res.data?.find(
            (b: any) => b.location === "popup_banner" && b.status === "active"
          );
          if (active) {
            const dismissedId = localStorage.getItem("dismissedPopupBanner");
            if (dismissedId !== String(active.id)) {
              setBanner(active);
            }
          }
        }
      } catch {}
    })();
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    if (banner) {
      localStorage.setItem("dismissedPopupBanner", String(banner.id));
    }
    setDismissed(true);
  };

  if (!banner || dismissed || !ready) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
        {banner.image && (
          <div className="w-full h-48 md:h-64 bg-gray-100">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-[#2C2A26] mb-2">{banner.title}</h3>
        </div>
      </div>
    </div>
  );
}
