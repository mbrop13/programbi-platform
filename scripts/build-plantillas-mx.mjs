#!/usr/bin/env node
/**
 * Genera las 4 plantillas Excel (.xlsx) sin macros y con fórmulas vivas para México 2026:
 * - public/mx/plantillas/aguinaldo-mexico-2026.xlsx
 * - public/mx/plantillas/finiquito-liquidacion-mexico-2026.xlsx
 * - public/mx/plantillas/tabla-isr-2026-mexico.xlsx
 * - public/mx/plantillas/ptu-mexico-2026.xlsx
 *
 * Lee los parámetros oficiales desde data/mx/parametros-laborales-2026.json.
 * Requiere: exceljs (devDependency).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PARAMETROS_PATH = path.join(ROOT, "data", "mx", "parametros-laborales-2026.json");
const OUT_DIR = path.join(ROOT, "public", "mx", "plantillas");

const MXN_FMT = '"$"#,##0.00';
const PCT_FMT = '0.00"%"';
const INT_FMT = "#,##0";

const COLOR_HEADER_BG = "FF0F172A";
const COLOR_HEADER_FG = "FFFFFFFF";
const COLOR_INPUT_BG = "FFFEF9C3";
const COLOR_RESULT_BG = "FFECFDF5";
const COLOR_BORDER = "FFCBD5E1";

function styleHeaderRow(row) {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: COLOR_HEADER_FG }, size: 11 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER_BG } };
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
  });
  row.height = 24;
}

function styleInputCell(cell) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_INPUT_BG } };
  cell.border = {
    top: { style: "thin", color: { argb: COLOR_BORDER } },
    left: { style: "thin", color: { argb: COLOR_BORDER } },
    bottom: { style: "thin", color: { argb: COLOR_BORDER } },
    right: { style: "thin", color: { argb: COLOR_BORDER } },
  };
}

function styleResultCell(cell) {
  cell.font = { bold: true, size: 11 };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_RESULT_BG } };
  cell.border = {
    top: { style: "thin", color: { argb: COLOR_BORDER } },
    left: { style: "thin", color: { argb: COLOR_BORDER } },
    bottom: { style: "thin", color: { argb: COLOR_BORDER } },
    right: { style: "thin", color: { argb: COLOR_BORDER } },
  };
}

/**
 * Agrega la hoja `Parametros` estándar con UMA 2026, SM 2026, LFT y tarifa ISR art. 96 (11 tramos).
 * Referencias clave en `Parametros`:
 * - B4: UMA diaria ($117.31)
 * - B5: UMA mensual ($3,566.22)
 * - B6: UMA anual ($42,794.64)
 * - B7: Salario mínimo general diario ($315.04)
 * - B8: Salario mínimo ZLFN diario ($440.87)
 * - B9: Aguinaldo exento (30 UMA = B4*30)
 * - B10: PTU y prima vacacional exentas (15 UMA = B4*15)
 * - A14:D24: Tarifa mensual art. 96 (11 tramos: Lím. inferior, Lím. superior, Cuota fija, % excedente)
 */
