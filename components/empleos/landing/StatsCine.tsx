"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const STATS = [
  { value: 5000, prefix: "+", label: "Egresados de ProgramBI" },
  { value: 10, prefix: "+", label: "Programas de datos e IA" },
  { value: 98, suffix: "%", label: "Tasa de satisfacción" },
  { value: 24, suffix: " h", label: "Aprobación de empresas" },
];

function Stat({
  value,
  prefix = "",
  suffix = "",
  label,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <div ref={ref} className="border-l border-line pl-5 lg:pl-7">
      <p className="font-mono text-5xl font-bold tracking-tight text-ink lg:text-7xl">
        {prefix}
        {Math.round(n).toLocaleString("es-CL")}
        {suffix}
      </p>
      <p className="mt-3 text-sm text-mute">{label}</p>
    </div>
  );
}

/** Métricas de marca a escala cinematográfica, con conteo animado. */
export default function StatsCine() {
  return (
    <section className="border-y border-line px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
