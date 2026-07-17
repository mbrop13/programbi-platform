"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isVideoUrl } from "@/lib/utils";
import SectionHeader from "@/components/shared/SectionHeader";

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

interface BlogPromoSectionProps {
  articles: any[];
}

export default function BlogPromoSection({ articles }: BlogPromoSectionProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slide cycle every 5.5 seconds unless paused/hovered
  useEffect(() => {
    if (articles.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % articles.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [index, isPaused, articles.length]);

  // Reset index if articles length changes to avoid out of bounds
  useEffect(() => {
    setIndex(0);
  }, [articles.length]);

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
  const videoUrl = getVideoFromContent(current.content) || (isVideoUrl(current.cover_image) ? current.cover_image : undefined);
  const posterUrl = isVideoUrl(current.cover_image) ? getPosterFromContent(current.content) : current.cover_image;

  return (
    <section className="pt-6 pb-12 lg:pt-8 lg:pb-16 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 lg:px-6 relative z-10">
        
        {/* Unified Section Header */}
        <SectionHeader
          title={
            <span className="font-serif italic font-normal text-slate-900 tracking-tight">
              Últimas publicaciones de ProgramBI
            </span>
          }
          subtitle="Insights, análisis y tendencias en datos escritos por nuestros expertos."
          align="center"
          maxWidth="md"
          className="mb-6 lg:mb-8"
        />

        {/* Slideboard Container (Identical to Blog page BlogSlider) */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full select-none overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-slate-950"
        >
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
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      poster={posterUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                    />
                  ) : posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={current.title}
                      fill
                      className="object-cover opacity-60 transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-900" />
                  )}
                  {/* Overlay Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  {/* Centered Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center text-white z-10">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/25 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded-full mb-4">
                      {current.category === "ia" ? "Inteligencia Artificial" : current.category.charAt(0).toUpperCase() + current.category.slice(1)}
                    </span>
                    <h3 className="font-serif font-bold text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white max-w-5xl leading-[1.15] mb-8 tracking-tight drop-shadow-md">
                      {current.title}
                    </h3>
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
                      i === index ? "bg-[#1890FF] w-6" : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
