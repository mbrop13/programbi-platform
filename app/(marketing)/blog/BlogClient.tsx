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

const CATEGORY_THEMES: Record<string, { color: string; rgb: string }> = {
  "power-bi": { color: "#F59E0B", rgb: "245, 158, 11" },
  sql: { color: "#EF4444", rgb: "239, 68, 68" },
  python: { color: "#3B82F6", rgb: "59, 130, 246" },
  ia: { color: "#8B5CF6", rgb: "139, 92, 246" },
  industria: { color: "#10B981", rgb: "16, 185, 129" },
  general: { color: "#1890FF", rgb: "24, 144, 255" },
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
  const theme = CATEGORY_THEMES[article.category] || CATEGORY_THEMES.general;

  return (
    <Link href={`/blog/${article.slug}`} className="block no-underline group mb-20">
      <div 
        className="relative rounded-3xl overflow-hidden bg-white border border-slate-100/80 shadow-[0_15px_50px_rgba(15,23,42,0.015)] hover:shadow-[0_30px_70px_rgba(var(--cat-rgb),0.12)] transition-all duration-500"
        style={{ "--cat-rgb": theme.rgb } as React.CSSProperties}
      >
        <div className="grid lg:grid-cols-12 gap-0">
          {/* Image */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[480px] overflow-hidden bg-slate-50 border-r border-slate-100/50">
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                unoptimized
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-slate-300" />
              </div>
            )}
            <div className="absolute top-5 left-5 z-20 flex gap-2.5">
              <span
                className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm animate-fade-in"
                style={{
                  backgroundColor: `${theme.color}14`,
                  borderColor: `${theme.color}33`,
                  color: theme.color,
                }}
              >
                {categoryLabels[article.category] || article.category}
              </span>
              <span className="bg-amber-500/10 backdrop-blur-md text-amber-700 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                Destacado
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-10 lg:p-12 xl:p-14 bg-white">
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight tracking-tight mb-5 group-hover:text-[#1890FF] transition-colors duration-300">
                {article.title}
              </h2>

              {article.excerpt && (
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 line-clamp-4 font-light">
                  {article.excerpt}
                </p>
              )}
            </div>

            {/* Author Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100/80 mt-auto">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border shadow-sm"
                  style={{
                    backgroundColor: `${theme.color}14`,
                    borderColor: `${theme.color}2b`,
                    color: theme.color
                  }}
                >
                  {article.author_name ? article.author_name[0] : "P"}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 block leading-none mb-1">
                    {article.author_name || "ProgramBI"}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {formatDate(article.published_at || article.created_at)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-100/80">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.reading_time_min} min</span>
                </span>
                <span className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-[#1890FF] group-hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-sm">
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
  const theme = CATEGORY_THEMES[article.category] || CATEGORY_THEMES.general;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link href={`/blog/${article.slug}`} className="block no-underline group h-full">
        <article 
          className="bg-white rounded-3xl border border-slate-100/80 overflow-hidden hover:-translate-y-2 transition-all duration-300 h-full flex flex-col shadow-[0_10px_30px_rgba(15,23,42,0.01)] hover:shadow-[0_20px_45px_rgba(var(--cat-rgb),0.12)]"
          style={{ "--cat-rgb": theme.rgb } as React.CSSProperties}
        >
          {/* Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50 border-b border-slate-100/30">
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-slate-300" />
              </div>
            )}
            {/* Category tag overlaid on top left */}
            <span
              className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm backdrop-blur-md"
              style={{
                backgroundColor: `${theme.color}24`,
                borderColor: `${theme.color}47`,
                color: theme.color,
              }}
            >
              {categoryLabels[article.category] || article.category}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-7 flex flex-col flex-1">
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 leading-snug group-hover:text-[#1890FF] transition-colors duration-300 line-clamp-2 mb-3">
              {article.title}
            </h3>

            {article.excerpt && (
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6 flex-1 font-light">
                {article.excerpt}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4.5 border-t border-slate-100/80 mt-auto">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-xs font-bold border"
                  style={{
                    backgroundColor: `${theme.color}14`,
                    borderColor: `${theme.color}2b`,
                    color: theme.color
                  }}
                >
                  {article.author_name ? article.author_name[0] : "P"}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block leading-none mb-1">
                    {article.author_name || "ProgramBI"}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium leading-none">
                    {formatDate(article.published_at || article.created_at)}
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-100/80">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.reading_time_min} min</span>
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
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white pb-28 relative overflow-hidden">
      {/* Premium background grid pattern & radial glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden max-h-[1000px]">
        <div
          className="absolute inset-0"
          style={{
            backgroundSize: "60px 60px",
            backgroundImage:
              "linear-gradient(to right, rgba(24,144,255,0.018) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,144,255,0.018) 1px, transparent 1px)",
          }}
        />
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-[#1890FF]/8 to-blue-500/8 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/5 to-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/5 to-blue-500/5 rounded-full blur-[110px]" />
      </div>

      <div className="relative z-10">
        {/* ── Header ─────────────────────────── */}
        <header className="max-w-[1340px] mx-auto px-6 lg:px-12 xl:px-16 pt-32 sm:pt-36 pb-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8">
            <Link href="/" className="hover:text-[#1890FF] no-underline text-slate-400 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-700 font-bold">Blog</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#1890FF] text-[10px] font-black uppercase tracking-wider mb-5 shadow-sm">
            Recursos y Conocimiento Técnico
          </span>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-slate-900 tracking-tight leading-[1.08] mb-5">
            Blog de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">
              Datos e IA
            </span>
          </h1>
          <p className="text-slate-500 text-base lg:text-lg max-w-2xl leading-relaxed font-light">
            Artículos de nivel profesional, tutoriales técnicos y guías de aplicación en vivo sobre SQL Server, Power BI, Python y Machine Learning.
          </p>

          {/* Category Filter Tabs (Sliding Glass menu style!) */}
          <div className="relative flex flex-wrap gap-1 mt-12 p-1 bg-white/80 backdrop-blur-xl border border-slate-200/40 rounded-2xl w-max max-w-full shadow-[0_8px_32px_rgba(31,38,135,0.04)]" role="tablist" aria-label="Filtrar por categoría">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`relative py-2.5 px-5.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center whitespace-nowrap z-10 border-none cursor-pointer bg-transparent ${
                    isActive
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryGlow"
                      className="absolute inset-0 bg-gradient-to-r from-[#1890FF] to-blue-500 rounded-xl -z-10 shadow-[0_4px_14px_rgba(24,144,255,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)]"
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
        <main className="max-w-[1340px] mx-auto px-6 lg:px-12 xl:px-16 py-4">
          {filtered.length === 0 ? (
            /* Empty State */
            <div className="text-center py-28 bg-white rounded-3xl border border-slate-100 shadow-[0_15px_50px_rgba(15,23,42,0.01)]">
              <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-2">
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
                <h3 className="font-display font-extrabold text-xl lg:text-2xl text-slate-900 mb-8 tracking-tight">
                  Últimos Artículos
                </h3>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
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
