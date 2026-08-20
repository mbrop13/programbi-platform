"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Users,
  Zap,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  Award,
  Clock,
  GraduationCap,
  Workflow,
  Quote,
  ArrowUpRight,
  Brain,
  Gauge,
  AlertTriangle,
  BadgeCheck,
  Layers,
  Timer,
  Lock,
} from "lucide-react";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
  CountUp,
} from "@/components/shared/AnimatedComponents";
import { courses } from "@/lib/data/courses";
import { casesOfUse } from "@/lib/data/cases";
import AsesoriasForm from "@/components/marketing/AsesoriasForm";
import LogoSlider from "@/components/marketing/LogoSlider";

/* ═══════════════════════════════════════════════════════════════
   DATA — narrativa B2B clara y escaneable
   ═══════════════════════════════════════════════════════════════ */

const stats = [
  { value: 50, suffix: "+", label: "Empresas" },
  { value: 5000, suffix: "+", label: "Profesionales formados" },
  { value: 200, suffix: "+", label: "Proyectos entregados" },
  { value: 98, suffix: "%", label: "Tasa de éxito" },
];

const pains = [
  {
    icon: AlertTriangle,
    title: "Dependencia de externos",
    text: "Pagas al consultor cada vez que cambia un filtro o un KPI.",
  },
  {
    icon: Timer,
    title: "Horas en Excel",
    text: "Días consolidados planillas a mano en lugar de analizar.",
  },
  {
    icon: Lock,
    title: "Conocimiento atrapado",
    text: "Una sola persona sabe armar los reportes críticos.",
  },
  {
    icon: Gauge,
    title: "Decisiones tarde",
    text: "Gerencia opera con datos de hace 2–4 semanas.",
  },
];

const gains = [
  {
    icon: BadgeCheck,
    title: "Equipos autónomos",
    text: "Tu gente crea y mantiene dashboards sin depender de terceros.",
  },
  {
    icon: Zap,
    title: "Reportes en minutos",
    text: "Automatización: de días de trabajo a actualizaciones en vivo.",
  },
  {
    icon: Layers,
    title: "Conocimiento distribuido",
    text: "Nadie es cuello de botella. El saber queda en la empresa.",
  },
  {
    icon: TrendingUp,
    title: "Decisiones con datos vivos",
    text: "Un solo punto de verdad para finanzas, ops y liderazgo.",
  },
];

const services = [
  {
    id: "capacitacion",
    icon: GraduationCap,
    title: "Capacitación corporativa",
    subtitle: "Formamos a tu equipo",
    description:
      "Programas en vivo, adaptados a tus datos y procesos reales. Tus colaboradores salen listos para crear dashboards, automatizar y analizar sin depender de externos.",
    points: [
      "Clases en vivo con mentores expertos",
      "Casos reales de tu industria",
      "Certificación y material de por vida",
      "Facturación y reportes de asistencia",
    ],
    cta: "Ver programas",
    href: "#programas",
    accent: "#1890FF",
  },
  {
    id: "implementacion",
    icon: Workflow,
    title: "Implementación & BI",
    subtitle: "Construimos la solución",
    description:
      "Diseñamos e implementamos dashboards, ETL, automatizaciones e IA sobre tus fuentes actuales. Entregamos y transferimos el conocimiento a tu equipo.",
    points: [
      "Power BI, SQL, Python y Power Automate",
      "Integración con ERP, CRM y APIs",
      "Gobernanza y seguridad (RLS)",
      "Soporte post-entrega y mejora continua",
    ],
    cta: "Agendar diagnóstico",
    href: "#contacto",
    accent: "#6366F1",
  },
];

const impact = [
  {
    value: 243,
    suffix: "%",
    label: "ROI promedio",
    desc: "Retorno en capacitación de datos en el primer año",
  },
  {
    value: 80,
    suffix: "%",
    label: "Menos trabajo manual",
    desc: "Tiempo liberado al automatizar reportes y ETL",
  },
  {
    value: 5,
    suffix: "x",
    label: "Decisiones más rápidas",
    desc: "Dashboards en vivo vs. reportes estáticos",
  },
  {
    value: 24,
    suffix: "%",
    label: "Menos rotación",
    desc: "Equipos que invierten en desarrollo profesional",
  },
];

