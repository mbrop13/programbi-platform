"use client";

// =============================================================================
// Confetti · ráfaga de papelillos usando sólo framer-motion (sin dependencias).
// Se monta, anima durante ~1.4s y desaparece. Llámalo con una `key` que cambie
// para redisparar.
// =============================================================================

import { useState } from "react";
import { motion } from "framer-motion";

const COLORS = [
  "#58CC02", // verde Duolingo
  "#FF4B4B", // rojo
  "#FFC800", // amarillo
  "#1CB0F6", // azul
  "#A560E8", // morado
  "#FF9600", // naranjo
];

interface Piece {
  id: number;
  x: number; // posición inicial horizontal %
  color: string;
  rotate: number;
  drift: number; // deriva horizontal
  delay: number;
  size: number;
  shape: "rect" | "circle";
}

export default function Confetti({
  count = 40,
  duration = 1.4,
}: {
  count?: number;
  duration?: number;
}) {
  // Inicialización perezosa: los valores aleatorios se calculan una sola vez
  // por montaje (no en cada render) para cumplir con la pureza del render.
  const [pieces] = useState<Piece[]>(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 160,
      delay: Math.random() * 0.25,
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }))
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, y: -20, x: `${p.x}%`, rotate: p.rotate }}
          animate={{
            opacity: [1, 1, 0],
            y: ["-10vh", "110vh"],
            x: `calc(${p.x}% + ${p.drift}px)`,
            rotate: p.rotate + 540,
          }}
          transition={{
            duration,
            delay: p.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.shape === "rect" ? p.size * 0.6 : p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "9999px" : "2px",
          }}
        />
      ))}
    </div>
  );
}
