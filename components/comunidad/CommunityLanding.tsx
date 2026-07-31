"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  Clock,
  Code2,
  Flame,
  GraduationCap,
  Heart,
  MessageSquare,
  Play,
  Radio,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Video,
  Zap,
} from "lucide-react";
import AuthModal from "@/components/shared/AuthModal";
import LogoSlider from "@/components/marketing/LogoSlider";
import { SUBSCRIPTIONS_ENABLED } from "@/lib/data/community-flags";
import { communityPlans } from "@/lib/data/community_plans";
import { testimonials } from "@/lib/data/testimonials";

/* ─── Motion helpers ─── */
const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

/** Full screenshot without side crop (contain + natural height). */
function ProductShot({
  src,
  alt,
  priority = false,
  chrome = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  chrome?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.22)]">
      {chrome && (
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="ml-2 text-[11px] font-semibold text-slate-400">Campus ProgramBI</span>
        </div>
      )}
      <div className="bg-slate-50">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          className="h-auto w-full object-contain object-center"
          priority={priority}
          unoptimized
          sizes="(max-width: 1024px) 100vw, 560px"
        />
      </div>
    </div>
  );
}

/* ─── Content ─── */
const pillars = [
  {
    icon: Target,
    title: "Practica",
    body: "Ruta estilo Duolingo: niveles, XP, rachas y ejercicios interactivos de datos.",
    tone: "bg-[#1890FF] text-white",
  },
  {
    icon: Video,
    title: "Clases en vivo",
    body: "Masterclasses semanales con casos reales de SQL, Python y Power BI.",
    tone: "bg-white text-slate-900 border border-slate-200",
  },
  {
    icon: Bot,
    title: "Mentor IA",
    body: "Resuelve dudas de código y optimiza consultas cuando lo necesites.",
    tone: "bg-slate-950 text-white",
  },
  {
    icon: Users,
    title: "Comunidad",
    body: "Networking, muro de proyectos y apoyo entre analistas de datos.",
    tone: "bg-slate-100 text-slate-900",
  },
];

const practiceTracks = [
  { name: "Power BI", color: "#F2C811" },
  { name: "SQL Server", color: "#CC2927" },
  { name: "Python", color: "#3776AB" },
  { name: "Excel", color: "#217346" },
  { name: "IA", color: "#8B5CF6" },
];

const practiceFeatures = [
  {
    icon: Target,
    title: "Ruta de niveles",
    body: "Avanza lección a lección con desbloqueo progresivo, como en Duolingo.",
  },
  {
    icon: Heart,
    title: "Corazones y feedback",
    body: "Practica sin miedo a equivocarte: feedback al instante y explicación de cada respuesta.",
  },
  {
    icon: Flame,
    title: "Meta diaria y XP",
    body: "Elige tu ritmo (5 a 25 min) y construye hábito con puntos de experiencia.",
  },
  {
    icon: BookOpen,
    title: "Ejercicios reales",
    body: "Opción múltiple, emparejar, ordenar SQL, rellenar espacios y más.",
  },
];

const stack = [
  { name: "Power BI", icon: "https://cdn.simpleicons.org/powerbi/1890FF" },
  { name: "SQL Server", icon: "https://cdn.simpleicons.org/microsoftsqlserver/CC2927" },
  { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "Excel", icon: "https://cdn.simpleicons.org/microsoftexcel/217346" },
];

const steps = [
  {
    n: "01",
    title: "Crea tu cuenta",
    body: "Regístrate en menos de un minuto. Sin tarjeta de crédito.",
  },
  {
    n: "02",
    title: "Entra al campus",
    body: "Mira clases gratuitas y elige tu track de práctica (SQL, BI, Python…).",
  },
  {
    n: "03",
    title: "Practica y sube de nivel",
    body: "Completa ejercicios interactivos, gana XP y avanza en la ruta.",
  },
];

