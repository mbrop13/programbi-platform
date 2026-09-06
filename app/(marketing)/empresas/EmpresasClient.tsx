"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  Users,
  GraduationCap,
  Handshake,
  AlertTriangle,
  BadgeCheck,
  FileSpreadsheet,
  UserRound,
  BookOpen,
  Briefcase,
} from "lucide-react";
import AsesoriasForm from "@/components/marketing/AsesoriasForm";
import LogoSlider from "@/components/marketing/LogoSlider";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { testimonials } from "@/lib/data/testimonials";
import {
  PACK,
  PACK_FAQS,
  PACK_INCLUDES,
  PACK_PAINS,
  PACK_STEPS,
  PACK_VARIANT_COPY,
  PACK_VERTICALS,
  type PackVariant,
} from "@/lib/data/pack-adopcion";

const painIcons = [FileSpreadsheet, UserRound, BookOpen, Briefcase];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
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
      className={`font-display text-3xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] ${className}`}
    >
      {children}
    </h2>
  );
}

function Elegant({ children }: { children: React.ReactNode }) {
  return <span className="font-serif font-normal italic text-slate-900">{children}</span>;
}

const studentQuotes = testimonials.filter((t) =>
  /power bi|sql|datos/i.test(`${t.role} ${t.message}`)
).slice(0, 3);

