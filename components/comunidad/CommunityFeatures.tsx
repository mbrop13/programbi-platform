"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Video, BookOpen, Sparkles, Check, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    badge: "En Vivo",
    icon: Video,
    title: (
      <>
        Clases en vivo <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500 font-black">100% prácticas</span>
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
      "https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-053709.png",
    imageLabel: "Dashboard Power BI en vivo",
    glowBorder: "from-sky-450 via-blue-300 to-indigo-400",
    glowShadow: "rgba(14,165,233,0.15)",
    accent: "text-blue-650 dark:text-sky-400",
    accentBg: "bg-sky-50/70 dark:bg-zinc-900/60",
    accentBorder: "border-sky-100/80 dark:border-zinc-800/80",
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
        Material completo y <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-500 font-black">clases grabadas</span>
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
      "https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-053922.png",
    imageLabel: "Modelado de datos",
    glowBorder: "from-cyan-400 via-sky-300 to-blue-400",
    glowShadow: "rgba(6,182,212,0.15)",
    accent: "text-sky-650 dark:text-sky-400",
    accentBg: "bg-sky-50/70 dark:bg-zinc-900/60",
    accentBorder: "border-sky-100/80 dark:border-zinc-800/80",
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
        Tu asistente IA con los <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 font-black">mejores modelos</span>
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
      "https://mail.programbi.com/uploads/Captura-de-pantalla-2026-07-14-054229.png",
    imageLabel: "Código Python asistido por IA",
    glowBorder: "from-violet-400 via-indigo-300 to-sky-450",
    glowShadow: "rgba(139,92,246,0.15)",
    accent: "text-indigo-600 dark:text-indigo-400",
    accentBg: "bg-sky-50/70 dark:bg-zinc-900/60",
    accentBorder: "border-sky-100/80 dark:border-zinc-800/80",
    actionText: "Probar Asistente IA",
    floaters: [
      { text: "IA: Conectada", icon: "✨", position: "top-[-10px] left-[15px]" },
      { text: "SQL Generator", icon: "🚀", position: "bottom-[15px] right-[10px]" }
    ]
  },
];

