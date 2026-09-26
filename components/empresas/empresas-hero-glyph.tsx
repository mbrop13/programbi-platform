"use client";

import { useEffect, useState } from "react";
import { HeroGlyphField } from "@/components/referrals/hero-glyph-field";

const SECTORS = [
  { word: "minería", label: "Empresas mineras" },
  { word: "finanzas", label: "Entidades financieras" },
  { word: "industria", label: "Industria y manufactura" },
  { word: "retail", label: "Retail y consumo" },
  { word: "salud", label: "Salud y servicios" },
  { word: "energía", label: "Energía y utilities" },
] as const;

const HOLD_MS = 4400;

/** Hero visual de /empresas: las partículas se reacomodan por sector. */
export function EmpresasHeroGlyph() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((v) => (v + 1) % SECTORS.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, []);

  const sector = SECTORS[index];

  return (
    <div className="absolute inset-0" aria-hidden>
      <HeroGlyphField text={sector.word} className="absolute inset-0" />
      <p className="absolute bottom-5 left-5 inline-flex rounded-full border border-line bg-paper/85 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-mute uppercase backdrop-blur">
        {sector.label}
      </p>
    </div>
  );
}
