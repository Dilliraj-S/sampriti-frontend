"use client";

import Link from "next/link";

import { archiveArticles, ArchiveArticle } from "./archiveData";
import { useEffect, useState } from "react";

function ArticleCard({
  article,
  index,
  numbered = false,
  large = false,
  linked = true,
  showRead = true,
}: {
  article: ArchiveArticle;
  index: number;
  numbered?: boolean;
  large?: boolean;
  linked?: boolean;
  showRead?: boolean;
}) {
  const content = (
    <>
        <div
          className={`relative left-1/2 mb-4 w-screen -translate-x-1/2 overflow-hidden bg-white md:left-auto md:w-full md:translate-x-0 ${
            large ? "h-[270px] md:h-[315px] lg:h-[360px]" : ""
          }`}
          style={large ? undefined : { aspectRatio: "16/9" }}
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          {numbered && (
            <span
              className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center bg-[#FFFFFF] text-[#2B2925] text-[0.62rem] tracking-[0.18em]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>

        <p
          className="mb-2 text-[#A48662]/70 text-[0.6rem] tracking-[0.32em] uppercase"
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
        <p
          className="mb-3 text-[#5A554E] text-sm leading-relaxed line-clamp-2"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          {article.excerpt}
        </p>
        {showRead && (
          <span
            className="text-[#A48662]/60 text-xs tracking-[0.15em] uppercase transition-colors duration-300 group-hover:text-[#A48662]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Read {"\u2192"}
          </span>
        )}
      </>
  );

  return (
    <article className={`group px-6 md:px-0 ${linked ? "cursor-pointer" : ""}`}
    >
      {linked ? <Link href={article.href} className="block">{content}</Link> : content}
    </article>
  );
}

function ArchivePreview({ customArticles }: { customArticles?: ArchiveArticle[] }) {
  const arts = customArticles || archiveArticles;
  return (
    <div className="w-full">
      <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
        <p
          className="mb-4 text-[#A48662] text-[0.6rem] tracking-[0.45em] uppercase"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          CURATED WORKS
        </p>
        <h2
          className="text-[#2B2925] text-4xl md:text-5xl font-light"
          style={{ fontFamily: "var(--font-serif)" }}
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
          />
        ))}

        <article className="flex h-fit flex-col self-start border border-b-0 border-[#A48662]/15 bg-[#A48662]/[0.045] p-7 pb-[1cm] md:p-8 md:pb-[1cm]"
        >
          <div>
            <p
              className="mb-4 text-[#A48662]/70 text-[0.6rem] tracking-[0.32em] uppercase"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Curated Works
            </p>
            <div className="mb-7 h-px w-10 bg-[#A48662]/30" />
            <h3
              className="mb-5 text-[#2B2925] text-2xl md:text-3xl font-light leading-snug"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A collection of essays, botanical profiles, and ancestral wisdom.
            </h3>
            <p
              className="text-[#5A554E] text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              Each piece emerges from rigorous study of classical Siddha and Ayurvedic
              pharmacopoeia - and the quiet observation of plants in their living landscapes.
            </p>
          </div>
          <Link
            href="/archive"
            className="mt-[1.8cm] inline-flex min-h-16 items-center justify-center border-2 border-[#262420] px-7 text-sm font-semibold text-[#262420] transition-colors duration-300 hover:bg-[#262420] hover:text-white cursor-pointer"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Explore All Articles {"\u2192"}
          </Link>
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
            className="text-[#2B2925] text-4xl md:text-5xl font-light"
            style={{ fontFamily: "var(--font-serif)" }}
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
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {arts.map((article, i) => (
          <ArticleCard key={article.href} article={article} index={i} large />
        ))}
      </div>
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
              image: p.image || "/Assets/img 4.webp",
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
      className="scroll-mt-20 bg-[#FFFFFF] py-10 md:py-24"
    >
      <div className="w-full px-6 md:px-8 lg:px-10">
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
