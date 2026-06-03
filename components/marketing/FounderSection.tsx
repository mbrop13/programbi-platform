"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { founderImage } from "@/lib/data/images";
import { Award, BookOpen, Briefcase } from "lucide-react";

export default function FounderSection() {
  return (
    <section className="pt-10 pb-20 lg:pt-14 lg:pb-32 bg-white border-t border-[#F1F5F9] relative overflow-hidden">
      {/* Subtle radial backlights */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-500/2 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-500/2 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Image Column */}
          <div className="lg:col-span-5 relative">
            <FadeIn direction="right">
              {/* Subtle mesh glowing background */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-cyan-500/10 rounded-[3rem] blur-2xl opacity-75 pointer-events-none" />
              
              <div className="relative z-10 rounded-[2rem] overflow-hidden border border-slate-100 group shadow-[0_20px_50px_rgba(15,23,42,0.08)] bg-white">
                <Image
                  src={founderImage}
                  alt="Manuel Oliva - CEO ProgramBI"
                  width={600}
                  height={750}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
                  unoptimized
                />
                
                {/* Floating Badge (Glassmorphic) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                  viewport={{ once: true }}
                  className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 max-w-xs z-20 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#1890FF] shrink-0 border border-blue-500/20">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-[#1890FF] font-black text-lg leading-none mb-1 font-sans">15+ Años</p>
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide font-sans">
                        Experiencia en Banca, Retail y Minería
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </FadeIn>
          </div>

          {/* Bio Column */}
          <div className="lg:col-span-7 text-left">
            <FadeIn>
              <span className="inline-flex items-center bg-blue-50 text-[#1890FF] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-blue-100 shadow-sm">
                Liderazgo & Visión
              </span>
            </FadeIn>

            <FadeIn delay={0.15}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-2 font-display tracking-tight">
                Manuel Oliva
              </h2>
              <h3 className="text-base md:text-lg font-bold text-slate-400 mb-8 font-sans">
                Fundador y Director de ProgramBI
              </h3>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="space-y-5 text-sm md:text-base text-slate-500 leading-relaxed mb-8 max-w-2xl font-sans">
                <p>
                  Lidero un equipo dedicado a empoderar empresas con herramientas de datos avanzadas. Con años de experiencia como consultor en análisis y visualización, he desarrollado dashboards personalizados integrando web, servidores y bases de datos.
                </p>
                <p>
                  Mi enfoque práctico ha ayudado a compañías líderes en{" "}
                  <strong className="text-slate-800 font-bold">Minería, Finanzas y Retail</strong> a optimizar procesos críticos y tomar decisiones informadas basadas en hechos.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                {/* Formación Académica */}
                <div>
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-4 font-sans">
                    Formación Académica
                  </h4>
                  <ul className="space-y-3 p-0">
                    {[
                      { text: "Magíster en Data Science", sub: "(UAI)" },
                      { text: "Diplomado Derivados Financieros", sub: "(UAI)" },
                      { text: "Contador Auditor", sub: "(U. de Concepción)" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group text-slate-500 list-none">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/5 border border-blue-500/15 flex items-center justify-center text-[#1890FF] shrink-0 mt-0.5 group-hover:bg-[#1890FF] group-hover:text-white transition-colors">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs md:text-sm leading-relaxed font-sans">
                          <strong className="text-slate-800 font-bold">{item.text}</strong> <span className="text-slate-400">{item.sub}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Docencia & Trayectoria */}
                <div>
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-4 font-sans">
                    Docencia & Trayectoria
                  </h4>
                  <ul className="space-y-3 p-0">
                    {[
                      "Profesor MBA y Magíster TI (U. Gabriela Mistral)",
                      "Ex-Mesa de Dinero Banco Itaú Chile",
                      "Ex-Gerente de Riesgos Renta 4",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group text-slate-500 list-none">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-500 shrink-0 mt-0.5 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                          <Briefcase className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs md:text-sm leading-relaxed font-sans text-slate-600">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>

            {/* LinkedIn Connection Link */}
            <FadeIn delay={0.45}>
              <div className="mt-10 pt-6 border-t border-slate-100 flex">
                <a
                  href="https://www.linkedin.com/in/manuel-oliva-riesgo-inversion/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#1890FF] hover:border-[#1890FF]/30 hover:bg-blue-50/20 font-bold text-sm px-6 py-3 rounded-xl transition-all no-underline group shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current text-slate-500 group-hover:text-[#1890FF] transition-colors" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>Conectar en LinkedIn</span>
                </a>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
