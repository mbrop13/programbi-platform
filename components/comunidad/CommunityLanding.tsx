"use client";

import { useState } from "react";
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
  GraduationCap,
  Play,
  Radio,
  Shield,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react";
import AuthModal from "@/components/shared/AuthModal";
import { companyLogos } from "@/lib/data/images";
import { SUBSCRIPTIONS_ENABLED } from "@/lib/data/community-flags";

/* ─── Motion helpers ─── */
const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

/* ─── Content ─── */
const pillars = [
  {
    icon: Video,
    title: "Clases en vivo",
    body: "Masterclasses semanales con casos reales de SQL, Python y Power BI.",
    tone: "bg-[#1890FF] text-white",
  },
  {
    icon: BookOpen,
    title: "Campus grabado",
    body: "Rutas estructuradas, material descargable y aulas interactivas 24/7.",
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
    body: "Accede a cursos y a las clases gratuitas publicadas por el equipo.",
  },
  {
    n: "03",
    title: "Practica y avanza",
    body: "Sigue las rutas, usa el mentor IA y participa de la comunidad.",
  },
];

const faqs = [
  {
    q: "¿Puedo entrar sin suscribirme?",
    a: "Sí. Las suscripciones estarán disponibles próximamente. Mientras tanto puedes crear tu cuenta y ver las clases gratuitas del campus.",
  },
  {
    q: "¿Qué incluye la comunidad cuando abran las membresías?",
    a: "Clases en vivo, grabaciones, material de estudio, mentoría con IA, muro de la comunidad y descuentos en cursos individuales.",
  },
  {
    q: "¿Las clases gratuitas son de verdad gratuitas?",
    a: "Sí. Las marcamos desde el panel admin y cualquier usuario con cuenta puede reproducirlas. El resto del contenido se desbloquea con la membresía.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No. Hay rutas desde cero y también material avanzado para quienes ya trabajan con datos.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Cuando las suscripciones estén activas, podrás gestionar o cancelar tu plan desde tu perfil sin llamadas ni trámites.",
  },
];

const quotes = [
  {
    text: "Tremenda propuesta de valor para el desarrollo laboral, recomendable 100%.",
    name: "Alexis Astudillo",
    role: "SQL Server · ProgramBI",
  },
  {
    text: "Power BI es una herramienta bastante necesaria y útil. Recomiendo ProgramBI con los ojos cerrados.",
    name: "Jorge Kaisarieh",
    role: "Diseño + BI",
  },
  {
    text: "Excelente tutoría. Completé Big Query y Looker Studio y lo recomiendo totalmente.",
    name: "Julio César Reyes",
    role: "Big Data",
  },
];

interface Props {
  isLoggedIn: boolean;
}

