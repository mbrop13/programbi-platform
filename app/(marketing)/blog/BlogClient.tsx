"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, BookOpen, ChevronRight, Sparkles } from "lucide-react";

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
  "power-bi": "#F59E0B", // Amber
  sql: "#EF4444",      // Red
  python: "#3B82F6",   // Blue
  ia: "#8B5CF6",       // Purple
  industria: "#10B981",// Emerald
  general: "#1890FF",  // Brand Blue
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
    <Link href={`/blog/${article.slug}`} className="block no-underline group mb-16">
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-100 hover:border-slate-200/80 shadow-[0_15px_40px_rgba(15,23,42,0.015)] hover:shadow-[0_30px_70px_rgba(24,144,255,0.07)] transition-all duration-500">
        <div className="grid lg:grid-cols-12 gap-0">
          {/* Image */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[460px] overflow-hidden bg-slate-50">
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                unoptimized
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-slate-350" />
              </div>
            )}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <span
                className="px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-sm"
                style={{ backgroundColor: catColor }}
              >
                {categoryLabels[article.category] || article.category}
              </span>
              <span className="bg-slate-900/80 backdrop-blur-md text-amber-400 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                Destacado
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-10 lg:p-12 bg-white">
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight tracking-tight mb-4 group-hover:text-[#1890FF] transition-colors duration-300">
                {article.title}
              </h2>

              {article.excerpt && (
                <p className="text-slate-550 text-sm sm:text-base leading-relaxed mb-6 line-clamp-4 font-light">
                  {article.excerpt}
                </p>
              )}
            </div>

            {/* Author Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {article.author_name ? article.author_name[0] : "P"}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 block leading-none mb-1">
                    {article.author_name || "ProgramBI"}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {formatDate(article.published_at || article.created_at)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {article.reading_time_min} min
                </span>
                <span className="w-9 h-9 rounded-full bg-slate-50 hover:bg-[#1890FF] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-100 group-hover:border-[#1890FF] group-hover:scale-105">
                  <ChevronRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Article Card ────────────────────────────── */

function ArticleCard({ article, index }: { article: any; index: number }) {
  const catColor = categoryColors[article.category] || "#1890FF";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link href={`/blog/${article.slug}`} className="block no-underline group h-full">
        <article className="bg-white rounded-3xl border border-slate-100 hover:border-slate-200 overflow-hidden hover:-translate-y-2 transition-all duration-350 h-full flex flex-col shadow-[0_10px_30px_rgba(15,23,42,0.015)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.04)]">
          {/* Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50">
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-750 group-hover:scale-[1.04]"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-slate-300" />
              </div>
            )}
            {/* Category tag overlaid on top left */}
            <span
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-sm"
              style={{ backgroundColor: catColor }}
            >
              {categoryLabels[article.category] || article.category}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-display font-black text-lg text-slate-900 leading-snug group-hover:text-[#1890FF] transition-colors duration-300 line-clamp-2 mb-3">
              {article.title}
            </h3>

            {article.excerpt && (
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6 flex-1 font-light">
                {article.excerpt}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {article.author_name ? article.author_name[0] : "P"}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block leading-none mb-0.5">
                    {article.author_name || "ProgramBI"}
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-none">
                    {formatDate(article.published_at || article.created_at)}
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-100">
                <Clock className="w-3 h-3 text-slate-400" />
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
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white pb-24 relative overflow-hidden">
      {/* Premium background accents */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden max-h-[900px]">
        <div
          className="absolute inset-0"
          style={{
            backgroundSize: "40px 40px",
            backgroundImage:
              "linear-gradient(to right, rgba(24,144,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,144,255,0.015) 1px, transparent 1px)",
          }}
        />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-indigo-100/10 rounded-full blur-[110px]" />
      </div>

      <div className="relative z-10">
        {/* ── Header ─────────────────────────── */}
        <header className="max-w-[1300px] mx-auto px-6 lg:px-12 xl:px-16 pt-28 sm:pt-32 pb-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-[#1890FF] no-underline text-gray-400 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <span className="text-slate-700 font-medium">Blog</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1890FF] text-xs font-bold uppercase tracking-wider mb-4">
            Recursos y Conocimiento
          </span>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight mb-4">
            Blog de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">
              Datos e IA
            </span>
          </h1>
          <p className="text-slate-500 text-base lg:text-lg max-w-2xl leading-relaxed font-light">
            Artículos de nivel profesional, tutoriales técnicos y guías de aplicación en vivo sobre SQL Server, Power BI, Python y Machine Learning.
          </p>

          {/* Category Filter Tabs (Sliding Glass menu style!) */}
          <div className="relative flex flex-wrap gap-1 mt-10 p-1 bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-2xl w-max max-w-full shadow-[0_8px_30px_rgba(0,0,0,0.03)]" role="tablist" aria-label="Filtrar por categoría">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`relative py-2.5 px-5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center whitespace-nowrap z-10 border-none cursor-pointer bg-transparent ${
                    isActive
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryGlow"
                      className="absolute inset-0 bg-gradient-to-r from-[#1890FF] to-blue-500 rounded-xl -z-10 shadow-[0_4px_12px_rgba(24,144,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* ── Content ────────────────────────── */}
        <main className="max-w-[1300px] mx-auto px-6 lg:px-12 xl:px-16 py-4">
          {filtered.length === 0 ? (
            /* Empty State */
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.01)]">
              <BookOpen className="w-14 h-14 text-slate-200 mx-auto mb-5" />
              <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">
                No hay artículos en esta categoría
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed font-light">
                Pronto publicaremos contenido increíble. ¡Vuelve pronto o explora otra categoría!
              </p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && <FeaturedHero article={featured} />}

              {/* Grid Title */}
              {rest.length > 0 && (
                <h3 className="font-display font-black text-xl text-slate-900 mb-8 tracking-tight">
                  Últimos Artículos
                </h3>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
