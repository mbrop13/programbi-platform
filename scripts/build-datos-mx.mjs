#!/usr/bin/env node
/**
 * Pipeline de datos para México (/mx):
 * - Lee fuentes oficiales en data/mx/fuente/
 * - Genera data/mx/carreras-imco-2026.json (79 carreras: 75 publicables + 4 excluidas)
 * - Genera data/mx/parametros-laborales-2026.json (tarifas ISR art. 96 RMF 2026, UMA, SM, LFT)
 * - Genera public/mx/datos/carreras-mejor-pagadas/csv/carreras-mexico-imco-2026.csv (UTF-8 BOM)
 *
 * Node puro, 0 dependencias externas, 100 % idempotente.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const FUENTE_DIR = path.join(ROOT, "data", "mx", "fuente");
const OUT_CARRERAS = path.join(ROOT, "data", "mx", "carreras-imco-2026.json");
const OUT_PARAMETROS = path.join(ROOT, "data", "mx", "parametros-laborales-2026.json");
const OUT_CSV = path.join(
  ROOT,
  "public",
  "mx",
  "datos",
  "carreras-mejor-pagadas",
  "csv",
  "carreras-mexico-imco-2026.csv"
);

const ATRIBUCION_IMCO = "IMCO, Compara Carreras 2026, con base en INEGI (ENOE) y ANUIES";
const FUENTE_URL_IMCO = "https://imco.org.mx/";
const SLUGS_RESERVADOS = new Set(["carreras-mejor-pagadas", "csv"]);

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  values.push(current);
  return values;
}

function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error(`CSV vacío o sin filas: ${filePath}`);
  }
  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const row = {};
    for (let i = 0; i < headers.length; i++) {
      row[headers[i]] = (cols[i] ?? "").trim();
    }
    return row;
  });
}

function toNumberOrNull(val) {
  if (val === undefined || val === null) return null;
  const s = String(val).trim();
  if (s === "" || s.toUpperCase() === "NA" || s.toUpperCase() === "N/A") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function toIntOrNull(val) {
  const n = toNumberOrNull(val);
  return n === null ? null : Math.round(n);
}

function slugifyFallback(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function csvEscape(val) {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function formatNumMxCsv(val, decimals = 0) {
  if (val === null || val === undefined || !Number.isFinite(val)) return "";
  return val.toFixed(decimals);
}

function median(numbers) {
  if (numbers.length === 0) return null;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Parsea una tabla de tarifa ISR dentro de anexo8.txt a partir de un marcador de sección.
 */
function parseIsrTable(anexoText, sectionStartRegex, nextSectionRegex) {
  const startMatch = anexoText.match(sectionStartRegex);
  if (!startMatch || startMatch.index === undefined) {
    throw new Error(`No se encontró la sección ISR: ${sectionStartRegex}`);
  }
  const afterStart = anexoText.slice(startMatch.index);
  const endMatch = afterStart.slice(startMatch[0].length).match(nextSectionRegex);
  const block =
    endMatch && endMatch.index !== undefined
      ? afterStart.slice(0, startMatch[0].length + endMatch.index)
      : afterStart;

  const tramos = [];
  const lineRegex =
    /^\s*([\d,]+\.\d{2})\s+([\d,]+\.\d{2}|En adelante)\s+([\d,]+\.\d{2})\s+(\d+\.\d{2})\s*$/gm;
  let m;
  while ((m = lineRegex.exec(block)) !== null) {
    const limiteInferior = Number(m[1].replace(/,/g, ""));
    const limiteSuperior = m[2] === "En adelante" ? null : Number(m[2].replace(/,/g, ""));
    const cuotaFija = Number(m[3].replace(/,/g, ""));
    const porcentajeExcedente = Number(m[4]);
    tramos.push({
      limiteInferior,
      limiteSuperior,
      cuotaFija,
      porcentajeExcedente,
    });
  }
  if (tramos.length !== 11) {
    throw new Error(`Se esperaban 11 tramos ISR y se extrajeron ${tramos.length}`);
  }
  return tramos;
}