export default function CommunityFeatures() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-zinc-950">
      {/* Subtle background gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-zinc-950 dark:via-zinc-900/20 dark:to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#27272a_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.25] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-20 lg:py-32 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20 lg:mb-28"
        >
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-850 text-blue-600 dark:text-sky-400 font-bold text-[11px] tracking-[0.2em] uppercase px-4.5 py-2.5 rounded-full mb-6 border border-blue-100/50 dark:border-zinc-800/80 shadow-sm shadow-blue-500/5">
            <Zap size={13} className="animate-pulse" /> Lo que incluye tu membresía
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[2.75rem] text-slate-900 dark:text-white leading-tight mb-5">
            Todo lo que necesitas para{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500">dominar los datos</span>
          </h2>
          <p className="text-slate-550 dark:text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
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
                  className="w-full bg-gradient-to-br from-sky-50/70 via-blue-50/40 to-indigo-50/20 dark:from-zinc-900/50 dark:via-zinc-900/30 dark:to-zinc-950/20 rounded-[2.5rem] p-8 md:p-12 border border-sky-100/85 dark:border-zinc-850 shadow-[0_24px_60px_-15px_rgba(14,165,233,0.08)] dark:shadow-none relative overflow-hidden"
                >
                  {/* Grid de fondo punteado celeste claro */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.12)_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none opacity-70" />

                  {/* Resplandor radial de fondo */}
                  <div className="absolute -right-16 -top-16 w-80 h-80 bg-sky-400/10 dark:bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-blue-400/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Contenido de texto (Col 1) */}
                    <div className="max-w-xl">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 bg-sky-100/60 dark:bg-zinc-800/80 border border-sky-200/55 dark:border-zinc-700/80 font-bold text-[11px] tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-full mb-6 text-sky-700 dark:text-sky-300">
                        <Icon size={14} />
                        {f.badge}
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-[2.25rem] text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
                        {f.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-slate-550 dark:text-zinc-400 text-base lg:text-lg leading-relaxed mb-8 font-medium">
                        {f.subtitle}
                      </p>

                      {/* Bullet list */}
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {f.bullets.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-3 group/item">
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-sky-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0 border border-sky-200/20 dark:border-zinc-700 group-hover/item:scale-110 transition-transform duration-300">
                              <Check className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                            </div>
                            <span className="text-slate-650 dark:text-zinc-350 text-sm leading-snug font-medium transition-colors duration-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white">
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Elegant CTA Link */}
                      <div className="pt-2">
                        <a
                          href="#pricing"
                          className="group inline-flex items-center gap-2 text-[15px] font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-sky-400 transition-colors duration-300"
                        >
                          <span>{f.actionText}</span>
                          <ArrowRight
                            size={16}
                            className="text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-sky-400 group-hover:translate-x-1.5 transition-all duration-300"
                          />
                        </a>
                      </div>
                    </div>

                    {/* Image Composition (Col 2) */}
                    <div className="w-full flex justify-center">
                      <div className={cn(
                        "w-full max-w-[440px] aspect-[4/3] p-[2px] rounded-[2rem] bg-gradient-to-br overflow-hidden",
                        `bg-gradient-to-br ${f.glowBorder} shadow-[0_0_35px_${f.glowShadow}]`
                      )}>
                        {/* Contenedor interior del viewport */}
                        <div className="w-full h-full rounded-[1.9rem] bg-sky-50/20 dark:bg-slate-950 overflow-hidden relative flex flex-col">
                          
                          {/* Barra estilo MacOS superior */}
                          <div className="w-full bg-sky-100/40 dark:bg-slate-900/60 px-4 py-2 flex items-center gap-1.5 border-b border-sky-200/20 dark:border-white/5 shrink-0">
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
                              className="w-full h-full object-cover rounded-xl border border-sky-100/50 dark:border-white/10 transition-transform duration-700"
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
                  <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-[2.25rem] text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
                    {f.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-slate-550 dark:text-zinc-400 text-base lg:text-lg leading-relaxed mb-8 font-medium">
                    {f.subtitle}
                  </p>

                  {/* Bullet list */}
                  <ul className="space-y-4 mb-8">
                    {f.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-3.5 group/item">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full ${f.accentBg} flex items-center justify-center shrink-0 border border-sky-100 dark:border-zinc-800 group-hover/item:scale-110 transition-transform duration-300`}
                        >
                          <Check className={`w-3 h-3 ${f.accent}`} />
                        </div>
                        <span className="text-slate-650 dark:text-zinc-350 text-sm lg:text-[16px] leading-snug font-medium transition-colors duration-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Elegant CTA Link */}
                  <div className="pt-2">
                    <a
                      href="#pricing"
                      className="group inline-flex items-center gap-2 text-[15px] font-black text-slate-900 dark:text-white hover:text-blue-650 dark:hover:text-sky-400 transition-colors duration-300"
                    >
                      <span>{f.actionText}</span>
                      <ArrowRight
                        size={16}
                        className="text-slate-400 dark:text-zinc-500 group-hover:text-blue-655 dark:group-hover:text-sky-400 group-hover:translate-x-1.5 transition-all duration-300"
                      />
                    </a>
                  </div>
                </div>

                {/* ─── IMAGE COMPOSITION ─── */}
                <div className="flex-1 w-full max-w-lg lg:max-w-none">
                  <div className="relative group">
                    {/* Contenedor externo de gradiente vibrante estilo neón */}
                    <div className="relative overflow-hidden rounded-[2.5rem] p-6 sm:p-10 bg-gradient-to-br from-sky-50/70 via-blue-50/40 to-indigo-50/20 dark:from-zinc-900/50 dark:via-zinc-900/30 dark:to-zinc-950/20 border border-sky-100/85 dark:border-zinc-850 shadow-[0_24px_60px_-15px_rgba(14,165,233,0.08)] dark:shadow-none transition-transform duration-500 group-hover:scale-[1.01]">
                      {/* Grid de fondo punteado */}
                      <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.12)_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none opacity-70" />
                      
                      {/* Resplandor radial difuso */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-200/10 dark:bg-white/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

                      {/* Marco Squircle con borde brillante de neón */}
                      <div className={`relative mx-auto max-w-[400px] aspect-[4/3] p-[2px] rounded-[2rem] bg-gradient-to-br ${f.glowBorder} shadow-[0_0_35px_${f.glowShadow}] overflow-hidden`}>
                        {/* Contenedor interior del viewport */}
                        <div className="w-full h-full rounded-[1.9rem] bg-sky-50/20 dark:bg-slate-950 overflow-hidden relative flex flex-col">
                          
                          {/* Barra estilo MacOS superior */}
                          <div className="w-full bg-sky-100/40 dark:bg-slate-900/60 px-4 py-2 flex items-center gap-1.5 border-b border-sky-200/20 dark:border-white/5 shrink-0">
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
                              className="w-full h-full object-cover rounded-xl border border-sky-100/50 dark:border-white/10 group-hover:scale-[1.03] transition-transform duration-700"
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
                          className="absolute hidden sm:flex items-center gap-2 bg-sky-100/60 dark:bg-zinc-900/60 backdrop-blur-md border border-sky-200/50 dark:border-zinc-800 text-sky-950 dark:text-sky-250 rounded-full px-4 py-2 text-xs font-bold shadow-lg"
                          style={{
                            top: floater.position.includes("top") ? floater.position.split(" ")[0].replace("top-[", "").replace("px]", "") + "px" : undefined,
                            bottom: floater.position.includes("bottom") ? floater.position.split(" ")[0].replace("bottom-[", "").replace("px]", "") + "px" : undefined,
                            left: floater.position.includes("left") ? floater.position.split(" ")[1].replace("left-[", "").replace("px]", "") + "px" : undefined,
                            right: floater.position.includes("right") ? floater.position.split(" ")[1].replace("right-[", "").replace("px]", "") + "px" : undefined,
                          }}
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
