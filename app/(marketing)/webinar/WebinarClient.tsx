"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  CheckCircle, 
  Loader2, 
  ArrowRight, 
  Zap, 
  BarChart3, 
  Code, 
  Brain, 
  TrendingUp, 
  Sparkles, 
  ChevronDown, 
  GraduationCap, 
  Clock, 
  Users, 
  Shield,
  Plus
} from "lucide-react";
import { companyLogos } from "@/lib/data/images";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import { useCountry } from "@/lib/context/CountryContext";
import { FadeIn } from "@/components/shared/AnimatedComponents";

const TOPICS = [
  { icon: BarChart3, color: "from-blue-500 to-indigo-600", label: "SQL Server", desc: "Conecta directo al servidor y extrae datos sin intermediarios." },
  { icon: TrendingUp, color: "from-cyan-400 to-blue-500", label: "Power BI", desc: "Dashboards interactivos con DAX que impresionan a cualquier gerencia." },
  { icon: Code, color: "from-indigo-500 to-purple-600", label: "Python", desc: "Automatiza procesos y analiza datos masivos con Pandas." },
  { icon: Brain, color: "from-purple-500 to-pink-500", label: "IA Aplicada", desc: "Usa Inteligencia Artificial para generar código y detectar patrones." },
];

const PROFILES = [
  { emoji: "⏳", title: "Atrapado en Excel", desc: "Pasas horas en reportes manuales que nadie aprovecha.", bg: "bg-white/70 border-slate-200/60 shadow-sm" },
  { emoji: "🔄", title: "Necesitas automatizar", desc: "Quieres dejar el copy-paste y crear flujos inteligentes.", bg: "bg-white/70 border-slate-200/60 shadow-sm" },
  { emoji: "🏢", title: "Profesional con datos", desc: "Trabajas en finanzas, operaciones, minería o logística.", bg: "bg-white/70 border-slate-200/60 shadow-sm" },
  { emoji: "🤖", title: "La IA te preocupa", desc: "Sabes que va a cambiar tu trabajo y quieres ir adelante.", bg: "bg-white/70 border-slate-200/60 shadow-sm" },
  { emoji: "💰", title: "Quieres crecer", desc: "Buscas un salto de sueldo con herramientas modernas.", bg: "bg-white/70 border-slate-200/60 shadow-sm" },
];

const FAQS = [
  { q: "¿Es realmente gratuito?", a: "Sí, 100% gratuito. No necesitas tarjeta de crédito ni compromiso. Solo tu nombre y correo para enviarte el link de Zoom." },
  { q: "¿Necesito conocimientos previos?", a: "No. El webinar está diseñado para todos los niveles. Explicaremos cada herramienta desde cero y mostraremos el camino paso a paso." },
  { q: "¿Quedará grabado?", a: "Sí, la grabación estará disponible para los inscritos por tiempo limitado. Pero te recomendamos asistir en vivo para participar en la sesión de preguntas." },
  { q: "¿Qué herramientas necesito?", a: "Solo un computador con conexión a internet y Zoom instalado. No necesitas instalar nada más para el webinar." },
  { q: "¿Al final me van a vender algo?", a: "Vamos a compartir contenido real y de valor durante toda la sesión. Al final presentaremos nuestros programas con un descuento exclusivo para asistentes, pero la decisión es 100% tuya." },
  { q: "¿Puedo participar desde fuera de Chile?", a: "¡Claro! El webinar es online vía Zoom. Puedes conectarte desde cualquier país. Solo considera la diferencia horaria." },
];

const BENEFITS = [
  { icon: GraduationCap, title: "5.000+ Alumnos", desc: "Capacitados en 6 años de trayectoria", color: "text-[#1890FF] bg-blue-50/70 border-blue-100/40" },
  { icon: Users, title: "Empresas Líderes", desc: "AngloAmerican, CAP, Deloitte, SQM y más", color: "text-purple-600 bg-purple-50/70 border-purple-100/40" },
  { icon: Clock, title: "Contenido Práctico", desc: "100% aplicable a tu trabajo real desde el día 1", color: "text-amber-600 bg-amber-50/70 border-amber-100/40" },
  { icon: Shield, title: "Docentes Expertos", desc: "Magíster Data Science UAI y profesionales top", color: "text-emerald-600 bg-emerald-50/70 border-emerald-100/40" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
      open 
        ? "border-[#1890FF]/25 bg-blue-50/5 shadow-[0_12px_40px_-12px_rgba(24,144,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)]" 
        : "border-slate-200 bg-slate-50/30 hover:bg-white hover:border-slate-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
    }`}>
      <button 
        onClick={() => setOpen(!open)} 
        className="flex justify-between items-center w-full text-left bg-transparent border-none cursor-pointer p-5 group outline-none select-none"
      >
        <span className={`text-sm md:text-base font-bold pr-4 transition-colors font-sans tracking-tight leading-snug ${
          open ? "text-[#1890FF]" : "text-slate-800"
        }`}>
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
            open ? "bg-[#1890FF] text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
          }`}
        >
          <Plus size={14} className="stroke-[3]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 border-t border-slate-100/50">
              <p className="text-xs md:text-sm text-slate-505 leading-relaxed pt-4 font-sans">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

