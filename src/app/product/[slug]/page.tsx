"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import { useCartStore } from "@/app/components/landing/cartStore";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import { normalizeImagePath } from "@/app/utils/normalizeImagePath";
import ProductImage from "@/app/components/landing/ProductImage";

const productGallery: Record<string, string[]> = {
  "shakti-peya": ["/Assets/shakti peya.avif", "/Assets/shakti peya product hd.png", "/Assets/shakti peya product display.png", "/Assets/shakti peya product clean.png", "/Assets/shakti peya product 1.png", "/Assets/shakti peya hover.png"],
  "chandra-rasa": ["/Assets/chandra rasa.avif", "/Assets/Chandra rasa product hd.webp", "/Assets/Chandra rasa product display.webp", "/Assets/Chandra rasa product clean.webp", "/Assets/Chandra rasa product 1.webp", "/Assets/chandra rasa hover.webp"],
  "shotharaha": ["/Assets/shakti peya product hd.png", "/Assets/shakti peya hover.png"],
  "rose": ["/Assets/rose hd.webp", "/Assets/rose new.webp", "/Assets/rose display.webp", "/Assets/rose clean.webp", "/Assets/Rose hover.webp", "/Assets/Sampriti Rose zoom out.png"],
  "hibiscus": ["/Assets/hibiscus hd.png", "/Assets/hibiscus new.png", "/Assets/hibiscus display.png", "/Assets/hibiscus clean.png", "/Assets/hibiscus hover.png"],
  "blue-butterfly-pea": ["/Assets/blue butterfly pea hd.webp", "/Assets/blue butterfly pea new.webp", "/Assets/blue butterfly pea display.webp", "/Assets/blue butterfly pea clean.webp", "/Assets/blue butterfly pea hover.webp"],
  "vatari": ["/Assets/hibiscus hd.png", "/Assets/hibiscus hover.png"],
  "kanti": ["/Assets/rose hd.webp", "/Assets/Rose hover.webp"],
  "blue-ojas": ["/Assets/blue butterfly pea hd.webp", "/Assets/blue butterfly pea hover.webp"],
  "the-sahane": ["/Assets/hibiscus hd.png", "/Assets/hibiscus hover.png"],
  "rakta-chandanam": ["/Assets/rose hd.webp", "/Assets/Rose hover.webp"],
  "shveta-chandanam": ["/Assets/blue butterfly pea hd.webp", "/Assets/blue butterfly pea hover.webp"],
  "parjanya": ["/Assets/hibiscus hd.png", "/Assets/hibiscus hover.png"],
  "jawa": ["/Assets/rose hd.webp", "/Assets/Rose hover.webp"],
  "kha": ["/Assets/blue butterfly pea hd.webp", "/Assets/blue butterfly pea hover.webp"],
  "sandalwood-shavings": ["/Assets/hibiscus hd.png", "/Assets/hibiscus hover.png"],
  "deodar-discs": ["/Assets/rose hd.webp", "/Assets/Rose hover.webp"],
  "black-sambrani": ["/Assets/blue butterfly pea hd.webp", "/Assets/blue butterfly pea hover.webp"],
};

type UsageDetail = {
  label: string;
  value: string;
};

type Product = {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  format?: string;
  image: string;
  hoverImage: string;
  benefits: string;
  description: string;
  aroma: string;
  suitedTo: string;
  keyIngredients: string;
  howToUse: string;
  usageDetails: UsageDetail[];
  essenceTitle: string;
  essence: string;
  createdAt?: string;
};

type ApiProduct = {
  slug: string;
  name: string;
  subtitle?: string;
  category?: { name?: string };
  price?: string | number;
  format?: string;
  image?: string;
  hoverImage?: string;
  benefits?: string;
  description?: string;
  aroma?: string;
  suitedTo?: string;
  keyIngredients?: string;
  howToUse?: string;
  usageDetails?: unknown;
  essenceTitle?: string;
  essence?: string;
  createdAt?: string;
};

