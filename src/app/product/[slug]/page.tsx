"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import { useCartStore } from "@/app/components/landing/cartStore";
import SaveButton from "@/app/components/landing/SaveButton";
import { api } from "@/services/api.client";
import { formatPrice, getSettings } from "@/services/settings";
import { normalizeImagePath } from "@/app/utils/normalizeImagePath";
import ProductImage from "@/app/components/landing/ProductImage";

const productGallery: Record<string, string[]> = {
  "shakti-peya": ["/assets/shakti peya.webp", "/assets/shakti peya product hd.webp", "/assets/shakti peya product display.webp", "/assets/shakti peya product clean.webp", "/assets/shakti peya product 1.webp", "/assets/shakti peya hover.webp"],
  "chandra-rasa": ["/assets/chandra rasa.webp", "/assets/Chandra rasa product hd.webp", "/assets/Chandra rasa product display.webp", "/assets/Chandra rasa product clean.webp", "/assets/Chandra rasa product 1.webp", "/assets/chandra rasa hover.webp"],
  "shotharaha": ["/assets/shakti peya product hd.webp", "/assets/shakti peya hover.webp"],
  "rose": ["/assets/rose hd.webp", "/assets/rose new.webp", "/assets/rose display.webp", "/assets/rose clean.webp", "/assets/Rose hover.webp", "/assets/Sampriti Rose zoom out.webp"],
  "hibiscus": ["/assets/hibiscus hd.webp", "/assets/hibiscus new.webp", "/assets/hibiscus display.webp", "/assets/hibiscus clean.webp", "/assets/hibiscus hover.webp"],
  "blue-butterfly-pea": ["/assets/blue butterfly pea hd.webp", "/assets/blue butterfly pea new.webp", "/assets/blue butterfly pea display.webp", "/assets/blue butterfly pea clean.webp", "/assets/blue butterfly pea hover.webp"],
  "vatari": ["/assets/hibiscus hd.webp", "/assets/hibiscus hover.webp"],
  "kanti": ["/assets/rose hd.webp", "/assets/Rose hover.webp"],
  "blue-ojas": ["/assets/blue butterfly pea hd.webp", "/assets/blue butterfly pea hover.webp"],
  "the-sahane": ["/assets/hibiscus hd.webp", "/assets/hibiscus hover.webp"],
  "rakta-chandanam": ["/assets/rose hd.webp", "/assets/Rose hover.webp"],
  "shveta-chandanam": ["/assets/blue butterfly pea hd.webp", "/assets/blue butterfly pea hover.webp"],
  "parjanya": ["/assets/hibiscus hd.webp", "/assets/hibiscus hover.webp"],
  "jawa": ["/assets/rose hd.webp", "/assets/Rose hover.webp"],
  "kha": ["/assets/blue butterfly pea hd.webp", "/assets/blue butterfly pea hover.webp"],
  "sandalwood-shavings": ["/assets/hibiscus hd.webp", "/assets/hibiscus hover.webp"],
  "deodar-discs": ["/assets/rose hd.webp", "/assets/Rose hover.webp"],
  "black-sambrani": ["/assets/blue butterfly pea hd.webp", "/assets/blue butterfly pea hover.webp"],
};