function addParametrosSheet(wb, params) {
  const ws = wb.addWorksheet("Parametros");
  ws.columns = [
    { width: 42 },
    { width: 22 },
    { width: 22 },
    { width: 44 },
  ];

  const title = ws.addRow(["Parámetros laborales y fiscales México 2026", "", "", "Fuente oficial"]);
  styleHeaderRow(title);
  ws.addRow(["Concepto", "Valor", "Unidad / Vigencia", "Referencia"]);
  styleHeaderRow(ws.getRow(2));

  ws.addRow(["", "", "", ""]);
  ws.addRow([
    "UMA diaria 2026",
    params.uma.diaria,
    `${params.uma.vigenciaInicio} a ${params.uma.vigenciaFin}`,
    params.uma.fuente,
  ]);
  ws.getCell("B4").numFmt = MXN_FMT;

  ws.addRow([
    "UMA mensual 2026",
    params.uma.mensual,
    "Mensual",
    params.uma.fuente,
  ]);
  ws.getCell("B5").numFmt = MXN_FMT;

  ws.addRow([
    "UMA anual 2026",
    params.uma.anual,
    "Anual",
    params.uma.fuente,
  ]);
  ws.getCell("B6").numFmt = MXN_FMT;

  ws.addRow([
    "Salario mínimo general diario 2026",
    params.salarioMinimo.generalDiario,
    `Desde ${params.salarioMinimo.vigenciaInicio}`,
    params.salarioMinimo.fuente,
  ]);
  ws.getCell("B7").numFmt = MXN_FMT;

  ws.addRow([
    "Salario mínimo ZLFN diario 2026",
    params.salarioMinimo.zlfnDiario,
    `Desde ${params.salarioMinimo.vigenciaInicio}`,
    params.salarioMinimo.fuente,
  ]);
  ws.getCell("B8").numFmt = MXN_FMT;

  ws.addRow([
    "Exención aguinaldo (30 UMA)",
    { formula: "B4*30", result: params.prestacionesLft.aguinaldoExentoPesos },
    "MXN",
    "Art. 93 fracción XIV LISR",
  ]);
  ws.getCell("B9").numFmt = MXN_FMT;

  ws.addRow([
    "Exención PTU y prima vacacional (15 UMA)",
    { formula: "B4*15", result: params.prestacionesLft.ptuExentaPesos },
    "MXN",
    "Art. 93 fracción XIV LISR",
  ]);
  ws.getCell("B10").numFmt = MXN_FMT;

  ws.addRow(["", "", "", ""]);
  const isrTitle = ws.addRow([
    "Tarifa ISR mensual art. 96 LISR (2026)",
    "",
    "",
    params.isrArt96Mensual.fuente,
  ]);
  styleHeaderRow(isrTitle);

  const isrHeader = ws.addRow([
    "Límite inferior",
    "Límite superior",
    "Cuota fija",
    "% sobre excedente del límite inferior",
  ]);
  styleHeaderRow(isrHeader);

  for (const tramo of params.isrArt96Mensual.tramos) {
    const row = ws.addRow([
      tramo.limiteInferior,
      tramo.limiteSuperior ?? 999999999,
      tramo.cuotaFija,
      tramo.porcentajeExcedente / 100,
    ]);
    row.getCell(1).numFmt = MXN_FMT;
    row.getCell(2).numFmt = MXN_FMT;
    row.getCell(3).numFmt = MXN_FMT;
    row.getCell(4).numFmt = "0.00%";
  }

  ws.addRow(["", "", "", ""]);
  ws.addRow([
    "Fuentes institucionales",
    "DOF / SAT / INEGI / CONASAMI / STPS",
    "2026",
    "Plantilla sin macros elaborada por ProgramBI",
  ]);

  return ws;
}

function buildAguinaldoWorkbook(params) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI";
  wb.created = new Date("2026-01-15T00:00:00Z");

  const ws = wb.addWorksheet("Calculadora Aguinaldo 2026");
  ws.columns = [{ width: 42 }, { width: 22 }, { width: 42 }];

  styleHeaderRow(ws.addRow(["Calculadora de Aguinaldo México 2026", "Valor", "Notas / Fundamento LFT y LISR"]));

  ws.addRow(["Sueldo mensual bruto (MXN)", 20000, "Dato editable (celda amarilla)"]);
  ws.getCell("B2").numFmt = MXN_FMT;
  styleInputCell(ws.getCell("B2"));

  ws.addRow(["Días de aguinaldo pactados (mínimo LFT: 15)", 15, "Art. 87 Ley Federal del Trabajo"]);
  ws.getCell("B3").numFmt = INT_FMT;
  styleInputCell(ws.getCell("B3"));

  ws.addRow(["Días trabajados en el año (365 = año completo)", 365, "Proporcional si laboraste menos del año"]);
  ws.getCell("B4").numFmt = INT_FMT;
  styleInputCell(ws.getCell("B4"));

  ws.addRow(["", "", ""]);

  ws.addRow(["Salario diario", { formula: "B2/30" }, "Sueldo mensual / 30 días"]);
  ws.getCell("B6").numFmt = MXN_FMT;

  ws.addRow(["Aguinaldo bruto", { formula: "(B6*B3)*(B4/365)" }, "Salario diario × días de aguinaldo × proporción anual"]);
  ws.getCell("B7").numFmt = MXN_FMT;
  styleResultCell(ws.getCell("B7"));

  ws.addRow(["Tope exento de ISR (30 UMA)", { formula: "Parametros!B9" }, "30 × $117.31 = $3,519.30"]);
  ws.getCell("B8").numFmt = MXN_FMT;

  ws.addRow(["Aguinaldo exento", { formula: "MIN(B7,B8)" }, "No causa ISR"]);
  ws.getCell("B9").numFmt = MXN_FMT;

  ws.addRow(["Aguinaldo gravado para ISR", { formula: "MAX(0,B7-B8)" }, "Excedente sobre 30 UMA"]);
  ws.getCell("B10").numFmt = MXN_FMT;

  ws.addRow(["ISR estimado (tasa efectiva mensual de referencia)", {
    formula: "IF(B10<=0,0,ROUND(B10*INDEX(Parametros!D14:D24,MATCH(B2,Parametros!A14:A24,1)),2))",
  }, "Estimación marginal con tarifa art. 96 RMF 2026"]);
  ws.getCell("B11").numFmt = MXN_FMT;

  ws.addRow(["Aguinaldo neto estimado a recibir", { formula: "B7-B11" }, "Aguinaldo bruto − ISR estimado"]);
  ws.getCell("B12").numFmt = MXN_FMT;
  styleResultCell(ws.getCell("B12"));

  addParametrosSheet(wb, params);
  return wb;
}

