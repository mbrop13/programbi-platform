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
import { FadeIn, StaggerChildren, StaggerItem, TiltCard } from "@/components/shared/AnimatedComponents";
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
      <div className="w-full px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column (Sticky Sidebar on Desktop) */}
            <div className="lg:col-span-4 lg:sticky lg:top-14 text-left flex flex-col gap-6 z-20">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-blue-50/70 border border-blue-100/40 backdrop-blur-sm text-[#1890FF] font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-full mb-5 shadow-sm">
                  <Sparkles size={11} className="fill-current text-[#1890FF]" /> Bootcamps de Datos
                </span>
                
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-slate-900 to-[#1890FF] leading-tight mb-4 tracking-tight">
                  Explora <br />nuestros <br className="hidden lg:block" />programas.
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mb-3 font-sans">
                  Clases en vivo por Zoom, aprendizaje práctico con proyectos reales y apoyo técnico de mentores expertos 24/7.
                </p>
                
                {/* Stats in Left Column */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-bold mb-6 select-none">
                  <span>+5,000 egresados</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span>10 programas</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span>98% satisfacción</span>
                </div>

                {/* Category selector slider (visible on mobile, hidden on desktop) */}
                <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 pb-2 -mx-6 px-6 w-[calc(100%+3rem)] scroll-smooth select-none">
                  {categories.map((cat) => {
                    const isActive = selectedCat === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCat(cat.id)}
                        className={`relative px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-305 cursor-pointer ${
                          isActive
                            ? "border-blue-500/10 text-[#1890FF] shadow-sm bg-white"
                            : "border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeCategoryBgMobile"
                            className="absolute inset-0 bg-white border border-blue-500/20 rounded-full -z-10 shadow-[0_2px_10px_rgba(24,144,255,0.06)]"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Category selector list (hidden on mobile, vertical on desktop) */}
                <div className="hidden lg:flex flex-col gap-3 w-full shrink-0 select-none">
                  {categories.map((cat) => {
                    const IconComponent = cat.id === "destacados" ? Sparkles : cat.id === "datos" ? Database : cat.id === "python" ? Code : Zap;
                    const isActive = selectedCat === cat.id;
                    const count = getCatCount(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCat(cat.id)}
                        className={`relative text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between gap-4 outline-none border cursor-pointer w-full ${
                          isActive
                            ? "border-blue-500/15 text-[#1890FF] shadow-[0_4px_20px_-4px_rgba(24,144,255,0.08)] bg-white"
                            : "border-slate-100/80 hover:border-slate-200 bg-white/40 hover:bg-slate-50/50 text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeCategoryBg"
                            className="absolute inset-0 bg-white border border-blue-500/15 rounded-xl -z-10 shadow-[0_4px_16px_rgba(24,144,255,0.04)]"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                            isActive
                              ? "bg-blue-500/10 border-blue-500/20 text-[#1890FF]"
                              : "bg-slate-50 border-slate-100 text-slate-400"
                          }`}>
                            <IconComponent size={16} />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold leading-none">{cat.label}</span>
                            <span className="text-[10px] text-slate-400 font-semibold leading-normal mt-1">{cat.desc}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold transition-all ${
                          isActive
                            ? "bg-blue-50 border-blue-100 text-[#1890FF]"
                            : "bg-slate-50 border-slate-100 text-slate-400"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA Button below category selector */}
              <div className="w-full">
                <Link
                  href="/cursos"
                  className="inline-flex w-full items-center justify-center gap-2.5 bg-slate-50 border border-slate-200/80 text-slate-700 font-bold text-[13px] px-6 py-4 rounded-xl hover:bg-[#1890FF] hover:text-white hover:border-[#1890FF] transition-all no-underline group shadow-sm hover:shadow-md hover:shadow-blue-500/10 cursor-pointer"
                >
                  <span>Ver todos los cursos</span> 
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform text-slate-500 group-hover:text-white" />
                </Link>
              </div>

              {/* Bottom trust factors below the button */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6 lg:gap-4 border-t border-slate-100 pt-5 mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[#1890FF] border border-blue-500/20 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-extrabold text-slate-800">Clases en Vivo + Grabaciones</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Repasa el material a tu ritmo</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-extrabold text-slate-800">Certificación Verificable</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Acredita tus competencias de datos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Premium Animated Courses Grid */}
            <div className="lg:col-span-8 w-full z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCat}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                          className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-500/15 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.012)] hover:shadow-[0_24px_50px_rgba(24,144,255,0.06)] transition-all duration-500 h-full p-5 relative"
                        >
                          {/* Subtle radial glow matching the course accent color */}
                          <div 
                            className="absolute -right-24 -top-24 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none" 
                            style={{ backgroundColor: course.accentColor || '#1890FF' }}
                          />

                          {/* Floating course symbol icon */}
                          <div className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-450 group-hover:text-[#1890FF] group-hover:border-[#1890FF]/30 transition-all shadow-sm">
                            <CardIcon className="w-4 h-4" />
                          </div>
                          
                          <div>
                            {/* Image container */}
                            <div className="relative overflow-hidden aspect-[16/10] rounded-xl mb-5 bg-slate-50">
                              <div className="absolute inset-0 bg-[#0F172A]/4 z-10 group-hover:bg-[#0F172A]/0 transition-colors duration-500" />
                              <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5 items-start">
                                <div
                                  className="px-3 py-1 rounded-md text-white text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1.5 backdrop-blur-md shadow-sm border border-white/10"
                                  style={{ background: `${course.badgeColor || course.accentColor}dd` }}
                                >
                                  <Sparkles size={9} /> {course.badgeLabel || course.categoryLabel}
                                </div>
                                {course.isFeatured && (
                                  <div className="bg-amber-500/95 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10 shadow-sm flex items-center gap-1 select-none">
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

                            {/* Tech Stack Pills */}
                            <div className="flex gap-1.5 flex-wrap mb-4">
                              {course.techStack.map((tech) => (
                                <span key={tech} className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[9px] font-mono border border-slate-100">
                                  {tech}
                                </span>
                              ))}
                            </div>

                            {/* Header details: Category and Duration */}
                            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                              <span>{course.categoryLabel}</span>
                              <span className="flex items-center gap-1"><Clock size={11} /> {course.durationHours} hrs</span>
                            </div>

                            {/* Title & Short Description */}
                            <Link href={`/cursos/${course.slug}`} className="block no-underline">
                              <h3 className="font-sans text-[17px] font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#1890FF] transition-colors text-left">
                                {course.title}
                              </h3>
                            </Link>
                            <p className="text-slate-500 text-xs leading-relaxed mb-4 text-left line-clamp-2">
                              {course.shortDescription}
                            </p>

                            {/* Skills Preview */}
                            <div className="flex flex-wrap items-center gap-3 text-[10px] text-emerald-600 font-bold mb-5 select-none text-left">
                              {course.techStack.slice(0, 2).map((skill, index) => (
                                <div key={index} className="flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                                  <span>Dominarás {skill}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="mt-auto">
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                               {/* Duration & Modality */}
                               <div className="flex flex-col gap-0.5 text-left">
                                 <span className="flex items-center gap-1.5 text-xs text-slate-700 font-extrabold">
                                   Online en vivo
                                 </span>
                                 <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Zoom en directo
                                 </span>
                                 <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mt-1.5 select-none">
                                   <Users className="w-3 h-3 text-slate-400" />
                                   <span>+500 egresados</span>
                                 </span>
                               </div>

                               {/* CLP price tag & Discount */}
                               {isLoggedIn ? (
                                 price ? (
                                   <div className="flex flex-col text-right items-end justify-center font-sans">
                                     <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Inversión</span>
                                     <div className="flex items-center gap-1.5 mt-0.5">
                                       {originalPrice && (
                                         <span className="text-[10px] line-through text-slate-400 font-medium">
                                           {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(originalPrice)}
                                         </span>
                                       )}
                                       <span className="text-sm font-black text-slate-900">
                                         {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price)}
                                       </span>
                                     </div>
                                     {discountPercent && (
                                       <span className="mt-0.5 text-[8px] font-extrabold px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-100">
                                         -{discountPercent}% DCTO
                                       </span>
                                     )}
                                   </div>
                                 ) : null
                               ) : (
                                 <div className="flex flex-col text-right items-end justify-center font-sans">
                                   <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Inversión</span>
                                   <span className="mt-1 text-[9px] font-extrabold px-2.5 py-1 bg-blue-50/70 text-[#1890FF] rounded-md border border-blue-100/40 flex items-center gap-1 shadow-sm select-none">
                                     <Lock size={10} /> Registrarse para ver precios
                                   </span>
                                 </div>
                               )}
                             </div>
                            
                            <Link href={`/cursos/${course.slug}`} className="block no-underline mt-4">
                              <div className="w-full flex items-center justify-between font-bold text-slate-700 bg-slate-50 hover:bg-[#1890FF] hover:text-white border border-slate-100/70 hover:border-transparent rounded-xl px-4 py-2.5 transition-all duration-300 text-xs font-sans group/btn">
                                <span>Ver especialización</span>
                                <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-1" />
                              </div>
                            </Link>
                          </div>

                        </motion.div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>
  );
}


