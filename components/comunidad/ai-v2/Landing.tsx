"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { LOGO_URL } from "./constants";

interface LandingProps {
  /** Composer (u otro contenido) que se incrusta debajo del logo */
  children?: ReactNode;
}

/**
 * Estado vacío: únicamente el logo de la empresa en grande (sin tarjeta)
 * seguido del composer. Sin saludo, textos ni sugerencias.
 */
export function Landing({ children }: LandingProps) {
  return (
    <div className="relative flex-1 overflow-y-auto">
      {/* min-h-full + justify-center evita el clipping del topo cuando hay scroll */}
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 py-10">
        {/* Glow de fondo trackeando el logo */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl" />
          </div>

          {/* Logo grande */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={LOGO_URL}
              alt="ProgramBI"
              width={320}
              height={320}
              className="h-64 w-64 object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Composer */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
            className="relative w-full max-w-3xl"
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}