function buildFiniquitoWorkbook(params) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI";
  wb.created = new Date("2026-01-15T00:00:00Z");

  const ws = wb.addWorksheet("Finiquito y Liquidacion 2026");
  ws.columns = [{ width: 46 }, { width: 22 }, { width: 44 }];

  styleHeaderRow(ws.addRow(["Calculadora de Finiquito y Liquidación México 2026", "Valor", "Fundamento LFT (STPS)"]));

  ws.addRow(["Tipo de separación (1 = Renuncia/Finiquito, 2 = Despido injustificado)", 2, "1: solo finiquito | 2: finiquito + liquidación"]);
  ws.getCell("B2").numFmt = INT_FMT;
  styleInputCell(ws.getCell("B2"));

  ws.addRow(["Sueldo mensual bruto (MXN)", 22000, "Dato editable"]);
  ws.getCell("B3").numFmt = MXN_FMT;
  styleInputCell(ws.getCell("B3"));

  ws.addRow(["Años completos de antigüedad", 3, "Dato editable"]);
  ws.getCell("B4").numFmt = INT_FMT;
  styleInputCell(ws.getCell("B4"));

  ws.addRow(["Días trabajados en el año en curso", 180, "Para aguinaldo proporcional"]);
  ws.getCell("B5").numFmt = INT_FMT;
  styleInputCell(ws.getCell("B5"));

  ws.addRow(["Días de salario pendientes de pago", 10, "Quincena o días laborados no cobrados"]);
  ws.getCell("B6").numFmt = INT_FMT;
  styleInputCell(ws.getCell("B6"));

  ws.addRow(["Días de vacaciones pendientes / proporcionales", 7, "Art. 76 LFT (mínimo 12 días el 1.er año)"]);
  ws.getCell("B7").numFmt = "0.0";
  styleInputCell(ws.getCell("B7"));

  ws.addRow(["", "", ""]);
  ws.addRow(["Salario diario", { formula: "B3/30" }, "Sueldo mensual / 30"]);
  ws.getCell("B9").numFmt = MXN_FMT;

  ws.addRow(["Salario diario tope prima de antigüedad (2 × SM general)", { formula: "MIN(B9,Parametros!B7*2)" }, "Art. 162 y 486 LFT"]);
  ws.getCell("B10").numFmt = MXN_FMT;

  ws.addRow(["Salarios pendientes", { formula: "B9*B6" }, "Días trabajados no pagados"]);
  ws.getCell("B11").numFmt = MXN_FMT;

  ws.addRow(["Aguinaldo proporcional (15 días)", { formula: "(B9*15)*(B5/365)" }, "Art. 87 LFT"]);
  ws.getCell("B12").numFmt = MXN_FMT;

  ws.addRow(["Vacaciones pendientes", { formula: "B9*B7" }, "Art. 79 LFT"]);
  ws.getCell("B13").numFmt = MXN_FMT;

  ws.addRow(["Prima vacacional (25 %)", { formula: "B13*0.25" }, "Art. 80 LFT"]);
  ws.getCell("B14").numFmt = MXN_FMT;

  ws.addRow(["Subtotal Finiquito", { formula: "SUM(B11:B14)" }, "Corresponde en renuncia o despido"]);
  ws.getCell("B15").numFmt = MXN_FMT;
  styleResultCell(ws.getCell("B15"));

  ws.addRow(["Indemnización constitucional (90 días)", { formula: "IF(B2=2,B9*90,0)" }, "Art. 48 y 50 LFT (solo despido injustificado)"]);
  ws.getCell("B16").numFmt = MXN_FMT;

  ws.addRow(["20 días por año de servicio", { formula: "IF(B2=2,B9*20*B4,0)" }, "Art. 50 fracción II LFT"]);
  ws.getCell("B17").numFmt = MXN_FMT;

  ws.addRow(["Prima de antigüedad (12 días por año, tope 2 SM)", {
    formula: "IF(OR(B2=2,B4>=15),B10*12*B4,0)",
  }, "Art. 162 LFT (despido o renuncia con 15+ años)"]);
  ws.getCell("B18").numFmt = MXN_FMT;

  ws.addRow(["Total bruto estimado (Finiquito + Liquidación)", { formula: "B15+SUM(B16:B18)" }, "Antes de retención de ISR aplicable"]);
  ws.getCell("B19").numFmt = MXN_FMT;
  styleResultCell(ws.getCell("B19"));

  addParametrosSheet(wb, params);
  return wb;
}