function buildCarreras() {
  const imcoRows = readCsv(path.join(FUENTE_DIR, "imco_compara_carreras_2026.csv"));
  const pubRows = readCsv(path.join(FUENTE_DIR, "fichas_publicables_mx.csv"));
  const excRows = readCsv(path.join(FUENTE_DIR, "fichas_excluidas_mx.csv"));

  const pubMap = new Map();
  for (const r of pubRows) {
    const key = `${r.CVE_CARRERA}::${r.CARRERA}`;
    pubMap.set(key, r);
  }

  const excMap = new Map();
  for (const r of excRows) {
    const key = `${r.CVE_CARRERA}::${r.CARRERA}`;
    excMap.set(key, r);
  }

  const registros = imcoRows.map((row) => {
    const cveCarrera = row.CVE_CARRERA;
    const carrera = row.CARRERA;
    const key = `${cveCarrera}::${carrera}`;
    const pub = pubMap.get(key);
    const exc = excMap.get(key);

    if (!pub && !exc) {
      throw new Error(`Carrera no encontrada en publicables ni excluidas: ${key}`);
    }
    if (pub && exc) {
      throw new Error(`Carrera duplicada en publicables y excluidas: ${key}`);
    }

    const publicable = Boolean(pub);
    const slug = pub ? pub.slug : slugifyFallback(carrera);
    if (!slug || SLUGS_RESERVADOS.has(slug)) {
      throw new Error(`Slug inválido o reservado (${slug}) para ${key}`);
    }

    const solicitudes = toIntOrNull(row.SOLICITUDES);
    const lugares = toIntOrNull(row.LUGARES);
    const tasaAceptacion =
      solicitudes !== null && lugares !== null && solicitudes > 0 ? lugares / solicitudes : null;

    return {
      cveCarrera,
      carrera,
      slug,
      publicable,
      motivoExclusion: exc ? exc.motivo : null,
      esTsu: carrera.startsWith("TSU."),
      posicionIngreso: null,
      ingreso: toNumberOrNull(row.INGRESO),
      ingresoQ50: toNumberOrNull(row.INGRESO_Q50),
      ingresoQ25: toNumberOrNull(row.INGRESO_Q25),
      ingresoQ75: toNumberOrNull(row.INGRESO_Q75),
      ingresoQ100: toNumberOrNull(row.INGRESO_Q100),
      ingresoFormal: toNumberOrNull(row.INGRESO_FORMAL),
      ingresoInformal: toNumberOrNull(row.INGRESO_INFORMAL),
      ingresoHombre: toNumberOrNull(row.INGRESO_H),
      ingresoMujer: toNumberOrNull(row.INGRESO_M),
      ingresoLic: toNumberOrNull(row.INGRESO_LIC),
      ingresoPosgrado: toNumberOrNull(row.ING_POSG),
      incrementoPosgrado: toNumberOrNull(row.INCREMENTO_POSGRADO),
      tasaDesocupacion: toNumberOrNull(row.TASA_DESOCUPACION),
      tasaInformalidad: toNumberOrNull(row.TASA_INFORMALIDAD),
      tasaOcupacion: toNumberOrNull(row.TASA_OCUPACION),
      tasaRiesgo: toNumberOrNull(row.TASA_RIESGO),
      probEmpleoCalidad: toNumberOrNull(row.PROB_EMPL_CAL),
      tasaAplicacion: toNumberOrNull(row.TASA_APLICACION),
      ocupado: toIntOrNull(row.OCUPADO),
      total: toIntOrNull(row.TOTAL),
      matricula: toIntOrNull(row.MATRICULA),
      egresados: toIntOrNull(row.EGRESADOS),
      nuevoIngreso: toIntOrNull(row.NUEVO_INGRESO),
      solicitudes,
      lugares,
      tasaAceptacion,
      pctMujer: toNumberOrNull(row.PCT_MUJER),
      pctHombre: toNumberOrNull(row.PCT_HOMBRE),
      pct30Menos: toNumberOrNull(row.PCT_30MENOS),
      pct30Mas: toNumberOrNull(row.PCT_30MAS),
      rankIngresoImco: toIntOrNull(row.RANK_INGRESO),
      rankEgresadosImco: toIntOrNull(row.RANK_EGRESADOS),
      costoTotalPublica: toNumberOrNull(row.COSTO_TOTAL_PUBLICA),
      costoTotalPrivada: toNumberOrNull(row.COSTO_TOTAL_PRIVADA),
      rsiPublica: toNumberOrNull(row.RSI_PUB),
      rsiPrivada: toNumberOrNull(row.RSI_PRI),
      tiempoInversionPublica: toNumberOrNull(row.TIEMPO_INVERSION_PUB),
      tiempoInversionPrivada: toNumberOrNull(row.TIEMPO_INVERSION_PRIV),
    };
  });

  // Verificar unicidad de slugs
  const slugSet = new Set();
  for (const r of registros) {
    if (slugSet.has(r.slug)) {
      throw new Error(`Slug duplicado detectado: ${r.slug}`);
    }
    slugSet.add(r.slug);
  }

  // Asignar posición de ingreso (1..75) entre las publicables
  const publicablesOrdenadas = registros
    .filter((r) => r.publicable && r.ingreso !== null)
    .sort((a, b) => (b.ingreso ?? 0) - (a.ingreso ?? 0));

  publicablesOrdenadas.forEach((r, idx) => {
    r.posicionIngreso = idx + 1;
  });

  const ingresosPub = publicablesOrdenadas.map((r) => r.ingreso);
  const medianaIngresoPublicables = median(ingresosPub);
  const promedioIngresoPublicables =
    ingresosPub.reduce((acc, v) => acc + v, 0) / ingresosPub.length;

  const dataset = {
    meta: {
      pais: "MX",
      edicion: "2026",
      fuente: ATRIBUCION_IMCO,
      fuenteUrl: FUENTE_URL_IMCO,
      totalCarreras: registros.length,
      totalPublicables: publicablesOrdenadas.length,
      totalExcluidas: registros.length - publicablesOrdenadas.length,
      medianaIngresoPublicables,
      promedioIngresoPublicables,
    },
    carreras: registros,
  };

  // Validaciones de control
  if (dataset.meta.totalCarreras !== 79) {
    throw new Error(`Total carreras debe ser 79, obtenido: ${dataset.meta.totalCarreras}`);
  }
  if (dataset.meta.totalPublicables !== 75) {
    throw new Error(`Total publicables debe ser 75, obtenido: ${dataset.meta.totalPublicables}`);
  }
  if (dataset.meta.totalExcluidas !== 4) {
    throw new Error(`Total excluidas debe ser 4, obtenido: ${dataset.meta.totalExcluidas}`);
  }

  const excluidasIds = new Set(registros.filter((r) => !r.publicable).map((r) => r.cveCarrera));
  for (const id of ["513", "610", "621", "420"]) {
    if (!excluidasIds.has(id)) {
      throw new Error(`Falta carrera excluida esperada: ${id}`);
    }
  }

  const c125 = registros.find((r) => r.cveCarrera === "125");
  if (!c125 || !c125.publicable || c125.tasaDesocupacion !== null) {
    throw new Error("Carrera 125 debe ser publicable con tasaDesocupacion: null");
  }

  const mat = registros.find((r) => r.cveCarrera === "531" && r.publicable);
  if (!mat || Math.round(mat.ingreso) !== 29887 || Number((mat.tasaDesocupacion * 100).toFixed(1)) !== 1.3) {
    throw new Error(`Validación fallida para Matemáticas (531): ${JSON.stringify(mat)}`);
  }

  const med = registros.find((r) => r.cveCarrera === "911" && r.publicable);
  if (
    !med ||
    Math.round(med.ingreso) !== 27823 ||
    Number((med.tasaDesocupacion * 100).toFixed(1)) !== 1.6 ||
    Math.round(med.tasaAceptacion * 100) !== 19
  ) {
    throw new Error(`Validación fallida para Medicina general (911): ${JSON.stringify(med)}`);
  }

  return { dataset, publicablesOrdenadas };
}

