"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  Cpu, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar, 
  User, 
  Tag
} from "lucide-react";
import { isVideoUrl } from "@/lib/utils";

// Helper parsers for article content
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Category design systems mapping
const CATEGORY_THEMES: Record<string, {
  label: string;
  glow: string;
  badgeBg: string;
  badgeText: string;
  activeDot: string;
  btnBg: string;
  icon: any;
}> = {
  ia: {
    label: "Inteligencia Artificial",
    glow: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.05) 50%, transparent 100%)",
    badgeBg: "bg-blue-500/10 border-blue-500/20",
    badgeText: "text-blue-400",
    activeDot: "bg-blue-500",
    btnBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
    icon: Sparkles
  },
  economia: {
    label: "Economía",
    glow: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(20,184,166,0.05) 50%, transparent 100%)",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20",
    badgeText: "text-emerald-400",
    activeDot: "bg-emerald-500",
    btnBg: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
    icon: DollarSign
  },
  tecnologia: {
    label: "Tecnología",
    glow: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(249,115,22,0.05) 50%, transparent 100%)",
    badgeBg: "bg-amber-500/10 border-amber-500/20",
    badgeText: "text-amber-400",
    activeDot: "bg-amber-500",
    btnBg: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20",
    icon: Cpu
  },
  cultura: {
    label: "Cultura",
    glow: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.05) 50%, transparent 100%)",
    badgeBg: "bg-purple-500/10 border-purple-500/20",
    badgeText: "text-purple-400",
    activeDot: "bg-purple-500",
    btnBg: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20",
    icon: BookOpen
  }
};

const DEFAULT_THEME = {
  label: "Novedades",
  glow: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.05) 50%, transparent 100%)",
  badgeBg: "bg-purple-500/10 border-purple-500/20",
  badgeText: "text-purple-400",
  activeDot: "bg-purple-500",
  btnBg: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20",
  icon: BookOpen
};

interface BlogPromoSectionProps {
  articles: any[];
}

