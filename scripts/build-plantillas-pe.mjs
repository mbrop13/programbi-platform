import { mkdirSync } from "node:fs";
import { join } from "node:path";
import ExcelJS from "exceljs";

const OUT_DIR = join(process.cwd(), "public", "pe", "plantillas");
mkdirSync(OUT_DIR, { recursive: true });

const SOLES_FMT = '"S/ "#,##0.00';
const PCT_FMT = "0.00%";
const INT_FMT = "#,##0";

const STYLE_TITLE = {
  font: { name: "Calibri", size: 14, bold: true, color: { argb: "FFFFFFFF" } },
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A5F" } },
  alignment: { vertical: "middle", horizontal: "left" },
};

const STYLE_HEADER = {
  font: { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } },
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF2B4C7E" } },
  alignment: { vertical: "middle", horizontal: "left", wrapText: true },
};

const STYLE_INPUT = {
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF9DB" } },
  border: {
    top: { style: "thin", color: { argb: "FFD9C97E" } },
    left: { style: "thin", color: { argb: "FFD9C97E" } },
    bottom: { style: "thin", color: { argb: "FFD9C97E" } },
    right: { style: "thin", color: { argb: "FFD9C97E" } },
  },
};

const STYLE_RESULT = {
  font: { name: "Calibri", size: 11, bold: true, color: { argb: "FF0F3D2E" } },
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6F4EA" } },
  border: {
    top: { style: "thin", color: { argb: "FF81C995" } },
    left: { style: "thin", color: { argb: "FF81C995" } },
    bottom: { style: "thin", color: { argb: "FF81C995" } },
    right: { style: "thin", color: { argb: "FF81C995" } },
  },
};

function styleRange(ws, rowNum, colStart, colEnd, style) {
  for (let c = colStart; c <= colEnd; c++) {
    const cell = ws.getCell(rowNum, c);
    if (style.font) cell.font = style.font;
    if (style.fill) cell.fill = style.fill;
    if (style.border) cell.border = style.border;
    if (style.alignment) cell.alignment = style.alignment;
  }
}

function addBanner(ws, title, subtitle, maxCol = 4) {
  ws.mergeCells(1, 1, 1, maxCol);
  ws.getCell(1, 1).value = title;
  styleRange(ws, 1, 1, maxCol, STYLE_TITLE);
  ws.getRow(1).height = 28;

  ws.mergeCells(2, 1, 2, maxCol);
  ws.getCell(2, 1).value = subtitle;
  ws.getCell(2, 1).font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF4A5568" } };
  ws.getRow(2).height = 20;
}

