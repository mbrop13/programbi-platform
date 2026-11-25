import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

import guiaGratificacion from "@/content/guias/paso-a-paso-pe/calcular-gratificacion-excel";
import guiaCts from "@/content/guias/paso-a-paso-pe/calcular-cts-excel";
import guiaLiquidacion from "@/content/guias/paso-a-paso-pe/liquidacion-beneficios-sociales-excel";
import guiaQuinta from "@/content/guias/paso-a-paso-pe/renta-quinta-categoria-excel";
import guiaBoleta from "@/content/guias/paso-a-paso-pe/boleta-de-pago-excel";

/**
 * Guías paso a paso de Excel laboral para Perú (`/pe/guias/<slug>`).
 * Ordenadas con `calcular-gratificacion-excel` primero (prioridad #1).
 */
export const GUIAS_PASO_A_PASO_PE: GuiaPasoAPaso[] = [
  guiaGratificacion,
  guiaCts,
  guiaLiquidacion,
  guiaQuinta,
  guiaBoleta,
];

const POR_SLUG_PE = new Map(GUIAS_PASO_A_PASO_PE.map((g) => [g.slug, g]));

export function guiaPasoAPasoPePorSlug(slug: string): GuiaPasoAPaso | undefined {
  return POR_SLUG_PE.get(slug);
}