function buildIsrWorkbook(params) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI";
  wb.created = new Date("2026-01-15T00:00:00Z");

  const ws = wb.addWorksheet("Calculadora ISR 2026");
  ws.columns = [{ width: 42 }, { width: 22 }, { width: 44 }];

  styleHeaderRow(ws.addRow(["Calculadora ISR Mensual 2026 (Art. 96 LISR)", "Valor", "Referencia Anexo 8 RMF 2026"]));

  ws.addRow(["Ingreso gravable mensual (MXN)", 25000, "Dato editable (celda amarilla)"]);
  ws.getCell("B2").numFmt = MXN_FMT;
  styleInputCell(ws.getCell("B2"));

  ws.addRow(["Límite inferior aplicable", {
    formula: "IF(B2<=0,0,INDEX(Parametros!A14:A24,MATCH(B2,Parametros!A14:A24,1)))",
  }, "Tramo correspondiente en Anexo 8"]);
  ws.getCell("B3").numFmt = MXN_FMT;

  ws.addRow(["Excedente sobre límite inferior", { formula: "MAX(0,B2-B3)" }, "Ingreso − Límite inferior"]);
  ws.getCell("B4").numFmt = MXN_FMT;

  ws.addRow(["Tasa marginal (%)", {
    formula: "IF(B2<=0,0,INDEX(Parametros!D14:D24,MATCH(B2,Parametros!A14:A24,1)))",
  }, "Porcentaje sobre el excedente"]);
  ws.getCell("B5").numFmt = "0.00%";

  ws.addRow(["Impuesto marginal", { formula: "B4*B5" }, "Excedente × Tasa marginal"]);
  ws.getCell("B6").numFmt = MXN_FMT;

  ws.addRow(["Cuota fija", {
    formula: "IF(B2<=0,0,INDEX(Parametros!C14:C24,MATCH(B2,Parametros!A14:A24,1)))",
  }, "Cuota fija del tramo"]);
  ws.getCell("B7").numFmt = MXN_FMT;

  ws.addRow(["ISR a retener mensual", { formula: "ROUND(B6+B7,2)" }, "Cuota fija + Impuesto marginal"]);
  ws.getCell("B8").numFmt = MXN_FMT;
  styleResultCell(ws.getCell("B8"));

  ws.addRow(["Tasa efectiva de ISR", { formula: "IF(B2<=0,0,B8/B2)" }, "ISR / Ingreso gravable"]);
  ws.getCell("B9").numFmt = "0.00%";

  ws.addRow(["Ingreso neto después de ISR", { formula: "B2-B8" }, "Antes de cuotas IMSS"]);
  ws.getCell("B10").numFmt = MXN_FMT;
  styleResultCell(ws.getCell("B10"));

  addParametrosSheet(wb, params);
  return wb;
}

