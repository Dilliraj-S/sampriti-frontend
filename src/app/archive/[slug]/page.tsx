import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import { archiveArticles, getArchiveArticle, ArchiveArticle } from "@/app/components/landing/archiveData";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return archiveArticles.map((article) => ({
    slug: article.slug,
  }));
}

async function getArticleFromApi(slug: string): Promise<ArchiveArticle | undefined> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/admin';
    const res = await fetch(base + '/content/' + slug, { next: { revalidate: 60 } });
    const json = await res.json();
    if (json.status && json.data) {
      const p = json.data;
      const today = new Date().toISOString().split("T")[0];
      if (p.status !== "published" && !(p.status === "scheduled" && p.publishDate && p.publishDate <= today)) return undefined;
      return {
        category: p.category || "Journal",
        title: p.title,
        excerpt: p.excerpt || p.content?.slice(0, 120) || "",
        image: p.image || "/Assets/img 4.webp",
        slug: p.slug,
        href: `/archive/${p.slug}`,
        body: p.content ? p.content.split('\n').filter((l: string) => l.trim()) : [],
      };
    }
  } catch {}
  return undefined;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  let article = getArchiveArticle(slug);

  if (!article) {
    article = await getArticleFromApi(slug);
  }

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFFFFF]" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Navbar — untouched */}
      <Navbar forceScrolled={true} />

      {/* Back button — fixed so it always stays visible just below the navbar */}
      <div className="px-6 pt-28 md:px-12 md:pt-52 lg:px-20 lg:pt-56">
        <Link
          href="/archive#all-articles"
          className="group inline-flex items-center gap-2.5 rounded-sm px-4 py-2.5 transition-all duration-200"
          style={{
            background: "rgba(251, 250, 248, 0.92)",
            border: "1px solid rgba(164, 134, 98, 0.35)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#A48662]/50 bg-white text-[#A48662] text-xs transition-all duration-200 group-hover:bg-[#A48662] group-hover:text-white group-hover:border-[#A48662]">
            &#8592;
          </span>
          <span
            className="text-[0.62rem] uppercase tracking-[0.26em] text-[#6B5740] group-hover:text-[#2C2A26] transition-colors duration-200"
            style={{ fontWeight: 650 }}
          >
            Back
          </span>
        </Link>
      </div>

      <article className="grid gap-7 px-0 pb-16 pt-6 md:gap-10 md:px-12 md:pt-10 lg:grid-cols-[50vw_minmax(0,1fr)] lg:gap-0 lg:px-0 lg:pb-0 lg:pt-12">

        {/* ── LEFT COLUMN ── */}
        <div className="relative w-full">
          <div
            className="relative h-[270px] w-full overflow-hidden bg-white md:h-[315px] lg:h-[calc(clamp(320px,70vh,780px)+2cm)]"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* ── RIGHT COLUMN: same 5cm top gap ── */}
        <div className="flex flex-col justify-start px-6 md:px-0 lg:px-16 lg:pb-16 xl:px-24">
          <p
            className="mb-4 text-[#A48662]/80 text-[0.62rem] uppercase tracking-[0.34em]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {article.category}
          </p>

          <h1
            className="mb-7 max-w-3xl text-[#2B2925] text-4xl font-light leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {article.title}
          </h1>

          <p
            className="mb-10 max-w-3xl text-[#5A554E] text-base leading-8 md:text-lg"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            {article.excerpt}
          </p>

          <div className="max-w-3xl space-y-6 border-t border-[#A48662]/20 pt-9">
            {article.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[#3F3A33] text-base leading-8"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

      </article>

      <Footer />
    </main>
  );
}