export default function BlogPromoSection({ articles }: BlogPromoSectionProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slide cycle every 6.5 seconds unless paused
  useEffect(() => {
    if (articles.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % articles.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [index, isPaused, articles.length]);

  if (!articles || articles.length === 0) return null;

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
      x: dir > 0 ? "15%" : "-15%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "15%" : "-15%",
      opacity: 0,
    }),
  };

  const current = articles[index];
  
  // Resolve theme configuration
  const theme = CATEGORY_THEMES[current.category] || DEFAULT_THEME;
  const CategoryIcon = theme.icon;

  const videoUrl = getVideoFromContent(current.content) || (isVideoUrl(current.cover_image) ? current.cover_image : undefined);
  const posterUrl = isVideoUrl(current.cover_image) ? getPosterFromContent(current.content) : current.cover_image;

  return (
    <section className="pt-8 pb-12 lg:pt-12 lg:pb-16 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 relative z-10">
        
        {/* Main Slider Container Card */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full rounded-[2.5rem] border border-slate-800 bg-slate-950/95 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.4)] p-6 sm:p-10 md:p-12 lg:p-16 select-none"
        >
          {/* Dynamic Ambient Glow Backdrops */}
          <motion.div 
            animate={{ background: theme.glow }} 
            transition={{ duration: 1 }}
            className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-40 pointer-events-none z-0" 
          />
          <motion.div 
            animate={{ background: theme.glow }} 
            transition={{ duration: 1 }}
            className="absolute -left-20 -bottom-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-25 pointer-events-none z-0" 
          />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none z-0" />

          {/* Slider Content Wrapper */}
          <div className="relative z-10 w-full min-h-[480px] flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 260, damping: 28 },
                  opacity: { duration: 0.25 },
                }}
                className="w-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                  
                  {/* Left Column - Article Details */}
                  <div className="lg:col-span-7 text-left flex flex-col">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold tracking-wide uppercase mb-6 shadow-sm w-fit transition-colors duration-1000 ${theme.badgeBg} ${theme.badgeText}`}>
                      <CategoryIcon className="w-3.5 h-3.5" />
                      {theme.label}
                    </span>

                    <Link href={`/blog/${current.slug}`} className="no-underline group/title">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight font-sans group-hover/title:underline decoration-white/30 decoration-2 underline-offset-4">
                        {current.title}
                      </h2>
                    </Link>

                    {current.excerpt && (
                      <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed mb-8 max-w-xl font-sans font-medium line-clamp-3">
                        {current.excerpt}
                      </p>
                    )}

                    {/* Metadata Grid */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      {/* Reading Time */}
                      <div className="flex items-center gap-3 bg-slate-900/30 border border-slate-800/40 rounded-xl p-3.5 shadow-sm hover:border-slate-700/80 transition-all hover:bg-slate-900/60 group/meta">
                        <div className="p-1.5 rounded-lg bg-slate-800/80 shrink-0 transition-transform duration-300 group-hover/meta:scale-110">
                          <Clock className={`w-4 h-4 ${theme.badgeText}`} />
                        </div>
                        <span className="text-slate-200 font-bold text-xs sm:text-sm font-sans">
                          {current.reading_time_min || 5} min de lectura
                        </span>
                      </div>

                      {/* Publish Date */}
                      <div className="flex items-center gap-3 bg-slate-900/30 border border-slate-800/40 rounded-xl p-3.5 shadow-sm hover:border-slate-700/80 transition-all hover:bg-slate-900/60 group/meta">
                        <div className="p-1.5 rounded-lg bg-slate-800/80 shrink-0 transition-transform duration-300 group-hover/meta:scale-110">
                          <Calendar className={`w-4 h-4 ${theme.badgeText}`} />
                        </div>
                        <span className="text-slate-200 font-bold text-xs sm:text-sm font-sans">
                          {formatDate(current.published_at || current.created_at)}
                        </span>
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-3 bg-slate-900/30 border border-slate-800/40 rounded-xl p-3.5 shadow-sm hover:border-slate-700/80 transition-all hover:bg-slate-900/60 group/meta">
                        <div className="p-1.5 rounded-lg bg-slate-800/80 shrink-0 transition-transform duration-300 group-hover/meta:scale-110">
                          <User className={`w-4 h-4 ${theme.badgeText}`} />
                        </div>
                        <span className="text-slate-200 font-bold text-xs sm:text-sm font-sans">
                          Por {current.author_name || "ProgramBI"}
                        </span>
                      </div>

                      {/* Category Topic */}
                      <div className="flex items-center gap-3 bg-slate-900/30 border border-slate-800/40 rounded-xl p-3.5 shadow-sm hover:border-slate-700/80 transition-all hover:bg-slate-900/60 group/meta">
                        <div className="p-1.5 rounded-lg bg-slate-800/80 shrink-0 transition-transform duration-300 group-hover/meta:scale-110">
                          <Tag className={`w-4 h-4 ${theme.badgeText}`} />
                        </div>
                        <span className="text-slate-200 font-bold text-xs sm:text-sm font-sans">
                          Tema: {current.category === "ia" ? "Inteligencia Artificial" : current.category.charAt(0).toUpperCase() + current.category.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/blog/${current.slug}`}
                        className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-[14px] sm:text-[15px] transition-all shadow-lg hover:-translate-y-0.5 no-underline font-sans cursor-pointer ${theme.btnBg}`}
                      >
                        <span>Leer Artículo Completo</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column - Premium Browser Preview Mockup */}
                  <div className="lg:col-span-5 relative flex items-center justify-center w-full">
                    <Link href={`/blog/${current.slug}`} className="w-full block relative cursor-pointer group/mockup">
                      <div className="relative w-full aspect-[16/10] bg-slate-950 border border-slate-800 rounded-[1.8rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover/mockup:scale-[1.01] group-hover/mockup:border-slate-700">
                        
                        {/* Browser Header Bar */}
                        <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-900/80 border-b border-slate-800/80">
                          <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                          <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                          <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                          <div className="ml-4 px-3 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-[9px] font-mono text-slate-500 tracking-wide select-none">
                            programbi.com/blog/{current.slug.slice(0, 15)}...
                          </div>
                        </div>
                        
                        {/* Media Container */}
                        <div className="absolute inset-x-0 bottom-0 top-[37px] bg-slate-950 flex items-center justify-center overflow-hidden">
                          {/* Grid layout */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-10" />
                          
                          {/* Loading Placeholder */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0B0F19] flex flex-col items-center justify-center pointer-events-none opacity-100 z-0">
                            <div className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 mb-3 animate-pulse">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] text-slate-550 font-mono tracking-widest uppercase">Cargando...</span>
                          </div>

                          {videoUrl ? (
                            <video
                              src={videoUrl}
                              poster={posterUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="auto"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/mockup:scale-105 pointer-events-none z-20 relative"
                            />
                          ) : posterUrl ? (
                            <div className="relative w-full h-full z-20">
                              <Image
                                src={posterUrl}
                                alt={current.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover/mockup:scale-105"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center z-20">
                              <BookOpen className="w-10 h-10 text-slate-700" />
                            </div>
                          )}
                          
                          {/* Subtle shade */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent h-12 pointer-events-none z-30" />
                        </div>
                      </div>
                    </Link>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating Navigation Arrows (Desktop only) */}
          {articles.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-white items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-white items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Navigation Dots and Indicators */}
        {articles.length > 1 && (
          <div className="flex justify-center gap-2.5 mt-8 select-none">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer p-0 border-none ${
                  i === index 
                    ? `w-8 ${theme.activeDot}` 
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
                title={`Noticia ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