function addParametrosSheet(wb) {
  const ws = wb.addWorksheet("Parametros");
  addBanner(
    ws,
    "Parámetros Laborales y Tributarios — Perú 2026",
    "Celdas amarillas: editables por el usuario. Revisa siempre la vigencia oficial antes de liquidar.",
    4,
  );

  ws.getRow(4).values = ["Parámetro", "Valor", "Unidad / Tipo", "Fuente oficial y vigencia"];
  styleRange(ws, 4, 1, 4, STYLE_HEADER);
  ws.getRow(4).height = 22;

  const rows = [
    ["UIT 2026", 5500, SOLES_FMT, "D.S. 301-2025-EF (MEF / sunat.gob.pe), vigente 2026"],
    ["Deducción fija 5.ª categoría", 7, INT_FMT, "Art. 46 LIR (sunat.gob.pe): 7 UIT anuales"],
    ["Tramo 1 Renta 5.ª (hasta 5 UIT)", 0.08, PCT_FMT, "SUNAT: 8 % sobre renta neta hasta 5 UIT"],
    ["Tramo 2 Renta 5.ª (5 a 20 UIT)", 0.14, PCT_FMT, "SUNAT: 14 % sobre exceso de 5 hasta 20 UIT"],
    ["Tramo 3 Renta 5.ª (20 a 35 UIT)", 0.17, PCT_FMT, "SUNAT: 17 % sobre exceso de 20 hasta 35 UIT"],
    ["Tramo 4 Renta 5.ª (35 a 45 UIT)", 0.2, PCT_FMT, "SUNAT: 20 % sobre exceso de 35 hasta 45 UIT"],
    ["Tramo 5 Renta 5.ª (más de 45 UIT)", 0.3, PCT_FMT, "SUNAT: 30 % sobre exceso de 45 UIT"],
    ["Bonif. extraordinaria EsSalud (Ley 29351 / 30334)", 0.09, PCT_FMT, "Ley 27735 y Ley 30334 (gob.pe/mtpe): 9 %"],
    ["Bonif. extraordinaria EPS", 0.0675, PCT_FMT, "Ley 27735 y Ley 30334 (gob.pe/mtpe): 6,75 %"],
    ["Aporte empleador EsSalud", 0.09, PCT_FMT, "Ley 26790 (essalud.gob.pe): 9 %"],
    ["Aporte ONP (SNP)", 0.13, PCT_FMT, "D.L. 19990 (onp.gob.pe): 13 %"],
    ["AFP aporte obligatorio", 0.1, PCT_FMT, "SPP (sbs.gob.pe): 10 %"],
    ["AFP comisión sobre flujo", null, PCT_FMT, "Editable: completar con el valor vigente en sbs.gob.pe"],
    ["AFP prima de seguro", null, PCT_FMT, "Editable: completar con el valor vigente en sbs.gob.pe"],
    ["Asignación familiar (10 % RMV)", null, SOLES_FMT, "Editable: completar con el valor vigente en gob.pe/mtpe"],
    ["CTS — fracción de gratificación computable", 1 / 6, "0.0000", "D.S. 001-97-TR (gob.pe/mtpe): 1/6 de última gratificación"],
  ];

  rows.forEach((r, idx) => {
    const rowNum = 5 + idx;
    const row = ws.getRow(rowNum);
    row.values = [r[0], r[1], r[2] === SOLES_FMT ? "S/" : r[2] === PCT_FMT ? "%" : "Valor", r[3]];
    const valCell = row.getCell(2);
    valCell.numFmt = r[2];
    if (r[1] === null) {
      valCell.fill = STYLE_INPUT.fill;
      valCell.border = STYLE_INPUT.border;
    }
  });

  ws.columns = [{ width: 44 }, { width: 16 }, { width: 14 }, { width: 58 }];
  return ws;
}

async function buildGratificacion() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI Perú";
  const ws = wb.addWorksheet("Gratificacion 2026");
  addBanner(
    ws,
    "Calculadora de Gratificación Perú 2026 (Julio / Diciembre)",
    "Régimen general privado — Ley 27735 y Ley 30334. Edita las celdas amarillas.",
    3,
  );

  ws.getRow(4).values = ["Concepto", "Valor", "Nota / Fórmula"];
  styleRange(ws, 4, 1, 3, STYLE_HEADER);

  const items = [
    ["Remuneración básica mensual", 3000, "Dato editable", SOLES_FMT, true],
    ["Asignación familiar (si corresponde)", { formula: "IF(ISNUMBER(Parametros!B19),Parametros!B19,0)" }, "Desde Parametros!B19 (editable si aplica)", SOLES_FMT, false],
    ["Promedio horas extras / comisiones computable", 0, "Si percibió al menos 3 meses en el semestre", SOLES_FMT, true],
    ["Remuneración computable total", { formula: "SUM(B5:B7)" }, "Base de cálculo", SOLES_FMT, false],
    ["Meses calendario completos laborados (1 a 6)", 6, "En el semestre ene-jun o jul-dic", INT_FMT, true],
    ["Seguro de salud (ESSALUD o EPS)", "ESSALUD", "Escribe ESSALUD o EPS", "@", true],
    ["Gratificación bruta", { formula: "ROUND(B8*(B9/6),2)" }, "Ley 27735: Remuneración computable × meses / 6", SOLES_FMT, false],
    [
      "Bonificación extraordinaria (9 % o 6,75 %)",
      { formula: 'ROUND(B11*IF(UPPER(TRIM(B10))="EPS",Parametros!B13,Parametros!B12),2)' },
      "Ley 30334: inafecta a AFP/ONP/EsSalud",
      SOLES_FMT,
      false,
    ],
    ["Total neto a recibir (Gratificación + Bonificación)", { formula: "B11+B12" }, "Monto total a depositar", SOLES_FMT, false],
  ];

  items.forEach((it, idx) => {
    const r = 5 + idx;
    ws.getRow(r).values = [it[0], it[1], it[2]];
    ws.getCell(r, 2).numFmt = it[3];
    if (it[4]) {
      ws.getCell(r, 2).fill = STYLE_INPUT.fill;
      ws.getCell(r, 2).border = STYLE_INPUT.border;
    }
    if (r === 13) styleRange(ws, r, 1, 3, STYLE_RESULT);
  });

  ws.columns = [{ width: 46 }, { width: 18 }, { width: 46 }];
  addParametrosSheet(wb);
  const path = join(OUT_DIR, "gratificacion-peru-2026.xlsx");
  await wb.xlsx.writeFile(path);
  return path;
}

