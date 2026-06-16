"use client";

import Link from "next/link";

import { archiveArticles, ArchiveArticle } from "./archiveData";
import { useEffect, useState } from "react";

function ArticleCard({
  article,
  index,
  numbered = false,
  large = false,
  tall = false,
  linked = true,
  showRead = true,
  showExcerpt = true,
}: {
  article: ArchiveArticle;
  index: number;
  numbered?: boolean;
  large?: boolean;
  tall?: boolean;
  linked?: boolean;
  showRead?: boolean;
  showExcerpt?: boolean;
}) {
  const imageBlock = (
    <div
      className={`relative left-1/2 mb-4 w-screen -translate-x-1/2 overflow-hidden bg-white md:left-auto md:w-full md:translate-x-0 ${
        tall ? "h-[400px] md:h-[500px]" : large ? "aspect-[4/3] md:h-[315px] lg:h-[360px]" : ""
      }`}
      style={(!tall && !large) ? { aspectRatio: "16/9" } : undefined}
    >
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover"
      />
      {numbered && (
        <span
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center bg-[#FDFAF5] text-[#2B2925] text-[0.62rem] tracking-[0.18em]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </div>
  );

  const textContent = (
    <>
      <p
        className="mb-2 text-[#333333] text-[0.72rem] tracking-[0.32em]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {article.category}
      </p>
      <h3
        className="mb-2 text-[#2B2925] text-base md:text-lg font-normal leading-snug transition-colors duration-300 group-hover:text-[#A48662]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {article.title}
      </h3>
      {showExcerpt && article.excerpt && (
        <p
          className="mb-3 text-[#5A554E] text-xs md:text-sm leading-relaxed font-light"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {article.excerpt}
        </p>
      )}
    </>
  );

  return (
    <article className={`group flex flex-col h-full px-6 md:px-0 ${linked ? "cursor-pointer" : ""}`}>
      {linked ? (
        <Link href={article.href} className="flex flex-col h-full">
          {imageBlock}
          <div className="flex flex-col flex-1">
            {textContent}
            {showRead && (
              <span
                className="mt-auto text-[#333333] text-[14px] tracking-[0.15em] transition-colors duration-300 group-hover:text-[#A48662]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Read {"\u2192"}
              </span>
            )}
          </div>
        </Link>
      ) : (
        <>
          {imageBlock}
          <div className="flex flex-col flex-1">
            {textContent}
            {showRead && (
              <span
                className="mt-auto text-[#333333] text-[14px] tracking-[0.15em] transition-colors duration-300 group-hover:text-[#A48662]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Read {"\u2192"}
              </span>
            )}
          </div>
        </>
      )}
    </article>
  );
}

function ArchivePreview({ customArticles }: { customArticles?: ArchiveArticle[] }) {
  const arts = customArticles || archiveArticles;
  return (
    <div className="w-full">
      <div className="mx-auto text-center" style={{ marginBottom: "60px" }}>
        <h2
          className="text-[#333333] text-[32px] leading-[42px] font-[400]"
          style={{ fontFamily: '"Tenor Sans", sans-serif' }}
        >
          Curated Works
        </h2>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 px-0 md:px-12 lg:px-20">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8 lg:gap-10">
        {arts.slice(0, 2).map((article, i) => (
          <ArticleCard
            key={article.href}
            article={article}
            index={i}
            large
            linked={true}
            showRead={false}
            showExcerpt={false}
          />
        ))}

       <article className="flex flex-col justify-between self-start border border-b-0 border-[#A48662]/15 bg-[#A48662]/[0.045] p-7 md:p-8 h-[340px] md:h-[400px] lg:h-[460px]">
          <div>
            <h2
              className="mb-8 text-[#2B2925] text-xl md:text-2xl font-light leading-snug"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A collection of essays, botanical profiles, and ancestral wisdom.
            </h2>
            <p
              className="text-[#7A756D] text-sm md:text-base font-light leading-relaxed"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              Each piece emerges from rigorous study of classical Siddha and Ayurvedic
              pharmacopoeia - and the quiet observation of plants in their living landscapes.
            </p>
          </div>
          <a
            href="/archive"
            className="mt-6 md:mt-auto inline-flex h-11 md:h-12 items-center justify-center border border-[#2B2925]/70 px-5 md:px-7 text-[11px] tracking-[0.2em] text-[#2B2925]/90 transition-colors duration-300 hover:bg-[#2B2925] hover:text-white cursor-pointer"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Explore All Articles
          </a>
        </article>
      </div>
      </div>
    </div>
  );
}

function ArchiveHeader() {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <p
          className="mb-3 text-[#A48662] text-[0.6rem] tracking-[0.45em] uppercase"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          CURATED WORKS
        </p>
          <h2
            className="text-[#222222] text-[32px] leading-[42px] font-[400]"
            style={{ fontFamily: '"Tenor Sans", sans-serif' }}
          >
            Curated Works
          </h2>
      </div>
      <p
        className="max-w-xs text-[#5A554E] text-sm leading-relaxed md:text-right"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
      >
        Essays, botanical profiles, and ancestral wisdom - drawn from living traditions.
      </p>
    </div>
  );
}

function ArticleGrid({ customArticles }: { customArticles?: ArchiveArticle[] }) {
  const arts = customArticles || archiveArticles;
  if (!arts.length) return null;
  const [first, ...rest] = arts;
  return (
    <div className="w-full">
      <div className="mb-14">
        <ArticleCard article={first} index={0} large tall />
      </div>
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article, i) => (
            <ArticleCard key={article.href} article={article} index={i + 1} large />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Archive({
  initialExpanded = false,
  showHeader = true,
  sectionId = "archive",
}: {
  initialExpanded?: boolean;
  showHeader?: boolean;
  sectionId?: string;
}) {
  const expanded = initialExpanded;
  const [articles, setArticles] = useState(archiveArticles);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
        const res = await fetch(base + "/content").then(r => r.json());
        if (res.status && res.data?.length) {
          const blogArticles = res.data
            .filter((p: any) => p.status === "published")
            .slice(0, 6)
            .map((p: any) => ({
              category: p.category || "Journal",
              title: p.title,
              excerpt: p.excerpt || p.content?.slice(0, 120) || "",
              image: p.image || "/assets/img 4.webp",
              slug: p.slug,
              href: `/archive/${p.slug}`,
              body: [p.content || ""],
            }));
          // Merge blog posts with existing archive articles
          setArticles(prev => {
            const merged = [...prev];
            blogArticles.forEach((ba: any) => {
              if (!merged.find(m => m.slug === ba.slug)) merged.push(ba);
            });
            return merged;
          });
        }
      } catch {}
    })();
  }, [loaded]);

  return (
      <section
        id={sectionId}
        className="scroll-mt-20 bg-[#FDFAF5]"
        style={{ marginTop: "120px", marginBottom: "60px" }}
      >
        <div className="w-full px-0 md:px-8 lg:px-10">
        {expanded && showHeader && <ArchiveHeader />}

        {!expanded ? (
          <ArchivePreview customArticles={articles} />
        ) : (
          <ArticleGrid customArticles={articles} />
        )}
      </div>
    </section>
  );
}