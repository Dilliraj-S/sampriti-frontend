"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace("/api/admin", "");

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  subtitle?: string;
  price?: string | number;
  image?: string;
  category?: { id: number; name: string; slug: string } | null;
  format?: string;
  status?: string;
}

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [topOffset, setTopOffset] = useState(80);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) setTopOffset(nav.offsetHeight);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/search?q=${encodeURIComponent(q.trim())}`);
      const json = await res.json();
      setResults(json.status ? (json.data || []) : []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 150);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);


  const formatPrice = (p: string | number | undefined) => {
    const n = Number(p);
    return isNaN(n) ? "" : `₹${n.toLocaleString("en-IN")}`;
  };

  return (
    <div
      className="fixed left-0 right-0 bottom-0 flex flex-col"
      style={{ background: "rgba(253,250,245,0.98)", top: topOffset, zIndex: 100 }}
    >
      {/* Search bar row */}
      <div className="flex items-center border-b px-4 md:px-12 lg:px-20" style={{ borderColor: "rgba(164,134,98,0.15)", minHeight: "110px" }}>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
          <div className="flex items-center gap-2 md:gap-4 border px-3 md:px-4 py-2" style={{ borderColor: "#333333", borderRadius: "4px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A8379" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, ingredients, benefits..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm md:text-base outline-none placeholder-[#333333]"
              style={{ color: "#2B2925", fontFamily: "var(--font-sans)" }}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setResults([]); setSearched(false); inputRef.current?.focus(); }}
                className="hidden md:inline-flex text-xs tracking-[0.15em] uppercase cursor-pointer shrink-0"
                style={{ color: "#8A8379" }}
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 border cursor-pointer shrink-0 transition-colors hover:bg-[rgba(164,134,98,0.08)]"
              style={{ borderColor: "#333333" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A554E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {!query && <p className="text-[#333333] text-[11px] tracking-wide pl-9">Type to search products, ingredients, and more</p>}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl py-8">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "#A48662", borderTopColor: "transparent" }} />
            </div>
          )}

          {!loading && searched && query.trim() && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#5A554E] text-sm mb-2">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-[#8A8379] text-xs">Try searching by product name, ingredient, or benefit</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <p className="text-[#8A8379] text-xs tracking-[0.15em] uppercase mb-5">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              <div className="space-y-1">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-[rgba(164,134,98,0.06)] rounded-lg"
                  >
                    {product.image && (
                      <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-[#EDE8DF] flex items-center justify-center">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                          style={{ mixBlendMode: "multiply" }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#2B2925" }}>
                        {product.name}
                      </p>
                      {product.subtitle && (
                        <p className="text-xs truncate mt-0.5" style={{ color: "#8A8379" }}>
                          {product.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        {product.category?.name && (
                          <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "#A48662" }}>
                            {product.category.name}
                          </span>
                        )}
                        {product.format && (
                          <span className="text-[10px]" style={{ color: "#8A8379" }}>
                            {product.format}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm shrink-0" style={{ color: "#2B2925" }}>
                      {formatPrice(product.price)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
