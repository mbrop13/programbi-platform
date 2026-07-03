"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface LandingProps {
  /** Composer (u otro contenido) que se incrusta debajo del logo */
  children?: ReactNode;
}

const LOGO_URL =
  "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974";

/**
 * Estado vacío: únicamente el logo de la empresa en grande (sin tarjeta)
 * seguido del composer. Sin saludo, textos ni sugerencias.
 */
export function Landing({ children }: LandingProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-4 py-10">
      {/* Glow de fondo */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-blue/10 blur-3xl" />

      {/* Logo grande */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative h-40 w-40"
      >
        <Image
          src={LOGO_URL}
          alt="ProgramBI"
          fill
          className="object-contain"
          sizes="96px"
        />
      </motion.div>

      {/* Composer */}
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
    </div>
  );
}
