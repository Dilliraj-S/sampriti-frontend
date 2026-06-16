import Link from "next/link";

const categories = [
  { name: "Infusions", slug: "infusions", image: "/assets/Infusions 1.webp" },
  { name: "Skincare", slug: "skincare", image: "/assets/Skincare (1).webp" },
  { name: "Fragrance", slug: "fragrance", image: "/assets/Fragrance (1).webp" },
  { name: "Ceremony", slug: "ceremony", image: "/assets/Ceremony.webp" },
  { name: "Atmospheric", slug: "atmospheric", image: "/assets/Atmospheric 1.webp" },
];

export default function BrowseByCategory() {
  return (
    <section className="bg-white px-6 md:px-12 lg:px-20" style={{ marginBottom: "120px" }}>
      <div className="max-w-7xl mx-auto text-center">
<h2
  className="text-[#333333] text-[28px] leading-[34px] md:text-[32px] md:leading-[42px] font-[400]"
  style={{ fontFamily: '"Tenor Sans", "Tenor Sans Fallback", "Tenor Sans", system-ui, sans-serif', marginBottom: "60px" }}
>
  Browse by Category
</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center"
            >
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-3 text-[#1A1A1A] text-sm md:text-base tracking-[0.12em] font-light capitalize">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
