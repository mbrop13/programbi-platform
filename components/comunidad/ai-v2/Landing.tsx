"use client";

import { Code2, Database, LineChart, Sparkles, BookOpen, Map } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface LandingProps {
  userName?: string;
  onSuggestion: (text: string) => void;
  /** Composer (u otro contenido) que se incrusta entre el saludo y las sugerencias */
  children?: ReactNode;
}

const LOGO_URL =
  "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974";

const SUGGESTIONS = [
  { icon: Database, text: "Explícame los JOIN en SQL con ejemplos" },
  { icon: Code2, text: "¿Cómo leo un CSV con pandas y hago un gráfico?" },
  { icon: LineChart, text: "Dame 5 tips para crear un dashboard en Power BI" },
  { icon: Sparkles, text: "Limpia datos nulos en un DataFrame de Python" },
  { icon: BookOpen, text: "¿Qué es DAX y para qué sirve en Power BI?" },
  { icon: Map, text: "Hazme un roadmap para aprender Data Science" },
];

export function Landing({ userName, onSuggestion, children }: LandingProps) {
  const firstName = (userName || "").split(" ")[0] || "";
  const greeting = firstName ? `Hola, ${firstName}` : "Hola";

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto px-4 py-10">
      {/* Glow de fondo */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-blue/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex flex-col items-center text-center"
      >
        {/* Logo de la empresa */}
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white shadow-premium">
          <Image
            src={LOGO_URL}
            alt="ProgramBI"
            fill
            className="object-contain p-2"
            sizes="64px"
          />
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
          {greeting}, soy tu Mentor IA
        </h1>
        <p className="mt-2 max-w-md text-sm text-text-secondary sm:text-base">
          Pregúntame sobre Python, SQL, Power BI, Excel, estadística y visualización
          de datos. Estoy aquí para ayudarte a crecer.
        </p>
      </motion.div>

      {/* Composer incrustado — centrado, más arriba que al fondo */}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
          className="relative w-full max-w-2xl"
        >
          {children}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
        className="grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2"
      >
        {SUGGESTIONS.map(({ icon: Icon, text }) => (
          <button
            key={text}
            onClick={() => onSuggestion(text)}
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface-0 p-3 text-left shadow-premium transition-all duration-150 hover:border-brand-blue/30 hover:bg-surface-2/40 hover:shadow-float"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue/20">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm text-text-secondary group-hover:text-text-primary">
              {text}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
