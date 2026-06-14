"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Check, 
  Database, 
  PieChart, 
  Code, 
  FileSpreadsheet, 
  TrendingUp, 
  Brain, 
  HardHat, 
  Zap,
  Lock,
  Users
} from "lucide-react";
import React from "react";
import { courses, type Course } from "@/lib/data/courses";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { createClient } from "@/lib/supabase/client";

const categories = [
  { id: "destacados", label: "Programas Destacados", desc: "Nuestros bootcamps de élite más populares" },
  { id: "datos", label: "SQL & Business Intelligence", desc: "Modelado, bases de datos y dashboards interactivos" },
  { id: "python", label: "Python & Data Science", desc: "Programación, machine learning y analítica avanzada" },
  { id: "auto", label: "Automatización & RPA", desc: "Eficiencia con IA, agentes y optimización de tareas" }
] as const;

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3: Database,
  Zap: Zap,
  HardHat: HardHat,
  Sparkles: Sparkles,
  PieChart: PieChart,
  Code: Code,
  Database: Database,
  FileSpreadsheet: FileSpreadsheet,
  TrendingUp: TrendingUp,
  Brain: Brain,
};

const getPriceInfo = (course: Course, promotions: any[]) => {
  let price: number | null = null;
  let originalPrice: number | null = null;

  if (course.levels && course.levels.length > 0) {
    const validLevels = course.levels.filter(l => typeof l.price === 'number');
    if (validLevels.length > 0) {
      const sortedByPrice = [...validLevels].sort((a, b) => (a.price || 0) - (b.price || 0));
      price = sortedByPrice[0].price || null;
      originalPrice = sortedByPrice[0].originalPrice || null;
    }
  }

  if (price === null) {
    price = course.originalPrice || null;
  }

  // Find promotion applicable to this course
  const promo = promotions.find(p => 
    p.target_type === 'all' || 
    p.target_type === 'courses' || 
    (p.target_type === 'specific_course' && p.target_id === course.slug)
  );

  if (promo && price) {
    const basePrice = price;
    if (promo.promo_price) {
      price = promo.promo_price;
    } else if (promo.discount_percentage) {
      price = Math.round(basePrice * (100 - promo.discount_percentage) / 100);
    }
    // Set base price as the original price to display the discount correctly
    if (!originalPrice || basePrice > originalPrice) {
      originalPrice = basePrice;
    }
  }
  
  if (originalPrice === null && course.originalPrice && price && course.originalPrice > price) {
    originalPrice = course.originalPrice;
  }

  if (originalPrice !== null && price !== null && originalPrice <= price) {
    originalPrice = null;
  }

  return { price, originalPrice };
};

