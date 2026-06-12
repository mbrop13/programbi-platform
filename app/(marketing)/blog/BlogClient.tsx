"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, User, BookOpen, ChevronRight } from "lucide-react";

/* ── Category config ─────────────────────────── */

const CATEGORIES = [
  { value: "all", label: "Todos" },
  { value: "power-bi", label: "Power BI" },
  { value: "sql", label: "SQL" },
  { value: "python", label: "Python" },
  { value: "ia", label: "IA" },
  { value: "industria", label: "Industria" },
  { value: "general", label: "General" },
] as const;

const categoryColors: Record<string, string> = {
  "power-bi": "#F2C811",
  sql: "#CC2927",
  python: "#3776AB",
  ia: "#7C3AED",
  industria: "#059669",
  general: "#1890FF",
};

const categoryLabels: Record<string, string> = {
  "power-bi": "Power BI",
  sql: "SQL",
  python: "Python",
  ia: "IA",
  industria: "Industria",
  general: "General",
};

/* ── Helpers ──────────────────────────────────── */

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Featured Hero ───────────────────────────── */

function FeaturedHero({ article }: { article: any }) {
  const catColor = categoryColors[article.category] || "#1890FF";

  return (
    <Link href={`/blog/${article.slug}`} className="block no-underline group">
      <article className="relative rounded-2xl overflow-hidden bg-slate-900 mb-10">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 sm:h-80 lg:h-[420px] overflow-hidden">
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                unoptimized
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/60 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent lg:hidden" />
          </div>

          {/* Content */}
          <div className="relative flex flex-col justify-center p-8 lg:p-12">
            <span
              className="inline-block self-start px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white mb-4"
              style={{ backgroundColor: catColor }}
            >
              {categoryLabels[article.category] || article.category}
            </span>

            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-[1.15] tracking-tight mb-4 group-hover:text-[#1890FF] transition-colors">
              {article.title}
            </h2>

            {article.excerpt && (
              <p className="text-slate-400 text-sm lg:text-base leading-relaxed line-clamp-3 mb-6">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {article.author_name || "ProgramBI"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.reading_time_min} min
              </span>
              <span>
                {formatDate(article.published_at || article.created_at)}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ── Article Card ────────────────────────────── */

function ArticleCard({ article, index }: { article: any; index: number }) {
  const catColor = categoryColors[article.category] || "#1890FF";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/blog/${article.slug}`} className="block no-underline group h-full">
        <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-all duration-300 h-full flex flex-col">
          {/* Image */}
          <div className="relative h-48 sm:h-52 overflow-hidden">
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-slate-300" />
              </div>
            )}
            {/* Category badge on image */}
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
              style={{ backgroundColor: catColor }}
            >
              {categoryLabels[article.category] || article.category}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-display font-bold text-lg text-slate-900 leading-snug group-hover:text-[#1890FF] transition-colors line-clamp-2 mb-2">
              {article.title}
            </h3>

            {article.excerpt && (
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                {article.excerpt}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {(article.author_name || "P")[0]}
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block leading-tight">
                    {article.author_name || "ProgramBI"}
                  </span>
                  <time
                    dateTime={article.published_at || article.created_at}
                    className="text-[11px] text-gray-400"
                  >
                    {formatDate(article.published_at || article.created_at)}
                  </time>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {article.reading_time_min} min
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

/* ── Main Blog Client ────────────────────────── */

export default function BlogClient({ articles }: { articles: any[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  const featured = filtered.find((a) => a.is_featured) || null;
  const rest = featured ? filtered.filter((a) => a.id !== featured.id) : filtered;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* ── Header ─────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 pt-12 pb-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-[#1890FF] no-underline text-gray-400 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 font-medium">Blog</span>
          </nav>

          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-3">
            Blog
          </h1>
          <p className="text-gray-500 text-base lg:text-lg max-w-2xl leading-relaxed">
            Artículos, tutoriales y guías prácticas sobre Power BI, SQL, Python,
            Machine Learning y análisis de datos.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-8" role="tablist" aria-label="Filtrar por categoría">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border-none cursor-pointer ${
                    isActive
                      ? "bg-[#1890FF] text-white shadow-md shadow-blue-500/20"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Content ────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 py-10">
        {filtered.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24">
            <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-5" />
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">
              No hay artículos en esta categoría
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
              Pronto publicaremos contenido increíble. ¡Vuelve pronto o explora otra categoría!
            </p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && <FeaturedHero article={featured} />}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