function buildParametros() {
  const anexoText = fs.readFileSync(path.join(FUENTE_DIR, "anexo8.txt"), "utf8");

  const isrMensualArt96 = parseIsrTable(
    anexoText,
    /^V\.\s+Tarifa aplicable durante 2026 para el cálculo de los pagos provisionales mensuales/im,
    /^VI\.\s+Tarifa del mes de enero de 2026/im
  );

  const isrQuincenalArt96 = parseIsrTable(
    anexoText,
    /^IV\.\s+Tarifa aplicable cuando hagan pagos que correspondan a un periodo de 15 días/im,
    /^V\.\s+Tarifa aplicable durante 2026/im
  );

  const umaDiaria = 117.31;
  const umaMensual = 3566.22;
  const umaAnual = 42794.64;

  const aguinaldoExentoPesos = Number((30 * umaDiaria).toFixed(2));
  const ptuExentaPesos = Number((15 * umaDiaria).toFixed(2));
  const primaVacacionalExentaPesos = Number((15 * umaDiaria).toFixed(2));

  const parametros = {
    anio: 2026,
    pais: "MX",
    moneda: "MXN",
    uma: {
      diaria: umaDiaria,
      mensual: umaMensual,
      anual: umaAnual,
      vigenciaInicio: "2026-02-01",
      vigenciaFin: "2027-01-31",
      fuente: "INEGI (DOF enero 2026)",
    },
    salarioMinimo: {
      generalDiario: 315.04,
      zlfnDiario: 440.87,
      vigenciaInicio: "2026-01-01",
      fuente: "CONASAMI (DOF 9 de diciembre de 2025)",
    },
    prestacionesLft: {
      aguinaldoDiasMinimo: 15,
      aguinaldoExentoUmas: 30,
      aguinaldoExentoPesos,
      ptuPorcentajeUtilidades: 10,
      ptuExentaUmas: 15,
      ptuExentaPesos,
      primaVacacionalPorcentajeMinimo: 25,
      primaVacacionalExentaUmas: 15,
      primaVacacionalExentaPesos,
      vacacionesDiasPrimerAnio: 12,
      indemnizacionConstitucionalDias: 90,
      primaAntiguedadDiasPorAnio: 12,
      primaAntiguedadTopeSalariosMinimos: 2,
      fuente: "Ley Federal del Trabajo y art. 93 LISR",
    },
    isrArt96Mensual: {
      vigencia: "2026",
      fuente: "Anexo 8 de la RMF para 2026 (DOF 28 de diciembre de 2025), apartado B, fracción V",
      tramos: isrMensualArt96,
    },
    isrArt96Quincenal: {
      vigencia: "2026",
      fuente: "Anexo 8 de la RMF para 2026 (DOF 28 de diciembre de 2025), apartado B, fracción IV",
      tramos: isrQuincenalArt96,
    },
  };

  // Validaciones de control ISR y UMA
  const m0 = parametros.isrArt96Mensual.tramos[0];
  const mLast = parametros.isrArt96Mensual.tramos[10];
  if (
    m0.limiteInferior !== 0.01 ||
    m0.limiteSuperior !== 844.59 ||
    m0.cuotaFija !== 0 ||
    m0.porcentajeExcedente !== 1.92
  ) {
    throw new Error(`Primer tramo ISR mensual inválido: ${JSON.stringify(m0)}`);
  }
  if (
    mLast.limiteInferior !== 425642 ||
    mLast.limiteSuperior !== null ||
    mLast.cuotaFija !== 133488.54 ||
    mLast.porcentajeExcedente !== 35
  ) {
    throw new Error(`Último tramo ISR mensual inválido: ${JSON.stringify(mLast)}`);
  }

  const q0 = parametros.isrArt96Quincenal.tramos[0];
  const qLast = parametros.isrArt96Quincenal.tramos[10];
  if (
    q0.limiteInferior !== 0.01 ||
    q0.limiteSuperior !== 416.7 ||
    q0.cuotaFija !== 0 ||
    q0.porcentajeExcedente !== 1.92
  ) {
    throw new Error(`Primer tramo ISR quincenal inválido: ${JSON.stringify(q0)}`);
  }
  if (
    qLast.limiteInferior !== 210020.71 ||
    qLast.limiteSuperior !== null ||
    qLast.cuotaFija !== 65866.05 ||
    qLast.porcentajeExcedente !== 35
  ) {
    throw new Error(`Último tramo ISR quincenal inválido: ${JSON.stringify(qLast)}`);
  }

  if (aguinaldoExentoPesos !== 3519.3) {
    throw new Error(`30 UMA debe ser 3519.30, obtenido: ${aguinaldoExentoPesos}`);
  }
  if (ptuExentaPesos !== 1759.65) {
    throw new Error(`15 UMA debe ser 1759.65, obtenido: ${ptuExentaPesos}`);
  }

  return parametros;
}

