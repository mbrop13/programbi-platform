#!/usr/bin/env node
/**
 * Genera las 5 plantillas Excel (.xlsx) laborales de Colombia 2026
 * en `public/co/plantillas/`, con fórmulas vivas sin macros y hoja `Parametros`.
 *
 * Requiere `exceljs` instalado en el repositorio principal.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "co", "plantillas");
const PARAMS_PATH = path.join(ROOT, "data", "co", "salario-minimo.json");

const FMT_COP = '"$"#,##0';
const FMT_PCT = "0.00%";
const FMT_INT = "#,##0";

const FILL_HEADER = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF0F172A" },
};
const FILL_SUBHEADER = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFE2E8F0" },
};
const FILL_INPUT = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFEF9C3" },
};
const FILL_TOTAL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFDCFCE7" },
};

const FONT_HEADER = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
const FONT_BOLD = { bold: true, size: 11 };

function estiloEncabezado(row) {
  row.eachCell((cell) => {
    cell.fill = FILL_HEADER;
    cell.font = FONT_HEADER;
    cell.alignment = { vertical: "middle", horizontal: "left" };
  });
  row.height = 24;
}

function agregarHojaParametros(wb, params) {
  const ws = wb.addWorksheet("Parametros");
  ws.columns = [
    { header: "Parámetro Colombia 2026", key: "param", width: 42 },
    { header: "Valor", key: "val", width: 20 },
    { header: "Referencia normativa / fuente", key: "ref", width: 64 },
  ];
  estiloEncabezado(ws.getRow(1));

  const rows = [
    ["SMMLV 2026 (COP)", params.smmlv_cop, "MinTrabajo — Decreto 1469 de 2025 y Decreto transitorio 0159/2026", FMT_COP],
    ["Auxilio de transporte 2026 (COP)", params.auxilio_transporte_cop, "MinTrabajo — Decreto 1470 de 2025", FMT_COP],
    ["Tope auxilio de transporte (2 SMMLV)", { formula: "B2*2" }, "Aplica para salarios hasta 2 SMMLV", FMT_COP],
    ["Salud empleado (%)", params.salud_empleado_pct / 100, "Cotización obligatoria a salud (empleado)", FMT_PCT],
    ["Pensión empleado (%)", params.pension_empleado_pct / 100, "Cotización obligatoria a pensión (empleado)", FMT_PCT],
    ["Fondo de Solidaridad Pensional (desde 4 SMMLV)", { formula: "B2*4" }, "1 % adicional desde 4 SMMLV hasta <16 SMMLV", FMT_COP],
    ["FSP tarifa base (>= 4 SMMLV)", 0.01, "Ley 100 de 1993 / Ley 797 de 2003", FMT_PCT],
    ["Intereses a las cesantías (% anual)", params.intereses_cesantias_pct_anual / 100, "Ley 52 de 1975 (12 % anual sobre cesantías)", FMT_PCT],
    ["Días base año laboral", 360, "Convención laboral colombiana (30 días/mes)", FMT_INT],
  ];

  rows.forEach(([label, val, ref, numFmt]) => {
    const row = ws.addRow([label, val, ref]);
    if (numFmt) row.getCell(2).numFmt = numFmt;
  });

  ws.addRow([]);
  const nota = ws.addRow(["Nota", "Celdas amarillas = editables. Fórmulas vivas sin macros.", "ProgramBI Colombia 2026"]);
  nota.getCell(1).font = FONT_BOLD;
  return ws;
}

function celdaInput(cell, numFmt) {
  cell.fill = FILL_INPUT;
  if (numFmt) cell.numFmt = numFmt;
}

function celdaTotal(cell, numFmt) {
  cell.fill = FILL_TOTAL;
  cell.font = FONT_BOLD;
  if (numFmt) cell.numFmt = numFmt;
}

async function buildPrima(params) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Prima de Servicios");
  ws.columns = [{ width: 42 }, { width: 22 }, { width: 48 }];

  estiloEncabezado(ws.addRow(["Calculadora Prima de Servicios Colombia 2026", "Valor", "Detalle / fórmula"]));
  ws.addRow(["Salario mensual base (COP)", params.smmlv_cop, "Salario ordinario mensual"]);
  celdaInput(ws.getCell("B2"), FMT_COP);

  ws.addRow(["Días laborados en el semestre (1–180)", 180, "Semestre ene–jun o jul–dic"]);
  celdaInput(ws.getCell("B3"), FMT_INT);

  ws.addRow(["¿Aplica auxilio de transporte?", { formula: 'IF(B2<=Parametros!B4,"Sí","No")' }, "Automático si salario <= 2 SMMLV"]);
  ws.addRow(["Auxilio de transporte incluido (COP)", { formula: "IF(B2<=Parametros!B4,Parametros!B3,0)" }, "Se suma a la base de prima"]);
  ws.getCell("B5").numFmt = FMT_COP;

  ws.addRow(["Base salarial para prima (COP)", { formula: "B2+B5" }, "Salario + auxilio de transporte si aplica"]);
  ws.getCell("B6").numFmt = FMT_COP;

  ws.addRow(["Prima de servicios bruta a pagar (COP)", { formula: "ROUND(B6*B3/Parametros!B10,0)" }, "(Base * días laborados) / 360"]);
  celdaTotal(ws.getCell("B7"), FMT_COP);

  agregarHojaParametros(wb, params);
  await wb.xlsx.writeFile(path.join(OUT_DIR, "prima-de-servicios-colombia-2026.xlsx"));
}

async function buildInteresesCesantias(params) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Intereses Cesantias");
  ws.columns = [{ width: 42 }, { width: 22 }, { width: 48 }];

  estiloEncabezado(ws.addRow(["Calculadora Intereses de Cesantías Colombia 2026", "Valor", "Detalle / fórmula"]));
  ws.addRow(["Salario mensual base (COP)", params.smmlv_cop, "Salario ordinario mensual"]);
  celdaInput(ws.getCell("B2"), FMT_COP);

  ws.addRow(["Días laborados en el año (1–360)", 360, "Año calendario o fracción"]);
  celdaInput(ws.getCell("B3"), FMT_INT);

  ws.addRow(["Auxilio de transporte incluido (COP)", { formula: "IF(B2<=Parametros!B4,Parametros!B3,0)" }, "Automático si salario <= 2 SMMLV"]);
  ws.getCell("B4").numFmt = FMT_COP;

  ws.addRow(["Base salarial (COP)", { formula: "B2+B4" }, "Salario + auxilio si aplica"]);
  ws.getCell("B5").numFmt = FMT_COP;

  ws.addRow(["Cesantías causadas (COP)", { formula: "ROUND(B5*B3/Parametros!B10,0)" }, "(Base * días) / 360"]);
  ws.getCell("B6").numFmt = FMT_COP;

  ws.addRow(["Intereses de cesantías (12 % anual)", { formula: "ROUND(B6*B3*Parametros!B9/Parametros!B10,0)" }, "(Cesantías * días * 12 %) / 360"]);
  celdaTotal(ws.getCell("B7"), FMT_COP);

  agregarHojaParametros(wb, params);
  await wb.xlsx.writeFile(path.join(OUT_DIR, "intereses-de-cesantias-colombia-2026.xlsx"));
}

async function buildCesantias(params) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Cesantias");
  ws.columns = [{ width: 42 }, { width: 22 }, { width: 48 }];

  estiloEncabezado(ws.addRow(["Calculadora Cesantías Colombia 2026", "Valor", "Detalle / fórmula"]));
  ws.addRow(["Salario mensual base (COP)", params.smmlv_cop, "Último salario mensual (o promedio si es variable)"]);
  celdaInput(ws.getCell("B2"), FMT_COP);

  ws.addRow(["Días laborados en el año (1–360)", 360, "Del 1 de enero al 31 de diciembre o retiro"]);
  celdaInput(ws.getCell("B3"), FMT_INT);

  ws.addRow(["Auxilio de transporte incluido (COP)", { formula: "IF(B2<=Parametros!B4,Parametros!B3,0)" }, "Automático si salario <= 2 SMMLV"]);
  ws.getCell("B4").numFmt = FMT_COP;

  ws.addRow(["Base salarial para cesantías (COP)", { formula: "B2+B4" }, "Salario + auxilio si aplica"]);
  ws.getCell("B5").numFmt = FMT_COP;

  ws.addRow(["Cesantías a consignar (COP)", { formula: "ROUND(B5*B3/Parametros!B10,0)" }, "(Base * días laborados) / 360"]);
  celdaTotal(ws.getCell("B6"), FMT_COP);

  ws.addRow(["Intereses sobre cesantías (referencia)", { formula: "ROUND(B6*B3*Parametros!B9/Parametros!B10,0)" }, "Se pagan directo al trabajador en enero"]);
  ws.getCell("B7").numFmt = FMT_COP;

  agregarHojaParametros(wb, params);
  await wb.xlsx.writeFile(path.join(OUT_DIR, "cesantias-colombia-2026.xlsx"));
}

async function buildLiquidacionContrato(params) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Liquidacion Contrato");
  ws.columns = [{ width: 44 }, { width: 22 }, { width: 48 }];

  estiloEncabezado(ws.addRow(["Liquidación de Contrato Laboral Colombia 2026", "Valor", "Detalle / fórmula"]));
  ws.addRow(["Salario mensual base (COP)", params.smmlv_cop, "Salario ordinario mensual"]);
  celdaInput(ws.getCell("B2"), FMT_COP);

  ws.addRow(["Días totales pendientes de salario en último mes", 15, "Días trabajados del mes actual sin pagar"]);
  celdaInput(ws.getCell("B3"), FMT_INT);

  ws.addRow(["Días causados de cesantías en el año", 180, "Desde 1 de enero (o inicio) hasta retiro"]);
  celdaInput(ws.getCell("B4"), FMT_INT);

  ws.addRow(["Días causados de prima en el semestre", 180, "Desde inicio de semestre hasta retiro"]);
  celdaInput(ws.getCell("B5"), FMT_INT);

  ws.addRow(["Días pendientes de vacaciones (sobre base 360)", 180, "Días laborados sin disfrutar vacaciones"]);
  celdaInput(ws.getCell("B6"), FMT_INT);

  ws.addRow(["Auxilio de transporte mensual aplicable", { formula: "IF(B2<=Parametros!B4,Parametros!B3,0)" }, "Aplica si salario <= 2 SMMLV"]);
  ws.getCell("B7").numFmt = FMT_COP;

  ws.addRow(["Salario proporcional pendiente", { formula: "ROUND((B2+B7)*B3/30,0)" }, "(Salario + auxilio) * días / 30"]);
  ws.getCell("B8").numFmt = FMT_COP;

  ws.addRow(["Cesantías proporcionales", { formula: "ROUND((B2+B7)*B4/Parametros!B10,0)" }, "(Salario + auxilio) * días / 360"]);
  ws.getCell("B9").numFmt = FMT_COP;

  ws.addRow(["Intereses de cesantías proporcionales", { formula: "ROUND(B9*B4*Parametros!B9/Parametros!B10,0)" }, "(Cesantías * días * 12 %) / 360"]);
  ws.getCell("B10").numFmt = FMT_COP;

  ws.addRow(["Prima de servicios proporcional", { formula: "ROUND((B2+B7)*B5/Parametros!B10,0)" }, "(Salario + auxilio) * días / 360"]);
  ws.getCell("B11").numFmt = FMT_COP;

  ws.addRow(["Vacaciones compensadas en dinero", { formula: "ROUND(B2*B6/720,0)" }, "(Salario base * días) / 720 (sin auxilio)"]);
  ws.getCell("B12").numFmt = FMT_COP;

  ws.addRow(["Total liquidación bruta estimada (COP)", { formula: "SUM(B8:B12)" }, "Suma de conceptos sin indemnización"]);
  celdaTotal(ws.getCell("B13"), FMT_COP);

  agregarHojaParametros(wb, params);
  await wb.xlsx.writeFile(path.join(OUT_DIR, "liquidacion-contrato-colombia-2026.xlsx"));
}

async function buildLiquidacionNomina(params) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Liquidacion Nomina");
  ws.columns = [{ width: 44 }, { width: 22 }, { width: 48 }];

  estiloEncabezado(ws.addRow(["Liquidación de Nómina Mensual Colombia 2026", "Valor", "Detalle / fórmula"]));
  ws.addRow(["Salario mensual pactado (COP)", params.smmlv_cop, "Salario ordinario mensual"]);
  celdaInput(ws.getCell("B2"), FMT_COP);

  ws.addRow(["Días trabajados en el mes (1–30)", 30, "Base mensual de 30 días"]);
  celdaInput(ws.getCell("B3"), FMT_INT);

  ws.addRow(["Auxilio de transporte devengado", { formula: "IF(B2<=Parametros!B4,ROUND(Parametros!B3*B3/30,0),0)" }, "Proporcional si salario <= 2 SMMLV"]);
  ws.getCell("B4").numFmt = FMT_COP;

  ws.addRow(["Salario devengado en el mes", { formula: "ROUND(B2*B3/30,0)" }, "(Salario * días) / 30"]);
  ws.getCell("B5").numFmt = FMT_COP;

  ws.addRow(["Total devengado", { formula: "B4+B5" }, "Salario devengado + auxilio de transporte"]);
  ws.getCell("B6").numFmt = FMT_COP;

  const sub = ws.addRow(["Deducciones del trabajador (IBC = salario devengado)", "", ""]);
  sub.eachCell((c) => {
    c.fill = FILL_SUBHEADER;
    c.font = FONT_BOLD;
  });

  ws.addRow(["Aporte salud (4 %)", { formula: "ROUND(B5*Parametros!B5,0)" }, "4 % del IBC"]);
  ws.getCell("B8").numFmt = FMT_COP;

  ws.addRow(["Aporte pensión (4 %)", { formula: "ROUND(B5*Parametros!B6,0)" }, "4 % del IBC"]);
  ws.getCell("B9").numFmt = FMT_COP;

  ws.addRow(["Fondo de Solidaridad Pensional (FSP)", { formula: "IF(B5>=Parametros!B7,ROUND(B5*Parametros!B8,0),0)" }, "1 % adicional si IBC >= 4 SMMLV"]);
  ws.getCell("B10").numFmt = FMT_COP;

  ws.addRow(["Total deducciones", { formula: "SUM(B8:B10)" }, "Salud + pensión + FSP"]);
  ws.getCell("B11").numFmt = FMT_COP;

  ws.addRow(["Neto a pagar al trabajador (COP)", { formula: "B6-B11" }, "Total devengado menos deducciones"]);
  celdaTotal(ws.getCell("B12"), FMT_COP);

  agregarHojaParametros(wb, params);
  await wb.xlsx.writeFile(path.join(OUT_DIR, "liquidacion-nomina-colombia-2026.xlsx"));
}

async function main() {
  const params = JSON.parse(fs.readFileSync(PARAMS_PATH, "utf8"));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  await Promise.all([
    buildPrima(params),
    buildInteresesCesantias(params),
    buildCesantias(params),
    buildLiquidacionContrato(params),
    buildLiquidacionNomina(params),
  ]);
  console.log(`[build-plantillas-co] OK: 5 plantillas generadas en ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
