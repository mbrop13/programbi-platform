import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { guia as cesantias2026 } from "@/content/guias/paso-a-paso-co/cesantias-2026";
import { guia as interesesDeCesantiasExcel } from "@/content/guias/paso-a-paso-co/intereses-de-cesantias-excel";
import { guia as liquidacionDeContratoExcel } from "@/content/guias/paso-a-paso-co/liquidacion-de-contrato-excel";
import { guia as liquidacionDeNominaExcel } from "@/content/guias/paso-a-paso-co/liquidacion-de-nomina-excel";
import { guia as primaDeServiciosExcel } from "@/content/guias/paso-a-paso-co/prima-de-servicios-excel";

export const GUIAS_PASO_A_PASO_CO: GuiaPasoAPaso[] = [
  primaDeServiciosExcel,
  interesesDeCesantiasExcel,
  cesantias2026,
  liquidacionDeContratoExcel,
  liquidacionDeNominaExcel,
];

const POR_SLUG_CO = new Map(GUIAS_PASO_A_PASO_CO.map((guia) => [guia.slug, guia]));

export function guiaPasoAPasoCoPorSlug(slug: string): GuiaPasoAPaso | undefined {
  return POR_SLUG_CO.get(slug);
}
