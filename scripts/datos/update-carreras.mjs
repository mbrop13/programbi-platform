#!/usr/bin/env node
/**
 * Pipeline oficial de datos de carreras de Chile (mifuturo.cl / SIES + IPC BDE).
 *
 * Uso:
 *   node scripts/datos/update-carreras.mjs [--force] [--local]
 *
 * Descarga las bases 2025-2026 (A, B, C, IES) y la base histórica 2024-2025 (A)
 * desde mifuturo.cl, detecta ediciones nuevas en mi-futuro-buscadores,
 * actualiza IPC desde la API BDE del Banco Central si existe BCCH_API_TOKEN,
 * valida todo con Zod y pruebas de humo, y genera JSON + CSV estáticos.
 */

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");

const BUSCADORES_URL = "https://www.mifuturo.cl/mi-futuro-buscadores/";
const USER_AGENT = "ProgramBI-Datos/1.0 (+https://www.programbi.com/datos)";

const DEFAULT_URLS = {
  A: "https://www.mifuturo.cl/wp-content/uploads/2025/12/Buscador_Estadi%CC%81sticasCarrera_2025_2026_SIES.xlsx",
  B: "https://www.mifuturo.cl/wp-content/uploads/2026/11/Buscador_Empleabilidad_ingresos_2025_2026_SIES.xlsx",
  C: "https://www.mifuturo.cl/wp-content/uploads/2026/11/Buscador_de_Carreras_2025_2026_SIES.xlsx",
  IES: "https://www.mifuturo.cl/wp-content/uploads/2026/03/Buscador_Instituciones_2025_2026_SIES-vf.xlsx",
  A_PREV: "https://www.mifuturo.cl/wp-content/uploads/2024/12/Buscador_Estadisticas_por_carrera_2024_2025_SIES.xlsx",
};

const RESERVED_SLUGS = new Set([
  "comparar",
  "retorno",
  "test",
  "puntaje-ponderado",
  "tecnologia-y-datos",
  "compartir",
  "embed",
  "mejor-pagadas",
  "mas-empleabilidad",
  "mejor-sueldo-por-arancel",
  "baratas-con-buena-empleabilidad",
  "crecieron-en-sueldo-real",
  "mejor-pagadas-vespertinas",
]);

const FLAGS = new Set(process.argv.slice(2));
const FORCE = FLAGS.has("--force");
const LOCAL_ONLY = FLAGS.has("--local");

const MISSING = new Set(["", "s/i", "n/a", "na", "-", "—"]);