export default function CommunityLanding({ isLoggedIn }: Props) {
  const [authOpen, setAuthOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const goCampus = () => {
    if (isLoggedIn) {
      window.location.href = "/comunidad/cursos";
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <div className="bg-[#FAFBFC] text-slate-900 antialiased">
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab="register"
        redirectUrl="/comunidad/cursos"
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
              Aprende SQL, Power BI, Python y Excel con clases prácticas, mentoría IA y una comunidad profesional.
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

              {!SUBSCRIPTIONS_ENABLED ? (
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-semibold text-slate-500">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Suscripciones próximamente
                </span>
              ) : (
                <a
                  href="#membresia"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 no-underline transition hover:border-slate-300"
                >
                  Ver planes
                </a>
              )}
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-slate-500"
            >
              {["Clases gratuitas", "Sin tarjeta", "SQL · BI · Python · Excel"].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#1890FF]" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Product visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative lg:col-span-6"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="ml-2 text-[11px] font-semibold text-slate-400">Campus ProgramBI</span>
              </div>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-053709.png"
                  alt="Vista del campus y dashboard Power BI"
                  fill
                  className="object-cover object-top"
                  priority
                  unoptimized
                />
              </div>
            </div>

            <div className="absolute -bottom-4 left-4 right-4 flex gap-2 sm:left-auto sm:right-6 sm:w-auto">
              <div className="rounded-xl border border-white/80 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stack</p>
                <p className="text-sm font-bold text-slate-900">Power BI · SQL · Python</p>
              </div>
              <div className="hidden rounded-xl border border-white/80 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modo</p>
                <p className="text-sm font-bold text-slate-900">En vivo + a tu ritmo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ LOGOS ═══ */}
      <section className="border-b border-slate-200/70 bg-white py-10">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Profesionales de estas empresas confían en ProgramBI
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
            {companyLogos.slice(0, 8).map((logo) => (
              <Image
                key={logo.name}
                src={logo.url}
                alt={logo.name}
                width={100}
                height={32}
                className="h-7 w-auto object-contain grayscale"
                unoptimized
              />
            ))}
          </div>
        </div>
      </section>

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
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src="https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-053922.png"
                  alt="Material y modelado de datos en el campus"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="absolute -left-3 top-6 hidden rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-md sm:block">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-[#1890FF]" />
                <span className="text-xs font-bold text-slate-800">Sesión en curso</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ IA + MATERIAL (2-col equal, different from zigzag) ═══ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.article
              {...fadeUp}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/9] border-b border-slate-100">
                <Image
                  src="https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-054229.png"
                  alt="Asistente IA en el campus"
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              </div>
              <div className="p-7">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-950">
                  Mentor IA especializado en datos
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Genera SQL y Python, corrige errores y aclara conceptos cuando te trabas en un ejercicio.
                </p>
              </div>
            </motion.article>

            <motion.article
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.08 }}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-7 text-white shadow-sm lg:p-8"
            >
              <div>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  Material completo a tu ritmo
                </h3>
                <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-slate-400">
                  Clases grabadas, guías, datasets y ejercicios. Estudia cuando puedas sin perder el hilo.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {stack.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.icon} alt="" className="h-4 w-4" />
                    <span className="text-xs font-semibold text-slate-200">{s.name}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          </div>
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

      {/* ═══ MEMBERSHIP / FREE ACCESS ═══ */}
      <section id="membresia" className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)]">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="border-b border-slate-100 p-8 sm:p-10 lg:col-span-3 lg:border-b-0 lg:border-r">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  <Clock className="h-3.5 w-3.5" />
                  {SUBSCRIPTIONS_ENABLED ? "Membresía" : "Suscripciones próximamente"}
                </div>
                <h2 className="font-display text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {SUBSCRIPTIONS_ENABLED
                    ? "Elige el plan que se adapte a ti"
                    : "La membresía completa llega pronto"}
                </h2>
                <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-slate-500 sm:text-base">
                  {SUBSCRIPTIONS_ENABLED
                    ? "Acceso a clases en vivo, campus completo, IA y comunidad."
                    : "Estamos preparando los planes. Mientras tanto, entra al campus y aprovecha las clases gratuitas."}
                </p>

                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    "Clases en vivo semanales",
                    "Grabaciones y material",
                    "Mentor IA 24/7",
                    "Comunidad y networking",
                    "Descuentos en cursos",
                    "Rutas guiadas de aprendizaje",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                      <Check className="h-4 w-4 shrink-0 text-[#1890FF]" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-center bg-slate-50 p-8 sm:p-10 lg:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-1 flex items-center gap-2 text-[#1890FF]">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Disponible ahora</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">Clases gratuitas</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Crea tu cuenta y mira las lecciones gratuitas que publicamos desde el panel admin.
                  </p>
                  <button
                    onClick={goCampus}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1890FF] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#0d7de0] active:scale-[0.99] border-0 cursor-pointer"
                  >
                    {isLoggedIn ? "Ir a mis cursos" : "Crear cuenta gratis"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
                    Sin tarjeta · Acceso inmediato
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="border-y border-slate-200/80 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
          <motion.div {...fadeUp} className="mb-10 max-w-xl">
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-950">
              Lo que dicen nuestros alumnos
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {quotes.map((q, i) => (
              <motion.blockquote
                key={q.name}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className={`rounded-2xl border p-6 ${
                  i === 0
                    ? "border-[#1890FF]/20 bg-[#1890FF]/[0.04] md:col-span-1"
                    : "border-slate-200 bg-[#FAFBFC]"
                }`}
              >
                <p className="text-[15px] font-medium leading-relaxed text-slate-800">
                  “{q.text}”
                </p>
                <footer className="mt-5 border-t border-slate-200/80 pt-4">
                  <p className="text-sm font-bold text-slate-950">{q.name}</p>
                  <p className="text-xs font-medium text-slate-400">{q.role}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
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
                  : "Suscripciones próximamente. Mientras tanto, entra y mira las clases gratuitas."}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={goCampus}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1890FF] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#0d7de0] active:scale-[0.98] border-0 cursor-pointer"
                >
                  Acceder al campus
                  <ArrowRight className="h-4 w-4" />
                </button>
                {!SUBSCRIPTIONS_ENABLED && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-300">
                    Suscripciones próximamente
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
