"use client";

import { useState } from "react";
import { Quote, Star, MessageSquareText, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedComponents";
import SectionHeader from "@/components/shared/SectionHeader";

// ── Real student testimonials ──
const testimonials = [
  {
    name: "Víctor Montecino Muñoz",
    role: "Certificado en Big Data, BigQuery & Looker Studio",
    message:
      "🎉 ¡Estoy emocionado de compartir que he obtenido un nuevo certificado en Big Data con Big Query y Looker Studio de ProgramBI Capacitaciones en Programación! 🚀 Agradezco enormemente a Manuel Oliva por su apoyo y por ofrecer cursos tan completos y enriquecedores. Esta certificación es un gran paso en mi desarrollo profesional y no podría haberlo logrado sin su dedicación y enseñanza.",
    rating: 5,
    featured: false,
  },
  {
    name: "Cynzia Tapia Castro",
    role: "Certificada en Power BI",
    message:
      "¡Me alegra contaros que he obtenido un nuevo certificado: Curso Power BI de ProgramBI Capacitaciones en Programación! Gracias profesor Manuel Oliva por el apoyo y la enseñanza.",
    rating: 5,
    featured: false,
  },
  {
    name: "Victor Manuel Pérez Barría",
    role: "Certificado en SQL Server & Bases de Datos",
    message:
      "Un paso más en el desarrollo de habilidades con administración de bases de datos. Acabo de terminar un muy buen curso de SQL con el equipo de ProgramBI Capacitaciones en Programación y su excelente profesor Manuel Oliva. Listo SQL, ahora vamos con PowerBi...!!!",
    rating: 5,
    featured: false,
  },
  {
    name: "Pablo Améstica Parraguez",
    role: "Certificado en SQL Server Avanzado",
    message:
      "¡Hola a todos! 🎉 Me complace compartir que he completado exitosamente el curso de SQL Server impartido por ProgramBI Capacitaciones en Programación. Este curso me ha permitido fortalecer mis habilidades en SQL Server, alcanzando un nivel intermedio. Agradezco especialmente al profesor Manuel Oliva por su dedicación y excelente enseñanza, así como a todo el equipo de ProgramBI por brindar herramientas valiosas y un portal de clases grabadas que fue fundamental para mi aprendizaje. Estoy emocionado de aplicar estos nuevos conocimientos en mis futuros proyectos y seguir creciendo profesionalmente en el ámbito del análisis de datos. #SQLServer #Capacitación #ProgramBI #AnálisisDeDatos #FormaciónContinua #Profesionalismo",
    rating: 5,
    featured: false,
  },
  {
    name: "Jaime Nicolas Aranda Vasquez",
    role: "Estudiante de Programación y Analítica",
    message:
      "Estimada Red, Esperando se encuentren muy bien. Vengo a compartir con ustedes mi inclusión en el programa de Manuel Oliva de ProgramBI Capacitaciones en Programación para sentar mi bases hacia mi futuro diplomado. Muy feliz de tener un profesional como el para guiarme 😁",
    rating: 5,
    featured: false,
  },
  {
    name: "Julio César Reyes Asenjo",
    role: "Certificado en Big Data - BigQuery & Looker Studio",
    message:
      "¡Me alegra contaros que he terminado mis estudios de Curso Big Data - Big Query y Looker Studio Aplicado al Mercado Laboral en PROGRAMBI! Agradezco enormemente al profesor Manuel Oliva por permitir a este valioso curso y además al profesor Joaquin Ignacio Villagra Pacheco por su excelente tutoria y conocimiento. ¡ Recomiendo ProgramBI Capacitaciones en Programación !",
    rating: 5,
    featured: false,
  },
  {
    name: "Jorge Kaisarieh",
    role: "Diseñador Gráfico, Web y UI/UX / Estudiante de Power BI",
    message:
      "Aprendiendo cosas nuevas, totalmente nuevas ya que me desenvuelvo como diseñador gráfico, web y UI/UX. Power BI es una herramienta bastante necesaria y útil a la hora de obtener y analizar data para casos de research. Agradezco enormemente al profesor Manuel Oliva por permitirme acceder a este valioso curso y al profesor Rodrigo Vega Olave por su excelente tutoría. ¡Recomiendo ProgramBI Capacitaciones en Programación con los ojos cerrados!",
    rating: 5,
    featured: false,
  },
  {
    name: "Branco Sanchez",
    role: "Certificado en Power BI Avanzado",
    message:
      "Estimada red, Es de mi agrado informarles que he finalizado el curso de Power BI Avanzando en ProgramBI Capacitaciones en Programación. Sin duda una instancia para seguir aprendiendo en el área de BI.",
    rating: 5,
    featured: false,
  },
  {
    name: "Diego Andrés Repetti Cubillos",
    role: "Certificado en Power BI Avanzado & SQL Server",
    message:
      "Marzo fue un mes desafiante, pero tras días intensos de estudio, me complace compartir que completé exitosamente dos cursos en ProgramBI Capacitaciones en Programación: uno en Power BI nivel avanzado y otro en SQL Server. Estos nuevos conocimientos adquiridos me ayudarán a fortalecer mi habilidad para analizar datos de manera más eficiente, tomar decisiones informadas y contribuir significativamente a proyectos futuros en mi campo profesional.",
    rating: 5,
    featured: false,
  },
  {
    name: "Alexis Rodrigo Astudillo Briones",
    role: "Certificado en SQL Server",
    message:
      "Quisiera compartir con ustedes, que acabo de terminar y aprobar el curso de SQL server, en el centro de capacitación ProgramBi, dictado por el Profesor Manuel Oliva. Agregar la tremenda propuesta de valor que entrega a sus alumnos para el desarrollo laboral, recomendable 100%. Conceptos y herramientas claves para otorgar valor al negocio y a su vez, una mirada estrategia a los requerimientos del mercado laboral. Gracias Manuel Oliva, por entregar tus amplios conocimientos y ayudar al desarrollo laboral.",
    rating: 5,
    featured: false,
  },
  {
    name: "Branco Sanchez",
    role: "Certificado en SQL Server",
    message:
      "Querida comunidad, es de mi agrado comentarles que aprobe el curso de SQL en ProgramBI Capacitaciones en Programación. Sin duda una excelente experiencia para adquirir conocimientos sobre el Data Science. 💪🏽",
    rating: 5,
    featured: false,
  },
  {
    name: "Pablo Guzmán G.",
    role: "Alumno de SQL Server",
    message:
      "Gran curso de ProgramBI Capacitaciones en Programación. Aprendiendo a confeccionar tablas, vistas y procedimientos almacenados!",
    rating: 5,
    featured: false,
  },
  {
    name: "José Méndez",
    role: "Certificado en Python para Análisis de Datos",
    message:
      "Seguimos sumando conocimientos, de a poco pero constante. Curso finalizado de Python, cada día es más interesante es el análisis y gestión de Datos, cada día sé aprenden muchas cosas para hacerlo más eficiente. Muchas gracias ProgramBI Capacitaciones en Programación y Manuel Oliva excelente el curso 🙌",
    rating: 5,
    featured: false,
  },
  {
    name: "Patricio Henríquez Albiña",
    role: "Certificado en Power BI",
    message:
      "Feliz de finalizar el curso de Power BI de ProgramBI Capacitaciones en Programación, sin duda una gran herramienta de visualización de datos. Agradezco a Juan Pablo Araujo, CQF y Alfredo Dihmes por la oportunidad de otorgarme el curso. Vamos por más!",
    rating: 5,
    featured: false,
  },
  {
    name: "Victor Arzola",
    role: "Alumno de Analítica de Datos",
    message:
      "🧠😊📊 Impresiona aún lo útil que resultan estas herramientas para el análisis de data!",
    rating: 5,
    featured: false,
  },
  {
    name: "Felipe Medel A.",
    role: "Certificado en Power BI",
    message:
      "¡Me alegra contaros que he obtenido un nuevo certificado: Curso Power BI de ProgramBI Capacitaciones en Programación! Manuel Oliva Gracias por la paciencia y la motivación! 💪",
    rating: 5,
    featured: false,
  },
  {
    name: "Ismael Yáñez Silva",
    role: "Certificado en SQL Server",
    message:
      "¡Me alegra compartir que he obtenido un nuevo certificado: SQL Server de ProgramBI Capacitaciones en Programación!",
    rating: 5,
    featured: false,
  },
  {
    name: "Jaime Nicolas Aranda Vasquez",
    role: "Certificado en SQL Server",
    message:
      "Muy feliz de certificarme en programas claves para el manejo de datos, en este caso SQL SERVER es una herramienta muy versátil para apoyar en la toma de decisiones. Muchas gracias a ProgramBI Capacitaciones en Programación por el profesionalismo 🥳",
    rating: 5,
    featured: false,
  },
  {
    name: "Karla Escalona",
    role: "Egresada de Fundamentos de Data Science",
    message:
      "La carrera profesional empieza cuando uno quiere, pero para ello hay que disponer de las herramientas que permitan que sea exitosa. El en 2022 me puse como meta dominar los fundamentos de Data Science, y lo logre gracias a ProgramBI Capacitaciones en Programación con el mejor profesor Manuel Oliva ¡Gracias!",
    rating: 5,
    featured: false,
  },
  {
    name: "Leslie Mau Guesarazo",
    role: "Alumna de Cursos Presenciales",
    message:
      "Manuel Oliva gran curso, práctico, claro , adaptable a los requerimientos y lo mejor, presencial! Sebastián Arrué Leal Carmen Pozo Castillo Yirianni Quintero M. Vanessa Arevalo Bazaes Gracias por el compromiso y empuje para ir por más 💪🏼💪🏼💪🏼 Corredora de Seguros la Cámara",
    rating: 5,
    featured: false,
  },
];

// Accent palette for card borders & decorative elements
const accents = [
  { border: "border-[#1890FF]/15", glow: "from-[#1890FF]/8", dot: "bg-[#1890FF]" },
  { border: "border-indigo-400/15", glow: "from-indigo-400/8", dot: "bg-indigo-500" },
  { border: "border-violet-400/15", glow: "from-violet-400/8", dot: "bg-violet-500" },
  { border: "border-cyan-400/15", glow: "from-cyan-400/8", dot: "bg-cyan-500" },
  { border: "border-emerald-400/15", glow: "from-emerald-400/8", dot: "bg-emerald-500" },
  { border: "border-sky-400/15", glow: "from-sky-400/8", dot: "bg-sky-500" },
];

export default function TestimonialsSection() {
  const [showAll, setShowAll] = useState(false);

  // Show 6 testimonials by default
  const visibleTestimonials = showAll ? testimonials : testimonials.slice(0, 6);

  return (
    <section className="py-20 lg:py-28 bg-surface-1 relative overflow-hidden">
      {/* ── Background decorations ── */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#1890FF]/4 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-indigo-200/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[350px] h-[350px] bg-cyan-200/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative floating quotes */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[8%] text-[#1890FF]/6 pointer-events-none select-none hidden lg:block"
      >
        <Quote className="w-24 h-24" strokeWidth={1} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -4, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-[5%] text-indigo-400/5 pointer-events-none select-none hidden lg:block"
      >
        <Quote className="w-20 h-20" strokeWidth={1} />
      </motion.div>

      <div className="max-w-6xl mx-auto px-5 lg:px-10 relative z-10">
        {/* ── Header ── */}
        <SectionHeader
          eyebrow="Testimonios"
          icon={MessageSquareText}
          title={
            <>
              Lo que dicen nuestros{" "}
              <span className="text-[#1890FF]">alumnos</span>
            </>
          }
          subtitle="Historias reales de profesionales que transformaron su carrera con ProgramBI."
          align="center"
          maxWidth="md"
          className="mb-14 lg:mb-20"
        />

        {/* Grid Wrapper for Fade Overlay */}
        <div className="relative">
          {/* ── Testimonials Grid ── */}
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {visibleTestimonials.map((t, i) => {
              const accent = accents[i % accents.length];
              const isFeatured = t.featured;

              return (
                <StaggerItem
                  key={i}
                  className={isFeatured ? "md:col-span-2 lg:col-span-2 lg:row-span-1" : ""}
                >
                  <motion.div
                    whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                    className={`
                      relative h-full rounded-2xl p-6 lg:p-8
                      bg-white border ${accent.border}
                      shadow-[0_4px_24px_-6px_rgba(15,23,42,0.04)]
                      hover:shadow-[0_20px_50px_-12px_rgba(15,23,42,0.1)]
                      transition-shadow duration-300
                      overflow-hidden group
                    `}
                  >
                    {/* Gradient wash top */}
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.glow} via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity`} />

                    {/* Large decorative quote mark */}
                    <span className="absolute top-3 right-5 text-6xl lg:text-7xl font-serif text-slate-100 leading-none select-none pointer-events-none group-hover:text-[#1890FF]/8 transition-colors duration-500">
                      &ldquo;
                    </span>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-5">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star
                          key={s}
                          className="w-4 h-4 text-amber-400 fill-amber-400"
                          strokeWidth={0}
                        />
                      ))}
                    </div>

                    {/* Message */}
                    <p className={`relative z-10 text-slate-600 leading-relaxed font-sans mb-6 ${
                      isFeatured ? "text-base lg:text-lg" : "text-sm lg:text-base"
                    }`}>
                      {t.message}
                    </p>

                    {/* Author divider */}
                    <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                      {/* Avatar placeholder (initials) */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${accent.glow} to-slate-50 border ${accent.border} flex items-center justify-center shrink-0`}>
                        <span className={`text-sm font-black text-slate-500`}>
                          {t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 font-sans leading-tight">
                          {t.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-semibold font-sans">
                          {t.role}
                        </p>
                      </div>
                      {/* Accent dot */}
                      <div className={`ml-auto w-2 h-2 rounded-full ${accent.dot} opacity-30 group-hover:opacity-70 transition-opacity`} />
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>

          {/* Fade overlay when collapsed */}
          {!showAll && testimonials.length > 6 && (
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-surface-1 via-surface-1/60 to-transparent pointer-events-none z-10" />
          )}
        </div>

        {/* ── Show More Button ── */}
        {testimonials.length > 6 && (
          <div className="mt-10 flex justify-center relative z-20">
            <button
              onClick={() => setShowAll(!showAll)}
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-full
                bg-white border border-slate-200
                text-slate-700 font-semibold text-sm shadow-sm
                hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900
                active:scale-95 transition-all duration-200 cursor-pointer
              "
            >
              {showAll ? (
                <>
                  Ver menos testimonios <ChevronUp className="w-4 h-4 text-slate-500" />
                </>
              ) : (
                <>
                  Ver más testimonios ({testimonials.length - 6} más) <ChevronDown className="w-4 h-4 text-[#1890FF]" />
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Bottom CTA hint ── */}
        <FadeIn delay={0.4}>
          <div className="mt-14 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4 select-none">
              Únete a cientos de profesionales que ya dieron el salto
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {accents.slice(0, 4).map((a, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.glow} to-white border-2 border-white shadow-sm flex items-center justify-center`}
                  >
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" strokeWidth={0} />
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                +100 profesionales capacitados
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
