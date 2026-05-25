"use client";
import { useEffect, useState } from "react";

export default function SectionBanner() {
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
        const res = await fetch(base + "/banners").then(r => r.json());
        if (res.status) {
          setBanners(res.data?.filter((b: any) => b.location === "homepage_section" && b.status === "active") || []);
        }
      } catch {}
    })();
  }, []);

  if (banners.length === 0) return null;

  return (
    <>
      {banners.map((banner) => (
        <section key={banner.id} className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-100">
          {banner.image && (
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center px-6">
              <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-wider mb-3">
                {banner.title}
              </h2>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