const processSteps = [
  {
    n: "01",
    title: "Diagnóstico",
    desc: "Auditoría gratuita de datos, KPIs y procesos manuales.",
  },
  {
    n: "02",
    title: "Diseño",
    desc: "Roadmap con alcance, plazos y métricas de éxito.",
  },
  {
    n: "03",
    title: "Implementación",
    desc: "Dashboards, ETL y automatizaciones en sprints claros.",
  },
  {
    n: "04",
    title: "Capacitación",
    desc: "Formamos a tu equipo sobre lo construido.",
  },
  {
    n: "05",
    title: "Soporte",
    desc: "Acompañamiento y autonomía total del equipo interno.",
  },
];

const featuredSlugs = [
  "analisis-de-datos",
  "power-bi",
  "sql-server",
  "python",
  "power-automate",
  "machine-learning",
];

const featuredCourses = featuredSlugs
  .map((slug) => courses.find((c) => c.slug === slug))
  .filter(Boolean) as typeof courses;

const testimonials = [
  {
    quote:
      "Logramos retener a más del 80% del personal clave identificado con riesgo alto de rotación.",
    author: "Sofía Vergara",
    role: "Gerente de Gestión de Personas",
    tag: "People Analytics",
  },
  {
    quote:
      "Pasamos de un enfoque reactivo a anticipar la fuga de clientes con un modelo predictivo.",
    author: "Mariana Rojas",
    role: "Subgerente de Fidelización",
    tag: "Machine Learning",
  },
  {
    quote:
      "La automatización liberó al equipo de tareas repetitivas para enfocarse en análisis estratégico.",
    author: "Carolina Méndez",
    role: "Jefa de Finanzas & Control",
    tag: "Automatización",
  },
];

const faqs = [
  {
    q: "¿Capacitación o consultoría? ¿Cuál elijo?",
    a: "Si necesitas una solución ya (dashboard, pipeline, modelo), empezamos por implementación. Si tu prioridad es autonomía del equipo, priorizamos capacitación. Lo ideal suele ser combinar ambas: construir y transferir el conocimiento.",
  },
  {
    q: "¿Por qué capacitar en lugar de solo contratar consultores?",
    a: "La consultoría resuelve el problema de hoy, pero te deja dependiente. Al formar a tu equipo, ellos crean, mantienen y escalan sin pagar por cada cambio. El ROI promedio es 243% en el primer año.",
  },
  {
    q: "¿Cuánto demora un proyecto típico?",
    a: "Un dashboard ejecutivo en Power BI toma entre 3 y 6 semanas según las fuentes. Los programas de capacitación se adaptan a tu calendario, normalmente entre 4 y 12 semanas en sesiones en vivo.",
  },
  {
    q: "¿Trabajan con nuestras fuentes actuales?",
    a: "Sí. SQL Server, Excel, Google Sheets, SAP, Dynamics, CRMs, APIs REST, Google Ads, Meta Ads, Azure, AWS y GCP, entre otras.",
  },
  {
    q: "¿Las capacitaciones son a medida?",
    a: "Adaptamos el contenido a tus tablas, KPIs y procesos. Tus colaboradores trabajan con datos de la empresa, no con ejemplos genéricos de laboratorio.",
  },
  {
    q: "¿Emiten factura empresarial?",
    a: "Sí. Factura electrónica, órdenes de compra, centros de costo y reportes de asistencia por colaborador en Chile y Latinoamérica.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   SMALL UI HELPERS
   ═══════════════════════════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
      {children}
    </p>
  );
}