async function buildCts() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI Perú";
  const ws = wb.addWorksheet("CTS 2026");
  addBanner(
    ws,
    "Calculadora de CTS Perú 2026 (Mayo / Noviembre)",
    "D.S. 001-97-TR — Depósito semestral. Edita las celdas amarillas.",
    3,
  );

  ws.getRow(4).values = ["Concepto", "Valor", "Nota / Fórmula"];
  styleRange(ws, 4, 1, 3, STYLE_HEADER);

  const items = [
    ["Remuneración básica mensual", 3000, "Dato editable", SOLES_FMT, true],
    ["Asignación familiar (si corresponde)", { formula: "IF(ISNUMBER(Parametros!B19),Parametros!B19,0)" }, "Desde Parametros!B19", SOLES_FMT, false],
    ["Última gratificación percibida", 3000, "Dato editable (0 si no percibió en el semestre)", SOLES_FMT, true],
    ["1/6 de última gratificación", { formula: "ROUND(B7*Parametros!B20,2)" }, "D.S. 001-97-TR", SOLES_FMT, false],
    ["Remuneración computable CTS", { formula: "B5+B6+B8" }, "Base computable", SOLES_FMT, false],
    ["Meses completos laborados en el semestre (0 a 6)", 6, "Nov-Abr (mayo) o May-Oct (noviembre)", INT_FMT, true],
    ["Días adicionales laborados (0 a 29)", 0, "Fracción de mes", INT_FMT, true],
    ["CTS por meses completos", { formula: "ROUND((B9/12)*B10,2)" }, "1/12 por mes completo", SOLES_FMT, false],
    ["CTS por días adicionales", { formula: "ROUND((B9/360)*B11,2)" }, "1/360 por día", SOLES_FMT, false],
    ["Total CTS a depositar", { formula: "B12+B13" }, "Depósito semestral en cuenta CTS", SOLES_FMT, false],
  ];

  items.forEach((it, idx) => {
    const r = 5 + idx;
    ws.getRow(r).values = [it[0], it[1], it[2]];
    ws.getCell(r, 2).numFmt = it[3];
    if (it[4]) {
      ws.getCell(r, 2).fill = STYLE_INPUT.fill;
      ws.getCell(r, 2).border = STYLE_INPUT.border;
    }
    if (r === 14) styleRange(ws, r, 1, 3, STYLE_RESULT);
  });

  ws.columns = [{ width: 46 }, { width: 18 }, { width: 44 }];
  addParametrosSheet(wb);
  const path = join(OUT_DIR, "cts-peru-2026.xlsx");
  await wb.xlsx.writeFile(path);
  return path;
}