function buildPtuWorkbook(params) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI";
  wb.created = new Date("2026-01-15T00:00:00Z");

  const ws = wb.addWorksheet("Calculadora PTU 2026");
  ws.columns = [{ width: 46 }, { width: 22 }, { width: 44 }];

  styleHeaderRow(ws.addRow(["Calculadora de PTU / Reparto de Utilidades 2026", "Valor", "Fundamento LFT (Art. 117-127) y LISR"]));

  ws.addRow(["Utilidad fiscal neta de la empresa (MXN)", 1000000, "Dato editable (10 % se reparte entre trabajadores)"]);
  ws.getCell("B2").numFmt = MXN_FMT;
  styleInputCell(ws.getCell("B2"));

  ws.addRow(["Suma total de días trabajados (plantilla)", 12000, "Suma de días laborados de todos los empleados"]);
  ws.getCell("B3").numFmt = INT_FMT;
  styleInputCell(ws.getCell("B3"));

  ws.addRow(["Suma total de salarios devengados (plantilla)", 4500000, "Nómina anual base para PTU"]);
  ws.getCell("B4").numFmt = MXN_FMT;
  styleInputCell(ws.getCell("B4"));

  ws.addRow(["Tus días trabajados en el año", 365, "Mínimo 60 días para eventuales"]);
  ws.getCell("B5").numFmt = INT_FMT;
  styleInputCell(ws.getCell("B5"));

  ws.addRow(["Tu salario anual devengado (MXN)", 240000, "Salario cuota diaria × días trabajados"]);
  ws.getCell("B6").numFmt = MXN_FMT;
  styleInputCell(ws.getCell("B6"));

  ws.addRow(["", "", ""]);

  ws.addRow(["Monto total a repartir (10 % utilidad)", { formula: "B2*0.10" }, "Resolución Comisión Nacional PTU"]);
  ws.getCell("B8").numFmt = MXN_FMT;

  ws.addRow(["50 % por días trabajados (fondo)", { formula: "B8*0.5" }, "Art. 123 LFT"]);
  ws.getCell("B9").numFmt = MXN_FMT;

  ws.addRow(["50 % por salarios devengados (fondo)", { formula: "B8*0.5" }, "Art. 123 LFT"]);
  ws.getCell("B10").numFmt = MXN_FMT;

  ws.addRow(["Tu PTU por días trabajados", { formula: "IF(B3<=0,0,(B9/B3)*B5)" }, "Proporción por días"]);
  ws.getCell("B11").numFmt = MXN_FMT;

  ws.addRow(["Tu PTU por salarios devengados", { formula: "IF(B4<=0,0,(B10/B4)*B6)" }, "Proporción por salarios"]);
  ws.getCell("B12").numFmt = MXN_FMT;

  ws.addRow(["PTU bruta total estimada", { formula: "B11+B12" }, "Sujeta a tope de 3 meses de salario o promedio 3 años"]);
  ws.getCell("B13").numFmt = MXN_FMT;
  styleResultCell(ws.getCell("B13"));

  ws.addRow(["PTU exenta de ISR (15 UMA)", { formula: "MIN(B13,Parametros!B10)" }, "15 × $117.31 = $1,759.65"]);
  ws.getCell("B14").numFmt = MXN_FMT;

  ws.addRow(["PTU gravada para ISR", { formula: "MAX(0,B13-Parametros!B10)" }, "Excedente sobre 15 UMA"]);
  ws.getCell("B15").numFmt = MXN_FMT;

  addParametrosSheet(wb, params);
  return wb;
}

async function main() {
  const params = JSON.parse(fs.readFileSync(PARAMETROS_PATH, "utf8"));
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const specs = [
    ["aguinaldo-mexico-2026.xlsx", buildAguinaldoWorkbook(params)],
    ["finiquito-liquidacion-mexico-2026.xlsx", buildFiniquitoWorkbook(params)],
    ["tabla-isr-2026-mexico.xlsx", buildIsrWorkbook(params)],
    ["ptu-mexico-2026.xlsx", buildPtuWorkbook(params)],
  ];

  for (const [filename, wb] of specs) {
    const outPath = path.join(OUT_DIR, filename);
    await wb.xlsx.writeFile(outPath);
    console.log(`Generado: ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
