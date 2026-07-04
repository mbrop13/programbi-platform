"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Code, Database, LineChart, BookOpen } from "lucide-react";
import { LOGO_URL } from "./constants";

interface LandingProps {
  /** Composer (u otro contenido) que se incrusta debajo */
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

/**
 * Estado vacío: logotipo de la empresa balanceado, saludo con tipografía display
 * y sugerencias rápidas e interactivas para iniciar la conversación.
 */
export function Landing({ children, onSuggestionClick }: LandingProps) {
  return (
    <div className="relative flex-1 overflow-y-auto">
      <div className="flex min-h-full flex-col items-center justify-center gap-6 px-4 py-10 md:py-16">
        {/* Encabezado: Logo + Título */}
        <div className="flex flex-col items-center text-center">
          {/* Logo con brillo de fondo sutil */}
          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-brand-blue/10 blur-2xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image
                src={LOGO_URL}
                alt="ProgramBI"
                width={80}
                height={80}
                className="h-16 w-16 object-contain"
                priority
              />
            </motion.div>
          </div>

          {/* Título de Bienvenida en fuente display */}
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl"
          >
            ¿Qué vamos a <span className="text-gradient-brand">resolver hoy</span>?
          </motion.h2>

          {/* Subtítulo descriptivo */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="mt-2 max-w-[52ch] text-sm leading-relaxed text-text-muted"
          >
            Tu mentor de IA para resolver dudas de Data Science, Python, SQL y Power BI.
            Pregúntame o selecciona una sugerencia rápida.
          </motion.p>
        </div>

        {/* Composer de Entrada */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-3xl"
          >
            {children}
          </motion.div>
        )}

        {/* Sugerencias Rápidas */}
        {onSuggestionClick && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
            className="mt-4 w-full max-w-3xl"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ y: -2, border: "1px solid rgba(24,144,255,0.25)", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)" }}
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
                      <p className="mt-0.5 text-xs text-text-muted leading-normal">
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