export default function WebinarClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+56");
  const [showPrefixDropdown, setShowPrefixDropdown] = useState(false);
  const formLoadedAt = useRef(Date.now());

  // Timezone dynamic adaptation
  const { country, convertTime } = useCountry();
  const chileOffset = -4;
  const targetOffset = country.timezone.offset;
  const diff = targetOffset - chileOffset;
  
  const baseHour = 11;
  const localTime = convertTime("11:00");
  
  const targetHourRaw = baseHour + diff;
  const isNextDay = targetHourRaw >= 24;
  const isPrevDay = targetHourRaw < 0;

  const localDateStr = isNextDay 
    ? "Domingo 2 de Agosto" 
    : isPrevDay 
    ? "Viernes 31 de Julio" 
    : "Sábado 1 de Agosto";

  const localDayNumber = isNextDay ? 2 : isPrevDay ? 31 : 1;
  const localMonthStr = isPrevDay ? "JUL" : "AGO";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, 
          email: form.email, 
          whatsapp: form.phone ? `${phonePrefix}${form.phone}` : null,
          message: "Inscripción Webinar — De Excel a Analista de Alto Impacto",
          selectedCourses: ["Webinar Agosto 2026"], 
          leadType: "webinar",
          sourceCourse: "webinar",
          ...getAntiBotFields(formLoadedAt.current, honeypot),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch { 
      setError("Hubo un error. Intenta nuevamente."); 
    } finally { 
      setLoading(false); 
    }
  };

  const allLogos = [...companyLogos, ...companyLogos];

  return (
    <div className="bg-white text-slate-900 min-h-screen relative overflow-hidden font-sans" id="top">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center min-h-[90vh]">
        {/* Glow backdrop points (light/soft accent) */}
        <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-20 left-[-10%] w-[600px] h-[600px] bg-indigo-100/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[1250px] mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 text-left">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 bg-blue-50/70 border border-blue-100/40 backdrop-blur-sm rounded-full px-4.5 py-2 mb-6 shadow-sm select-none">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1890FF]" />
                  </span>
                  <span className="text-[10px] font-black text-[#1890FF] uppercase tracking-widest">Evento en Vivo · 100% Gratuito</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-950 leading-[1.1] mb-6 font-display tracking-tight">
                  De Excel a <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">
                    Analista de Alto Impacto
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8 max-w-xl font-light">
                  Descubre el roadmap definitivo que utilizan los ingenieros de datos y analistas mejor valorados en el mercado. Aprende a dominar <strong className="text-slate-800 font-semibold">SQL, Power BI, Python e IA</strong> sin necesidad de conocimientos previos.
                </p>
                
                {/* Dynamic Timezone Calendar Box */}
                <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-5 mb-8 flex items-center gap-5 max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] select-none">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1890FF] to-indigo-600 border border-blue-400/10 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-[0_6px_20px_rgba(24,144,255,0.2)]">
                    <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">{localMonthStr}</span>
                    <span className="text-2xl font-black text-white leading-none mt-0.5">{localDayNumber}</span>
                  </div>
                  <div>
                    <p className="text-slate-900 font-extrabold text-base sm:text-lg leading-snug">{localDateStr}</p>
                    <p className="text-slate-555 text-xs sm:text-sm font-semibold mt-1 flex items-center gap-1.5">
                      <Clock size={13} className="text-[#1890FF]" />
                      <span>{localTime} hrs ({country.name})</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>Vía Zoom</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 select-none">
                  {["🗄️ SQL Server", "📊 Power BI", "🐍 Python", "🤖 IA Aplicada"].map((t) => (
                    <span key={t} className="bg-slate-50 border border-slate-200/60 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-5">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-full"
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(24,144,255,0.04)] border border-slate-200/60 max-w-md mx-auto lg:mx-0 lg:ml-auto relative overflow-hidden">
                  {success ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-50 border border-emerald-200/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">¡Cupo Reservado! 🎉</h3>
                      <p className="text-slate-550 text-sm leading-relaxed max-w-xs mx-auto">
                        Te hemos enviado los accesos de registro inicial a tu correo. Te enviaremos el link de Zoom antes del evento.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-1.5 bg-blue-50/70 border border-blue-100/40 text-[#1890FF] text-[10px] font-black px-3.5 py-1.5 rounded-full mb-3 shadow-sm select-none uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" /> Acceso Gratis Limitado
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Reserva tu lugar</h2>
                        <p className="text-xs text-slate-500">Ingresa tus datos y asegura tu acceso directo.</p>
                      </div>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Nombre completo *</label>
                          <input 
                            type="text" 
                            required 
                            value={form.name} 
                            onChange={(e) => setForm({ ...form, name: e.target.value })} 
                            placeholder="Ej: María González"
                            className="w-full px-4 py-3 bg-slate-55/40 border border-slate-200/80 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100/30 outline-none transition-all" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Correo de trabajo *</label>
                          <input 
                            type="email" 
                            required 
                            value={form.email} 
                            onChange={(e) => setForm({ ...form, email: e.target.value })} 
                            placeholder="maria@empresa.com"
                            className="w-full px-4 py-3 bg-slate-55/40 border border-slate-200/80 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100/30 outline-none transition-all" 
                          />
                        </div>
                        
                        <div className="space-y-2 relative">
                          <label className="block text-[10px] font-bold text-slate-400 tracking-widest uppercase">WhatsApp <span className="text-slate-400 normal-case">(opcional)</span></label>
                          <div className="flex items-stretch">
                            <div className="relative">
                              <button 
                                type="button" 
                                onClick={() => setShowPrefixDropdown(!showPrefixDropdown)}
                                className="h-full px-3 py-3.5 bg-slate-55/40 border border-slate-200/80 border-r-0 rounded-l-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors select-none outline-none"
                              >
                                <img src={`https://flagcdn.com/w20/${COUNTRIES.find(c => c.code === phonePrefix)?.iso}.png`} alt="" className="w-4 h-auto rounded-[2px]" />
                                <span>{phonePrefix}</span>
                                <ChevronDown className="text-slate-400" size={13} />
                              </button>
                              
                              <AnimatePresence>
                                {showPrefixDropdown && (
                                  <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowPrefixDropdown(false)} />
                                    <motion.div 
                                      initial={{ opacity: 0, y: -5 }} 
                                      animate={{ opacity: 1, y: 0 }} 
                                      exit={{ opacity: 0, y: -5 }}
                                      className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-20"
                                    >
                                      <div className="max-h-56 overflow-y-auto py-1.5 scrollbar-thin">
                                        {COUNTRIES.map((country, idx) => (
                                          <button 
                                            key={idx} 
                                            type="button" 
                                            onClick={() => { setPhonePrefix(country.code); setShowPrefixDropdown(false); }}
                                            className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer outline-none"
                                          >
                                            <span className="flex-shrink-0 mr-1"><img src={`https://flagcdn.com/w20/${country.iso}.png`} alt="" className="w-4 h-auto rounded-[2px]" /></span>
                                            <span className="font-bold text-slate-800">{country.name}</span>
                                            <span className="text-slate-400 font-mono text-[10px] ml-auto">{country.code}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                            <input 
                              type="tel" 
                              value={form.phone} 
                              onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                              placeholder="9 1234 5678"
                              className="w-full px-4 py-3 bg-slate-55/40 border border-slate-200/80 rounded-r-xl text-sm text-slate-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100/30 outline-none transition-all" 
                            />
                          </div>
                        </div>

                        {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                        
                        {/* Honeypot — invisible to humans */}
                        <div style={honeypotStyle} aria-hidden="true">
                          <input type="text" name="_website" autoComplete="off" tabIndex={-1} value={honeypot} onChange={e => setHoneypot(e.target.value)} />
                        </div>

                        <button 
                          type="submit" 
                          disabled={loading}
                          className="w-full py-4 rounded-xl text-white font-bold text-sm flex justify-center items-center gap-2.5 transition-all disabled:opacity-70 border-none cursor-pointer shadow-lg hover:shadow-xl group/btn"
                          style={{ 
                            background: "linear-gradient(135deg, #1890FF, #0050b3)", 
                            boxShadow: "0 8px 30px -4px rgba(24,144,255,0.25)" 
                          }}
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span>Reservar mi Cupo</span> 
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                            </>
                          )}
                        </button>
                      </form>
                      <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed select-none">
                        Te enviaremos el correo de confirmación de forma inmediata.
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ LOGO SLIDER (Light Themed) ═══════ */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-10 lg:py-14 overflow-hidden select-none">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.25em] mb-8">
          Empresas que entrenan sus equipos con nosotros
        </p>
        <div className="relative w-full flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-max animate-scroll">
            {allLogos.map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="w-[160px] lg:w-[220px] px-4 lg:px-8 flex items-center justify-center shrink-0">
                <Image 
                  src={logo.url} 
                  alt={logo.name} 
                  width={180} 
                  height={70} 
                  className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-400 max-h-[40px] lg:max-h-[50px] w-auto object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ BENEFITS STRIP ═══════ */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-3.5 bg-slate-50/40 border border-slate-200/60 rounded-2xl p-5 hover:border-slate-350 hover:bg-white hover:shadow-md transition-all h-full">
                    <div className={`w-10 h-10 rounded-xl ${b.color} border flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 text-sm">{b.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">{b.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ QUÉ VERÁS ═══════ */}
      <section className="py-20 lg:py-28 bg-white relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/70 border border-blue-100/40 text-[#1890FF] text-[10px] font-black uppercase tracking-wider mb-3">
              Temario del Evento
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight mb-4 font-display">
              ¿Qué verás en el Webinar?
            </h2>
            <p className="text-sm sm:text-base text-slate-550 max-w-xl mx-auto leading-relaxed">
              Una sesión intensiva estructurada de forma práctica con desafíos y códigos reales de negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOPICS.map((t, i) => {
              const Icon = t.icon;
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-slate-50/40 border border-slate-200/60 rounded-2.5rem p-6.5 hover:shadow-[0_15px_35px_rgba(24,144,255,0.04)] hover:border-slate-350 hover:bg-white transition-all group h-full flex flex-col text-left">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2.5 text-base sm:text-lg">{t.label}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{t.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ ¿ES PARA TI? ═══════ */}
      <section className="py-20 lg:py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/70 border border-indigo-100/40 text-indigo-500 text-[10px] font-black uppercase tracking-wider mb-3">
              Perfiles Clave
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight mb-4 font-display">
              ¿Es para ti?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              El webinar está diseñado para profesionales que buscan liderar la transformación digital en sus áreas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {PROFILES.map((p, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className={`${p.bg} border rounded-[2rem] p-5 flex flex-col items-start text-left h-full transition-all hover:bg-white hover:border-slate-300 hover:shadow-sm`}>
                  <span className="text-3xl mb-4.5 block">{p.emoji}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">{p.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{p.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PREGUNTAS FRECUENTES ═══════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight mb-4 font-display">
              Preguntas Frecuentes
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              Todo lo que necesitas saber antes de asegurar tu cupo de acceso.
            </p>
          </div>
          <div className="space-y-4">
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═══════ CTA FINAL (High Impact Light Panel) ═══════ */}
      <section className="py-24 relative overflow-hidden select-none">
        <div
          className="absolute inset-0 z-0 animate-gradient-bg"
          style={{
            background: "linear-gradient(135deg, #1890FF 0%, #0050b3 30%, #1890FF 60%, #40a9ff 100%)",
            backgroundSize: "400% 400%",
          }}
        />
        {/* Floating orbs */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-[10%] w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-[15%] w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 rounded-full px-4.5 py-2 mb-6">
            <span className="text-white text-[10px] font-black uppercase tracking-wider">🎁 Beneficio Exclusivo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6 font-display max-w-3xl mx-auto">
            Asegura tu lugar en el Webinar antes de que se agoten los accesos
          </h2>

          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto mb-6 leading-relaxed">
            Compartiremos guías descargables de SQL y Power BI al final de la sesión y activaremos descuentos especiales válidos únicamente para los asistentes en vivo.
          </p>

          <p className="text-white font-black text-lg sm:text-xl mb-10 font-sans tracking-tight">
            {localDateStr} • {localTime} hrs • Vía Zoom
          </p>

          <a 
            href="#top" 
            className="inline-flex items-center gap-2.5 bg-white text-[#1890FF] font-bold py-4 px-10 rounded-xl text-xs uppercase tracking-widest transition-all no-underline shadow-2xl hover:-translate-y-1 group/cta"
          >
            <span>Inscribirme Gratis Ahora</span> 
            <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" />
          </a>
        </div>
        
        <style jsx>{`
          @keyframes gradient-bg-anim {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-bg {
            animation: gradient-bg-anim 8s ease infinite;
          }
        `}</style>
      </section>
    </div>
  );
}
