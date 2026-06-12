"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Copy, 
  Check,
  ChevronRight,
  BookOpen,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ArticleBlockRenderer from "@/components/shared/ArticleBlockRenderer";

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

interface BlogArticleClientProps {
  article: any;
  related: any[];
}

export default function BlogArticleClient({ article, related }: BlogArticleClientProps) {
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Calculate reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = article.title;

  // Extract headings for Table of Contents (for tutorial layout)
  const headings = useMemo(() => {
    const extractedHeadings: { text: string; id: string; level: number }[] = [];
    
    // Try to parse blocks if JSON
    let blocks: any[] = [];
    try {
      blocks = JSON.parse(article.content);
    } catch (e) {
      // Not JSON, parse HTML
    }

    if (Array.isArray(blocks) && blocks.length > 0) {
      blocks.forEach((block: any, index: number) => {
        if (block.type === "heading") {
          const text = block.text;
          const id = `heading-${index}`;
          extractedHeadings.push({ text, id, level: block.level || 2 });
        }
      });
    } else {
      // HTML regex parsing
      const regex = /<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi;
      let match;
      let index = 0;
      while ((match = regex.exec(article.content)) !== null) {
        const text = match[2].replace(/<[^>]*>/g, "").trim();
        const id = `heading-html-${index}`;
        extractedHeadings.push({ text, id, level: parseInt(match[1]) });
        index++;
      }
    }
    return extractedHeadings;
  }, [article.content]);

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const catColor = categoryColors[article.category] || "#1890FF";
  const template = article.template || "default"; // default, tutorial, comparison

  // Author details (E-E-A-T booster)
  const isManuel = !article.author_name || article.author_name.toLowerCase().includes("manuel oliva");
  const authorBio = isManuel 
    ? "CEO y Fundador de ProgramBI. Magíster en Data Science (Universidad Adolfo Ibáñez), Contador Auditor (U. de Concepción), Ex-Mesa de Dinero Banco Itaú. Apasionado por enseñar análisis de datos y programar con IA."
    : "Instructor experto de ProgramBI capacitaciones en análisis de datos, automatizaciones e inteligencia de negocios.";

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-24">
      {/* Reading progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-[#1890FF] z-50 transition-all duration-100"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Breadcrumbs Row & Back button */}
      <div className="bg-white border-b border-gray-100 py-4 pt-24 sm:pt-28">
        <div className="max-w-4xl mx-auto px-5 flex flex-wrap items-center justify-between gap-4">
          <Link 
            href="/blog" 
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1890FF] no-underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al blog</span>
          </Link>
          
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-gray-400">
            <Link href="/" className="hover:text-[#1890FF] no-underline text-gray-400">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-[#1890FF] no-underline text-gray-400">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600 font-medium truncate max-w-[150px] sm:max-w-[240px]">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ── HEADER LAYOUTS ── */}
      {template === "comparison" ? (
        /* COMPARISON HERO */
        <header className="bg-slate-900 text-white py-16 lg:py-24 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-5">
            <span 
              className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white mb-6"
              style={{ backgroundColor: catColor }}
            >
              {categoryLabels[article.category] || article.category}
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.15] tracking-tight mb-6">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-slate-350 text-base sm:text-lg leading-relaxed max-w-3xl mb-8">
                {article.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                  {(article.author_name || "M")[0]}
                </div>
                <span>{article.author_name || "Manuel Oliva"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-550" />
                <time dateTime={article.published_at}>{formatDate(article.published_at || article.created_at)}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-555" />
                <span>{article.reading_time_min} min de lectura</span>
              </div>
            </div>
          </div>
        </header>
      ) : (
        /* DEFAULT & TUTORIAL HERO */
        <header className="max-w-4xl mx-auto px-5 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <span 
              className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
              style={{ backgroundColor: catColor }}
            >
              {categoryLabels[article.category] || article.category}
            </span>
            {article.is_featured && (
              <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
                Destacado
              </span>
            )}
          </div>
          
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-[1.15] tracking-tight mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-gray-500 text-lg leading-relaxed mb-6 font-medium">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {(article.author_name || "M")[0]}
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-800">
                  {article.author_name || "Manuel Oliva"}
                </span>
                <span className="text-xs text-gray-400">
                  Publicado el {formatDate(article.published_at || article.created_at)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.reading_time_min} min de lectura
              </span>
            </div>
          </div>
        </header>
      )}

      {/* Cover Image */}
      {article.cover_image && (
        <div className="max-w-4xl mx-auto px-5 mb-10">
          <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-lg shadow-black/5 bg-slate-100">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        </div>
      )}

      {/* ── BODY LAYOUTS ── */}
      <div className="max-w-4xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Share Buttons Sidebar */}
          <aside className="lg:col-span-1 flex lg:flex-col lg:items-center justify-start gap-4 lg:py-4 order-2 lg:order-1 border-t lg:border-t-0 pt-6 lg:pt-0 border-gray-150">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:block mb-2">Compartir</span>
            
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white hover:bg-blue-50 text-slate-500 hover:text-[#0077B5] border border-gray-200 flex items-center justify-center shadow-sm transition-all"
              title="Compartir en LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white hover:bg-sky-50 text-slate-500 hover:text-[#1DA1F2] border border-gray-200 flex items-center justify-center shadow-sm transition-all"
              title="Compartir en X / Twitter"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            <button 
              onClick={handleCopyLink}
              className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-gray-200 flex items-center justify-center shadow-sm transition-all border-none cursor-pointer"
              title="Copiar link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </aside>

          {/* Main Article Content & Tutorial Layout */}
          <main className={`${template === "tutorial" ? "lg:col-span-8" : "lg:col-span-11"} order-1 lg:order-2 flex flex-col`}>
            
            {/* Table of Contents for Mobile Tutorial layout */}
            {template === "tutorial" && headings.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-5 mb-8 lg:hidden">
                <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#1890FF]" />
                  Contenido de esta guía
                </h3>
                <nav>
                  <ul className="space-y-2.5 pl-0 list-none my-0">
                    {headings.map((h, i) => (
                      <li key={i} className="pl-0">
                        <a 
                          href={`#${h.id}`}
                          className="text-sm text-slate-600 hover:text-[#1890FF] no-underline font-medium leading-snug block transition-colors"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* Renderer */}
            <div className="prose-wrapper">
              <ArticleBlockRenderer content={article.content} />
            </div>

            {/* Author info box (E-E-A-T builder) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mt-12 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {(article.author_name || "M")[0]}
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-slate-900 text-lg mb-1.5 flex items-center gap-2">
                  Escrito por {article.author_name || "Manuel Oliva"}
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Docente</span>
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed my-0">
                  {authorBio}
                </p>
              </div>
            </div>

          </main>

          {/* Table of Contents Sidebar (TUTORIAL LAYOUT ONLY) */}
          {template === "tutorial" && headings.length > 0 && (
            <aside className="lg:col-span-3 hidden lg:block order-3">
              <div className="sticky top-32 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1890FF]" />
                    Contenido
                  </h3>
                  <nav className="max-h-[350px] overflow-y-auto pr-1">
                    <ul className="space-y-3.5 pl-0 list-none my-0">
                      {headings.map((h, i) => (
                        <li key={i} className="pl-0">
                          <a 
                            href={`#${h.id}`}
                            className="text-xs text-gray-500 hover:text-[#1890FF] no-underline font-medium leading-relaxed block transition-colors hover:translate-x-0.5 transform duration-150"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </aside>
          )}

        </div>
      </div>

      {/* ── COURSE CTA SECTION ── */}
      <section className="max-w-4xl mx-auto px-5 mt-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#1890FF] bg-[#1890FF]/10 px-3 py-1.5 rounded-full inline-block mb-4">
              Capacitaciones ProgramBI
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight mb-4">
              Domina SQL, Power BI y Python con instructores expertos
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Aprende en vivo desde Chile y Latinoamérica. Cursos prácticos con proyectos finales diseñados con bases de datos corporativas reales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/cursos" 
                className="px-6 py-3.5 rounded-xl bg-[#1890FF] hover:bg-blue-600 text-white font-bold text-sm text-center no-underline flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
              >
                <span>Ver Cursos Disponibles</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/asesorias" 
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm text-center no-underline transition-all hover:bg-white/20"
              >
                Asesorías Corporativas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED ARTICLES ── */}
      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-5 mt-20 pt-16 border-t border-gray-200/60">
          <h3 className="font-display font-black text-2xl text-slate-900 mb-8 tracking-tight">
            Artículos relacionados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((art: any) => {
              const artColor = categoryColors[art.category] || "#1890FF";
              return (
                <Link key={art.id} href={`/blog/${art.slug}`} className="block no-underline group">
                  <article className="bg-white rounded-2xl border border-gray-150 overflow-hidden hover:shadow-md transition-all duration-350 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50">
                      {art.cover_image ? (
                        <Image
                          src={art.cover_image}
                          alt={art.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-slate-350" />
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <span 
                        className="text-[9px] font-black uppercase tracking-wider mb-2 inline-block self-start text-white px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: artColor }}
                      >
                        {categoryLabels[art.category] || art.category}
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-900 leading-snug group-hover:text-[#1890FF] transition-colors line-clamp-2 mb-2">
                        {art.title}
                      </h4>
                      <time className="text-[10px] text-gray-450 mt-auto">
                        {formatDate(art.published_at || art.created_at)}
                      </time>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
