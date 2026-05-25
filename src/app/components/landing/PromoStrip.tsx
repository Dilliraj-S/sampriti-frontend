"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, Package, X } from "lucide-react";

export default function PromoStrip() {
  const router = useRouter();
  const [banner, setBanner] = useState<any>(null);
  const [latestProduct, setLatestProduct] = useState<any>(null);
  const [coupon, setCoupon] = useState<any>(null);
  const [dismissedProduct, setDismissedProduct] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 3000);
        const [cRes, bRes, pRes] = await Promise.all([
          fetch(base + "/coupons", { signal: controller.signal }).then(r => r.json()),
          fetch(base + "/banners", { signal: controller.signal }).then(r => r.json()),
          fetch(base + "/products/latest", { signal: controller.signal }).then(r => r.json()),
        ]);
        const bannerActive = bRes.status ? bRes.data?.find((b: any) => b.location === "announcement_bar" && b.status === "active") : null;
        if (bannerActive) { setBanner(bannerActive); return; }
        if (pRes.status && pRes.data) setLatestProduct(pRes.data);
        if (cRes.status) {
          const ac = cRes.data?.find((c: any) => c.status === "active");
          if (ac) setCoupon(ac);
        }
      } catch {}
    })();
  }, []);

  if (dismissed) return null;

  if (banner) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="relative max-w-[260px] sm:max-w-sm rounded-xl sm:rounded-2xl bg-white p-3 sm:p-6 shadow-xl sm:shadow-2xl text-center border border-gray-100">
          <button onClick={() => setDismissed(true)} className="absolute -right-1.5 -top-1.5 sm:-right-2 sm:-top-2 flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            <X size={12} className="sm:size-4" />
          </button>
          <Tag size={18} className="sm:size-6 mx-auto mb-2 sm:mb-3 text-[#A48662]" />
          <h3 className="text-sm sm:text-lg font-semibold text-[#2C2A26] mb-0.5 sm:mb-1">{banner.title}</h3>
          {banner.description && <p className="text-[10px] sm:text-xs text-[#6F6A64]">{banner.description}</p>}
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
