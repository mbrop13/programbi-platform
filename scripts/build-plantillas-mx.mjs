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

/**
 * Ejemplo con el que sale la plantilla: el mismo de la guía (sueldo de $15,000 desde el
 * 1 de marzo de 2026). Los resultados se guardan precalculados para que la vista previa
 * del correo o del celular muestre números antes de abrir Excel.
 */
const EJEMPLO_AGUINALDO = { sueldo: 15000, ingreso: "2026-03-01", corte: "2026-12-31" };

function isrMensual(base, tramos) {
  if (!(base > 0)) return 0;
  const t =
    tramos.find((x) => base >= x.limiteInferior && (x.limiteSuperior == null || base <= x.limiteSuperior)) ??
    tramos[tramos.length - 1];
  return t.cuotaFija + (base - t.limiteInferior) * (t.porcentajeExcedente / 100);
}

const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

function diaUtc(iso) {
  const [a, m, d] = iso.split("-").map(Number);
  return Math.floor(Date.UTC(a, m - 1, d) / 86400000);
}

/**
 * Hoja Parametros de la plantilla de aguinaldo: misma estructura que enseña la guía
 * (B2 días de ley, B3 días del año, B4 UMA, B5 tope en UMA, B6 monto exento) y debajo la
 * tarifa mensual del art. 96 en A11:D21 para el ISR.
 */
function addParametrosAguinaldo(wb, params) {
  const ws = wb.addWorksheet("Parametros");
  ws.columns = [{ width: 40 }, { width: 18 }, { width: 18 }, { width: 46 }];

  styleHeaderRow(ws.addRow(["Parámetro", "Valor 2026", "", "Fuente"]));
  const filas = [
    ["Días de aguinaldo (mínimo de ley; súbelo si tu contrato da más)", params.prestacionesLft.aguinaldoDiasMinimo, INT_FMT, "LFT art. 87"],
    ["Días del año calendario", 365, INT_FMT, "Criterio anual estándar"],
    ["UMA diaria 2026 (MXN)", params.uma.diaria, MXN_FMT, `${params.uma.fuente}, vigente ${params.uma.vigenciaInicio} a ${params.uma.vigenciaFin}`],
    ["Tope exento (veces la UMA)", params.prestacionesLft.aguinaldoExentoUmas, INT_FMT, "LISR art. 93 fracc. XIV"],
  ];
  for (const [concepto, valor, fmt, fuente] of filas) {
    const row = ws.addRow([concepto, valor, "", fuente]);
    row.getCell(2).numFmt = fmt;
  }
  styleInputCell(ws.getCell("B2"));
  ws.getCell("B2").protection = { locked: false };
  ws.getCell("B2").dataValidation = {
    type: "whole",
    operator: "greaterThanOrEqual",
    formulae: [params.prestacionesLft.aguinaldoDiasMinimo],
    showErrorMessage: true,
    errorTitle: "Días de aguinaldo",
    error: "La ley da al menos 15 días. Escribe 15 o más.",
  };
  const exento = r2(params.uma.diaria * params.prestacionesLft.aguinaldoExentoUmas);
  const rowExento = ws.addRow(["Monto exento en pesos (30 UMA)", { formula: "B4*B5", result: exento }, "", "Fórmula derivada"]);
  rowExento.getCell(2).numFmt = MXN_FMT;
  styleResultCell(rowExento.getCell(2));

  ws.addRow([]);
  ws.addRow([]);
  styleHeaderRow(ws.addRow(["Tarifa ISR mensual art. 96 LISR (2026)", "", "", params.isrArt96Mensual.fuente]));
  styleHeaderRow(ws.addRow(["Límite inferior", "Límite superior", "Cuota fija", "% sobre excedente del límite inferior"]));
  for (const t of params.isrArt96Mensual.tramos) {
    const row = ws.addRow([t.limiteInferior, t.limiteSuperior ?? 999999999, t.cuotaFija, t.porcentajeExcedente / 100]);
    row.getCell(1).numFmt = MXN_FMT;
    row.getCell(2).numFmt = MXN_FMT;
    row.getCell(3).numFmt = MXN_FMT;
    row.getCell(4).numFmt = "0.00%";
  }
  return ws;
}

