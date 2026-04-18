"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Newspaper, Bell } from "lucide-react";
import { getPublishedArticles, getNewsletterCategories } from "@/lib/supabase/comunidad-ai";
import { createClient } from "@/lib/supabase/client";

export default function NewsletterClient() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [user, setUser] = useState<any>(null);

  // Check auth
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // Load categories for label mapping
  useEffect(() => {
    getNewsletterCategories().then(cats => setCategories(cats)).catch(() => {});
  }, []);

  // Listen for category changes from navbar
  useEffect(() => {
    const handler = (e: Event) => {
      const category = (e as CustomEvent).detail;
      setActiveCategory(category);
    };
    window.addEventListener("nl-category", handler);
    return () => window.removeEventListener("nl-category", handler);
  }, []);

  // Load articles when category changes
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

  const featured = articles.find((a) => a.is_featured) || articles[0];
  const secondary = articles.filter((a) => a.id !== featured?.id).slice(0, 3);
  const rest = articles.filter((a) => a.id !== featured?.id && !secondary.find((s: any) => s.id === a.id));

  // Group remaining by category
  const groupedByCategory: Record<string, any[]> = {};
  rest.forEach((a) => {
    const cat = a.category || "general";
    if (!groupedByCategory[cat]) groupedByCategory[cat] = [];
    groupedByCategory[cat].push(a);
  });

  const getCatLabel = (slug: string) => {
    const found = categories.find(c => c.slug === slug);
    return found ? found.name.toUpperCase() : slug.toUpperCase();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="newsletter-page bg-white min-h-screen">
      {/* Editorial serif font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .newsletter-page .serif { font-family: 'Playfair Display', 'Georgia', serif; }
        .newsletter-page .serif-body { font-family: 'Source Serif 4', 'Georgia', serif; }
      `}</style>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          <span className="text-xs text-gray-400 mt-4 tracking-widest uppercase font-bold">Cargando</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-32 max-w-lg mx-auto px-5">
          <Newspaper className="w-12 h-12 text-gray-200 mx-auto mb-6" />
          <h2 className="serif text-3xl font-bold text-gray-900 mb-3">No hay artículos aún</h2>
          <p className="text-gray-400 text-sm leading-relaxed serif-body">
            Pronto publicaremos contenido increíble sobre análisis de datos, IA y tecnología. ¡Vuelve pronto!
          </p>
        </div>
      ) : (
        <div className="max-w-[1200px] mx-auto px-5">

          {/* ═══ HERO ARTICLE — Full width image with overlay ═══ */}
          {featured && (
            <Link href={`/newsletter/${featured.slug}`} className="block no-underline group">
              <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] overflow-hidden">
                {featured.cover_image ? (
                  <Image
                    src={featured.cover_image}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    unoptimized
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                  <span className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4 text-amber-300">
                    {getCatLabel(featured.category)}
                  </span>
                  <h1 className="serif text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] max-w-2xl mb-4">
                    {featured.title}
                  </h1>
                  <div className="w-12 h-[2px] bg-white/40 mb-4" />
                  <p className="text-sm text-white/70 italic serif-body">
                    por <span className="text-white/90">{featured.author_name || "ProgramBI"}</span>
                  </p>
                  <div className="mt-6">
                    <span className="inline-block px-6 py-2 border border-white/50 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all">
                      LEER
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ═══ SECONDARY ARTICLES — 3 columns below hero ═══ */}
          {secondary.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 py-10 border-b border-gray-200">
              {secondary.map((article, i) => (
                <Link key={article.id} href={`/newsletter/${article.slug}`} className="group block no-underline">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="relative w-full h-48 sm:h-52 overflow-hidden rounded-sm mb-4">
                      {article.cover_image ? (
                        <Image
                          src={article.cover_image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Newspaper className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2 block">
                      {getCatLabel(article.category)}
                    </span>
                    <h3 className="serif text-lg lg:text-xl font-bold text-gray-900 leading-tight group-hover:text-[#1890FF] transition-colors mb-2">
                      {article.title}
                    </h3>
                    <p className="text-[13px] text-gray-400 serif-body">
                      por <span className="text-gray-600 font-medium">{article.author_name || "ProgramBI"}</span>
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

          {/* ═══ NEWSLETTER SUBSCRIBE BANNER ═══ */}
          <div id="subscribe" className="py-12 border-b border-gray-200 text-center">
            <h2 className="serif text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Noticias de verdad al estilo <span className="italic">ProgramBI</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6 serif-body">
              Suscríbete y recibe artículos sobre datos, IA y tecnología cada semana, directo en tu correo.
            </p>
            <button
              onClick={() => {
                if (user) {
                  window.dispatchEvent(new CustomEvent("open-nl-subscribe"));
                } else {
                  window.dispatchEvent(new CustomEvent("open-nl-subscribe-auth"));
                }
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-bold text-xs tracking-[0.15em] uppercase rounded-sm transition-colors border-none cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              Suscribirme al Newsletter
            </button>
          </div>

          {/* ═══ CATEGORY SECTIONS — editorial flow ═══ */}
          {Object.entries(groupedByCategory).map(([category, catArticles]) => (
            <section key={category} className="py-10 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[12px] font-black tracking-[0.2em] uppercase text-gray-900">
                  {getCatLabel(category)}
                </h2>
                <span className="text-[11px] font-bold tracking-[0.15em] text-gray-300 uppercase">
                  Lo Último
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {catArticles[0] && (
                  <Link href={`/newsletter/${catArticles[0].slug}`} className="lg:col-span-7 group block no-underline">
                    <div className="relative w-full h-64 lg:h-80 overflow-hidden rounded-sm mb-4">
                      {catArticles[0].cover_image ? (
                        <Image
                          src={catArticles[0].cover_image}
                          alt={catArticles[0].title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <Newspaper className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <h3 className="serif text-2xl lg:text-3xl font-bold text-gray-900 leading-tight group-hover:text-[#1890FF] transition-colors mb-2">
                      {catArticles[0].title}
                    </h3>
                    {catArticles[0].excerpt && (
                      <p className="text-gray-500 text-sm serif-body leading-relaxed line-clamp-2 mb-2">
                        {catArticles[0].excerpt}
                      </p>
                    )}
                    <p className="text-[13px] text-gray-400 serif-body">
                      por <span className="text-gray-600 font-medium">{catArticles[0].author_name || "ProgramBI"}</span>
                      <span className="mx-2 text-gray-300">·</span>
                      <span>{formatDate(catArticles[0].published_at || catArticles[0].created_at)}</span>
                    </p>
                  </Link>
                )}

                {catArticles.length > 1 && (
                  <div className="lg:col-span-5 space-y-5">
                    {catArticles.slice(1, 5).map((article) => (
                      <Link key={article.id} href={`/newsletter/${article.slug}`} className="group flex gap-4 no-underline">
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm">
                          {article.cover_image ? (
                            <Image
                              src={article.cover_image}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                              <Newspaper className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="serif text-[15px] lg:text-base font-bold text-gray-900 leading-snug group-hover:text-[#1890FF] transition-colors line-clamp-2 mb-1">
                            {article.title}
                          </h4>
                          <p className="text-[12px] text-gray-400 serif-body">
                            por <span className="text-gray-500">{article.author_name || "ProgramBI"}</span>
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}

          <div className="h-16" />
        </div>
      )}
    </div>
  );
}
