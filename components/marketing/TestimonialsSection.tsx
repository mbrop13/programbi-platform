"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Star, MessageSquareText } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

// ── Real student testimonials ──
const testimonials = [
  {
    name: "Víctor Montecino Muñoz",
    role: "Certificado en Big Data, BigQuery & Looker Studio",
    message:
      "🎉 ¡Estoy emocionado de compartir que he obtenido un nuevo certificado en Big Data con Big Query y Looker Studio de ProgramBI! 🚀 Agradezco enormemente a Manuel Oliva por su apoyo y por ofrecer cursos tan completos y enriquecedores.",
  },
  {
    name: "Cynzia Tapia Castro",
    role: "Certificada en Power BI",
    message:
      "¡Me alegra contaros que he obtenido un nuevo certificado: Curso Power BI de ProgramBI! Gracias profesor Manuel Oliva por el apoyo y la enseñanza.",
  },
  {
    name: "Victor Manuel Pérez Barría",
    role: "Certificado en SQL Server & Bases de Datos",
    message:
      "Un paso más en el desarrollo de habilidades con administración de bases de datos. Acabo de terminar un muy buen curso de SQL con el equipo de ProgramBI y su excelente profesor Manuel Oliva. Listo SQL, ahora vamos con PowerBi...!!!",
  },
  {
    name: "Pablo Améstica Parraguez",
    role: "Certificado en SQL Server Avanzado",
    message:
      "¡Hola a todos! 🎉 Me complace compartir que he completado exitosamente el curso de SQL Server impartido por ProgramBI. Este curso me ha permitido fortalecer mis habilidades, alcanzando un nivel intermedio. Agradezco especialmente al profesor Manuel Oliva por su dedicación y excelente enseñanza.",
  },
  {
    name: "Jaime Nicolas Aranda Vasquez",
    role: "Estudiante de Programación y Analítica",
    message:
      "Estimada Red, vengo a compartir con ustedes mi inclusión en el programa de Manuel Oliva de ProgramBI para sentar mis bases hacia mi futuro diplomado. Muy feliz de tener un profesional como él para guiarme 😁",
  },
  {
    name: "Julio César Reyes Asenjo",
    role: "Certificado en Big Data - BigQuery & Looker Studio",
    message:
      "¡Me alegra contaros que he terminado mis estudios de Big Query y Looker Studio en PROGRAMBI! Agradezco al profesor Manuel Oliva y al profesor Joaquín Villagra por su excelente tutoría. ¡Recomiendo ProgramBI!",
  },
  {
    name: "Jorge Kaisarieh",
    role: "Diseñador Gráfico, Web y UI/UX",
    message:
      "Aprendiendo cosas nuevas, totalmente nuevas ya que me desenvuelvo como diseñador gráfico, web y UI/UX. Power BI es una herramienta bastante necesaria y útil. ¡Recomiendo ProgramBI con los ojos cerrados!",
  },
  {
    name: "Branco Sanchez",
    role: "Certificado en Power BI Avanzado",
    message:
      "Es de mi agrado informarles que he finalizado el curso de Power BI Avanzado en ProgramBI. Sin duda una instancia para seguir aprendiendo en el área de BI.",
  },
  {
    name: "Diego Andrés Repetti Cubillos",
    role: "Certificado en Power BI Avanzado & SQL Server",
    message:
      "Marzo fue un mes desafiante, pero tras días intensos de estudio, completé exitosamente dos cursos en ProgramBI: Power BI nivel avanzado y SQL Server. Estos conocimientos me ayudarán a fortalecer mi habilidad para analizar datos de manera más eficiente.",
  },
  {
    name: "Alexis Rodrigo Astudillo Briones",
    role: "Certificado en SQL Server",
    message:
      "Acabo de terminar y aprobar el curso de SQL server en ProgramBi, dictado por el Profesor Manuel Oliva. Tremenda propuesta de valor para el desarrollo laboral, recomendable 100%.",
  },
  {
    name: "Pablo Guzmán G.",
    role: "Alumno de SQL Server",
    message:
      "Gran curso de ProgramBI. Aprendiendo a confeccionar tablas, vistas y procedimientos almacenados!",
  },
  {
    name: "José Méndez",
    role: "Certificado en Python para Análisis de Datos",
    message:
      "Seguimos sumando conocimientos, de a poco pero constante. Curso finalizado de Python, cada día es más interesante el análisis y gestión de Datos. Muchas gracias ProgramBI y Manuel Oliva excelente el curso 🙌",
  },
  {
    name: "Patricio Henríquez Albiña",
    role: "Certificado en Power BI",
    message:
      "Feliz de finalizar el curso de Power BI de ProgramBI, sin duda una gran herramienta de visualización de datos. ¡Vamos por más!",
  },
  {
    name: "Victor Arzola",
    role: "Alumno de Analítica de Datos",
    message: "🧠😊📊 Impresiona aún lo útil que resultan estas herramientas para el análisis de data!",
  },
  {
    name: "Felipe Medel A.",
    role: "Certificado en Power BI",
    message:
      "¡Me alegra contaros que he obtenido un nuevo certificado: Curso Power BI de ProgramBI! Manuel Oliva gracias por la paciencia y la motivación! 💪",
  },
  {
    name: "Ismael Yáñez Silva",
    role: "Certificado en SQL Server",
    message:
      "¡Me alegra compartir que he obtenido un nuevo certificado: SQL Server de ProgramBI!",
  },
  {
    name: "Karla Escalona",
    role: "Egresada de Fundamentos de Data Science",
    message:
      "La carrera profesional empieza cuando uno quiere, pero para ello hay que disponer de las herramientas que permitan que sea exitosa. En 2022 me puse como meta dominar los fundamentos de Data Science, y lo logré gracias a ProgramBI con el mejor profesor Manuel Oliva ¡Gracias!",
  },
  {
    name: "Leslie Mau Guesarazo",
    role: "Alumna de Cursos Presenciales",
    message:
      "Manuel Oliva gran curso, práctico, claro, adaptable a los requerimientos y lo mejor, presencial! Gracias por el compromiso y empuje para ir por más 💪🏼",
  },
  {
    name: "Branco Sanchez",
    role: "Certificado en SQL Server",
    message:
      "Querida comunidad, es de mi agrado comentarles que aprobé el curso de SQL en ProgramBI. Sin duda una excelente experiencia para adquirir conocimientos sobre el Data Science. 💪🏽",
  },
  {
    name: "Jaime Nicolas Aranda Vasquez",
    role: "Certificado en SQL Server",
    message:
      "Muy feliz de certificarme en programas claves para el manejo de datos, SQL SERVER es una herramienta muy versátil para apoyar en la toma de decisiones. Muchas gracias a ProgramBI por el profesionalismo 🥳",
  },
];

