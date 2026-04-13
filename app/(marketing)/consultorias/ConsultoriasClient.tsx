"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, Cpu, LineChart,
  CheckCircle2, Building2, Users, Zap, Shield,
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, CountUp, GlowCard } from "@/components/shared/AnimatedComponents";

const services = [
  {
    icon: BarChart3,
    title: "Dashboards Personalizados",
    description:
      "Creamos dashboards interactivos en Power BI adaptados a los KPIs de tu empresa. Conectamos múltiples fuentes de datos para una visualización unificada y en tiempo real.",
    features: [
      "Conexión a bases de datos y ERPs",
      "KPIs personalizados por área",
      "Power BI Service y Gateway configurado",
      "Capacitación de usuarios finales",
    ],
    color: "#1890FF",
  },
  {
    icon: Cpu,
    title: "Automatización de Procesos",
    description:
      "Automatizamos reportes, flujos de aprobación y procesos repetitivos con Power Automate, Python y herramientas de IA para reducir tiempos operativos.",
    features: [
      "Flujos de Power Automate personalizados",
      "Scripts Python para automatización",
      "Integración con Office 365",
      "Chatbots y agentes IA",
    ],
    color: "#7C3AED",
  },
  {
    icon: LineChart,
    title: "Análisis de Datos Empresarial",
    description:
      "Extraemos insights accionables de tus datos. Desde análisis exploratorio hasta modelos predictivos que anticipan la demanda, optimizan inventarios o detectan riesgos.",
    features: [
      "Limpieza y estructuración de datos",
      "Análisis estadístico avanzado",
      "Modelos predictivos con Machine Learning",
      "Reportes ejecutivos automatizados",
    ],
    color: "#10B981",
  },
];

const videos = [
  { id: "LiupEKDc3Ms", title: "Dashboard de Ventas Power BI" },
  { id: "7197F-yNw04", title: "Automatización de Reportes" },
  { id: "csPtN5bI_cw", title: "Análisis con Python" },
];

const stats = [
  { icon: Building2, value: 50, suffix: "+", label: "Empresas Atendidas" },
  { icon: Users, value: 1500, suffix: "+", label: "Profesionales Capacitados" },
  { icon: Zap, value: 200, suffix: "+", label: "Proyectos Entregados" },
  { icon: Shield, value: 98, suffix: "%", label: "Satisfacción" },
];

export default function ConsultoriasClient() {
  return (
    <>
      {/* ════ HERO ════ */}
      <section className="relative -mt-20 lg:-mt-24 pt-32 lg:pt-44 pb-20 lg:pb-28 overflow-hidden">
        {/* Network Grid SVG */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.line
                key={`line-${i}`}
                x1={Math.random() * 800} y1={Math.random() * 600}
                x2={Math.random() * 800} y2={Math.random() * 600}
                stroke="#1890FF" strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ delay: i * 0.15, duration: 1 }}
              />
            ))}
            {/* Nodes */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.circle
                key={`node-${i}`}
                cx={80 + Math.random() * 640} cy={60 + Math.random() * 480}
                r="4" fill="#1890FF"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2, type: "spring" }}
              />
            ))}
          </svg>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-[800px] mx-auto px-5 lg:px-10 relative z-10 text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 bg-blue-50 text-[#1890FF] font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-full border border-blue-100 mb-6">
              <Building2 size={14} /> Servicios Empresariales
            </span>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl text-[#0F172A] mb-6 leading-tight tracking-tight">
              Consultorías en{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">
                Datos & BI
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-gray-500 text-lg lg:text-xl leading-relaxed mb-10 max-w-[600px] mx-auto">
              Transformamos los datos de tu empresa en dashboards, automatizaciones y modelos predictivos que impulsan la toma de decisiones estratégicas.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contacto"
                className="group px-10 py-5 rounded-2xl text-white font-bold text-lg no-underline transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #1890FF 0%, #0050b3 100%)", boxShadow: "0 12px 35px -8px rgba(24,144,255,0.4)" }}
              >
                Solicitar Cotización <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════ STATS ════ */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <StaggerItem key={stat.label}>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-[#1890FF]" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-black text-[#0F172A]">
                      <CountUp target={stat.value} duration={2} suffix={stat.suffix} />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* ════ SERVICES ════ */}
      <section className="py-16 lg:py-24 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <div className="space-y-20">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <FadeIn key={service.title} delay={i * 0.1}>
                  <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                    <div className={i % 2 === 1 ? "lg:[direction:ltr]" : ""}>
                      <motion.div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                        style={{ backgroundColor: `${service.color}15`, color: service.color }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className="w-8 h-8" />
                      </motion.div>
                      <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] mb-5">{service.title}</h2>
                      <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8">{service.description}</p>
                      <ul className="space-y-4 list-none p-0 m-0">
                        {service.features.map((f, fi) => (
                          <motion.li
                            key={f}
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: fi * 0.08 }}
                            className="flex items-center gap-3 text-gray-600 text-sm lg:text-base"
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            {f}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className={i % 2 === 1 ? "lg:[direction:ltr]" : ""}>
                      <GlowCard glowColor={`${service.color}20`}>
                        <div
                          className="rounded-[2rem] p-12 min-h-[300px] flex items-center justify-center bg-white border border-gray-200 relative overflow-hidden"
                          style={{ boxShadow: "0 20px 50px -15px rgba(15,23,42,0.06)" }}
                        >
                          <div className="absolute inset-0 opacity-5" style={{
                            backgroundSize: "40px 40px",
                            backgroundImage: `linear-gradient(to right, ${service.color} 1px, transparent 1px), linear-gradient(to bottom, ${service.color} 1px, transparent 1px)`,
                          }} />
                          <div className="text-center relative z-10">
                            <Icon className="w-24 h-24 mx-auto mb-6" style={{ color: `${service.color}20` }} />
                            <p className="font-display font-bold text-lg text-gray-400">{service.title}</p>
                          </div>
                        </div>
                      </GlowCard>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ VIDEO SHOWCASE ════ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] mb-4">Nuestro Trabajo</h2>
              <p className="text-gray-500 text-lg max-w-[600px] mx-auto">
                Ejemplos reales de proyectos que hemos desarrollado para empresas líderes.
              </p>
            </div>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <StaggerItem key={video.id}>
                <motion.div
                  className="rounded-2xl overflow-hidden bg-white border border-gray-100"
                  whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(15,23,42,0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                      title={video.title}
                      allow="fullscreen"
                      loading="lazy"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <p className="font-display font-bold text-sm text-[#0F172A]">{video.title}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ════ FINAL CTA ════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1890FF, #0050b3)" }}>
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-10 left-[20%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-10 right-[15%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="max-w-[800px] mx-auto relative z-10 text-center px-5">
          <FadeIn>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-5">
              ¿Tu empresa necesita inteligencia de datos?
            </h2>
            <p className="text-white/80 text-lg lg:text-xl max-w-xl mx-auto mb-10">
              Agenda una sesión de diagnóstico gratuita y descubriremos cómo potenciar tu operación con datos.
            </p>
            <Link
              href="/#contacto"
              className="bg-white text-[#1890FF] px-10 py-5 rounded-2xl font-bold text-lg no-underline hover:-translate-y-1 transition-all inline-flex items-center gap-3 shadow-2xl"
            >
              Agendar Diagnóstico <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
