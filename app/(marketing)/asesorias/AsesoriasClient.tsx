"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BarChart3, Cpu, LineChart,
  CheckCircle2, Building2, Users, Zap, Shield, User, Clock, Check, Target, Rocket, Lock, Unlock, TrendingUp, Lightbulb, Search, Database
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, GlowCard, CountUp } from "@/components/shared/AnimatedComponents";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/shared/AuthModal";

// --- Data ---
const bentoFeatures = [
  {
    colSpan: "lg:col-span-2",
    icon: BarChart3,
    title: "Dashboards de Clase Mundial",
    description: "Transformamos datos complejos en dashboards de Power BI intuitivos que cuentan una historia. Conectamos ERPs, CRMs y bases de datos para una visualización unificada.",
    color: "#1890FF",
    bg: "bg-blue-50"
  },
  {
    colSpan: "lg:col-span-1",
    icon: Cpu,
    title: "Automatización IA",
    description: "Implementamos agentes de IA y flujos con Power Automate para eliminar tareas repetitivas y errores humanos.",
    color: "#7C3AED",
    bg: "bg-purple-50"
  },
  {
    colSpan: "lg:col-span-1",
    icon: LineChart,
    title: "Ciencia de Datos",
    description: "Modelos predictivos que anticipan tendencias y optimizan la toma de decisiones estratégicas.",
    color: "#10B981",
    bg: "bg-emerald-50"
  },
  {
    colSpan: "lg:col-span-2",
    icon: Shield,
    title: "Cultura Data-Driven",
    description: "No solo entregamos software; capacitamos a tu equipo y establecemos gobernanza para que la empresa respire datos de forma segura y eficiente.",
    color: "#F59E0B",
    bg: "bg-amber-50"
  }
];

const videos = [
  { id: "LiupEKDc3Ms", title: "Dashboard de Ventas Power BI" },
  { id: "7197F-yNw04", title: "Automatización de Reportes" },
  { id: "csPtN5bI_cw", title: "Análisis con Python" },
];

const stats = [
  { icon: Building2, value: 50, suffix: "+", label: "Empresas", color: "text-blue-500" },
  { icon: Users, value: 5000, suffix: "+", label: "Alumnos", color: "text-indigo-500" },
  { icon: Zap, value: 200, suffix: "+", label: "Proyectos", color: "text-purple-500" },
  { icon: Shield, value: 98, suffix: "%", label: "Éxito", color: "text-emerald-500" },
];

