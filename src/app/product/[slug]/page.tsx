"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import { useCartStore } from "@/app/components/landing/cartStore";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import ProductImage from "@/app/components/landing/ProductImage";

const productGallery: Record<string, string[]> = {
  "shakti-peya": ["/Assets/shakti peya.avif", "/Assets/shakti peya product hd.png", "/Assets/shakti peya product display.png", "/Assets/shakti peya product clean.png", "/Assets/shakti peya product 1.png", "/Assets/shakti peya hover.png"],
  "chandra-rasa": ["/Assets/chandra rasa.avif", "/Assets/Chandra rasa product hd.webp", "/Assets/Chandra rasa product display.webp", "/Assets/Chandra rasa product clean.webp", "/Assets/Chandra rasa product 1.webp", "/Assets/chandra rasa hover.webp"],
  "hibiscus": ["/Assets/hibiscus hd.png", "/Assets/hibiscus new.png", "/Assets/hibiscus display.png", "/Assets/hibiscus clean.png", "/Assets/hibiscus hover.png"],
  "rose": ["/Assets/rose hd.webp", "/Assets/rose new.webp", "/Assets/rose display.webp", "/Assets/rose clean.webp", "/Assets/Rose hover.webp", "/Assets/Sampriti Rose zoom out.png"],
  "blue-butterfly-pea": ["/Assets/blue butterfly pea hd.webp", "/Assets/blue butterfly pea new.webp", "/Assets/blue butterfly pea display.webp", "/Assets/blue butterfly pea clean.webp", "/Assets/blue butterfly pea hover.webp"],
  "black-turmeric": ["/Assets/black turmeric hd.webp", "/Assets/black turmeric new.webp", "/Assets/black turmeric display.webp", "/Assets/black turmeric clean.webp", "/Assets/black turmeric hover.webp", "/Assets/Black Turmeric Side display.webp"],
};

