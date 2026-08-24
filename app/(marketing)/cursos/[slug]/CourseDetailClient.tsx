"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import CourseImage from "@/components/shared/CourseImage";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Lock,
  MessageCircle,
} from "lucide-react";
import { type Course, courses } from "@/lib/data/courses";
import { founderImage } from "@/lib/data/images";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/shared/AuthModal";
import TemarioSection from "@/components/marketing/temario/TemarioSection";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import {
  type CourseSchedule,
  SCHEDULE_COUNTRIES,
  convertSchedule,
  getAllActiveSchedules,
  staticSchedules,
} from "@/lib/data/course-schedules";
import { useCountry } from "@/lib/context/CountryContext";
import {
  trackCourseView,
  trackCtaClick,
  trackWhatsAppClick,
} from "@/lib/analytics/marketing";

const PDF_URL =
  "https://drive.google.com/file/d/1EMO5s2Sre6EUMyaxW7JIjy24tEC5mCNz/view?usp=drive_link";

function formatSchedule(
  sch: CourseSchedule,
  timeZone: string
): { date: string; days: string; time: string } {
  const conv = convertSchedule(sch.start_date, sch.schedule_time, sch.schedule_days, timeZone);
  return {
    date: conv.dateFormatted.charAt(0).toUpperCase() + conv.dateFormatted.slice(1),
    days: conv.days,
    time: conv.time,
  };
}