export default function AsesoriasClient() {
  const [activeTab, setActiveTab] = useState<"empresas" | "particulares">("particulares");
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
    <div className="bg-[#FAFAFA] min-h-screen">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* ════ HERO SALES MACHINE ════ */}
      <section className="relative -mt-20 lg:-mt-24 pt-32 lg:pt-48 pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 800 600" fill="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15], rotate: [0, 90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], y: [0, 100, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-300 to-blue-200 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-[1000px] mx-auto px-5 lg:px-10 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200 text-gray-800 font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-full mb-8">
              <span className="relative flex h-2.5 w-2.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              Soluciones de Alto Impacto
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#0F172A] mb-8 leading-[1.1] tracking-tight">
              Domina tus datos,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-[#6366F1]">
                impulsa tu éxito
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-gray-500 text-xl leading-relaxed mb-12 max-w-[700px] mx-auto font-medium">
              Ya seas una empresa buscando eficiencia o un profesional buscando mentoría, estamos aquí para convertir tu información en resultados extraordinarios.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            {/* Tabs Toggle - REORDERED: Particulares Left, Empresas Right */}
            <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl inline-flex mb-12 border border-gray-200 shadow-xl shadow-blue-900/5 flex-col sm:flex-row gap-2">
              <button
                onClick={() => setActiveTab("particulares")}
                className={`px-8 py-4 rounded-xl font-black text-sm lg:text-base transition-all flex justify-center items-center gap-2.5 relative w-full sm:w-auto ${
                  activeTab === "particulares" ? "text-white shadow-lg" : "text-gray-500 hover:text-gray-900"
                }`}
                style={activeTab === "particulares" ? { background: "linear-gradient(135deg, #4F46E5, #7C3AED)" } : {}}
              >
                <User size={18} /> Mentoría 1 a 1
              </button>
              <button
                onClick={() => setActiveTab("empresas")}
                className={`px-8 py-4 rounded-xl font-black text-sm lg:text-base transition-all flex justify-center items-center gap-2.5 relative w-full sm:w-auto ${
                  activeTab === "empresas" ? "text-white shadow-lg" : "text-gray-500 hover:text-gray-900"
                }`}
                style={activeTab === "empresas" ? { background: "linear-gradient(135deg, #1890FF, #4F46E5)" } : {}}
              >
                <Building2 size={18} /> Soluciones B2B
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════ PREMIUM STATS GRID ════ */}
      <section className="py-12 -mt-12 relative z-20">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 md:p-8 text-center shadow-xl shadow-gray-200/50 group hover:bg-white transition-all hover:-translate-y-1">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                    <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-tighter mb-1">
                    <CountUp target={stat.value} duration={2.5} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === "empresas" ? (
          <motion.div
            key="empresas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pb-24 pt-12"
          >
            {/* ════ WHY PROGRAMBI / HOW WE HELP ════ */}
            <section className="py-20 bg-white rounded-[4rem] mx-4 lg:mx-10 border border-gray-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 transform origin-right"></div>
              <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 block">Nuestro Impacto</span>
                    <h2 className="font-display font-medium text-4xl lg:text-6xl text-[#0F172A] mb-8 leading-tight">
                      <span className="text-[#1890FF]">Empoderamos a tu empresa con la</span> <span className="font-serif italic text-[#0F172A]">verdad de los datos.</span>
                    </h2>
                    <p className="text-gray-500 text-xl leading-relaxed mb-10 font-medium">
                      No solo creamos dashboards; construimos la infraestructura que permite a los gerentes tomar decisiones en segundos, no en días.
                    </p>
                    
                    <div className="space-y-6">
                      {[
                        { icon: TrendingUp, t: "Reducción de Costos", d: "Optimizamos procesos operativos eliminando redundancias y tareas manuales ineficientes." },
                        { icon: Lightbulb, t: "Celeridad Estratégica", d: "Información disponible 24/7 para que la estrategia se base en realidades, no en intuiciones." },
                        { icon: Search, t: "Transparencia Total", d: "Métricas estandarizadas para que todos en la organización hablen el mismo idioma." }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-5">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                            <item.icon size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-[#0F172A] text-lg mb-1">{item.t}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[3rem] p-8 border border-gray-800 relative overflow-hidden aspect-[4/5] lg:aspect-square flex items-center justify-center shadow-2xl">
                      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400" fill="none">
                        <defs>
                          <pattern id="grid-small" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1890FF" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-small)" />
                      </svg>
                      
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {/* Central Core */}
                        <motion.div 
                          animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px #1890FF", "0 0 60px #1890FF", "0 0 0px #1890FF"] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center relative z-20 border-4 border-blue-400 shadow-[0_0_30px_#1890FF]"
                        >
                          <Database className="w-10 h-10 text-white" />
                        </motion.div>

                        {/* Orbiting Elements */}
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
                          className="absolute w-64 h-64 border border-blue-500/30 rounded-full flex items-center justify-center"
                        >
                          <div className="absolute -top-3 w-6 h-6 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399]" />
                          <div className="absolute -bottom-3 w-6 h-6 rounded-full bg-purple-400 shadow-[0_0_15px_#c084fc]" />
                        </motion.div>
                        
                        <motion.div 
                          animate={{ rotate: -360 }} 
                          transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
                          className="absolute w-80 h-80 border border-indigo-500/20 rounded-full flex items-center justify-center"
                        >
                          <div className="absolute -left-3 w-6 h-6 rounded-full bg-blue-400 shadow-[0_0_15px_#60a5fa]" />
                          <div className="absolute -right-3 w-6 h-6 rounded-full bg-amber-400 shadow-[0_0_15px_#fbbf24]" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ════ BENTO GRID SERVICES ════ */}
            <section className="py-24">
              <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-[#0F172A] mb-4">Soluciones End-to-End</h2>
                  <p className="text-gray-500 text-lg font-medium">Desde la ingesta de datos hasta la capacitación del último usuario de la compañía.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {bentoFeatures.map((feature, i) => (
                    <FadeIn key={i} delay={i * 0.1} className={`h-full ${feature.colSpan}`}>
                      <GlowCard glowColor={`${feature.color}30`} className="h-full">
                        <div className="bg-white border border-gray-200 rounded-[2rem] p-8 lg:p-10 h-full flex flex-col hover:border-blue-200 transition-colors shadow-sm">
                          <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-8`} style={{ color: feature.color }}>
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

            {/* ════ VIDEO SHOWCASE MOCKUPS ════ */}
            <section className="py-24 bg-white border-y border-gray-100">
              <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
                <FadeIn>
                  <div className="text-center mb-16">
                    <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] mb-4">Resultados Tangibles</h2>
                    <p className="text-gray-500 text-lg max-w-[600px] mx-auto font-medium">
                      Casos de éxito reales que demuestran nuestra capacidad técnica.
                    </p>
                  </div>
                </FadeIn>
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {videos.map((video) => (
                    <StaggerItem key={video.id}>
                      <div className="bg-gray-50 rounded-[2rem] p-4 border border-gray-200 shadow-sm transition-transform hover:-translate-y-2">
                        <div className="rounded-xl overflow-hidden bg-white relative aspect-video shadow-inner">
                          <iframe
                            src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                            title={video.title}
                            allow="fullscreen"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                        <div className="mt-5 px-2 text-center pb-2">
                          <p className="font-display font-bold text-sm text-[#0F172A] uppercase tracking-wider">{video.title}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              </div>
            </section>

            {/* ════ FINAL CTA EMPRESAS ════ */}
            <section className="py-32 relative overflow-hidden bg-[#0F172A] m-5 lg:m-10 rounded-[3rem]">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px]" />
              <div className="max-w-[800px] mx-auto relative z-10 text-center px-5">
                <FadeIn>
                  <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
                    Hablemos de tu Proyecto
                  </h2>
                  <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
                    Agenda una sesión de diagnóstico gratuita de 30 minutos. Analizaremos tu arquitectura actual y propondremos un roadmap de mejoras.
                  </p>
                  <Link
                    href="/#contacto"
                    className="bg-white text-[#0F172A] px-10 py-5 rounded-2xl font-black text-lg no-underline hover:-translate-y-1 transition-all inline-flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
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
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pb-24 pt-12"
          >
            {/* ════ B2C VALUE PROP ════ */}
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10 mt-16">
              <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                
                {/* Info Particulares */}
                <div className="lg:col-span-7">
                  <FadeIn>
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-lg mb-6">
                      <Rocket size={14} /> Acelera tu Carrera
                    </div>
                    <h2 className="font-display font-black text-4xl lg:text-5xl text-[#0F172A] mb-6 leading-tight">
                      Desbloquea ese problema que te lleva frenando días.
                    </h2>
                    <p className="text-gray-500 text-xl mb-10 leading-relaxed font-medium">
                      Sesiones de 1 hora de alta intensidad conmigo (Manuel Oliva). Revisaremos tu pantalla, corregiremos DAX, estructuraremos tu SQL o mejoraremos tu portafolio en vivo.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-6 mb-10">
                      {[
                        "Auditoría de DAX y Modelado",
                        "Revisión de Portafolio y CV",
                        "Arquitectura de Datos",
                        "Consultoría para Tesis"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-indigo-600" />
                          </div>
                          <span className="text-gray-800 font-bold text-sm leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                </div>

                {/* Sales Machine Pricing Card */}
                <div className="lg:col-span-5 relative">
                  <FadeIn delay={0.2}>
                    {/* Decorative background glow behind the card */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[3rem] blur-2xl opacity-20 transform scale-95 translate-y-4"></div>
                    
                    <div className="bg-white border-2 border-blue-400 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)] mt-6">
                      {/* PROMO BADGE */}
                      <div className="absolute top-0 inset-x-0 flex justify-center z-20">
                        <span className="bg-blue-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-6 py-1.5 rounded-b-xl shadow-lg shadow-blue-500/30">
                          40% OFF - Primera compra
                        </span>
                      </div>

                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="font-display font-black text-2xl text-[#0F172A]">Asesoría Privada</h3>
                          <p className="text-gray-500 font-medium mt-1">Videollamada 1 a 1</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                          <Target className="w-7 h-7" />
                        </div>
                      </div>

                      <div className="mb-10 bg-gray-50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden">
                        {/* Conditional Price Rendering */}
                        {loading ? (
                          <div className="h-16 animate-pulse bg-gray-200 rounded-lg"></div>
                        ) : user ? (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-gray-400 line-through font-bold text-xl">$100.000</span>
                              <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full">40% DTO</span>
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="text-5xl font-black text-[#0F172A] tracking-tight">$60.000</span>
                              <span className="text-gray-500 font-bold mb-1.5 uppercase text-sm">CLP / hr</span>
                            </div>
                            <span className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-widest">
                               ~ $66 USD (Ref $900/USD)
                            </span>
                          </motion.div>
                        ) : (
                          <div className="relative z-10 flex flex-col items-center justify-center text-center py-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                              <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="font-bold text-gray-800 text-sm">Contenido Protegido</p>
                            <p className="text-xs text-gray-500 mt-1">Inicia sesión para descubrir el valor.</p>
                          </div>
                        )}
                      </div>

                      <ul className="space-y-4 mb-10">
                        <li className="flex items-center gap-3 text-sm font-medium text-gray-600">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Agenda flexible según tu horario
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium text-gray-600">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Grabación de la sesión incluida
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium text-gray-600">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Selecciona horas múltiples al pagar
                        </li>
                      </ul>

                      <button
                        onClick={handleBuyHours}
                        disabled={loading}
                        className="w-full py-5 rounded-2xl font-black text-white text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50"
                        style={
                          user 
                          ? { background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", boxShadow: "0 15px 30px -10px rgba(79,70,229,0.5)" }
                          : { background: "#0F172A", boxShadow: "0 15px 30px -10px rgba(15,23,42,0.4)" }
                        }
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {user ? (
                            <>Comprar Horas <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                          ) : (
                            <>Iniciar Sesión <Unlock className="w-5 h-5" /></>
                          )}
                        </span>
                      </button>
                      
                      <p className="text-center text-[11px] text-gray-400 mt-6 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                        <Shield className="w-3 h-3" /> Pago 100% seguro vía Flow
                      </p>
                    </div>
                  </FadeIn>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
