"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BarChart3, Cpu, LineChart,
  CheckCircle2, Building2, Users, Zap, Shield, User, Clock, Check
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, CountUp, GlowCard } from "@/components/shared/AnimatedComponents";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/shared/AuthModal";
import { useEffect } from "react";

const services = [
  {
    icon: BarChart3,
    title: "Dashboards Personalizados",
    description: "Creamos dashboards interactivos en Power BI adaptados a los KPIs de tu empresa. Conectamos múltiples fuentes de datos para una visualización unificada y en tiempo real.",
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
    description: "Automatizamos reportes, flujos de aprobación y procesos repetitivos con Power Automate, Python y herramientas de IA para reducir tiempos operativos.",
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
    description: "Extraemos insights accionables de tus datos. Desde análisis exploratorio hasta modelos predictivos que anticipan la demanda, optimizan inventarios o detectan riesgos.",
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

export default function AsesoriasClient() {
  const [activeTab, setActiveTab] = useState<"empresas" | "particulares">("empresas");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleBuyHours = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      router.push("/pago?servicio=asesoria");
    }
  };

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* ════ HERO ════ */}
      <section className="relative -mt-20 lg:-mt-24 pt-32 lg:pt-44 pb-20 lg:pb-28 overflow-hidden bg-white">
        {/* Network Grid SVG */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 800 600" fill="none">
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
              <Zap size={14} /> Soluciones Estratégicas
            </span>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl text-[#0F172A] mb-6 leading-tight tracking-tight">
              Asesorías en{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">
                Datos & BI
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-gray-500 text-lg lg:text-xl leading-relaxed mb-10 max-w-[600px] mx-auto">
              Transformamos los datos de tu empresa en resultados medibles, y potenciamos tu desarrollo profesional con asesorías 1 a 1 de expertos.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            {/* Tabs Toggle */}
            <div className="bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl inline-flex mb-8 border border-gray-200">
              <button
                onClick={() => setActiveTab("empresas")}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  activeTab === "empresas" ? "bg-white shadow-sm text-[#1890FF]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Building2 size={16} /> Para Empresas
              </button>
              <button
                onClick={() => setActiveTab("particulares")}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  activeTab === "particulares" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <User size={16} /> Para Particulares
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === "empresas" ? (
          <motion.div
            key="empresas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
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

            {/* ════ FINAL CTA EMPRESAS ════ */}
            <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1890FF, #0050b3)" }}>
              <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-10 left-[20%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
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
          </motion.div>
        ) : (
          <motion.div
            key="particulares"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pb-24 bg-white"
          >
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10 mt-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Info Particulares */}
                <div>
                  <h2 className="font-display font-black text-3xl lg:text-4xl text-[#0F172A] mb-6">Mentoring y Asesoría 1 a 1</h2>
                  <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                    Acelera tu aprendizaje o resuelve ese problema técnico que te tiene bloqueado. Agenda sesiones de 1 hora conmigo (Manuel Oliva) y trabajemos juntos en tu proyecto, código o dashboard.
                  </p>
                  
                  <ul className="space-y-5 list-none p-0 m-0 mb-10">
                    {[
                      "Resolución de dudas en Power BI, Python o SQL",
                      "Revisión de portafolio y CV para roles de Datos",
                      "Arquitectura de soluciones y modelado de datos",
                      "Asesoría para proyectos universitarios o tesis"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing Card Particulares */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-[420px] bg-white border border-gray-200 rounded-[2rem] p-8 shadow-[0_20px_50px_-15px_rgba(79,70,229,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-xl text-[#0F172A]">Asesoría Privada</h3>
                        <p className="text-sm text-gray-500 font-medium">Sesión por videollamada</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-end gap-1 mb-2">
                        <span className="text-4xl font-black text-[#0F172A]">$100.000</span>
                        <span className="text-gray-500 font-bold mb-1">CLP / hora</span>
                      </div>
                      <p className="text-sm text-gray-500">Puedes seleccionar más horas en el paso siguiente.</p>
                    </div>

                    <button
                      onClick={handleBuyHours}
                      disabled={loading}
                      className="w-full py-4 rounded-xl font-black text-white transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", boxShadow: "0 12px 25px -8px rgba(79,70,229,0.5)" }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Comprar Horas <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 mt-5 font-medium">
                      Pago 100% seguro procesado por Flow (WebPay, Tarjetas, Transferencia).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