async function buildAguinaldoWorkbook(params) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI";
  wb.created = new Date("2026-11-27T00:00:00Z");
  wb.calcProperties = { fullCalcOnLoad: true };

  const tramos = params.isrArt96Mensual.tramos;
  if (tramos.length !== 11) throw new Error("La fórmula de ISR espera 11 tramos en Parametros!A11:D21");

  // Resultados del ejemplo con las mismas reglas que lib/calculadoras/aguinaldo-mx.ts
  const e = EJEMPLO_AGUINALDO;
  const diario = r2(e.sueldo / 30);
  const dias = Math.max(0, diaUtc(e.corte) - Math.max(diaUtc("2026-01-01"), diaUtc(e.ingreso)) + 1);
  const bruto = r2(((diario * params.prestacionesLft.aguinaldoDiasMinimo) / 365) * dias);
  const topeExento = r2(params.uma.diaria * params.prestacionesLft.aguinaldoExentoUmas);
  const exento = Math.min(bruto, topeExento);
  const gravado = r2(Math.max(0, bruto - exento));
  const isr = gravado > 0 ? r2(isrMensual(e.sueldo + gravado, tramos) - isrMensual(e.sueldo, tramos)) : 0;
  const neto = r2(bruto - isr);

  const ws = wb.addWorksheet("Aguinaldo", { views: [{ state: "frozen", ySplit: 1 }] });
  ws.columns = [{ width: 44 }, { width: 18 }, { width: 58 }];
  styleHeaderRow(ws.addRow(["Calculadora de aguinaldo México 2026", "Valor", "Cómo se calcula"]));

  const T = "Parametros!$A$11:$D$21";
  const isrDe = (x) => `(VLOOKUP(${x},${T},3,TRUE)+(${x}-VLOOKUP(${x},${T},1,TRUE))*VLOOKUP(${x},${T},4,TRUE))`;

  const filas = [
    // [etiqueta, valor, formato, nota, tipo]
    ["Sueldo mensual bruto", e.sueldo, MXN_FMT, "Escribe tu sueldo antes de impuestos, sin bonos.", "dato"],
    ["Fecha de ingreso", new Date(`${e.ingreso}T00:00:00Z`), "dd/mm/yyyy", "Si entraste antes de 2026, déjala igual: se cuenta desde el 1 de enero.", "dato"],
    ["Fecha de corte", new Date(`${e.corte}T00:00:00Z`), "dd/mm/yyyy", "31/12/2026, o tu último día si ya no trabajas ahí.", "dato"],
    ["Salario diario", { formula: "ROUND(B2/30,2)", result: diario }, MXN_FMT, "Sueldo mensual / 30 (paso 3 de la guía).", "calculo"],
    ["Días trabajados en 2026", { formula: "MAX(0,B4-MAX(DATE(2026,1,1),B3)+1)", result: dias }, INT_FMT, "Desde el 1 de enero o tu ingreso, hasta la fecha de corte, contando ambos días.", "calculo"],
    ["Aguinaldo bruto", { formula: "ROUND((B5*Parametros!$B$2/Parametros!$B$3)*B6,2)", result: bruto }, MXN_FMT, "Salario diario × días de aguinaldo / 365 × días trabajados.", "resultado"],
    ["Parte exenta de ISR", { formula: "MIN(B7,Parametros!$B$6)", result: exento }, MXN_FMT, "Hasta 30 UMA (LISR art. 93 fracc. XIV).", "calculo"],
    ["Parte gravada", { formula: "MAX(0,B7-B8)", result: gravado }, MXN_FMT, "Lo que pasa de 30 UMA.", "calculo"],
    ["ISR estimado del aguinaldo", { formula: `IF(B9<=0,0,ROUND(${isrDe("(B2+B9)")}-${isrDe("B2")},2))`, result: isr }, MXN_FMT, "ISR del mes con aguinaldo menos ISR del mes sin él (art. 96). Sin subsidio para el empleo.", "calculo"],
    ["Aguinaldo neto estimado", { formula: "B7-B10", result: neto }, MXN_FMT, "Lo que recibirías después de ISR.", "resultado"],
  ];
  for (const [etiqueta, valor, fmt, nota, tipo] of filas) {
    const row = ws.addRow([etiqueta, valor, nota]);
    row.getCell(2).numFmt = fmt;
    row.getCell(3).alignment = { wrapText: true, vertical: "top" };
    row.getCell(3).font = { color: { argb: "FF475569" }, size: 10 };
    if (tipo === "dato") {
      styleInputCell(row.getCell(2));
      row.getCell(2).protection = { locked: false };
    }
    if (tipo === "resultado") styleResultCell(row.getCell(2));
  }

  ws.getCell("B2").dataValidation = {
    type: "decimal",
    operator: "greaterThan",
    formulae: [0],
    showErrorMessage: true,
    errorTitle: "Sueldo mensual",
    error: "Escribe un monto mayor que cero, sin el signo $.",
  };
  ws.getCell("B3").dataValidation = {
    type: "date",
    operator: "lessThanOrEqual",
    formulae: [new Date("2026-12-31T00:00:00Z")],
    showErrorMessage: true,
    errorTitle: "Fecha de ingreso",
    error: "Escribe una fecha de 2026 o anterior (dd/mm/aaaa).",
  };
  ws.getCell("B4").dataValidation = {
    type: "date",
    operator: "between",
    formulae: [new Date("2026-01-01T00:00:00Z"), new Date("2026-12-31T00:00:00Z")],
    showErrorMessage: true,
    errorTitle: "Fecha de corte",
    error: "Debe ser una fecha de 2026: el 31/12/2026 o tu último día trabajado.",
  };

  ws.addRow([]);
  const aviso = ws.addRow([
    "Plantilla educativa de ProgramBI, sin macros. No sustituye asesoría laboral o fiscal. Se paga a más tardar el 19 de diciembre (LFT art. 87).",
  ]);
  ws.mergeCells(`A${aviso.number}:C${aviso.number}`);
  aviso.getCell(1).alignment = { wrapText: true };
  aviso.getCell(1).font = { italic: true, color: { argb: "FF64748B" }, size: 10 };
  aviso.height = 30;

  const pars = addParametrosAguinaldo(wb, params);
  // Hojas protegidas sin contraseña: evita borrar fórmulas por accidente; Revisar > Desproteger la quita.
  const opciones = { selectLockedCells: true, selectUnlockedCells: true, formatColumns: true };
  await ws.protect("", opciones);
  await pars.protect("", opciones);
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
    ["aguinaldo-mexico-2026.xlsx", await buildAguinaldoWorkbook(params)],
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
