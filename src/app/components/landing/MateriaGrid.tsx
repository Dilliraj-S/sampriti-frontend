"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/app/components/landing/cartStore";
import { useState, useCallback } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

const products = [
  {
    id: "hibiscus",
    name: "Hibiscus",
    latin: "Rosa-Sinensis",
    benefit: "Antioxidant-rich for cardiovascular resilience",
    price: 42,
    image: "/Assets/hibiscus new.png",
    hoverImage: "/Assets/hibiscus hover.png",
  },
  {
    id: "rose",
    name: "Rose",
    latin: "Rosa Damascena",
    benefit: "Floral essence to soothe the heart",
    price: 42,
    image: "/Assets/rose new.webp",
    hoverImage: "/Assets/Rose hover.webp",
  },
  {
    id: "blue-butterfly-pea",
    name: "Blue Butterfly Pea",
    latin: "Clitoria Ternatea",
    benefit: "Enhances cognition, reduces stress",
    price: 42,
    image: "/Assets/blue butterfly pea new.webp",
    hoverImage: "/Assets/blue butterfly pea hover.webp",
  },
  {
    id: "black-turmeric",
    name: "Black Turmeric",
    latin: "Curcuma Caesia",
    benefit: "Rare Kaya Kalpa agent for cellular longevity",
    price: 45,
    image: "/Assets/black turmeric hd.webp",
    hoverImage: "/Assets/black turmeric hover.webp",
    sideImage: "/Assets/Black Turmeric Side display.webp",
  },
  {
    id: "the-sahane",
    name: "The Sahane",
    latin: "Stone",
    benefit: "Sacred ceremonial grounding stone",
    price: 36,
    image: "/Assets/hibiscus hd.png",
    hoverImage: "/Assets/hibiscus hover.png",
  },
  {
    id: "rakta-chandanam",
    name: "Rakta Chandanam",
    latin: "Red Sandalwood",
    benefit: "Traditional ceremonial sandalwood",
    price: 36,
    image: "/Assets/rose hd.webp",
    hoverImage: "/Assets/Rose hover.webp",
  },
  {
    id: "shveta-chandanam",
    name: "Shveta Chandanam",
    latin: "White Sandalwood",
    benefit: "Pure white sandalwood for ritual use",
    price: 36,
    image: "/Assets/blue butterfly pea hd.webp",
    hoverImage: "/Assets/blue butterfly pea hover.webp",
  },
  {
    id: "parjanya",
    name: "Parjanya",
    latin: "The First Rain",
    benefit: "First rain fragrance captured in botanical form",
    price: 54,
    image: "/Assets/hibiscus hd.png",
    hoverImage: "/Assets/hibiscus hover.png",
  },
  {
    id: "jawa",
    name: "Jawa",
    latin: "Embers",
    benefit: "Warm ember fragrance for deep atmosphere",
    price: 54,
    image: "/Assets/rose hd.webp",
    hoverImage: "/Assets/Rose hover.webp",
  },
  {
    id: "kha",
    name: "Kha",
    latin: "The Zero Point",
    benefit: "Zero point fragrance of stillness",
    price: 54,
    image: "/Assets/blue butterfly pea hd.webp",
    hoverImage: "/Assets/blue butterfly pea hover.webp",
  },
  {
    id: "sandalwood-shavings",
    name: "Sandalwood Shavings",
    latin: "",
    benefit: "Pure sandalwood for ambient purification",
    price: 28,
    image: "/Assets/hibiscus hd.png",
    hoverImage: "/Assets/hibiscus hover.png",
  },
  {
    id: "deodar-discs",
    name: "Deodar Discs",
    latin: "",
    benefit: "Himalayan cedar discs for sacred space",
    price: 28,
    image: "/Assets/rose hd.webp",
    hoverImage: "/Assets/Rose hover.webp",
  },
  {
    id: "black-sambrani",
    name: "Black Sambrani",
    latin: "",
    benefit: "Traditional resin for deep meditative smoke",
    price: 28,
    image: "/Assets/blue butterfly pea hd.webp",
    hoverImage: "/Assets/blue butterfly pea hover.webp",
  },
];

export default function MateriaGrid() {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [toast, setToast] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const handleMouseEnter = useCallback((id: string) => {
    setHoveredProduct(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredProduct(null);
  }, []);

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setToast(product.name);
    setTimeout(() => setToast(null), 2000);
    openCart();
  };

  return (
    <section className="bg-white py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <p
            className="text-[#A48662] text-xs tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            MATERIA BOTANICA
          </p>
          <h2
            className="text-[#2B2925] text-4xl md:text-5xl font-light"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The Botanical Intelligence
          </h2>
          <p
            className="text-[#5A554E] mt-4 max-w-md mx-auto"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            Single-origin botanicals selected for their therapeutic potency and
            ancestral lineage.
          </p>
        </motion.div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white hover:bg-[#FFFDF9] transition-all duration-500 group border border-[#E5DCCF]"
            >
              {/* Image with hover */}
              <div
                className="relative aspect-square overflow-hidden bg-[#F4F1EA]"
                onMouseEnter={() =>
                  product.hoverImage && handleMouseEnter(product.id)
                }
                onMouseLeave={handleMouseLeave}
                onClick={() =>
                  product.hoverImage
                    ? hoveredProduct === product.id
                      ? handleMouseLeave()
                      : handleMouseEnter(product.id)
                    : null
                }
              >
                <Image
                  src={
                    product.hoverImage &&
                    hoveredProduct === product.id
                      ? product.hoverImage
                      : product.image
                  }
                  alt={product.name}
                  fill
                  className="object-contain transition-all duration-500 ease-out hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Content */}
              <div className="pt-4 pb-4 md:pt-5 md:pb-5">
                <p
                  className="text-[#A48662] text-xs tracking-wide italic mb-0.5"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {product.latin}
                </p>
                <h3
                  className="text-[#2B2925] text-lg md:text-xl font-normal mb-1"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-[#5A554E] text-sm mb-3"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                >
                  {product.benefit}
                </p>

                {/* ✅ Fixed Price + Cart */}
                <div className="flex items-center gap-3 mt-3">
                  <span
                    className="text-[#A48662] text-lg"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    ${product.price}
                  </span>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-auto bg-[#262420] text-[#F9F7F3] px-3 py-1.5 text-[11px] tracking-[0.15em] hover:bg-black transition-all duration-300 cursor-pointer"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 500,
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 bg-[#262420] border border-[#A48662] text-[#F9F7F3] px-6 py-4 z-50 shadow-lg"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <p className="text-sm">
            <span className="text-[#A48662]">{toast}</span> added to cart
          </p>
        </motion.div>
      )}
    </section>
  );
}