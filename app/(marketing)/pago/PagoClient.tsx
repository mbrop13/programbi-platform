"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Clock, Calendar, Users, Building2, User,
  CheckCircle2, Bell, Loader2, ShoppingCart, Sparkles, ChevronDown,
  MapPin, BadgeCheck, X
} from "lucide-react";
import { courses as allCourses } from "@/lib/data/courses";
import { type CourseSchedule, analisisDeDatosSlugs, formatScheduleDate, formatShortDate, getNearestSchedule } from "@/lib/data/course-schedules";
import { FadeIn } from "@/components/shared/AnimatedComponents";

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price);
}

type Mode = "individual" | "enterprise";

interface SelectedCourse {
  slug: string;
  levelName: string;
  price: number;
  title: string;
  scheduleId?: string;
}

export default function PagoClient() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("curso") || "";
  const initialLevel = searchParams.get("nivel") || "Básico";
  const initialName = searchParams.get("nombre") || "";
  const initialEmail = searchParams.get("email") || "";

  const [mode, setMode] = useState<Mode>("individual");
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState<SelectedCourse[]>([]);
  const [notifyLoading, setNotifyLoading] = useState<string | null>(null);
  const [notifySuccess, setNotifySuccess] = useState<Set<string>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmittingEnterprise, setIsSubmittingEnterprise] = useState(false);
  const [enterpriseSuccess, setEnterpriseSuccess] = useState(false);

  // Enterprise form fields
  const [entName, setEntName] = useState(initialName);
  const [entEmail, setEntEmail] = useState(initialEmail);
  const [entCompany, setEntCompany] = useState("");
  const [entPosition, setEntPosition] = useState("");
  const [entEmployees, setEntEmployees] = useState("");
  const [entMessage, setEntMessage] = useState("");

  // Fetch schedules
  useEffect(() => {
    fetch("/api/schedules")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSchedules(data);
      })
      .catch(console.error)
      .finally(() => setLoadingSchedules(false));
  }, []);

  // Auto-select the initial course from URL params
  useEffect(() => {
    if (initialSlug && schedules.length >= 0 && selectedCourses.length === 0) {
      const course = allCourses.find(c => c.slug === initialSlug);
      if (course) {
        const level = course.levels?.find(l => l.name === initialLevel) || course.levels?.[0];
        if (level?.price) {
          setSelectedCourses([{
            slug: course.slug,
            levelName: level.name,
            price: level.price,
            title: course.title,
          }]);
        }
      }
    }
  }, [initialSlug, initialLevel, schedules]);

  // Courses with available schedules (basic/purchasable)
  const coursesWithDates = useMemo(() => {
    // Cursos individuales con fechas
    const individual = ["power-bi", "python", "sql-server", "excel"].map(slug => {
      const course = allCourses.find(c => c.slug === slug);
      if (!course) return null;
      const level = course.levels?.find(l => l.name === "Básico");
      const schedule = schedules.find(s => s.course_slug === slug && s.level_name === "Básico");
      return { course, level, schedule, slug };
    }).filter(Boolean) as { course: typeof allCourses[0]; level: any; schedule: CourseSchedule | undefined; slug: string }[];

    // Análisis de Datos — its date is the nearest of its component courses
    const adCourse = allCourses.find(c => c.slug === "analisis-de-datos");
    const adLevel = adCourse?.levels?.find(l => l.name === "Básico");
    const adSchedules = schedules.filter(s => analisisDeDatosSlugs.includes(s.course_slug));
    const nearestAd = getNearestSchedule(adSchedules);

    return {
      individual,
      analisisDeDatos: adCourse && adLevel ? { course: adCourse, level: adLevel, schedule: nearestAd } : null,
    };
  }, [schedules]);

  // Courses WITHOUT available dates (for notify me)
  const coursesWithoutDates = useMemo(() => {
    const slugsWithDates = new Set(["power-bi", "python", "sql-server", "excel", "analisis-de-datos"]);
    return allCourses.filter(c => !slugsWithDates.has(c.slug));
  }, []);

  const isSelected = (slug: string, levelName: string) =>
    selectedCourses.some(sc => sc.slug === slug && sc.levelName === levelName);

  const toggleCourse = (slug: string, levelName: string, price: number, title: string) => {
    setSelectedCourses(prev => {
      if (prev.some(sc => sc.slug === slug && sc.levelName === levelName)) {
        return prev.filter(sc => !(sc.slug === slug && sc.levelName === levelName));
      }
      return [...prev, { slug, levelName, price, title }];
    });
  };

  const totalPrice = selectedCourses.reduce((sum, sc) => sum + sc.price, 0);

  const handleNotifyMe = async (slug: string, levelName: string) => {
    const key = `${slug}-${levelName}`;
    if (notifySuccess.has(key)) return;
    setNotifyLoading(key);
    try {
      await fetch("/api/leads/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: initialName || "Visitante",
          email: initialEmail || "",
          courseSlug: slug,
          levelName,
        }),
      });
      setNotifySuccess(prev => new Set(prev).add(key));
    } catch (err) {
      console.error(err);
    } finally {
      setNotifyLoading(null);
    }
  };

  const handleCheckout = async () => {
    if (selectedCourses.length === 0) return;
    setIsCheckingOut(true);
    try {
      // For now, redirect to Flow for the first selected course
      // Multi-course checkout can be implemented later
      const primary = selectedCourses[0];
      const res = await fetch("/api/flow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: primary.slug,
          levelName: primary.levelName,
          bumpSelections: selectedCourses.slice(1).map(sc => ({ slug: sc.slug, level: sc.levelName })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "No se pudo procesar el pago."));
      }
    } catch (err) {
      alert("Error al procesar el pago.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entName || !entEmail || !entCompany) return;
    setIsSubmittingEnterprise(true);
    try {
      await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: entName,
          email: entEmail,
          company: entCompany,
          position: entPosition,
          employeeCount: entEmployees,
          message: entMessage,
          selectedCourses: selectedCourses.map(sc => sc.title),
          leadType: "enterprise",
        }),
      });
      setEnterpriseSuccess(true);
    } catch (err) {
      alert("Error al enviar la solicitud.");
    } finally {
      setIsSubmittingEnterprise(false);
    }
  };

  return (
    <section className="relative -mt-20 lg:-mt-24 pt-28 lg:pt-36 pb-20 lg:pb-32 min-h-screen" style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 60%)" }}>
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-5 lg:px-10 relative z-10">
        {/* Back link */}
        <Link href="/cursos" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 font-medium mb-6 no-underline transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        {/* Header */}
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-blue-50 text-[#1890FF] font-black text-xs tracking-widest uppercase px-5 py-2.5 rounded-full border border-blue-100 mb-4">
              <ShoppingCart size={14} /> Inscripción
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] mb-4 tracking-tight">
              Selecciona tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">Cursos</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-[600px] mx-auto">
              Elige los cursos que deseas, revisa las fechas disponibles y completa tu inscripción.
            </p>
          </div>
        </FadeIn>

        {/* Mode Toggle */}
        <FadeIn delay={0.1}>
          <div className="flex justify-center mb-10">
            <div className="bg-white border border-gray-200 p-1.5 rounded-full inline-flex items-center shadow-sm">
              <button
                onClick={() => setMode("individual")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${mode === "individual" ? "bg-[#0F172A] text-white shadow-md" : "text-gray-500 hover:text-gray-800"}`}
              >
                <User className="w-4 h-4" /> Compra Individual
              </button>
              <button
                onClick={() => setMode("enterprise")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${mode === "enterprise" ? "bg-[#0F172A] text-white shadow-md" : "text-gray-500 hover:text-gray-800"}`}
              >
                <Building2 className="w-4 h-4" /> Cotización Empresa
              </button>
            </div>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: Course Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* ═══ COURSES WITH DATES ═══ */}
            <FadeIn delay={0.15}>
              <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden" style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.06)" }}>
                <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#0F172A] text-lg">Cursos con Fecha Disponible</h2>
                    <p className="text-xs text-gray-400">Selecciona los cursos que deseas inscribirte</p>
                  </div>
                </div>

                {loadingSchedules ? (
                  <div className="p-10 flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    <span className="text-sm text-gray-400">Cargando horarios...</span>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {/* Individual courses */}
                    {coursesWithDates.individual.map(({ course, level, schedule, slug }) => {
                      const checked = isSelected(slug, "Básico");
                      const price = level?.price || 249000;
                      return (
                        <label key={slug} className={`group flex items-center gap-4 px-8 py-5 cursor-pointer transition-all hover:bg-blue-50/30 ${checked ? "bg-blue-50/50" : ""}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCourse(slug, "Básico", price, course.title)}
                            className="w-5 h-5 rounded-lg border-gray-300 text-[#1890FF] focus:ring-[#1890FF] focus:ring-offset-0 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-[#0F172A] text-sm">{course.title}</span>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Básico</span>
                            </div>
                            {schedule ? (
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#1890FF]" /> Inicio: {formatScheduleDate(schedule.start_date)}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {schedule.schedule_days} · {schedule.schedule_time}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {schedule.duration_hours}h Online</span>
                              </div>
                            ) : (
                              <span className="text-xs text-amber-600 font-medium">Fecha por confirmar</span>
                            )}
                          </div>
                          {mode === "individual" && (
                            <span className={`font-black text-lg whitespace-nowrap ${checked ? "text-[#1890FF]" : "text-[#0F172A]"}`}>
                              {formatCLP(price)}
                            </span>
                          )}
                        </label>
                      );
                    })}

                    {/* Análisis de Datos */}
                    {coursesWithDates.analisisDeDatos && (() => {
                      const { course, level, schedule } = coursesWithDates.analisisDeDatos!;
                      const checked = isSelected(course.slug, "Básico");
                      return (
                        <label className={`group flex items-center gap-4 px-8 py-5 cursor-pointer transition-all hover:bg-blue-50/30 ${checked ? "bg-blue-50/50" : ""}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCourse(course.slug, "Básico", level.price || 498000, course.title)}
                            className="w-5 h-5 rounded-lg border-gray-300 text-[#1890FF] focus:ring-[#1890FF] focus:ring-offset-0 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-[#0F172A] text-sm">{course.title}</span>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">SQL + Power BI + Python</span>
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">MÁS POPULAR</span>
                            </div>
                            {schedule ? (
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#1890FF]" /> Próximo inicio: {formatScheduleDate(schedule.start_date)}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 144h totales · 3 niveles</span>
                              </div>
                            ) : (
                              <span className="text-xs text-amber-600 font-medium">Inicia con el próximo curso disponible</span>
                            )}
                          </div>
                          {mode === "individual" && (
                            <span className={`font-black text-lg whitespace-nowrap ${checked ? "text-[#1890FF]" : "text-[#0F172A]"}`}>
                              {formatCLP(level.price || 498000)}
                            </span>
                          )}
                        </label>
                      );
                    })()}
                  </div>
                )}
              </div>
            </FadeIn>

            {/* ═══ COURSES WITHOUT DATES (Notify me) ═══ */}
            <FadeIn delay={0.2}>
              <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden" style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.04)" }}>
                <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#0F172A] text-lg">Próximamente</h2>
                    <p className="text-xs text-gray-400">Regístrate para recibir aviso cuando se abran inscripciones</p>
                  </div>
                </div>

                <div className="divide-y divide-gray-50">
                  {coursesWithoutDates.map(course => {
                    const key = `${course.slug}-general`;
                    const isNotified = notifySuccess.has(key);
                    const isNotifying = notifyLoading === key;
                    return (
                      <div key={course.slug} className="flex items-center gap-4 px-8 py-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${course.accentColor}15` }}>
                          <span className="text-lg">{course.icon === "Brain" ? "🧠" : course.icon === "Sparkles" ? "✨" : course.icon === "Zap" ? "⚡" : course.icon === "HardHat" ? "⛏️" : course.icon === "TrendingUp" ? "📈" : "📚"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-sm text-[#0F172A]">{course.title}</span>
                          <p className="text-xs text-gray-400 line-clamp-1">{course.shortDescription}</p>
                        </div>
                        <button
                          onClick={() => handleNotifyMe(course.slug, "General")}
                          disabled={isNotified || isNotifying}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border-none cursor-pointer ${
                            isNotified
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-amber-700"
                          }`}
                        >
                          {isNotifying ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : isNotified ? (
                            <><CheckCircle2 className="w-3.5 h-3.5" /> ¡Registrado!</>
                          ) : (
                            <><Bell className="w-3.5 h-3.5" /> Avísame próxima fecha</>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT: Summary / Enterprise Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                {mode === "individual" ? (
                  <motion.div
                    key="individual"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden"
                    style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.08)" }}
                  >
                    <div className="px-8 py-6 border-b border-gray-100">
                      <h3 className="font-bold text-[#0F172A] text-lg flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-[#1890FF]" /> Resumen
                      </h3>
                    </div>
                    <div className="p-8">
                      {selectedCourses.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingCart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                          <p className="text-sm text-gray-400">Selecciona al menos un curso para continuar</p>
                        </div>
                      ) : (
                        <div className="space-y-3 mb-6">
                          {selectedCourses.map(sc => (
                            <div key={`${sc.slug}-${sc.levelName}`} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleCourse(sc.slug, sc.levelName, sc.price, sc.title)}
                                  className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors border-none cursor-pointer bg-transparent"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                <div>
                                  <span className="text-sm font-semibold text-gray-800">{sc.title}</span>
                                  <span className="text-[10px] text-gray-400 block">{sc.levelName}</span>
                                </div>
                              </div>
                              <span className="font-bold text-sm text-[#0F172A]">{formatCLP(sc.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedCourses.length > 0 && (
                        <>
                          <div className="flex justify-between items-center py-4 border-t-2 border-dashed border-gray-200 mb-6">
                            <span className="font-bold text-gray-600">Total</span>
                            <span className="font-black text-2xl text-[#1890FF]">{formatCLP(totalPrice)}</span>
                          </div>

                          <motion.button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full py-4 rounded-2xl text-white font-bold text-base flex justify-center items-center gap-2 transition-all disabled:opacity-60 border-none cursor-pointer"
                            style={{ background: "linear-gradient(135deg, #1890FF, #0050b3)", boxShadow: "0 10px 30px -5px rgba(24,144,255,0.35)" }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isCheckingOut ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <><ShoppingCart className="w-5 h-5" /> Proceder al Pago</>
                            )}
                          </motion.button>

                          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            <span>Pago seguro con Flow · Acceso de por vida</span>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="enterprise"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden"
                    style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.08)" }}
                  >
                    <div className="px-8 py-6 border-b border-gray-100">
                      <h3 className="font-bold text-[#0F172A] text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-600" /> Cotización Empresa
                      </h3>
                    </div>
                    <div className="p-8">
                      {enterpriseSuccess ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 text-3xl">✓</div>
                          <h3 className="text-lg font-black text-gray-900 mb-2">¡Solicitud Enviada!</h3>
                          <p className="text-sm text-gray-500">Te contactaremos en less de 24 horas con una cotización personalizada.</p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleEnterpriseSubmit} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Nombre *</label>
                            <input type="text" required value={entName} onChange={e => setEntName(e.target.value)}
                              placeholder="Tu nombre completo"
                              className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Email corporativo *</label>
                            <input type="email" required value={entEmail} onChange={e => setEntEmail(e.target.value)}
                              placeholder="contacto@empresa.com"
                              className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Empresa *</label>
                            <input type="text" required value={entCompany} onChange={e => setEntCompany(e.target.value)}
                              placeholder="Nombre de la empresa"
                              className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Cargo</label>
                              <input type="text" value={entPosition} onChange={e => setEntPosition(e.target.value)}
                                placeholder="Ej: Gerente TI"
                                className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">N° Personas</label>
                              <input type="number" min="1" value={entEmployees} onChange={e => setEntEmployees(e.target.value)}
                                placeholder="10"
                                className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                            </div>
                          </div>

                          {selectedCourses.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-3">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cursos seleccionados:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedCourses.map(sc => (
                                  <span key={`${sc.slug}-${sc.levelName}`} className="text-[11px] font-bold bg-blue-50 text-[#1890FF] px-2 py-1 rounded-lg">{sc.title}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Mensaje (Opcional)</label>
                            <textarea rows={2} value={entMessage} onChange={e => setEntMessage(e.target.value)}
                              placeholder="Detalle de requerimientos..."
                              className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none" />
                          </div>

                          <motion.button
                            type="submit"
                            disabled={isSubmittingEnterprise}
                            className="w-full py-4 rounded-2xl text-white font-bold text-sm flex justify-center items-center gap-2 transition-all disabled:opacity-60 border-none cursor-pointer"
                            style={{ background: "linear-gradient(135deg, #6366F1, #4338CA)", boxShadow: "0 10px 30px -5px rgba(99,102,241,0.35)" }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isSubmittingEnterprise ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <><Building2 className="w-4 h-4" /> Solicitar Cotización</>
                            )}
                          </motion.button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