export default function EmpresasClient({
  variant = "empresas",
}: {
  variant?: PackVariant;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const copy = PACK_VARIANT_COPY[variant];
  const pagePath =
    variant === "implementacion"
      ? "/implementacion-power-bi"
      : variant === "migrar-excel"
        ? "/migrar-excel-a-power-bi"
        : "/empresas";

  return (
    <div className="min-h-dvh bg-canvas">
      <section className="relative overflow-hidden pt-12 pb-14 lg:pt-16 lg:pb-16">
        <div className="relative z-10 mx-auto max-w-6xl px-5 lg:px-8">
          <nav className="mb-6 text-sm text-slate-400" aria-label="Migas">
            <Link href="/" className="no-underline hover:text-slate-700">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <Link href="/empresas" className="no-underline hover:text-slate-700">
              Empresas
            </Link>
            {variant !== "empresas" ? (
              <>
                <span className="mx-2">/</span>
                <span className="text-slate-700">
                  {variant === "implementacion" ? "Implementación Power BI" : "Migrar Excel a Power BI"}
                </span>
              </>
            ) : null}
          </nav>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {copy.kicker}
              </div>

              <h1 className="font-display mb-5 text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
                {copy.h1}
              </h1>

              <p className="mb-3 max-w-xl text-lg leading-relaxed text-slate-500">
                {copy.sub}
              </p>
              <p className="mb-8 max-w-xl font-serif text-xl italic text-slate-800">
                {PACK.tagline}
              </p>

              <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contacto"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-[15px] font-semibold text-canvas no-underline transition-transform active:scale-[0.98]"
                >
                  Agendar diagnóstico Pack Adopción (30 min)
                  <ArrowRight className="h-4 w-4" />
                </a>
                <WhatsAppCta
                  page={pagePath}
                  intent="pack"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-paper px-7 text-[15px] font-medium text-ink no-underline hover:bg-wash"
                >
                  WhatsApp empresas
                </WhatsAppCta>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Tottus
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Pucobre
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> CAP · AngloAmerican
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Chile
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="space-y-3">
                {[
                  {
                    icon: LayoutDashboard,
                    title: `${PACK.dashboards} dashboards en producción`,
                    text: "Con los datos de tu área, no con un dataset de ejemplo.",
                    color: "bg-indigo-50 text-indigo-600",
                  },
                  {
                    icon: GraduationCap,
                    title: `Adopción ${PACK.trainingWeeks} semanas`,
                    text: "Tu equipo aprende sobre el tablero que van a operar.",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    icon: Handshake,
                    title: `Handoff + ${PACK.postGoLiveWeeks} sem. post go-live`,
                    text: "Ahí fallan los proyectos BI. Nosotros nos quedamos.",
                    color: "bg-emerald-50 text-emerald-600",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-900">{item.title}</p>
                      <p className="mt-0.5 text-sm leading-snug text-slate-500">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <LogoSlider className="border-0 bg-transparent" />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <SectionLabel>El problema</SectionLabel>
            <SectionTitle>
              Los proyectos BI no fallan por la herramienta.{" "}
              <Elegant>Fallan por adopción.</Elegant>
            </SectionTitle>
          </div>

          <div className="mb-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-7 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                    Lo que suele pasar
                  </p>
                  <h3 className="font-display text-lg font-bold text-slate-800">Sin Pack</h3>
                </div>
              </div>
              <div className="space-y-4">
                {PACK_PAINS.map((item, i) => {
                  const Icon = painIcons[i];
                  return (
                    <div key={item.title} className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.title}</p>
                        <p className="mt-0.5 text-sm leading-snug text-slate-500">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative h-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-7 text-white lg:p-8">
              <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/15 text-emerald-400">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/80">
                      Pack Adopción BI
                    </p>
                    <h3 className="font-display text-lg font-bold text-white">Lo que queda en el área</h3>
                  </div>
                </div>
                <ul className="space-y-3.5">
                  {PACK_INCLUDES.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-snug text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="metodo" className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <SectionLabel>Cómo funciona</SectionLabel>
            <SectionTitle>
              Diagnóstico → Construcción → Adopción →{" "}
              <Elegant>Handoff</Elegant>
            </SectionTitle>
            <p className="mt-4 text-slate-500">
              Un área, un tablero vivo, un equipo que ya no llama al consultor para cambiar un filtro.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PACK_STEPS.map((step) => (
              <div key={step.n} className="relative h-full rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
                <span className="font-display text-2xl font-black text-slate-200">{step.n}</span>
                <h3 className="font-display mt-3 mb-2 text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inversion" className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <SectionLabel>Inversión referencial</SectionLabel>
                <SectionTitle className="mb-4">
                  {PACK.priceLabel}{" "}
                  <Elegant>({PACK.priceFromLabel})</Elegant>
                </SectionTitle>
                <p className="max-w-md text-slate-500 leading-relaxed">
                  Por área, según fuentes, cantidad de tableros y tamaño del equipo. El diagnóstico de{" "}
                  {PACK.diagnosisMinutes} minutos no tiene costo. Propuesta en menos de {PACK.proposalSlaHours} h.
                </p>
                <p className="mt-4 text-sm text-slate-500">{PACK.senceLine}</p>
              </div>
              <ul className="space-y-3">
                {PACK_VERTICALS.map((v) => (
                  <li key={v.label}>
                    <Link
                      href={v.href}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline hover:border-slate-300"
                    >
                      {v.label}
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <SectionLabel>Prueba social</SectionLabel>
            <SectionTitle>
              Equipos que ya trabajan con datos.{" "}
              <Elegant>Sin métricas infladas.</Elegant>
            </SectionTitle>
            <p className="mt-3 text-slate-500">
              Logos de organizaciones donde hemos formado o implementado. Testimonios de alumnos reales de los
              programas. No mostramos contadores 0+ ni ROI sin fuente.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {studentQuotes.map((t) => (
              <div key={t.name} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
                <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-700">“{t.message}”</p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-bold leading-tight text-slate-900">{t.name}</p>
                  <p className="truncate text-[11px] text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="mb-10 text-center">
            <SectionLabel>FAQ</SectionLabel>
            <SectionTitle>
              Preguntas de Controller y{" "}
              <Elegant>jefe de área</Elegant>
            </SectionTitle>
          </div>

          <div className="space-y-2.5">
            {PACK_FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-colors ${
                    open ? "border-slate-300 bg-white shadow-sm" : "border-slate-100 bg-slate-50/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent p-5 text-left"
                  >
                    <span className="font-display pr-2 text-[15px] font-bold text-slate-900 lg:text-base">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-slate-400"
                    >
                      <ChevronDown className="h-5 w-5" />
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
                        <p className="px-5 pb-5 text-[15px] leading-relaxed text-slate-500">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionLabel>Siguiente paso</SectionLabel>
              <SectionTitle className="mb-4">
                Diagnóstico Pack Adopción,{" "}
                <Elegant>{PACK.diagnosisMinutes} minutos</Elegant>
              </SectionTitle>
              <p className="mb-8 max-w-md text-base leading-relaxed text-slate-500 lg:text-lg">
                Nombre, empresa, cargo, WhatsApp y área. Te devolvemos un plan concreto: tableros, plazos y valor
                referencial. Sin compromiso.
              </p>
              <ul className="mb-10 space-y-3.5">
                {[
                  "Qué reportes matan tiempo hoy (Excel, ERP, mail)",
                  "Cuántos tableros y quién los va a mantener",
                  `Propuesta en <${PACK.proposalSlaHours}h con factura directa`,
                  PACK.senceLine,
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] font-medium text-slate-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-400">
                <Users className="h-3.5 w-3.5" /> Controllers, jefes de control de gestión y líderes de área
              </p>
            </div>

            <AsesoriasForm type="empresas" />
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-12">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            ¿Buscas un curso abierto de Power BI, SQL o Python? Eso es formación individual, no el Pack.{" "}
            <Link href="/cursos" className="font-semibold text-slate-800">
              Ver cursos
            </Link>
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-slate-950 px-8 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.18),transparent_55%)]" />
            <div className="relative z-10 max-w-xl">
              <h2 className="font-display mb-2 text-2xl font-black tracking-tight text-white lg:text-3xl">
                {PACK.tagline}
              </h2>
              <p className="text-sm text-slate-400 lg:text-base">
                Un diagnóstico de {PACK.diagnosisMinutes} minutos. Sin compromiso. Con un plan por área.
              </p>
            </div>
            <a
              href="#contacto"
              className="relative z-10 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 no-underline hover:bg-slate-100"
            >
              Agendar diagnóstico <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
