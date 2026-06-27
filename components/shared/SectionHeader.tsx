"use client";

import { FadeIn } from "@/components/shared/AnimatedComponents";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  /** Texto corto del badge superior (uppercase) */
  eyebrow?: string;
  /** Icono opcional para el badge */
  icon?: LucideIcon;
  /** Título principal de la sección (puede incluir JSX para resaltados) */
  title: React.ReactNode;
  /** Subtítulo descriptivo bajo el título */
  subtitle?: React.ReactNode;
  /** Alineación del bloque de encabezado */
  align?: "center" | "left";
  /** Ancho máximo del subtítulo */
  maxWidth?: "sm" | "md" | "lg";
  /** Clase extra para el contenedor */
  className?: string;
  /** Delay para animaciones escalonadas */
  delay?: number;
}

const maxWidthMap = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-3xl",
};

/**
 * Encabezado de sección unificado.
 * Garantiza consistencia visual (badge, tipografía, espaciado) en toda la home.
 */
export default function SectionHeader({
  eyebrow,
  icon: Icon,
  title,
  subtitle,
  align = "center",
  maxWidth = "md",
  className = "",
  delay = 0,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <FadeIn
      delay={delay}
      className={`${isCenter ? "text-center mx-auto" : "text-left"} ${maxWidthMap[maxWidth]} ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-1.5 bg-blue-50/80 border border-blue-100/60 text-[#1890FF] font-bold text-[11px] uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full mb-5 shadow-sm backdrop-blur-sm`}
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {eyebrow}
        </span>
      )}

      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 text-base lg:text-lg text-slate-500 leading-relaxed font-sans ${
            isCenter ? "mx-auto" : ""
          } ${maxWidthMap[maxWidth]}`}
        >
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