// Accent palette for visual variety
const accents = [
  { ring: "ring-[#1890FF]/20", gradient: "from-[#1890FF]/10", dot: "bg-[#1890FF]" },
  { ring: "ring-indigo-400/20", gradient: "from-indigo-400/10", dot: "bg-indigo-500" },
  { ring: "ring-violet-400/20", gradient: "from-violet-400/10", dot: "bg-violet-500" },
  { ring: "ring-cyan-400/20", gradient: "from-cyan-400/10", dot: "bg-cyan-500" },
  { ring: "ring-emerald-400/20", gradient: "from-emerald-400/10", dot: "bg-emerald-500" },
  { ring: "ring-amber-400/20", gradient: "from-amber-400/10", dot: "bg-amber-500" },
  { ring: "ring-rose-400/20", gradient: "from-rose-400/10", dot: "bg-rose-500" },
];

// Distribute testimonials into columns — 2 per column
const PER_COL = 2;
const NUM_COLS = Math.ceil(testimonials.length / PER_COL);
const columns: (typeof testimonials)[] = Array.from({ length: NUM_COLS }, () => []);
testimonials.forEach((t, i) => columns[Math.floor(i / PER_COL)].push(t));

// ── Card Component ──
function TestimonialCard({
  t,
  accentIdx,
}: {
  t: (typeof testimonials)[number];
  accentIdx: number;
}) {
  const accent = accents[accentIdx % accents.length];
  const initials = t.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className={`
        relative rounded-2xl p-5
        bg-white ring-1 ${accent.ring}
        shadow-[0_2px_16px_-4px_rgba(15,23,42,0.06)]
        hover:shadow-[0_12px_36px_-8px_rgba(15,23,42,0.12)]
        transition-all duration-300
        hover:-translate-y-1
        group
      `}
    >
      {/* ── Name + Role (TOP) ── */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${accent.gradient} to-white ring-1 ${accent.ring} flex items-center justify-center shrink-0`}
        >
          <span className="text-xs font-black text-slate-500">{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-800 leading-tight truncate">
            {t.name}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold truncate">{t.role}</p>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${accent.dot} opacity-25 group-hover:opacity-60 transition-opacity shrink-0`}
        />
      </div>

      {/* ── Stars ── */}
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" strokeWidth={0} />
        ))}
      </div>

      {/* ── Message (natural height — no fixed size) ── */}
      <p className="text-sm text-slate-600 leading-relaxed font-sans">{t.message}</p>
    </div>
  );
}