export default function CourseDetailClient({ course }: { course: Course }) {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(0);
  const [isScheduleDropdownOpen, setIsScheduleDropdownOpen] = useState(false);
  const { country } = useCountry();
  const relatedCourses = courses.filter((c) => c.slug !== course.slug).slice(0, 3);
  const scheduleCountry = SCHEDULE_COUNTRIES.find((c) => c.code === country.iso) || SCHEDULE_COUNTRIES[0];

  const convertAndFormat = (priceCLP: number | null | undefined) => {
    if (!priceCLP) return "";
    if (country.currency.code === "CLP") {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }).format(priceCLP);
    }
    const converted = priceCLP * country.currency.rate;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: country.currency.code,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  const handleCheckoutCTA = async () => {
    trackCtaClick(isLoggedIn ? "Inscribirse" : "Registrarse", "course_detail_sidebar", {
      course_slug: course.slug,
    });

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

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
          leadType: "abandoned_cart",
        }),
      });
    } catch {
      /* lead is best-effort */
    }
    window.location.href = `/pago?curso=${course.slug}`;
  };

  useEffect(() => {
    trackCourseView(course.slug, course.title);
  }, [course.slug, course.title]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setIsLoggedIn(!!data.user);
      if (data.user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_plan, subscription_start_at")
            .eq("id", data.user.id)
            .single();
          if (profile) {
            setUserPlan(profile.subscription_plan);
            if (profile.subscription_start_at) {
              const daysSinceStart =
                (Date.now() - new Date(profile.subscription_start_at).getTime()) / (1000 * 60 * 60 * 24);
              if (daysSinceStart <= 7) setIsFreeTrial(true);
            }
          }
        } catch {
          /* profile optional */
        }
      }
      setCheckingAuth(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setIsLoggedIn(true);
        setShowAuthModal(false);
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    Promise.all([fetch("/api/schedules").then((r) => r.json()), fetch("/api/promotions").then((r) => r.json())])
      .then(([schData, promoData]) => {
        if (Array.isArray(schData)) setSchedules(schData);
        if (Array.isArray(promoData)) setPromotions(promoData);
      })
      .catch(console.error);
  }, []);

  const levels = course.levels || [];
  const activeLevel = levels[selectedLevel] || null;

  const levelSchedules = useMemo(() => {
    if (!activeLevel) return [];
    if (course.slug === "analisis-de-datos") {
      const adSchedules = schedules.filter(
        (s) => ["sql-server", "power-bi", "python"].includes(s.course_slug) && s.level_name === "Básico"
      );
      return getAllActiveSchedules(adSchedules);
    }
    const matched = schedules.filter((s) => {
      if (s.course_slug !== course.slug) return false;
      if (levels.length <= 1) return true;
      return s.level_name === activeLevel.name;
    });
    return getAllActiveSchedules(matched);
  }, [schedules, activeLevel, course.slug, levels.length]);

  const activeSchedulesList = useMemo(() => {
    if (levelSchedules.length > 0) return levelSchedules;
    const matchedStatic = staticSchedules.filter((s) => {
      if (s.course_slug !== course.slug) return false;
      if (levels.length <= 1) return true;
      return s.level_name === (activeLevel?.name || "Básico");
    });
    const now = new Date();
    const futureStatic = matchedStatic.filter((s) => new Date(s.start_date + "T12:00:00") >= now);
    if (futureStatic.length > 0) {
      return futureStatic.map((s, idx) => ({ ...s, id: `static-${idx}`, is_active: true }) as CourseSchedule);
    }
    return [];
  }, [levelSchedules, course.slug, activeLevel]);

  const levelSchedule = activeSchedulesList[selectedScheduleIndex] || activeSchedulesList[0] || null;

  useEffect(() => {
    setSelectedScheduleIndex(0);
  }, [selectedLevel, activeSchedulesList.length]);

  const rawPrice = activeLevel?.price || null;
  const baseOriginalPrice = activeLevel?.originalPrice || course.originalPrice || rawPrice;
  const applicablePromo = promotions.find(
    (p) =>
      p.target_type === "all" ||
      p.target_type === "courses" ||
      (p.target_type === "specific_course" && p.target_id === course.slug)
  );

  let promoDiscountedPrice = rawPrice;
  let promoOriginalPrice = rawPrice;
  let hasPromoDiscount = false;

  if (applicablePromo && rawPrice) {
    promoOriginalPrice = rawPrice;
    if (applicablePromo.promo_price) {
      promoDiscountedPrice = applicablePromo.promo_price;
      hasPromoDiscount = true;
    } else if (applicablePromo.discount_percentage) {
      promoDiscountedPrice = Math.round((rawPrice * (100 - applicablePromo.discount_percentage)) / 100);
      hasPromoDiscount = true;
    }
  }

  const isSpecialization =
    course.durationHours > 50 ||
    course.slug === "analisis-de-datos" ||
    course.slug === "analitica-mineria" ||
    course.slug === "analitica-financiera";
  let discPercent = 0;
  if (userPlan === "pro") discPercent = isSpecialization ? 10 : 20;
  else if (userPlan === "max") discPercent = isSpecialization ? 12.5 : 25;
  else if (userPlan === "ultra") discPercent = isSpecialization ? 20 : 40;

  const priceAfterPromo = hasPromoDiscount ? promoDiscountedPrice : rawPrice;
  const currentPrice = priceAfterPromo ? Math.floor(priceAfterPromo * (1 - discPercent / 100)) : null;
  const grandTotal = currentPrice;
  const effectiveOriginal = hasPromoDiscount ? promoOriginalPrice : baseOriginalPrice || rawPrice;
  const originalGrandTotal = effectiveOriginal;
  const totalDiscountPercentage =
    originalGrandTotal && grandTotal && originalGrandTotal > grandTotal
      ? Math.round(((originalGrandTotal - grandTotal) / originalGrandTotal) * 100)
      : 0;

  const hours = activeLevel?.durationHours || course.durationHours;
  const outcomes = activeLevel?.whatYouLearn?.length ? activeLevel.whatYouLearn : course.whatYouLearn;
  const nextStart = levelSchedule ? formatSchedule(levelSchedule, scheduleCountry.timeZone) : null;

  const includes = [
    "Clases en vivo por Zoom",
    hours ? `${hours} horas de formación` : "Formación en vivo",
    "Grabaciones de por vida en el campus",
    "Certificado al completar",
    "Proyectos con datos reales",
  ];

  return (
    <>
      <section className="bg-canvas px-4 pt-10 pb-16 sm:px-6 lg:px-8 lg:pt-14 lg:pb-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <nav className="mb-6 text-sm text-mute" aria-label="Migas">
              <Link href="/cursos" className="no-underline hover:text-ink">
                Cursos
              </Link>
              <span className="mx-2 text-faint">/</span>
              <span className="text-ink">{course.title}</span>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              {course.title}
            </h1>
            <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute sm:text-lg">
              {course.shortDescription}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mute">
              <li className="inline-flex items-center gap-1.5">
                <Clock size={15} /> {hours} h
              </li>
              <li>En vivo por Zoom</li>
              <li>Certificado</li>
              {levels.length > 1 ? <li>{levels.length} niveles</li> : null}
            </ul>

            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[26px] border border-line bg-wash">
              <CourseImage
                src={course.imageUrl}
                alt={course.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>

            {outcomes.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Qué vas a aprender</h2>
                <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                      <Check size={16} className="mt-0.5 shrink-0" strokeWidth={2.2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[26px] border border-line bg-paper p-5 shadow-[0_20px_60px_rgba(23,23,22,0.06)] sm:p-6 lg:sticky lg:top-24">
              {levels.length > 1 && (
                <div className="mb-5">
                  <p className="mb-2 text-sm font-medium text-ink">Nivel</p>
                  <div className="flex gap-1 rounded-full border border-line bg-wash p-1">
                    {levels.map((level, idx) => (
                      <button
                        key={`${level.name}-${idx}`}
                        type="button"
                        suppressHydrationWarning
                        onClick={() => setSelectedLevel(idx)}
                        className={`flex-1 rounded-full py-2 text-xs font-semibold sm:text-sm ${
                          selectedLevel === idx ? "bg-ink text-canvas" : "text-mute hover:text-ink"
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative mb-4">
                <p className="mb-2 text-sm font-medium text-ink">Próxima fecha</p>
                <button
                  type="button"
                  disabled={activeSchedulesList.length === 0}
                  onClick={() => setIsScheduleDropdownOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-line-strong bg-canvas px-3 py-3 text-left disabled:opacity-70"
                >
                  <span className="flex min-w-0 items-start gap-2.5">
                    <Calendar size={16} className="mt-0.5 shrink-0 text-ink" />
                    {nextStart ? (
                      <span>
                        <span className="block text-sm font-semibold text-ink">{nextStart.date}</span>
                        <span className="mt-0.5 block text-xs text-mute">
                          {nextStart.days} · {nextStart.time}
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm text-mute">Fecha por confirmar</span>
                    )}
                  </span>
                  {activeSchedulesList.length > 1 ? (
                    <ChevronDown size={16} className={`shrink-0 text-faint ${isScheduleDropdownOpen ? "rotate-180" : ""}`} />
                  ) : null}
                </button>

                <AnimatePresence>
                  {isScheduleDropdownOpen && activeSchedulesList.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsScheduleDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute left-0 right-0 z-40 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-line bg-paper py-1 shadow-[0_16px_40px_rgba(23,23,22,0.10)]"
                      >
                        {activeSchedulesList.map((sch, idx) => {
                          const conv = formatSchedule(sch, scheduleCountry.timeZone);
                          return (
                            <button
                              key={sch.id || idx}
                              type="button"
                              onClick={() => {
                                setSelectedScheduleIndex(idx);
                                setIsScheduleDropdownOpen(false);
                              }}
                              className={`flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm ${
                                selectedScheduleIndex === idx ? "bg-wash" : "hover:bg-wash"
                              }`}
                            >
                              <Clock size={14} className="mt-0.5 shrink-0" />
                              <span>
                                <span className="block font-semibold text-ink">{conv.date}</span>
                                <span className="text-xs text-mute">
                                  {conv.days} · {conv.time}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="mb-5 border-t border-line pt-5">
                {activeSchedulesList.length === 0 ? (
                  <p className="text-sm leading-relaxed text-mute">
                    {levels.length > 1
                      ? "Aún no hay una fecha abierta para este nivel. Escríbenos y te avisamos del próximo grupo."
                      : "Aún no hay una fecha abierta para este curso. Escríbenos y te avisamos del próximo grupo."}
                  </p>
                ) : checkingAuth ? (
                  <div className="h-10 w-40 rounded-lg bg-wash" />
                ) : isLoggedIn ? (
                  <div>
                    {originalGrandTotal && totalDiscountPercentage > 0 && (
                      <p className="text-sm text-faint">
                        <span className="line-through">{convertAndFormat(originalGrandTotal)}</span>
                        <span className="ml-2 font-semibold text-ink">{totalDiscountPercentage}% off</span>
                      </p>
                    )}
                    <p className="text-3xl font-bold tracking-tight text-ink">{convertAndFormat(grandTotal)}</p>
                    {levels.length > 1 ? <p className="mt-1 text-xs text-mute">Por nivel</p> : null}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="flex w-full items-start gap-3 rounded-xl border border-line bg-canvas px-3 py-3 text-left"
                  >
                    <Lock size={16} className="mt-0.5 shrink-0" />
                    <span>
                      <span className="block text-sm font-semibold text-ink">Ver precio</span>
                      <span className="mt-0.5 block text-xs text-mute">Crea una cuenta gratis para ver el valor y las becas.</span>
                    </span>
                  </button>
                )}
              </div>

              {activeSchedulesList.length === 0 ? (
                <a
                  href={`https://wa.me/56935409699?text=${encodeURIComponent(
                    `Hola! Me gustaría consultar las próximas fechas del curso ${course.title}${levels.length > 1 && activeLevel?.name ? ` - ${activeLevel.name}` : ""}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("course_detail_no_schedule", course.slug)}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-canvas no-underline"
                >
                  <MessageCircle size={16} />
                  Consultar fechas
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleCheckoutCTA}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
                >
                  {isLoggedIn ? "Inscribirse" : "Registrarse"}
                  <ArrowRight size={16} />
                </button>
              )}

              <ul className="mt-5 space-y-2 border-t border-line pt-5">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink">
                    <Check size={15} className="mt-0.5 shrink-0" strokeWidth={2.2} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-ink">
                <a href="#temario" className="inline-flex items-center gap-1.5 no-underline hover:text-mute">
                  <BookOpen size={15} /> Temario
                </a>
                <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 no-underline hover:text-mute">
                  <FileText size={15} /> Folleto
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <TemarioSection course={course} selectedLevel={selectedLevel} isFreeTrial={isFreeTrial} />

      <section className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-line bg-wash lg:col-span-4">
            <CourseImage src={founderImage} alt="Manuel Oliva, instructor de ProgramBI" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Instructor</h2>
            <p className="mt-2 text-lg font-semibold text-ink">Manuel Oliva</p>
            <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-mute">
              Magíster en Data Science (UAI). Ha liderado proyectos de datos en AngloAmerican, CAP, Deloitte y SQM, y
              formado a más de 5.000 profesionales en SQL, Power BI, Python e IA.
            </p>
          </div>
        </div>
      </section>

      <CourseContactForm course={course} />

      {relatedCourses.length > 0 && (
        <section className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Otros cursos</h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCourses.map((rc) => (
                <Link
                  key={rc.slug}
                  href={`/cursos/${rc.slug}`}
                  className="group overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-colors hover:border-ink/20"
                >
                  <div className="relative aspect-[16/10] bg-wash">
                    <CourseImage src={rc.imageUrl} alt={rc.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-lg font-bold tracking-tight text-ink">{rc.title}</p>
                    <p className="mt-1 text-sm text-mute">{rc.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="register" />
    </>
  );
}

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

  const fieldClass =
    "h-12 w-full rounded-xl border border-line-strong bg-paper px-3 text-base text-ink placeholder:text-faint";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const payload: Record<string, unknown> = {
        name: formData.get("name"),
        email: formData.get("email"),
        whatsapp: `${phonePrefix}${formData.get("whatsapp")}`,
        message: formData.get("message"),
        sourceCourse: course.title,
        leadType: contactType,
        ...getAntiBotFields(formLoadedAt.current, honeypot),
      };
      if (contactType === "empresa") {
        payload.company = formData.get("company");
        payload.position = formData.get("position");
        payload.employeeCount = formData.get("employeeCount");
        payload.selectedCourses = selectedServices;
      }
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error submitting form");
      setIsSuccess(true);
      if (contactType === "personal") {
        setTimeout(() => {
          window.location.href = `/pago?curso=${course.slug}`;
        }, 2500);
      }
    } catch {
      alert("Hubo un problema al enviar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPersonal = contactType === "personal";

  return (
    <section id="cotizar" className="border-t border-line bg-canvas">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        <div className="px-4 py-16 sm:px-6 lg:px-16 lg:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {isPersonal ? "Cotiza este curso" : "Para empresas"}
          </h2>
          <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-mute">
            {isPersonal
              ? "Te enviamos fechas, temario y opciones de pago."
              : "Programas in-company, dashboards y automatización para tu equipo."}
          </p>
        </div>

        <div className="border-t border-line px-4 py-16 sm:px-6 lg:border-t-0 lg:border-l lg:px-16 lg:py-24">
          {isSuccess ? (
            <p className="rounded-2xl border border-line bg-paper px-5 py-6 text-base text-ink">
              {isPersonal
                ? "Recibimos tu cotización. En un momento te llevamos al pago."
                : "Recibimos tu solicitud. Te escribimos con una propuesta."}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-[36rem] space-y-5" noValidate>
              <div className="flex gap-1 rounded-full border border-line bg-wash p-1">
                <button
                  type="button"
                  onClick={() => setContactType("personal")}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold ${isPersonal ? "bg-ink text-canvas" : "text-mute"}`}
                >
                  Particular
                </button>
                <button
                  type="button"
                  onClick={() => setContactType("empresa")}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold ${!isPersonal ? "bg-ink text-canvas" : "text-mute"}`}
                >
                  Empresa
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="course-name" className="text-sm font-medium text-ink">
                    Nombre
                  </label>
                  <input id="course-name" name="name" required autoComplete="name" className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="course-email" className="text-sm font-medium text-ink">
                    Email
                  </label>
                  <input id="course-email" name="email" type="email" required autoComplete="email" className={fieldClass} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="course-whatsapp" className="text-sm font-medium text-ink">
                  WhatsApp
                </label>
                <div className="flex">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPrefixDropdown((v) => !v)}
                      className="inline-flex h-12 items-center gap-1.5 rounded-l-xl border border-r-0 border-line-strong bg-paper px-3 text-sm text-ink"
                    >
                      {phonePrefix}
                      <ChevronDown size={14} className="text-faint" />
                    </button>
                    {showPrefixDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowPrefixDropdown(false)} />
                        <div className="absolute top-full left-0 z-20 mt-1 max-h-56 w-52 overflow-y-auto rounded-xl border border-line bg-paper py-1">
                          {COUNTRIES.map((c, idx) => (
                            <button
                              key={`${c.iso}-${idx}`}
                              type="button"
                              onClick={() => {
                                setPhonePrefix(c.code);
                                setShowPrefixDropdown(false);
                              }}
                              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ink hover:bg-wash"
                            >
                              <span>{c.name}</span>
                              <span className="text-mute">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <input
                    id="course-whatsapp"
                    name="whatsapp"
                    type="tel"
                    required
                    autoComplete="tel"
                    className="h-12 min-w-0 flex-1 rounded-r-xl border border-line-strong bg-paper px-3 text-base text-ink"
                  />
                </div>
              </div>

              {!isPersonal && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="company" className="text-sm font-medium text-ink">
                        Empresa
                      </label>
                      <input id="company" name="company" required className={fieldClass} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="position" className="text-sm font-medium text-ink">
                        Cargo
                      </label>
                      <input id="position" name="position" className={fieldClass} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="employeeCount" className="text-sm font-medium text-ink">
                        Personas
                      </label>
                      <input id="employeeCount" name="employeeCount" type="number" min={1} className={fieldClass} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-ink">Servicios</p>
                    <div className="flex flex-wrap gap-2">
                      {enterpriseServices.map((service) => {
                        const selected = selectedServices.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            onClick={() =>
                              setSelectedServices((prev) =>
                                prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
                              )
                            }
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              selected ? "bg-ink text-canvas" : "border border-line bg-paper text-ink"
                            }`}
                          >
                            {service}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="course-message" className="text-sm font-medium text-ink">
                  Mensaje <span className="font-normal text-mute">(opcional)</span>
                </label>
                <textarea
                  id="course-message"
                  name="message"
                  rows={4}
                  className="rounded-xl border border-line-strong bg-paper px-3 py-3 text-base text-ink"
                />
              </div>

              <div style={honeypotStyle} aria-hidden>
                <input
                  type="text"
                  name="_website"
                  autoComplete="off"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-base font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? "Enviando…" : isPersonal ? "Enviar" : "Solicitar propuesta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