async function buildLiquidacion() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI Perú";
  const ws = wb.addWorksheet("Liquidacion 2026");
  addBanner(
    ws,
    "Liquidación de Beneficios Sociales Perú 2026",
    "CTS trunca, gratificación trunca y vacaciones truncas — Régimen general privado.",
    3,
  );

  ws.getRow(4).values = ["Concepto", "Valor", "Nota / Fórmula"];
  styleRange(ws, 4, 1, 3, STYLE_HEADER);

  const items = [
    ["Remuneración básica mensual", 3500, "Dato editable", SOLES_FMT, true],
    ["Asignación familiar (si aplica)", { formula: "IF(ISNUMBER(Parametros!B19),Parametros!B19,0)" }, "Desde Parametros!B19", SOLES_FMT, false],
    ["Última gratificación (para 1/6 CTS)", 3500, "Dato editable", SOLES_FMT, true],
    ["Remuneración computable vacaciones/gratif.", { formula: "B5+B6" }, "Básico + asignación familiar", SOLES_FMT, false],
    ["Remuneración computable CTS (con 1/6 gratif.)", { formula: "ROUND(B8+(B7*Parametros!B20),2)" }, "D.S. 001-97-TR", SOLES_FMT, false],
    ["CTS trunca: meses completos (0 a 5)", 3, "Desde último depósito CTS", INT_FMT, true],
    ["CTS trunca: días adicionales (0 a 29)", 15, "Días del mes de cese", INT_FMT, true],
    ["Gratificación trunca: meses calendario completos (0 a 5)", 3, "Meses completos en el semestre", INT_FMT, true],
    ["Vacaciones truncas: meses completos (0 a 11)", 8, "Desde último aniversario", INT_FMT, true],
    ["Vacaciones truncas: días adicionales (0 a 29)", 15, "Días adicionales", INT_FMT, true],
    ["Régimen previsional (AFP u ONP)", "AFP", "Escribe AFP u ONP (aplica a vacaciones truncas)", "@", true],
    ["Seguro de salud (ESSALUD o EPS)", "ESSALUD", "Escribe ESSALUD o EPS (bonif. gratif. trunca)", "@", true],
    ["Subtotal CTS trunca", { formula: "ROUND((B9/12)*B10+(B9/360)*B11,2)" }, "Inafecta a AFP/ONP", SOLES_FMT, false],
    ["Subtotal Gratificación trunca", { formula: "ROUND(B8*(B12/6),2)" }, "Meses completos / 6", SOLES_FMT, false],
    [
      "Bonificación extraordinaria gratif. trunca",
      { formula: 'ROUND(B18*IF(UPPER(TRIM(B16))="EPS",Parametros!B13,Parametros!B12),2)' },
      "9 % EsSalud / 6,75 % EPS",
      SOLES_FMT,
      false,
    ],
    ["Subtotal Vacaciones truncas brutas", { formula: "ROUND((B8/12)*B13+(B8/360)*B14,2)" }, "Afecta a AFP/ONP", SOLES_FMT, false],
    [
      "Descuento previsional sobre vacaciones truncas",
      {
        formula:
          'ROUND(B20*IF(UPPER(TRIM(B15))="ONP",Parametros!B15,Parametros!B16+IF(ISNUMBER(Parametros!B17),Parametros!B17,0)+IF(ISNUMBER(Parametros!B18),Parametros!B18,0)),2)',
      },
      "ONP 13 % o AFP (10 % + comisión + prima de Parametros)",
      SOLES_FMT,
      false,
    ],
    ["Total neto Liquidación de Beneficios Sociales", { formula: "B17+B18+B19+B20-B21" }, "Monto neto a pagar", SOLES_FMT, false],
  ];

  items.forEach((it, idx) => {
    const r = 5 + idx;
    ws.getRow(r).values = [it[0], it[1], it[2]];
    ws.getCell(r, 2).numFmt = it[3];
    if (it[4]) {
      ws.getCell(r, 2).fill = STYLE_INPUT.fill;
      ws.getCell(r, 2).border = STYLE_INPUT.border;
    }
    if (r === 22) styleRange(ws, r, 1, 3, STYLE_RESULT);
  });

  ws.columns = [{ width: 48 }, { width: 18 }, { width: 50 }];
  addParametrosSheet(wb);
  const path = join(OUT_DIR, "liquidacion-beneficios-sociales-peru-2026.xlsx");
  await wb.xlsx.writeFile(path);
  return path;
}

