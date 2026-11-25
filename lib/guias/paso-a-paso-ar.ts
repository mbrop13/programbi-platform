import { guia as calcularAguinaldoExcel } from "@/content/guias/paso-a-paso-ar/calcular-aguinaldo-excel";
import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const GUIAS_PASO_A_PASO_AR: GuiaPasoAPaso[] = [calcularAguinaldoExcel];

const POR_SLUG_AR = new Map(GUIAS_PASO_A_PASO_AR.map((g) => [g.slug, g]));

export function guiaPasoAPasoArPorSlug(slug: string): GuiaPasoAPaso | undefined {
  return POR_SLUG_AR.get(slug);
}
