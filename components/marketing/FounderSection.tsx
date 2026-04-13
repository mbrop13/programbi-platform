"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { founderImage } from "@/lib/data/images";

export default function FounderSection() {
  return (
    <section className="py-20 lg:py-32 bg-white border-t border-[#F1F5F9] relative">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Image Column */}
          <div className="lg:col-span-5 relative">
            <FadeIn direction="right">
              {/* Decorative BG */}
              <div className="absolute top-6 -left-[30px] w-full h-full bg-blue-50/50 rounded-[3rem] -rotate-3 z-0" />
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-[#F3F4F6] group"
                style={{ boxShadow: "0 25px 60px -15px rgba(0,0,0,0.12)" }}>
                <Image
                  src={founderImage}
                  alt="Manuel Oliva - CEO ProgramBI"
                  width={600}
                  height={750}
                  className="w-full h-auto block transition-transform duration-600 group-hover:scale-[1.03]"
                  unoptimized
                />
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  viewport={{ once: true }}
                  className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-lg border border-[#E5E7EB] rounded-2xl px-6 py-4 max-w-[280px] z-20"
                  style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                >
                  <p className="text-[#1890FF] font-black text-xl mb-1">15+ Años</p>
                  <p className="text-xs text-gray-500 font-medium">
                    Experiencia en Banca, Retail y Minería.
                  </p>
                </motion.div>
              </div>
            </FadeIn>
          </div>

          {/* Bio Column */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.2}>
              <span className="inline-block text-[#1890FF] font-bold tracking-widest uppercase text-xs bg-blue-50 px-4 py-1.5 rounded-full mb-8">
                Liderazgo & Visión
              </span>
            </FadeIn>

            <FadeIn delay={0.3}>
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 font-display">
                Manuel Oliva
              </h2>
              <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-10">
                Fundador y Director de ProgramBI
              </h3>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="space-y-6 text-lg lg:text-xl text-gray-600 leading-relaxed mb-12">
                <p>
                  Lidero un equipo dedicado a empoderar empresas con herramientas de datos avanzadas. Con años de experiencia como consultor en análisis y visualización, he desarrollado dashboards personalizados integrando web, servidores y bases de datos.
                </p>
                <p>
                  Mi enfoque práctico ha ayudado a compañías líderes en{" "}
                  <strong className="text-gray-900">Minería, Finanzas y Retail</strong> a optimizar procesos críticos y tomar decisiones informadas.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="w-20 h-1.5 bg-[#1890FF] mb-12" />
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-6">
                    Formación Académica
                  </h4>
                  <ul className="space-y-4">
                    {[
                      { text: "Magíster en Data Science", sub: "(UAI)" },
                      { text: "Diplomado Derivados Financieros", sub: "(UAI)" },
                      { text: "Contador Auditor", sub: "(U. de Concepción)" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 text-base lg:text-lg">
                        <span className="text-xl">🎓</span>
                        <span>
                          <strong>{item.text}</strong> {item.sub}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-6">
                    Docencia & Trayectoria
                  </h4>
                  <ul className="space-y-4">
                    {[
                      "Profesor MBA y Magíster TI (U. Gabriela Mistral)",
                      "Ex-Mesa de Dinero Banco Itaú Chile",
                      "Ex-Gerente de Riesgos Renta 4",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 text-base lg:text-lg">
                        <span className="text-xl">🎓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.7}>
              <div className="mt-12">
                <a
                  href="https://www.linkedin.com/in/manuel-oliva-riesgo-inversion/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 text-[#1890FF] font-bold text-xl hover:text-blue-800 transition-colors no-underline"
                >
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
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