async function buildQuintaCategoria() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI Perú";
  const ws = wb.addWorksheet("Renta 5ta 2026");
  addBanner(
    ws,
    "Calculadora de Impuesto a la Renta de 5.ª Categoría — Perú 2026",
    "UIT 2026 = S/ 5.500 (D.S. 301-2025-EF) — Deducción 7 UIT y tramos progresivos SUNAT.",
    3,
  );

  ws.getRow(4).values = ["Concepto", "Valor", "Nota / Fórmula"];
  styleRange(ws, 4, 1, 3, STYLE_HEADER);

  const items = [
    ["Remuneración mensual bruta", 6000, "Dato editable", SOLES_FMT, true],
    ["Número de sueldos al año (12 + 2 gratif. = 14)", 14, "Régimen general = 14; MYPE = 12 o 13", INT_FMT, true],
    ["Otros ingresos gravados anuales (bonos, utilidades)", 0, "Dato editable", SOLES_FMT, true],
    ["Renta bruta anual proyectada", { formula: "B5*B6+B7" }, "Total ingresos gravados del año", SOLES_FMT, false],
    ["Deducción fija 7 UIT", { formula: "Parametros!B5*Parametros!B6" }, "7 × S/ 5.500 = S/ 38.500", SOLES_FMT, false],
    ["Renta neta anual imponible", { formula: "MAX(0,B8-B9)" }, "Base sobre la que aplican los tramos", SOLES_FMT, false],
    ["Tramo 1 (hasta 5 UIT) — 8 %", { formula: "ROUND(MIN(B10,5*Parametros!B5)*Parametros!B7,2)" }, "Hasta S/ 27.500", SOLES_FMT, false],
    [
      "Tramo 2 (5 a 20 UIT) — 14 %",
      { formula: "ROUND(MAX(0,MIN(B10,20*Parametros!B5)-5*Parametros!B5)*Parametros!B8,2)" },
      "De 5 a 20 UIT",
      SOLES_FMT,
      false,
    ],
    [
      "Tramo 3 (20 a 35 UIT) — 17 %",
      { formula: "ROUND(MAX(0,MIN(B10,35*Parametros!B5)-20*Parametros!B5)*Parametros!B9,2)" },
      "De 20 a 35 UIT",
      SOLES_FMT,
      false,
    ],
    [
      "Tramo 4 (35 a 45 UIT) — 20 %",
      { formula: "ROUND(MAX(0,MIN(B10,45*Parametros!B5)-35*Parametros!B5)*Parametros!B10,2)" },
      "De 35 a 45 UIT",
      SOLES_FMT,
      false,
    ],
    [
      "Tramo 5 (más de 45 UIT) — 30 %",
      { formula: "ROUND(MAX(0,B10-45*Parametros!B5)*Parametros!B11,2)" },
      "Exceso de 45 UIT",
      SOLES_FMT,
      false,
    ],
    ["Impuesto anual proyectado", { formula: "SUM(B11:B15)" }, "Suma de tramos", SOLES_FMT, false],
    ["Retención mensual referencial (÷ 12)", { formula: "ROUND(B16/12,2)" }, "Referencia mensual uniforme", SOLES_FMT, false],
  ];

  items.forEach((it, idx) => {
    const r = 5 + idx;
    ws.getRow(r).values = [it[0], it[1], it[2]];
    ws.getCell(r, 2).numFmt = it[3];
    if (it[4]) {
      ws.getCell(r, 2).fill = STYLE_INPUT.fill;
      ws.getCell(r, 2).border = STYLE_INPUT.border;
    }
    if (r === 16 || r === 17) styleRange(ws, r, 1, 3, STYLE_RESULT);
  });

  ws.columns = [{ width: 48 }, { width: 18 }, { width: 44 }];
  addParametrosSheet(wb);
  const path = join(OUT_DIR, "renta-quinta-categoria-peru-2026.xlsx");
  await wb.xlsx.writeFile(path);
  return path;
}

