"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BarChart3, Cpu, LineChart,
  CheckCircle2, Building2, Users, Zap, Shield, User, Clock, Check, Target, Rocket, Lock, Unlock
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, GlowCard } from "@/components/shared/AnimatedComponents";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/shared/AuthModal";

// --- Data ---
const bentoFeatures = [
  {
    colSpan: "lg:col-span-2",
    icon: BarChart3,
    title: "Dashboards Interactivos",
    description: "Transformamos datos en bruto en Power BI, adaptados a tus KPIs críticos. Conectamos ERPs, CRMs y bases de datos para visualización en tiempo real.",
    color: "#1890FF",
    bg: "bg-blue-50"
  },
  {
    colSpan: "lg:col-span-1",
    icon: Cpu,
    title: "Automatización",
    description: "Flujos en Power Automate y Python para eliminar el 80% de tus tareas manuales.",
    color: "#7C3AED",
    bg: "bg-purple-50"
  },
  {
    colSpan: "lg:col-span-1",
    icon: LineChart,
    title: "Modelos Predictivos",
    description: "Anticipa la demanda y optimiza inventarios con Machine Learning avanzado.",
    color: "#10B981",
    bg: "bg-emerald-50"
  },
  {
    colSpan: "lg:col-span-2",
    icon: Shield,
    title: "Gobernanza de Datos",
    description: "Aseguramos que tu información sea precisa, segura y accesible solo para quienes la necesitan, implementando las mejores prácticas empresariales.",
    color: "#F59E0B",
    bg: "bg-amber-50"
  }
];

const videos = [
  { id: "LiupEKDc3Ms", title: "Dashboard de Ventas Power BI" },
  { id: "7197F-yNw04", title: "Automatización de Reportes" },
  { id: "csPtN5bI_cw", title: "Análisis con Python" },
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
    <div className="bg-[#FAFAFA] min-h-screen">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* ════ HERO SALES MACHINE ════ */}
      <section className="relative -mt-20 lg:-mt-24 pt-32 lg:pt-48 pb-24 overflow-hidden bg-white">
        {/* Dynamic Background */}
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
              Eleva tu Nivel de Análisis
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#0F172A] mb-8 leading-[1.1] tracking-tight">
              Convierte los datos en tu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-[#6366F1]">
                ventaja injusta
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-gray-500 text-xl leading-relaxed mb-12 max-w-[700px] mx-auto font-medium">
              Acelera el crecimiento de tu empresa con soluciones BI a medida, o impulsa tu carrera con mentorías técnicas exclusivas 1 a 1.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            {/* Ultra Premium Tabs Toggle */}
            <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl inline-flex mb-12 border border-gray-200 shadow-xl shadow-blue-900/5 flex-col sm:flex-row gap-2">
              <button
                onClick={() => setActiveTab("empresas")}
                className={`px-8 py-4 rounded-xl font-black text-sm lg:text-base transition-all flex justify-center items-center gap-2.5 relative w-full sm:w-auto ${
                  activeTab === "empresas" ? "text-white shadow-lg" : "text-gray-500 hover:text-gray-900"
                }`}
                style={activeTab === "empresas" ? { background: "linear-gradient(135deg, #1890FF, #4F46E5)" } : {}}
              >
                <Building2 size={18} /> Soluciones B2B
              </button>
              <button
                onClick={() => setActiveTab("particulares")}
                className={`px-8 py-4 rounded-xl font-black text-sm lg:text-base transition-all flex justify-center items-center gap-2.5 relative w-full sm:w-auto ${
                  activeTab === "particulares" ? "text-white shadow-lg" : "text-gray-500 hover:text-gray-900"
                }`}
                style={activeTab === "particulares" ? { background: "linear-gradient(135deg, #4F46E5, #7C3AED)" } : {}}
              >
                <User size={18} /> Mentoría 1 a 1
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════ SOCIAL PROOF STRIP ════ */}
      <div className="border-y border-gray-200 bg-white py-6 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 flex flex-wrap justify-center items-center gap-8 lg:gap-16 text-gray-400 font-bold text-sm lg:text-base tracking-widest uppercase">
          <span className="flex items-center gap-2"><Building2 size={18}/> +50 Empresas</span>
          <span className="flex items-center gap-2"><Users size={18}/> +1500 Alumnos</span>
          <span className="flex items-center gap-2"><Zap size={18}/> +200 Proyectos</span>
          <span className="flex items-center gap-2 text-emerald-500"><Shield size={18}/> 98% Satisfacción</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "empresas" ? (
          <motion.div
            key="empresas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pb-24"
          >
            {/* ════ BENTO GRID SERVICES ════ */}
            <section className="py-24">
              <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-[#0F172A] mb-4">¿Tomando decisiones a ciegas?</h2>
                  <p className="text-gray-500 text-lg">Centralizamos tu información y automatizamos tus flujos para que te enfoques en la estrategia, no en la operativa.</p>
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
                    <p className="text-gray-500 text-lg max-w-[600px] mx-auto">
                      Conoce cómo hemos transformado la operación de nuestros clientes.
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
            className="pb-24"
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
                    
                    <div className="bg-white border-2 border-indigo-50 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                      
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
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                            <span className="text-5xl font-black text-[#0F172A] tracking-tight">$100.000</span>
                            <span className="text-gray-500 font-bold mb-1.5 uppercase text-sm">CLP / hr</span>
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