type Review = {
  id: number;
  name: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
};

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill={star <= rating ? "#333333" : "#E5DCCF"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewForm({ slug, onSubmitted }: { slug: string; onSubmitted: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const API_PUBLIC = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api/admin', '');
      const res = await fetch(API_PUBLIC + '/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug: slug, name, email, rating, title, comment }),
      });
      const json = await res.json();
      if (json.status) {
        setMessage("Thank you! Your review has been submitted for approval.");
        setName(""); setEmail(""); setRating(5); setTitle(""); setComment("");
        setShowForm(false);
        onSubmitted();
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-16 border border-[#E5DCCF] p-8 md:p-12 text-center">
      <h3 className="text-[#2B2925] text-lg font-normal mb-3" style={{ fontFamily: "var(--font-serif)" }}>Share your impression</h3>
      <p className="text-sm text-[#7A756D] font-light mb-6 max-w-md mx-auto" style={{ fontFamily: "var(--font-sans)" }}>Your experience with this product matters. Tell us what you think — your voice helps others discover what works.</p>
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="inline-flex h-11 items-center justify-center border border-[#2B2925]/70 px-6 text-[11px] tracking-[0.2em] text-[#2B2925]/90 transition-colors duration-300 hover:bg-[#2B2925] hover:text-white cursor-pointer" style={{ fontFamily: "var(--font-sans)" }}>
          Write Your Review
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto text-left space-y-4">
          <div className="flex items-center gap-2 justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)} className="cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill={star <= rating ? "#333333" : "#D6D5CC"}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
          <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-[#E5DCCF] bg-white py-3 px-4 text-sm text-[#2B2925] placeholder:text-[#9A958E] focus:outline-none focus:border-[#333333]" />
          <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-[#E5DCCF] bg-white py-3 px-4 text-sm text-[#2B2925] placeholder:text-[#9A958E] focus:outline-none focus:border-[#333333]" />
          <input type="text" placeholder="Review title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border border-[#E5DCCF] bg-white py-3 px-4 text-sm text-[#2B2925] placeholder:text-[#9A958E] focus:outline-none focus:border-[#333333]" />
          <textarea placeholder="Your review" value={comment} onChange={e => setComment(e.target.value)} required rows={4} className="w-full border border-[#E5DCCF] bg-white py-3 px-4 text-sm text-[#2B2925] placeholder:text-[#9A958E] focus:outline-none focus:border-[#333333] resize-none" />
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="flex-1 bg-[#2B2925] text-white py-3 text-xs tracking-[0.2em] hover:bg-black transition-all duration-300 cursor-pointer disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setMessage(""); }} className="border border-[#E5DCCF] px-6 py-3 text-xs tracking-[0.2em] text-[#7A756D] hover:text-[#2B2925] cursor-pointer">
              Cancel
            </button>
          </div>
          {message && <p className="text-sm text-center text-[#5A554E]">{message}</p>}
        </form>
      )}
    </div>
  );
}

function ReviewsSection({ slug, productName, reviews, onReviewSubmitted }: { slug: string; productName: string; reviews: Review[]; onReviewSubmitted: () => void }) {
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = reviews.length ? (totalRating / reviews.length) : 0;
  const distribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) distribution[r.rating - 1]++; });

  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("most-recent");

  let filtered = [...reviews];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(r => (r.title || "").toLowerCase().includes(q) || (r.comment || "").toLowerCase().includes(q));
  }
  if (ratingFilter !== "all") {
    filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
  }
  filtered.sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 60) return "a month ago";
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <section className="bg-white px-6 md:px-12 lg:px-20" style={{ paddingTop: "40px", paddingBottom: "120px" }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[#2B2925] text-[24px] leading-[31px] font-[400] tracking-[0.08em] mb-10" style={{ fontFamily: '"Tenor Sans", sans-serif' }}>
          Customer impressions
        </h2>

        {reviews.length > 0 && (
          <>
        <div className="md:flex md:gap-16 md:items-start">
          <div className="space-y-[5px] flex-1 max-w-md">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star - 1];
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-[6px]">
                  <span className="text-[11px] text-[#2B2925] w-3 text-right">{star}</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#333333"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <div className="w-[140px] h-[14px] bg-[#D6D5CC] rounded-full overflow-hidden">
                    <div className="h-full bg-[#333333] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-[#666666] whitespace-nowrap">{String(count).padStart(2, "0")} {count === 1 ? "impression" : "impressions"} with {star} {star === 1 ? "star" : "stars"}.</span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 md:mt-0 md:min-w-[130px]">
            <p className="text-[11px] text-[#666666] mb-2 tracking-[0.02em]">Overall sentiment</p>
            <p className="text-[34px] leading-none text-[#2B2925] font-light mb-1">{avgRating.toFixed(1)}</p>
            <div className="flex gap-[2px] mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width="11" height="11" viewBox="0 0 24 24" fill={star <= Math.round(avgRating) ? "#333333" : "#D6D5CC"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ))}
            </div>
            <p className="text-[11px] text-[#666666]">{reviews.length} {reviews.length === 1 ? "impression" : "impressions"}</p>
          </div>
        </div>

        <hr className="border-[#E5DCCF] my-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
          <div className="relative flex-1 w-full md:max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A958E]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input type="text" placeholder="Search topics and impressions"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-[#E5DCCF] bg-white py-3 pl-10 pr-4 text-sm text-[#2B2925] placeholder:text-[#9A958E] focus:outline-none focus:border-[#333333] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#7A756D] tracking-[0.1em] uppercase">Rating</label>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}
              className="border border-[#E5DCCF] bg-white py-3 px-4 text-sm text-[#2B2925] focus:outline-none focus:border-[#333333] transition-colors cursor-pointer appearance-none"
              style={{ minWidth: "120px" }}>
              <option value="all">All</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-6 mb-10">
          <p className="text-sm text-[#7A756D]">{filtered.length} {filtered.length === 1 ? "impression" : "impressions"}</p>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#7A756D] tracking-[0.1em] uppercase">Sort by</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#E5DCCF] bg-white py-3 px-4 text-sm text-[#2B2925] focus:outline-none focus:border-[#333333] transition-colors cursor-pointer appearance-none">
              <option value="most-recent">Most recent</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>
        </div>

        <hr className="border-[#E5DCCF] mb-10" />

        <div className="space-y-10">
          {filtered.map((review) => (
            <div key={review.id}>
              <div className="flex items-center gap-3 mb-2">
                <StarRating rating={review.rating} size={15} />
              </div>
              <h4 className="text-[#2B2925] text-base font-normal mb-2" style={{ fontFamily: "var(--font-serif)" }}>{review.title}</h4>
              <p className="text-sm text-[#5A554E] font-light leading-relaxed mb-2" style={{ fontFamily: "var(--font-sans)" }}>{review.comment}</p>
              <p className="text-xs text-[#7A756D] mb-1">{review.name}</p>
              <p className="text-xs text-[#9A958E]">{formatDate(review.createdAt)}</p>
              <hr className="border-[#E5DCCF] mt-10" />
            </div>
          ))}
        </div>
        </>
        )}

        {reviews.length === 0 && (
          <p className="text-sm text-[#7A756D] text-center mb-10">No impressions yet. Be the first to share your experience.</p>
        )}

        <ReviewForm slug={slug} onSubmitted={onReviewSubmitted} />
      </div>
    </section>
  );
}

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
  galleryImages?: string[];
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
  galleryImages?: string[];
  createdAt?: string;
};

