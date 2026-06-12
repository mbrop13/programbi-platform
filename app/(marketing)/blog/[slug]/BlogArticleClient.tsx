"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
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
    ? "CEO y Fundador de ProgramBI SPA. Magíster en Data Science (Universidad Adolfo Ibáñez), Contador Auditor (U. de Concepción), Ex-Mesa de Dinero Banco Itaú Chile. Consultor y docente especializado en analítica empresarial."
    : "Instructor experto de ProgramBI, profesional activo de la industria especializado en análisis de datos, visualización y desarrollo de reportes.";

  return (
    <div className="min-h-screen bg-white pb-24 relative overflow-hidden">
      {/* Reading progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-[#1890FF] z-50 transition-all duration-100"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Breadcrumbs Row & Back button */}
      <div className="bg-slate-50/50 border-b border-slate-100 py-4 pt-24 sm:pt-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 xl:px-16 flex flex-wrap items-center justify-between gap-4">
          <Link 
            href="/blog" 
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1890FF] no-underline transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Volver al blog</span>
          </Link>
          
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-gray-400">
            <Link href="/" className="hover:text-[#1890FF] no-underline text-gray-400">Inicio</Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <Link href="/blog" className="hover:text-[#1890FF] no-underline text-gray-400">Blog</Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-600 font-semibold truncate max-w-[150px] sm:max-w-[240px]">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ── HEADER LAYOUTS ── */}
      {template === "comparison" ? (
        /* COMPARISON HERO (Dark Premium) */
        <header className="bg-slate-900 text-white py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-[1100px] mx-auto px-6 lg:px-12 xl:px-16 relative z-10">
            <span 
              className="inline-block px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-6 shadow-sm"
              style={{ backgroundColor: catColor }}
            >
              {categoryLabels[article.category] || article.category}
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight mb-6 max-w-4xl">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mb-8 font-light">
                {article.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1890FF] to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {article.author_name ? article.author_name[0] : "P"}
                </div>
                <span className="font-semibold text-slate-300">{article.author_name || "Manuel Oliva"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <time dateTime={article.published_at}>{formatDate(article.published_at || article.created_at)}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{article.reading_time_min} min de lectura</span>
              </div>
            </div>
          </div>
        </header>
      ) : (
        /* DEFAULT & TUTORIAL HERO */
        <header className="max-w-[1100px] mx-auto px-6 lg:px-12 xl:px-16 pt-12 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <span 
              className="inline-block px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-sm"
              style={{ backgroundColor: catColor }}
            >
              {categoryLabels[article.category] || article.category}
            </span>
            {article.is_featured && (
              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Destacado
              </span>
            )}
          </div>
          
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight tracking-tight mb-6 max-w-4xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-light max-w-3xl">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {article.author_name ? article.author_name[0] : "P"}
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-800">
                  {article.author_name || "Manuel Oliva"}
                </span>
                <span className="text-xs text-slate-400">
                  Publicado el {formatDate(article.published_at || article.created_at)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{article.reading_time_min} min de lectura</span>
            </div>
          </div>
        </header>
      )}

      {/* Cover Image */}
      {article.cover_image && (
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 xl:px-16 mb-12">
          <div className="relative aspect-[21/9] w-full rounded-[2rem] overflow-hidden shadow-xl shadow-black/5 bg-slate-50 border border-slate-100">
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
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Share Buttons Sidebar (Floating capsule) */}
          <aside className="lg:col-span-1 flex lg:flex-col lg:items-center justify-start gap-4 lg:py-6 order-2 lg:order-1 border-t lg:border-t-0 pt-6 lg:pt-0 border-slate-100 lg:sticky lg:top-28 bg-white lg:p-2 lg:border lg:border-slate-150/60 lg:rounded-2xl lg:shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden lg:block mb-2 text-center w-full">Compartir</span>
            
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#0077B5] text-slate-500 hover:text-white border border-slate-150/60 flex items-center justify-center shadow-sm transition-all duration-300"
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
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-900 text-slate-500 hover:text-white border border-slate-150/60 flex items-center justify-center shadow-sm transition-all duration-300"
              title="Compartir en X / Twitter"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            <button 
              onClick={handleCopyLink}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#1890FF] text-slate-500 hover:text-white border border-slate-150/60 flex items-center justify-center shadow-sm transition-all duration-300 border-none cursor-pointer"
              title="Copiar link"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            </button>
          </aside>

          {/* Main Article Content & Tutorial Layout */}
          <main className={`${template === "tutorial" ? "lg:col-span-8" : "lg:col-span-11"} order-1 lg:order-2 flex flex-col`}>
            
            {/* Table of Contents for Mobile Tutorial layout */}
            {template === "tutorial" && headings.length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-8 lg:hidden">
                <h3 className="font-display font-black text-xs text-slate-850 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#1890FF]" />
                  Contenido de esta guía
                </h3>
                <nav>
                  <ul className="space-y-3 pl-0 list-none my-0">
                    {headings.map((h, i) => (
                      <li key={i} className="pl-0">
                        <a 
                          href={`#${h.id}`}
                          className="text-xs text-slate-600 hover:text-[#1890FF] no-underline font-semibold leading-snug block transition-colors"
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
            <div className="bg-slate-50 rounded-3xl border border-slate-150/60 p-6 sm:p-8 mt-16 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md shadow-blue-500/10">
                {article.author_name ? article.author_name[0] : "P"}
              </div>
              <div className="flex-1">
                <h4 className="font-display font-black text-slate-900 text-lg mb-2 flex items-center gap-2">
                  Escrito por {article.author_name || "Manuel Oliva"}
                  <span className="text-[9px] bg-blue-50 border border-blue-150 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {isManuel ? "CEO & Fundador" : "Docente"}
                  </span>
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed my-0 font-light">
                  {authorBio}
                </p>
              </div>
            </div>

          </main>

          {/* Table of Contents Sidebar (TUTORIAL LAYOUT ONLY) */}
          {template === "tutorial" && headings.length > 0 && (
            <aside className="lg:col-span-3 hidden lg:block order-3 lg:sticky lg:top-28">
              <div className="space-y-6">
                <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5">
                  <h3 className="font-display font-black text-[10px] text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#1890FF]" />
                    Contenido
                  </h3>
                  <nav className="max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                    <ul className="space-y-3.5 pl-0 list-none my-0">
                      {headings.map((h, i) => (
                        <li key={i} className="pl-0">
                          <a 
                            href={`#${h.id}`}
                            className="text-xs text-slate-500 hover:text-[#1890FF] no-underline font-semibold leading-relaxed block transition-all hover:translate-x-1 duration-150"
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

      {/* ── COURSE CTA SECTION (Mesh Gradient) ── */}
      <section className="max-w-[1100px] mx-auto px-6 lg:px-12 xl:px-16 mt-20">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#1890FF]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#1890FF] bg-[#1890FF]/10 px-3 py-1.5 rounded-full inline-block mb-4 border border-[#1890FF]/20 shadow-sm">
              Capacitaciones ProgramBI
            </span>
            <h3 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight mb-4 tracking-tight">
              Domina SQL, Power BI y Python con expertos activos
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-light">
              Capacítate 100% en vivo desde Chile y Latinoamérica con clases grabadas de por vida, soporte continuo y Capstone Projects diseñados con datos reales de la industria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/cursos" 
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#1890FF] to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm text-center no-underline flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 border border-blue-400/20"
              >
                <span>Explorar Cursos</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/asesorias" 
                className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm text-center no-underline transition-all border border-white/5"
              >
                Asesorías Corporativas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED ARTICLES ── */}
      {related.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-6 lg:px-12 xl:px-16 mt-24 pt-16 border-t border-slate-100">
          <h3 className="font-display font-black text-2xl text-slate-900 mb-8 tracking-tight">
            Artículos relacionados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((art: any) => {
              const artColor = categoryColors[art.category] || "#1890FF";
              return (
                <Link key={art.id} href={`/blog/${art.slug}`} className="block no-underline group">
                  <article className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
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
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-slate-300" />
                        </div>
                      )}
                      <span 
                        className="absolute top-3 left-3 text-[8px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-full shadow-sm"
                        style={{ backgroundColor: artColor }}
                      >
                        {categoryLabels[art.category] || art.category}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="font-display font-bold text-base text-slate-900 leading-snug group-hover:text-[#1890FF] transition-colors duration-300 line-clamp-2 mb-3">
                        {art.title}
                      </h4>
                      <time className="text-[10px] text-slate-400 mt-auto block">
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