const fallbackProducts = [
  {
    id: "shakti-peya", name: "Shakti Peya", subtitle: "Energy Elixir",
    category: "Activation / Anti-Aging / Radiance",
    price: 54,
    image: "/Assets/shakti peya.avif", hoverImage: "/Assets/shakti peya hover.png", benefits: "",
    description: "Shakti Peya is designed to support sustained vitality, circulation, digestion, and metabolic balance. The formulation encourages steady energy, warmth, and resilience - without sharp stimulation or depletion.",
    aroma: "Warming, herbaceous, grounding",
    suitedTo: "Those seeking sustained energy, mental clarity, and metabolic balance",
    keyIngredients: "Cardamom, Coriander Seeds, Curry Leaves, Pomegranate Peel, Rose, Hibiscus, Bay Leaf, Cinnamon, Turmeric, Ginger, Lemon",
    howToUse: "To prepare this revitalizing infusion, begin by emptying the contents of a single test tube into two cups of fresh water. Bring to a rolling boil for two to three minutes, allowing the eleven botanical ingredients to release their essence, then turn off the heat and let the tea rest for three to four minutes to reach its full potency.",
    usageDetails: [
      { label: "Serving", value: "One test tube with two cups of fresh water" },
      { label: "Preparation", value: "Bring to a rolling boil for two to three minutes" },
      { label: "Resting time", value: "Allow the botanicals to settle for three to four minutes" },
      { label: "Best time", value: "Morning or midday, when sustained activation is desired" }
    ],
    essenceTitle: "The Essence of Activation",
    essence: "A calibrated botanical sequence designed to support metabolic vitality and digestive harmony. This potent infusion provides a rich source of antioxidants to balance the body's inflammatory response, while assisting in hormonal equilibrium and the preservation of cellular longevity."
  },
  {
    id: "chandra-rasa",
    name: "Chandra Rasa",
    subtitle: "Sleep Potion",
    category: "Calm / Settling / Restorative",
    price: 54,
    image: "/Assets/chandra rasa.avif", hoverImage: "/Assets/chandra rasa hover.webp", benefits: "",
    description: "A nocturnal composition for the quiet transition into rest, crafted to support calm and restoration. This botanical sequence provides comprehensive support for the parasympathetic nervous system.",
    aroma: "Calming, earthy, settling",
    suitedTo: "Those seeking restorative sleep and nervous system balance",
    keyIngredients: "Sarpagandha, Blue Butterfly Pea, Cloves, Fennel, Licorice, Jatamansi, Brahmi, Ashwagandha, Peppermint",
    howToUse: "To invite the restorative stillness of the evening, begin by emptying the contents of a single test tube into two cups of fresh water. Bring the blend to a rolling boil for two to three minutes, allowing the calming botanicals to fully release their essence, then turn off the heat and let the infusion rest for three to four minutes to reach its peak serenity.",
    usageDetails: [
      { label: "Serving", value: "One test tube with two cups of fresh water" },
      { label: "Preparation", value: "Bring to a rolling boil for two to three minutes" },
      { label: "Resting time", value: "Let the infusion rest for three to four minutes" },
      { label: "Best time", value: "Evening, ideally 30 to 45 minutes before rest" }
    ],
    essenceTitle: "The Essence of Rest",
    essence: "The carminative properties of Fennel and Peppermint ensure digestive ease and physical weightlessness, allowing the system to focus entirely on restorative rest and emotional recalibration without nocturnal interruption."
  },
  {
    id: "hibiscus",
    name: "Hibiscus",
    subtitle: "Rosa-Sinensis",
    category: "Antioxidant Infusion",
    price: 42,
    image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png", benefits: "",
    description: "A vibrant infusion of sun-drenched petals, known for its high antioxidant content and ability to support natural collagen production. This botanical essence revitalises the skin's appearance, lending a youthful radiance.",
    aroma: "Tart, floral, refreshing",
    suitedTo: "Those seeking cardiovascular support and radiant skin",
    keyIngredients: "Organic Hibiscus Petals, Vitamin C, Anthocyanins",
    howToUse: "Steep one serving in hot water for 4–5 minutes. May be enjoyed hot or chilled over ice. Add honey to taste if desired.",
    usageDetails: [
      { label: "Serving", value: "One serving in a cup or teapot" },
      { label: "Preparation", value: "Pour hot water over the petals" },
      { label: "Steeping time", value: "Four to five minutes" },
      { label: "Finish", value: "Enjoy warm, or chill over ice with honey if desired" }
    ],
    essenceTitle: "The Crimson Catalyst",
    essence: "Hibiscus has been revered across cultures for its remarkable concentration of anthocyanins and polyphenols. This infusion captures the essence of the bloom in its most bioavailable form, supporting cardiovascular health and radiant skin."
  },
  {
    id: "rose",
    name: "Rose",
    subtitle: "Rosa Damascena",
    category: "Hydrating Essence",
    price: 42,
    image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", benefits: "",
    description: "Steam-distilled from hand-picked petals at dawn. A deeply hydrating and soothing essence that balances the skin's pH and calms the senses. This timeless botanical provides comfort and long-lasting moisture.",
    aroma: "Rich, floral, deeply comforting",
    suitedTo: "Those seeking hydration, emotional balance, and sensory refinement",
    keyIngredients: "Rosa Damascena Petals, Rosewater, Natural Essential Oils",
    howToUse: "Dissolve one serving in warm water or milk.\nSip slowly and mindfully.\nIdeal as an afternoon ritual or evening wind-down.",
    usageDetails: [
      { label: "Serving", value: "One serving in warm water or milk" },
      { label: "Preparation", value: "Stir until fully dissolved and aromatic" },
      { label: "Ritual", value: "Sip slowly and mindfully" },
      { label: "Best time", value: "Afternoon pause or gentle evening wind-down" }
    ],
    essenceTitle: "The Essence of Calm",
    essence: "Distilled from organically cultivated rose petals, this elixir carries centuries of botanical wisdom. Rose has long been associated with emotional equilibrium and gentle nervous system support — a potion for the heart and the mind alike."
  },
  {
    id: "blue-butterfly-pea",
    name: "Blue Butterfly Pea",
    subtitle: "Clitoria Ternatea",
    category: "Azure Infusion",
    price: 42,
    image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", benefits: "",
    description: "A brilliant azure infusion rich in anthocyanins. Supports cognitive function and provides a powerful shield against environmental stressors. This antioxidant powerhouse promotes a calm, even tone.",
    aroma: "Subtle, earthy, naturally sweet",
    suitedTo: "Those seeking cognitive support and stress relief",
    keyIngredients: "Butterfly Pea Flower Extract, Proanthocyanidins",
    howToUse: "Steep one serving in hot water for 3–4 minutes to reveal the signature blue hue. Add a squeeze of lemon to watch it transform to violet. Enjoy hot or iced throughout the day.",
    usageDetails: [
      { label: "Serving", value: "One serving in hot water" },
      { label: "Steeping time", value: "Three to four minutes, until the blue hue develops" },
      { label: "Optional", value: "Add lemon to shift the infusion toward violet" },
      { label: "Finish", value: "Enjoy hot for calm focus, or pour over ice" }
    ],
    essenceTitle: "The Azure Elixir",
    essence: "The striking blue pigment of Clitoria ternatea is more than visual spectacle — it is a marker of potent anthocyanin content. This flower has been used in Ayurvedic traditions for centuries to enhance cognitive function and promote tranquility."
  },
  {
    id: "black-turmeric",
    name: "Black Turmeric",
    subtitle: "Curcuma Caesia",
    category: "Kaya Kalpa Agent",
    price: 45,
    image: "/Assets/black turmeric hd.webp", hoverImage: "/Assets/black turmeric hover.webp", benefits: "",
    description: "A rare Kaya Kalpa agent for profound recovery and cellular longevity. Black Turmeric is revered in traditional medicine for its exceptional anti-inflammatory and rejuvenative properties.",
    aroma: "Deep, earthy, camphoraceous",
    suitedTo: "Those seeking cellular renewal and deep recovery",
    keyIngredients: "Black Turmeric Rhizome, Curcuminoids, Essential Volatile Oils",
    howToUse: "Dissolve one serving in warm water with a pinch of black pepper. Black pepper enhances absorption of curcumin compounds. Best taken in the morning on an empty stomach.",
    usageDetails: [
      { label: "Serving", value: "One serving in warm water" },
      { label: "Preparation", value: "Add a small pinch of black pepper and stir until dissolved" },
      { label: "Purpose", value: "Black pepper supports absorption of curcumin compounds" },
      { label: "Best time", value: "Morning on an empty stomach, unless your routine requires otherwise" }
    ],
    essenceTitle: "The Shadow Catalyst",
    essence: "Black turmeric is among the rarest members of the Curcuma family. Its distinctive dark rhizome contains a unique profile of curcuminoids that far surpass common turmeric in bioactivity, offering profound anti-inflammatory and adaptogenic support."
  }
];

