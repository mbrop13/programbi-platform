"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Search, X } from "lucide-react";

/* ── Category config ─────────────────────────── */

const CATEGORIES = [
  { value: "all", label: "Todo" },
  { value: "ia", label: "AI" },
  { value: "economia", label: "Economía" },
  { value: "tecnologia", label: "Tecnología" },
  { value: "cultura", label: "Cultura" },
] as const;

const categoryLabels: Record<string, string> = {
  "power-bi": "Tecnología",
  sql: "Tecnología",
  python: "Tecnología",
  ia: "AI",
  industria: "Economía",
  general: "Cultura",
};

/* ── Helpers ──────────────────────────────────── */

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Featured Hero (Editorial News Banner) ───── */

function FeaturedHero({ article }: { article: any }) {
  const categoryLabel = categoryLabels[article.category] || article.category;

  return (
    <Link href={`/blog/${article.slug}`} className="block no-underline group mb-16">
      <div className="w-full relative aspect-[21/9] lg:aspect-[2.39/1] min-h-[380px] md:min-h-[500px] bg-slate-950 overflow-hidden shadow-sm">
        {/* Background Image */}
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover opacity-50 transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
            unoptimized
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

        {/* Content Centered Over Image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center text-white z-10">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#1890FF] mb-4">
            {categoryLabel}
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white max-w-5xl leading-[1.15] mb-5 tracking-tight drop-shadow-md">
            {article.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light italic mb-8">
            por {article.author_name || "Manuel Oliva"}
          </p>
          <span className="px-8 py-3 border border-white hover:bg-white hover:text-black text-white text-xs font-bold tracking-widest uppercase transition-all duration-300">
            LEER
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Article Card (Newspaper Style) ──────────── */

function ArticleCard({ article, index }: { article: any; index: number }) {
  const categoryLabel = categoryLabels[article.category] || article.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="flex flex-col h-full bg-white group"
    >
      <Link href={`/blog/${article.slug}`} className="block no-underline text-slate-950 group-hover:opacity-95 transition-opacity">
        {/* Cover Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50 border border-slate-100">
          {article.cover_image ? (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-slate-200" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="py-6 flex flex-col flex-1">
          <span className="text-[9px] font-bold tracking-widest text-[#1890FF] uppercase mb-2.5">
            {categoryLabel}
          </span>
          <h3 className="font-serif font-bold text-xl lg:text-2xl text-slate-950 leading-snug mb-3 group-hover:underline decoration-[#1890FF] decoration-2 underline-offset-4 transition-all">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-slate-650 leading-relaxed font-light line-clamp-3 mb-5 flex-1">
              {article.excerpt}
            </p>
          )}
          <div className="text-[11px] text-slate-400 font-semibold mt-auto flex items-center gap-1.5">
            <span>por {article.author_name || "Manuel Oliva"}</span>
            <span>•</span>
            <span>{article.reading_time_min} min de lectura</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Main Blog Client ────────────────────────── */

export default function BlogClient({ articles }: { articles: any[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let temp = articles;

    // Filter by category
    if (activeCategory === "ia") {
      temp = temp.filter((a) => a.category === "ia");
    } else if (activeCategory === "economia") {
      temp = temp.filter((a) => a.category === "industria");
    } else if (activeCategory === "tecnologia") {
      temp = temp.filter((a) => ["power-bi", "sql", "python"].includes(a.category));
    } else if (activeCategory === "cultura") {
      temp = temp.filter((a) => a.category === "general");
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      temp = temp.filter((a) => 
        a.title.toLowerCase().includes(query) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(query)) ||
        (a.author_name && a.author_name.toLowerCase().includes(query))
      );
    }

    return temp;
  }, [articles, activeCategory, searchQuery]);

  const featured = filtered.find((a) => a.is_featured) || null;
  const rest = featured ? filtered.filter((a) => a.id !== featured.id) : filtered;

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* ── Main Header (Journal/Newspaper Header) ── */}
      <header className="max-w-[1200px] mx-auto px-6 pt-2 sm:pt-3 pb-8">
        
        {/* Top tagline */}
        <div className="flex items-center justify-end text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-3">
          <span className="hidden sm:inline">&nbsp;</span>
        </div>

        {/* Central Logo */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-slate-950 text-center pt-0 pb-4 select-none">
          Programbi
        </h1>

        {/* Division border */}
        <div className="border-t border-slate-950 mt-4 mb-2" />

        {/* Categories navigation & search */}
        <div className="flex flex-col md:flex-row items-center justify-between py-1.5 border-b border-slate-950/10 text-[10px] tracking-widest font-bold text-slate-700 min-h-[36px]">
          {/* Swipable categories row */}
          <div className="flex flex-nowrap md:flex-wrap items-center overflow-x-auto scrollbar-hide gap-6 md:gap-8 pb-3 md:pb-0 uppercase w-full md:w-auto -mx-6 px-6 md:mx-0 md:px-0 select-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`relative py-1.5 whitespace-nowrap cursor-pointer transition-colors border-none bg-transparent text-[10px] tracking-widest font-bold ${
                    isActive
                      ? "text-black border-b border-black font-extrabold"
                      : "text-slate-550 hover:text-slate-950"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right side static links */}
          <div className="flex items-center gap-6 mt-4 md:mt-0 uppercase select-none w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-105">
            <button 
              onClick={() => setIsSearchActive(!isSearchActive)}
              className={`hover:text-black transition-colors cursor-pointer bg-transparent border-none font-bold text-[10px] tracking-widest flex items-center gap-1.5 ${
                isSearchActive ? "text-[#1890FF]" : "text-slate-500"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isSearchActive ? "CERRAR BUSCAR" : "BUSCAR"}</span>
            </button>
            <Link href="#newsletter" className="hover:text-black no-underline transition-colors text-[10px] tracking-widest font-bold text-slate-500">
              SUSCRÍBETE
            </Link>
          </div>
        </div>

        {/* Sliding search bar */}
        <AnimatePresence>
          {isSearchActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden bg-slate-50 border-b border-slate-200 mt-2"
            >
              <div className="py-4 px-4 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-950 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar artículos por título, tema o autor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm tracking-wider text-slate-950 font-bold placeholder-slate-400 uppercase"
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="cursor-pointer bg-transparent border-none text-slate-450 hover:text-slate-950 text-[10px] tracking-widest font-bold uppercase transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-[1200px] mx-auto px-6">
        {filtered.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-slate-50 rounded-2xl border border-slate-100">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-5" />
            <h2 className="font-serif font-bold text-2xl text-slate-950 mb-2">
              No se encontraron artículos
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed font-light">
              Pronto publicaremos contenido increíble. ¡Vuelve pronto o intenta otra búsqueda!
            </p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && <FeaturedHero article={featured} />}

            {/* Title for Recent list */}
            {rest.length > 0 && (
              <h3 className="font-serif font-bold text-2xl text-slate-950 mb-8 border-b border-slate-100 pb-3 tracking-tight">
                Últimas Entradas
              </h3>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {rest.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
