"use client";

import { cloneElement, isValidElement, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ReactElement, ReactNode } from "react";
import { Code, Database, LineChart, BookOpen } from "lucide-react";

interface LandingProps {
  /** Composer (u otro contenido) que se incrusta debajo del hero */
  children?: ReactNode;
  /** Acción al hacer clic en una sugerencia rápida */
  onSuggestionClick?: (prompt: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Code,
    title: "Depurar Python",
    desc: "Encontrar errores en un script de Python.",
    prompt: "Tengo un script de Python que me da un error. ¿Me ayudas a depurarlo? Aquí está el código:\n\n```python\n# Pega tu código aquí\n```",
    color: "text-brand-blue bg-brand-blue/5 border-brand-blue/10",
  },
  {
    icon: Database,
    title: "Optimizar SQL",
    desc: "Explicar y mejorar una consulta compleja.",
    prompt: "Me gustaría optimizar una consulta SQL compleja para mejorar su rendimiento. ¿Qué buenas prácticas me recomiendas para este tipo de consultas?",
    color: "text-accent-purple bg-accent-purple/5 border-accent-purple/10",
  },
  {
    icon: LineChart,
    title: "Análisis de Datos",
    desc: "Pasos para realizar un EDA en ventas.",
    prompt: "¿Cuáles son los mejores pasos en Python (usando pandas y matplotlib) para realizar un análisis exploratorio de datos (EDA) sobre un dataset de ventas?",
    color: "text-accent-emerald bg-accent-emerald/5 border-accent-emerald/10",
  },
  {
    icon: BookOpen,
    title: "Fórmulas DAX",
    desc: "Cálculos temporales en Power BI.",
    prompt: "¿Cómo puedo escribir una medida en DAX para calcular las ventas acumuladas del año actual frente al año anterior (YTD vs Prior YTD)?",
    color: "text-accent-yellow bg-accent-yellow/5 border-accent-yellow/10",
  },
];

/** Frases que rotan en el placeholder tipo typewriter del estado vacío. */
const TYPEWRITER_PHRASES = [
  "Analiza mi portafolio...",
  "Depura este script de Python...",
  "Optimiza una consulta SQL...",
  "Explícame una fórmula DAX...",
  "Crea un EDA sobre un dataset de ventas...",
  "Compara dos modelos de machine learning...",
];

/** Hook: rotación cíclica typewriter del placeholder. */
function useTypewriterPlaceholder(active: boolean): string {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active) return;
    const full = TYPEWRITER_PHRASES[index];
    const speed = deleting ? 35 : 65;

    const timer = setTimeout(() => {
      if (!deleting && text === full) {
        // pausa antes de borrar
        setTimeout(() => setDeleting(true), 1800);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % TYPEWRITER_PHRASES.length);
        return;
      }
      setText((prev) =>
        deleting ? full.slice(0, prev.length - 1) : full.slice(0, prev.length + 1)
      );
    }, speed);

    return () => clearTimeout(timer);
  }, [text, deleting, index, active]);

  return active ? text : "";
}

/**
 * Estado vacío: hero en el tercio superior (desktop pt-[25vh]) y
 * composer flotante en móvil. Placeholder con efecto typewriter.
 */
export function Landing({ children, onSuggestionClick }: LandingProps) {
  const [isMobile, setIsMobile] = useState(false);
  const placeholder = useTypewriterPlaceholder(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Inyecta el placeholder dinámico en el ComposerInput (children).
  const composerWithPlaceholder = isValidElement(children)
    ? cloneElement(children as ReactElement<{ placeholder?: string }>, {
        placeholder: placeholder || undefined,
      })
    : children;

  if (isMobile) {
    // ─── Móvil: logo arriba, composer + sugerencias abajo (footer flotante) ───
    return (
      <div className="relative flex h-full flex-col overflow-hidden px-4 pb-4 pt-6">
        <div className="flex flex-grow flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-display text-2xl font-bold tracking-tight text-text-primary"
            >
              ¿Qué vamos a <span className="text-gradient-brand">resolver hoy</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="mt-2 max-w-[42ch] text-sm leading-relaxed text-text-muted"
            >
              Tu mentor de IA para Data Science, Python, SQL y Power BI.
            </motion.p>
          </motion.div>
        </div>

        <div className="shrink-0 space-y-3">
          {composerWithPlaceholder && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="relative w-full"
            >
              {composerWithPlaceholder}
            </motion.div>
          )}
          {onSuggestionClick && (
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] snap-x snap-mandatory">
              {SUGGESTIONS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onSuggestionClick(item.prompt)}
                    className="flex shrink-0 snap-start items-center gap-2 rounded-xl border border-border bg-surface-0/70 px-3 py-2 text-xs font-semibold text-text-secondary backdrop-blur-sm transition-colors hover:text-text-primary cursor-pointer"
                  >
                    <IconComponent className="h-4 w-4 text-text-muted" aria-hidden />
                    {item.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Desktop: hero en el tercio superior (pt-[25vh]) ───
  return (
    <div className="relative flex h-full flex-col items-center justify-start overflow-x-hidden overflow-y-auto px-4 pb-4 pt-[25vh] [scrollbar-width:none]">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl"
          >
            ¿Qué vamos a <span className="text-gradient-brand">resolver hoy</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            className="mt-2 max-w-[52ch] text-sm leading-relaxed text-text-muted"
          >
            Tu mentor de IA para resolver dudas de Data Science, Python, SQL y Power BI.
            Pregúntame o selecciona una sugerencia rápida.
          </motion.p>
        </motion.div>

        {composerWithPlaceholder && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="relative mx-auto mt-6 w-full max-w-3xl"
          >
            {composerWithPlaceholder}
          </motion.div>
        )}

        {onSuggestionClick && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-5 w-full max-w-3xl"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSuggestionClick(item.prompt)}
                    className="flex items-start gap-3.5 rounded-2xl border border-border bg-surface-0/60 p-4 text-left transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.color}`}>
                      <IconComponent className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-xs leading-normal text-text-muted">
                        {item.desc}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
