"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Sparkles,
  Database,
  PieChart,
  Code,
  FileSpreadsheet,
  TrendingUp,
  Brain,
  HardHat,
  Zap,
  Lock,
} from "lucide-react";
import React from "react";
import { courses, type Course } from "@/lib/data/courses";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import SectionHeader from "@/components/shared/SectionHeader";
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
    <section className="w-full bg-white text-slate-900 py-16 lg:py-24 relative overflow-hidden flex justify-center items-center">
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
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Unified Header */}
        <SectionHeader
          eyebrow="Bootcamps de Datos"
          icon={Sparkles}
          title={<>Programas diseñados para tu <span className="text-[#1890FF]">crecimiento profesional</span></>}
          subtitle="Clases en vivo por Zoom, aprendizaje práctico con proyectos reales y apoyo técnico de mentores expertos 24/7."
          align="center"
          maxWidth="md"
          className="mb-10"
        />

        {/* Centered Category selector pills bar */}
        <FadeIn delay={0.1}>
          <div className="flex justify-center mb-4 w-full select-none">
            <div className="flex overflow-x-auto no-scrollbar bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/40 gap-1.5 max-w-4xl justify-start md:justify-center w-full md:w-auto -mx-5 px-5 md:px-1.5">
              {categories.map((cat) => {
                const isActive = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className="relative px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 outline-none border-none cursor-pointer whitespace-nowrap text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryBgCent"
                        className="absolute inset-0 bg-white rounded-xl -z-10 shadow-[0_4px_12px_rgba(24,144,255,0.06)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? "text-[#1890FF]" : "text-slate-500"}`}>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 font-semibold mb-8 select-none">
            {categories.find(c => c.id === selectedCat)?.desc}
          </p>
        </FadeIn>

        {/* Full-width Grid of Glass Cards (4 Columns on Desktop) */}
        <div className="w-full z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCat}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
            >
              {filteredCourses.map((course) => {
                const CardIcon = IconMap[course.icon] || Sparkles;
                const { price, originalPrice } = getPriceInfo(course, promotions);
                const discountPercent = price && originalPrice && originalPrice > price
                  ? Math.round(((originalPrice - price) / originalPrice) * 100)
                  : null;
                const accent = course.accentColor || '#1890FF';

                return (
                  <motion.div
                    key={course.slug}
                    layout
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="group relative h-full"
                  >
                    {/* Glow halo detrás de la tarjeta (visible en hover) */}
                    <div
                      className="absolute -inset-px rounded-[1.75rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none -z-10"
                      style={{ background: `linear-gradient(135deg, ${accent}33, transparent 60%)` }}
                    />

                    {/* Tarjeta Glassmorphism */}
                    <div
                      className="relative h-full rounded-[1.75rem] overflow-hidden border border-white/60 backdrop-blur-xl bg-white/50 flex flex-col transition-all duration-500 group-hover:border-white/90 group-hover:bg-white/70"
                      style={{ boxShadow: "0 10px 40px -12px rgba(15,23,42,0.10), inset 0 1px 0 0 rgba(255,255,255,0.9)" }}
                    >
                      {/* Imagen con overlay de color del curso */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          unoptimized
                        />
                        {/* Tinte sutil del color de acento */}
                        <div
                          className="absolute inset-0 opacity-20 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-10"
                          style={{ background: `linear-gradient(135deg, ${accent}, transparent 70%)` }}
                        />
                        {/* Degradado hacia abajo para legibilidad */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />

                        {/* Badge "Más Popular" */}
                        {course.slug === "analisis-de-datos" && (
                          <div className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/20 flex items-center gap-1 select-none">
                            🔥 Más Popular
                          </div>
                        )}

                        {/* Icono flotante */}
                        <div
                          className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/85 backdrop-blur-md border border-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110"
                          style={{ color: accent }}
                        >
                          <CardIcon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Cuerpo */}
                      <div className="flex flex-col flex-1 p-5">
                        {/* Tech stack + duración */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex gap-1.5 flex-wrap">
                            {course.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="bg-slate-100/80 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-mono font-medium border border-slate-200/50"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-slate-400 shrink-0">
                            <Clock size={11} /> {course.durationHours}h
                          </span>
                        </div>

                        {/* Título */}
                        <Link href={`/cursos/${course.slug}`} className="block no-underline">
                          <h3 className="font-sans text-[15px] font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-[#1890FF] transition-colors text-left line-clamp-1">
                            {course.title}
                          </h3>
                        </Link>
                        {/* Descripción */}
                        <p className="text-slate-500 text-xs leading-relaxed mb-5 text-left line-clamp-2">
                          {course.shortDescription}
                        </p>

                        {/* Footer: Precio + CTA */}
                        <div className="mt-auto pt-4 border-t border-slate-200/50 flex items-center justify-between gap-2">
                          <div className="flex flex-col text-left font-sans">
                            {isLoggedIn ? (
                              price ? (
                                <>
                                  <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider leading-none mb-1">Inversión</span>
                                  <div className="flex items-baseline gap-1.5">
                                    {originalPrice && (
                                      <span className="text-[10px] line-through text-slate-400 font-medium">
                                        {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(originalPrice)}
                                      </span>
                                    )}
                                    <span className="text-sm font-black text-slate-900 leading-none">
                                      {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price)}
                                    </span>
                                  </div>
                                  {discountPercent && (
                                    <span
                                      className="mt-1 text-[8px] font-extrabold px-1.5 py-0.5 rounded text-white w-fit leading-none"
                                      style={{ backgroundColor: accent }}
                                    >
                                      -{discountPercent}% DCTO
                                    </span>
                                  )}
                                </>
                              ) : null
                            ) : (
                              <div className="flex items-center gap-1 text-[10px] font-extrabold text-blue-500 select-none">
                                <Lock size={11} /> <span>Ver Precios</span>
                              </div>
                            )}
                          </div>

                          <Link
                            href={`/cursos/${course.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 shadow-sm transition-all duration-300 text-[11px] font-bold font-sans group/btn no-underline"
                            style={{
                              backgroundColor: `${accent}14`,
                              color: accent,
                            }}
                          >
                            <span>Ver temario</span>
                            <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
              className="inline-flex items-center gap-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-[13px] px-8 py-3.5 rounded-xl hover:bg-[#1890FF] hover:text-white hover:border-[#1890FF] transition-all no-underline group shadow-sm hover:shadow-md hover:shadow-blue-500/10 cursor-pointer"
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
