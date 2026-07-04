"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Video, BookOpen, Sparkles, Check, Zap, ArrowRight } from "lucide-react";

const features = [
  {
    badge: "En Vivo",
    icon: Video,
    title: (
      <>
        Clases en vivo <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-black">100% prácticas</span>
      </>
    ),
    subtitle:
      "No solo teoría. Aquí practicas en tiempo real con las herramientas que usan las empresas líderes de Latinoamérica.",
    bullets: [
      "Masterclasses semanales con expertos de la industria",
      "Practica SQL, Python y Power BI en tiempo real",
      "Resuelve casos de negocio reales junto al profesor",
      "Pregunta y recibe feedback al instante",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Dashboard_Cursos_Power_BI.png?v=1770535026",
    imageLabel: "Dashboard Power BI en vivo",
    gradientCard: "from-blue-600 to-indigo-800",
    glowBorder: "from-blue-400 via-cyan-300 to-indigo-500",
    glowShadow: "rgba(59,130,246,0.4)",
    accent: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-100",
    actionText: "Ver agenda de clases",
    floaters: [
      { text: "Live: Activo", icon: "🟢", position: "top-[-10px] left-[15px]" },
      { text: "+140 Alumnos", icon: "👥", position: "bottom-[15px] right-[10px]" }
    ]
  },
  {
    badge: "A Tu Ritmo",
    icon: BookOpen,
    title: (
      <>
        Material completo y <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 font-black">clases grabadas</span>
      </>
    ),
    subtitle:
      "Todo el contenido disponible 24/7. Repasa, practica y refuerza a tu propio ritmo sin perder ni un detalle.",
    bullets: [
      "Clases grabadas en HD disponibles para siempre",
      "Guías, datasets y ejercicios descargables",
      "Aulas virtuales interactivas en tu navegador",
      "Rutas de aprendizaje estructuradas paso a paso",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Foto_Modelo_de_Datos_en_Power_BI.png?v=1770535026",
    imageLabel: "Modelado de datos",
    gradientCard: "from-emerald-600 to-teal-800",
    glowBorder: "from-emerald-400 via-teal-300 to-cyan-500",
    glowShadow: "rgba(16,185,129,0.4)",
    accent: "text-emerald-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    actionText: "Explorar material de estudio",
    floaters: [
      { text: "Modelo de datos", icon: "📊", position: "top-[-10px] right-[15px]" },
      { text: "Datasets listos", icon: "⚡", position: "bottom-[15px] left-[10px]" }
    ]
  },
  {
    badge: "IA Integrada",
    icon: Sparkles,
    title: (
      <>
        Tu asistente IA con los <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 font-black">mejores modelos</span>
      </>
    ),
    subtitle:
      "Potenciado con los LLMs más avanzados del mercado. Pregunta, genera código y resuelve dudas al instante.",
    bullets: [
      "Acceso a los modelos de IA más potentes disponibles",
      "Genera código SQL, Python y DAX al instante",
      "Resuelve errores y optimiza tus consultas con IA",
      "Disponible 24/7 como tu mentor personal de datos",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Python_Codigos_de_Clases.png?v=1770535025",
    imageLabel: "Código Python asistido por IA",
    gradientCard: "from-violet-600 to-purple-800",
    glowBorder: "from-violet-400 via-fuchsia-300 to-purple-500",
    glowShadow: "rgba(139,92,246,0.4)",
    accent: "text-violet-600",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-100",
    actionText: "Probar Asistente IA",
    floaters: [
      { text: "IA: Conectada", icon: "✨", position: "top-[-10px] left-[15px]" },
      { text: "SQL Generator", icon: "🚀", position: "bottom-[15px] right-[10px]" }
    ]
  },
];

export default function CommunityFeatures() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.25] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-20 lg:py-32 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20 lg:mb-28"
        >
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-bold text-[11px] tracking-[0.2em] uppercase px-4.5 py-2.5 rounded-full mb-6 border border-blue-100/50 shadow-sm shadow-blue-500/5">
            <Zap size={13} className="animate-pulse" /> Lo que incluye tu membresía
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[2.75rem] text-slate-900 leading-tight mb-5">
            Todo lo que necesitas para{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">dominar los datos</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            Un ecosistema completo diseñado para que aprendas, practiques y
            crezcas como analista de datos profesional.
          </p>
        </motion.div>

        {/* Zigzag feature rows */}
        <div className="space-y-24 lg:space-y-36">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isReversed = i % 2 === 1; // odd = image left, text right

            if (i === 2) {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="w-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-purple-950 text-white rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-[0_24px_70px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden"
                >
                  {/* Grid de fondo punteado */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none opacity-40" />

                  {/* Resplandor radial de fondo */}
                  <div className="absolute -right-16 -top-16 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Contenido de texto (Col 1) */}
                    <div className="max-w-xl">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 font-bold text-[11px] tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-full mb-6 text-violet-300">
                        <Icon size={14} />
                        {f.badge}
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-[2.25rem] text-white leading-tight mb-4 tracking-tight">
                        {f.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-slate-300 text-base lg:text-lg leading-relaxed mb-8 font-medium">
                        {f.subtitle}
                      </p>

                      {/* Bullet list */}
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {f.bullets.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-3 group/item">
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-violet-500/15 flex items-center justify-center shrink-0 border border-transparent group-hover/item:scale-110 transition-transform duration-300">
                              <Check className="w-3 h-3 text-violet-300" />
                            </div>
                            <span className="text-slate-200 text-sm leading-snug font-medium transition-colors duration-300 group-hover/item:text-white">
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Elegant CTA Link */}
                      <div className="pt-2">
                        <a
                          href="#pricing"
                          className="group inline-flex items-center gap-2 text-[15px] font-black text-white hover:text-violet-300 transition-colors duration-300"
                        >
                          <span>{f.actionText}</span>
                          <ArrowRight
                            size={16}
                            className="text-slate-500 group-hover:text-violet-300 group-hover:translate-x-1.5 transition-all duration-300"
                          />
                        </a>
                      </div>
                    </div>

                    {/* Image Composition (Col 2) */}
                    <div className="w-full flex justify-center">
                      <div className="w-full max-w-[440px] aspect-[4/3] p-[2px] rounded-[2rem] bg-gradient-to-br from-violet-500/30 via-cyan-400/20 to-purple-600/30 shadow-[0_0_50px_rgba(139,92,246,0.25)] overflow-hidden">
                        {/* Contenedor interior del viewport */}
                        <div className="w-full h-full rounded-[1.9rem] bg-slate-950 overflow-hidden relative flex flex-col">
                          
                          {/* Barra estilo MacOS superior */}
                          <div className="w-full bg-slate-900/60 px-4 py-2 flex items-center gap-1.5 border-b border-white/5 shrink-0">
                            <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                          </div>

                          {/* Imagen del Dashboard / Captura */}
                          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-3">
                            <Image
                              src={f.image}
                              alt={f.imageLabel}
                              width={600}
                              height={400}
                              className="w-full h-full object-cover rounded-xl border border-white/10 transition-transform duration-700"
                              unoptimized
                            />
                            {/* Brillo glass sobre la captura */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex flex-col ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-12 lg:gap-20`}
              >
                {/* ─── TEXT CONTENT ─── */}
                <div className="flex-1 max-w-xl">
                  {/* Badge */}
                  <div
                    className={`inline-flex items-center gap-2 ${f.accentBg} ${f.accentBorder} border font-bold text-[11px] tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-full mb-6 ${f.accent}`}
                  >
                    <Icon size={14} />
                    {f.badge}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-[2.25rem] text-slate-900 leading-tight mb-4 tracking-tight">
                    {f.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-slate-500 text-base lg:text-lg leading-relaxed mb-8 font-medium">
                    {f.subtitle}
                  </p>

                  {/* Bullet list */}
                  <ul className="space-y-4 mb-8">
                    {f.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-3.5 group/item">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full ${f.accentBg} flex items-center justify-center shrink-0 border border-transparent group-hover/item:scale-110 transition-transform duration-300`}
                        >
                          <Check className={`w-3 h-3 ${f.accent}`} />
                        </div>
                        <span className="text-slate-600 text-sm lg:text-[16px] leading-snug font-medium transition-colors duration-300 group-hover/item:text-slate-900">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Elegant CTA Link */}
                  <div className="pt-2">
                    <a
                      href="#pricing"
                      className="group inline-flex items-center gap-2 text-[15px] font-black text-slate-900 hover:text-blue-600 transition-colors duration-300"
                    >
                      <span>{f.actionText}</span>
                      <ArrowRight
                        size={16}
                        className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1.5 transition-all duration-300"
                      />
                    </a>
                  </div>
                </div>

                {/* ─── IMAGE COMPOSITION (INSPIRADA EN LA IMAGEN DE REFERENCIA) ─── */}
                <div className="flex-1 w-full max-w-lg lg:max-w-none">
                  <div className="relative group">
                    {/* Contenedor externo de gradiente vibrante estilo neón */}
                    <div className={`relative overflow-hidden rounded-[2.5rem] p-6 sm:p-10 bg-gradient-to-tr ${f.gradientCard} shadow-[0_24px_70px_-15px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:scale-[1.01]`}>
                      {/* Grid de fondo punteado */}
                      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none opacity-60" />
                      
                      {/* Resplandor radial difuso */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

                      {/* Marco Squircle con borde brillante de neón */}
                      <div className={`relative mx-auto max-w-[400px] aspect-[4/3] p-[2px] rounded-[2rem] bg-gradient-to-br ${f.glowBorder} shadow-[0_0_40px_${f.glowShadow}] overflow-hidden`}>
                        {/* Contenedor interior del viewport */}
                        <div className="w-full h-full rounded-[1.9rem] bg-slate-950 overflow-hidden relative flex flex-col">
                          
                          {/* Barra estilo MacOS superior */}
                          <div className="w-full bg-slate-900/60 px-4 py-2 flex items-center gap-1.5 border-b border-white/5 shrink-0">
                            <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                          </div>

                          {/* Imagen del Dashboard / Captura */}
                          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-3">
                            <Image
                              src={f.image}
                              alt={f.imageLabel}
                              width={600}
                              height={400}
                              className="w-full h-full object-cover rounded-xl border border-white/10 group-hover:scale-[1.03] transition-transform duration-700"
                              unoptimized
                            />
                            
                            {/* Brillo glass sobre la captura */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Elementos Flotantes Glassmorphism */}
                      {f.floaters.map((floater, flIndex) => (
                        <motion.div
                          key={flIndex}
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: flIndex * 1.5,
                            ease: "easeInOut"
                          }}
                          className={`absolute ${floater.position} hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full px-4 py-2 text-xs font-bold shadow-lg`}
                        >
                          <span>{floater.icon}</span>
                          <span>{floater.text}</span>
                        </motion.div>
                      ))}

                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
