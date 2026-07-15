"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import React from "react";
import {
  ArrowRight, BarChart3, Cpu, LineChart, Shield, Building2, Users, Zap,
  TrendingUp, Lightbulb, Search, CheckCircle2, ChevronDown,
  Sparkles, Target, Award, Clock, GraduationCap, Workflow, PlayCircle,
  Quote, ArrowUpRight, Rocket, Brain, Bot, Gauge, X, AlertTriangle,
  TrendingDown, HeartHandshake, BadgeCheck, Layers, Server, Code2,
  PiggyBank, Timer, Compass, UserCheck, Crown, Lock, Sparkle,
} from "lucide-react";
import {
  FadeIn, StaggerChildren, StaggerItem, GlowCard, CountUp, TiltCard, ParallaxSection, AnimatedText,
} from "@/components/shared/AnimatedComponents";
import { courses } from "@/lib/data/courses";
import { casesOfUse } from "@/lib/data/cases";
import AsesoriasForm from "@/components/marketing/AsesoriasForm";
import LogoSlider from "@/components/marketing/LogoSlider";

/* ─────────── Helpers ─────────── */
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <LucideIcons.BookOpen className={className} />;
  return <Icon className={className} />;
}

/* ─────────── Data ─────────── */
const heroStats = [
  { icon: Building2, value: 50, suffix: "+", label: "Empresas", color: "#1890FF" },
  { icon: Users, value: 5000, suffix: "+", label: "Profesionales formados", color: "#6366F1" },
  { icon: Zap, value: 200, suffix: "+", label: "Proyectos entregados", color: "#7C3AED" },
  { icon: Award, value: 98, suffix: "%", label: "Tasa de éxito", color: "#10B981" },
];

/* 🆕 El costo de NO capacitar vs. el poder de capacitar */
const withoutTraining = [
  { icon: AlertTriangle, text: "Dependencia eterna de consultores externos por cada reporte o cambio" },
  { icon: Timer, text: "Días perdidos consolidando planillas Excel a mano" },
  { icon: TrendingDown, text: "Decisiones estratégicas basadas en intuición o datos de hace 30 días" },
  { icon: Lock, text: "Conocimiento atrapado en una sola persona del equipo" },
  { icon: X, text: "Rotación de talento por falta de oportunidades de desarrollo" },
  { icon: AlertTriangle, text: "Errores manuales costosos en reportes financieros y operativos" },
];

const withTraining = [
  { icon: BadgeCheck, text: "Equipos autónomos que crean y mantienen sus propios dashboards" },
  { icon: Rocket, text: "Reportes automatizados: de días a minutos, sin intervención manual" },
  { icon: TrendingUp, text: "Decisiones en tiempo real con datos vivos y confianza total" },
  { icon: Layers, text: "Conocimiento distribuido: nadie es cuello de botella" },
  { icon: HeartHandshake, text: "Retención de talento: +24% en empresas que invierten en formación" },
  { icon: PiggyBank, text: "Menor costo por análisis y cero dependencia de terceros" },
];

/* 🆕 ROI de la capacitación — métricas cuantificadas */
const roiBenefits = [
  { icon: PiggyBank, value: 243, suffix: "%", label: "ROI promedio", desc: "Retorno sobre la inversión en programas de capacitación en datos dentro del primer año.", color: "#10B981" },
  { icon: TrendingUp, value: 40, suffix: "%", label: "Más productividad", desc: "Aumento de productividad en equipos que dominan automatización y Power BI.", color: "#1890FF" },
  { icon: HeartHandshake, value: 24, suffix: "%", label: "Menos rotación", desc: "Reducción de fuga de talento al ofrecer desarrollo profesional tangible.", color: "#7C3AED" },
  { icon: Timer, value: 80, suffix: "%", label: "Tiempo liberado", desc: "Menos tiempo en tareas manuales, más tiempo en análisis estratégico.", color: "#F59E0B" },
  { icon: Gauge, value: 5, suffix: "x", label: "Decisiones más rápidas", desc: "Velocidad de toma de decisiones con dashboards en vivo vs. reportes estáticos.", color: "#EC4899" },
  { icon: Shield, value: 95, suffix: "%", label: "Menos errores", desc: "Reducción de errores manuales al automatizar procesos ETL y reportes.", color: "#06B6D4" },
];

