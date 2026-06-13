"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Copy, 
  Check,
  ChevronRight,
  BookOpen,
  Sliders,
  Eye,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ArticleBlockRenderer, { applyInlineMarkdown } from "@/components/shared/ArticleBlockRenderer";
import BlogPreferences, { BlogPrefs, defaultPrefs } from "@/components/shared/BlogPreferences";
import { isVideoUrl } from "@/lib/utils";

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
  const articleRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [prefs, setPrefs] = useState<BlogPrefs>(defaultPrefs);
  const [showPrefs, setShowPrefs] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("programbi-blog-prefs");
    if (saved) {
      try {
        setPrefs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse blog preferences:", e);
      }
    }
  }, []);

  // Calculate reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      if (articleRef.current) {
        const rect = articleRef.current.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        const absoluteBottom = absoluteTop + rect.height;
        const maxScroll = absoluteBottom - window.innerHeight;
        if (maxScroll > 0) {
          const progress = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
          setReadingProgress(Math.round(progress));
        } else {
          setReadingProgress(100);
        }
      }
    };

    window.addEventListener("scroll", updateReadingProgress);
    updateReadingProgress();
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

  // Dynamic theme wrapper classes
  const themeCls = prefs.theme === "dark" 
    ? "bg-slate-950 text-slate-100 theme-dark" 
    : prefs.theme === "sepia" 
    ? "bg-[#F4ECD8] text-[#5B4636] theme-sepia" 
    : "bg-white text-slate-900";

  // ShareRow component to render share buttons horizontally
  const ShareRow = () => (
    <div className="flex items-center gap-2.5 justify-center py-2.5">
      <span className={`text-[9px] font-bold uppercase tracking-widest mr-1.5 ${
        prefs.theme === "dark" ? "text-slate-500" : "text-slate-400"
      }`}>Compartir</span>
      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          prefs.theme === "dark" ? "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800"
        }`}
        title="Compartir en LinkedIn"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          prefs.theme === "dark" ? "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800"
        }`}
        title="Compartir en X"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      <button 
        onClick={handleCopyLink}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-none cursor-pointer ${
          prefs.theme === "dark" ? "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#1890FF]"
        }`}
        title="Copiar enlace"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );

  const posterUrl = useMemo(() => {
    if (!article.content) return "";
    const match = article.content.match(/^(?:#\s*)?(?:poster|thumbnail|thumbnail_url|cover_poster|imagen_compartido|imagen|image)\s*:\s*(https?:\/\/[^\s\n]+)/im);
    return match ? match[1].trim() : "";
  }, [article.content]);

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${themeCls}`}>
      {/* Dynamic theme style overrides for blockquote, paragraphs, and markdown tags */}
      <style dangerouslySetInnerHTML={{ __html: `
        .theme-dark h1, .theme-dark h2, .theme-dark h3, .theme-dark h4 { color: #ffffff !important; }
        .theme-dark p, .theme-dark td, .theme-dark li { color: #cbd5e1 !important; }
        .theme-dark blockquote { background-color: #1e293b !important; color: #cbd5e1 !important; border-left-color: #1890FF !important; }
        .theme-dark hr { border-color: #334155 !important; }
        .theme-dark table th { background-color: #1e293b !important; color: #f8fafc !important; }
        .theme-dark table td { border-color: #334155 !important; }
        .theme-dark table tr:hover { background-color: rgba(30, 41, 59, 0.3) !important; }
        .theme-dark pre code { color: #e2e8f0 !important; }
        
        .theme-sepia h1, .theme-sepia h2, .theme-sepia h3, .theme-sepia h4 { color: #3e2713 !important; }
        .theme-sepia p, .theme-sepia td, .theme-sepia li { color: #5b4636 !important; }
        .theme-sepia blockquote { background-color: #ebdcb9 !important; color: #5b4636 !important; border-left-color: #8c6d53 !important; }
        .theme-sepia hr { border-color: #e2d7be !important; }
        .theme-sepia table th { background-color: #ebdcb9 !important; color: #3e2713 !important; }
        .theme-sepia table td { border-color: #e2d7be !important; }
        .theme-sepia table tr:hover { background-color: rgba(235, 220, 185, 0.3) !important; }
        .theme-sepia pre code { color: #5b4636 !important; }
      `}} />

      {/* Thin reading progress bar */}
      <div 
        className={`fixed top-0 left-0 h-[3px] z-50 transition-all duration-100 ${
          prefs.theme === "dark" ? "bg-white" : "bg-slate-950"
        }`}
        style={{ width: `${readingProgress}%` }}
      />

      {/* ── ARTICLE HEADER ── */}
      <header className="max-w-[1140px] mx-auto px-6 pt-10 sm:pt-12 pb-6">
        {/* Navigation row flanking the title on desktop, above the title on mobile */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Volver - left side on desktop, top-left on mobile */}
          <div className="w-full lg:w-auto lg:absolute lg:left-0 lg:top-2 flex justify-between lg:justify-start text-[10px] font-bold uppercase tracking-widest">
            <Link 
              href="/blog" 
              className={`flex items-center gap-1.5 no-underline transition-colors group ${
                prefs.theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-550 hover:text-black"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Volver</span>
            </Link>

            {/* Breadcrumb on mobile right-aligned in same top row */}
            <div className="lg:hidden">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
                <Link href="/" className={`no-underline transition-colors ${prefs.theme === "dark" ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-black"}`}>Inicio</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/blog" className={`no-underline transition-colors ${prefs.theme === "dark" ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-black"}`}>Blog</Link>
              </nav>
            </div>
          </div>

          {/* Central Title, Excerpt and Metadata */}
          <div className="max-w-[900px] mx-auto text-center px-0 lg:px-24">
            <h1 className={`font-serif font-bold text-3xl sm:text-5xl lg:text-6xl leading-tight tracking-tight mb-6 ${
              prefs.theme === "dark" ? "text-white" : "text-slate-950"
            }`}>
              {article.title}
            </h1>
            <div className={`flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest pb-4 max-w-lg mx-auto ${
              prefs.theme === "dark" ? "text-slate-500" : "text-slate-455"
            }`}>
              <span>por {article.author_name || "Manuel Oliva"}</span>
              <span>•</span>
              <span>{formatDate(article.published_at || article.created_at)}</span>
              <span>•</span>
              <span>{article.reading_time_min} min</span>
            </div>
          </div>

          {/* Breadcrumbs - right side on desktop, hidden on mobile */}
          <div className="hidden lg:flex lg:absolute lg:right-0 lg:top-2 text-[10px] font-bold uppercase tracking-widest">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
              <Link href="/" className={`no-underline transition-colors ${prefs.theme === "dark" ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-black"}`}>Inicio</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/blog" className={`no-underline transition-colors ${prefs.theme === "dark" ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-black"}`}>Blog</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Cover Image and Share Buttons Sidebar */}
      {article.cover_image && (
        <div className="max-w-[1140px] mx-auto px-6 lg:px-12 xl:px-16 mb-16">
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Image/Video (Main part) */}
            <div className="flex-1 relative aspect-[21/9] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 w-full">
              {isVideoUrl(article.cover_image) ? (
                <video
                  src={article.cover_image}
                  poster={posterUrl || undefined}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              )}
            </div>
            
            {/* Share Buttons stacked vertically to the right of the image */}
            <div className={`flex md:flex-col items-center justify-center gap-4 py-4 px-3 rounded-2xl border ${
              prefs.theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <span className={`text-[9px] font-bold uppercase tracking-widest md:-rotate-90 md:my-4 whitespace-nowrap ${
                prefs.theme === "dark" ? "text-slate-500" : "text-slate-400"
              }`}>
                Compartir
              </span>
              
              {/* LinkedIn button */}
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  prefs.theme === "dark" ? "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white" : "bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 shadow-sm"
                }`}
                title="Compartir en LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* X button */}
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  prefs.theme === "dark" ? "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white" : "bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 shadow-sm"
                }`}
                title="Compartir en X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Copy link button */}
              <button 
                onClick={handleCopyLink}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border-none cursor-pointer ${
                  prefs.theme === "dark" ? "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white" : "bg-white hover:bg-slate-100 text-slate-500 hover:text-[#1890FF] shadow-sm"
                }`}
                title="Copiar enlace"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Visual preview button */}
              <button 
                type="button"
                onClick={() => setShowPreview(true)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border-none cursor-pointer ${
                  prefs.theme === "dark" ? "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white" : "bg-white hover:bg-slate-100 text-slate-500 hover:text-[#1890FF] shadow-sm"
                }`}
                title="Vista previa de compartido"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BODY LAYOUTS ── */}
      <div className="max-w-[1140px] mx-auto px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Main Article Content & Tutorial Layout */}
          <main ref={articleRef} className={`${template === "tutorial" ? "lg:col-span-9" : "lg:col-span-12"} flex flex-col`}>
            
            {/* Table of Contents for Mobile Tutorial layout */}
            {template === "tutorial" && headings.length > 0 && (
              <div className={`border rounded-xl p-6 mb-8 lg:hidden ${
                prefs.theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"
              }`}>
                <h3 className={`font-sans font-bold text-xs uppercase tracking-widest mb-4 ${
                  prefs.theme === "dark" ? "text-slate-400" : "text-slate-400"
                }`}>
                  Contenido de esta guía
                </h3>
                <nav>
                  <ul className="space-y-3 pl-0 list-none my-0">
                    {headings.map((h, i) => (
                      <li key={i} className="pl-0">
                        <a 
                          href={`#${h.id}`}
                          className={`text-xs no-underline font-semibold leading-snug block transition-colors ${
                            prefs.theme === "dark" ? "text-slate-300 hover:text-[#1890FF]" : "text-slate-600 hover:text-[#1890FF]"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* Renderer wrapper with dynamic preferences styling */}
            <div className={`prose-wrapper ${
              prefs.fontFamily === "serif" ? "font-serif" : prefs.fontFamily === "mono" ? "font-mono" : "font-sans"
            } ${
              prefs.fontSize === "sm" ? "[&_p]:text-sm [&_li]:text-sm [&_td]:text-sm [&_h2]:text-xl [&_h3]:text-lg" :
              prefs.fontSize === "lg" ? "[&_p]:text-lg [&_li]:text-lg [&_td]:text-lg [&_p]:sm:text-[20px] [&_li]:sm:text-[20px] [&_h2]:text-3xl [&_h2]:sm:text-4xl [&_h3]:text-2xl [&_h3]:sm:text-3xl" :
              prefs.fontSize === "xl" ? "[&_p]:text-xl [&_li]:text-xl [&_td]:text-xl [&_p]:sm:text-[22px] [&_li]:sm:text-[22px] [&_h2]:text-4xl [&_h2]:sm:text-5xl [&_h3]:text-3xl [&_h3]:sm:text-4xl" :
              "[&_p]:text-base [&_li]:text-base [&_td]:text-base [&_p]:sm:text-[18px] [&_li]:sm:text-[18px] [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h3]:text-xl [&_h3]:sm:text-2xl"
            } ${
              prefs.lineHeight === "normal" ? "[&_p]:leading-normal [&_li]:leading-normal" :
              prefs.lineHeight === "loose" ? "[&_p]:leading-loose [&_li]:leading-loose" :
              "[&_p]:leading-relaxed [&_li]:leading-relaxed [&_p]:leading-[1.85]"
            } ${
              prefs.theme === "dark" ? "text-slate-350" : prefs.theme === "sepia" ? "text-[#5b4636]" : "text-slate-800"
            }`}>
              <ArticleBlockRenderer content={article.content} />
            </div>

            {/* Horizontal Share Buttons at the end of content */}
            <div className={`mt-12 py-4 border-t flex items-center justify-between flex-wrap gap-4 ${
              prefs.theme === "dark" ? "border-slate-800" : "border-slate-100"
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                prefs.theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}>¿Te gustó este artículo?</span>
              <ShareRow />
            </div>

            {/* Author info box (E-E-A-T builder) */}
            <div className={`border-y py-10 mt-16 flex flex-col sm:flex-row gap-6 items-start ${
              prefs.theme === "dark" ? "border-slate-800" : "border-slate-100"
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-serif font-bold flex-shrink-0 ${
                prefs.theme === "dark" ? "bg-white text-slate-950" : "bg-slate-900 text-white"
              }`}>
                {article.author_name ? article.author_name[0] : "P"}
              </div>
              <div className="flex-1">
                <h4 className={`font-serif font-bold text-lg mb-2 flex items-center gap-2 ${
                  prefs.theme === "dark" ? "text-white" : "text-slate-950"
                }`}>
                  Escrito por {article.author_name || "Manuel Oliva"}
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                    prefs.theme === "dark" ? "bg-slate-900 text-slate-400" : "bg-slate-100 text-slate-655"
                  }`}>
                    {isManuel ? "CEO & Fundador" : "Docente"}
                  </span>
                </h4>
                <p className={`text-sm leading-relaxed my-0 font-light ${
                  prefs.theme === "dark" ? "text-slate-400" : "text-slate-650"
                }`}>
                  {authorBio}
                </p>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar (TUTORIAL LAYOUT ONLY) */}
          {template === "tutorial" && headings.length > 0 && (
            <aside className={`lg:col-span-3 hidden lg:block order-3 lg:sticky lg:top-32 border-l pl-6 ${
              prefs.theme === "dark" ? "border-slate-800" : "border-slate-100"
            }`}>
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
                            className={`text-xs no-underline font-medium leading-relaxed block transition-all hover:translate-x-0.5 ${
                              prefs.theme === "dark" ? "text-slate-400 hover:text-[#1890FF]" : "text-slate-505 hover:text-[#1890FF]"
                            }`}
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
        <div className={`border-4 p-8 sm:p-12 text-center relative transition-colors ${
          prefs.theme === "dark" ? "border-white bg-slate-900 text-white" : "border-slate-950 bg-white text-slate-950"
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1890FF] mb-3 inline-block">
            PROGRAMBI CAPACITACIONES
          </span>
          <h3 className={`font-serif font-bold text-2xl sm:text-3xl leading-tight mb-4 tracking-tight ${
            prefs.theme === "dark" ? "text-white" : "text-slate-950"
          }`}>
            Domina SQL, Power BI y Python con expertos activos
          </h3>
          <p className={`text-sm sm:text-base leading-relaxed mb-8 font-light max-w-xl mx-auto ${
            prefs.theme === "dark" ? "text-slate-350" : "text-slate-650"
          }`}>
            Capacítate 100% en vivo desde Chile y Latinoamérica con clases grabadas de por vida, soporte continuo y proyectos reales de la industria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cursos" 
              className={`px-7 py-3 font-bold text-xs tracking-widest uppercase no-underline transition-all ${
                prefs.theme === "dark" ? "bg-white text-slate-950 hover:bg-slate-100" : "bg-slate-950 text-white hover:bg-slate-800"
              }`}
            >
              EXPLORAR CURSOS
            </Link>
            <Link 
              href="/asesorias" 
              className={`px-7 py-3 border font-bold text-xs tracking-widest uppercase no-underline transition-all ${
                prefs.theme === "dark" ? "border-white text-white hover:bg-slate-800" : "border-slate-950 text-slate-950 hover:bg-slate-50"
              }`}
            >
              ASESORÍAS CORPORATIVAS
            </Link>
          </div>
        </div>
      </section>

      {/* ── RELATED ARTICLES ── */}
      {related.length > 0 && (
        <section className={`max-w-[1140px] mx-auto px-6 mt-28 pt-20 border-t ${
          prefs.theme === "dark" ? "border-slate-800" : "border-slate-100"
        }`}>
          <h3 className={`font-serif font-bold text-2xl mb-8 tracking-tight text-center ${
            prefs.theme === "dark" ? "text-white" : "text-slate-950"
          }`}>
            Artículos Relacionados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((art: any) => {
              return (
                <Link key={art.id} href={`/blog/${art.slug}`} className="block no-underline group">
                  <article className={`flex flex-col h-full transition-colors ${
                    prefs.theme === "dark" ? "bg-slate-900 border border-slate-800 text-white rounded-xl overflow-hidden p-4" : "bg-white text-slate-950"
                  }`}>
                    {/* Image */}
                    <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl ${
                      prefs.theme === "dark" ? "bg-slate-950" : "bg-slate-50 border border-slate-100"
                    }`}>
                      {art.cover_image ? (
                        <Image
                          src={art.cover_image}
                          alt={art.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-slate-200" />
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="py-4 flex flex-col flex-1">
                      <span className="text-[9px] font-bold tracking-widest text-[#1890FF] uppercase mb-1.5">
                        {categoryLabels[art.category] || art.category}
                      </span>
                      <h4 className={`font-serif font-bold text-base leading-snug group-hover:underline decoration-[#1890FF] decoration-2 underline-offset-4 mb-2 ${
                        prefs.theme === "dark" ? "text-slate-100" : "text-slate-950"
                      }`}>
                        {art.title}
                      </h4>
                      <time className={`text-[10px] font-bold mt-auto block uppercase tracking-widest ${
                        prefs.theme === "dark" ? "text-slate-500" : "text-slate-400"
                      }`}>
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

      {/* Floating Preferences Button (Desktop only, hidden on mobile bottom-nav) */}
      <button
        onClick={() => setShowPrefs(true)}
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-200 hidden md:flex ${
          prefs.theme === "dark" ? "bg-white text-slate-950 hover:bg-slate-100" : "bg-slate-950 text-white hover:bg-slate-800"
        }`}
        title="Preferencias de lectura"
      >
        <Sliders className="w-5 h-5" />
      </button>

      {/* Preferences Modal Panel */}
      <BlogPreferences
        isOpen={showPrefs}
        onClose={() => setShowPrefs(false)}
        prefs={prefs}
        onChange={setPrefs}
      />

      {/* Visual Share Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[10002]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[10003] w-[calc(100%-2rem)] max-w-lg overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5 text-slate-950">
                <span className="font-serif font-bold text-sm uppercase tracking-wider">
                  Vista Previa del Enlace
                </span>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-450 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer border-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-4 font-medium font-sans">
                Así es como verán tus contactos esta noticia cuando compartas el enlace en WhatsApp, LinkedIn, X o Slack:
              </p>

              {/* Social Card Mockup */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shadow-sm select-none">
                {article.cover_image && (
                  <div className="relative aspect-[1.91/1] w-full bg-slate-100">
                    {isVideoUrl(article.cover_image) ? (
                      <video
                        src={article.cover_image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={article.cover_image} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>
                )}
                <div className="p-4 bg-white border-t border-slate-100 text-left">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mb-1 font-sans">
                    programbi.com
                  </span>
                  <h4 className="font-serif font-bold text-slate-950 text-base leading-snug mb-1.5">
                    {article.title}
                  </h4>
                  {article.excerpt && (
                    <p className="text-xs text-slate-450 leading-relaxed line-clamp-2 my-0 font-sans">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons inside preview */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-all border-none cursor-pointer text-center"
                >
                  {copied ? "¡Enlace Copiado!" : "Copiar Enlace"}
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs tracking-widest uppercase rounded-xl transition-all bg-white cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
