"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Search, X, Sparkles, DollarSign, Cpu, Sliders, ChevronLeft, Trophy } from "lucide-react";
import BlogPreferences, { BlogPrefs, defaultPrefs } from "@/components/shared/BlogPreferences";
import { createClient } from "@/lib/supabase/client";
import { applyInlineMarkdown } from "@/components/shared/ArticleBlockRenderer";
import { isVideoUrl } from "@/lib/utils";

function getPosterFromContent(content?: string): string | undefined {
  if (!content) return undefined;
  const match = content.match(/^(?:#\s*)?(?:poster|thumbnail|thumbnail_url|cover_poster|imagen_compartido|imagen|image)\s*:\s*(https?:\/\/[^\s\n]+)/im);
  return match ? match[1].trim() : undefined;
}

function getVideoFromContent(content?: string): string | undefined {
  if (!content) return undefined;
  const match = content.match(/^(?:#\s*)?(?:video|video_url)\s*:\s*(https?:\/\/[^\s\n]+)/im);
  return match ? match[1].trim() : undefined;
}

/* ── Category config ─────────────────────────── */

const CATEGORIES = [
  { value: "all", label: "Todo" },
  { value: "ia", label: "AI" },
  { value: "economia", label: "Economía" },
  { value: "tecnologia", label: "Tecnología" },
  { value: "deporte", label: "Deporte" },
  { value: "cultura", label: "Cultura" },
] as const;

const categoryLabels: Record<string, string> = {
  "power-bi": "Tecnología",
  sql: "Tecnología",
  python: "Tecnología",
  tecnologia: "Tecnología",
  ia: "AI",
  industria: "Economía",
  economia: "Economía",
  deporte: "Deporte",
  futbol: "Deporte",
  running: "Deporte",
  general: "Cultura",
  cultura: "Cultura",
};

/* ── Helpers ──────────────────────────────────── */

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Featured News Slider (Editorial Carrusel) ─── */

function BlogSlider({ articles }: { articles: any[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % articles.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [index, articles.length]);

  // Reset index if filtered articles length changes to avoid out of bounds
  useEffect(() => {
    setIndex(0);
  }, [articles.length]);

  if (articles.length === 0) return null;

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % articles.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const current = articles[index];
  const categoryLabel = categoryLabels[current.category] || current.category;

  return (
    <div className="relative w-full mb-16 select-none overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-slate-950">
      <div className="relative w-full aspect-[21/9] lg:aspect-[2.39/1] min-h-[350px] md:min-h-[480px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Link href={`/blog/${current.slug}`} className="absolute inset-0 block no-underline group">
              {(() => {
                const videoUrl = getVideoFromContent(current.content) || (isVideoUrl(current.cover_image) ? current.cover_image : undefined);
                if (videoUrl) {
                  return (
                    <video
                      src={videoUrl}
                      poster={isVideoUrl(current.cover_image) ? getPosterFromContent(current.content) : current.cover_image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                    />
                  );
                }
                if (current.cover_image) {
                  return (
                    <Image
                      src={current.cover_image}
                      alt={current.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1200px"
                      className="object-cover opacity-60 transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                      priority
                    />
                  );
                }
                return <div className="absolute inset-0 bg-slate-900" />;
              })()}
              {/* Overlay Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

              {/* Centered Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center text-white z-10">
                <h2 className="font-serif font-bold text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white max-w-5xl leading-[1.15] mb-8 tracking-tight drop-shadow-md">
                  {current.title}
                </h2>
                <span className="px-8 py-3 border border-white hover:bg-white hover:text-black text-white text-xs font-bold tracking-widest uppercase transition-all duration-300">
                  LEER
                </span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {articles.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/55 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/55 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots indicators */}
        {articles.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer p-0 border-none ${
                  i === index ? "bg-[#171716] w-6" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Article Card (Newspaper Style) ──────────── */

function ArticleCard({ article, index }: { article: any; index: number }) {
  const categoryLabel = categoryLabels[article.category] || article.category;
  const poster = getPosterFromContent(article.content);
  const displayImage = isVideoUrl(article.cover_image) ? (poster || article.cover_image) : article.cover_image;
  const isDisplayVideo = isVideoUrl(displayImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="flex flex-col h-full bg-white group"
    >
      <Link href={`/blog/${article.slug}`} className="block no-underline text-slate-950 group-hover:opacity-95 transition-opacity">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50 border border-slate-100 rounded-xl">
          {displayImage ? (
            isDisplayVideo ? (
              <video
                src={displayImage}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            ) : (
              <Image
                src={displayImage}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            )
          ) : (
            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-slate-200" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="py-6 flex flex-col flex-1">
          <span className="text-[9px] font-bold tracking-widest text-[#171716] uppercase mb-2.5">
            {categoryLabel}
          </span>
          <h3 className="font-serif font-bold text-xl lg:text-2xl text-slate-950 leading-snug mb-3 group-hover:underline decoration-[#171716] decoration-2 underline-offset-4 transition-all">
            {article.title}
          </h3>
          {article.excerpt && (
            <p 
              className="text-sm text-slate-650 leading-relaxed font-light line-clamp-3 mb-5 flex-1"
              dangerouslySetInnerHTML={{ __html: applyInlineMarkdown(article.excerpt) }}
            />
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
  const [prefs, setPrefs] = useState<BlogPrefs>(defaultPrefs);
  const [showPrefs, setShowPrefs] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("programbi-blog-prefs");
    if (saved) {
      try {
        setPrefs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse preferences:", e);
      }
    }
  }, []);

  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory("all");
    } else {
      setActiveCategory(category);
    }
  };

  const filtered = useMemo(() => {
    let temp = articles;

    // Filter by category
    if (activeCategory === "ia") {
      temp = temp.filter((a) => a.category === "ia");
    } else if (activeCategory === "economia") {
      temp = temp.filter((a) => ["industria", "economia"].includes(a.category));
    } else if (activeCategory === "tecnologia") {
      temp = temp.filter((a) => ["power-bi", "sql", "python", "tecnologia"].includes(a.category));
    } else if (activeCategory === "deporte") {
      temp = temp.filter((a) => ["deporte", "futbol", "running", "deportes"].includes(a.category));
    } else if (activeCategory === "cultura") {
      temp = temp.filter((a) => ["general", "cultura"].includes(a.category));
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

  const sliderArticles = filtered.slice(0, Math.min(5, filtered.length));
  const gridArticles = filtered;

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
                isSearchActive ? "text-[#171716]" : "text-slate-500"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isSearchActive ? "CERRAR BUSCAR" : "BUSCAR"}</span>
            </button>
            {!user && (
              <button 
                onClick={() => window.dispatchEvent(new Event("open-nl-subscribe"))}
                className="hover:text-black no-underline transition-colors text-[10px] tracking-widest font-bold text-slate-500 cursor-pointer bg-transparent border-none uppercase"
              >
                SUSCRÍBETE
              </button>
            )}
          </div>
        </div>

        {/* Sliding search bar */}
        <AnimatePresence>
          {isSearchActive && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden mt-3 mb-6"
            >
              <div className="max-w-[600px] mx-auto">
                <div className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-sm transition-all duration-300 focus-within:bg-white focus-within:border-slate-950 focus-within:shadow-md">
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0 transition-colors group-focus-within:text-slate-950" />
                  <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm tracking-wider text-slate-950 font-bold placeholder-slate-400 uppercase focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
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
            {/* News Slider (Latest 5 articles) */}
            {sliderArticles.length > 0 && <BlogSlider articles={sliderArticles} />}

            {/* Title for Recent list */}
            {gridArticles.length > 0 && (
              <h3 className="font-serif font-bold text-2xl text-slate-950 mb-8 border-b border-slate-100 pb-3 tracking-tight">
                Últimas Entradas
              </h3>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {gridArticles.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Menu (Floating Circular Liquid Glass) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[360px] bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 flex items-center justify-between shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] select-none">
        {[
          { value: "ia", label: "AI", icon: Sparkles },
          { value: "economia", label: "Economía", icon: DollarSign },
          { value: "tecnologia", label: "Tecno", icon: Cpu },
          { value: "deporte", label: "Deporte", icon: Trophy },
          { value: "cultura", label: "Cultura", icon: BookOpen },
        ].map((tab) => {
          const isActive = activeCategory === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => handleCategoryClick(tab.value)}
              className="relative flex flex-col items-center justify-center flex-1 py-1 px-1.5 rounded-full transition-all duration-300 border-none bg-transparent cursor-pointer group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeMobileTab"
                  className="absolute inset-0 bg-gradient-to-r from-[#171716]/25 to-indigo-500/25 border border-[#171716]/35 rounded-full -z-10 shadow-[0_2px_10px_rgba(24,144,255,0.15)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center"
              >
                <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? "text-blue-400" : "text-white/60 group-hover:text-white"}`} />
                <span className={`text-[8px] uppercase tracking-wider font-sans font-bold mt-0.5 transition-colors duration-300 ${isActive ? "text-white" : "text-white/50 group-hover:text-white"}`}>
                  {tab.label}
                </span>
              </motion.div>
            </button>
          );
        })}
      </div>

      {/* Floating Preferences Button */}
      <button
        onClick={() => setShowPrefs(true)}
        className={`fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-200 flex ${
          prefs.theme === "dark" ? "bg-white text-slate-950 hover:bg-slate-100" : "bg-slate-950 text-white hover:bg-slate-800"
        }`}
        title="Preferencias de lectura"
      >
        <Sliders className="w-5 h-5" />
      </button>

      {/* Preferences panel (reused, changes will persist and apply on article page) */}
      <BlogPreferences
        isOpen={showPrefs}
        onClose={() => setShowPrefs(false)}
        prefs={prefs}
        onChange={setPrefs}
      />
    </div>
  );
}
