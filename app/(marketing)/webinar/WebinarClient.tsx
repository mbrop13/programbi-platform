"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Loader2, ArrowRight, Zap, BarChart3, Code, Brain, TrendingUp, Sparkles, ChevronDown, GraduationCap, Clock, Users, Shield } from "lucide-react";
import { companyLogos } from "@/lib/data/images";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";

const TOPICS = [
  { icon: BarChart3, color: "from-red-500 to-orange-500", label: "SQL Server", desc: "Conecta directo al servidor y extrae datos sin intermediarios." },
  { icon: TrendingUp, color: "from-yellow-500 to-amber-500", label: "Power BI", desc: "Dashboards interactivos con DAX que impresionan a cualquier gerencia." },
  { icon: Code, color: "from-blue-500 to-cyan-500", label: "Python", desc: "Automatiza procesos y analiza datos masivos con Pandas." },
  { icon: Brain, color: "from-purple-500 to-pink-500", label: "IA Aplicada", desc: "Usa Inteligencia Artificial para generar código y detectar patrones." },
];

const PROFILES = [
  { emoji: "⏳", title: "Atrapado en Excel", desc: "Pasas horas en reportes manuales que nadie aprovecha.", bg: "bg-amber-50 border-amber-100" },
  { emoji: "🔄", title: "Necesitas automatizar", desc: "Quieres dejar el copy-paste y crear flujos inteligentes.", bg: "bg-blue-50 border-blue-100" },
  { emoji: "🏢", title: "Profesional con datos", desc: "Trabajas en finanzas, operaciones, minería o logística.", bg: "bg-violet-50 border-violet-100" },
  { emoji: "🤖", title: "La IA te preocupa", desc: "Sabes que va a cambiar tu trabajo y quieres ir adelante.", bg: "bg-pink-50 border-pink-100" },
  { emoji: "💰", title: "Quieres crecer", desc: "Buscas un salto de sueldo con herramientas modernas.", bg: "bg-emerald-50 border-emerald-100" },
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
  { icon: GraduationCap, title: "5.000+ Alumnos", desc: "Capacitados en 6 años de trayectoria", color: "text-brand-blue bg-blue-50" },
  { icon: Users, title: "Empresas Líderes", desc: "AngloAmerican, CAP, Deloitte, SQM y más", color: "text-violet-600 bg-violet-50" },
  { icon: Clock, title: "Contenido Práctico", desc: "100% aplicable a tu trabajo real desde el día 1", color: "text-amber-600 bg-amber-50" },
  { icon: Shield, title: "Docentes Expertos", desc: "Magíster Data Science UAI y profesionales top", color: "text-emerald-600 bg-emerald-50" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-gray-200 transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer bg-transparent border-none">
        <span className="font-bold text-gray-900 text-sm sm:text-base pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-5" : "max-h-0"}`}>
        <p className="px-6 text-sm text-gray-500 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function WebinarClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const formLoadedAt = useRef(Date.now());

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
          name: form.name, email: form.email, whatsapp: form.phone || null,
          message: "Inscripción Webinar — De Excel a Analista de Alto Impacto",
          selectedCourses: ["Webinar Mayo 2026"], sourceCourse: "webinar", leadType: "webinar",
          ...getAntiBotFields(formLoadedAt.current, honeypot),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch { setError("Hubo un error. Intenta nuevamente."); }
    finally { setLoading(false); }
  };

  const allLogos = [...companyLogos, ...companyLogos];

  return (
    <div className="bg-white" id="top">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden bg-brand-dark min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 data-grid-pattern opacity-30" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative z-10 container-narrow w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Evento en Vivo · Gratuito</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
                De Excel a{" "}<span className="text-gradient-brand">Analista de Alto Impacto</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                Descubre el roadmap que usan los analistas mejor pagados del mercado y cómo puedes replicarlo con{" "}
                <strong className="text-white">SQL, Power BI, Python e IA</strong>.
              </p>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 max-w-sm mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-indigo-600 rounded-2xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">MAY</span>
                    <span className="text-2xl font-black text-white leading-none">17</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Sábado 17 de Mayo · 11:00 AM</p>
                    <p className="text-slate-400 text-sm">Vía Zoom · Cupos Limitados</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["🗄️ SQL", "📊 Power BI", "🐍 Python", "🤖 IA"].map((t) => (
                  <span key={t} className="bg-white/5 border border-white/10 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg">{t}</span>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/20 max-w-md mx-auto lg:mx-0 lg:ml-auto">
                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">¡Estás inscrito! 🎉</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Revisa tu correo. Te enviaremos el link de Zoom antes del evento.</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-1.5 bg-brand-blue/10 text-brand-blue text-xs font-bold px-3 py-1 rounded-full mb-3">
                        <Sparkles className="w-3 h-3" /> 100% Gratuito
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 mb-1">Reserva tu cupo</h2>
                      <p className="text-sm text-gray-400">Completa el formulario y asegura tu lugar.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Nombre completo *</label>
                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: María González"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-300 focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Email *</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="maria@empresa.com"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-300 focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">WhatsApp <span className="text-gray-300">(opcional)</span></label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+56 9 1234 5678"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-300 focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white outline-none transition-all" />
                      </div>
                      {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                      {/* Honeypot — invisible to humans */}
                      <div style={honeypotStyle} aria-hidden="true">
                        <input type="text" name="_website" autoComplete="off" tabIndex={-1} value={honeypot} onChange={e => setHoneypot(e.target.value)} />
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full btn-gradient text-white font-bold py-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer border-none">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Inscribirme al Webinar</>}
                      </button>
                    </form>
                    <p className="text-center text-[11px] text-gray-300 mt-4">Recibirás el link de Zoom en tu correo al inscribirte.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ LOGO SLIDER ═══════ */}
      <section className="border-y border-gray-100 bg-white py-10 lg:py-14 overflow-hidden">
        <p className="text-center text-sm font-bold text-gray-300 uppercase tracking-[0.2em] mb-8">Empresas que han capacitado con nosotros</p>
        <div className="logo-slider-mask">
          <div className="flex w-max animate-scroll">
            {allLogos.map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="w-[160px] lg:w-[220px] px-4 lg:px-8 flex items-center justify-center shrink-0">
                <Image src={logo.url} alt={logo.name} width={180} height={70} unoptimized
                  className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-400 max-h-[45px] lg:max-h-[60px] w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ BENEFITS STRIP ═══════ */}
      <section className="py-12 bg-surface-1 border-b border-gray-100">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-4 lg:p-5">
                  <div className={`w-10 h-10 rounded-xl ${b.color} flex items-center justify-center shrink-0`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{b.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{b.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ QUÉ VERÁS ═══════ */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">¿Qué verás en el Webinar?</h2>
            <p className="text-gray-500 max-w-md mx-auto">Una sesión intensiva con contenido 100% aplicable a tu trabajo.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOPICS.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-gray-200 transition-all group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{t.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ ¿ES PARA TI? ═══════ */}
      <section className="section-padding bg-surface-1">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">¿Es para ti?</h2>
            <p className="text-gray-500 max-w-md mx-auto">Si te identificas con alguno de estos perfiles, este webinar es para ti.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {PROFILES.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className={`${p.bg} border rounded-2xl p-5 flex items-start gap-4`}>
                <span className="text-2xl shrink-0 mt-0.5">{p.emoji}</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{p.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PREGUNTAS FRECUENTES ═══════ */}
      <section className="section-padding bg-white">
        <div className="container-narrow max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">Preguntas Frecuentes</h2>
            <p className="text-gray-500">Todo lo que necesitas saber antes de inscribirte.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═══════ CTA FINAL ═══════ */}
      <section className="section-padding bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 data-grid-pattern opacity-20" />
        <div className="relative z-10 container-narrow text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">🎁 Bonus para asistentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">No te quedes fuera.</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-4 leading-relaxed">
            Descuento especial en nuestros programas + recursos descargables exclusivos que compartiremos solo en vivo.
          </p>
          <p className="text-white font-bold text-lg mb-8">Sábado 9 de Mayo · 11:00 AM · Vía Zoom</p>
          <a href="#top" className="inline-flex items-center gap-2 btn-gradient text-white font-bold py-4 px-10 rounded-xl text-sm uppercase tracking-wider transition-all">
            <ArrowRight className="w-4 h-4" /> Inscribirme ahora
          </a>
        </div>
      </section>
    </div>
  );
}
