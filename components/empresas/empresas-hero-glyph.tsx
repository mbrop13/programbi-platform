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

const VISIBLE_MS = 3400;
const FADE_MS = 500;

/** Hero visual de /empresas: el glyph rota por sector con fundido suave. */
export function EmpresasHeroGlyph() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let t1 = 0;
    let t2 = 0;
    const tick = () => {
      t1 = window.setTimeout(() => {
        if (!alive) return;
        setVisible(false);
        t2 = window.setTimeout(() => {
          if (!alive) return;
          setIndex((v) => (v + 1) % SECTORS.length);
          setVisible(true);
          tick();
        }, FADE_MS);
      }, VISIBLE_MS);
    };
    tick();
    return () => {
      alive = false;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const sector = SECTORS[index];

  return (
    <div className="absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <HeroGlyphField text={sector.word} className="absolute inset-0" />
      </div>
      <p className="absolute bottom-5 left-5 inline-flex rounded-full border border-line bg-paper/85 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-mute uppercase backdrop-blur">
        {sector.label}
      </p>
    </div>
  );
}