const fallbackProducts: Product[] = [
  {
    id: "shakti-peya", name: "Shakti Peya", subtitle: "Energy Elixir",
    category: "Sampriti Botanicals",
    price: 54, format: "9 Test Tube Kit",
    image: "/Assets/shakti peya.avif", hoverImage: "/Assets/shakti peya hover.png",
    benefits: "Activation · Anti-Aging · Radiance",
    description: "Shakti Peya is designed to support sustained vitality, circulation, digestion, and metabolic balance. The formulation encourages steady energy, warmth, and resilience - without sharp stimulation or depletion.",
    aroma: "Warming, herbaceous, grounding",
    suitedTo: "Those seeking sustained energy, mental clarity, and metabolic balance",
    keyIngredients: "Cardamom, Coriander Seeds, Curry Leaves, Pomegranate Peel, Rose Damascus, Hibiscus, Bay Leaf, Cinnamon, Turmeric, Ginger, Lemon",
    howToUse: "The Ritual of Shakti Peya\n\nTo prepare this revitalizing infusion, begin by emptying the contents of a single test tube into two cups of fresh water. Bring to a rolling boil for two to three minutes, allowing the eleven botanical ingredients to release their essence, then turn off the heat and let the tea rest for three to four minutes to reach its full potency. Once brewed, strain the liquid into your cup to reveal its signature pink hue.\n\nBest Times to Enjoy\n\nMorning: Consume before breakfast to awaken your senses and the digestive fire.\nAfternoon: Enjoy during tea time for a natural, caffeine-free energy boost.\n\nDosage\n\nOne test tube per day",
    usageDetails: [
      { label: "Morning", value: "Consume before breakfast to awaken your senses and the digestive fire." },
      { label: "Afternoon", value: "Enjoy during tea time for a natural, caffeine-free energy boost." },
      { label: "Dosage", value: "One test tube per day" }
    ],
    essenceTitle: "Botanical Highlights",
    essence: "A calibrated botanical sequence designed to support metabolic vitality and digestive harmony by aiding in natural de-bloating and nutrient assimilation. This potent infusion provides a rich source of antioxidants to balance the body's inflammatory response, while assisting in hormonal equilibrium and the preservation of cellular longevity."
  },
  {
    id: "chandra-rasa",
    name: "Chandra Rasa",
    subtitle: "Sleep Potion",
    category: "Sampriti Botanicals",
    price: 54, format: "9 Test Tube Kit",
    image: "/Assets/chandra rasa.avif", hoverImage: "/Assets/chandra rasa hover.webp",
    benefits: "Calm · Settling · Restorative",
    description: "This botanical sequence provides comprehensive support for the parasympathetic nervous system, aiding in the reduction of cognitive noise and the stabilization of the stress response through adaptogenic modulation. It assists the body in establishing a consistent nighttime recovery cycle, supporting deeper sleep quality and the natural cellular repair processes essential for long-term neurological health.",
    aroma: "Calming, earthy, settling",
    suitedTo: "Those seeking restorative sleep and nervous system balance",
    keyIngredients: "Brahmi (Gotu Kola), Jatamansi, Ashwagandha, Licorice, Saffron, Rose Petals, Warm Milk",
    howToUse: "9 servings per kit.\n\nOur commitment to the earth is as deep as our commitment to your wellness. All Sampriti products are housed in recyclable glass test tubes with biodegradable cork stoppers. Our outer packaging is made from 100% post-consumer recycled paper and printed with soy-based inks. Please reuse or recycle thoughtfully.",
    usageDetails: [
      { label: "Servings", value: "9 servings per kit." }
    ],
    essenceTitle: "The Ritual of Chandra Rasa",
    essence: "To invite the restorative stillness of the evening, begin by emptying the contents of a single test tube into two cups of fresh water. Bring the blend to a rolling boil for two to three minutes, allowing the calming botanicals to fully release their essence, then turn off the heat and let the infusion rest for three to four minutes to reach its peak serenity. Once brewed, strain the liquid into your cup to reveal its deep, tranquil hue.\n\nChandra Rasa use\n\nBest Time to Enjoy\nThis soothing sleep potion is best enjoyed in the evening before bed, serving as a gentle transition into a state of profound relaxation and high-quality, calm sleep.\n\nThe carminative properties of Fennel and Peppermint ensure digestive ease and physical weightlessness, allowing the system to focus entirely on restorative rest and emotional recalibration without nocturnal interruption."
  },
  {
    id: "hibiscus",
    name: "Hibiscus",
    subtitle: "Rosa-Sinensis",
    category: "Sampriti Botanicals",
    price: 42,
    image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png", benefits: "",
    description: "A vibrant infusion of sun-drenched petals, known for its high antioxidant content and ability to support natural collagen production. This botanical essence revitalises the skin's appearance, lending a youthful radiance.",
    aroma: "Tart, floral, refreshing",
    suitedTo: "Those seeking cardiovascular support, radiant skin, and antioxidant protection",
    keyIngredients: "Organic Hibiscus Petals, Vitamin C, Anthocyanins",
    howToUse: "Our commitment to the earth is as deep as our commitment to your wellness. All Sampriti products are housed in recyclable glass test tubes with biodegradable cork stoppers. Our outer packaging is made from 100% post-consumer recycled paper and printed with soy-based inks. Please reuse or recycle thoughtfully.",
    usageDetails: [],
    essenceTitle: "A Botanical Antioxidant",
    essence: "The hibiscus flower has been revered across cultures for its remarkable concentration of anthocyanins and polyphenols. This infusion captures the essence of the bloom in its most bioavailable form, supporting cardiovascular health and radiant skin.\n\nHibiscus Rosa-Sinensis use"
  },
  {
    id: "rose",
    name: "Rose",
    subtitle: "Rosa Damascena",
    category: "Sampriti Botanicals",
    price: 42,
    image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", benefits: "",
    description: "Steam-distilled from hand-picked petals at dawn. A deeply hydrating and soothing essence that balances the skin's pH and calms the senses. This timeless botanical provides comfort and long-lasting moisture.",
    aroma: "Rich, floral, deeply comforting",
    suitedTo: "Those seeking hydration, emotional balance, and sensory refinement",
    keyIngredients: "Rosa Damascena Petals, Rosewater, Natural Essential Oils",
    howToUse: "Rose\n\nDissolve one serving in warm water or milk.\nSip slowly and mindfully.\nIdeal as an afternoon ritual or evening wind-down.",
    usageDetails: [],
    essenceTitle: "The Essence of Calm",
    essence: "Distilled from organically cultivated rose petals, this elixir carries centuries of botanical wisdom. Rose has long been associated with emotional equilibrium and gentle nervous system support - a potion for the heart and the mind alike.\n\nRose use"
  },
  {
    id: "blue-butterfly-pea",
    name: "Blue Butterfly Pea",
    subtitle: "Clitoria Ternatea",
    category: "Sampriti Botanicals",
    price: 42,
    image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", benefits: "",
    description: "A brilliant azure infusion rich in anthocyanins. Supports cognitive function and provides a powerful shield against environmental stressors. This antioxidant powerhouse promotes a calm, even tone.",
    aroma: "Subtle, earthy, naturally sweet",
    suitedTo: "Those seeking cognitive support, stress relief, and antioxidant protection",
    keyIngredients: "Butterfly Pea Flower Extract, Proanthocyanidins",
    howToUse: "Blue Butterfly Pea\n\nSteep one serving in hot water for 3-4 minutes to reveal the signature blue hue.\nAdd a squeeze of lemon to watch it transform to violet.\nEnjoy hot or iced throughout the day.",
    usageDetails: [],
    essenceTitle: "Nature's Chromatic Wonder",
    essence: "The striking blue pigment of Clitoria ternatea is more than visual spectacle - it is a marker of potent anthocyanin content. This flower has been used in Ayurvedic and Southeast Asian traditions for centuries to enhance cognitive function and promote tranquillity.\n\nBlue Butterfly Pea use"
  },
  {
    id: "black-turmeric",
    name: "Black Turmeric",
    subtitle: "Curcuma Caesia",
    category: "Sampriti Botanicals",
    price: 45,
    image: "/Assets/black turmeric hd.webp", hoverImage: "/Assets/black turmeric hover.webp", benefits: "",
    description: "A rare Kaya Kalpa agent for profound recovery and cellular longevity. Black Turmeric is revered in traditional medicine for its exceptional anti-inflammatory and rejuvenative properties.",
    aroma: "Deep, earthy, camphoraceous",
    suitedTo: "Those seeking cellular renewal, deep recovery, and longevity support",
    keyIngredients: "Black Turmeric Rhizome, Curcuminoids, Essential Volatile Oils",
    howToUse: "Black Turmeric\n\nDissolve one serving in warm water with a pinch of black pepper.\nBlack pepper enhances absorption of curcumin compounds.\nBest taken in the morning on an empty stomach.",
    usageDetails: [],
    essenceTitle: "Ancient Root, Modern Science",
    essence: "Black turmeric is among the rarest members of the Curcuma family. Its distinctive dark rhizome contains a unique profile of curcuminoids that far surpass common turmeric in bioactivity, offering profound anti-inflammatory and adaptogenic support.\n\nBlack Turmeric use"
  },
  {
    id: "shotharaha",
    name: "Shotharaha", subtitle: "Dual Black Recovery",
    category: "Restorative Infusion",
    price: 54, format: "9 Test Tube Kit",
    image: "/Assets/shakti peya product hd.png", hoverImage: "/Assets/shakti peya hover.png", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "vatari",
    name: "Vatari", subtitle: "Botanical Botox",
    category: "Skincare Ritual",
    price: 48, format: "Botanical Profile",
    image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "kanti",
    name: "Kanti", subtitle: "Red Radiance",
    category: "Skincare Ritual",
    price: 48, format: "Botanical Profile",
    image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "blue-ojas",
    name: "Blue Ojas", subtitle: "Vitality Concentrate",
    category: "Skincare Ritual",
    price: 48, format: "Botanical Profile",
    image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "the-sahane",
    name: "The Sahane", subtitle: "Stone",
    category: "Ceremony",
    price: 36, format: "",
    image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "rakta-chandanam",
    name: "Rakta Chandanam", subtitle: "Red Sandalwood",
    category: "Ceremony",
    price: 42, format: "",
    image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "shveta-chandanam",
    name: "Shveta Chandanam", subtitle: "White Sandalwood",
    category: "Ceremony",
    price: 42, format: "",
    image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "parjanya",
    name: "Parjanya", subtitle: "The First Rain",
    category: "Fragrance",
    price: 54, format: "Botanical Profile",
    image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "jawa",
    name: "Jawa", subtitle: "Embers",
    category: "Fragrance",
    price: 54, format: "Botanical Profile",
    image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "kha",
    name: "Kha", subtitle: "The Zero Point",
    category: "Fragrance",
    price: 54, format: "Botanical Profile",
    image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "sandalwood-shavings",
    name: "Sandalwood Shavings", subtitle: "",
    category: "Atmospheric",
    price: 28, format: "",
    image: "/Assets/hibiscus hd.png", hoverImage: "/Assets/hibiscus hover.png", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "deodar-discs",
    name: "Deodar Discs", subtitle: "",
    category: "Atmospheric",
    price: 28, format: "",
    image: "/Assets/rose hd.webp", hoverImage: "/Assets/Rose hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "black-sambrani",
    name: "Black Sambrani", subtitle: "",
    category: "Atmospheric",
    price: 28, format: "",
    image: "/Assets/blue butterfly pea hd.webp", hoverImage: "/Assets/blue butterfly pea hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  }
];

export default function ProductPage() {
  const params = useParams();
  const slug = decodeURIComponent((params.slug as string) || "");
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(fallbackProducts);
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(85);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [toast, setToast] = useState<string | null>(null);
  const [relatedSlide, setRelatedSlide] = useState(0);
  const [hoveredRelated, setHoveredRelated] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [thumbSlide, setThumbSlide] = useState(0);
  const galleryImages = product ? (productGallery[slug] || [product.image]) : [""];
  const maxThumbSlide = Math.max(0, galleryImages.length - 4);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setNotFound(false);

      const [settings] = await Promise.all([
        getSettings().catch(() => ({ currency: "INR", exchange_rate: "85" }))
      ]);
      if (settings?.currency) setCurrency(settings.currency);
      if (settings?.exchange_rate) setExchangeRate(parseFloat(settings.exchange_rate));

      const s = decodeURIComponent(slug || "").toLowerCase().trim();
      const fb = fallbackProducts.find((f) => f.id === s);
      let foundProduct: ApiProduct | null = null;

      if (s) {
        const slugRes = await api.get<ApiProduct>("/products/slug/" + encodeURIComponent(s));
        if (slugRes.status && slugRes.data) {
          foundProduct = slugRes.data;
        } else {
          const pRes = await api.get<ApiProduct[]>("/products");
          if (pRes.status && pRes.data?.length) {
            foundProduct = pRes.data.find((p) => {
              if (!p) return false;
              const apiSlug = (p.slug || "").toLowerCase().trim();
              const apiName = (p.name || "").toLowerCase().trim();
              return apiSlug === s || apiSlug.replace(/\s+/g, "-") === s || apiName === s || apiName.replace(/\s+/g, "-") === s;
            }) || null;
          }
        }
      }

      if (foundProduct) {
        const parseUsage = (val: unknown): UsageDetail[] => {
          if (typeof val === "string") try { val = JSON.parse(val); } catch { return []; }
          if (Array.isArray(val)) return val.map((v) => {
            const item = v && typeof v === "object" ? v as Record<string, unknown> : {};
            return {
              label: String(item.label || item.title || ""),
              value: String(item.value || item.desc || ""),
            };
          });
          return [];
        };
        const usageDetails = parseUsage(foundProduct.usageDetails);
        const normalizedImage = normalizeImagePath(foundProduct.image) || fb?.image || "";
        const normalizedHover = normalizeImagePath(foundProduct.hoverImage) || fb?.hoverImage || "";
        setProduct({
          id: foundProduct.slug,
          name: foundProduct.name || fb?.name || "",
          subtitle: foundProduct.subtitle || fb?.subtitle || "",
          category: foundProduct.category?.name || fb?.category || "",
          price: parseFloat(String(foundProduct.price || 0)) || fb?.price || 0,
          format: foundProduct.format || fb?.format || "",
          image: normalizedImage,
          description: foundProduct.description || fb?.description || "",
          benefits: foundProduct.benefits || fb?.benefits || "",
          aroma: foundProduct.aroma || fb?.aroma || "",
          suitedTo: foundProduct.suitedTo || fb?.suitedTo || "",
          keyIngredients: foundProduct.keyIngredients || fb?.keyIngredients || "",
          howToUse: foundProduct.howToUse || fb?.howToUse || "",
          essenceTitle: foundProduct.essenceTitle || fb?.essenceTitle || "",
          essence: foundProduct.essence || fb?.essence || "",
          usageDetails: usageDetails.length > 0 ? usageDetails : (fb?.usageDetails || []),
          hoverImage: normalizedHover,
        });
      } else if (fb) {
        setProduct(fb);
      } else {
        setNotFound(true);
      }

      const pRes = await api.get<ApiProduct[]>("/products");
      if (pRes.status && pRes.data?.length) {
        const merged: Product[] = pRes.data.map((p) => {
          const f = fallbackProducts.find(fb => fb.id === p.slug);
          return {
            id: p.slug,
            name: p.name || f?.name || "",
            subtitle: p.subtitle || f?.subtitle || "",
            category: p.category?.name || f?.category || "",
            price: parseFloat(String(p.price || 0)) || f?.price || 0,
            format: p.format || f?.format || "",
            image: normalizeImagePath(p.image) || f?.image || "",
            hoverImage: normalizeImagePath(p.hoverImage) || f?.hoverImage || "",
            description: p.description || f?.description || "",
            benefits: p.benefits || f?.benefits || "",
            aroma: f?.aroma || "", suitedTo: f?.suitedTo || "",
            keyIngredients: f?.keyIngredients || "", howToUse: f?.howToUse || "",
            essenceTitle: f?.essenceTitle || "", essence: f?.essence || "",
            usageDetails: f?.usageDetails || [],
            createdAt: p.createdAt,
          };
        });
        merged.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        setAllProducts(merged);
      }

      setLoading(false);
    })();
  }, [slug]);

  const relatedProducts = product ? allProducts.filter(p => p.id !== product.id) : [];
  const maxRelatedSlide = Math.max(0, relatedProducts.length - 4);

  const immersiveProducts = ["shakti-peya", "chandra-rasa"];
  const isImmersive = product ? immersiveProducts.includes(product.id) : false;
  const isShaktiPeya = product?.id === "shakti-peya";
  const heroImgClass = isImmersive
    ? "object-cover md:object-contain md:p-8"
    : "object-contain p-2 md:object-contain md:p-8";
  const storyImgClass = isImmersive
    ? "object-cover md:object-contain md:p-14 lg:p-16"
    : "object-contain p-4 md:object-contain md:p-14 lg:p-16";
  const storyContainerClass = isImmersive
  ? "relative overflow-hidden min-h-[340px] sm:min-h-[420px] md:min-h-[520px] bg-transparent md:bg-white"
  : "relative overflow-hidden min-h-[380px] md:min-h-[520px] bg-transparent md:bg-white";

  if (loading) {
    return (
      <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
        <Navbar forceScrolled={true} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A48662]"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
        <Navbar forceScrolled={true} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-4xl font-light text-[#2C2A26] mb-4" style={{ fontFamily: "var(--font-serif)" }}>Product Not Found</h1>
          <p className="text-[#5A554E] mb-8">The product you&#39;re looking for doesn&#39;t exist.</p>
          <Link href="/shop" className="bg-[#2C2A26] text-white px-8 py-3 text-xs tracking-[0.2em] hover:bg-black transition-all duration-300">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) return null;

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

          <div className="grid lg:grid-cols-2 gap-0 lg:gap-16">

            {/* "" Hero Product Image with Gallery """"""""""""""""""""""""""" */}
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
                        <button key={i} onClick={() => setGalleryIndex(i)} className={`relative flex-shrink-0 w-[calc(25%-9px)] aspect-square rounded-lg overflow-hidden border bg-white transition-all cursor-pointer ${i === galleryIndex ? "border-[#A48662] ring-1 ring-[#A48662]" : "border-gray-200 hover:border-gray-400"}`}>
                          <ProductImage src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* "" Product Info """"""""""""""""""""""""""""""""""""""""""""" */}
            <div>
              <p className="text-[#A48662] text-xs tracking-[0.3em] uppercase mb-3">{product.category}</p>
              <h1 className="text-[#2C2A26] text-4xl md:text-5xl font-light mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                {product.name}
              </h1>
              <p className="text-[#5A554E] text-lg mb-6">{product.subtitle}</p>
              {isShaktiPeya && product.description && (
                <p className="text-[#5A554E] leading-relaxed mb-6">{product.description}</p>
              )}
              {!isShaktiPeya && product.benefits && (
                <p className="text-[#5A554E] text-lg mb-6">{product.benefits}</p>
              )}
              {product.format && (
                <p className="text-[#5A554E] mb-6">{product.format}</p>
              )}
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
                      {tab === "howToUse" ? "Servings" : tab === "ingredients" ? "Ingredients" : tab}
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
                    {product.usageDetails.map((item: UsageDetail, i: number) => (
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

          {/* "" Product Detail Story """"""""""""""""""""""""""""""""""""""""" */}
          <div className="mt-24 border-y border-[#E5DCCF]">

            {/* Panel 1 " Image left, text right */}
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

            {/* Panel 2 " Text left, image right */}
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
                    How to Use
                  </h2>
                  <p className="leading-[1.85] text-[#5A554E] whitespace-pre-line">
                    {product.howToUse}
                  </p>
                  <div className="mt-8 border-t border-[#E5DCCF]">
                    {product.usageDetails.map((item: UsageDetail, idx: number) => (
                      <div key={`${item.label}-${item.value}-${idx}`}
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

          {/* Botanical Highlights / Essence */}
          {/* "" You may also like """"""""""""""""""""""""""""""""""""""""""" */}
          {relatedProducts.length > 0 && (
            <div className="mt-24 mb-16">
              <h2 className="text-[#2C2A26] text-2xl md:text-3xl font-light mb-10 text-center" style={{ fontFamily: "var(--font-serif)" }}>
                You may also like
              </h2>

              {/* Mobile/Tablet: Grid (no arrows) */}
              <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {relatedProducts.map((related) => (
                  <div key={related.id} className="group text-center flex flex-col h-full"
                    onMouseEnter={() => setHoveredRelated(related.id)}
                    onMouseLeave={() => setHoveredRelated(null)}
                  >
                    <Link href={`/product/${related.id}`} className="block">
                      <div className="relative aspect-square bg-white mb-3 overflow-hidden">
                        <ProductImage src={hoveredRelated === related.id && related.hoverImage ? related.hoverImage : related.image} alt={related.name} fill className="object-contain" />
                      </div>
                      <h3 className="text-[#2C2A26] text-sm md:text-lg font-light leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{related.name}</h3>
                      {related.description && <p className="mx-auto mt-2 text-xs md:text-sm leading-relaxed text-[#8A847C]">{related.description}</p>}
                      <p className="text-[#A48662] text-xs md:text-base mt-1 mb-3">{formatPrice(related.price, currency, exchangeRate)}</p>
                    </Link>
                    <button
                      onClick={() => {
                        addItem({ id: related.id, name: related.name, price: related.price, image: related.image, quantity: 1 });
                        setToast(related.name);
                        setTimeout(() => setToast(null), 2000);
                        openCart();
                      }}
                      className="mt-auto bg-[#262420] text-[#F9F7F3] px-8 py-2 text-[10px] md:text-xs tracking-[0.15em] hover:bg-black transition-all duration-300 cursor-pointer"
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
                  <div className="flex gap-5 transition-transform duration-500" style={{ transform: "translateX(-" + (relatedSlide * 25) + "%)" }}>
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
                          {related.description && <p className="mx-auto mt-2 text-sm leading-relaxed text-[#8A847C]">{related.description}</p>}
                          <p className="text-[#A48662] text-base mt-1 mb-4">{formatPrice(related.price, currency, exchangeRate)}</p>
                        </Link>
                        <button
                          onClick={() => {
                            addItem({ id: related.id, name: related.name, price: related.price, image: related.image, quantity: 1 });
                            setToast(related.name);
                            setTimeout(() => setToast(null), 2000);
                            openCart();
                          }}
                          className="bg-[#262420] text-[#F9F7F3] px-8 py-2 text-xs tracking-[0.15em] hover:bg-black transition-all duration-300 cursor-pointer"
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