function cleanStr(val) {
  if (val === null || val === undefined) return "";
  return String(val).replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function normKey(val) {
  return cleanStr(val)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseNum(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return Number.isFinite(val) ? val : null;
  const s = cleanStr(val);
  if (MISSING.has(s.toLowerCase())) return null;
  // Formato moneda "$ 3.407.000" o decimal con coma
  if (s.includes("$")) {
    const digits = s.replace(/[^0-9-]/g, "");
    const n = Number(digits);
    return Number.isFinite(n) ? n : null;
  }
  const normalized = s.includes(",") && !s.includes(".")
    ? s.replace(",", ".")
    : s.replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function parsePercentOrRatio(val) {
  const n = parseNum(val);
  if (n === null) return null;
  return n > 1 && n <= 100 ? n / 100 : n;
}

function roundInt(val) {
  return val === null ? null : Math.round(val);
}

function round4(val) {
  return val === null ? null : Math.round(val * 10000) / 10000;
}

function normalizeTipo(raw) {
  const s = cleanStr(raw).replace(/Insitutos/gi, "Institutos");
  const k = normKey(s);
  if (k.includes("universidad")) return { key: "u", label: "Universidades" };
  if (k.includes("instituto")) return { key: "ip", label: "Institutos Profesionales" };
  if (k.includes("centro") || k.includes("cft")) return { key: "cft", label: "Centros de Formación Técnica" };
  throw new Error(`Tipo de institución desconocido: "${raw}"`);
}

function parseMontoTramo(fragmento) {
  const limpio = cleanStr(fragmento);
  const soloNumero = limpio.match(/^\$\s*([\d.]+)$/);
  if (soloNumero) {
    const val = Number(soloNumero[1].replace(/\./g, ""));
    if (Number.isFinite(val) && val > 0) return val;
  }
  const conPalabras = limpio.match(/^\$\s*(?:(\d+)\s*mill[oó]n(?:es)?)?\s*(?:(\d+)\s*mil)?$/i);
  if (conPalabras && (conPalabras[1] || conPalabras[2])) {
    const millones = conPalabras[1] ? Number(conPalabras[1]) * 1_000_000 : 0;
    const miles = conPalabras[2] ? Number(conPalabras[2]) * 1_000 : 0;
    const total = millones + miles;
    if (total > 0) return total;
  }
  throw new Error(`Monto de tramo no reconocido: "${fragmento}"`);
}

function parseTramo(raw) {
  const texto = cleanStr(raw);
  if (MISSING.has(texto.toLowerCase())) return null;
  const cerrado = texto.match(/^(?:De|Desde)\s+(.+?)\s+a\s+(.+)$/i);
  if (cerrado) {
    const min = parseMontoTramo(cerrado[1]);
    const max = parseMontoTramo(cerrado[2]);
    if (min > max) throw new Error(`Tramo invertido: ${texto}`);
    return { texto, min, max };
  }
  const sobre = texto.match(/^Sobre\s+(.+)$/i);
  if (sobre) {
    return { texto, min: parseMontoTramo(sobre[1]), max: null };
  }
  const bajo = texto.match(/^(?:Bajo|Menor a|Menos de)\s+(.+)$/i);
  if (bajo) {
    return { texto, min: 0, max: parseMontoTramo(bajo[1]) };
  }
  throw new Error(`Tramo no reconocido: "${texto}"`);
}

function slugify(name) {
  return normKey(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeMifuturoUrl(rawUrl) {
  let u = rawUrl.trim();
  if (u.startsWith("//")) u = "https:" + u;
  u = u.replace(/^https?:\/\/mifuturo\.cl\//i, "https://www.mifuturo.cl/");
  // Encode non-ASCII preserving NFD percent sequences if already encoded
  try {
    const parsed = new URL(u);
    if (!/%[0-9A-Fa-f]{2}/.test(parsed.pathname)) {
      parsed.pathname = parsed.pathname
        .split("/")
        .map((seg) => encodeURIComponent(seg))
        .join("/");
    }
    return parsed.toString();
  } catch {
    return u;
  }
}

async function fetchWithRetries(url, expectBinary = false) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30_000);
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
      if (!expectBinary) return await res.text();
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 50_000) {
        throw new Error(`Archivo sospechosamente pequeño (${buf.length} bytes) en ${url}`);
      }
      if (buf.slice(0, 2).toString("ascii") !== "PK" || ct.includes("text/html")) {
        throw new Error(`Respuesta no es XLSX válido (ct=${ct}, magic=${buf.slice(0, 2).toString("ascii")}) en ${url}`);
      }
      return buf;
    } catch (err) {
      lastErr = err;
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
  throw lastErr;
}

async function detectLatestEdition() {
  const html = await fetchWithRetries(BUSCADORES_URL, false);
  const links = [...html.matchAll(/href=["']([^"']*\.xlsx)["']/gi)].map((m) => normalizeMifuturoUrl(m[1]));
  if (links.length === 0) {
    throw new Error("No se encontraron enlaces .xlsx en mi-futuro-buscadores");
  }
  // Buscar el par de años más reciente (ej. 2026_2027 o 2025_2026)
  const yearsFound = [];
  for (const link of links) {
    const m = link.match(/(20\d{2})[_-](20\d{2})/);
    if (m) yearsFound.push({ ed: `${m[1]}-${m[2]}`, y1: Number(m[1]), link });
  }
  if (yearsFound.length === 0) {
    throw new Error("El patrón de nombres de archivos en mifuturo.cl cambió: no se detectó AAAA_AAAA.");
  }
  const maxYear = Math.max(...yearsFound.map((x) => x.y1));
  const ed = `${maxYear}-${maxYear + 1}`;
  const edLinks = links.filter((l) => l.includes(`${maxYear}_${maxYear + 1}`) || l.includes(`${maxYear}-${maxYear + 1}`));
  const pick = (re) => edLinks.find((l) => re.test(decodeURIComponent(l)));
  const urlA = pick(/Estad[ií\u0301]*sticas.*Carrera/i);
  const urlB = pick(/Empleabilidad.*ingresos/i);
  const urlC = pick(/Buscador_de_Carreras/i);
  const urlIES = pick(/Buscador_Instituciones/i) ?? DEFAULT_URLS.IES;
  if (!urlA || !urlB || !urlC) {
    throw new Error(`Faltan archivos en la edición detectada ${ed}: A=${urlA} B=${urlB} C=${urlC}`);
  }
  const prevEd = `${maxYear - 1}-${maxYear}`;
  const prevLinks = links.filter((l) => l.includes(`${maxYear - 1}_${maxYear}`) || l.includes(`${maxYear - 1}-${maxYear}`));
  const urlAPrev = prevLinks.find((l) => /Estad[ií\u0301]*sticas/i.test(decodeURIComponent(l))) ?? DEFAULT_URLS.A_PREV;
  return { edicion: ed, prevEdicion: prevEd, urls: { A: urlA, B: urlB, C: urlC, IES: urlIES, A_PREV: urlAPrev } };
}

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function cellText(cell) {
  if (!cell) return "";
  if (cell.value && typeof cell.value === "object" && "result" in cell.value) {
    return cleanStr(cell.value.result);
  }
  return cleanStr(cell.text ?? cell.value);
}

function cellVal(cell) {
  if (!cell) return null;
  const v = cell.value;
  if (v && typeof v === "object" && "result" in v) return v.result;
  return v;
}

/** Construye mapa de columnas por encabezado (1 o 2 filas) sin usar índices fijos. */
function buildColumnResolver(ws, headerRows = 2) {
  const cols = [];
  for (let c = 1; c <= ws.columnCount; c++) {
    const r1 = headerRows === 2 ? cleanStr(ws.getRow(1).getCell(c).text) : "";
    const r2 = cleanStr(ws.getRow(headerRows).getCell(c).text);
    cols.push({
      col: c,
      g: normKey(r1),
      h: normKey(r2),
      rawH: r2,
    });
  }
  return {
    find(hPattern, gPattern = null) {
      const found = cols.find((c) => {
        const hOk = typeof hPattern === "string" ? c.h === normKey(hPattern) : hPattern.test(c.h);
        if (!hOk) return false;
        if (!gPattern) return true;
        return typeof gPattern === "string" ? c.g.includes(normKey(gPattern)) : gPattern.test(c.g);
      });
      if (!found) {
        throw new Error(`Columna requerida no encontrada: header=${String(hPattern)} group=${String(gPattern)}`);
      }
      return found.col;
    },
    findOptional(hPattern, gPattern = null) {
      const found = cols.find((c) => {
        const hOk = typeof hPattern === "string" ? c.h === normKey(hPattern) : hPattern.test(c.h);
        if (!hOk) return false;
        if (!gPattern) return true;
        return typeof gPattern === "string" ? c.g.includes(normKey(gPattern)) : gPattern.test(c.g);
      });
      return found ? found.col : null;
    },
    cols,
  };
}

function parseAFile(ws) {
  const res = buildColumnResolver(ws, 2);
  // Detectar años de evolución disponibles dinámicamente (ej. 2020..2024 o 2019..2023)
  const evolIngCols = res.cols
    .filter((c) => /^ingresos al 4.? ano (20\d{2})$/.test(c.h))
    .map((c) => ({ year: c.h.match(/(20\d{2})$/)[1], col: c.col }));
  const evolEmp1Cols = res.cols
    .filter((c) => /^empleabilidad 1er ano - (20\d{2})$/.test(c.h))
    .map((c) => ({ year: c.h.match(/(20\d{2})$/)[1], col: c.col }));
  const evolEmp2Cols = res.cols
    .filter((c) => /^empleabilidad 2.? ano - (20\d{2})$/.test(c.h))
    .map((c) => ({ year: c.h.match(/(20\d{2})$/)[1], col: c.col }));

  const colArea = res.find(/^area$/);
  const colTipo = res.find(/^tipo de institucion$/);
  const colCarrera = res.find(/^carrera generica$/);
  const colIng = [
    res.find(/^1er ano$/, /ingreso promedio/),
    res.find(/^2.? ano$/, /ingreso promedio/),
    res.find(/^3er ano$/, /ingreso promedio/),
    res.find(/^4.? ano$/, /ingreso promedio/),
    res.find(/^5.? ano$/, /ingreso promedio/),
  ];
  const colPct = {
    p10_1: res.find(/^10% inferior 1er ano$/),
    p25_1: res.find(/^25% inferior 1er ano$/),
    p50_1: res.find(/^percentil 50 1er ano$/),
    p75_1: res.find(/^25% superior 1er ano$/),
    p90_1: res.find(/^10% superior 1er ano$/),
    p10_5: res.find(/^10% inferior 5.? ano$/),
    p25_5: res.find(/^25% inferior 5.? ano$/),
    p50_5: res.find(/^percentil 50 5.? ano$/),
    p75_5: res.find(/^25% superior 5.? ano$/),
    p90_5: res.find(/^10% superior 5.? ano$/),
  };
  const colEmp1 = res.find(/^empleabilidad 1er ano$/);
  const colEmp2 = res.find(/^empleabilidad 2.? ano$/);
  const colTitM = res.find(/^titulados mujeres$/);
  const colTitH = res.find(/^titulados hombres$/);
  const colTitT = res.find(/^titulados total$/);
  const colDurF = res.find(/^duracion formal$/);
  const colDurR = res.find(/^duracion real$/);
  const colMat1M = res.find(/^matricula 1er ano mujeres$/);
  const colMat1H = res.find(/^matricula 1er ano hombres$/);
  const colMat1T = res.find(/^total matricula 1er ano$/);
  const colMatTM = res.find(/^matricula total mujeres$/);
  const colMatTH = res.find(/^matricula total hombres$/);
  const colMatTT = res.find(/^matricula total$/);
  const colRet1 = res.find(/^retencion 1er ano$/);
  const colRet2 = res.find(/^retencion 2.? ano$/);
  const colOrigMun = res.find(/^municipal y servicios locales$/);
  const colOrigSub = res.find(/^parti(c)?ular subvencionado$/);
  const colOrigPag = res.find(/^particular pagado$/);
  const colOrigDel = res.find(/^administracion delegada$/);

  const pesosHeader = cleanStr(ws.getRow(1).getCell(colIng[0]).text);
  const rows = [];
  for (let r = 3; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const tipoRaw = cellText(row.getCell(colTipo));
    const nombre = cellText(row.getCell(colCarrera));
    const area = cellText(row.getCell(colArea));
    if (!tipoRaw || !nombre) continue;
    const tipo = normalizeTipo(tipoRaw);
    const ing = colIng.map((c) => roundInt(parseNum(cellVal(row.getCell(c)))));
    const pct = {};
    for (const [k, c] of Object.entries(colPct)) {
      pct[k] = roundInt(parseNum(cellVal(row.getCell(c))));
    }
    const evol_ing4 = {};
    for (const { year, col } of evolIngCols) {
      evol_ing4[year] = roundInt(parseNum(cellVal(row.getCell(col))));
    }
    const evol_emp1 = {};
    for (const { year, col } of evolEmp1Cols) {
      evol_emp1[year] = round4(parsePercentOrRatio(cellVal(row.getCell(col))));
    }
    const evol_emp2 = {};
    for (const { year, col } of evolEmp2Cols) {
      evol_emp2[year] = round4(parsePercentOrRatio(cellVal(row.getCell(col))));
    }
    rows.push({
      area,
      tipoKey: tipo.key,
      tipoLabel: tipo.label,
      nombre,
      ing,
      pct,
      evol_ing4,
      emp1: round4(parsePercentOrRatio(cellVal(row.getCell(colEmp1)))),
      emp2: round4(parsePercentOrRatio(cellVal(row.getCell(colEmp2)))),
      evol_emp1,
      evol_emp2,
      titulados: {
        m: roundInt(parseNum(cellVal(row.getCell(colTitM)))),
        h: roundInt(parseNum(cellVal(row.getCell(colTitH)))),
        t: roundInt(parseNum(cellVal(row.getCell(colTitT)))),
      },
      dur_formal: parseNum(cellVal(row.getCell(colDurF))) !== null ? Math.round(parseNum(cellVal(row.getCell(colDurF))) * 10) / 10 : null,
      dur_real: parseNum(cellVal(row.getCell(colDurR))) !== null ? Math.round(parseNum(cellVal(row.getCell(colDurR))) * 10) / 10 : null,
      matricula: {
        primer_ano_m: roundInt(parseNum(cellVal(row.getCell(colMat1M)))),
        primer_ano_h: roundInt(parseNum(cellVal(row.getCell(colMat1H)))),
        primer_ano_t: roundInt(parseNum(cellVal(row.getCell(colMat1T)))),
        total_m: roundInt(parseNum(cellVal(row.getCell(colMatTM)))),
        total_h: roundInt(parseNum(cellVal(row.getCell(colMatTH)))),
        total: roundInt(parseNum(cellVal(row.getCell(colMatTT)))),
      },
      retencion: {
        r1: round4(parsePercentOrRatio(cellVal(row.getCell(colRet1)))),
        r2: round4(parsePercentOrRatio(cellVal(row.getCell(colRet2)))),
      },
      origen: {
        municipal: round4(parsePercentOrRatio(cellVal(row.getCell(colOrigMun)))),
        subvencionado: round4(parsePercentOrRatio(cellVal(row.getCell(colOrigSub)))),
        pagado: round4(parsePercentOrRatio(cellVal(row.getCell(colOrigPag)))),
        delegada: round4(parsePercentOrRatio(cellVal(row.getCell(colOrigDel)))),
      },
    });
  }
  return { rows, pesosHeader };
}

function parseBFile(ws) {
  const res = buildColumnResolver(ws, 1);
  const colCod = res.find(/^codigo$/);
  const colTipo = res.find(/^tipo de institucion$/);
  const colInst = res.find(/^nombre de institucion$/);
  const colAcred = res.find(/^acreditacion institucion/);
  const colArea = res.find(/^area$/);
  const colGen = res.find(/^nombre carrera generica$/);
  const colTitulo = res.find(/^nombre carrera \(del titulo\)$/);
  const colCont = res.find(/continuidad de estudios/);
  const colRet = res.find(/^retencion 1er ano$/);
  const colDur = res.find(/^duracion real \(semestres\)$/);
  const colEmp1 = res.find(/^empleabilidad 1er ano$/);
  const colEmp2 = res.find(/^empleabilidad 2.? ano$/);
  const colIng = res.find(/^ingreso promedio al 4.? ano$/);

  const rows = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const codRaw = cellText(row.getCell(colCod));
    const inst = cellText(row.getCell(colInst));
    if (!codRaw || !inst || /^fuente/i.test(codRaw)) continue;
    const codigo = parseNum(codRaw);
    if (codigo === null) continue;
    const tipo = normalizeTipo(cellText(row.getCell(colTipo)));
    const acreditacion = cellText(row.getCell(colAcred));
    const acredAnosMatch = acreditacion.match(/^(\d+)\s*a[ñn]os?$/i);
    const acredAnos = acredAnosMatch ? Number(acredAnosMatch[1]) : 0;
    const tramo = parseTramo(cellText(row.getCell(colIng)));
    const durRaw = parseNum(cellVal(row.getCell(colDur)));
    rows.push({
      codigo_ies: Math.round(codigo),
      tipoKey: tipo.key,
      tipoLabel: tipo.label,
      institucion: inst,
      acreditacion,
      acred_anos: acredAnos,
      area: cellText(row.getCell(colArea)),
      generica: cellText(row.getCell(colGen)),
      titulo: cellText(row.getCell(colTitulo)),
      continuidad: round4(parsePercentOrRatio(cellVal(row.getCell(colCont)))),
      retencion_1: round4(parsePercentOrRatio(cellVal(row.getCell(colRet)))),
      dur_real: durRaw !== null ? Math.round(durRaw * 10) / 10 : null,
      emp1: round4(parsePercentOrRatio(cellVal(row.getCell(colEmp1)))),
      emp2: round4(parsePercentOrRatio(cellVal(row.getCell(colEmp2)))),
      tramo,
    });
  }
  return rows;
}

function parseIESFile(ws) {
  const res = buildColumnResolver(ws, 2);
  const colCod = res.find(/^codigo institucion$/);
  const colNombre = res.find(/^nombre institucion$/);
  const colAcred = res.find(/^acreditacion \(/);
  const colAnos = res.find(/^anos acreditacion/);
  const colWeb = res.findOptional(/^pagina web$/);
  const map = new Map();
  for (let r = 3; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const cod = parseNum(cellVal(row.getCell(colCod)));
    const nombre = cellText(row.getCell(colNombre));
    if (cod === null || !nombre) continue;
    const anos = parseNum(cellVal(row.getCell(colAnos)));
    const acredText = cellText(row.getCell(colAcred));
    map.set(Math.round(cod), {
      nombre,
      acreditada: /^acreditada$/i.test(acredText),
      anos: anos ? Math.round(anos) : 0,
      web: colWeb ? cellText(row.getCell(colWeb)) : "",
    });
  }
  return map;
}

function parseCFile(ws, iesMap) {
  const res = buildColumnResolver(ws, 2);
  const colCod = res.find(/^codigo unico de carrera$/);
  const colCodIes = res.find(/^codigo institucion$/);
  const colTipo = res.find(/^tipo de institucion$/);
  const colInst = res.find(/^nombre institucion$/);
  const colCarrera = res.find(/^nombre carrera$/);
  const colRegion = res.find(/^region$/);
  const colJornada = res.find(/^jornada$/);
  const colSede = res.find(/^sede$/);
  const colArancel = res.find(/^arancel anual 20\d{2}$/);
  const colCostoTit = res.find(/^costo de titulacion$/);
  const colDurF = res.find(/^duracion formal \(semestres\)$/);
  const colNivel = res.find(/^nivel carrera$/);
  const colVacantes = res.find(/^vacantes 1er semestre$/);
  const colRangoPaes = res.find(/^rango ingreso a 1er ano con paes/);
  const colPromPaes = res.find(/^promedio paes 20\d{2} de matricula/);
  const colNem = res.find(/^nem$/, /ponderaciones/);
  const colRanking = res.find(/^ranking$/, /ponderaciones/);
  const colLen = res.find(/^paes lenguaje$/, /ponderaciones/);
  const colMat = res.find(/^paes matematicas$/, /ponderaciones/);
  const colMat2 = res.find(/^paes matematicas 2$/, /ponderaciones/);
  const colHis = res.find(/^paes historia$/, /ponderaciones/);
  const colCie = res.find(/^paes ciencias$/, /ponderaciones/);
  const colOtros = res.find(/^otros$/, /ponderaciones/);
  const colGenerica = res.find(/^area carrera generica$/);

  const rows = [];
  for (let r = 3; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const codigo = cellText(row.getCell(colCod));
    const tipoRaw = cellText(row.getCell(colTipo));
    const nombre = cellText(row.getCell(colCarrera));
    if (!codigo || !tipoRaw || !nombre) continue;
    const tipo = normalizeTipo(tipoRaw);
    const codIes = roundInt(parseNum(cellVal(row.getCell(colCodIes))));
    const iesInfo = codIes !== null ? iesMap.get(codIes) : null;
    const promPaesRaw = parseNum(cellVal(row.getCell(colPromPaes)));
    const pond = {
      nem: roundInt(parseNum(cellVal(row.getCell(colNem)))) ?? 0,
      ranking: roundInt(parseNum(cellVal(row.getCell(colRanking)))) ?? 0,
      lenguaje: roundInt(parseNum(cellVal(row.getCell(colLen)))) ?? 0,
      mate1: roundInt(parseNum(cellVal(row.getCell(colMat)))) ?? 0,
      mate2: roundInt(parseNum(cellVal(row.getCell(colMat2)))) ?? 0,
      historia: roundInt(parseNum(cellVal(row.getCell(colHis)))) ?? 0,
      ciencias: roundInt(parseNum(cellVal(row.getCell(colCie)))) ?? 0,
      otros: roundInt(parseNum(cellVal(row.getCell(colOtros)))) ?? 0,
    };
    rows.push({
      codigo,
      codigo_ies: codIes,
      tipoKey: tipo.key,
      tipoLabel: tipo.label,
      institucion: cellText(row.getCell(colInst)),
      acred_anos: iesInfo?.anos ?? 0,
      nombre,
      region: cellText(row.getCell(colRegion)),
      jornada: cellText(row.getCell(colJornada)),
      sede: cellText(row.getCell(colSede)),
      arancel: roundInt(parseNum(cellVal(row.getCell(colArancel)))),
      costo_titulacion: roundInt(parseNum(cellVal(row.getCell(colCostoTit)))),
      dur_formal: roundInt(parseNum(cellVal(row.getCell(colDurF)))),
      nivel: cellText(row.getCell(colNivel)),
      vacantes: roundInt(parseNum(cellVal(row.getCell(colVacantes)))),
      rango_paes: cellText(row.getCell(colRangoPaes)),
      prom_paes: promPaesRaw !== null ? Math.round(promPaesRaw * 10) / 10 : null,
      ponderaciones: pond,
      generica: cellText(row.getCell(colGenerica)),
    });
  }
  return rows;
}

function median(nums) {
  if (nums.length === 0) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? Math.round((s[mid - 1] + s[mid]) / 2) : s[mid];
}

function buildArancelBuckets(aranceles) {
  if (aranceles.length === 0) return [];
  const buckets = [
    { label: "Hasta $2M", min: 0, max: 2_000_000, count: 0 },
    { label: "$2M – $3M", min: 2_000_000, max: 3_000_000, count: 0 },
    { label: "$3M – $4M", min: 3_000_000, max: 4_000_000, count: 0 },
    { label: "$4M – $5M", min: 4_000_000, max: 5_000_000, count: 0 },
    { label: "$5M – $6M", min: 5_000_000, max: 6_000_000, count: 0 },
    { label: "$6M – $7M", min: 6_000_000, max: 7_000_000, count: 0 },
    { label: "Sobre $7M", min: 7_000_000, max: null, count: 0 },
  ];
  for (const a of aranceles) {
    const b = buckets.find((bk) => a >= bk.min && (bk.max === null || a < bk.max));
    if (b) b.count++;
  }
  return buckets.filter((b) => b.count > 0 || (b.min >= Math.min(...aranceles) - 1_000_000 && b.min <= Math.max(...aranceles)));
}

async function fetchIpcSeries() {
  const ipcPath = join(ROOT, "data", "ipc", "ipc.json");
  const existing = existsSync(ipcPath) ? JSON.parse(await readFile(ipcPath, "utf8")) : [];
  const token = process.env.BCCH_API_TOKEN?.trim();
  if (!token) {
    return {
      series: existing,
      source: "committed-fallback (falta BCCH_API_TOKEN)",
      warning: "BCCH_API_TOKEN no configurado: se usó data/ipc/ipc.json commiteado.",
    };
  }
  const today = new Date().toISOString().slice(0, 10);
  const url = `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?function=GetSeries&timeseries=F074.IPC.IND.Z.EP23.C.M&firstdate=2009-12-01&lastdate=${today}&token=${encodeURIComponent(token)}`;
  const raw = await fetchWithRetries(url, false);
  const json = JSON.parse(raw);
  const obs = json?.Series?.Obs ?? [];
  const series = obs
    .filter((o) => o.statusCode === "OK" && o.value && !Number.isNaN(Number(o.value)))
    .map((o) => {
      // indexDateString viene como "01-10-2026" o "2026-10-01"
      const parts = String(o.indexDateString).split("-");
      const ym = parts[0].length === 4 ? `${parts[0]}-${parts[1]}` : `${parts[2]}-${parts[1]}`;
      return { m: ym, v: Math.round(Number(o.value) * 100) / 100 };
    })
    .sort((a, b) => a.m.localeCompare(b.m));
  if (series.length < 3) {
    throw new Error("La respuesta del Banco Central devolvió menos de 3 observaciones IPC.");
  }
  return { series, source: "Banco Central de Chile (BDE F074.IPC.IND.Z.EP23.C.M)", warning: null };
}

function validateAll({ rowsA, rowsB, rowsC, slugsMap, carreras, ranking, ipcSeries, edicion }) {
  const schemaCarreraTipo = z.object({
    ing: z.array(z.number().min(300_000).max(15_000_000).nullable()).length(5),
    emp1: z.number().min(0).max(1).nullable(),
    emp2: z.number().min(0).max(1).nullable(),
    dur_formal: z.number().min(2).max(20).nullable(),
    dur_real: z.number().min(2).max(20).nullable(),
  });

  if (rowsA.length < 240) throw new Error(`A tiene ${rowsA.length} filas (< 240)`);
  const uniqueNamesA = new Set(rowsA.map((r) => r.nombre));
  if (uniqueNamesA.size < 150) throw new Error(`A tiene ${uniqueNamesA.size} genéricas (< 150)`);
  if (rowsB.length < 1500) throw new Error(`B tiene ${rowsB.length} filas (< 1500)`);
  if (rowsC.length < 8000) throw new Error(`C tiene ${rowsC.length} filas (< 8000)`);

  // Slugs únicos y sin colisión con rutas reservadas
  const seenSlugs = new Set();
  for (const [nombre, slug] of Object.entries(slugsMap)) {
    if (!slug || seenSlugs.has(slug)) throw new Error(`Slug duplicado o vacío: "${slug}" (${nombre})`);
    if (RESERVED_SLUGS.has(slug)) throw new Error(`Slug colisiona con ruta reservada: "${slug}"`);
    seenSlugs.add(slug);
  }

  for (const c of carreras) {
    for (const [tipoKey, t] of Object.entries(c.tipos)) {
      schemaCarreraTipo.parse(t);
      // Percentiles ordenados cuando existan todos
      const checkPct = (arr, label) => {
        const present = arr.filter((x) => x !== null);
        if (present.length >= 2) {
          for (let i = 1; i < present.length; i++) {
            if (present[i] < present[i - 1]) {
              throw new Error(`Percentiles desordenados en ${c.slug} (${tipoKey}, ${label}): ${arr.join(", ")}`);
            }
          }
        }
      };
      checkPct([t.pct.p10_1, t.pct.p25_1, t.pct.p50_1, t.pct.p75_1, t.pct.p90_1], "1er año");
      checkPct([t.pct.p10_5, t.pct.p25_5, t.pct.p50_5, t.pct.p75_5, t.pct.p90_5], "5to año");
    }
  }

  // Cruce B -> A >= 90% de las filas con ingreso
  const aKeySet = new Set(rowsA.map((r) => `${r.tipoKey}|||${normKey(r.nombre)}`));
  const bWithIng = rowsB.filter((r) => r.tramo !== null);
  const bWithIngMatched = bWithIng.filter((r) => aKeySet.has(`${r.tipoKey}|||${normKey(r.generica)}`));
  const pctBA = bWithIng.length > 0 ? bWithIngMatched.length / bWithIng.length : 0;
  if (pctBA < 0.9) {
    throw new Error(`Cruce B->A insuficiente: ${(pctBA * 100).toFixed(1)}% (< 90%)`);
  }

  const cMatchedByName = rowsC.filter((r) => uniqueNamesA.has(r.generica) || [...uniqueNamesA].some((n) => normKey(n) === normKey(r.generica)));
  const pctCA = rowsC.length > 0 ? cMatchedByName.length / rowsC.length : 0;

  // Pruebas de humo edición 2025-2026 (§2.1 y §2.2)
  const smoke = [];
  if (edicion === "2025-2026") {
    const med = carreras.find((c) => c.slug === "medicina")?.tipos?.u;
    const ico = carreras.find((c) => c.slug === "ingenieria-comercial")?.tipos?.u;
    const top5 = ranking
      .filter((r) => r.tipo === "u" && r.ing4 !== null)
      .sort((a, b) => b.ing4 - a.ing4)
      .slice(0, 5)
      .map((r) => r.nombre);

    const checks = [
      ["Medicina (U) 4.º año === 3719393", med?.ing[3] === 3719393, med?.ing[3]],
      ["Medicina (U) 1.º año === 2758297", med?.ing[0] === 2758297, med?.ing[0]],
      ["Medicina (U) emp1 ≈ 90,9%", Math.abs((med?.emp1 ?? 0) - 0.9088) < 0.002, med?.emp1],
      ["Ing. Comercial (U) 4.º año === 2203057", ico?.ing[3] === 2203057, ico?.ing[3]],
      ["Ing. Comercial (U) P10_5 === 881696", ico?.pct?.p10_5 === 881696, ico?.pct?.p10_5],
      ["Ing. Comercial (U) P50_5 === 2008881", ico?.pct?.p50_5 === 2008881, ico?.pct?.p50_5],
      ["Ing. Comercial (U) P90_5 === 4049238", ico?.pct?.p90_5 === 4049238, ico?.pct?.p90_5],
      ["Ing. Comercial (U) evol 2020 === 2242226", ico?.evol_ing4?.["2020"] === 2242226, ico?.evol_ing4?.["2020"]],
      ["Ing. Comercial (U) evol 2024 === 2175494", ico?.evol_ing4?.["2024"] === 2175494, ico?.evol_ing4?.["2024"]],
      [
        "Top 5 U (Medicina, Ing. Civil Metalúrgica, Minas, Geología, Eléctrica)",
        top5[0] === "Medicina" &&
          top5[1] === "Ingeniería Civil Metalúrgica" &&
          top5[2] === "Ingeniería Civil en Minas" &&
          top5[3] === "Geología" &&
          top5[4] === "Ingeniería Civil Eléctrica",
        top5.join(" | "),
      ],
    ];
    const ipc25 = ipcSeries.find((p) => p.m === "2025-09")?.v;
    const ipc26 = ipcSeries.find((p) => p.m === "2026-10")?.v;
    if (ipc25 && ipc26 && med?.ing[3]) {
      const adj = Math.round((med.ing[3] * ipc26) / ipc25);
      checks.push(["IPC Medicina oct-2026 ≈ $3.889.448", Math.abs(adj - 3889448) < 50, adj]);
    }
    for (const [label, ok, actual] of checks) {
      smoke.push({ label, ok, actual });
      if (!ok) throw new Error(`Falla prueba de humo: ${label} (obtenido: ${actual})`);
    }
  }

  return { pctBA, pctCA, smoke };
}

function toCsvField(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "number") return Number.isInteger(val) ? String(val) : String(val).replace(".", ",");
  const s = String(val);
  if (/[;"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function buildCsv(headers, rows, metaLines) {
  const lines = [
    ...metaLines.map((l) => `# ${l}`),
    headers.map(toCsvField).join(";"),
    ...rows.map((r) => r.map(toCsvField).join(";")),
  ];
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}

async function main() {
  const rawDir = join(ROOT, "data", "carreras", "raw");
  await mkdir(rawDir, { recursive: true });
  await mkdir(join(ROOT, "data", "carreras", "instituciones"), { recursive: true });
  await mkdir(join(ROOT, "data", "carreras", "programas"), { recursive: true });
  await mkdir(join(ROOT, "data", "carreras", "historico"), { recursive: true });
  await mkdir(join(ROOT, "data", "ipc"), { recursive: true });
  await mkdir(join(ROOT, "public", "datos", "carreras", "csv"), { recursive: true });

  const metaPath = join(ROOT, "data", "carreras", "meta.json");
  const prevMeta = existsSync(metaPath) ? JSON.parse(await readFile(metaPath, "utf8")) : null;

  let edicion = "2025-2026";
  let prevEdicion = "2024-2025";
  let urls = { ...DEFAULT_URLS };
  if (!LOCAL_ONLY) {
    try {
      const detected = await detectLatestEdition();
      edicion = detected.edicion;
      prevEdicion = detected.prevEdicion;
      urls = detected.urls;
    } catch (err) {
      console.error("Error detectando edición en mifuturo.cl:", err.message);
      process.exit(1);
    }
  }

  async function loadOrDownload(localName, url) {
    const filePath = join(rawDir, localName);
    if (LOCAL_ONLY && existsSync(filePath)) {
      return await readFile(filePath);
    }
    const buf = await fetchWithRetries(url, true);
    await writeFile(filePath, buf);
    return buf;
  }

  const bufA = await loadOrDownload("A_2025_2026.xlsx", urls.A);
  const bufB = await loadOrDownload("B_2025_2026.xlsx", urls.B);
  const bufC = await loadOrDownload("C_2025_2026.xlsx", urls.C);
  const bufIES = await loadOrDownload("IES_2025_2026.xlsx", urls.IES);
  const bufAPrev = await loadOrDownload("A_2024_2025.xlsx", urls.A_PREV);

  const hashes = {
    A: sha256(bufA),
    B: sha256(bufB),
    C: sha256(bufC),
    IES: sha256(bufIES),
    A_PREV: sha256(bufAPrev),
  };

  if (
    !FORCE &&
    prevMeta &&
    prevMeta.edicion === edicion &&
    prevMeta.fuentes?.[0]?.sha256 === hashes.A &&
    prevMeta.fuentes?.[1]?.sha256 === hashes.B &&
    prevMeta.fuentes?.[2]?.sha256 === hashes.C
  ) {
    console.log(`Sin cambios respecto a ${edicion}. Usa --force para regenerar.`);
    process.exit(0);
  }

  const { series: ipcSeries, source: ipcSource, warning: ipcWarning } = await fetchIpcSeries();

  // Leer workbooks
  const readWb = async (buf) => {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf);
    return wb.worksheets[0];
  };

  const wsA = await readWb(bufA);
  const wsB = await readWb(bufB);
  const wsC = await readWb(bufC);
  const wsIES = await readWb(bufIES);
  const wsAPrev = await readWb(bufAPrev);

  const parsedA = parseAFile(wsA);
  const parsedAPrev = parseAFile(wsAPrev);
  const rowsB = parseBFile(wsB);
  const iesMap = parseIESFile(wsIES);
  const rowsC = parseCFile(wsC, iesMap);

  // Slugs estables
  const slugsPath = join(ROOT, "lib", "datos", "carreras-slugs.json");
  const slugsMap = existsSync(slugsPath) ? JSON.parse(await readFile(slugsPath, "utf8")) : {};
  const usedSlugs = new Set(Object.values(slugsMap));

  for (const row of parsedA.rows) {
    if (!slugsMap[row.nombre]) {
      let candidate = slugify(row.nombre);
      if (RESERVED_SLUGS.has(candidate)) candidate = `carrera-${candidate}`;
      let unique = candidate;
      let idx = 2;
      while (usedSlugs.has(unique)) {
        unique = `${candidate}-${idx++}`;
      }
      slugsMap[row.nombre] = unique;
      usedSlugs.add(unique);
    }
  }

  // Mapa inverso normalizado -> nombre canónico de A
  const normNameToCanon = new Map();
  for (const row of parsedA.rows) {
    normNameToCanon.set(normKey(row.nombre), row.nombre);
  }

  // Agrupar edición anterior para comparación entre ediciones (pesos_de A_PREV -> pesos_de A)
  const ipcPrevMes = "2024-09";
  const ipcCurrMes = "2025-09";
  const ipcPrevVal = ipcSeries.find((p) => p.m === ipcPrevMes)?.v;
  const ipcCurrVal = ipcSeries.find((p) => p.m === ipcCurrMes)?.v;
  const prevMap = new Map();
  const historicoPrev = {};
  for (const r of parsedAPrev.rows) {
    const slug = slugsMap[r.nombre] ?? slugify(r.nombre);
    prevMap.set(`${slug}|||${r.tipoKey}`, r);
    if (!historicoPrev[slug]) historicoPrev[slug] = { nombre: r.nombre, area: r.area, tipos: {} };
    historicoPrev[slug].tipos[r.tipoKey] = { ing: r.ing, emp1: r.emp1, emp2: r.emp2, dur_real: r.dur_real };
  }

  // Agrupar B por (slug, tipoKey) y por slug
  const bBySlug = new Map();
  for (const b of rowsB) {
    const canon = normNameToCanon.get(normKey(b.generica));
    if (!canon) continue;
    const slug = slugsMap[canon];
    if (!bBySlug.has(slug)) bBySlug.set(slug, []);
    bBySlug.get(slug).push(b);
  }

  // Agrupar C por slug (y por slug + tipoKey)
  const cBySlug = new Map();
  for (const c of rowsC) {
    const canon = normNameToCanon.get(normKey(c.generica));
    if (!canon) continue;
    const slug = slugsMap[canon];
    if (!cBySlug.has(slug)) cBySlug.set(slug, []);
    cBySlug.get(slug).push(c);
  }

  // Construir carreras.json
  const bySlug = new Map();
  for (const r of parsedA.rows) {
    const slug = slugsMap[r.nombre];
    if (!bySlug.has(slug)) {
      bySlug.set(slug, {
        slug,
        nombre: r.nombre,
        area: r.area,
        tipos: {},
        oferta: null,
      });
    }
    const entry = bySlug.get(slug);
    const prevRow = prevMap.get(`${slug}|||${r.tipoKey}`);
    let yoyEdicionReal = null;
    let ing4PrevAjustado = null;
    if (prevRow?.ing[3] && r.ing[3] && ipcPrevVal && ipcCurrVal) {
      ing4PrevAjustado = Math.round((prevRow.ing[3] * ipcCurrVal) / ipcPrevVal);
      yoyEdicionReal = round4((r.ing[3] - ing4PrevAjustado) / ing4PrevAjustado);
    }

    const evolYears = Object.keys(r.evol_ing4).sort();
    const firstY = evolYears[0];
    const lastY = evolYears[evolYears.length - 1];
    const prevY = evolYears[evolYears.length - 2];
    const ingFirst = firstY ? r.evol_ing4[firstY] : null;
    const ingLast = lastY ? r.evol_ing4[lastY] : null;
    const ingPrevY = prevY ? r.evol_ing4[prevY] : null;
    const crec5 = ingFirst && ingLast ? round4((ingLast - ingFirst) / ingFirst) : null;
    const yoy23_24 = ingPrevY && ingLast ? round4((ingLast - ingPrevY) / ingPrevY) : null;
    const cagr5 = ingFirst && ingLast && evolYears.length > 1
      ? round4(Math.pow(ingLast / ingFirst, 1 / (evolYears.length - 1)) - 1)
      : null;

    entry.tipos[r.tipoKey] = {
      tipo_label: r.tipoLabel,
      ing: r.ing,
      pct: r.pct,
      evol_ing4: r.evol_ing4,
      emp1: r.emp1,
      emp2: r.emp2,
      evol_emp1: r.evol_emp1,
      evol_emp2: r.evol_emp2,
      titulados: r.titulados,
      dur_formal: r.dur_formal,
      dur_real: r.dur_real,
      matricula: r.matricula,
      retencion: r.retencion,
      origen: r.origen,
      variacion: {
        crec_20_24: crec5,
        yoy_23_24: yoy23_24,
        cagr_20_24: cagr5,
        edicion_anterior_ing4_ajustado: ing4PrevAjustado,
        edicion_anterior_yoy_real: yoyEdicionReal,
      },
    };
  }

  // Enriquecer oferta desde C (global por carrera y por tipo)
  const ranking = [];
  for (const carrera of bySlug.values()) {
    const progsAll = cBySlug.get(carrera.slug) ?? [];
    const summarizeOffer = (progs) => {
      const aranceles = progs.map((p) => p.arancel).filter((x) => x !== null && x > 0);
      const costosTit = progs.map((p) => p.costo_titulacion).filter((x) => x !== null && x >= 0);
      const paeses = progs.map((p) => p.prom_paes).filter((x) => x !== null);
      const insts = new Set(progs.map((p) => p.institucion));
      const regs = [...new Set(progs.map((p) => p.region).filter(Boolean))].sort();
      const jors = [...new Set(progs.map((p) => p.jornada).filter(Boolean))];
      const nivs = [...new Set(progs.map((p) => p.nivel).filter(Boolean))];
      const vacTotal = progs.reduce((acc, p) => acc + (p.vacantes ?? 0), 0);
      const acredMax = progs.reduce((acc, p) => Math.max(acc, p.acred_anos ?? 0), 0);
      return {
        programas: progs.length,
        instituciones: insts.size,
        regiones: regs,
        jornadas: jors,
        niveles: nivs,
        vacantes_total: vacTotal,
        acred_max: acredMax,
        arancel: aranceles.length
          ? { min: Math.min(...aranceles), med: median(aranceles), max: Math.max(...aranceles) }
          : null,
        costo_titulacion_med: median(costosTit),
        paes: paeses.length ? { min: Math.min(...paeses), max: Math.max(...paeses), count: paeses.length } : null,
        arancel_histograma: buildArancelBuckets(aranceles),
      };
    };

    carrera.oferta = summarizeOffer(progsAll);
    const bAll = bBySlug.get(carrera.slug) ?? [];

    for (const [tipoKey, tData] of Object.entries(carrera.tipos)) {
      const progsTipo = progsAll.filter((p) => p.tipoKey === tipoKey);
      const offerTipo = progsTipo.length > 0 ? summarizeOffer(progsTipo) : carrera.oferta;
      tData.oferta = offerTipo;
      const bTipo = bAll.filter((b) => b.tipoKey === tipoKey);
      const acredMaxB = bTipo.reduce((m, b) => Math.max(m, b.acred_anos ?? 0), 0);

      ranking.push({
        slug: carrera.slug,
        nombre: carrera.nombre,
        area: carrera.area,
        tipo: tipoKey,
        nivel: offerTipo.niveles?.[0] ?? (tipoKey === "cft" ? "Técnica de Nivel Superior" : "Profesional"),
        ing1: tData.ing[0],
        ing4: tData.ing[3],
        ing5: tData.ing[4],
        p10_5: tData.pct.p10_5,
        p50_5: tData.pct.p50_5,
        p90_5: tData.pct.p90_5,
        emp1: tData.emp1,
        emp2: tData.emp2,
        dur_formal: tData.dur_formal,
        dur_real: tData.dur_real,
        titulados: tData.titulados.t,
        titulados_m: tData.titulados.m,
        retencion_1: tData.retencion.r1,
        arancel_min: offerTipo.arancel?.min ?? null,
        arancel_med: offerTipo.arancel?.med ?? null,
        arancel_max: offerTipo.arancel?.max ?? null,
        costo_tit_med: offerTipo.costo_titulacion_med ?? null,
        yoy_real_4: tData.variacion.crec_20_24,
        yoy_23_24: tData.variacion.yoy_23_24,
        regiones: offerTipo.regiones,
        jornadas: offerTipo.jornadas,
        acred_max: Math.max(offerTipo.acred_max ?? 0, acredMaxB),
        vacantes_total: offerTipo.vacantes_total,
        paes_min: offerTipo.paes?.min ?? null,
        paes_max: offerTipo.paes?.max ?? null,
        programas: offerTipo.programas,
      });
    }
  }

  const carrerasArr = [...bySlug.values()];

  // Validar todo antes de escribir archivos finales
  const validation = validateAll({
    rowsA: parsedA.rows,
    rowsB,
    rowsC,
    slugsMap,
    carreras: carrerasArr,
    ranking,
    ipcSeries,
    edicion,
  });

  // Ordenar ranking por defecto: ing4 descendente
  ranking.sort((a, b) => (b.ing4 ?? -1) - (a.ing4 ?? -1));

  // Determinar qué carreras desaparecieron de edición anterior
  const currentSlugSet = new Set(carrerasArr.map((c) => c.slug));
  const desaparecidas = Object.keys(historicoPrev).filter((s) => !currentSlugSet.has(s));

  const lastIpc = ipcSeries[ipcSeries.length - 1];
  const avisos = [];
  if (ipcWarning) avisos.push(ipcWarning);
  if (desaparecidas.length > 0) {
    avisos.push(`Carreras en ${prevEdicion} ausentes en ${edicion}: ${desaparecidas.join(", ")}`);
  }

  const meta = {
    edicion,
    pesos_de: "2025-09",
    fetched_at: new Date().toISOString(),
    fuentes: [
      { nombre: "Estadísticas por Carrera (SIES)", url: urls.A, sha256: hashes.A },
      { nombre: "Buscador de Empleabilidad e Ingresos (SIES)", url: urls.B, sha256: hashes.B },
      { nombre: "Buscador de Carreras (SIES)", url: urls.C, sha256: hashes.C },
      { nombre: "Buscador de Instituciones (SIES)", url: urls.IES, sha256: hashes.IES },
      { nombre: `Estadísticas por Carrera ${prevEdicion} (SIES)`, url: urls.A_PREV, sha256: hashes.A_PREV },
    ],
    ipc: {
      ultimo_mes: lastIpc?.m ?? null,
      valor: lastIpc?.v ?? null,
      fuente: ipcSource,
    },
    conteos: {
      filas_A: parsedA.rows.length,
      genericas_unicas: carrerasArr.length,
      filas_B: rowsB.length,
      filas_C: rowsC.length,
      cruce_B_A_pct: Math.round(validation.pctBA * 1000) / 10,
      cruce_C_A_pct: Math.round(validation.pctCA * 1000) / 10,
    },
    avisos,
  };

  // Escribir JSONs
  await writeFile(slugsPath, JSON.stringify(slugsMap, null, 2) + "\n", "utf8");
  await writeFile(join(ROOT, "data", "ipc", "ipc.json"), JSON.stringify(ipcSeries, null, 2) + "\n", "utf8");
  await writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n", "utf8");
  await writeFile(join(ROOT, "data", "carreras", "carreras.json"), JSON.stringify(carrerasArr), "utf8");
  await writeFile(join(ROOT, "data", "carreras", "ranking.json"), JSON.stringify(ranking), "utf8");
  await writeFile(
    join(ROOT, "data", "carreras", "historico", `${prevEdicion}.json`),
    JSON.stringify({ edicion: prevEdicion, pesos_de: "2024-09", carreras: historicoPrev }),
    "utf8"
  );

  // Archivos por carrera: instituciones/{slug}.json y programas/{slug}.json
  for (const carrera of carrerasArr) {
    const instRows = (bBySlug.get(carrera.slug) ?? []).map((b) => ({
      codigo_ies: b.codigo_ies,
      tipo: b.tipoKey,
      tipo_label: b.tipoLabel,
      institucion: b.institucion,
      acreditacion: b.acreditacion,
      acred_anos: b.acred_anos,
      titulo: b.titulo,
      continuidad: b.continuidad,
      retencion_1: b.retencion_1,
      dur_real: b.dur_real,
      emp1: b.emp1,
      emp2: b.emp2,
      tramo: b.tramo,
    }));
    await writeFile(
      join(ROOT, "data", "carreras", "instituciones", `${carrera.slug}.json`),
      JSON.stringify(instRows),
      "utf8"
    );

    const progRows = (cBySlug.get(carrera.slug) ?? []).map((p) => ({
      codigo: p.codigo,
      tipo: p.tipoKey,
      institucion: p.institucion,
      acred_anos: p.acred_anos,
      nombre: p.nombre,
      region: p.region,
      jornada: p.jornada,
      sede: p.sede,
      arancel: p.arancel,
      costo_titulacion: p.costo_titulacion,
      dur_formal: p.dur_formal,
      nivel: p.nivel,
      vacantes: p.vacantes,
      rango_paes: p.rango_paes,
      prom_paes: p.prom_paes,
      ponderaciones: p.ponderaciones,
    }));
    await writeFile(
      join(ROOT, "data", "carreras", "programas", `${carrera.slug}.json`),
      JSON.stringify(progRows),
      "utf8"
    );
  }

  // Archivos estáticos para cliente en public/datos/carreras/
  await writeFile(join(ROOT, "public", "datos", "carreras", "ranking.json"), JSON.stringify(ranking), "utf8");
  await writeFile(join(ROOT, "public", "datos", "carreras", "ipc.json"), JSON.stringify(ipcSeries), "utf8");

  // Índice de buscador: alias -> { slug, nombre, area, tipos, ing4_max, keywords[] }
  const buscador = carrerasArr.map((c) => {
    const titulosB = (bBySlug.get(c.slug) ?? []).map((b) => b.titulo);
    const nombresC = (cBySlug.get(c.slug) ?? []).map((p) => p.nombre);
    const aliases = [...new Set([...titulosB, ...nombresC].map(cleanStr))]
      .filter((n) => normKey(n) !== normKey(c.nombre))
      .slice(0, 25);
    const tiposArr = Object.entries(c.tipos).map(([k, v]) => ({
      tipo: k,
      ing4: v.ing[3],
      emp1: v.emp1,
    }));
    return {
      slug: c.slug,
      nombre: c.nombre,
      area: c.area,
      tipos: tiposArr,
      aliases,
    };
  });
  await writeFile(join(ROOT, "public", "datos", "carreras", "buscador.json"), JSON.stringify(buscador), "utf8");

  // Programas compactos para filtros exactos en cliente, partidos por tipo de institución (u, ip, cft)
  const progByTipo = { u: [], ip: [], cft: [] };
  for (const p of rowsC) {
    const canon = normNameToCanon.get(normKey(p.generica));
    if (!canon) continue;
    const slug = slugsMap[canon];
    progByTipo[p.tipoKey].push({
      s: slug,
      i: p.institucion,
      n: p.nombre,
      r: p.region,
      j: p.jornada,
      a: p.arancel,
      d: p.dur_formal,
      v: p.vacantes,
      p: p.prom_paes,
      c: p.acred_anos,
      w: p.ponderaciones,
    });
  }
  for (const tk of ["u", "ip", "cft"]) {
    await writeFile(
      join(ROOT, "public", "datos", "carreras", `programas-${tk}.json`),
      JSON.stringify(progByTipo[tk]),
      "utf8"
    );
  }

  // CSVs descargables con atribución obligatoria
  const csvHeadersRanking = [
    "slug",
    "carrera_generica",
    "area",
    "tipo_institucion",
    "nivel",
    "ingreso_1er_ano_clp_sep2025",
    "ingreso_4to_ano_clp_sep2025",
    "ingreso_5to_ano_clp_sep2025",
    "p10_5to_ano",
    "p50_5to_ano",
    "p90_5to_ano",
    "empleabilidad_1er_ano",
    "empleabilidad_2do_ano",
    "duracion_formal_sem",
    "duracion_real_sem",
    "titulados_2024",
    "arancel_mediano_2026_clp",
    "variacion_real_2020_2024",
  ];
  const csvRowsRanking = ranking.map((r) => [
    r.slug,
    r.nombre,
    r.area,
    r.tipo === "u" ? "Universidades" : r.tipo === "ip" ? "Institutos Profesionales" : "Centros de Formación Técnica",
    r.nivel,
    r.ing1,
    r.ing4,
    r.ing5,
    r.p10_5,
    r.p50_5,
    r.p90_5,
    r.emp1 !== null ? Math.round(r.emp1 * 1000) / 10 : null,
    r.emp2 !== null ? Math.round(r.emp2 * 1000) / 10 : null,
    r.dur_formal,
    r.dur_real,
    r.titulados,
    r.arancel_med,
    r.yoy_real_4 !== null ? Math.round(r.yoy_real_4 * 1000) / 10 : null,
  ]);
  await writeFile(
    join(ROOT, "public", "datos", "carreras", "csv", "ranking-carreras.csv"),
    buildCsv(csvHeadersRanking, csvRowsRanking, [
      `Fuente: Elaboración propia a partir de base publicada en www.mifuturo.cl (Mineduc SIES), edición ${edicion}.`,
      "Ingresos brutos mensuales promedio en pesos de septiembre de 2025. Empleabilidad en % (0-100). ProgramBI no está afiliado al Mineduc.",
    ]),
    "utf8"
  );

  const csvHeadersInst = [
    "slug_generica",
    "carrera_generica",
    "tipo_institucion",
    "institucion",
    "acreditacion_oct2025",
    "titulo_programa",
    "tramo_ingreso_4to_ano_sep2025",
    "empleabilidad_1er_ano_pct",
    "empleabilidad_2do_ano_pct",
    "continuidad_estudios_pct",
    "retencion_1er_ano_pct",
    "duracion_real_semestres",
  ];
  const csvRowsInst = [];
  for (const b of rowsB) {
    const canon = normNameToCanon.get(normKey(b.generica));
    if (!canon) continue;
    csvRowsInst.push([
      slugsMap[canon],
      canon,
      b.tipoLabel,
      b.institucion,
      b.acreditacion,
      b.titulo,
      b.tramo?.texto ?? "s/i",
      b.emp1 !== null ? Math.round(b.emp1 * 1000) / 10 : null,
      b.emp2 !== null ? Math.round(b.emp2 * 1000) / 10 : null,
      b.continuidad !== null ? Math.round(b.continuidad * 1000) / 10 : null,
      b.retencion_1 !== null ? Math.round(b.retencion_1 * 1000) / 10 : null,
      b.dur_real,
    ]);
  }
  await writeFile(
    join(ROOT, "public", "datos", "carreras", "csv", "carreras-instituciones.csv"),
    buildCsv(csvHeadersInst, csvRowsInst, [
      `Fuente: www.mifuturo.cl, de Mineduc (SIES), edición ${edicion}.`,
      "Ingresos por institución informados en tramos (pesos de septiembre de 2025). ProgramBI no está afiliado al Mineduc.",
    ]),
    "utf8"
  );

  // Resumen Markdown para el PR / consola
  const top5U = ranking.filter((r) => r.tipo === "u" && r.ing4).slice(0, 5);
  const bottom5U = ranking.filter((r) => r.tipo === "u" && r.ing4).slice(-5).reverse();
  console.log(`\n## Actualización Datos de Carreras — Edición ${edicion}\n`);
  console.log(`- Filas A: ${meta.conteos.filas_A} (${meta.conteos.genericas_unicas} genéricas únicas)`);
  console.log(`- Filas B: ${meta.conteos.filas_B} (cruce con ingreso B→A: ${meta.conteos.cruce_B_A_pct} %)`);
  console.log(`- Filas C: ${meta.conteos.filas_C} (cruce por genérica C→A: ${meta.conteos.cruce_C_A_pct} %)`);
  console.log(`- IPC: ${meta.ipc.ultimo_mes} = ${meta.ipc.valor} (${meta.ipc.fuente})`);
  console.log("\n### SHA-256 fuentes:");
  for (const f of meta.fuentes) console.log(`- ${f.nombre}: \`${f.sha256}\``);
  console.log("\n### Top 5 Universidades (4.º año):");
  for (const r of top5U) console.log(`- ${r.nombre}: $${r.ing4.toLocaleString("es-CL")}`);
  console.log("\n### Bottom 5 Universidades (4.º año):");
  for (const r of bottom5U) console.log(`- ${r.nombre}: $${r.ing4.toLocaleString("es-CL")}`);
  console.log("\n### Pruebas de humo:");
  for (const s of validation.smoke) console.log(`- ${s.ok ? "✔" : "✘"} ${s.label} (${s.actual})`);
  if (avisos.length) {
    console.log("\n### Avisos:");
    for (const a of avisos) console.log(`- ${a}`);
  }
}

main().catch((err) => {
  console.error("ERROR en update-carreras:", err);
  process.exit(1);
});