const impactPillars = [
  { icon: TrendingUp, t: "Reducción de Costos", d: "Optimizamos procesos operativos eliminando redundancias, tareas manuales ineficientes y horas de planilla perdidas en reportes." },
  { icon: Lightbulb, t: "Celeridad Estratégica", d: "Información disponible 24/7 para que la estrategia se base en realidades, no en intuiciones ni en reportes de hace 30 días." },
  { icon: Search, t: "Transparencia Total", d: "Métricas estandarizadas y un único punto de verdad para que toda la organización hable el mismo idioma." },
  { icon: Shield, t: "Gobernanza y Seguridad", d: "Implementamos Row Level Security, control de accesos y auditoría para que los datos respiren de forma segura." },
];

const bentoSolutions = [
  { colSpan: "lg:col-span-2", icon: BarChart3, title: "Dashboards de Clase Mundial", description: "Transformamos datos complejos en dashboards de Power BI intuitivos que cuentan una historia. Conectamos ERPs, CRMs y bases de datos para una visualización unificada.", color: "#1890FF", bg: "bg-blue-50" },
  { colSpan: "lg:col-span-1", icon: Cpu, title: "Automatización con IA", description: "Implementamos agentes de IA, RPA y Power Automate para eliminar tareas repetitivas y errores humanos.", color: "#7C3AED", bg: "bg-purple-50" },
  { colSpan: "lg:col-span-1", icon: LineChart, title: "Ciencia de Datos", description: "Modelos predictivos que anticipan tendencias, demanda y riesgo para optimizar la toma de decisiones.", color: "#10B981", bg: "bg-emerald-50" },
  { colSpan: "lg:col-span-2", icon: GraduationCap, title: "Capacitación de Equipos", description: "No solo entregamos software: capacitamos a tu equipo con más de 9 programas corporativos y establecemos una cultura data-driven que perdura.", color: "#F59E0B", bg: "bg-amber-50" },
];

const processSteps = [
  { icon: Search, title: "Diagnóstico", desc: "Auditoría gratuita de tu arquitectura de datos, KPIs y procesos manuales.", color: "#1890FF" },
  { icon: Target, title: "Diseño", desc: "Roadmap a medida con alcance, niveles de capacitación y métricas de éxito.", color: "#6366F1" },
  { icon: Workflow, title: "Implementación", desc: "Desarrollo de dashboards, ETL y automatizaciones con sprints quincenales.", color: "#7C3AED" },
  { icon: GraduationCap, title: "Capacitación", desc: "Programas en vivo para tu equipo con certificación y material de por vida.", color: "#10B981" },
  { icon: Shield, title: "Soporte Continuo", desc: "Acompañamiento, mejora iterativa y gobernanza de datos post-entrega.", color: "#F59E0B" },
];

const testimonials = [
  { quote: "Logramos retener a más del 80% del personal clave identificado con riesgo alto de rotación antes de recibir su carta de renuncia.", author: "Sofía Vergara", role: "Gerente de Gestión de Personas", tag: "People Analytics" },
  { quote: "Python nos permitió pasar de un enfoque reactivo a anticipar la fuga de clientes de forma inteligente con un modelo predictivo.", author: "Mariana Rojas", role: "Subgerente de Fidelización", tag: "Machine Learning" },
  { quote: "La automatización liberó a nuestro equipo de tareas repetitivas, permitiéndonos enfocar el 100% del tiempo en análisis estratégico.", author: "Carolina Méndez", role: "Jefa de Finanzas & Control", tag: "Automatización" },
];