const fallbackProducts: Product[] = [
  {
    id: "shakti-peya", name: "Shakti Peya", subtitle: "Energy Elixir",
    category: "Sampriti Botanicals",
    price: 54, format: "9 Test Tube Kit",
    image: "/assets/shakti peya.webp", hoverImage: "/assets/shakti peya hover.webp",
    benefits: "Activation � Anti-Aging � Radiance",
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
    image: "/assets/chandra rasa.webp", hoverImage: "/assets/chandra rasa hover.webp",
    benefits: "Calm � Settling � Restorative",
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
    image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", benefits: "",
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
    image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", benefits: "",
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
    image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", benefits: "",
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
    image: "/assets/black turmeric hd.webp", hoverImage: "/assets/black turmeric hover.webp", benefits: "",
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
    image: "/assets/shakti peya product hd.webp", hoverImage: "/assets/shakti peya hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "vatari",
    name: "Vatari", subtitle: "Botanical Botox",
    category: "Skincare Ritual",
    price: 48, format: "Botanical Profile",
    image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "kanti",
    name: "Kanti", subtitle: "Red Radiance",
    category: "Skincare Ritual",
    price: 48, format: "Botanical Profile",
    image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "blue-ojas",
    name: "Blue Ojas", subtitle: "Vitality Concentrate",
    category: "Skincare Ritual",
    price: 48, format: "Botanical Profile",
    image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "the-sahane",
    name: "The Sahane", subtitle: "Stone",
    category: "Ceremony",
    price: 36, format: "",
    image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "rakta-chandanam",
    name: "Rakta Chandanam", subtitle: "Red Sandalwood",
    category: "Ceremony",
    price: 42, format: "",
    image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "shveta-chandanam",
    name: "Shveta Chandanam", subtitle: "White Sandalwood",
    category: "Ceremony",
    price: 42, format: "",
    image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "parjanya",
    name: "Parjanya", subtitle: "The First Rain",
    category: "Fragrance",
    price: 54, format: "Botanical Profile",
    image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "jawa",
    name: "Jawa", subtitle: "Embers",
    category: "Fragrance",
    price: 54, format: "Botanical Profile",
    image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "kha",
    name: "Kha", subtitle: "The Zero Point",
    category: "Fragrance",
    price: 54, format: "Botanical Profile",
    image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "sandalwood-shavings",
    name: "Sandalwood Shavings", subtitle: "",
    category: "Atmospheric",
    price: 28, format: "",
    image: "/assets/hibiscus hd.webp", hoverImage: "/assets/hibiscus hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "deodar-discs",
    name: "Deodar Discs", subtitle: "",
    category: "Atmospheric",
    price: 28, format: "",
    image: "/assets/rose hd.webp", hoverImage: "/assets/Rose hover.webp", benefits: "",
    description: "", aroma: "", suitedTo: "", keyIngredients: "",
    howToUse: "", usageDetails: [], essenceTitle: "", essence: ""
  },
  {
    id: "black-sambrani",
    name: "Black Sambrani", subtitle: "",
    category: "Atmospheric",
    price: 28, format: "",
    image: "/assets/blue butterfly pea hd.webp", hoverImage: "/assets/blue butterfly pea hover.webp", benefits: "",
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
  const [hoveredRelated, setHoveredRelated] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [thumbSlide, setThumbSlide] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const API_PUBLIC = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api/admin', '');
  const fetchReviews = async () => {
    try {
      const res = await fetch(API_PUBLIC + '/api/reviews/product/' + encodeURIComponent(slug), { cache: 'no-store' });
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) setReviews(json.data);
    } catch {}
  };
  const rawG = product?.galleryImages;
  const parsedG = Array.isArray(rawG) ? rawG : (typeof rawG === "string" ? (() => { try { return JSON.parse(rawG); } catch { return []; } })() : []);
  const galleryImages = product ? (parsedG.length ? parsedG : (productGallery[slug] || [product.image])) : [""];
  const displayImages = slug === "shakti-peya" ? ["/assets/ShaktiPeya-info.webp", ...galleryImages] : slug === "chandra-rasa" ? ["/assets/ChandraRasa-info.webp", ...galleryImages] : galleryImages;
  const thumbsPerPage = isDesktop ? 4 : 3;
  const maxThumbSlide = Math.max(0, displayImages.length - thumbsPerPage);

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
      let allApiProducts: ApiProduct[] = [];

      const pRes = await api.get<ApiProduct[]>("/products");
      if (pRes.status && pRes.data?.length) {
        allApiProducts = pRes.data;
        if (s) {
          foundProduct = allApiProducts.find((p) => {
            if (!p) return false;
            const apiSlug = (p.slug || "").toLowerCase().trim();
            const apiName = (p.name || "").toLowerCase().trim();
            return apiSlug === s || apiSlug.replace(/\s+/g, "-") === s || apiName === s || apiName.replace(/\s+/g, "-") === s;
          }) || null;
        }
      }

      if (!foundProduct && s) {
        const slugRes = await api.get<ApiProduct>("/products/slug/" + encodeURIComponent(s));
        if (slugRes.status && slugRes.data) {
          foundProduct = slugRes.data;
        }
      }

      if (foundProduct) {
        const hasField = (obj: any, key: string) => obj !== null && obj !== undefined && key in obj;
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
          name: foundProduct.name ?? fb?.name ?? "",
          subtitle: foundProduct.subtitle ?? fb?.subtitle ?? "",
          category: foundProduct.category?.name ?? fb?.category ?? "",
          price: hasField(foundProduct, "price") ? parseFloat(String(foundProduct.price)) || 0 : (fb?.price ?? 0),
          format: foundProduct.format ?? fb?.format ?? "",
          image: normalizedImage,
          description: foundProduct.description ?? fb?.description ?? "",
          benefits: foundProduct.benefits ?? fb?.benefits ?? "",
          aroma: foundProduct.aroma ?? fb?.aroma ?? "",
          suitedTo: foundProduct.suitedTo ?? fb?.suitedTo ?? "",
          keyIngredients: foundProduct.keyIngredients ?? fb?.keyIngredients ?? "",
          howToUse: foundProduct.howToUse ?? fb?.howToUse ?? "",
          essenceTitle: foundProduct.essenceTitle ?? fb?.essenceTitle ?? "",
          essence: foundProduct.essence ?? fb?.essence ?? "",
          usageDetails: usageDetails.length > 0 ? usageDetails : (fb?.usageDetails || []),
          hoverImage: normalizedHover,
          galleryImages: (() => { const g = foundProduct.galleryImages; if (Array.isArray(g)) return g; if (typeof g === "string") try { return JSON.parse(g); } catch {} return fb?.galleryImages || []; })(),
        });
      } else if (fb) {
        setProduct(fb);
      } else {
        setNotFound(true);
      }

      fetchReviews();

      // Build "You may also like" list
      if (allApiProducts.length) {
        const hasField = (obj: any, key: string) => obj !== null && obj !== undefined && key in obj;
        const merged: Product[] = allApiProducts.map((p) => {
          const f = fallbackProducts.find(fb => fb.id === p.slug);
          return {
            id: p.slug,
            name: p.name ?? f?.name ?? "",
            subtitle: p.subtitle ?? f?.subtitle ?? "",
            category: p.category?.name ?? f?.category ?? "",
            price: hasField(p, "price") ? parseFloat(String(p.price)) || 0 : (f?.price ?? 0),
            format: p.format ?? f?.format ?? "",
            image: normalizeImagePath(p.image) ?? f?.image ?? "",
            hoverImage: normalizeImagePath(p.hoverImage) ?? f?.hoverImage ?? "",
            description: p.description ?? f?.description ?? "",
            benefits: p.benefits ?? f?.benefits ?? "",
            aroma: f?.aroma ?? "", suitedTo: f?.suitedTo ?? "",
            keyIngredients: f?.keyIngredients ?? "", howToUse: f?.howToUse ?? "",
            essenceTitle: f?.essenceTitle ?? "", essence: f?.essence ?? "",
            usageDetails: f?.usageDetails ?? [],
            galleryImages: (() => { const g = p.galleryImages; if (Array.isArray(g)) return g; if (typeof g === "string") try { return JSON.parse(g); } catch {} return f?.galleryImages ?? []; })(),
            createdAt: p.createdAt,
          };
        });
        merged.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        setAllProducts(merged);
      }

      setLoading(false);
    })();
  }, [slug]);

  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!product || !allProducts.length) return;
    const rotate = () => {
      const others = allProducts.filter(p => p.id !== product.id);
      const byCategory: Record<string, Product[]> = {};
      others.forEach(p => {
        const cat = p.category || "Other";
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(p);
      });
      const catKeys = Object.keys(byCategory).sort();
      const ts = Date.now();
      const result: Product[] = [];
      for (let i = 0; i < 3; i++) {
        const cat = catKeys[(Math.floor(ts / 8000) + i) % catKeys.length];
        const products = byCategory[cat];
        const idx = Math.floor(ts / 8000) % products.length;
        result.push(products[idx]);
      }
      setSuggestedProducts(result);
    };
    rotate();
    const interval = setInterval(rotate, 8000);
    return () => clearInterval(interval);
  }, [product?.id, allProducts.length]);

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      setThumbSlide((prev) => {
        const max = Math.max(0, displayImages.length - (desktop ? 4 : 3));
        return Math.min(prev, max);
      });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [displayImages.length]);

  const immersiveProducts = ["shakti-peya", "chandra-rasa"];
  const isImmersive = product ? immersiveProducts.includes(product.id) : false;
  const containedProducts = ["hibiscus", "rose", "blue-butterfly-pea", "black-turmeric"];
  const isContained = product ? containedProducts.includes(product.id) : false;
  const heroImgClass = "object-cover object-center w-full h-full p-0";
  const isLargeImage = product ? ["shakti-peya", "chandra-rasa"].includes(product.id) : false;
  const storyImgClass = "object-cover w-full h-full p-0";
  const storyContainerClass = "relative overflow-hidden min-h-[320px] sm:min-h-[400px] md:min-h-[600px]";

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
    addItem({ id: product.id, name: product.name, subtitle: product.subtitle, format: product.format, price: product.price, image: product.image, quantity });
    setToast(product.name);
    setTimeout(() => setToast(null), 2000);
    openCart();
  };

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar forceScrolled={true} />

      <div className="px-0 pb-16 pt-32 md:pt-44 lg:pt-56">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          {product && (
            <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] mb-6 md:mb-8 mt-2 md:mt-4 capitalize" style={{ color: "#333333" }}>
              <a href="/" className="hover:opacity-70 transition-opacity">Home</a>
              {product.category && (() => {
                const catSlugMap: Record<string, string> = {
                  "sampriti botanicals": "infusions",
                  "restorative infusion": "infusions",
                  "skincare ritual": "skincare",
                  "fragrance": "fragrance",
                  "ceremony": "ceremony",
                  "atmospheric": "atmospheric",
                };
                const catSlug = catSlugMap[product.category.toLowerCase()];
                const catTitles: Record<string, string> = {
                  infusions: "Infusions",
                  skincare: "Skincare",
                  fragrance: "Fragrance",
                  ceremony: "Ceremony",
                  atmospheric: "Atmospheric",
                };
                if (catSlug) {
                  return (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <a href={`/category/${catSlug}`} className="hover:opacity-70 transition-opacity">{catTitles[catSlug] || product.category}</a>
                    </>
                  );
                }
                return null;
              })()}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="opacity-60">{product.name}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-0 lg:gap-16 items-start">

            {/* "" Hero Product Image with Gallery """"""""""""""""""""""""""" */}
            <div className="self-start mb-6 md:mb-0 w-full md:max-w-sm md:mx-0">
              <div className="relative aspect-square bg-white overflow-hidden">
                <ProductImage
                  src={displayImages[galleryIndex]}
                  alt={product.name}
                  fill
                  priority
                  className={heroImgClass}
                />
              </div>
              {displayImages.length > 1 && (
                <div className="flex items-center gap-2 mt-4">
                  <button onClick={() => setThumbSlide(Math.max(0, thumbSlide - 1))} disabled={thumbSlide === 0} className="flex-shrink-0 w-8 h-8 bg-white shadow-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer border border-gray-200">
                    <ChevronLeft size={16} className="text-[#2C2A26]" />
                  </button>
                  <div className="overflow-hidden bg-white flex-1">
                    <div className="flex gap-2 transition-transform duration-400" style={{ transform: `translateX(-${thumbSlide * (isDesktop ? 25 : 33.333)}%)` }}>
                      {displayImages.map((img: string, i: number) => (
                        <button key={i} onClick={() => setGalleryIndex(i)} className={`relative flex-shrink-0 w-[calc(33.333%-5px)] md:w-[calc(25%-6px)] aspect-square overflow-hidden border bg-white transition-all cursor-pointer ${i === galleryIndex ? "border-[#A48662] ring-1 ring-[#A48662]" : "border-gray-200 hover:border-gray-400"}`}>
                          <ProductImage src={img} alt={`${product.name} view ${i + 1}`} fill className="object-contain p-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setThumbSlide(Math.min(maxThumbSlide, thumbSlide + 1))} disabled={thumbSlide >= maxThumbSlide} className="flex-shrink-0 w-8 h-8 bg-white shadow-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer border border-gray-200">
                    <ChevronRight size={16} className="text-[#2C2A26]" />
                  </button>
                </div>
              )}

            </div>

            {/* "" Product Info """"""""""""""""""""""""""""""""""""""""""""" */}
            <div className="self-start">
              <h1 className="text-[#333333] text-lg md:text-[24px] leading-[31px] font-[400] tracking-[0.08em] mb-2" style={{ fontFamily: '"Tenor Sans", sans-serif', overflowWrap: "break-word", wordBreak: "break-word" }}>
                {product.name} | {product.subtitle}
              </h1>
              {product.benefits && (
                <p className="text-[#7A756D] text-sm font-light mb-6" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>{product.benefits}</p>
              )}
              {product.format && (
                <p className="text-[#5A554E] mb-6" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>{product.format}</p>
              )}
              <p className="text-[#333333] text-[16px] mb-4" style={{ fontFamily: "var(--font-serif)" }}>{formatPrice(product.price, currency, exchangeRate)}</p>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-3 mb-6">
                <div className="flex items-center gap-0 border border-[#E5DCCF] flex-shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 md:w-12 md:h-12 text-[#5A554E] hover:text-[#2C2A26] cursor-pointer text-sm">-</button>
                  <span className="text-[#2C2A26] w-8 text-center text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 md:w-12 md:h-12 text-[#5A554E] hover:text-[#2C2A26] cursor-pointer text-lg">+</button>
                </div>
                <button onClick={handleAddToCart} className="flex-1 bg-[#2C2A26] text-white px-6 py-4 text-xs tracking-[0.2em] hover:bg-black transition-all duration-300 cursor-pointer whitespace-nowrap" suppressHydrationWarning>
                  Add To Cart
                </button>
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

          {/* "" Product Tabs � Full Width """"""""""""""""""""""""""""""""""" */}
          <div className="mt-16 border-t border-[#E5DCCF]">
            <div className="flex sm:grid sm:grid-cols-3 gap-2 sm:gap-x-4">
              {["description", "ingredients", "howToUse"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`relative py-5 text-[11px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase cursor-pointer text-center transition-colors duration-300 flex-1 sm:flex-none ${activeTab === tab ? "text-[#2C2A26]" : "text-[#9A958E] hover:text-[#5A554E]"}`}>
                  {tab === "howToUse" ? "Servings" : tab === "ingredients" ? "Ingredients" : tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[1.5px] bg-[#A48662]" />}
                </button>
              ))}
            </div>
            <div className="py-10 md:py-12">
              {activeTab === "description" && (
                <div className="space-y-10" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                  <p className="text-[#7A756D] text-xs md:text-sm leading-[1.9] md:leading-[1.95] font-light">
                    {product.description}
                  </p>
                </div>
              )}
              {activeTab === "ingredients" && (
                <div className="space-y-6" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                  <p className="text-[#7A756D] text-xs md:text-sm leading-[1.9] md:leading-[1.95] font-light">
                    {product.keyIngredients}
                  </p>
                </div>
              )}
              {activeTab === "howToUse" && (
                <p className="text-[#7A756D] text-xs md:text-sm leading-[1.9] md:leading-[1.95] font-light whitespace-pre-line" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                  {product.howToUse}
                </p>
              )}
            </div>
          </div>

          {/* "" Product Detail Story """"""""""""""""""""""""""""""""""""""""" */}
          <div className="relative left-1/2 -translate-x-1/2 w-screen mt-24">
            <div className={`border-y ${isContained ? "md:border-y-0" : ""} border-[#E5DCCF]`}>

            {/* Panel 1 " Image left, text right — How to Use */}
            <section className="grid lg:grid-cols-2">
              <div className={`${storyContainerClass}`}>
                <ProductImage
                  src={slug === "shakti-peya" ? "/assets/image-for-info1.webp" : slug === "chandra-rasa" ? "/assets/image-for-info2.webp" : product.hoverImage}
                  alt={`${product.name} preparation ritual`}
                  fill
                  priority
                  className={storyImgClass}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex items-start self-start pl-6 md:pl-10 lg:pl-14 pr-6 md:pr-10 lg:pr-14 pt-[6.5rem] pb-14">
                <div className="max-w-xl">
                  <h2
                    className="mb-6 text-[#333333] text-[26px] leading-[33px] font-[400] tracking-[0.08em]"
                    style={{ fontFamily: '"Tenor Sans", sans-serif' }}
                  >
                    How to Use
                  </h2>
                  <p className="text-xs md:text-sm font-light text-[#7A756D] whitespace-pre-line" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                    {product.howToUse}
                  </p>
                  <div className="mt-8 border-t border-[#E5DCCF]">
                    {product.usageDetails.map((item: UsageDetail, idx: number) => (
                      <div key={`${item.label}-${item.value}-${idx}`}
                        className="grid gap-2 border-b border-[#E5DCCF] py-4 md:grid-cols-[140px_1fr]"
                      >
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2C2A26]">{item.label}</p>
                        <p className="text-sm leading-relaxed text-[#5A554E]" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Panel 2 — Text left, image right — Essence */}
            <section className="grid lg:grid-cols-2">
              <div className="flex items-start self-start pl-8 md:pl-12 lg:pl-16 pr-0 md:pr-1 lg:pr-2 pt-[6.5rem] pb-14">
                <div className="max-w-xl">
                  <h2
                    className="mb-6 text-[#333333] text-[26px] leading-[33px] font-[400] tracking-[0.08em]"
                    style={{ fontFamily: '"Tenor Sans", sans-serif', overflowWrap: "break-word", wordBreak: "break-word" }}
                  >
                    {product.essenceTitle}
                  </h2>
                  <p className="text-xs md:text-sm font-light text-[#7A756D]" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                    {product.essence}
                  </p>
                  <div className="mt-8 border-t border-[#E5DCCF]">
                    <div className="grid gap-2 border-b border-[#E5DCCF] py-4 md:grid-cols-[140px_1fr]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2C2A26]">Aroma</p>
                      <p className="text-sm leading-relaxed text-[#5A554E]" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>{product.aroma}</p>
                    </div>
                    <div className="grid gap-2 border-b border-[#E5DCCF] py-4 md:grid-cols-[140px_1fr]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2C2A26]">Suited to</p>
                      <p className="text-sm leading-relaxed text-[#5A554E]" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>{product.suitedTo}</p>
                    </div>
                    <div className="grid gap-2 border-b border-[#E5DCCF] py-4 md:grid-cols-[140px_1fr]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2C2A26]">Benefits</p>
                      <p className="text-sm leading-relaxed text-[#5A554E]" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>{product.benefits}</p>
                    </div>
                    <div className="grid gap-2 border-b border-[#E5DCCF] py-4 md:grid-cols-[140px_1fr]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2C2A26]">Key ingredients</p>
                      <p className="text-sm leading-relaxed text-[#5A554E]" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>{product.keyIngredients}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${storyContainerClass}`}>
                <ProductImage
                  src={slug === "shakti-peya" ? "/assets/image-for-info1.webp" : slug === "chandra-rasa" ? "/assets/image-for-info2.webp" : product.hoverImage}
                  alt={`${product.name} ritual formulation`}
                  fill
                  priority
                  className={storyImgClass}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </section>

          </div>
        </div>

        </div>
      </div>

      {/* You may also like */}
      {suggestedProducts.length > 0 && (
    <section className="bg-white px-6 md:px-12 lg:px-20" style={{ paddingTop: "30px", paddingBottom: "120px" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-[#333333] text-[24px] leading-[31px] font-[400] tracking-[0.08em]" style={{ fontFamily: '"Tenor Sans", sans-serif' }}>
                You may also like
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-10 w-full md:relative md:left-1/2 md:w-screen md:-translate-x-1/2 md:grid-cols-3 md:gap-4 md:px-16 lg:px-24">
              {suggestedProducts.map((related) => (
                  <div key={related.id} className="group flex flex-col h-full w-full">
                  <Link href={`/product/${related.id}`} className="flex flex-col flex-1 cursor-pointer" onMouseEnter={() => setHoveredRelated(related.id)} onMouseLeave={() => setHoveredRelated(null)}>
                    <div className="relative flex mx-auto w-full aspect-square shrink-0 items-center justify-center overflow-hidden bg-white pointer-events-none"
                      draggable={false}
                    >
                      <SaveButton item={{ id: related.id, name: related.name, price: related.price, image: related.image, subtitle: related.subtitle }} />
                      <ProductImage
                        src={related.image}
                        alt={related.name}
                        fill
                          className={`object-contain p-4 md:p-8 transition-all duration-500 mix-blend-multiply ${hoveredRelated === related.id && related.hoverImage ? "opacity-0" : "opacity-100"}`}
                        sizes="33vw"
                      />
                      {related.hoverImage && (
                        <ProductImage
                          src={related.hoverImage}
                          alt={related.name}
                          fill
                          className={`object-cover object-center p-0 transition-all duration-500 ${hoveredRelated === related.id ? "opacity-100" : "opacity-0"}`}
                          sizes="33vw"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="text-center pointer-events-none mt-4 flex flex-col flex-1 justify-between pb-3" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                    <div>
                      <h3 className="text-[#333333] text-[17px] leading-[22px] font-[600] tracking-[0.08em]" style={{ fontFamily: "Inter, sans-serif" }}>{related.name}</h3>
                      {related.subtitle && <p className="mt-1 text-sm leading-[20px] font-[400] italic text-[#666666]" style={{ fontFamily: '"Tenor Sans", sans-serif', overflowWrap: "break-word", wordBreak: "break-word" }}>{related.subtitle}</p>}
                      {related.description && <p className="mx-auto mt-1 text-sm leading-[22px] font-[300] text-[#666666] line-clamp-2" style={{ fontFamily: "Inter, sans-serif", overflowWrap: "break-word", wordBreak: "break-word" }}>{related.description}</p>}
                    </div>
                    <p className="mt-3 text-[#333333] text-sm leading-[20px] font-[400]" style={{ fontFamily: "Inter, sans-serif" }}>{formatPrice(related.price, currency, exchangeRate)}</p>
                  </div>
                  <button
                    onClick={() => {
                      addItem({ id: related.id, name: related.name, subtitle: related.subtitle, format: related.format, price: related.price, image: related.image, quantity: 1 });
                      setToast(related.name);
                      setTimeout(() => setToast(null), 2000);
                      openCart();
                    }}
                    className="mt-auto w-full bg-[#2C2A26] text-white px-6 py-4 text-xs tracking-[0.2em] hover:bg-black transition-all duration-300 cursor-pointer"
                    suppressHydrationWarning
                  >
                    Add To Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ReviewsSection slug={product.id} productName={product.name} reviews={reviews} onReviewSubmitted={fetchReviews} />

      {toast && (
        <div className="fixed bottom-8 right-8 bg-[#2C2A26] text-white px-6 py-4 z-50">
          <p className="text-sm">{toast} added to cart</p>
        </div>
      )}

      <Footer />
    </main>
  );
}
