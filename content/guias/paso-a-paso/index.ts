import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

import guia01 from "./dolar-observado-en-excel-automatico";
import guia02 from "./uf-utm-ipc-en-excel-automatico";
import guia03 from "./conectar-power-bi-api-banco-central";
import guia04 from "./como-hacer-flujo-de-caja-en-excel";
import guia05 from "./control-de-gastos-en-excel";
import guia06 from "./como-hacer-presupuesto-en-excel";
import guia07 from "./inventario-en-excel-entradas-y-salidas";
import guia08 from "./como-hacer-dashboard-en-excel";
import guia09 from "./liquidacion-de-sueldo-en-excel-chile";
import guia10 from "./carta-gantt-en-excel";
import guia11 from "./control-de-horas-en-excel";
import guia12 from "./control-de-ventas-en-excel";
import guia13 from "./automatizar-reportes-con-power-bi";
import guia14 from "./automatizar-excel-con-power-query";
import guia15 from "./enviar-reportes-automaticos-con-power-automate";
import guia16 from "./dashboard-de-ventas-en-power-bi-paso-a-paso";
import guia17 from "./tabla-calendario-power-bi-dax";
import guia18 from "./conectar-power-bi-a-sql-server";
import guia19 from "./automatizar-excel-con-python";
import guia20 from "./macros-vba-excel-desde-cero";

export const GUIAS_PASO_A_PASO: GuiaPasoAPaso[] = [
  guia01,
  guia02,
  guia03,
  guia04,
  guia05,
  guia06,
  guia07,
  guia08,
  guia09,
  guia10,
  guia11,
  guia12,
  guia13,
  guia14,
  guia15,
  guia16,
  guia17,
  guia18,
  guia19,
  guia20,
];

const POR_SLUG = new Map(GUIAS_PASO_A_PASO.map((g) => [g.slug, g]));

export function guiaPasoAPasoPorSlug(slug: string): GuiaPasoAPaso | undefined {
  return POR_SLUG.get(slug);
}