export default function ProductPage() {
  const params = useParams();
  const slug = decodeURIComponent((params.slug as string) || "");
  const [product, setProduct] = useState(fallbackProducts.find((p) => p.id === slug) || fallbackProducts[0]);
  const [allProducts, setAllProducts] = useState(fallbackProducts);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [toast, setToast] = useState<string | null>(null);
  const [relatedSlide, setRelatedSlide] = useState(0);
  const [hoveredRelated, setHoveredRelated] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [thumbSlide, setThumbSlide] = useState(0);
  const galleryImages = productGallery[slug] || [product.image];
  const maxThumbSlide = Math.max(0, galleryImages.length - 4);

  useEffect(() => {
    (async () => {
      const [pRes, settings] = await Promise.all([
        api.get<any[]>("/products"),
        getSettings().catch(() => ({ currency: "INR", exchange_rate: "85" }))
      ]);
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));
      if (pRes.status && pRes.data?.length) {
        const fbMap = new Map(fallbackProducts.map(f => [f.id, f]));
        const s = decodeURIComponent(slug || "").toLowerCase().trim();
        const apiProduct = s ? pRes.data.find((p: any) => {
          if (!p) return false;
          const apiSlug = (p.slug || "").toLowerCase().trim();
          const apiName = (p.name || "").toLowerCase().trim();
          return apiSlug === s ||
                 apiSlug.replace(/\s+/g, "-") === s ||
                 String(p.id) === slug ||
                 Number(p.id) === Number(slug) ||
                 apiName === s ||
                 apiName.replace(/\s+/g, "-") === s;
        }) : null;
        const fb = apiProduct ? fbMap.get(apiProduct.slug) : null;
        if (apiProduct) {
          const parseUsage = (val: any) => {
            if (typeof val === "string") try { val = JSON.parse(val); } catch { return []; }
            if (Array.isArray(val)) return val.map((v: any) => ({
              label: v.label || v.title || "",
              value: v.value || v.desc || "",
            }));
            return [];
          };
          const usageDetails = parseUsage(apiProduct.usageDetails);
          setProduct({
            id: apiProduct.slug, name: apiProduct.name,
            subtitle: apiProduct.subtitle || fb?.subtitle || "",
            category: apiProduct.category?.name || fb?.category || "",
            price: parseFloat(apiProduct.price) || fb?.price || 0,
            image: fb ? fb.image : (apiProduct.image || ""),
            description: apiProduct.description || fb?.description || "",
            benefits: apiProduct.benefits || fb?.benefits || "",
            aroma: apiProduct.aroma || fb?.aroma || "",
            suitedTo: apiProduct.suitedTo || fb?.suitedTo || "",
            keyIngredients: apiProduct.keyIngredients || fb?.keyIngredients || "",
            howToUse: apiProduct.howToUse || fb?.howToUse || "",
            essenceTitle: apiProduct.essenceTitle || fb?.essenceTitle || "",
            essence: apiProduct.essence || fb?.essence || "",
            usageDetails: usageDetails.length > 0 ? usageDetails : (fb?.usageDetails || []),
            hoverImage: apiProduct.hoverImage || "",
          });
        }
        const merged = pRes.data.map((p: any) => {
          const f = fbMap.get(p.slug);
          const def = fallbackProducts[0];
          return {
            id: p.slug, name: p.name, subtitle: p.subtitle || f?.subtitle || "",
            category: p.category?.name || f?.category || "",
            price: parseFloat(p.price) || (f?.price ?? 0),
            image: f ? f.image : (p.image || def.image),
            hoverImage: f ? f.hoverImage : (p.hoverImage || ""),
            description: p.description || f?.description || "",
            benefits: p.benefits || f?.benefits || "",
            aroma: f?.aroma || "", suitedTo: f?.suitedTo || "",
            keyIngredients: f?.keyIngredients || "", howToUse: f?.howToUse || "",
            essenceTitle: f?.essenceTitle || "", essence: f?.essence || "",
            usageDetails: p.usageDetails || f?.usageDetails || [],
            createdAt: p.createdAt,
          };
        });
        merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setAllProducts(merged);
      }
    })();
  }, [slug]);

  const relatedProducts = allProducts.filter(p => p.id !== product.id);
  const maxRelatedSlide = Math.max(0, relatedProducts.length - 4);

  const immersiveProducts = ["shakti-peya", "chandra-rasa"];
  const isImmersive = immersiveProducts.includes(product.id);
  const heroImgClass = isImmersive
    ? "object-cover md:object-contain md:p-8"
    : "object-contain p-2 md:object-contain md:p-8";
  const storyImgClass = isImmersive
    ? "object-cover md:object-contain md:p-14 lg:p-16"
    : "object-contain p-4 md:object-contain md:p-14 lg:p-16";
  const storyContainerClass = isImmersive
  ? "relative overflow-hidden min-h-[340px] sm:min-h-[420px] md:min-h-[520px] bg-transparent md:bg-white"
  : "relative overflow-hidden min-h-[380px] md:min-h-[520px] bg-transparent md:bg-white";

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity });
    setToast(product.name);
    setTimeout(() => setToast(null), 2000);
    openCart();
  };

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled={true} />

      <div className="px-0 pb-16 pt-32 md:pt-44 lg:pt-52">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#5A554E]">
              <Link href="/" className="hover:text-[#2C2A26]">HOME</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-[#2C2A26]">SHOP</Link>
              <span>/</span>
              <span className="text-[#2C2A26]">{product.name}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-0 lg:gap-16">

            {/* ── Hero Product Image with Gallery ─────────────────────────── */}
            <div>
              <div className="relative aspect-square bg-white overflow-hidden">
                <ProductImage
                  src={galleryImages[galleryIndex]}
                  alt={product.name}
                  fill
                  priority
                  className={heroImgClass}
                />
              </div>
              {galleryImages.length > 1 && (
                <div className="relative mt-4">
                  <button onClick={() => setThumbSlide(Math.max(0, thumbSlide - 1))} disabled={thumbSlide === 0} className="absolute max-lg:-left-4 lg:-left-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer border border-gray-200">
                    <ChevronLeft size={16} className="text-[#2C2A26]" />
                  </button>
                  <button onClick={() => setThumbSlide(Math.min(maxThumbSlide, thumbSlide + 1))} disabled={thumbSlide >= maxThumbSlide} className="absolute max-lg:-right-4 lg:-right-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer border border-gray-200">
                    <ChevronRight size={16} className="text-[#2C2A26]" />
                  </button>
                  <div className="overflow-hidden bg-white">
                    <div className="flex gap-3 transition-transform duration-400" style={{ transform: `translateX(-${thumbSlide * 25}%)` }}>
                      {galleryImages.map((img, i) => (
                        <button key={i} onClick={() => setGalleryIndex(i)} className={`flex-shrink-0 w-[calc(25%-9px)] aspect-square rounded-lg overflow-hidden border bg-white transition-all cursor-pointer ${i === galleryIndex ? "border-[#A48662] ring-1 ring-[#A48662]" : "border-gray-200 hover:border-gray-400"}`}>
                          <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Product Info ───────────────────────────────────────────── */}
            <div>
              <p className="text-[#A48662] text-xs tracking-[0.3em] uppercase mb-3">{product.category}</p>
              <h1 className="text-[#2C2A26] text-4xl md:text-5xl font-light mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                {product.name}
              </h1>
              <p className="text-[#5A554E] text-lg mb-6">{product.subtitle}</p>
              <p className="text-[#2C2A26] text-3xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>{formatPrice(product.price, currency, exchangeRate)}</p>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-3 mb-6">
                <div className="flex items-center gap-0 border border-[#E5DCCF] flex-shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 md:w-12 md:h-12 text-[#5A554E] hover:text-[#2C2A26] cursor-pointer text-sm">−</button>
                  <span className="text-[#2C2A26] w-8 text-center text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 md:w-12 md:h-12 text-[#5A554E] hover:text-[#2C2A26] cursor-pointer text-lg">+</button>
                </div>
                <button onClick={handleAddToCart} className="flex-1 bg-[#2C2A26] text-white px-6 py-4 text-xs tracking-[0.2em] hover:bg-black transition-all duration-300 cursor-pointer whitespace-nowrap">
                  Add To Cart
                </button>
              </div>

              {/* Tabs */}
              <div className="border-t border-[#E5DCCF]">
                <div className="flex gap-4 md:gap-8 border-b border-[#E5DCCF]">
                  {["description", "ingredients", "howToUse"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`py-4 text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase cursor-pointer ${activeTab === tab ? "text-[#A48662] border-b-2 border-[#A48662]" : "text-[#5A554E] hover:text-[#2C2A26]"}`}>
                      {tab === "howToUse" ? "Servings" : tab === "ingredients" ? "Key ingredients" : tab}
                    </button>
                  ))}
                </div>
                <div className="py-6">
                  {activeTab === "description" && (
                    <div className="space-y-4">
                      <p className="text-[#5A554E] leading-relaxed">{product.description}</p>
                      {product.benefits && <p className="text-[#5A554E]"><strong>Benefits:</strong> {product.benefits}</p>}
                      <p className="text-[#5A554E]"><strong>Aroma:</strong> {product.aroma}</p>
                      <p className="text-[#5A554E]"><strong>Suited to:</strong> {product.suitedTo}</p>
                    </div>
                  )}
                  {activeTab === "ingredients" && (
                    <div className="space-y-4">
                      <p className="text-[#5A554E] leading-relaxed"><strong>Key ingredients:</strong> {product.keyIngredients}</p>
                    </div>
                  )}
                  {activeTab === "howToUse" && (
                    <div className="space-y-4">
                      <p className="text-[#5A554E] leading-relaxed whitespace-pre-line">{product.howToUse}</p>
                      {product.usageDetails?.length > 0 && (
                        <div className="pt-4 border-t border-[#E5DCCF] space-y-3">
                          {product.usageDetails.map((item: any) => (
                            <div key={item.label} className="flex gap-2">
                              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#2C2A26] min-w-[100px]">{item.label}:</span>
                              <span className="text-sm text-[#5A554E]">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-[#E5DCCF] space-y-4">
                <div className="flex items-center gap-3 text-[#5A554E] text-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  100% Natural & Cruelty-Free
                </div>
                <div className="flex items-center gap-3 text-[#5A554E] text-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  Free Shipping on Orders Over $100
                </div>
              </div>
            </div>
          </div>

          {/* ── Product Detail Story ───────────────────────────────────────── */}
          <div className="mt-24 border-y border-[#E5DCCF]">

            {/* Panel 1 — Image left, text right */}
            <section className="grid border-b border-[#E5DCCF] lg:grid-cols-2">
              <div className={storyContainerClass}>
                <ProductImage
                  src={product.image}
                  alt={`${product.name} ritual formulation`}
                  fill
                  priority
                  className={storyImgClass}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex items-center px-6 py-14 md:px-14 lg:px-20">
                <div className="max-w-xl">
                  <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-[#A48662]">
                    {product.category}
                  </p>
                  <h2
                    className="mb-6 text-3xl font-light leading-tight text-[#2C2A26] md:text-4xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {product.essenceTitle}
                  </h2>
                  <p className="leading-[1.85] text-[#5A554E]">
                    {product.description}
                  </p>
                  <div className="mt-8 border-t border-[#E5DCCF]">
                    <div className="grid gap-2 border-b border-[#E5DCCF] py-4 md:grid-cols-[140px_1fr]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2C2A26]">Aroma</p>
                      <p className="text-sm leading-relaxed text-[#5A554E]">{product.aroma}</p>
                    </div>
                    <div className="grid gap-2 border-b border-[#E5DCCF] py-4 md:grid-cols-[140px_1fr]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2C2A26]">Suited to</p>
                      <p className="text-sm leading-relaxed text-[#5A554E]">{product.suitedTo}</p>
                    </div>
                    <div className="grid gap-2 border-b border-[#E5DCCF] py-4 md:grid-cols-[140px_1fr]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2C2A26]">Benefits</p>
                      <p className="text-sm leading-relaxed text-[#5A554E]">{product.benefits}</p>
                    </div>
                    <div className="grid gap-2 border-b border-[#E5DCCF] py-4 md:grid-cols-[140px_1fr]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2C2A26]">Key ingredients</p>
                      <p className="text-sm leading-relaxed text-[#5A554E]">{product.keyIngredients}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Panel 2 — Text left, image right */}
            <section className="grid lg:grid-cols-2">
              <div className="flex items-center px-6 py-14 md:px-14 lg:px-20">
                <div className="max-w-xl">
                  <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-[#A48662]">
                    Ritual method
                  </p>
                  <h2
                    className="mb-6 text-3xl font-light leading-tight text-[#2C2A26] md:text-4xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    How to use
                  </h2>
                  <p className="leading-[1.85] text-[#5A554E] whitespace-pre-line">
                    {product.howToUse}
                  </p>
                  <div className="mt-8 border-t border-[#E5DCCF]">
                    {product.usageDetails.map((item) => (
                      <div key={item.label}
                        className="grid gap-2 border-b border-[#E5DCCF] py-4 md:grid-cols-[140px_1fr]"
                      >
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2C2A26]">{item.label}</p>
                        <p className="text-sm leading-relaxed text-[#5A554E]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={storyContainerClass}>
                <ProductImage
                  src={product.image}
                  alt={`${product.name} preparation ritual`}
                  fill
                  priority
                  className={storyImgClass}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </section>

          </div>

          {/* ── Botanical Highlights / Essence ────────────────────────────── */}
          <div className="mt-24">
            <h2 className="text-[#2C2A26] text-2xl md:text-3xl font-light mb-6 text-center" style={{ fontFamily: "var(--font-serif)" }}>
              {product.essenceTitle}
            </h2>
            <p className="text-[#5A554E] max-w-2xl mx-auto leading-relaxed text-center">
              {product.essence}
            </p>
          </div>

          {/* ── You may also like ─────────────────────────────────────────── */}
          {relatedProducts.length > 0 && (
            <div className="mt-24 mb-16">
              <h2 className="text-[#2C2A26] text-2xl md:text-3xl font-light mb-10 text-center" style={{ fontFamily: "var(--font-serif)" }}>
                You may also like
              </h2>

              {/* Mobile/Tablet: Grid (no arrows) */}
              <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {relatedProducts.map((related) => (
                  <div key={related.id} className="group text-center flex flex-col"
                    onMouseEnter={() => setHoveredRelated(related.id)}
                    onMouseLeave={() => setHoveredRelated(null)}
                  >
                    <Link href={`/product/${related.id}`} className="block">
                      <div className="relative aspect-square bg-white mb-3 overflow-hidden">
                        <ProductImage src={hoveredRelated === related.id && related.hoverImage ? related.hoverImage : related.image} alt={related.name} fill className="object-contain" />
                      </div>
                      <h3 className="text-[#2C2A26] text-sm md:text-lg font-light leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{related.name}</h3>
                      <p className="text-[#A48662] text-xs md:text-base mt-1 mb-3">{formatPrice(related.price, currency, exchangeRate)}</p>
                    </Link>
                    <button
                      onClick={() => {
                        addItem({ id: related.id, name: related.name, price: related.price, image: related.image, quantity: 1 });
                        setToast(related.name);
                        setTimeout(() => setToast(null), 2000);
                        openCart();
                      }}
                      className="w-full bg-[#262420] text-[#F9F7F3] px-3 py-2 text-[10px] md:text-xs tracking-[0.15em] hover:bg-black transition-all duration-300 cursor-pointer"
                    >
                      Add To Cart
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop: Carousel with arrows */}
              <div className="hidden lg:block relative -mx-4 sm:-mx-6 lg:-mx-8">
                <button onClick={() => setRelatedSlide(Math.max(0, relatedSlide - 1))} disabled={relatedSlide === 0} className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border border-gray-200">
                  <ChevronLeft size={20} className="text-[#2C2A26]" />
                </button>
                <button onClick={() => setRelatedSlide(Math.min(maxRelatedSlide, relatedSlide + 1))} disabled={relatedSlide >= maxRelatedSlide} className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border border-gray-200">
                  <ChevronRight size={20} className="text-[#2C2A26]" />
                </button>
                <div className="overflow-hidden">
                  <div className="flex gap-5 transition-transform duration-500" style={{ transform: `translateX(-${relatedSlide * 25}%)` }}>
                    {relatedProducts.map((related) => (
                      <div key={related.id} className="group text-center flex flex-col min-w-[calc(25%-15px)]"
                        onMouseEnter={() => setHoveredRelated(related.id)}
                        onMouseLeave={() => setHoveredRelated(null)}
                      >
                        <Link href={`/product/${related.id}`} className="block">
                          <div className="relative aspect-square bg-white mb-4 overflow-hidden">
                            <ProductImage src={hoveredRelated === related.id && related.hoverImage ? related.hoverImage : related.image} alt={related.name} fill className="object-contain" />
                          </div>
                          <h3 className="text-[#2C2A26] text-xl font-light" style={{ fontFamily: "var(--font-serif)" }}>{related.name}</h3>
                          <p className="text-[#A48662] text-base mt-1 mb-4">{formatPrice(related.price, currency, exchangeRate)}</p>
                        </Link>
                        <button
                          onClick={() => {
                            addItem({ id: related.id, name: related.name, price: related.price, image: related.image, quantity: 1 });
                            setToast(related.name);
                            setTimeout(() => setToast(null), 2000);
                            openCart();
                          }}
                          className="w-[calc(100%-24px)] mx-3 bg-[#262420] text-[#F9F7F3] px-5 py-2 text-xs tracking-[0.15em] hover:bg-black transition-all duration-300 cursor-pointer"
                        >
                          Add To Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      

      {toast && (
        <div className="fixed bottom-8 right-8 bg-[#2C2A26] text-white px-6 py-4 z-50">
          <p className="text-sm">{toast} added to cart</p>
        </div>
      )}

      <Footer />
    </main>
  );
}