const faqs = [
  {
    q: "¿Puedo entrar sin suscribirme?",
    a: "Sí. Las suscripciones estarán disponibles próximamente. Mientras tanto puedes crear tu cuenta, ver clases gratuitas y usar el módulo Practica.",
  },
  {
    q: "¿Qué es Practica?",
    a: "Es un módulo estilo Duolingo dentro de la comunidad: rutas por Power BI, SQL, Python, Excel e IA, con niveles, XP, metas diarias y ejercicios interactivos (opción múltiple, emparejar, ordenar consultas y más).",
  },
  {
    q: "¿Qué incluye la comunidad cuando abran las membresías?",
    a: "Clases en vivo, grabaciones, material de estudio, mentoría con IA, Practica, muro de la comunidad y descuentos en cursos individuales.",
  },
  {
    q: "¿Las clases gratuitas son de verdad gratuitas?",
    a: "Sí. Las marcamos desde el panel admin y cualquier usuario con cuenta puede reproducirlas. El resto del contenido se desbloquea con la membresía.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No. Practica y las rutas del campus tienen caminos desde cero y también material avanzado.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Cuando las suscripciones estén activas, podrás gestionar o cancelar tu plan desde tu perfil sin llamadas ni trámites.",
  },
];

interface Props {
  isLoggedIn: boolean;
}

function TestimonialsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const isPausedRef = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    isPausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const SPEED = 0.55;
    function tick() {
      if (track && !isPausedRef.current) {
        track.scrollLeft += SPEED;
        const half = track.scrollWidth / 2;
        if (track.scrollLeft >= half) track.scrollLeft -= half;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const items = [...testimonials, ...testimonials];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((t, i) => {
          const initials = t.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2);
          return (
            <article
              key={`${t.name}-${i}`}
              className="w-[300px] shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:w-[320px]"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1890FF]/10 text-xs font-black text-[#1890FF]">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="truncate text-[11px] font-medium text-slate-400">{t.role}</p>
                </div>
              </div>
              <div className="mb-2 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                ))}
              </div>
              <p className="line-clamp-5 text-[13px] leading-relaxed text-slate-600">
                “{t.message}”
              </p>
            </article>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#FAFBFC] to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#FAFBFC] to-transparent sm:w-16" />
    </div>
  );
}

export default function CommunityLanding({ isLoggedIn }: Props) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authRedirect, setAuthRedirect] = useState("/comunidad/cursos");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const goTo = (path: string) => {
    if (isLoggedIn) {
      window.location.href = path;
    } else {
      setAuthRedirect(path);
      setAuthOpen(true);
    }
  };

  const goCampus = () => goTo("/comunidad/cursos");
  const goPractice = () => goTo("/comunidad/practicar");

  return (
    <div className="bg-[#FAFBFC] text-slate-900 antialiased">
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab="register"
        redirectUrl={authRedirect}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(24,144,255,0.08),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

        <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-20 sm:pt-24 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-20 lg:pt-28">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#1890FF]" />
              Comunidad de datos
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="font-display max-w-[16ch] text-[2.35rem] font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.25rem]"
            >
              El campus para{" "}
              <span className="text-[#1890FF]">dominar los datos</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-5 max-w-[42ch] text-base leading-relaxed text-slate-500 sm:text-lg"
            >
              Clases reales, mentor IA y Practica estilo Duolingo para SQL, Power BI, Python y Excel.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={goCampus}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1890FF] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(24,144,255,0.55)] transition hover:bg-[#0d7de0] active:scale-[0.98] border-0 cursor-pointer"
              >
                Acceder al campus
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={goPractice}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-300 active:scale-[0.98] border-solid cursor-pointer"
              >
                <Target className="h-4 w-4 text-[#1890FF]" />
                Probar Practica
              </button>
            </motion.div>

            {!SUBSCRIPTIONS_ENABLED && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-400"
              >
                <Clock className="h-3.5 w-3.5" />
                Suscripciones próximamente
              </motion.p>
            )}

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-slate-500"
            >
              {["Clases gratuitas", "Practica interactiva", "Sin tarjeta"].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#1890FF]" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Product visual — full image, no side crop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative lg:col-span-6"
          >
            <ProductShot
              src="https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-053709.png"
              alt="Vista del campus y dashboard Power BI"
              priority
              chrome
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stack</p>
                <p className="text-sm font-bold text-slate-900">Power BI · SQL · Python</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nuevo</p>
                <p className="text-sm font-bold text-slate-900">Practica · estilo Duolingo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ LOGOS (carrusel como home) ═══ */}
      <LogoSlider />

      {/* ═══ PILLARS / BENTO ═══ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <motion.div {...fadeUp} className="mb-12 max-w-2xl">
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-500 sm:text-lg">
              Un ecosistema pensado para aprender con práctica real, no con teoría suelta.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                  className={`rounded-2xl p-6 ${p.tone}`}
                >
                  <div
                    className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${
                      p.tone.includes("bg-white") || p.tone.includes("bg-slate-100")
                        ? "bg-slate-900/5"
                        : "bg-white/15"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      p.tone.includes("text-white") ? "text-white/80" : "text-slate-500"
                    }`}
                  >
                    {p.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FEATURE DEEP DIVE ═══ */}
      <section className="border-y border-slate-200/80 bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <motion.div {...fadeUp}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1890FF]">
              <Radio className="h-3.5 w-3.5" />
              En vivo
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Clases 100% prácticas con casos de negocio
            </h2>
            <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-slate-500">
              No solo miras teoría. Practicas en tiempo real con las herramientas que usan las empresas y resuelves dudas al instante.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Masterclasses semanales con expertos",
                "SQL, Python y Power BI en vivo",
                "Feedback inmediato del profesor",
                "Grabaciones disponibles después",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1890FF]/10">
                    <Check className="h-3 w-3 text-[#1890FF]" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeUp} className="relative">
            <ProductShot
              src="https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-053922.png"
              alt="Material y modelado de datos en el campus"
            />
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <Play className="h-4 w-4 text-[#1890FF]" />
              <span className="text-xs font-bold text-slate-800">Sesión y material del campus</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ PRACTICA (Duolingo-style) ═══ */}
      <section id="practica" className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(24,144,255,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-[1180px] px-5 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
            <motion.div {...fadeUp} className="lg:col-span-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                <Flame className="h-3.5 w-3.5" />
                Nuevo en el campus
              </div>
              <h2 className="font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Practica como un juego,{" "}
                <span className="text-[#1890FF]">aprende de verdad</span>
              </h2>
              <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-slate-500">
                Módulo interactivo estilo Duolingo: elige un track, completa niveles, gana XP y refuerza SQL, Power BI, Python, Excel e IA con ejercicios cortos.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {practiceFeatures.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.title}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#1890FF]/10 text-[#1890FF]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-950">{f.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.body}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {practiceTracks.map((t) => (
                  <span
                    key={t.name}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    {t.name}
                  </span>
                ))}
              </div>

              <button
                onClick={goPractice}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#1890FF] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(24,144,255,0.45)] transition hover:bg-[#0d7de0] active:scale-[0.98] border-0 cursor-pointer"
              >
                Empezar a practicar
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Path preview mock */}
            <motion.div {...fadeUp} className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.2)] sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Tu ruta
                    </p>
                    <p className="text-lg font-black text-slate-950">SQL Server · Nivel 3</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600">
                      <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> 5
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                      <Zap className="h-3.5 w-3.5" /> 120 XP
                    </span>
                  </div>
                </div>

                <div className="relative mx-auto flex max-w-[280px] flex-col items-center gap-5 py-2">
                  {[
                    { label: "SELECT básico", done: true, kind: "done" as const },
                    { label: "WHERE y filtros", done: true, kind: "done" as const },
                    { label: "JOINs", done: false, kind: "active" as const },
                    { label: "GROUP BY", done: false, kind: "locked" as const },
                    { label: "Checkpoint", done: false, kind: "trophy" as const },
                  ].map((node, i) => (
                    <div key={node.label} className="relative flex w-full flex-col items-center">
                      {i > 0 && (
                        <div className="absolute -top-5 h-5 w-0.5 bg-slate-200" />
                      )}
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full border-4 shadow-sm ${
                          node.kind === "done"
                            ? "border-emerald-400 bg-emerald-500 text-white"
                            : node.kind === "active"
                              ? "border-[#1890FF] bg-[#1890FF] text-white ring-4 ring-[#1890FF]/20"
                              : node.kind === "trophy"
                                ? "border-amber-300 bg-amber-100 text-amber-700"
                                : "border-slate-200 bg-slate-100 text-slate-400"
                        }`}
                      >
                        {node.kind === "done" ? (
                          <Check className="h-6 w-6" strokeWidth={2.5} />
                        ) : node.kind === "trophy" ? (
                          <Trophy className="h-5 w-5" />
                        ) : node.kind === "active" ? (
                          <Star className="h-5 w-5 fill-white" />
                        ) : (
                          <span className="text-sm font-black">{i + 1}</span>
                        )}
                      </div>
                      <p
                        className={`mt-2 text-center text-xs font-bold ${
                          node.kind === "locked" ? "text-slate-400" : "text-slate-800"
                        }`}
                      >
                        {node.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Ejemplo de ejercicio
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    ¿Qué JOIN devuelve solo filas con coincidencia en ambas tablas?
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {["INNER JOIN", "LEFT JOIN", "FULL JOIN", "CROSS JOIN"].map((opt, i) => (
                      <div
                        key={opt}
                        className={`rounded-xl border px-3 py-2 text-center text-xs font-bold ${
                          i === 0
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ MENTOR IA (feature principal) ═══ */}
      <section className="relative overflow-hidden border-y border-slate-200/80 bg-white py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(24,144,255,0.07),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <motion.div {...fadeUp}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1890FF]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1890FF]">
              <Sparkles className="h-3.5 w-3.5" />
              Mentor IA 24/7
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Mentor IA especializado{" "}
              <span className="text-[#1890FF]">en datos</span>
            </h2>
            <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-slate-500">
              No es un chat genérico. Está entrenado para SQL, Python, Power BI y DAX: te ayuda a destrabar ejercicios, corregir código y entender el porqué de cada solución.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Genera y explica consultas SQL y scripts de Python",
                "Corrige errores y sugiere mejores prácticas",
                "Aclara conceptos de modelado, DAX y visualización",
                "Disponible cuando practicas, sin esperar al próximo live",
                "Ideal para reforzar lo visto en clase o en Practica",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1890FF]/10">
                    <Check className="h-3 w-3 text-[#1890FF]" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={goCampus}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] border-0 cursor-pointer"
            >
              Probar en el campus
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          <motion.div {...fadeUp} className="relative">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.22)]">
              <Image
                src="https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-054229.png"
                alt="Mentor IA especializado en datos en el campus ProgramBI"
                width={1400}
                height={900}
                className="h-auto w-full object-contain"
                unoptimized
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                <MessageSquare className="h-3.5 w-3.5 text-[#1890FF]" />
                Chat de estudio
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                <Code2 className="h-3.5 w-3.5 text-[#1890FF]" />
                SQL · Python · DAX
              </span>
            </div>
          </motion.div>
        </div>

        {/* Material secundario */}
        <div className="relative mx-auto mt-14 max-w-[1180px] px-5 lg:px-8">
          <motion.div
            {...fadeUp}
            className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white sm:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Material completo a tu ritmo</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Clases grabadas, guías, datasets y ejercicios. Estudia cuando puedas sin perder el hilo.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {stack.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.icon} alt="" className="h-4 w-4" />
                    <span className="text-xs font-semibold text-slate-200">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="border-y border-slate-200/80 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <motion.div {...fadeUp} className="mb-12 max-w-xl">
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Cómo empezar
            </h2>
            <p className="mt-3 text-base text-slate-500">
              Tres pasos. Sin fricción.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="relative rounded-2xl border border-slate-200 bg-[#FAFBFC] p-6"
              >
                <span className="font-display text-3xl font-black text-[#1890FF]/20">
                  {step.n}
                </span>
                <h3 className="mt-3 text-lg font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.body}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute right-4 top-8 hidden h-4 w-4 text-slate-300 md:block lg:-right-3 lg:top-1/2 lg:-translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLANES (estilo SubscriptionGate, sin precio) ═══ */}
      <section id="membresia" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
          <motion.div {...fadeUp} className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-lg shadow-blue-500/25">
              Suscripciones próximamente
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
              Membresía{" "}
              <span className="bg-gradient-to-r from-[#1890FF] to-indigo-600 bg-clip-text text-transparent">
                ProgramBI
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-relaxed text-slate-500">
              Elige el plan que se adapte a ti. Por ahora no se puede suscribir: los botones dicen próximamente.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {communityPlans.map((plan, i) => {
              const isHighlight = !!plan.highlight;
              return (
                <motion.div
                  key={plan.id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                  className={`relative flex h-full flex-col rounded-[2.5rem] border transition-all duration-500 ${
                    isHighlight
                      ? "z-20 scale-[1.02] border-blue-500/80 bg-white shadow-[0_30px_60px_-15px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/30"
                      : "z-10 scale-[0.98] border-slate-200/90 bg-slate-50/80 shadow-sm hover:scale-[0.99] hover:border-slate-300/80 hover:bg-white hover:shadow-md"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30">
                      <Star className="h-3 w-3 fill-white text-white" />
                      {plan.highlight}
                    </div>
                  )}

                  <div className="relative z-10 flex h-full flex-col p-6 pt-10 lg:p-8">
                    <div className="mb-6">
                      <h3 className="mb-2.5 text-xl font-black tracking-tight text-slate-900 lg:text-2xl">
                        {plan.name}
                      </h3>
                      <p className="text-xs font-medium leading-snug text-slate-500 md:text-sm">
                        {plan.description}
                      </p>
                    </div>

                    {/* Espacio donde antes iba el precio — badge nivel de acceso */}
                    <div className="mb-6 border-b border-slate-100 pb-6">
                      <div className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-600">
                        Nivel {plan.courseAccessLevel}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-400">
                        Suscripción disponible próximamente
                      </p>
                    </div>

                    <div className="mb-8 flex-grow space-y-3">
                      <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Beneficios incluidos
                      </p>
                      {plan.features.map((feature) => {
                        const clean = feature.replace(/^✓\s*|^💬\s*|^🎓\s*/u, "");
                        const isSpecial =
                          feature.startsWith("✓") ||
                          feature.startsWith("💬") ||
                          feature.startsWith("🎓");
                        return (
                          <div key={feature} className="group/item flex items-start gap-3">
                            <div
                              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover/item:scale-110"
                              style={{ backgroundColor: `${plan.color}18` }}
                            >
                              <Check
                                className="h-3 w-3 font-bold"
                                style={{ color: plan.color }}
                                strokeWidth={2.5}
                              />
                            </div>
                            <span
                              className={`text-[13px] leading-snug transition-colors md:text-sm ${
                                isSpecial
                                  ? "font-bold text-slate-900"
                                  : "font-medium text-slate-600"
                              }`}
                            >
                              {clean}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-auto">
                      <button
                        type="button"
                        disabled
                        className={`flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black transition-all ${
                          isHighlight
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white/90 opacity-90 shadow-md shadow-blue-500/20"
                            : "border border-slate-200/80 bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        Próximamente
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            {...fadeUp}
            className="mt-12 flex flex-col items-center justify-between gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-6 py-6 sm:flex-row sm:px-8"
          >
            <div className="text-center sm:text-left">
              <p className="text-sm font-black text-slate-900">Disponible ahora sin suscripción</p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Clases gratuitas y módulo Practica con tu cuenta.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={goPractice}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-black text-white shadow-md shadow-blue-500/20 transition hover:opacity-95 border-0 cursor-pointer"
              >
                Ir a Practica
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={goCampus}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 border-solid cursor-pointer"
              >
                Ver cursos
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TESTIMONIOS ═══ */}
      <section className="border-y border-slate-200/80 bg-[#FAFBFC] py-20 lg:py-24">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <motion.div {...fadeUp} className="mb-10 max-w-xl">
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-950">
              Lo que dicen nuestros alumnos
            </h2>
            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              Historias reales de profesionales que se formaron con ProgramBI.
            </p>
          </motion.div>
        </div>
        <div className="mx-auto max-w-[1400px] px-0 sm:px-5 lg:px-8">
          <TestimonialsMarquee />
        </div>
      </section>

      {/* ═══ FOUNDER ═══ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 lg:grid-cols-12 lg:gap-14 lg:px-8">
          <motion.div {...fadeUp} className="relative lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <Image
                src="https://mail.programbi.com/uploads/gempages_519842279402243040-8ae05cd1-dc25-44fb-9a7b-f1a78a0f121a.webp_202606132329.jpeg"
                alt="Manuel Oliva, fundador de ProgramBI"
                width={560}
                height={680}
                className="h-auto w-full object-cover"
                unoptimized
              />
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="lg:col-span-7">
            <p className="text-sm font-bold text-[#1890FF]">Fundador</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Manuel Oliva
            </h2>
            <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-slate-500">
              Más de 15 años en banca, retail y minería. Diseñó ProgramBI para que profesionales de Latinoamérica aprendan datos con el mismo nivel de exigencia del mercado real.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Code2, label: "Consultor de datos" },
                { icon: Shield, label: "Casos reales de industria" },
                { icon: Users, label: "+5000 profesionales formados" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600"
                >
                  <item.icon className="h-3.5 w-3.5 text-[#1890FF]" />
                  {item.label}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 no-underline transition hover:text-[#1890FF]"
              >
                Conocer más sobre el equipo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="border-t border-slate-200/80 bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[760px] px-5 lg:px-8">
          <motion.div {...fadeUp} className="mb-10 text-center">
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-950">
              Preguntas frecuentes
            </h2>
            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              Respuestas claras antes de entrar al campus.
            </p>
          </motion.div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-[#FAFBFC]">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="px-5 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left border-0 bg-transparent cursor-pointer"
                  >
                    <span className="text-[15px] font-bold text-slate-900 sm:text-base">
                      {faq.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition ${
                        open
                          ? "border-[#1890FF] bg-[#1890FF] text-white"
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open && (
                    <p className="pb-5 text-sm leading-relaxed text-slate-500">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-3xl bg-slate-950 px-8 py-14 text-center text-white sm:px-12 sm:py-16"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(24,144,255,0.25),transparent_55%)]" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
                Empieza hoy en la comunidad
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
                {SUBSCRIPTIONS_ENABLED
                  ? "Accede al campus y elige el plan que mejor te acomode."
                  : "Suscripciones próximamente. Mientras tanto: clases gratis y Practica interactiva."}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={goCampus}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1890FF] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#0d7de0] active:scale-[0.98] border-0 cursor-pointer"
                >
                  Acceder al campus
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={goPractice}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10 border-solid cursor-pointer"
                >
                  <Target className="h-4 w-4" />
                  Ir a Practica
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