const faqs = [
  { q: "¿Por qué capacitar a nuestro equipo en lugar de solo contratar consultoría?", a: "La consultoría externa resuelve el problema de hoy, pero te deja dependiente para siempre. Al capacitar a tu equipo, transfieres el conocimiento: ellos crean, mantienen y escalan las soluciones de forma autónoma. El ROI es 243% promedio en el primer año y eliminas la dependencia de terceros en cada reporte o cambio." },
  { q: "¿Cuánto demora un proyecto típico de Business Intelligence?", a: "Un dashboard ejecutivo en Power BI toma entre 3 y 6 semanas según la complejidad de las fuentes de datos. Programas de capacitación corporativa se adaptan a tu calendario, generalmente entre 4 y 12 semanas distribuidas en sesiones en vivo." },
  { q: "¿Ofrecen facturación empresarial?", a: "Sí. Emitimos factura electrónica a nombre de tu empresa en Chile y Latinoamérica, con órdenes de compra, centros de costo y reportes de asistencia para cada colaborador capacitado." },
  { q: "¿Trabajan con nuestras fuentes de datos existentes?", a: "Nos conectamos a prácticamente cualquier fuente: SQL Server, Excel, Google Sheets, ERPs (SAP, Dynamics), CRMs, APIs REST, Google Ads, Meta Ads y bases en la nube (Azure, AWS, GCP)." },
  { q: "¿Las capacitaciones son 100% a medida?", a: "Adaptamos el contenido a los datos y casos reales de tu empresa. Tus colaboradores trabajan con tus propias tablas, KPIs y procesos, no con ejemplos genéricos de laboratorio." },
  { q: "¿Qué nivel de soporte entregan post-proyecto?", a: "Incluimos soporte continuo, sesiones de mejora iterativa, actualización de dashboards y gobernanza de datos. También formamos a un referente interno para autonomía total." },
  { q: "¿En qué países operan?", a: "Trabajamos de forma remota con empresas en Chile, Colombia, México, Perú y toda Latinoamérica, con horarios flexibles adaptados a cada zona horaria." },
];

