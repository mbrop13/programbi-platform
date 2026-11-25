import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const ROOT = process.cwd();
const OUT_XLSX = path.join(ROOT, "public", "ar", "plantillas", "aguinaldo-sac-argentina-2026.xlsx");

async function loadExcelJS() {
  try {
    const mod = await import("exceljs");
    return mod.default ?? mod;
  } catch {
    const require = createRequire(import.meta.url);
    return require("exceljs");
  }
}

async function main() {
  const ExcelJS = await loadExcelJS();
  fs.mkdirSync(path.dirname(OUT_XLSX), { recursive: true });

  const wb = new ExcelJS.Workbook();
  wb.creator = "ProgramBI";
  wb.created = new Date("2026-11-25T00:00:00Z");

  // --- Hoja 1: Calculadora SAC ---
  const ws = wb.addWorksheet("Calculadora SAC", {
    views: [{ showGridLines: true }],
  });

  ws.columns = [
    { width: 44 },
    { width: 22 },
    { width: 52 },
  ];

  const titleStyle = {
    font: { name: "Calibri", size: 14, bold: true, color: { argb: "FFFFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } },
    alignment: { vertical: "middle", horizontal: "left", indent: 1 },
  };
  const sectionStyle = {
    font: { name: "Calibri", size: 11, bold: true, color: { argb: "FF0F172A" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } },
    alignment: { vertical: "middle", horizontal: "left", indent: 1 },
  };
  const inputFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFEF9C3" },
  };
  const outputFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFDCFCE7" },
  };
  const borderThin = {
    top: { style: "thin", color: { argb: "FFCBD5E1" } },
    left: { style: "thin", color: { argb: "FFCBD5E1" } },
    bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
    right: { style: "thin", color: { argb: "FFCBD5E1" } },
  };

  ws.mergeCells("A1:C1");
  ws.getCell("A1").value = "Calculadora de Aguinaldo (SAC) — Argentina 2026";
  ws.getRow(1).height = 28;
  ws.getCell("A1").style = titleStyle;

  ws.mergeCells("A2:C2");
  ws.getCell("A2").value = "Celdas amarillas: editables. Fórmulas vivas sin macros según Ley 23.041 y LCT arts. 121–123.";
  ws.getCell("A2").font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF475569" } };

  // Bloque 1: Remuneraciones del semestre
  ws.mergeCells("A4:C4");
  ws.getCell("A4").value = "1. Remuneraciones devengadas del semestre (opcional para calcular el máximo)";
  ws.getCell("A4").style = sectionStyle;

  const meses = [
    ["Mes 1 (Ene / Jul)", 1250000],
    ["Mes 2 (Feb / Ago)", 1250000],
    ["Mes 3 (Mar / Sep)", 1320000],
    ["Mes 4 (Abr / Oct)", 1320000],
    ["Mes 5 (May / Nov)", 1400000],
    ["Mes 6 (Jun / Dic)", 1400000],
  ];

  meses.forEach(([label, val], idx) => {
    const r = 5 + idx;
    ws.getCell(`A${r}`).value = label;
    ws.getCell(`B${r}`).value = val;
    ws.getCell(`B${r}`).numFmt = '"$ "#,##0.00';
    ws.getCell(`B${r}`).fill = inputFill;
    ws.getCell(`B${r}`).border = borderThin;
    ws.getCell(`C${r}`).value = idx === 0 ? "Ingresá el sueldo bruto normal y habitual de cada mes" : "";
    ws.getCell(`C${r}`).font = { name: "Calibri", size: 9, color: { argb: "FF64748B" } };
  });

  // Bloque 2: Parámetros del cálculo
  ws.mergeCells("A12:C12");
  ws.getCell("A12").value = "2. Datos para el cálculo de aguinaldo / SAC y liquidación final";
  ws.getCell("A12").style = sectionStyle;

  ws.getCell("A13").value = "Mejor remuneración del semestre (ARS)";
  ws.getCell("B13").value = { formula: "MAX(B5:B10)", result: 1400000 };
  ws.getCell("B13").numFmt = '"$ "#,##0.00';
  ws.getCell("B13").fill = inputFill;
  ws.getCell("B13").border = borderThin;
  ws.getCell("C13").value = "Podés pisar esta fórmula con un importe directo si preferís.";

  ws.getCell("A14").value = "Días trabajados en el semestre";
  ws.getCell("B14").value = 184;
  ws.getCell("B14").numFmt = "#,##0";
  ws.getCell("B14").fill = inputFill;
  ws.getCell("B14").border = borderThin;
  ws.getCell("C14").value = "Para semestre completo igualar a días del semestre; si no, días corridos trabajados.";

  ws.getCell("A15").value = "Días totales del semestre";
  ws.getCell("B15").value = 184;
  ws.getCell("B15").numFmt = "#,##0";
  ws.getCell("B15").fill = inputFill;
  ws.getCell("B15").border = borderThin;
  ws.getCell("C15").value = "1.º semestre: 181 días (182 bisiesto) · 2.º semestre: 184 días.";

  ws.getCell("A16").value = "Aportes sobre SAC (jubilación, PAMI, obra social, sindicato)";
  ws.getCell("B16").value = 0.17;
  ws.getCell("B16").numFmt = "0.00%";
  ws.getCell("B16").fill = inputFill;
  ws.getCell("B16").border = borderThin;
  ws.getCell("C16").value = "Completar con el porcentaje vigente en tu recibo de sueldo (ej. 11% + 3% + 3% = 17%).";

  // Bloque 3: Resultados
  ws.mergeCells("A18:C18");
  ws.getCell("A18").value = "3. Resultado estimado (Bruto vs. Neto)";
  ws.getCell("A18").style = sectionStyle;

  ws.getCell("A19").value = "SAC Bruto (50 % mejor remuneración × proporción días)";
  ws.getCell("B19").value = { formula: "ROUND(B13*0.5*(B14/B15),2)", result: 700000 };
  ws.getCell("B19").numFmt = '"$ "#,##0.00';
  ws.getCell("B19").font = { name: "Calibri", size: 11, bold: true };
  ws.getCell("B19").border = borderThin;
  ws.getCell("C19").value = "Fórmula legal: =REDONDEAR(MejorRemuneración * 50% * (DíasTrabajados / DíasSemestre), 2)";

  ws.getCell("A20").value = "Descuentos / aportes estimados";
  ws.getCell("B20").value = { formula: "ROUND(B19*B16,2)", result: 119000 };
  ws.getCell("B20").numFmt = '"$ "#,##0.00';
  ws.getCell("B20").border = borderThin;
  ws.getCell("C20").value = "Completar con el porcentaje vigente de aportes en tu recibo de sueldo (celda B16).";

  ws.getCell("A21").value = "SAC Neto estimado de bolsillo";
  ws.getCell("B21").value = { formula: "B19-B20", result: 581000 };
  ws.getCell("B21").numFmt = '"$ "#,##0.00';
  ws.getCell("B21").font = { name: "Calibri", size: 12, bold: true, color: { argb: "FF14532D" } };
  ws.getCell("B21").fill = outputFill;
  ws.getCell("B21").border = borderThin;
  ws.getCell("C21").value = "No contempla retención de Impuesto a las Ganancias ni embargos particulares.";

  // --- Hoja 2: Parametros ---
  const wsParam = wb.addWorksheet("Parametros");
  wsParam.columns = [{ width: 34 }, { width: 42 }, { width: 58 }];

  wsParam.mergeCells("A1:C1");
  wsParam.getCell("A1").value = "Parámetros legales y fuentes oficiales — Aguinaldo / SAC (Argentina)";
  wsParam.getCell("A1").style = titleStyle;
  wsParam.getRow(1).height = 26;

  const filasParam = [
    ["Norma / Concepto", "Referencia", "Enlace oficial / Detalle"],
    [
      "Ley 23.041 (SAC)",
      "50 % de la mayor remuneración mensual devengada por todo concepto dentro de los semestres",
      "https://www.argentina.gob.ar/normativa/nacional/ley-23041-27193",
    ],
    [
      "Ley de Contrato de Trabajo (LCT 20.744)",
      "Arts. 121, 122 y 123 (concepto, épocas de pago y SAC proporcional en liquidación final)",
      "https://www.argentina.gob.ar/normativa/nacional/ley-20744-25552",
    ],
    [
      "Vencimientos legales",
      "1.ª cuota: hasta 30 de junio · 2.ª cuota: hasta 18 de diciembre",
      "Modificación art. 122 LCT (Ley 27.073)",
    ],
    [
      "Aportes sobre recibo de sueldo",
      "Jubilación (11 %), Ley 19.032 / PAMI (3 %), Obra Social (3 %) + sindicato según convenio",
      "Completar celda B16 de la hoja Calculadora SAC con el porcentaje vigente en tu recibo de sueldo.",
    ],
    [
      "Plantilla generada por",
      "ProgramBI — Datos de Argentina",
      "https://www.programbi.com/ar/datos",
    ],
  ];

  filasParam.forEach((row, idx) => {
    const r = idx + 3;
    wsParam.getCell(`A${r}`).value = row[0];
    wsParam.getCell(`B${r}`).value = row[1];
    wsParam.getCell(`C${r}`).value = row[2];
    if (idx === 0) {
      ["A", "B", "C"].forEach((col) => {
        wsParam.getCell(`${col}${r}`).style = sectionStyle;
      });
    } else {
      ["A", "B", "C"].forEach((col) => {
        wsParam.getCell(`${col}${r}`).border = borderThin;
      });
    }
  });

  await wb.xlsx.writeFile(OUT_XLSX);
  console.log(`[build-plantillas-ar] OK: generado ${OUT_XLSX}`);
}

main().catch((err) => {
  console.error("[build-plantillas-ar] ERROR:", err);
  process.exit(1);
});