function buildCsvContent(publicablesOrdenadas) {
  const headers = [
    "posicion",
    "cve_carrera",
    "carrera",
    "slug",
    "nivel",
    "ingreso_mensual_mxn",
    "ingreso_mediano_q50_mxn",
    "tasa_desocupacion_pct",
    "tasa_informalidad_pct",
    "tasa_ocupacion_pct",
    "solicitudes",
    "lugares",
    "tasa_aceptacion_pct",
    "matricula",
    "egresados",
    "fuente",
  ];

  const rows = publicablesOrdenadas.map((r) => [
    r.posicionIngreso,
    r.cveCarrera,
    r.carrera,
    r.slug,
    r.esTsu ? "TSU" : "Licenciatura",
    r.ingreso !== null ? Math.round(r.ingreso) : "",
    r.ingresoQ50 !== null ? Math.round(r.ingresoQ50) : "",
    r.tasaDesocupacion !== null ? formatNumMxCsv(r.tasaDesocupacion * 100, 1) : "",
    r.tasaInformalidad !== null ? formatNumMxCsv(r.tasaInformalidad * 100, 1) : "",
    r.tasaOcupacion !== null ? formatNumMxCsv(r.tasaOcupacion * 100, 1) : "",
    r.solicitudes ?? "",
    r.lugares ?? "",
    r.tasaAceptacion !== null ? formatNumMxCsv(r.tasaAceptacion * 100, 0) : "",
    r.matricula ?? "",
    r.egresados ?? "",
    ATRIBUCION_IMCO,
  ]);

  const lines = [headers.join(","), ...rows.map((cols) => cols.map(csvEscape).join(","))];
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}

