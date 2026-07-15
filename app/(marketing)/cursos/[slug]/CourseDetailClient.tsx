"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ChevronDown, Clock,
  BookOpen, Lock, FileText, Calendar, Check,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import React from "react";
import { type Course, courses } from "@/lib/data/courses";
import { founderImage } from "@/lib/data/images";
import { FadeIn, StaggerChildren, StaggerItem, CountUp } from "@/components/shared/AnimatedComponents";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/shared/AuthModal";
import TemarioSection from "@/components/marketing/temario/TemarioSection";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import { type CourseSchedule, SCHEDULE_COUNTRIES, convertSchedule, getNearestSchedule, getAllActiveSchedules, staticSchedules } from "@/lib/data/course-schedules";
import { useCountry } from "@/lib/context/CountryContext";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <LucideIcons.BookOpen className={className} />;
  return <Icon className={className} />;
}

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price);
}

export default function CourseDetailClient({ course }: { course: Course }) {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [bumpSelections, setBumpSelections] = useState<{slug: string, level: string, id?: string}[]>([]);
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [showAllDates, setShowAllDates] = useState(false);
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(0);
  const [isScheduleDropdownOpen, setIsScheduleDropdownOpen] = useState(false);
  const { country, setCountryByIso, countries } = useCountry();
  const relatedCourses = courses.filter((c) => c.slug !== course.slug).slice(0, 3);
  const scheduleCountry = SCHEDULE_COUNTRIES.find((c) => c.code === country.iso) || SCHEDULE_COUNTRIES[0];

  const convertAndFormat = (priceCLP: number | null | undefined) => {
    if (!priceCLP) return "";
    if (country.currency.code === "CLP") {
      return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(priceCLP);
    }
    const converted = priceCLP * country.currency.rate;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: country.currency.code, maximumFractionDigits: 0 }).format(converted);
  };

  // Bump Options logic
  const bumpOptions = [
    { id: 'py-basic', slug: 'python', level: 'Básico', name: 'Python - Plan Básico', price: 99000 },
    { id: 'sql-basic', slug: 'sql-server', level: 'Básico', name: 'SQL Server - Plan Básico', price: 99000 },
    { id: 'pbi-basic', slug: 'power-bi', level: 'Básico', name: 'Power BI - Plan Básico', price: 99000 },
    { id: 'pbi-inter', slug: 'power-bi', level: 'Intermedio', name: 'Power BI - Plan Intermedio', price: 99000 },
  ].filter(opt => {
    // Hide Básico of the current course
    if (opt.slug === course.slug && opt.level === 'Básico') return false;
    // For Power BI, if they are already on Power BI page, they can still pick Intermedio
    // but the basics are hidden for the active page
    return true;
  });

  const toggleBump = (bump: typeof bumpOptions[0]) => {
    setBumpSelections(prev => {
      const exists = prev.find(p => p.id === bump.id); // Add a loose id to track if checked
      if (exists) return prev.filter(p => p.id !== bump.id);
      if (prev.length >= 3) return prev; // Max 3
      return [...prev, { slug: bump.slug, level: bump.level, id: bump.id } as any];
    });
  };

  const handleCheckoutCTA = async () => {
     if (!isLoggedIn) {
        setShowAuthModal(true);
        return;
     }
     
     // Logged in: register abandoned_cart lead and redirect to pago
     try {
       const userEmail = (await createClient().auth.getUser()).data.user?.email || "Registrado";
       await fetch("/api/leads/create", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            name: "Usuario Logueado",
            email: userEmail,
            selectedCourses: [course.title],
            sourceCourse: course.slug,
            leadType: "abandoned_cart"
         })
       });
     } catch(e) {}
     window.location.href = `/pago?curso=${course.slug}`;
  };

  // Check auth state + listen for changes
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setIsLoggedIn(!!data.user);
      if (data.user) {
         try {
            const { data: profile } = await supabase.from('profiles').select('subscription_plan, subscription_start_at').eq('id', data.user.id).single();
            if (profile) {
              setUserPlan(profile.subscription_plan);
              if (profile.subscription_start_at) {
                const daysSinceStart = (Date.now() - new Date(profile.subscription_start_at).getTime()) / (1000 * 60 * 60 * 24);
                if (daysSinceStart <= 7) setIsFreeTrial(true);
              }
            }
         } catch(e) {}
      }
      setCheckingAuth(false);
    });
    // Listen for auth changes (login/register)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
        setShowAuthModal(false);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/schedules").then(r => r.json()),
      fetch("/api/promotions").then(r => r.json()),
    ]).then(([schData, promoData]) => {
      if (Array.isArray(schData)) setSchedules(schData);
      if (Array.isArray(promoData)) setPromotions(promoData);
    }).catch(console.error);
  }, []);

  const levels = course.levels || [];
  const activeLevel = levels[selectedLevel] || null;

  const levelSchedules = useMemo(() => {
    if (!activeLevel) return [];
    if (course.slug === "analisis-de-datos") {
      const adSchedules = schedules.filter(s => 
        ["sql-server", "power-bi", "python"].includes(s.course_slug) &&
        s.level_name === "Básico"
      );
      return getAllActiveSchedules(adSchedules);
    }
    const matched = schedules.filter(s => s.course_slug === course.slug && s.level_name === activeLevel.name);
    return getAllActiveSchedules(matched);
  }, [schedules, activeLevel, course.slug]);

  // Merge level schedules and static schedules fallback
  const activeSchedulesList = useMemo(() => {
    if (levelSchedules.length > 0) return levelSchedules;
    const matchedStatic = staticSchedules.filter(s => s.course_slug === course.slug && s.level_name === (activeLevel?.name || "Básico"));
    const now = new Date();
    const futureStatic = matchedStatic.filter(s => new Date(s.start_date + "T12:00:00") >= now);
    if (futureStatic.length > 0) {
      return futureStatic.map((s, idx) => ({ ...s, id: `static-${idx}`, is_active: true } as CourseSchedule));
    }
    return [];
  }, [levelSchedules, course.slug, activeLevel]);

  const levelSchedule = activeSchedulesList[selectedScheduleIndex] || activeSchedulesList[0] || null;

  // Reset selected schedule index when level or schedules change
  useEffect(() => {
    setSelectedScheduleIndex(0);
  }, [selectedLevel, activeSchedulesList.length]);

  const themeGlows = useMemo(() => {
    return {
      bg: "bg-gradient-to-br from-blue-50/50 via-slate-50 to-slate-50",
      glow1: "#1890FF",
      glow2: "#6366F1",
      glow3: "#8B5CF6"
    };
  }, []);

  const rawPrice = activeLevel?.price || null;
  const baseOriginalPrice = activeLevel?.originalPrice || course.originalPrice || rawPrice;
  
  // Apply Supabase promotions (same logic as PagoClient)
  const applicablePromo = promotions.find(p => p.target_type === 'all' || p.target_type === 'courses' || (p.target_type === 'specific_course' && p.target_id === course.slug));
  
  let promoDiscountedPrice = rawPrice;
  let promoOriginalPrice = rawPrice;
  let hasPromoDiscount = false;
  
  if (applicablePromo && rawPrice) {
    promoOriginalPrice = rawPrice;
    if (applicablePromo.promo_price) {
      promoDiscountedPrice = applicablePromo.promo_price;
      hasPromoDiscount = true;
    } else if (applicablePromo.discount_percentage) {
      promoDiscountedPrice = Math.round(rawPrice * (100 - applicablePromo.discount_percentage) / 100);
      hasPromoDiscount = true;
    }
  }

  // Calculate plan-based discount (stacks on top of promo)
  const isSpecialization = course.durationHours > 50 || course.slug === "analisis-de-datos" || course.slug === "analitica-mineria" || course.slug === "analitica-financiera";
  let discPercent = 0;
  if (userPlan === 'pro') discPercent = isSpecialization ? 10 : 20;
  else if (userPlan === 'max') discPercent = isSpecialization ? 12.5 : 25;
  else if (userPlan === 'ultra') discPercent = isSpecialization ? 20 : 40;

  // Use promo-discounted price as the base, then apply plan discount on top
  const priceAfterPromo = hasPromoDiscount ? promoDiscountedPrice : rawPrice;
  const currentPrice = priceAfterPromo ? Math.floor(priceAfterPromo * (1 - discPercent / 100)) : null;
  const grandTotal = currentPrice ? currentPrice + (bumpSelections.length * 99000) : null;
  
  // For showing the "original" crossed-out price, pick whichever is highest
  const effectiveOriginal = hasPromoDiscount ? promoOriginalPrice : (baseOriginalPrice || rawPrice);
  const originalGrandTotal = effectiveOriginal ? effectiveOriginal + (bumpSelections.length * 99000) : null;
  
  const totalDiscountPercentage = originalGrandTotal && grandTotal && originalGrandTotal > grandTotal 
    ? Math.round(((originalGrandTotal - grandTotal) / originalGrandTotal) * 100) 
    : 0;

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      const res = await fetch("/api/mp/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          courseSlug: course.slug,
          levelName: activeLevel?.name, // Send the selected level to the backend
          bumpSelections: bumpSelections.map(b => ({ slug: b.slug, level: b.level }))
        }),
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "Fallo al procesar."));
      }
    } catch (err) {
      alert("Error redirigiendo al pago.");
    }
  };

  return (
    <>
      {/* ════ HERO ════ */}
      <section className={`relative z-20 -mt-20 lg:-mt-24 pt-28 lg:pt-32 pb-6 lg:pb-20 ${themeGlows.bg}`}>
        {/* Overflow container for decorative blobs — keeps them from causing horizontal scroll on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Soft fading top/bottom overlay for premium blending */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/20 via-transparent to-slate-50/60" />
          
          {/* Ambient mesh blobs tailored to the course brand colors */}
          <div 
            className="absolute top-[-10%] right-[10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-40 mix-blend-multiply" 
            style={{ backgroundColor: `${themeGlows.glow1}22` }} 
          />
          <div 
            className="absolute bottom-[-10%] left-[5%] w-[550px] h-[550px] rounded-full blur-[140px] opacity-30 mix-blend-multiply" 
            style={{ backgroundColor: `${themeGlows.glow2}18` }} 
          />
          <div 
            className="absolute top-[20%] left-[30%] w-[450px] h-[450px] rounded-full blur-[150px] opacity-20 mix-blend-multiply" 
            style={{ backgroundColor: `${themeGlows.glow3}15` }} 
          />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-5 lg:px-8">
          {/* Mobile Header (visible on mobile, hidden on desktop) */}
          <div className="block lg:hidden text-left mb-6">
            {course.badgeLabel && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[0.65rem] font-black tracking-wider uppercase text-white shadow-sm mb-4 bg-[#1890FF]">
                <DynamicIcon name={course.icon} className="w-3.5 h-3.5" />
                {course.badgeLabel}
              </span>
            )}
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 mb-3 leading-tight tracking-tight">
              {course.title}
            </h1>
            {(course.slug === "analitica-mineria" || course.slug === "analitica-financiera") && (
              <p className="text-xs font-black uppercase tracking-wider mb-4 text-[#1890FF]">
                ★ INCLUYE POWER BI + PYTHON + SQL SERVER EN UN SOLO PROGRAMA
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Course Details */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Desktop Header Content (hidden on mobile) */}
              <div className="hidden lg:block w-full">
                <FadeIn delay={0.1} className="w-full">
                  {/* Category / Badge Label */}
                  {course.badgeLabel && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[0.65rem] font-black tracking-wider uppercase text-white shadow-sm mb-4 bg-[#1890FF]">
                      <DynamicIcon name={course.icon} className="w-3.5 h-3.5" />
                      {course.badgeLabel}
                    </span>
                  )}
                  
                  {/* Course Name (Title) */}
                  <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 mb-3 leading-tight tracking-tight">
                    {course.title}
                  </h1>
                  {(course.slug === "analitica-mineria" || course.slug === "analitica-financiera") && (
                    <p className="text-xs sm:text-sm font-black uppercase tracking-wider mb-4 text-[#1890FF]">
                      ★ INCLUYE POWER BI + PYTHON + SQL SERVER EN UN SOLO PROGRAMA
                    </p>
                  )}
                </FadeIn>

                <FadeIn delay={0.2} className="w-full">
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                    {course.description}
                  </p>
                </FadeIn>
              </div>

              <FadeIn delay={0.25} className="w-full">
                {/* Key Outcomes bullet points (no white block, larger text) */}
                <div className="mb-8 space-y-3 max-w-[580px]">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">
                    ¿Qué lograrás con este programa?
                  </h3>
                  {[
                    "Dominar herramientas líderes de la industria en nivel profesional.",
                    "Crear un portafolio de proyectos prácticos con datos reales.",
                    "Resolver casos de negocio reales paso a paso con mentoría.",
                    "Acreditar tus conocimientos con una certificación valorada en el mercado.",
                  ].map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#1890FF] mt-0.5 flex-shrink-0" />
                      <span className="text-[14px] text-slate-600 leading-relaxed font-semibold">{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-8">
                  {course.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-white border border-slate-200/80 text-slate-700 text-xs font-bold rounded-xl shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </FadeIn>

              {/* Schedules Dropdown container */}
              <div className="w-full space-y-6 max-w-[580px]">
                {/* Level Selector (Single, in Hero) */}
                {levels.length > 1 && (
                  <FadeIn delay={0.25} className="w-full">
                    <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 block">
                      Selecciona el Nivel del Curso
                    </label>
                    <div className="flex bg-slate-200/40 p-1 rounded-2xl gap-1 max-w-full overflow-x-auto scrollbar-hide border border-slate-200/50">
                      {levels.map((level, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedLevel(idx)}
                          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap border-none cursor-pointer ${
                            selectedLevel === idx
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {level.name}
                        </button>
                      ))}
                    </div>
                  </FadeIn>
                )}

                {/* Schedules Dropdown */}
                <FadeIn delay={0.3} className="relative z-30 w-full">
                  <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 block">
                    Fechas y Horarios Próximos
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      disabled={activeSchedulesList.length === 0}
                      onClick={() => setIsScheduleDropdownOpen(!isScheduleDropdownOpen)}
                      className={`w-full flex items-center justify-between p-2.5 sm:p-4 bg-white border border-slate-200/80 rounded-2xl text-left text-[11px] sm:text-sm font-bold transition-colors shadow-sm outline-none ${
                        activeSchedulesList.length === 0 ? "opacity-75 cursor-default" : "hover:border-slate-300 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#1890FF] flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          {levelSchedule ? (
                            <>
                              <span className="text-slate-800 block text-[10px] sm:text-xs font-black truncate">
                                Clases en vivo vía Zoom
                              </span>
                              <span className="text-slate-500 text-[9px] sm:text-[11px] font-semibold block mt-0.5 whitespace-normal">
                                Inicia: {(() => {
                                  const conv = convertSchedule(levelSchedule.start_date, levelSchedule.schedule_time, levelSchedule.schedule_days, scheduleCountry.timeZone);
                                  return conv.dateFormatted.charAt(0).toUpperCase() + conv.dateFormatted.slice(1);
                                })()}
                                &nbsp;·&nbsp;
                                {(() => {
                                  const conv = convertSchedule(levelSchedule.start_date, levelSchedule.schedule_time, levelSchedule.schedule_days, scheduleCountry.timeZone);
                                  return `${conv.days} (${conv.time})`;
                                })()}
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-650 block text-[10px] sm:text-xs font-semibold truncate">
                              Fechas de clases en vivo por confirmar
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isScheduleDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isScheduleDropdownOpen && activeSchedulesList.length > 0 && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setIsScheduleDropdownOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-40 max-h-64 overflow-y-auto"
                          >
                            <div className="py-2 px-1 space-y-1">
                              {activeSchedulesList.map((sch, idx) => {
                                const conv = convertSchedule(sch.start_date, sch.schedule_time, sch.schedule_days, scheduleCountry.timeZone);
                                return (
                                  <button
                                    key={sch.id || idx}
                                    type="button"
                                    onClick={() => {
                                      setSelectedScheduleIndex(idx);
                                      setIsScheduleDropdownOpen(false);
                                    }}
                                    className={`w-full p-2.5 sm:p-3 text-left hover:bg-slate-50 transition-colors flex items-start gap-2.5 sm:gap-3 rounded-xl border-none bg-transparent cursor-pointer ${
                                      selectedScheduleIndex === idx ? "bg-slate-50" : ""
                                    }`}
                                  >
                                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-[#1890FF] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] sm:text-xs font-bold text-slate-800">
                                        Inicia: {conv.dateFormatted.charAt(0).toUpperCase() + conv.dateFormatted.slice(1)}
                                      </p>
                                      <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">
                                        {conv.days} · {conv.time} ({scheduleCountry.name})
                                      </p>
                                    </div>
                                    {selectedScheduleIndex === idx && (
                                      <Check className="w-3.5 h-3.5 text-emerald-500 ml-auto flex-shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>

                {/* Secondary actions below schedules dropdown */}
                <FadeIn delay={0.35} className="w-full">
                  <div className="flex gap-2.5 sm:gap-3">
                    <a
                      href="#temario"
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-3 rounded-xl font-extrabold text-[11px] sm:text-xs no-underline transition-all bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1890FF] flex-shrink-0" /> Ver Temario
                    </a>
                    <a
                      href="https://drive.google.com/file/d/1EMO5s2Sre6EUMyaxW7JIjy24tEC5mCNz/view?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-3 rounded-xl font-extrabold text-[11px] sm:text-xs no-underline transition-all bg-white hover:bg-slate-50 text-slate-650 border border-slate-200/80 shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" /> Folleto PDF
                    </a>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Right Column: Course Image & Preview Card */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none flex flex-col lg:pt-2 order-first lg:order-last">
              <FadeIn delay={0.2}>
                <div className="relative group transition-all duration-500 w-full">
                  {/* Glowing backdrop border matching the template blue color */}
                  <div 
                    className="absolute -inset-1 rounded-2xl blur-md opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: "#1890FF" }}
                  />
                  
                  {/* Unified Premium Card Container (slightly less rounded: rounded-2xl) */}
                  <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl">
                    
                    {/* Top: Image */}
                    <div 
                      className="relative w-full aspect-[16/9] bg-slate-900 overflow-hidden"
                    >
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover opacity-95" 
                      />
                    </div>

                    {/* Bottom: Card Body (Prices, Action Buttons & Benefits) */}
                    <div className="p-4 sm:p-6 bg-white space-y-4 sm:space-y-6">
                      
                      {/* Pricing block inside the card */}
                      <div>
                        {activeSchedulesList.length === 0 ? (
                          <div className="space-y-4">
                            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 sm:p-4 text-left">
                              <h4 className="text-[11px] sm:text-xs font-black text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                Próxima fecha a confirmar
                              </h4>
                              <p className="text-[10px] sm:text-[11px] font-semibold text-amber-700 leading-relaxed">
                                No disponemos de una fecha programada inmediata para este nivel. Puedes contactarnos directamente para consultar la próxima fecha de inicio, reservar tu cupo o solicitar un horario personalizado.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                              Inversión del Curso
                            </p>
                            
                            {isLoggedIn ? (
                              <div className="flex flex-col items-start gap-1">
                                {originalGrandTotal && totalDiscountPercentage > 0 && (
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-xs sm:text-sm font-bold text-slate-400 line-through">
                                      {convertAndFormat(originalGrandTotal)}
                                    </span>
                                    <span className="text-[8px] sm:text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                      {totalDiscountPercentage}% OFF
                                    </span>
                                  </div>
                                )}
                                <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                                  {convertAndFormat(grandTotal)}
                                </span>
                                <p className="text-[8px] sm:text-[9px] text-slate-400 mt-1 font-semibold">Precio por nivel</p>
                              </div>
                            ) : (
                              <div 
                                className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-white p-3 sm:p-4 cursor-pointer group mb-1 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                                onClick={() => setShowAuthModal(true)}
                              >
                                 <div className="flex items-start gap-2.5 sm:gap-3">
                                   <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                     <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                   </div>
                                   <div className="text-left min-w-0 flex-1">
                                     <h4 className="text-[10px] sm:text-[11px] font-black text-slate-900 uppercase tracking-wider mb-0.5 truncate">
                                       Precios y Becas Exclusivos
                                     </h4>
                                     <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500 leading-relaxed max-w-full">
                                       Inicia sesión o regístrate gratis para ver precios Cyber Day y opciones de financiamiento.
                                     </p>
                                     <div className="flex items-center gap-1 mt-1.5">
                                       <span className="text-[8px] sm:text-[9px] font-black text-[#1890FF] uppercase tracking-wider group-hover:underline">
                                         Crear cuenta gratis
                                       </span>
                                       <ArrowRight className="w-2.5 h-2.5 text-[#1890FF] transition-transform group-hover:translate-x-0.5" />
                                     </div>
                                   </div>
                                 </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Main checkout / registration CTA button */}
                      {activeSchedulesList.length === 0 ? (
                        <a
                          href={`https://wa.me/56935409699?text=Hola!%20Me%20gustar%C3%ADa%20consultar%20por%20las%20pr%C3%B3ximas%20fechas%20y%20horarios%20del%20curso%20${encodeURIComponent(course.title)}%20-${encodeURIComponent(activeLevel?.name || "Básico")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 sm:py-4 rounded-xl text-white font-bold text-xs sm:text-sm flex justify-center items-center gap-1.5 sm:gap-2 transition-all cursor-pointer border-none shadow-md hover:shadow-lg hover:-translate-y-0.5 no-underline bg-[#25D366] hover:bg-[#20ba5a]"
                        >
                          <LucideIcons.MessageCircle className="w-4 h-4 text-white flex-shrink-0" />
                          Consultar fecha de inicio
                        </a>
                      ) : (
                        <button
                          onClick={handleCheckoutCTA}
                          className="w-full py-3 sm:py-4 rounded-xl text-white font-bold text-xs sm:text-sm flex justify-center items-center gap-1.5 sm:gap-2 transition-all cursor-pointer border-none shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          style={{ background: 'linear-gradient(135deg, #1890FF, #0050b3)' }}
                        >
                          {isLoggedIn ? "Inscribirse y pagar" : "Registrarse para cotizar"} <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      )}

                      <hr className="border-slate-100 my-0" />

                      {/* Benefits list */}
                      <div>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
                          Este curso incluye:
                        </p>
                        <div className="space-y-2.5 sm:space-y-3">
                          {[
                            { text: "Clases Online en Vivo vía Zoom", icon: "💻" },
                            { text: course.slug === "analisis-de-datos" ? "48 Horas por nivel" : `${course.durationHours} Horas de formación total`, icon: "⏱️" },
                            { text: "Acceso ilimitado a grabaciones 24/7", icon: "📂" },
                            { text: "Certificado de aprobación oficial", icon: "🎓" },
                            { text: "Proyectos prácticos con datos reales", icon: "📊" },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 sm:gap-3">
                              <span className="text-xs sm:text-sm select-none text-slate-500 shrink-0">{item.icon}</span>
                              <span className="text-[11px] sm:text-xs font-bold text-slate-700">{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ════ TEMARIO PREMIUM ════ */}
      <TemarioSection
        course={course}
        selectedLevel={selectedLevel}
        isFreeTrial={isFreeTrial}
      />

      {/* ════ INSTRUCTOR ════ */}
      <section className="py-16 lg:py-20 bg-white border-t border-gray-100 overflow-hidden">
        <div className="max-w-[1000px] mx-auto px-5 lg:px-10">
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-[#F8FAFC] rounded-[2rem] p-8 lg:p-12 border border-gray-100 shadow-sm">
              <div className="w-40 h-40 md:w-48 md:h-48 shrink-0 relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-3xl -rotate-6 group-hover:-rotate-3 transition-transform duration-300 z-0" style={{ backgroundColor: "#1890FF20" }} />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-xl z-10 bg-white transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image src={founderImage} alt="Manuel Oliva" fill className="object-cover" unoptimized />
                </div>
              </div>
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-[#0F172A] mb-2">Conoce a tu Profesor</h2>
                <h3 className="text-xl font-bold text-[#1890FF] mb-4">Manuel Oliva</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Profesional experto en Datos, Automatización e Inteligencia Artificial, con destacada experiencia liderando proyectos estratégicos y tecnológicos en empresas como AngloAmerican, CAP, Deloitte y SQM.
                  <br /><br />
                  Magíster en Data Science por la UAI, especializado en optimizar la toma de decisiones empresariales mediante ecosistemas escalables en SQL Server, Power BI, Python y automatización con IA. Apasionado por la docencia, ha formado a más de 5.000 alumnos para transformar su carrera tecnológica.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">Magíster Data Science UAI</span>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">+5.000 Estudiantes</span>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">Consultor de Datos</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════ CONTACT FORM ════ */}
      <CourseContactForm course={course} />

      {/* ════ RELATED COURSES ════ */}
      {isLoggedIn && relatedCourses.length > 0 && (
      <section className="py-16 lg:py-20 pb-32 lg:pb-40 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <FadeIn>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#0F172A] mb-10 text-center">
              También te puede interesar
            </h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedCourses.map((rc) => (
              <StaggerItem key={rc.slug}>
                <Link href={`/cursos/${rc.slug}`} className="group block no-underline">
                  <motion.div
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all"
                    whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(15,23,42,0.08)" }}
                  >
                    <div className="h-[180px] relative overflow-hidden">
                      <Image src={rc.imageUrl} alt={rc.title} fill className="object-cover transition-transform duration-600 group-hover:scale-110" unoptimized />
                    </div>
                    <div className="p-6">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">{rc.categoryLabel}</span>
                      <h3 className="font-display text-lg font-bold text-[#0F172A] mt-2 mb-2">{rc.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{rc.shortDescription}</p>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
      )}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="register"
      />
    </>
  );
}

/* ─── Lead Capture Form (replaces pricing card) ─── */


/* ─── Enterprise Contact Form Component ─── */
function CourseContactForm({ course }: { course: Course }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [contactType, setContactType] = useState<"personal" | "empresa">("personal");
  const [selectedServices, setSelectedServices] = useState<string[]>(["Capacitación In-Company"]);
  const [honeypot, setHoneypot] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+56");
  const [showPrefixDropdown, setShowPrefixDropdown] = useState(false);
  const formLoadedAt = useRef(Date.now());

  const COUNTRIES = [
    { code: "+56", iso: "cl", name: "Chile" },
    { code: "+52", iso: "mx", name: "México" },
    { code: "+54", iso: "ar", name: "Argentina" },
    { code: "+57", iso: "co", name: "Colombia" },
    { code: "+51", iso: "pe", name: "Perú" },
    { code: "+593", iso: "ec", name: "Ecuador" },
    { code: "+507", iso: "pa", name: "Panamá" },
    { code: "+58", iso: "ve", name: "Venezuela" },
    { code: "+598", iso: "uy", name: "Uruguay" },
    { code: "+595", iso: "py", name: "Paraguay" },
    { code: "+591", iso: "bo", name: "Bolivia" },
    { code: "+502", iso: "gt", name: "Guatemala" },
    { code: "+506", iso: "cr", name: "Costa Rica" },
    { code: "+503", iso: "sv", name: "El Salvador" },
    { code: "+504", iso: "hn", name: "Honduras" },
    { code: "+505", iso: "ni", name: "Nicaragua" },
    { code: "+1", iso: "do", name: "Rep. Dominicana" },
    { code: "+34", iso: "es", name: "España" },
    { code: "+1", iso: "us", name: "EE.UU." },
  ];

  const enterpriseServices = [
    "Capacitación In-Company",
    "Dashboards Personalizados",
    "Automatización de Procesos",
    "Consultoría en Datos",
    "Mentoría Corporativa",
  ];

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const whatsapp = formData.get('whatsapp') as string;
      const message = formData.get('message') as string;
      
      const payload: any = {
        name,
        email,
        whatsapp: `${phonePrefix}${whatsapp}`,
        message,
        sourceCourse: course.title,
        leadType: contactType,
      };

      if (contactType === "empresa") {
        payload.company = formData.get('company') as string;
        payload.position = formData.get('position') as string;
        payload.employeeCount = formData.get('employeeCount') as string;
        payload.selectedCourses = selectedServices;
      }

      const res = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, ...getAntiBotFields(formLoadedAt.current, honeypot) })
      });

      if (!res.ok) throw new Error("Error submitting form");
      setIsSuccess(true);
      if (contactType === "personal") {
        setTimeout(() => {
          window.location.href = `/pago?curso=${course.slug}`;
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Hubo un problema al enviar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPersonal = contactType === "personal";

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <FadeIn>
            <div>
              <span className="inline-flex items-center gap-2 text-indigo-600 font-bold tracking-widest uppercase text-xs bg-indigo-50 px-4 py-1.5 rounded-full mb-6">
                {isPersonal ? "👨‍🎓 Cotización de Curso" : "🏢 Soluciones Empresariales"}
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#0F172A] mb-5 leading-tight">
                {isPersonal ? (
                  <>Cotiza tu programa y recibe <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-[#1890FF]">atención personalizada</span></>
                ) : (
                  <>Capacita a tu equipo <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-[#1890FF]">con expertos</span></>
                )}
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                {isPersonal 
                  ? "Te enviaremos todos los detalles, temarios, precios y opciones de financiamiento para que inicies tu formación con éxito."
                  : "Diseñamos programas de capacitación a medida para empresas. Cursos grupales, dashboards personalizados y automatización."
                }
              </p>

              <div className="space-y-4">
                {isPersonal ? (
                  [
                    { icon: "📅", text: "Fechas de inicio y horarios flexibles" },
                    { icon: "💸", text: "Opciones de pago en cuotas y descuentos" },
                    { icon: "🎓", text: "Certificación acreditada al finalizar" },
                    { icon: "👨‍🏫", text: "Asesoría vocacional personalizada" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-600">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-sm flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))
                ) : (
                  [
                    { icon: "🏢", text: "Capacitación grupal in-company o virtual" },
                    { icon: "📊", text: "Dashboards personalizados para tu empresa" },
                    { icon: "⚡", text: "Automatización de procesos corporativos" },
                    { icon: "📋", text: "Certificación para todos los participantes" },
                    { icon: "💰", text: "Precios corporativos con descuento por volumen" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-600">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-sm flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </FadeIn>

          {/* Right: Form */}
          <FadeIn delay={0.2}>
            <div
              className="bg-white rounded-[2rem] p-8 lg:p-10 border border-gray-100 relative overflow-hidden"
              style={{ boxShadow: "0 25px 60px -15px rgba(0,0,0,0.1)" }}
            >

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-500 text-3xl">✓</div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    {isPersonal ? "¡Cotización Enviada!" : "¡Solicitud Recibida!"}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {isPersonal
                      ? "Cotización enviada a su mail. Revisa tu bandeja de entrada."
                      : "Revisa tu bandeja de entrada, te enviamos un correo con toda la información."}
                  </p>
                  {isPersonal && (
                    <div className="flex items-center justify-center gap-2 text-xs text-[#1890FF] font-bold">
                      <div className="w-3.5 h-3.5 border-2 border-[#1890FF]/30 border-t-[#1890FF] rounded-full animate-spin" />
                      <span>Redirigiendo a la pantalla de pago...</span>
                    </div>
                  )}
                </motion.div>
              ) : (
                <>
                  <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                    <button
                      onClick={() => setContactType("personal")}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all border-none cursor-pointer ${isPersonal ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      👨‍🎓 Cotización
                    </button>
                    <button
                      onClick={() => setContactType("empresa")}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all border-none cursor-pointer ${!isPersonal ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      🏢 Empresas
                    </button>
                  </div>
                
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="font-display font-bold text-xl text-[#0F172A] mb-1">
                      {isPersonal ? "Solicita Información" : "Cotización Empresarial"}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {isPersonal ? "Déjanos tus datos y te enviaremos el folleto completo." : "Te enviaremos una propuesta personalizada en menos de 24 horas."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Nombre *</label>
                        <input type="text" name="name" required placeholder="Tu nombre"
                          className="w-full rounded-xl p-4 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Email *</label>
                        <input type="email" name="email" required placeholder={isPersonal ? "tu@email.com" : "contacto@empresa.com"}
                          className="w-full rounded-xl p-4 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                      </div>
                    </div>

                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">WhatsApp *</label>
                      <div className="flex items-stretch">
                        <div className="relative">
                          <button type="button" onClick={() => setShowPrefixDropdown(!showPrefixDropdown)}
                            className="h-full px-3 py-3.5 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl text-sm font-medium text-slate-600 flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
                            <img src={`https://flagcdn.com/w20/${COUNTRIES.find(c => c.code === phonePrefix)?.iso}.png`} alt="" className="w-4 h-auto rounded-[2px]" />
                            <span>{phonePrefix}</span>
                            <ChevronDown className="text-slate-400" size={14} />
                          </button>
                          <AnimatePresence>
                            {showPrefixDropdown && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowPrefixDropdown(false)} />
                                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                  className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20">
                                  <div className="max-h-56 overflow-y-auto py-1">
                                    {COUNTRIES.map((country, idx) => (
                                      <button key={idx} type="button" onClick={() => { setPhonePrefix(country.code); setShowPrefixDropdown(false); }}
                                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer">
                                        <span className="flex-shrink-0 mr-1"><img src={`https://flagcdn.com/w20/${country.iso}.png`} alt="" className="w-4 h-auto rounded-[2px]" /></span>
                                        <span className="font-medium text-slate-700">{country.name}</span>
                                        <span className="text-slate-400 text-xs ml-auto">{country.code}</span>
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                        <input type="tel" name="whatsapp" required placeholder="9 1234 5678"
                          className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm font-medium text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                      </div>
                    </div>

                    {!isPersonal && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Empresa *</label>
                            <input type="text" name="company" required placeholder="Nombre empresa"
                              className="w-full rounded-xl p-4 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Cargo</label>
                            <input type="text" name="position" placeholder="Ej: Gerente TI"
                              className="w-full rounded-xl p-4 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">N° personas</label>
                            <input type="number" name="employeeCount" min="1" placeholder="10"
                              className="w-full rounded-xl p-4 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Servicios de interés</label>
                          <div className="flex flex-wrap gap-2">
                            {enterpriseServices.map(service => {
                              const isSelected = selectedServices.includes(service);
                              return (
                                <button key={service} type="button" onClick={() => toggleService(service)}
                                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${isSelected ? 'bg-indigo-50 border-indigo-400 text-indigo-600' : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50/50'}`}>
                                  {service}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Detalle o dudas adicionales</label>
                      <textarea name="message" rows={3}
                        placeholder={isPersonal ? "¿Tienes alguna consulta específica sobre el temario o proceso?" : "Cuéntanos tus necesidades: ¿cuántas personas? ¿qué herramientas usan actualmente?"}
                        className="w-full rounded-xl p-4 resize-none text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                    </div>

                    {/* Honeypot — invisible to humans */}
                    <div style={honeypotStyle} aria-hidden="true">
                      <input type="text" name="_website" autoComplete="off" tabIndex={-1} value={honeypot} onChange={e => setHoneypot(e.target.value)} />
                    </div>

                    <motion.button type="submit" disabled={isSubmitting}
                      className="w-full py-4 rounded-2xl text-white font-bold text-base flex justify-center items-center gap-2.5 transition-all disabled:opacity-70 border-none cursor-pointer shadow-lg hover:shadow-xl"
                      style={{ background: "linear-gradient(135deg, #1890FF, #0050b3)", boxShadow: "0 12px 35px -8px rgba(24,144,255,0.4)" }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>{isPersonal ? "Solicitar Cotización →" : "Solicitar Cotización Empresarial →"}</>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