// ── Main Section ──
export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drag state
  const dragRef = useRef({ active: false, dragging: false, startX: 0, startY: 0, scrollStart: 0 });

  // Keep ref in sync with state
  useEffect(() => {
    isPausedRef.current = paused;
  }, [paused]);

  // ── Auto-scroll via JS ──
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const SPEED = 0.6; // px per frame (~36px/s at 60fps)

    function tick() {
      if (track && !isPausedRef.current && !dragRef.current.dragging) {
        track.scrollLeft += SPEED;
        // Seamless loop: reset when scrolled past half (the duplicate set)
        const half = track.scrollWidth / 2;
        if (track.scrollLeft >= half) {
          track.scrollLeft -= half;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Drag-to-scroll handlers (safe for vertical page scroll) ──
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { active: true, dragging: false, startX: e.clientX, startY: e.clientY, scrollStart: track.scrollLeft };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (!dragRef.current.dragging) {
      // Wait for clear direction before starting drag
      if (Math.abs(dy) > 8) {
        // Vertical scroll → cancel drag, let page scroll
        dragRef.current.active = false;
        return;
      }
      if (Math.abs(dx) > 5) {
        dragRef.current.dragging = true;
        track.style.cursor = "grabbing";
        setPaused(true);
        e.preventDefault();
      }
      return;
    }

    e.preventDefault();
    track.scrollLeft = dragRef.current.scrollStart - dx;
  }, []);

  const onPointerUp = useCallback(() => {
    const wasDragging = dragRef.current.dragging;
    dragRef.current = { active: false, dragging: false, startX: 0, startY: 0, scrollStart: 0 };
    if (trackRef.current) trackRef.current.style.cursor = "";
    if (wasDragging) {
      // Auto-resume after 3s
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(() => setPaused(false), 3000);
    }
  }, []);

  function handleMouseEnter() {
    setPaused(true);
  }

  function handleMouseLeave() {
    setPaused(false);
    dragRef.current.active = false;
    if (trackRef.current) trackRef.current.style.cursor = "";
    if (clickTimer.current) clearTimeout(clickTimer.current);
  }

  // Render one set of columns
  const renderColumnSet = (keyPrefix: string) =>
    columns.map((col, ci) => (
      <div key={`${keyPrefix}-${ci}`} className="flex flex-col gap-4 shrink-0 w-[280px] sm:w-[300px] md:w-[340px]">
        {col.map((t, ti) => (
          <TestimonialCard key={ti} t={t} accentIdx={ci * 3 + ti} />
        ))}
      </div>
    ));

  return (
    <section className="py-10 lg:py-14 bg-surface-1 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#1890FF]/4 to-transparent rounded-full blur-[150px] pointer-events-none" />

      {/* Inline styles — horizontal scrollable track */}
      <style jsx>{`
        .testimonial-track {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding: 0.5rem 1.25rem 1rem;
          scrollbar-width: none;
          cursor: grab;
          user-select: none;
          touch-action: pan-y;
        }
        .testimonial-track::-webkit-scrollbar {
          display: none;
        }
        .testimonial-track > * {
          flex-shrink: 0;
        }
        @media (min-width: 640px) {
          .testimonial-track {
            padding: 0.5rem 0 1rem;
          }
        }
      `}</style>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-5 lg:px-10">
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
            className="mb-6 lg:mb-10"
          />
        </div>

        {/* ── Scrollable Container ── */}
        <div
          className="relative w-full select-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left fade mask — hidden on mobile */}
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-28 md:w-44 bg-gradient-to-r from-surface-1 via-surface-1/80 to-transparent z-20 pointer-events-none" />
          {/* Right fade mask — hidden on mobile */}
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-28 md:w-44 bg-gradient-to-l from-surface-1 via-surface-1/80 to-transparent z-20 pointer-events-none" />

          {/* Scrolling track — JS auto-scroll + drag-to-scroll */}
          <div
            ref={trackRef}
            className={`testimonial-track ${paused ? "paused" : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {renderColumnSet("a")}
            {/* Duplicate set for seamless infinite loop */}
            {renderColumnSet("b")}
          </div>
        </div>
      </div>
    </section>
  );
}