function assertNoForbiddenWord(text, label) {
  if (/empleabilidad/i.test(text)) {
    throw new Error(`Se detectó la palabra prohibida "empleabilidad" en ${label}`);
  }
}

function main() {
  const { dataset, publicablesOrdenadas } = buildCarreras();
  const parametros = buildParametros();
  const csvContent = buildCsvContent(publicablesOrdenadas);

  const carrerasJson = JSON.stringify(dataset, null, 2) + "\n";
  const parametrosJson = JSON.stringify(parametros, null, 2) + "\n";

  assertNoForbiddenWord(carrerasJson, "carreras-imco-2026.json");
  assertNoForbiddenWord(parametrosJson, "parametros-laborales-2026.json");
  assertNoForbiddenWord(csvContent, "carreras-mexico-imco-2026.csv");

  fs.mkdirSync(path.dirname(OUT_CARRERAS), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_PARAMETROS), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });

  fs.writeFileSync(OUT_CARRERAS, carrerasJson, "utf8");
  fs.writeFileSync(OUT_PARAMETROS, parametrosJson, "utf8");
  fs.writeFileSync(OUT_CSV, csvContent, "utf8");

  console.log(
    `OK build-datos-mx: ${dataset.meta.totalCarreras} carreras (${dataset.meta.totalPublicables} publicables, ${dataset.meta.totalExcluidas} excluidas), 11 tramos ISR mensual/quincenal, CSV generado.`
  );
}

main();
