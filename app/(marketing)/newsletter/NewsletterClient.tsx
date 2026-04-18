"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Search, Sparkles, ChevronRight, Newspaper, TrendingUp, Mail } from "lucide-react";
import { getPublishedArticles } from "@/lib/supabase/comunidad-ai";
import { FadeIn } from "@/components/shared/AnimatedComponents";

const CATEGORIES = [
  { id: "all", label: "Todos", icon: "📰" },
  { id: "power-bi", label: "Power BI", icon: "📊" },
  { id: "sql", label: "SQL", icon: "🗄️" },
  { id: "python", label: "Python", icon: "🐍" },
  { id: "ia", label: "IA", icon: "🤖" },
  { id: "industria", label: "Industria", icon: "🏭" },
  { id: "general", label: "General", icon: "💡" },
];

const categoryColors: Record<string, string> = {
  "power-bi": "#F2C811",
  sql: "#CC2927",
  python: "#3776AB",
  ia: "#7C3AED",
  industria: "#059669",
  general: "#1890FF",
};

export default function NewsletterClient() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getPublishedArticles(activeCategory === "all" ? undefined : activeCategory);
        setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    load();
  }, [activeCategory]);

  const filtered = searchQuery
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  const featured = filtered.find((a) => a.is_featured) || filtered[0];
  const rest = filtered.filter((a) => a.id !== featured?.id);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="-mt-20 lg:-mt-24 pt-20 lg:pt-24 bg-[#FAFBFC] min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-5 py-16 lg:py-24">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-blue-300 mb-6 border border-white/10">
                <Newspaper className="w-4 h-4" />
                Newsletter ProgramBI
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5 leading-[1.1]">
                Datos, Tecnología<br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">&amp; Transformación Digital</span>
              </h1>
              <p className="text-lg text-slate-400 font-medium max-w-lg mx-auto mb-8">
                Artículos, tutoriales y tendencias sobre el mundo del análisis de datos para profesionales que quieren ir más allá.
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CATEGORY BAR ═══ */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-none cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#0F172A] text-white shadow-md"
                    : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-[1200px] mx-auto px-5 py-12 lg:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-slate-200 border-t-[#1890FF] rounded-full animate-spin" />
            <span className="text-sm text-gray-400 mt-4 font-medium">Cargando artículos...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-gray-200 mx-auto mb-5" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No hay artículos aún</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              {searchQuery
                ? "No se encontraron artículos con esa búsqueda."
                : "Pronto publicaremos contenido increíble. ¡Vuelve pronto!"}
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <FadeIn>
                <Link href={`/newsletter/${featured.slug}`} className="group block mb-12 no-underline">
                  <div className="relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Image */}
                      <div className="relative h-64 lg:h-auto lg:min-h-[400px] overflow-hidden">
                        {featured.cover_image ? (
                          <Image
                            src={featured.cover_image}
                            alt={featured.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center">
                            <Sparkles className="w-16 h-16 text-white/20" />
                          </div>
                        )}
                        <div className="absolute top-5 left-5">
                          <span
                            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
                            style={{ backgroundColor: categoryColors[featured.category] || "#1890FF" }}
                          >
                            {CATEGORIES.find((c) => c.id === featured.category)?.label || featured.category}
                          </span>
                        </div>
                        <div className="absolute top-5 right-5">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-amber-900">
                            ⭐ Destacado
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4 text-xs text-gray-400 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {featured.reading_time_min} min de lectura
                          </span>
                          <span>•</span>
                          <span>{formatDate(featured.published_at || featured.created_at)}</span>
                        </div>
                        <h2 className="font-display font-black text-2xl lg:text-3xl text-[#0F172A] mb-4 leading-tight group-hover:text-[#1890FF] transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-gray-500 text-sm lg:text-base leading-relaxed mb-6 line-clamp-3">
                          {featured.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                              {(featured.author_name || "P")[0]}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-gray-900">{featured.author_name || "ProgramBI"}</span>
                            </div>
                          </div>
                          <span className="flex items-center gap-2 text-sm font-bold text-[#1890FF] group-hover:gap-3 transition-all">
                            Leer artículo <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            )}

            {/* Article Grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article, i) => (
                  <FadeIn key={article.id} delay={i * 0.05}>
                    <Link href={`/newsletter/${article.slug}`} className="group block no-underline h-full">
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 h-full flex flex-col hover:shadow-lg transition-shadow duration-300"
                      >
                        {/* Card Image */}
                        <div className="relative h-48 overflow-hidden">
                          {article.cover_image ? (
                            <Image
                              src={article.cover_image}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                              <Newspaper className="w-10 h-10 text-slate-300" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white"
                              style={{ backgroundColor: categoryColors[article.category] || "#1890FF" }}
                            >
                              {CATEGORIES.find((c) => c.id === article.category)?.label || article.category}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-3">
                            <Clock className="w-3 h-3" />
                            <span>{article.reading_time_min} min</span>
                            <span>•</span>
                            <span>{formatDate(article.published_at || article.created_at)}</span>
                          </div>
                          <h3 className="font-display font-bold text-[15px] text-[#0F172A] mb-2 leading-tight group-hover:text-[#1890FF] transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <span className="text-xs font-semibold text-gray-500">
                              {article.author_name || "ProgramBI"}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1890FF] group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══ SUBSCRIBE CTA ═══ */}
        <FadeIn>
          <div className="mt-16 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-10 lg:p-16 text-center text-white">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-bold text-blue-300 mb-6 border border-white/10">
                <Mail className="w-4 h-4" /> Suscríbete
              </div>
              <h2 className="font-display font-black text-3xl lg:text-4xl mb-4 tracking-tight">
                No te pierdas ningún artículo
              </h2>
              <p className="text-slate-400 text-sm lg:text-base max-w-md mx-auto mb-8">
                Recibe los mejores artículos sobre análisis de datos, IA y tecnología directamente en tu correo, cada semana.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = (e.target as any).email.value;
                  if (email) {
                    alert("¡Gracias por suscribirte! Te mantendremos informado.");
                    (e.target as any).reset();
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="tu@email.com"
                  className="flex-1 px-5 py-4 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-[#1890FF] hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all border-none cursor-pointer shadow-lg shadow-blue-500/25 whitespace-nowrap"
                >
                  Suscribirme →
                </button>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
