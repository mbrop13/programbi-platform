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
// Tanda 2 — P1
import guia21 from "./chatgpt-para-analisis-de-datos";
import guia22 from "./ia-para-excel-chatgpt-claude-gemini";
import guia23 from "./tabla-dinamica-en-excel";
import guia24 from "./gemini-para-analisis-de-datos";
import guia25 from "./ia-para-analizar-pdf";
import guia26 from "./prompts-para-excel";
import guia27 from "./ia-para-power-bi-dax";
import guia28 from "./copilot-en-power-bi";
import guia29 from "./ia-para-python-analisis-de-datos";
import guia30 from "./buscarv-y-buscarx-en-excel";
import guia31 from "./que-es-analisis-de-datos";
// Tanda 2 — P2
import guia32 from "./mcp-power-bi-claude";
import guia33 from "./ia-para-sql";
import guia34 from "./ia-para-hacer-graficos";
import guia35 from "./notebooklm-que-es-y-como-usarlo";
import guia36 from "./gemini-en-google-sheets";
import guia37 from "./formulas-de-excel-mas-usadas";
import guia38 from "./funcion-si-excel-varias-condiciones";
import guia39 from "./python-para-analisis-de-datos";
import guia40 from "./consultas-sql-ejemplos";
import guia41 from "./como-ser-analista-de-datos";
import guia42 from "./ciencia-de-datos-vs-analisis-de-datos";
import guia43 from "./licencias-power-bi-precio-chile";
import guia44 from "./google-sheets-vs-excel";
// Tanda 2 — P3
import guia45 from "./chatgpt-vs-gemini-vs-copilot";
import guia46 from "./copilot-studio-crear-agente";
import guia47 from "./automatizar-tareas-con-ia";
import guia48 from "./preguntas-entrevista-analista-de-datos";
import guia49 from "./calcular-finiquito-chile-excel";

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
  guia21,
  guia22,
  guia23,
  guia24,
  guia25,
  guia26,
  guia27,
  guia28,
  guia29,
  guia30,
  guia31,
  guia32,
  guia33,
  guia34,
  guia35,
  guia36,
  guia37,
  guia38,
  guia39,
  guia40,
  guia41,
  guia42,
  guia43,
  guia44,
  guia45,
  guia46,
  guia47,
  guia48,
  guia49,
];

const POR_SLUG = new Map(GUIAS_PASO_A_PASO.map((g) => [g.slug, g]));

export function guiaPasoAPasoPorSlug(slug: string): GuiaPasoAPaso | undefined {
  return POR_SLUG.get(slug);
}
