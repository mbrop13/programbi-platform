"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Copy, 
  Check,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import ArticleBlockRenderer from "@/components/shared/ArticleBlockRenderer";

const categoryLabels: Record<string, string> = {
  "power-bi": "Tecnología",
  sql: "Tecnología",
  python: "Tecnología",
  ia: "AI",
  industria: "Economía",
  general: "Cultura",
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
      if (scrollHeight > 0) {
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

  const template = article.template || "default"; // default, tutorial, comparison
  const categoryLabel = categoryLabels[article.category] || article.category;

  // Author details (E-E-A-T booster)
  const isManuel = !article.author_name || article.author_name.toLowerCase().includes("manuel oliva");
  const authorBio = isManuel 
    ? "CEO y Fundador de ProgramBI SPA. Magíster en Data Science (Universidad Adolfo Ibáñez), Contador Auditor (U. de Concepción), Ex-Mesa de Dinero Banco Itaú Chile. Consultor y docente especializado en analítica empresarial."
    : "Instructor experto de ProgramBI, profesional activo de la industria especializado en análisis de datos, visualización y desarrollo de reportes.";

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Thin black reading progress bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-slate-950 z-50 transition-all duration-100"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Breadcrumbs Row & Back button */}
      <div className="border-b border-slate-100/80 py-4.5 pt-24 sm:pt-28">
        <div className="max-w-[1140px] mx-auto px-6 lg:px-12 xl:px-16 flex flex-wrap items-center justify-between gap-4">
          <Link 
            href="/blog" 
            className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-black uppercase tracking-widest no-underline transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Volver</span>
          </Link>
          
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-black no-underline text-slate-400 transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-black no-underline text-slate-400 transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 font-bold truncate max-w-[120px] sm:max-w-[200px]">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ── ARTICLE HEADER ── */}
      <header className="max-w-[900px] mx-auto px-6 pt-16 pb-10 text-center">
        <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#1890FF] mb-5">
          {categoryLabel}
        </span>
        
        <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-slate-950 leading-tight tracking-tight mb-8 max-w-4xl mx-auto">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-8 font-light max-w-3xl mx-auto">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-6 border-b border-slate-100 max-w-lg mx-auto">
          <span>por {article.author_name || "Manuel Oliva"}</span>
          <span>•</span>
          <span>{formatDate(article.published_at || article.created_at)}</span>
          <span>•</span>
          <span>{article.reading_time_min} min</span>
        </div>
      </header>

      {/* Cover Image */}
      {article.cover_image && (
        <div className="max-w-[1140px] mx-auto px-6 lg:px-12 xl:px-16 mb-16">
          <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
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
      <div className="max-w-[1140px] mx-auto px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Share Buttons Sidebar (Floating capsule) */}
          <aside className="lg:col-span-1 flex lg:flex-col lg:items-center justify-start gap-4 lg:py-6 order-2 lg:order-1 border-t lg:border-t-0 pt-6 lg:pt-0 border-slate-100 lg:sticky lg:top-32 bg-white lg:pr-6">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block mb-2 text-center w-full">Compartir</span>
            
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all duration-300"
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
              className="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all duration-300"
              title="Compartir en X / Twitter"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            <button 
              onClick={handleCopyLink}
              className="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all duration-300 border-none cursor-pointer"
              title="Copiar link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </aside>

          {/* Main Article Content & Tutorial Layout */}
          <main className={`${template === "tutorial" ? "lg:col-span-8" : "lg:col-span-11"} order-1 lg:order-2 flex flex-col`}>
            
            {/* Table of Contents for Mobile Tutorial layout */}
            {template === "tutorial" && headings.length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-6 mb-8 lg:hidden">
                <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-widest mb-4">
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
            <div className="border-y border-slate-100 py-10 mt-16 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-serif font-bold flex-shrink-0">
                {article.author_name ? article.author_name[0] : "P"}
              </div>
              <div className="flex-1">
                <h4 className="font-serif font-bold text-slate-950 text-lg mb-2 flex items-center gap-2">
                  Escrito por {article.author_name || "Manuel Oliva"}
                  <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {isManuel ? "CEO & Fundador" : "Docente"}
                  </span>
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed my-0 font-light">
                  {authorBio}
                </p>
              </div>
            </div>

          </main>

          {/* Table of Contents Sidebar (TUTORIAL LAYOUT ONLY) */}
          {template === "tutorial" && headings.length > 0 && (
            <aside className="lg:col-span-3 hidden lg:block order-3 lg:sticky lg:top-32 border-l border-slate-100 pl-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-sans font-bold text-[10px] tracking-widest text-slate-400 uppercase mb-4">
                    Contenido
                  </h3>
                  <nav className="max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                    <ul className="space-y-3.5 pl-0 list-none my-0">
                      {headings.map((h, i) => (
                        <li key={i} className="pl-0">
                          <a 
                            href={`#${h.id}`}
                            className="text-xs text-slate-500 hover:text-[#1890FF] no-underline font-medium leading-relaxed block transition-all hover:translate-x-0.5"
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

      {/* ── COURSE CTA SECTION (Newspaper Box Style Advert) ── */}
      <section className="max-w-[800px] mx-auto px-6 mt-20">
        <div className="border-4 border-slate-950 p-8 sm:p-12 text-center bg-white relative">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1890FF] mb-3 inline-block">
            PROGRAMBI CAPACITACIONES
          </span>
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-slate-950 leading-tight mb-4 tracking-tight">
            Domina SQL, Power BI y Python con expertos activos
          </h3>
          <p className="text-slate-650 text-sm sm:text-base leading-relaxed mb-8 font-light max-w-xl mx-auto">
            Capacítate 100% en vivo desde Chile y Latinoamérica con clases grabadas de por vida, soporte continuo y proyectos reales de la industria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cursos" 
              className="px-7 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs tracking-widest uppercase no-underline transition-all"
            >
              EXPLORAR CURSOS
            </Link>
            <Link 
              href="/asesorias" 
              className="px-7 py-3 border border-slate-950 hover:bg-slate-50 text-slate-950 font-bold text-xs tracking-widest uppercase no-underline transition-all"
            >
              ASESORÍAS CORPORATIVAS
            </Link>
          </div>
        </div>
      </section>

      {/* ── RELATED ARTICLES ── */}
      {related.length > 0 && (
        <section className="max-w-[1140px] mx-auto px-6 mt-28 pt-20 border-t border-slate-100">
          <h3 className="font-serif font-bold text-2xl text-slate-950 mb-8 tracking-tight text-center">
            Artículos Relacionados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((art: any) => {
              return (
                <Link key={art.id} href={`/blog/${art.slug}`} className="block no-underline group">
                  <article className="flex flex-col h-full bg-white">
                    {/* Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50 border border-slate-100">
                      {art.cover_image ? (
                        <Image
                          src={art.cover_image}
                          alt={art.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-slate-200" />
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="py-4 flex flex-col flex-1">
                      <span className="text-[9px] font-bold tracking-widest text-[#1890FF] uppercase mb-1.5">
                        {categoryLabels[art.category] || art.category}
                      </span>
                      <h4 className="font-serif font-bold text-base text-slate-950 leading-snug group-hover:underline decoration-[#1890FF] decoration-2 underline-offset-4 mb-2">
                        {art.title}
                      </h4>
                      <time className="text-[10px] text-slate-400 font-bold mt-auto block uppercase tracking-widest">
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
