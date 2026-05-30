"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tag, Package, X } from "lucide-react";

export default function PromoStrip() {
  const router = useRouter();
  const pathname = usePathname();
  const [announceBanner, setAnnounceBanner] = useState<any>(null);
  const [popupBanner, setPopupBanner] = useState<any>(null);
  const [latestProduct, setLatestProduct] = useState<any>(null);
  const [coupon, setCoupon] = useState<any>(null);
  const [dismissedProduct, setDismissedProduct] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 4000);
        const [cRes, bRes, pRes] = await Promise.all([
          fetch(base + "/coupons", { signal: controller.signal }).then(r => r.json()),
          fetch(base + "/banners", { signal: controller.signal }).then(r => r.json()),
          fetch(base + "/products/latest", { signal: controller.signal }).then(r => r.json()),
        ]);
        if (bRes.status && bRes.data) {
          const popup = bRes.data.find((b: any) => b.location === "popup_banner" && b.status === "active");
          if (popup) {
            const dismissedData = JSON.parse(localStorage.getItem("dismissedPopupBanner") || "{}");
            const isDismissed = dismissedData.id === popup.id && dismissedData.updatedAt === popup.updatedAt;
            if (!isDismissed) {
              setTimeout(() => setPopupBanner(popup), 1200);
            }
          }
          const ann = bRes.data.find((b: any) => b.location === "announcement_bar" && b.status === "active");
          if (ann) { setAnnounceBanner(ann); return; }
        }
        if (pRes.status && pRes.data) {
          const slug = localStorage.getItem("sampriti-new-arrival-slug");
          if (pRes.data.slug === slug) setLatestProduct(pRes.data);
        }
        if (cRes.status) {
          const ac = cRes.data?.find((c: any) => c.status === "active");
          if (ac) setCoupon(ac);
        }
      } catch {}
    })();
  }, []);

  const dismissPopup = () => {
    if (popupBanner) localStorage.setItem("dismissedPopupBanner", JSON.stringify({ id: popupBanner.id, updatedAt: popupBanner.updatedAt }));
    setPopupDismissed(true);
  };

  if (pathname?.startsWith("/admin")) return null;

  if (popupBanner && !popupDismissed) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
        <div className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
          <button onClick={dismissPopup} className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
          {popupBanner.image && (
            <div className="w-full h-48 md:h-64 bg-gray-100">
              <img src={popupBanner.image} alt={popupBanner.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div onClick={() => { if (popupBanner.link) router.push(popupBanner.link); }} className={"p-6 text-center " + (popupBanner.link ? "cursor-pointer" : "")}>
            <h3 className="text-xl font-semibold text-[#2C2A26] mb-2">{popupBanner.title}</h3>
          </div>
        </div>
      </div>
    );
  }

  if (dismissed) return null;

  if (announceBanner) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="relative max-w-[260px] sm:max-w-sm min-h-[140px] rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden border border-gray-100"
          style={announceBanner.image ? { backgroundImage: `url(${announceBanner.image})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <button
            type="button"
            aria-label="Close announcement"
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            className="absolute right-1.5 top-1.5 z-20 flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
          >
            <X size={12} className="sm:size-4" />
          </button>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[140px] p-3 sm:p-6 text-center">
            <Tag size={18} className="sm:size-6 mb-2 text-white" />
            <h3 className="text-sm sm:text-lg font-semibold text-white mb-0.5 sm:mb-1 drop-shadow-sm">{announceBanner.title}</h3>
            {announceBanner.description && <p className="text-[10px] sm:text-xs text-white/90 drop-shadow-sm">{announceBanner.description}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (latestProduct && !dismissedProduct) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="relative max-w-[260px] sm:max-w-sm rounded-xl sm:rounded-2xl bg-white p-3 sm:p-6 shadow-xl sm:shadow-2xl text-center border border-gray-100">
          <button onClick={() => setDismissedProduct(true)} className="absolute -right-1.5 -top-1.5 sm:-right-2 sm:-top-2 flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            <X size={12} className="sm:size-4" />
          </button>
          <button onClick={() => { router.push("/product/" + latestProduct.slug); }} className="w-full text-left cursor-pointer">
            <Package size={18} className="sm:size-6 mx-auto mb-2 sm:mb-3 text-[#A48662]" />
            <h3 className="text-sm sm:text-lg font-semibold text-[#2C2A26] mb-0.5 sm:mb-1">New Arrival</h3>
            <p className="text-[10px] sm:text-xs text-[#6F6A64] line-clamp-1">{latestProduct.name}</p>
            {coupon && (
              <p className="text-[10px] sm:text-xs text-[#6F6A64] mt-1">
                Use code <strong className="text-[#2C2A26]">{coupon.code}</strong> for {coupon.type === "percentage" ? `${coupon.value}% off` : `${coupon.value} off`}
              </p>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (coupon) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="relative max-w-[260px] sm:max-w-sm rounded-xl sm:rounded-2xl bg-white p-3 sm:p-6 shadow-xl sm:shadow-2xl text-center border border-gray-100">
          <button onClick={() => setDismissed(true)} className="absolute -right-1.5 -top-1.5 sm:-right-2 sm:-top-2 flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            <X size={12} className="sm:size-4" />
          </button>
          <Tag size={18} className="sm:size-6 mx-auto mb-2 sm:mb-3 text-[#A48662]" />
          <h3 className="text-sm sm:text-lg font-semibold text-[#2C2A26] mb-0.5 sm:mb-1">Special Offer!</h3>
          <p className="text-[10px] sm:text-xs text-[#6F6A64]">
            Use code <strong className="text-[#2C2A26]">{coupon.code}</strong> for {coupon.type === "percentage" ? `${coupon.value}% off` : `${coupon.value} off`}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
