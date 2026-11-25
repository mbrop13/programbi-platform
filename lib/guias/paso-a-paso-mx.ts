import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { guia as aguinaldo } from "@/content/guias/paso-a-paso-mx/plantilla-aguinaldo-excel";
import { guia as finiquitoLiquidacion } from "@/content/guias/paso-a-paso-mx/finiquito-liquidacion-excel";
import { guia as tablaIsr2026 } from "@/content/guias/paso-a-paso-mx/tabla-isr-2026-excel";
import { guia as calcularPtu } from "@/content/guias/paso-a-paso-mx/calcular-ptu-excel";

/** Guías paso a paso exclusivas de México (orden editorial: aguinaldo primero). */
export const GUIAS_PASO_A_PASO_MX: GuiaPasoAPaso[] = [
  aguinaldo,
  finiquitoLiquidacion,
  tablaIsr2026,
  calcularPtu,
];

export function guiaPasoAPasoMxPorSlug(slug: string): GuiaPasoAPaso | undefined {
  return GUIAS_PASO_A_PASO_MX.find((g) => g.slug === slug);
}

export function mapaRelacionadasMx(): Record<
  string,
  { slug: string; h1: string; subtitle: string; herramienta: string; nivel: string }
> {
  const mapa: Record<
    string,
    { slug: string; h1: string; subtitle: string; herramienta: string; nivel: string }
  > = {};
  for (const g of GUIAS_PASO_A_PASO_MX) {
    mapa[g.slug] = {
      slug: g.slug,
      h1: g.h1,
      subtitle: g.subtitle,
      herramienta: g.herramienta,
      nivel: g.nivel,
    };
  }
  return mapa;
}
