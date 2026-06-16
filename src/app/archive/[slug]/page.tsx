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
        image: p.image || "/assets/img 4.webp",
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
    <main className="min-h-screen bg-[#FDFAF5]" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Navbar � untouched */}
      <Navbar forceScrolled={true} />


      <div className="px-8 pt-36 md:px-20 md:pt-32 lg:px-32 lg:pt-36">
        <nav className="text-[14px] tracking-[0.2em] text-[#333333]" style={{ fontFamily: "var(--font-sans)" }}>
          <Link href="/" className="hover:text-[#333333] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/archive" className="hover:text-[#333333] transition-colors">Archive</Link>
          <span className="mx-2">/</span>
          <span>{article.title}</span>
        </nav>
      </div>

      <article className="pb-16 pt-6 md:pt-10 lg:pb-0 lg:pt-12">

        <div className="px-8 md:px-20 lg:px-32">
          <p
            className="mb-4 text-[#333333] text-[0.68rem] tracking-[0.34em]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {article.category}
          </p>

          <h1
            className="mb-7 text-[#2B2925] text-xl font-light leading-tight md:text-2xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {article.title}
          </h1>
        </div>

        <div className="relative w-full md:px-20 lg:px-32">
          <div
            className="relative h-[50vh] w-full overflow-hidden bg-white md:h-[60vh] lg:h-[100vh]"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 md:px-12 lg:px-20">
          <p
            className="mt-10 mb-10 text-[#5A554E] text-base leading-8 md:text-lg text-center"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            {article.excerpt}
          </p>

          <div className="space-y-6 border-t border-[#A48662]/20 pt-9">
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
