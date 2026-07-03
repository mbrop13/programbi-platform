"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Video, BookOpen, Sparkles, Check, Zap } from "lucide-react";

const features = [
  {
    badge: "En Vivo",
    icon: Video,
    title: (
      <>
        Clases en vivo <span className="text-brand-blue">100% prácticas</span>
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
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    accent: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-100",
    dotColor: "bg-blue-500",
  },
  {
    badge: "A Tu Ritmo",
    icon: BookOpen,
    title: (
      <>
        Material completo y{" "}
        <span className="text-brand-blue">clases grabadas</span>
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
    gradient: "from-emerald-500/10 via-cyan-500/5 to-transparent",
    accent: "text-emerald-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    dotColor: "bg-emerald-500",
  },
  {
    badge: "IA Integrada",
    icon: Sparkles,
    title: (
      <>
        Tu asistente IA con los{" "}
        <span className="text-brand-blue">mejores modelos</span>
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
    gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    accent: "text-violet-600",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-100",
    dotColor: "bg-violet-500",
  },
];

export default function CommunityFeatures() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-20 lg:py-28 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20 lg:mb-28"
        >
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold text-[11px] tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-6 border border-blue-100">
            <Zap size={14} /> Lo que incluye tu membresía
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[2.75rem] text-slate-900 leading-tight mb-5">
            Todo lo que necesitas para{" "}
            <span className="text-brand-blue">dominar los datos</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Un ecosistema completo diseñado para que aprendas, practiques y
            crezcas como analista de datos profesional.
          </p>
        </motion.div>

        {/* Zigzag feature rows */}
        <div className="space-y-24 lg:space-y-32">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isReversed = i % 2 === 1; // odd = image left, text right

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex flex-col ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-10 lg:gap-16`}
              >
                {/* ─── TEXT CONTENT ─── */}
                <div className="flex-1 max-w-xl">
                  {/* Badge */}
                  <div
                    className={`inline-flex items-center gap-2 ${f.accentBg} ${f.accentBorder} border font-bold text-[11px] tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-full mb-5 ${f.accent}`}
                  >
                    <Icon size={14} />
                    {f.badge}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-[2rem] text-slate-900 leading-tight mb-4">
                    {f.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-slate-500 text-base lg:text-lg leading-relaxed mb-8">
                    {f.subtitle}
                  </p>

                  {/* Bullet list */}
                  <ul className="space-y-3.5">
                    {f.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full ${f.accentBg} flex items-center justify-center shrink-0`}
                        >
                          <Check className={`w-3 h-3 ${f.accent}`} />
                        </div>
                        <span className="text-slate-600 text-sm lg:text-[15px] leading-snug font-medium">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ─── IMAGE ─── */}
                <div className="flex-1 w-full max-w-lg lg:max-w-none">
                  <div className="relative group">
                    {/* Decorative gradient blob behind image */}
                    <div
                      className={`absolute -inset-6 bg-gradient-to-br ${f.gradient} rounded-[2rem] blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] group-hover:shadow-[0_16px_60px_-12px_rgba(0,0,0,0.15)] transition-shadow duration-500">
                      <Image
                        src={f.image}
                        alt={f.imageLabel}
                        width={640}
                        height={420}
                        className="w-full h-auto object-cover aspect-[3/2] group-hover:scale-[1.02] transition-transform duration-700"
                        unoptimized
                      />
                      {/* Overlay gradient at bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      {/* Small label */}
                      <div className="absolute bottom-3 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        {f.imageLabel}
                      </div>
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
