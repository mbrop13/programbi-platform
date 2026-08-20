"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { casesOfUse, CaseStudy } from "@/lib/data/cases";

// Render vector graphic overlays corresponding to the brand themes
const renderCardGraphic = (theme: string) => {
  switch (theme) {
    case "runway":
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          <svg className="w-20 h-20 text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 80 V20 H55 C68.7 20 80 31.3 80 45 C80 58.7 68.7 70 55 70 H30 M55 70 L75 80" />
          </svg>
        </div>
      );
    case "supabase":
      return (
        <div className="absolute inset-0 bg-[#0B0F19] flex items-center justify-center overflow-hidden border border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          <svg className="w-16 h-16 text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M55,10 L25,55 L48,55 L45,90 L75,45 L52,45 Z" />
          </svg>
        </div>
      );
    case "linear":
      return (
        <div className="absolute inset-0 bg-[#120B29] flex items-center justify-center border border-[#1e133e] overflow-hidden">
          <div className="absolute w-44 h-44 rounded-full bg-violet-600/10 blur-2xl" />
          <svg className="w-20 h-20 drop-shadow-[0_0_25px_rgba(139,92,246,0.35)]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="sphereGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#5b21b6" />
              </linearGradient>
            </defs>
            <mask id="sphereMask">
              <rect width="100" height="100" fill="white" />
              <line x1="20" y1="100" x2="100" y2="20" stroke="black" strokeWidth="5.5" />
              <line x1="10" y1="90" x2="90" y2="10" stroke="black" strokeWidth="5.5" />
              <line x1="0" y1="80" x2="80" y2="0" stroke="black" strokeWidth="5.5" />
            </mask>
            <circle cx="50" cy="50" r="32" fill="url(#sphereGrad)" mask="url(#sphereMask)" />
          </svg>
        </div>
      );
    case "elevenlabs":
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-fuchsia-300 to-rose-300 flex items-center justify-center">
          <svg className="w-18 h-18 text-white drop-shadow-[0_6px_12px_rgba(0,0,0,0.1)]" viewBox="0 0 100 100" fill="currentColor">
            <rect x="32" y="22" width="11" height="56" rx="4" />
            <rect x="57" y="22" width="11" height="56" rx="4" />
            <path d="M 32 50 A 25 25 0 0 1 68 50" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.25" />
          </svg>
        </div>
      );
    default:
      return null;
  }
};

// Sub-component for individual Case Cards — Glassmorphism premium
function CaseCard({ item }: { item: CaseStudy }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy-load video strictly when card enters viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !item.videoUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsInViewport(true);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.15, rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [item.videoUrl]);

  return (
    <Link
      ref={cardRef}
      href={`/casos/${item.slug}`}
      className="snap-start shrink-0 flex flex-col group w-[300px] hover:w-[360px] transition-all duration-500 ease-out no-underline"
    >
      {/* Visual Card Wrapper — Glass frame */}
      <div className="relative w-full aspect-[4/5] rounded-[1.75rem] overflow-hidden mb-5 border border-white/60 backdrop-blur-md bg-white/30 group-hover:border-white/90 group-hover:bg-white/50 transition-all duration-500 cursor-pointer"
        style={{ boxShadow: "0 12px 40px -12px rgba(15,23,42,0.15), inset 0 1px 0 0 rgba(255,255,255,0.9)" }}
      >
        {/* Glow halo on hover */}
        <div className="absolute -inset-px rounded-[1.75rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none -z-10"
          style={{ background: "linear-gradient(135deg, rgba(24,144,255,0.25), transparent 60%)" }}
        />

        {item.videoUrl && !videoFailed ? (
          <div className="absolute inset-0">
            {/* Placeholder while loading / not in viewport */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0B0F19] flex items-center justify-center pointer-events-none transition-opacity duration-700 z-[1] ${
                isVideoLoaded ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="opacity-40 scale-75">{renderCardGraphic(item.theme)}</div>
            </div>

            {isInViewport && (
              <video
                ref={videoRef}
                src={item.videoUrl}
                poster={item.posterUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onLoadedData={() => setIsVideoLoaded(true)}
                onCanPlay={() => setIsVideoLoaded(true)}
                onPlaying={() => setIsVideoLoaded(true)}
                onError={() => setVideoFailed(true)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out pointer-events-none z-0"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-slate-950/25 pointer-events-none z-[2]" />
          </div>
        ) : (
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]">
            {renderCardGraphic(item.theme)}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/20 pointer-events-none" />
          </div>
        )}

        {/* Technology overlay tag — glass pill */}
        <div className="absolute top-4 right-4 font-sans text-[9px] text-white font-bold bg-white/20 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/30 z-10 shadow-sm">
          {item.techBadge}
        </div>
      </div>

      {/* Text Block beneath visual card — Locked to 300px to prevent reflow */}
      <div className="text-left px-1 flex flex-col w-[300px] shrink-0 font-sans">
        <h3 className="font-display font-black text-gray-900 text-base md:text-lg leading-snug group-hover:text-[#1890FF] transition-colors line-clamp-3">
          {item.title}
        </h3>

        <p className="text-slate-500 text-xs md:text-sm leading-relaxed mt-2.5 line-clamp-3">
          {item.description}
        </p>

        <div className="mt-4 text-[#1890FF] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
          <span>{item.linkText}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function GallerySection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 304; // 280px (base width) + 24px (gap-6)
      // Slide two cards at a time
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount * 2 : scrollLeft + scrollAmount * 2;
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="pt-10 pb-16 lg:pt-12 lg:pb-24 bg-white relative overflow-hidden border-none">
      {/* CSS injection to hide scrollbars on all browsers while keeping horizontal scrolling functional */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        
        {/* Header + Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <FadeIn className="text-left max-w-2xl">
            <h2 className="font-serif italic font-normal text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.2]">
              Proyectos reales que dominarás
            </h2>
            <p className="mt-4 text-base lg:text-lg text-slate-500 leading-relaxed font-sans max-w-xl">
              Proyectos prácticos inspirados en desafíos corporativos reales que
              aprenderás a automatizar, modelar y predecir.
            </p>
          </FadeIn>

          {/* Navigation Arrows */}
          <FadeIn delay={0.15} className="flex gap-3 self-end md:self-auto shrink-0">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-gray-600 hover:bg-slate-100 hover:text-gray-900 hover:border-slate-350 transition-all flex items-center justify-center cursor-pointer shadow-sm hover:shadow"
              aria-label="Anterior"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-gray-600 hover:bg-slate-100 hover:text-gray-900 hover:border-slate-350 transition-all flex items-center justify-center cursor-pointer shadow-sm hover:shadow"
              aria-label="Siguiente"
            >
              <ArrowRight size={20} />
            </button>
          </FadeIn>
        </div>

        {/* Sliding Deck Layout */}
        <FadeIn delay={0.25} className="relative">
          {/* Right fade-out gradient (subtle, desktop only) */}
          <div className="absolute top-0 right-0 bottom-8 w-16 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none hidden md:block" />

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 scroll-smooth no-scrollbar snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:pl-0 md:pr-24"
          >
            {casesOfUse.map((item, idx) => (
              <CaseCard key={idx} item={item} />
            ))}
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