async function buildBoleta() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI Perú";
  const ws = wb.addWorksheet("Boleta de Pago 2026");
  addBanner(
    ws,
    "Boleta de Pago Mensual — Perú 2026",
    "D.S. 001-98-TR — Ingresos, descuentos previsionales (ONP/AFP) y aportes del empleador.",
    3,
  );

  ws.getRow(4).values = ["Concepto", "Valor", "Nota / Fórmula"];
  styleRange(ws, 4, 1, 3, STYLE_HEADER);

  const items = [
    ["Sueldo básico mensual", 3200, "Dato editable", SOLES_FMT, true],
    ["Asignación familiar (si aplica)", { formula: "IF(ISNUMBER(Parametros!B19),Parametros!B19,0)" }, "Desde Parametros!B19", SOLES_FMT, false],
    ["Horas extras / bonos remunerativos", 0, "Dato editable", SOLES_FMT, true],
    ["Total ingresos brutos", { formula: "SUM(B5:B7)" }, "Base imponible", SOLES_FMT, false],
    ["Sistema previsional (AFP u ONP)", "AFP", "Escribe AFP u ONP", "@", true],
    ["Retención Renta 5.ª categoría del mes", 0, "Dato editable (ver plantilla Renta 5.ª)", SOLES_FMT, true],
    [
      "Descuento ONP (13 %)",
      { formula: 'IF(UPPER(TRIM(B9))="ONP",ROUND(B8*Parametros!B15,2),0)' },
      "Aplica solo si es ONP",
      SOLES_FMT,
      false,
    ],
    [
      "AFP aporte obligatorio (10 %)",
      { formula: 'IF(UPPER(TRIM(B9))="AFP",ROUND(B8*Parametros!B16,2),0)' },
      "Aplica solo si es AFP",
      SOLES_FMT,
      false,
    ],
    [
      "AFP comisión sobre flujo",
      { formula: 'IF(UPPER(TRIM(B9))="AFP",ROUND(B8*IF(ISNUMBER(Parametros!B17),Parametros!B17,0),2),0)' },
      "Completa Parametros!B17 según sbs.gob.pe",
      SOLES_FMT,
      false,
    ],
    [
      "AFP prima de seguro",
      { formula: 'IF(UPPER(TRIM(B9))="AFP",ROUND(B8*IF(ISNUMBER(Parametros!B18),Parametros!B18,0),2),0)' },
      "Completa Parametros!B18 según sbs.gob.pe",
      SOLES_FMT,
      false,
    ],
    ["Total descuentos del trabajador", { formula: "B10+SUM(B11:B14)" }, "Suma de descuentos", SOLES_FMT, false],
    ["Neto a pagar al trabajador", { formula: "B8-B15" }, "Ingresos brutos − descuentos", SOLES_FMT, false],
    ["Aporte empleador EsSalud (9 %)", { formula: "ROUND(B8*Parametros!B14,2)" }, "No se descuenta al trabajador", SOLES_FMT, false],
  ];

  items.forEach((it, idx) => {
    const r = 5 + idx;
    ws.getRow(r).values = [it[0], it[1], it[2]];
    ws.getCell(r, 2).numFmt = it[3];
    if (it[4]) {
      ws.getCell(r, 2).fill = STYLE_INPUT.fill;
      ws.getCell(r, 2).border = STYLE_INPUT.border;
    }
    if (r === 16) styleRange(ws, r, 1, 3, STYLE_RESULT);
  });

  ws.columns = [{ width: 46 }, { width: 18 }, { width: 46 }];
  addParametrosSheet(wb);
  const path = join(OUT_DIR, "boleta-de-pago-peru-2026.xlsx");
  await wb.xlsx.writeFile(path);
  return path;
}

async function verifyWorkbook(path) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path);
  const names = wb.worksheets.map((w) => w.name);
  if (!names.includes("Parametros") || names.length < 2) {
    throw new Error(`Hojas inválidas en ${path}: ${names.join(", ")}`);
  }
  let formulaCount = 0;
  for (const ws of wb.worksheets) {
    ws.eachRow((row) => {
      row.eachCell((cell) => {
        if (cell.value && typeof cell.value === "object" && "formula" in cell.value) {
          formulaCount++;
        }
      });
    });
  }
  if (formulaCount === 0) {
    throw new Error(`No se encontraron fórmulas vivas en ${path}`);
  }
  return { path, sheets: names, formulaCount };
}

async function main() {
  const paths = await Promise.all([
    buildGratificacion(),
    buildCts(),
    buildLiquidacion(),
    buildQuintaCategoria(),
    buildBoleta(),
  ]);

  for (const p of paths) {
    const res = await verifyWorkbook(p);
    console.log(`OK ${res.path} | hojas=[${res.sheets.join(", ")}] | formulas=${res.formulaCount}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