function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-display font-black text-3xl sm:text-4xl lg:text-[2.75rem] text-slate-900 tracking-tight leading-[1.15] ${className}`}
    >
      {children}
    </h2>
  );
}

function Elegant({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-serif italic font-normal text-slate-900">{children}</span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function EmpresasClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-white min-h-screen">
      {/* ─── 1. HERO ─── */}
      <section className="relative -mt-20 lg:-mt-24 pt-32 lg:pt-40 pb-16 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-blue-100/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-5 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-bold text-slate-600 mb-6 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Para equipos y empresas en Latam
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[3.5rem] text-slate-900 tracking-tight leading-[1.08] mb-5">
                  Datos que tu equipo{" "}
                  <Elegant>entiende, construye y defiende</Elegant>
                </h1>
              </FadeIn>

              <FadeIn delay={0.14}>
                <p className="text-slate-500 text-lg leading-relaxed max-w-xl mb-8">
                  Capacitación corporativa e implementación de Business Intelligence.
                  Formamos analistas autónomos y construimos dashboards, automatizaciones
                  e IA sobre tus fuentes reales.
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a
                    href="#contacto"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[15px] px-6 py-3.5 rounded-xl no-underline transition-colors"
                  >
                    Agendar diagnóstico gratis
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#oferta"
                    className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-[15px] px-6 py-3.5 rounded-xl no-underline transition-colors"
                  >
                    Ver cómo trabajamos
                  </a>
                </div>
              </FadeIn>

              <FadeIn delay={0.26}>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> CAP
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> AngloAmerican
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> +50 empresas
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Chile · Latam
                  </span>
                </div>
              </FadeIn>
            </div>

            {/* Hero right — clear dual offer cards */}
            <div className="lg:col-span-5">
              <FadeIn delay={0.18}>
                <div className="space-y-3">
                  {[
                    {
                      icon: GraduationCap,
                      title: "Capacitación",
                      text: "Tu equipo aprende a crear y mantener soluciones de datos.",
                      color: "bg-blue-50 text-blue-600",
                    },
                    {
                      icon: BarChart3,
                      title: "Implementación BI",
                      text: "Dashboards, ETL e IA listos para producción.",
                      color: "bg-indigo-50 text-indigo-600",
                    },
                    {
                      icon: Brain,
                      title: "Transferencia real",
                      text: "No te dejamos dependiente: el conocimiento queda adentro.",
                      color: "bg-emerald-50 text-emerald-600",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white/90 backdrop-blur-sm shadow-sm"
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-[15px]">{item.title}</p>
                        <p className="text-slate-500 text-sm mt-0.5 leading-snug">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. TRUST + STATS ─── */}
      <LogoSlider />

      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 lg:py-12">
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="text-center lg:text-left">
                  <div className="font-display font-black text-3xl lg:text-4xl text-slate-900 tracking-tight">
                    <CountUp target={s.value} duration={2} suffix={s.suffix} />
                  </div>
                  <p className="text-[12px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── 3. QUÉ OFRECEMOS (dos pilares claros) ─── */}
      <section id="oferta" className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <FadeIn className="max-w-2xl mb-12">
            <SectionLabel>Qué hacemos</SectionLabel>
            <SectionTitle>
              Dos formas de trabajar.{" "}
              <Elegant>Un mismo objetivo:</Elegant> autonomía con datos.
            </SectionTitle>
            <p className="mt-4 text-slate-500 text-base lg:text-lg leading-relaxed">
              Elige capacitación, implementación, o ambas. Diseñamos el plan según
              el nivel de madurez de tu organización.
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
            {services.map((svc, i) => (
              <FadeIn key={svc.id} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-slate-200 bg-white p-7 lg:p-9 flex flex-col shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      backgroundColor: `${svc.accent}14`,
                      color: svc.accent,
                    }}
                  >
                    <svc.icon className="w-6 h-6" />
                  </div>
                  <p
                    className="text-[11px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: svc.accent }}
                  >
                    {svc.subtitle}
                  </p>
                  <h3 className="font-display font-black text-2xl text-slate-900 mb-3">
                    {svc.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-6 flex-1">
                    {svc.description}
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {svc.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-sm text-slate-700 font-medium"
                      >
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: svc.accent }}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={svc.href}
                    className="inline-flex items-center gap-2 font-bold text-sm no-underline group"
                    style={{ color: svc.accent }}
                  >
                    {svc.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. PROBLEMA → SOLUCIÓN ─── */}
      <section className="py-16 lg:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <FadeIn className="max-w-2xl mb-12 text-center mx-auto">
            <SectionLabel>Por qué importa</SectionLabel>
            <SectionTitle>
              El costo de no formar a tu equipo{" "}
              <Elegant>es invisible… hasta que duele</Elegant>
            </SectionTitle>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-5 lg:gap-6 mb-12">
            <FadeIn>
              <div className="rounded-3xl border border-slate-200 bg-white p-7 lg:p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                      Sin autonomía
                    </p>
                    <h3 className="font-display font-bold text-lg text-slate-800">
                      Lo que suele pasar
                    </h3>
                  </div>
                </div>
                <div className="space-y-4">
                  {pains.map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{item.title}</p>
                        <p className="text-sm text-slate-500 leading-snug mt-0.5">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-7 lg:p-8 h-full text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/80">
                        Con ProgramBI
                      </p>
                      <h3 className="font-display font-bold text-lg text-white">
                        Lo que logras
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {gains.map((item) => (
                      <div key={item.title} className="flex gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 text-emerald-400 flex items-center justify-center shrink-0 border border-white/10">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{item.title}</p>
                          <p className="text-sm text-slate-400 leading-snug mt-0.5">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <p className="font-serif italic text-center text-2xl lg:text-3xl text-slate-900 max-w-3xl mx-auto leading-snug">
              “No regreses al consultor cada vez que cambia un filtro.{" "}
              <span className="text-blue-600 not-italic font-serif">Forma a tu equipo.</span>”
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── 5. IMPACTO (métricas compactas) ─── */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <FadeIn className="max-w-2xl mb-10">
            <SectionLabel>Impacto</SectionLabel>
            <SectionTitle>
              Resultados que justifican la <Elegant>inversión</Elegant>
            </SectionTitle>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {impact.map((item) => (
              <StaggerItem key={item.label}>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 lg:p-6 h-full shadow-sm">
                  <div className="font-display font-black text-3xl lg:text-4xl text-slate-900 tracking-tight mb-1">
                    <CountUp target={item.value} duration={2} suffix={item.suffix} />
                  </div>
                  <p className="font-bold text-sm text-slate-800 mb-1">{item.label}</p>
                  <p className="text-[12px] text-slate-400 leading-snug">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── 6. CÓMO TRABAJAMOS ─── */}
      <section className="py-16 lg:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <FadeIn className="max-w-2xl mb-12 mx-auto text-center">
            <SectionLabel>Método</SectionLabel>
            <SectionTitle>
              Un proceso claro, de punta a <Elegant>punta</Elegant>
            </SectionTitle>
            <p className="mt-4 text-slate-500">
              Sin sorpresas. Cada etapa tiene entregables y criterios de éxito.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
            {processSteps.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.06}>
                <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
                  <span className="font-display font-black text-2xl text-slate-200">
                    {step.n}
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. PROGRAMAS ─── */}
      <section id="programas" className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <FadeIn className="max-w-xl">
              <SectionLabel>Capacitación</SectionLabel>
              <SectionTitle>
                Programas para <Elegant>formar equipos</Elegant> de datos
              </SectionTitle>
              <p className="mt-3 text-slate-500">
                En vivo, adaptables a tu industria. Facturación corporativa incluida.
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 no-underline hover:gap-3 transition-all"
              >
                Ver catálogo completo <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCourses.map((course) => (
              <StaggerItem key={course.slug} className="h-full">
                <Link
                  href={`/cursos/${course.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white overflow-hidden no-underline hover:border-slate-300 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {course.techStack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-display font-bold text-[17px] text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                      {course.shortDescription}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> {course.durationHours}h
                      </span>
                      <span className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-600">
                        Ver programa <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── 8. CASOS + TESTIMONIOS ─── */}
      <section className="py-16 lg:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <FadeIn className="max-w-2xl mb-10">
            <SectionLabel>Prueba social</SectionLabel>
            <SectionTitle>
              Resultados reales, no <Elegant>promesas</Elegant>
            </SectionTitle>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
            {casesOfUse.slice(0, 3).map((c) => (
              <StaggerItem key={c.slug} className="h-full">
                <Link
                  href={`/casos/${c.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white overflow-hidden no-underline hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    {c.videoUrl ? (
                      <video
                        src={c.videoUrl}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                    )}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/95 text-slate-800">
                        {c.techBadge}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                      {c.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {c.metrics.slice(0, 2).map((m, mi) => (
                        <div
                          key={mi}
                          className="rounded-xl bg-slate-50 border border-slate-100 p-2.5"
                        >
                          <p className="font-display font-black text-sm text-slate-900">
                            {m.value}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                            {m.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <span className="mt-auto text-xs font-bold text-blue-600 inline-flex items-center gap-1">
                      Ver caso <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <StaggerItem key={t.author} className="h-full">
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 flex flex-col">
                  <Quote className="w-7 h-7 text-slate-200 mb-3" />
                  <p className="text-slate-700 text-sm leading-relaxed flex-1 mb-5">
                    “{t.quote}”
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                      {t.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 leading-tight">
                        {t.author}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{t.role}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── 9. FAQ ─── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <FadeIn className="text-center mb-10">
            <SectionLabel>FAQ</SectionLabel>
            <SectionTitle>
              Preguntas que nos hacen{" "}
              <Elegant>antes de empezar</Elegant>
            </SectionTitle>
          </FadeIn>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <FadeIn key={faq.q} delay={i * 0.04}>
                  <div
                    className={`rounded-2xl border transition-colors ${
                      open
                        ? "border-slate-300 bg-white shadow-sm"
                        : "border-slate-100 bg-slate-50/80"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left bg-transparent border-0 cursor-pointer"
                    >
                      <span className="font-display font-bold text-[15px] lg:text-base text-slate-900 pr-2">
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 text-slate-400"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-slate-500 text-[15px] leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 10. CONTACTO ─── */}
      <section id="contacto" className="py-16 lg:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <FadeIn>
              <SectionLabel>Siguiente paso</SectionLabel>
              <SectionTitle className="mb-4">
                Agenda un diagnóstico{" "}
                <Elegant>gratuito de 30 minutos</Elegant>
              </SectionTitle>
              <p className="text-slate-500 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
                Cuéntanos tu caso. Revisamos tu arquitectura de datos y te
                proponemos un plan concreto: capacitación, implementación o ambas.
              </p>

              <ul className="space-y-3.5 mb-10">
                {[
                  "Auditoría de tu arquitectura actual",
                  "Roadmap con alcance y plazos",
                  "Programa de capacitación a medida",
                  "Estimación con facturación corporativa",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-700 font-medium text-[15px]"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4 text-[12px] font-semibold text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Empresas Latam
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> +5.000 formados
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> 98% éxito
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <AsesoriasForm type="empresas" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── 11. CTA FINAL compacto ─── */}
      <section className="py-14 lg:py-16">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="rounded-3xl bg-slate-950 px-8 py-10 lg:px-14 lg:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.18),transparent_55%)] pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <h2 className="font-display font-black text-2xl lg:text-3xl text-white tracking-tight mb-2">
                ¿Listo para que tu equipo decida con datos?
              </h2>
              <p className="text-slate-400 text-sm lg:text-base">
                Un diagnóstico de 30 minutos. Sin compromiso. Con un plan concreto.
              </p>
            </div>
            <a
              href="#contacto"
              className="relative z-10 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl no-underline shrink-0 transition-colors"
            >
              Empezar ahora <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