export default function CoursesSection() {
  const [selectedCat, setSelectedCat] = useState<"destacados" | "datos" | "python" | "auto">("destacados");
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/promotions")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPromotions(data);
        }
      })
      .catch((err) => console.error("Error loading promotions in CoursesSection:", err));
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Filter logic
  const getFilteredCourses = () => {
    switch (selectedCat) {
      case "destacados":
        return courses.filter(c => c.isFeatured);
      case "datos":
        return courses.filter(c => ["analisis-de-datos", "power-bi", "sql-server", "excel"].includes(c.slug));
      case "python":
        return courses.filter(c => ["python", "machine-learning", "analitica-mineria", "analitica-financiera"].includes(c.slug));
      case "auto":
        return courses.filter(c => ["power-automate", "ia-productividad"].includes(c.slug));
      default:
        return courses.filter(c => c.isFeatured);
    }
  };

  const getCatCount = (catId: string) => {
    switch (catId) {
      case "destacados":
        return courses.filter(c => c.isFeatured).length;
      case "datos":
        return courses.filter(c => ["analisis-de-datos", "power-bi", "sql-server", "excel"].includes(c.slug)).length;
      case "python":
        return courses.filter(c => ["python", "machine-learning", "analitica-mineria", "analitica-financiera"].includes(c.slug)).length;
      case "auto":
        return courses.filter(c => ["power-automate", "ia-productividad"].includes(c.slug)).length;
      default:
        return 0;
    }
  };

  const filteredCourses = getFilteredCourses();

  return (
    <section className="w-full bg-white text-slate-900 pt-8 pb-16 lg:pt-10 lg:pb-20 relative overflow-hidden flex justify-center items-center">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Glow backdrop points (light/soft accent) */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1890FF]/3 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#6366F1]/2 rounded-full blur-[160px] pointer-events-none" />

      {/* CSS adjustment to hide horizontal scrollbar in categories pill row on mobile */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Centering wrapper */}
      <div className="w-full px-5 md:px-10 max-w-[1400px] mx-auto relative z-10">
        
        {/* Centered Header */}
        <FadeIn>
          <div className="text-center mb-8 flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 bg-blue-50/70 border border-blue-100/40 backdrop-blur-sm text-[#1890FF] font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-full mb-3 shadow-sm">
              <Sparkles size={11} className="fill-current text-[#1890FF]" /> Bootcamps de Datos
            </span>
            
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-slate-900 to-[#1890FF] leading-tight mb-3 tracking-tight">
              Explora nuestros programas.
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mb-4 font-sans">
              Clases en vivo por Zoom, aprendizaje práctico con proyectos reales y apoyo técnico de mentores expertos 24/7.
            </p>
            
            {/* Stats Centered */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-[10px] text-slate-400 font-bold mb-5 select-none">
              <span>+5,000 egresados</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span>10 programas</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span>98% satisfacción</span>
            </div>
          </div>
        </FadeIn>

        {/* Centered Category selector pills bar */}
        <FadeIn delay={0.1}>
          <div className="flex justify-center mb-4 w-full select-none">
            <div className="flex overflow-x-auto no-scrollbar bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/40 gap-1.5 max-w-4xl justify-start md:justify-center w-full md:w-auto -mx-5 px-5 md:px-1.5">
              {categories.map((cat) => {
                const isActive = selectedCat === cat.id;
                const count = getCatCount(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`relative px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 outline-none border-none cursor-pointer whitespace-nowrap text-xs font-bold ${
                      isActive
                        ? "text-[#1890FF]"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryBgCent"
                        className="absolute inset-0 bg-white rounded-xl -z-10 shadow-[0_4px_12px_rgba(24,144,255,0.06)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                    <span className={`relative z-10 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isActive ? "bg-blue-50 text-[#1890FF]" : "bg-slate-200/50 text-slate-400"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 font-semibold mb-8 select-none">
            {categories.find(c => c.id === selectedCat)?.desc}
          </p>
        </FadeIn>

        {/* Full-width Grid of Compact Cards (4 Columns on Desktop) */}
        <div className="w-full z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCat}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {filteredCourses.map((course) => {
                const CardIcon = IconMap[course.icon] || Sparkles;
                const { price, originalPrice } = getPriceInfo(course, promotions);
                const discountPercent = price && originalPrice && originalPrice > price 
                  ? Math.round(((originalPrice - price) / originalPrice) * 100) 
                  : null;

                return (
                  <div key={course.slug} className="w-full">
                    <motion.div 
                      layout
                      className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-500/15 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.012)] hover:shadow-[0_24px_50px_rgba(24,144,255,0.06)] transition-all duration-500 h-full p-4 relative"
                    >
                      {/* Subtle radial glow matching the course accent color */}
                      <div 
                        className="absolute -right-24 -top-24 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none" 
                        style={{ backgroundColor: course.accentColor || '#1890FF' }}
                      />

                      {/* Floating course symbol icon */}
                      <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#1890FF] group-hover:border-[#1890FF]/30 transition-all shadow-sm">
                        <CardIcon className="w-3.5 h-3.5" />
                      </div>
                      
                      <div>
                        {/* Image container: aspect-[1.5/1] (larger vertical dimension) */}
                        <div className="relative overflow-hidden aspect-[1.5/1] rounded-xl mb-4 bg-slate-50">
                          <div className="absolute inset-0 bg-[#0F172A]/4 z-10 group-hover:bg-[#0F172A]/0 transition-colors duration-500" />
                          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
                            <div
                              className="px-2.5 py-0.5 rounded text-white text-[8px] uppercase tracking-wider font-extrabold flex items-center gap-1 backdrop-blur-md shadow-sm border border-white/10"
                              style={{ background: `${course.badgeColor || course.accentColor}dd` }}
                            >
                              <Sparkles size={8} /> {course.badgeLabel || course.categoryLabel}
                            </div>
                            {course.isFeatured && (
                              <div className="bg-amber-500/95 backdrop-blur-md text-white text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 shadow-sm flex items-center gap-1 select-none">
                                <span>🔥 Más Popular</span>
                              </div>
                            )}
                          </div>
                          <Image
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            unoptimized
                          />
                        </div>

                        {/* Tech Stack + Meta Row */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          {/* Tech stack badges */}
                          <div className="flex gap-1.5 flex-wrap">
                            {course.techStack.map((tech) => (
                              <span key={tech} className="bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded text-[8px] font-mono border border-slate-100">
                                {tech}
                              </span>
                            ))}
                          </div>
                          {/* Duration */}
                          <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-slate-400 shrink-0">
                            <Clock size={10} /> {course.durationHours} hrs
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/cursos/${course.slug}`} className="block no-underline">
                          <h3 className="font-sans text-[15px] font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-[#1890FF] transition-colors text-left line-clamp-1">
                            {course.title}
                          </h3>
                        </Link>
                        {/* Description */}
                        <p className="text-slate-500 text-xs leading-relaxed mb-4 text-left line-clamp-2">
                          {course.shortDescription}
                        </p>
                      </div>

                      {/* Card Footer: Combines Price & CTA */}
                      <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                        {/* Price Info */}
                        <div className="flex flex-col text-left font-sans">
                          {isLoggedIn ? (
                            price ? (
                              <>
                                <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider leading-none">Inversión</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                  {originalPrice && (
                                    <span className="text-[9px] line-through text-slate-400 font-medium">
                                      {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(originalPrice)}
                                    </span>
                                  )}
                                  <span className="text-xs font-black text-slate-900 leading-none">
                                    {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price)}
                                  </span>
                                </div>
                                {discountPercent && (
                                  <span className="mt-1 text-[8px] font-extrabold px-1 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-100 w-fit leading-none">
                                    -{discountPercent}% DCTO
                                  </span>
                                )}
                              </>
                            ) : null
                          ) : (
                            <div className="flex items-center gap-1 text-[9px] font-extrabold text-blue-500 select-none">
                              <Lock size={10} /> <span>Ver Precios</span>
                            </div>
                          )}
                        </div>

                        {/* Right side: Egresados & CTA Button */}
                        <div className="flex flex-col items-end gap-1.5">
                          {/* Egresados count */}
                          <span className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold select-none leading-none">
                            <Users className="w-2.5 h-2.5 text-slate-400" />
                            <span>+500 egresados</span>
                          </span>

                          <Link href={`/cursos/${course.slug}`} className="block no-underline">
                            <div className="inline-flex items-center gap-1 bg-slate-50 hover:bg-[#1890FF] hover:text-white border border-slate-150/70 hover:border-transparent rounded-lg px-2.5 py-1.5 transition-all duration-300 text-[10px] font-bold font-sans group/btn">
                              <span>Ver temario</span>
                              <ArrowRight size={10} className="transition-transform group-hover/btn:translate-x-0.5" />
                            </div>
                          </Link>
                        </div>
                      </div>

                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer of Section */}
        <FadeIn delay={0.2}>
          <div className="mt-12 flex justify-center w-full">
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 text-slate-700 font-bold text-[13px] px-8 py-3.5 rounded-xl hover:bg-[#1890FF] hover:text-white hover:border-[#1890FF] transition-all no-underline group shadow-sm hover:shadow-md hover:shadow-blue-500/10 cursor-pointer"
            >
              <span>Ver todos los cursos</span> 
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform text-slate-500 group-hover:text-white" />
            </Link>
          </div>
        </FadeIn>
        
      </div>
    </section>
  );
}