/* ─────────── Component ─────────── */
export default function EmpresasClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[#FAFAFA] min-h-screen overflow-hidden">
      {/* ════════════════════════════════════════════════ */}
      {/* 1. HERO B2B — MODO CLARO CON FONDO ANIMADO        */}
      {/* ════════════════════════════════════════════════ */}
      <section className="relative -mt-20 lg:-mt-24 pt-32 lg:pt-44 pb-20 lg:pb-28 overflow-hidden bg-white">
        {/* ─── Animated background ─── */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Subtle grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundSize: "60px 60px",
              backgroundImage:
                "linear-gradient(to right, rgba(24,144,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,144,255,0.04) 1px, transparent 1px)",
            }}
          />
          {/* Aurora gradient mesh — 3 animated blobs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.75, 0.5], x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[15%] -right-[5%] w-[700px] h-[700px] bg-gradient-to-br from-blue-200/60 to-indigo-200/50 rounded-full blur-[110px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.65, 0.4], x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[30%] -left-[10%] w-[650px] h-[650px] bg-gradient-to-tr from-cyan-200/50 to-blue-200/50 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.55, 0.3], y: [0, -50, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-[10%] left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-purple-200/40 to-pink-200/30 rounded-full blur-[110px]"
          />

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/40"
              style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            />
          ))}

          {/* Bottom fade into page */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#FAFAFA]" />
        </div>

        <div className="max-w-[1100px] mx-auto px-5 lg:px-10 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md shadow-sm border border-blue-100 text-[#1890FF] font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-full mb-8">
              <span className="relative flex h-2.5 w-2.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
              Soluciones Corporativas de Datos
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#0F172A] mb-8 leading-[1.05] tracking-tight">
              Capacita a tu equipo.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-[#6366F1]">
                Domina tus datos.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-gray-500 text-lg sm:text-xl leading-relaxed mb-12 max-w-[720px] mx-auto font-medium">
              Transformamos a tus colaboradores en analistas autónomos. Dashboards, automatización,
              ciencia de datos y capacitación corporativa de alto impacto para empresas que quieren decidir con datos.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a
                href="#contacto"
                className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-2xl font-black text-base text-white no-underline transition-all hover:-translate-y-1 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)", boxShadow: "0 20px 40px -12px rgba(37,99,235,0.5)" }}
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-2">
                  Agendar diagnóstico gratuito <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a
                href="#why-capacitar"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-[#0F172A] bg-white border border-gray-200 shadow-sm no-underline transition-all hover:border-blue-300 hover:-translate-y-1"
              >
                <Sparkles className="w-5 h-5 text-blue-500" /> ¿Por qué capacitar?
              </a>
            </div>
          </FadeIn>

          {/* Credibility badges */}
          <FadeIn delay={0.5}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-gray-400 text-xs uppercase tracking-widest font-bold">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> CAP</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> AngloAmerican</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> +50 empresas</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Chile · Latam</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 2. TRUST BAR — LOGOS REALES DE EMPRESAS          */}
      {/* ════════════════════════════════════════════════ */}
      <LogoSlider />

      {/* ════════════════════════════════════════════════ */}
      {/* 3. STATS GRID                                     */}
      {/* ════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {heroStats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-tighter mb-1">
                    <CountUp target={stat.value} duration={2.5} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.15em]">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 4. 🆕 WHY CAPACITAR — EL CORAZÓN DE LA PÁGINA    */}
      {/* ════════════════════════════════════════════════ */}
      <section id="why-capacitar" className="py-12 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-lg mb-6">
              <Brain size={14} /> La gran pregunta
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-6xl text-[#0F172A] mb-6 leading-[1.1]">
              ¿Por qué tu empresa debería{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-[#6366F1]">
                capacitar a su equipo
              </span>
              ?
            </h2>
            <p className="text-gray-500 text-lg lg:text-xl font-medium leading-relaxed">
              Cada año, las empresas pierden millones en consultores externos y horas improductivas.
              Capacitar a tu equipo es la inversión con el <strong className="text-[#0F172A]">mayor retorno</strong> que puedes hacer.
            </p>
          </FadeIn>

          {/* Comparativa Antes / Después */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 relative">
            {/* Sin capacitación */}
            <FadeIn direction="right">
              <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-8 lg:p-10 h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 to-gray-200" />
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-red-400 block">El problema</span>
                    <h3 className="font-display font-black text-xl text-gray-700">Sin capacitación</h3>
                  </div>
                </div>
                <ul className="space-y-4">
                  {withoutTraining.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-gray-500 text-sm lg:text-base leading-snug pt-0.5">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Con capacitación */}
            <FadeIn delay={0.2} direction="left">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-[2.25rem] blur-xl" />
                <div className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-blue-500/30 rounded-[2rem] p-8 lg:p-10 h-full overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                  <div className="flex items-center gap-3 mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-300 border border-blue-400/30">
                      <BadgeCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-blue-400 block">La solución</span>
                      <h3 className="font-display font-black text-xl text-white">Con ProgramBI</h3>
                    </div>
                  </div>
                  <ul className="space-y-4 relative z-10">
                    {withTraining.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-400/30">
                          <item.icon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-slate-200 text-sm lg:text-base leading-snug pt-0.5 font-medium">{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Franja de frase impactante */}
          <FadeIn delay={0.2}>
            <div className="mt-12 text-center">
              <p className="font-serif italic text-2xl lg:text-4xl text-[#0F172A] max-w-3xl mx-auto leading-snug">
                "No regreses al consultor cada vez que cambia un filtro.
                <span className="text-blue-600"> Forma a tu equipo.</span>"
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 5. 🆕 ROI DE LA CAPACITACIÓN                     */}
      {/* ════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-y border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-lg mb-6">
              <PiggyBank size={14} /> El retorno de invertir en tu gente
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] mb-4 leading-tight">
              Los números no mienten
            </h2>
            <p className="text-gray-500 text-lg font-medium">
              Métricas reales del impacto de capacitar a tus equipos en datos, automatización e inteligencia artificial.
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roiBenefits.map((b) => (
              <StaggerItem key={b.label} className="h-full">
                <TiltCard className="h-full">
                  <div className="bg-white border border-gray-100 rounded-[2rem] p-7 lg:p-8 h-full shadow-sm hover:shadow-2xl transition-shadow group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: b.color }} />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${b.color}15`, color: b.color }}>
                        <b.icon className="w-7 h-7" />
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="font-display font-black text-5xl tracking-tighter" style={{ color: b.color }}>
                          <CountUp target={b.value} duration={2} suffix={b.suffix} />
                        </span>
                      </div>
                      <h3 className="font-display font-black text-lg text-[#0F172A] mb-2">{b.label}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 6. POR QUÉ PROGRAMBI + ORBITAL                    */}
      {/* ════════════════════════════════════════════════ */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <div className="bg-white rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center p-8 lg:p-16">
              <div>
                <FadeIn>
                  <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 block">Nuestro Impacto</span>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <h2 className="font-display font-medium text-4xl lg:text-5xl text-[#0F172A] mb-6 leading-tight">
                    <span className="text-[#1890FF]">Empoderamos a tu empresa con la</span>{" "}
                    <span className="font-serif italic text-[#0F172A]">verdad de los datos.</span>
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
                    No solo creamos dashboards; construimos la infraestructura que permite a los gerentes
                    tomar decisiones en segundos, no en días. Y capacitamos a tu equipo para sostenerla.
                  </p>
                </FadeIn>

                <StaggerChildren className="space-y-5">
                  {impactPillars.map((item, i) => (
                    <StaggerItem key={i}>
                      <div className="flex gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                          <item.icon size={22} />
                        </div>
                        <div>
                          <h4 className="font-black text-[#0F172A] text-lg mb-1">{item.t}</h4>
                          <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              </div>

              {/* 🎨 Data Architecture Visual — Pipeline animado de extremo a extremo */}
              <FadeIn delay={0.2} className="relative">
                <div className="bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#1E293B] rounded-[2.5rem] p-6 lg:p-8 border border-blue-500/20 relative overflow-hidden shadow-2xl">
                  {/* Ambient glow */}
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundSize: "24px 24px", backgroundImage: "linear-gradient(to right, #1890FF15 1px, transparent 1px), linear-gradient(to bottom, #1890FF15 1px, transparent 1px)" }} />

                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">data_pipeline.live</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">EN VIVO</span>
                  </div>

                  {/* Pipeline layers */}
                  <div className="relative z-10 space-y-3">
                    {[
                      { label: "Fuentes de Datos", sub: "SQL · ERP · CRM · APIs", icon: Server, color: "#06B6D4", width: "60%", delay: 0 },
                      { label: "ETL & Power Query", sub: "Extracción · Transformación", icon: Workflow, color: "#1890FF", width: "75%", delay: 0.4 },
                      { label: "Modelado & DAX", sub: "Esquema estrella · Medidas", icon: Layers, color: "#6366F1", width: "85%", delay: 0.8 },
                      { label: "Dashboards Power BI", sub: "Visualización interactiva", icon: BarChart3, color: "#10B981", width: "70%", delay: 1.2 },
                      { label: "IA & Machine Learning", sub: "Predicciones · Agentes", icon: Brain, color: "#7C3AED", width: "55%", delay: 1.6 },
                    ].map((layer, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: layer.delay, duration: 0.5 }}
                        className="relative"
                      >
                        {/* Connection line with flowing data */}
                        {i < 4 && (
                          <div className="absolute left-6 -bottom-3 w-0.5 h-3 bg-blue-500/20 overflow-hidden">
                            <motion.div
                              animate={{ y: [-12, 12] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: layer.delay, ease: "linear" }}
                              className="absolute inset-x-0 h-3 bg-gradient-to-b from-transparent via-blue-400 to-transparent"
                            />
                          </div>
                        )}
                        <div
                          className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 rounded-xl px-3 py-2.5 transition-colors"
                          style={{ marginLeft: `${(100 - parseInt(layer.width)) / 2}%`, marginRight: `${(100 - parseInt(layer.width)) / 2}%` }}
                        >
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${layer.color}20`, color: layer.color }}>
                            <layer.icon className="w-4.5 h-4.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate">{layer.label}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">{layer.sub}</p>
                          </div>
                          {/* Animated activity bar */}
                          <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                            <motion.div
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 2, repeat: Infinity, delay: layer.delay, ease: "linear" }}
                              className="h-full w-1/2 rounded-full"
                              style={{ background: layer.color }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Floating live KPIs */}
                  <div className="relative z-10 grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/5">
                    {[
                      { v: "1.2M", l: "filas/día", c: "text-cyan-400" },
                      { v: "3 min", l: "refresh", c: "text-blue-400" },
                      { v: "99.9%", l: "uptime", c: "text-emerald-400" },
                    ].map((k, i) => (
                      <div key={i} className="bg-white/[0.03] rounded-lg p-2.5 text-center border border-white/5">
                        <p className={`text-base font-black ${k.c}`}>{k.v}</p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{k.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 7. SOLUCIONES (BENTO GRID)                        */}
      {/* ════════════════════════════════════════════════ */}
      <section id="soluciones" className="py-24">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 block">Soluciones End-to-End</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] mb-4 leading-tight">
              Desde la ingesta de datos hasta la cultura de tu organización
            </h2>
            <p className="text-gray-500 text-lg font-medium">
              Acompañamos el ciclo completo del dato en tu empresa.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {bentoSolutions.map((feature, i) => (
              <FadeIn key={i} delay={i * 0.1} className={`h-full ${feature.colSpan}`}>
                <GlowCard glowColor={`${feature.color}30`} className="h-full">
                  <div className="bg-white border border-gray-200 rounded-[2rem] p-8 lg:p-10 h-full flex flex-col hover:border-blue-200 transition-colors shadow-sm group">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`} style={{ color: feature.color }}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display font-black text-2xl text-[#0F172A] mb-4">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed flex-grow text-lg">{feature.description}</p>
                  </div>
                </GlowCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 8. CATÁLOGO CORPORATIVO COMPLETO                  */}
      {/* ════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-lg mb-5">
              <GraduationCap size={14} /> Programas de Capacitación
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] mb-4 leading-tight">
              9 programas para transformar a tu equipo
            </h2>
            <p className="text-gray-500 text-lg font-medium">
              Programas en vivo, 100% adaptables a los datos y casos reales de tu empresa. Facturación corporativa y certificación incluida.
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <StaggerItem key={course.slug} className="h-full">
                <TiltCard className="h-full">
                  <Link
                    href={`/cursos/${course.slug}`}
                    className="block bg-white border border-gray-200 rounded-[1.75rem] overflow-hidden h-full no-underline group hover:border-blue-200 transition-colors shadow-sm hover:shadow-2xl hover:shadow-blue-500/10"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {course.badgeLabel && (
                        <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-md" style={{ background: course.badgeColor || course.accentColor }}>
                          {course.badgeLabel}
                        </span>
                      )}
                      </div>
                    <div className="p-6 flex flex-col h-[calc(100%-180px)]">
                      <h3 className="font-display font-black text-lg text-[#0F172A] mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                        {course.shortDescription}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.durationHours}h</span>
                        <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> {course.level}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {course.techStack.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-[10px] font-bold px-2 py-1 rounded-md bg-gray-100 text-gray-600">{tech}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Capacitar equipo <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                        {course.levels && course.levels.length > 0 && (
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{course.levels.length} niveles</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <FadeIn className="text-center mt-12">
            <Link href="/cursos" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 no-underline transition-all hover:-translate-y-0.5">
              Explorar catálogo completo <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 9. METODOLOGÍA / PROCESO                          */}
      {/* ════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 block">Cómo Trabajamos</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] mb-4 leading-tight">
              Una metodología probada en +200 proyectos
            </h2>
          </FadeIn>

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-gray-100">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 origin-left"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative">
              {processSteps.map((step, i) => (
                <FadeIn key={i} delay={i * 0.15} className="text-center lg:text-left">
                  <div className="relative flex justify-center lg:justify-start mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center mx-auto shadow-sm relative z-10"
                      style={{ color: step.color }}
                    >
                      <step.icon className="w-7 h-7" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-[11px] font-black flex items-center justify-center shadow-md" style={{ background: step.color }}>
                        {i + 1}
                      </span>
                    </motion.div>
                  </div>
                  <h4 className="font-display font-black text-lg text-[#0F172A] mb-2">{step.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 10. CASOS DE ÉXITO                                */}
      {/* ════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 block">Casos de Éxito</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] mb-4 leading-tight">
              Resultados tangibles, no promesas
            </h2>
            <p className="text-gray-500 text-lg font-medium">
              Historias reales de empresas que transformaron su operación con datos.
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {casesOfUse.slice(0, 3).map((c) => (
              <StaggerItem key={c.slug} className="h-full">
                <Link href={`/casos/${c.slug}`} className="group block bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all no-underline h-full">
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    {c.videoUrl ? (
                      <video
                        src={c.videoUrl}
                        muted loop playsInline preload="metadata"
                        onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                        onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#0F172A]">{c.techBadge}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">{c.category}</span>
                    <h3 className="font-display font-black text-lg text-[#0F172A] mb-3 leading-tight group-hover:text-blue-600 transition-colors">{c.title}</h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {c.metrics.slice(0, 2).map((m, mi) => (
                        <div key={mi} className="bg-white rounded-xl p-3 border border-gray-100">
                          <p className="font-display font-black text-base text-[#0F172A]">{m.value}</p>
                          <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{m.label}</p>
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver caso completo <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <FadeIn className="text-center mt-12">
            <Link href="/casos" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 no-underline transition-all hover:-translate-y-0.5">
              Ver todos los casos <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 11. TESTIMONIOS                                   */}
      {/* ════════════════════════════════════════════════ */}
      <ParallaxSection speed={0.2}>
        <section className="py-24">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 block">Lo que Dicen Nuestros Clientes</span>
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] leading-tight">
                Voces de la transformación
              </h2>
            </FadeIn>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <StaggerItem key={i} className="h-full">
                  <div className="bg-white border border-gray-100 rounded-[2rem] p-8 h-full flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden">
                    <div className="absolute -top-6 -right-2 text-blue-100"><Quote className="w-24 h-24" /></div>
                    <div className="relative z-10 flex flex-col h-full">
                      <span className="inline-flex self-start text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 mb-5">{t.tag}</span>
                      <p className="text-gray-700 text-base leading-relaxed mb-6 flex-grow italic">"{t.quote}"</p>
                      <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                          {t.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-black text-[#0F172A] text-sm leading-tight">{t.author}</p>
                          <p className="text-gray-400 text-xs">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      </ParallaxSection>

      {/* ════════════════════════════════════════════════ */}
      {/* 12. CTA + FORMULARIO B2B                          */}
      {/* ════════════════════════════════════════════════ */}
      <section id="contacto" className="py-24">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-lg mb-6">
                <Rocket size={14} /> Diagnóstico Corporativo Gratuito
              </div>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-[#0F172A] mb-6 leading-tight">
                Conversemos sobre tu{" "}
                <span className="text-blue-600">arquitectura de datos</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                Déjanos tus datos corporativos. Nuestro equipo evaluará tu caso y agendaremos una llamada
                exploratoria de 30 minutos para entender tus desafíos y proponerte un plan de acción concreto.
              </p>
              <ul className="space-y-4">
                {[
                  "Auditoría gratuita de tu arquitectura actual",
                  "Propuesta de roadmap con alcance y plazos",
                  "Diseño de programa de capacitación a medida",
                  "Estimación de inversión con facturación corporativa",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-gray-700 font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.2}>
              <AsesoriasForm type="empresas" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 13. FAQ                                           */}
      {/* ════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-[850px] mx-auto px-5 lg:px-10">
          <FadeIn className="text-center mb-16">
            <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 block">Preguntas Frecuentes</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] leading-tight">
              Resolvemos tus dudas
            </h2>
          </FadeIn>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 lg:p-6 text-left bg-transparent border-none cursor-pointer"
                  >
                    <span className="font-display font-black text-base lg:text-lg text-[#0F172A]">{faq.q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-blue-600">
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 lg:px-6 pb-5 lg:pb-6 text-gray-500 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* 14. CTA FINAL                                     */}
      {/* ════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <div className="relative overflow-hidden bg-[#0F172A] rounded-[3rem] p-12 lg:p-20 text-center">
            <div className="absolute inset-0 opacity-10" style={{ backgroundSize: "30px 30px", backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)" }} />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px]" />
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px]" />
            <FadeIn className="relative z-10 max-w-[700px] mx-auto">
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                Tu próxima decisión estratégica empieza con datos
              </h2>
              <p className="text-gray-400 text-lg lg:text-xl mb-10">
                Agenda hoy tu diagnóstico gratuito y descubre cuánto tiempo y dinero estás dejando en la mesa.
              </p>
              <a href="#contacto" className="inline-flex items-center gap-3 bg-white text-[#0F172A] px-10 py-5 rounded-2xl font-black text-lg no-underline hover:-translate-y-1 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Agendar diagnóstico <ArrowRight className="w-5 h-5" />
              </a>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
