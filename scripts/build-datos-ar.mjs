import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const ROOT = process.cwd();
const FUENTE_DIR = path.join(ROOT, "data", "ar", "fuente");
const OUT_DATA_DIR = path.join(ROOT, "data", "ar");
const OUT_CSV_CARRERAS = path.join(ROOT, "public", "ar", "datos", "carreras", "csv", "carreras-argentina.csv");
const OUT_CSV_IPC = path.join(ROOT, "public", "ar", "datos", "inflacion", "csv", "ipc-argentina-indec.csv");
const OUT_CSV_DESEMPLEO = path.join(ROOT, "public", "ar", "datos", "desempleo", "csv", "desempleo-argentina-indec.csv");

const ARAUCANO_BASE_CSV_URL = "https://cdn.produccion.gob.ar/cdn-cep/araucano/base_araucano.csv";
const ARAUCANO_DATASET_URL = "https://datos.produccion.gob.ar/dataset/graduados-universitarios-del-sistema-araucano-2016-2018";
const DIU_ANUARIO_URL = "https://www.argentina.gob.ar/educacion/universidades/informacion/publicaciones/anuarios";
const INDEC_IPC_URL = "https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31";
const INDEC_EPH_URL = "https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-31-58";

const MES_AJUSTE_IPC = "2026-10";
const ANIO_BASE_ARAUCANO = "2019-2021";

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeUtf8BomCsv(filePath, headers, rows) {
  ensureDir(filePath);
  const escape = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (/[",\r\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(row.map(escape).join(","));
  }
  fs.writeFileSync(filePath, `\uFEFF${lines.join("\r\n")}\r\n`, "utf8");
}

function parseArDecimal(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  if (!s || s === "NA" || s === "-") return null;
  const num = Number(s.replace(",", "."));
  return Number.isFinite(num) ? num : null;
}

function parseCsvSimple(text, sep = ",") {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const splitLine = (line) => {
    const out = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === sep && !inQuotes) {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  };
  const headers = splitLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cols = splitLine(line);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (cols[idx] ?? "").trim();
    });
    return obj;
  });
  return { headers, rows };
}

async function loadExcelJS() {
  try {
    const mod = await import("exceljs");
    return mod.default ?? mod;
  } catch {
    try {
      const require = createRequire(import.meta.url);
      return require("exceljs");
    } catch {
      return null;
    }
  }
}

function cellText(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") {
    if (Array.isArray(val.richText)) {
      return val.richText.map((t) => t.text ?? "").join("").trim();
    }
    if (val.result !== undefined) return String(val.result).trim();
    if (val.text !== undefined) return String(val.text).trim();
  }
  return String(val).trim();
}

function cellNumber(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return Number.isFinite(val) ? val : 0;
  if (typeof val === "object" && val.result !== undefined) return cellNumber(val.result);
  const s = cellText(val).replace(/\s+/g, "");
  if (!s || s === "-") return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function slugifyEs(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildInflacion() {
  const ipcCsvPath = path.join(FUENTE_DIR, "ipc_div.csv");
  const ipcSeriesPath = path.join(FUENTE_DIR, "ipc_series.json");
  const rawCsv = fs.readFileSync(ipcCsvPath, "utf8");
  const { rows } = parseCsvSimple(rawCsv, ";");

  const nivelGeneralNacional = rows
    .filter((r) => r.Codigo === "0" && r.Region === "Nacional")
    .map((r) => {
      const p = r.Periodo;
      const mes = `${p.slice(0, 4)}-${p.slice(4, 6)}`;
      return {
        mes,
        periodoRaw: p,
        indice: parseArDecimal(r.Indice_IPC),
        variacionMensual: parseArDecimal(r.v_m_IPC),
        variacionInteranual: parseArDecimal(r.v_i_a_IPC),
      };
    })
    .filter((r) => r.indice !== null)
    .sort((a, b) => a.mes.localeCompare(b.mes));

  // Overlay with ipc_series.json (148.3_INIVELNAL_DICI_M_26) if newer or more precise
  if (fs.existsSync(ipcSeriesPath)) {
    const jsonSeries = JSON.parse(fs.readFileSync(ipcSeriesPath, "utf8"));
    const byMes = new Map(nivelGeneralNacional.map((p) => [p.mes, p]));
    for (const [fecha, valor] of jsonSeries.data ?? []) {
      const mes = String(fecha).slice(0, 7);
      const num = Number(valor);
      if (!Number.isFinite(num)) continue;
      const prev = byMes.get(mes);
      if (prev) {
        prev.indice = Number(num.toFixed(4));
      } else {
        byMes.set(mes, {
          mes,
          periodoRaw: mes.replace("-", ""),
          indice: Number(num.toFixed(4)),
          variacionMensual: null,
          variacionInteranual: null,
        });
      }
    }
  }

  const serieOrdenada = nivelGeneralNacional.sort((a, b) => a.mes.localeCompare(b.mes));
  const idxByMes = new Map(serieOrdenada.map((p) => [p.mes, p.indice]));

  const serieFinal = serieOrdenada.map((p, i) => {
    const anio = Number(p.mes.slice(0, 4));
    const prevMes = i > 0 ? serieOrdenada[i - 1] : null;
    const prevAnioMes = `${anio - 1}-${p.mes.slice(5, 7)}`;
    const dicPrevAnio = `${anio - 1}-12`;

    const varMensual =
      p.variacionMensual ??
      (prevMes ? Number((((p.indice / prevMes.indice) - 1) * 100).toFixed(1)) : null);
    const varInteranual =
      p.variacionInteranual ??
      (idxByMes.has(prevAnioMes)
        ? Number((((p.indice / idxByMes.get(prevAnioMes)) - 1) * 100).toFixed(1))
        : null);
    const varAcumuladaAnio = idxByMes.has(dicPrevAnio)
      ? Number((((p.indice / idxByMes.get(dicPrevAnio)) - 1) * 100).toFixed(1))
      : null;

    return {
      mes: p.mes,
      indice: Number(p.indice.toFixed(4)),
      variacionMensual: varMensual,
      variacionInteranual: varInteranual,
      variacionAcumuladaAnio: varAcumuladaAnio,
    };
  });

  // Latest month divisions (Nacional)
  const ultimo = serieFinal[serieFinal.length - 1];
  const ultimoPeriodoRaw = ultimo.mes.replace("-", "");
  const divisiones = rows
    .filter(
      (r) =>
        r.Region === "Nacional" &&
        r.Periodo === ultimoPeriodoRaw &&
        r.Clasificador === "Nivel general y divisiones COICOP" &&
        r.Codigo !== "0"
    )
    .map((r) => ({
      codigo: r.Codigo,
      nombre: r.Descripcion,
      indice: parseArDecimal(r.Indice_IPC),
      variacionMensual: parseArDecimal(r.v_m_IPC),
      variacionInteranual: parseArDecimal(r.v_i_a_IPC),
    }));

  const payload = {
    actualizado: ultimo.mes,
    serieIdDatosGobAr: "148.3_INIVELNAL_DICI_M_26",
    base: "Diciembre 2016 = 100",
    fuente: {
      organismo: "INDEC",
      nombre: "Índice de Precios al Consumidor (IPC) — Nivel General Nacional",
      url: INDEC_IPC_URL,
      licenciaEstado: "Verificar",
    },
    actual: ultimo,
    divisionesUltimoMes: divisiones,
    serie: serieFinal,
  };

  ensureDir(path.join(OUT_DATA_DIR, "inflacion.json"));
  fs.writeFileSync(path.join(OUT_DATA_DIR, "inflacion.json"), JSON.stringify(payload, null, 2), "utf8");

  writeUtf8BomCsv(
    OUT_CSV_IPC,
    ["mes", "indice_ipc_dic2016_100", "variacion_mensual_pct", "variacion_interanual_pct", "variacion_acumulada_anio_pct"],
    serieFinal.map((p) => [p.mes, p.indice, p.variacionMensual ?? "", p.variacionInteranual ?? "", p.variacionAcumuladaAnio ?? ""])
  );

  return payload;
}

function buildDesempleo() {
  const desocPath = path.join(FUENTE_DIR, "desoc_series.json");
  const raw = JSON.parse(fs.readFileSync(desocPath, "utf8"));

  const trimestreDeFecha = (fecha) => {
    const [y, m] = fecha.split("-");
    const map = { "01": "1.º trim.", "04": "2.º trim.", "07": "3.º trim.", "10": "4.º trim." };
    return `${map[m] ?? m} ${y}`;
  };

  const serie = (raw.data ?? [])
    .map(([fecha, valor]) => {
      const prop = Number(valor);
      return {
        fecha,
        trimestre: trimestreDeFecha(fecha),
        tasaPct: Number((prop * 100).toFixed(1)),
        tasaProporcion: Number(prop.toFixed(6)),
      };
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const actual = serie[serie.length - 1];

  const payload = {
    actualizado: actual.fecha,
    serieIdDatosGobAr: "45.2_ECTDT_0_T_33",
    fuente: {
      organismo: "INDEC",
      nombre: "Encuesta Permanente de Hogares (EPH continua) — Tasa de desocupación",
      url: INDEC_EPH_URL,
      licenciaEstado: "Verificar",
    },
    actual,
    serie,
  };

  ensureDir(path.join(OUT_DATA_DIR, "desempleo.json"));
  fs.writeFileSync(path.join(OUT_DATA_DIR, "desempleo.json"), JSON.stringify(payload, null, 2), "utf8");

  writeUtf8BomCsv(
    OUT_CSV_DESEMPLEO,
    ["fecha", "trimestre", "tasa_desocupacion_pct", "tasa_desocupacion_proporcion"],
    serie.map((p) => [p.fecha, p.trimestre, p.tasaPct, p.tasaProporcion])
  );

  return payload;
}

async function parseAnuarioDiu2024(ExcelJS) {
  const z11Path = path.join(FUENTE_DIR, "ad24", "Z 1.1 Datos Generales 24.xlsx");
  if (!ExcelJS || !fs.existsSync(z11Path)) {
    return null;
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(z11Path);
  const ws = wb.worksheets.find((s) => s.name.trim().startsWith("C 1.1.20"));
  if (!ws) return null;

  const RAMAS_OFICIALES = new Set([
    "Ciencias Aplicadas",
    "Ciencias Básicas",
    "Ciencias Humanas",
    "Ciencias Sociales",
    "Ciencias de la Salud",
    "Sin Rama (2)",
  ]);

  let totalSistema = null;
  const ramas = [];
  let ramaActual = null;

  for (let r = 6; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const labelRaw = cellText(row.getCell(2).value);
    if (!labelRaw) continue;
    if (labelRaw.startsWith("Nota:") || labelRaw.startsWith("(1)") || labelRaw.startsWith("Fuente:")) break;

    const estEstatal = cellNumber(row.getCell(3).value);
    const insEstatal = cellNumber(row.getCell(4).value);
    const reiEstatal = cellNumber(row.getCell(5).value);
    const egrEstatal = cellNumber(row.getCell(6).value);
    const estPrivado = cellNumber(row.getCell(7).value);
    const insPrivado = cellNumber(row.getCell(8).value);
    const reiPrivado = cellNumber(row.getCell(9).value);
    const egrPrivado = cellNumber(row.getCell(10).value);

    const metricas = {
      estudiantes: estEstatal + estPrivado,
      nuevosInscriptos: insEstatal + insPrivado,
      reinscriptos: reiEstatal + reiPrivado,
      egresados: egrEstatal + egrPrivado,
      estatal: {
        estudiantes: estEstatal,
        nuevosInscriptos: insEstatal,
        reinscriptos: reiEstatal,
        egresados: egrEstatal,
      },
      privado: {
        estudiantes: estPrivado,
        nuevosInscriptos: insPrivado,
        reinscriptos: reiPrivado,
        egresados: egrPrivado,
      },
    };

    if (labelRaw === "Total") {
      totalSistema = metricas;
      continue;
    }

    const nombreLimpio = labelRaw.replace(/\s*\(\d+\)\s*$/, "").trim();

    if (RAMAS_OFICIALES.has(labelRaw)) {
      ramaActual = {
        rama: nombreLimpio,
        slug: slugifyEs(nombreLimpio),
        ...metricas,
        disciplinas: [],
      };
      ramas.push(ramaActual);
    } else if (ramaActual) {
      ramaActual.disciplinas.push({
        disciplina: nombreLimpio,
        slug: slugifyEs(nombreLimpio),
        rama: ramaActual.rama,
        ...metricas,
      });
    }
  }

  return {
    anio: 2024,
    nivel: "Pregrado y Grado",
    cuadro: "Cuadro 1.1.20 — Anuario Estadístico del Sistema Universitario Argentino 2024 (adelanto parcial)",
    fuente: {
      organismo: "Subsecretaría de Políticas Universitarias (DIU)",
      url: DIU_ANUARIO_URL,
      licenciaEstado: "Verificar",
    },
    totalSistema,
    ramas,
  };
}

async function readDiccionarioOpcional(ExcelJS) {
  const dictPath = path.join(FUENTE_DIR, "diccionario-araucano.xlsx");
  const mapa = new Map();
  if (!ExcelJS || !fs.existsSync(dictPath)) return mapa;

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(dictPath);
  for (const ws of wb.worksheets) {
    let idCol = -1;
    let nameCol = -1;
    for (let r = 1; r <= Math.min(10, ws.rowCount); r++) {
      const row = ws.getRow(r);
      row.eachCell((cell, colNumber) => {
        const t = cellText(cell.value).toLowerCase();
        if (t === "disciplina_id" || t === "id_disciplina") idCol = colNumber;
        if (t === "nombre_oficial" || t === "disciplina" || t === "nombre") nameCol = colNumber;
      });
      if (idCol > 0 && nameCol > 0) {
        for (let rr = r + 1; rr <= ws.rowCount; rr++) {
          const dataRow = ws.getRow(rr);
          const id = Number(cellText(dataRow.getCell(idCol).value));
          const nombre = cellText(dataRow.getCell(nameCol).value);
          if (Number.isInteger(id) && id > 0 && nombre) {
            mapa.set(id, { nombreOficial: nombre, slug: slugifyEs(nombre) });
          }
        }
        return mapa;
      }
    }
  }
  return mapa;
}

async function buildCarreras(inflacionPayload, ExcelJS) {
  const araucanoPath = path.join(FUENTE_DIR, "out", "araucano_por_disciplina.csv");
  const { rows } = parseCsvSimple(fs.readFileSync(araucanoPath, "utf8"), ",");

  const dictOpcional = await readDiccionarioOpcional(ExcelJS);

  // Compute average IPC for 2019-2021 and IPC for MES_AJUSTE_IPC (2026-10)
  const serie2019_2021 = inflacionPayload.serie.filter(
    (p) => p.mes >= "2019-01" && p.mes <= "2021-12"
  );
  const ipcPromedioBase =
    serie2019_2021.reduce((acc, p) => acc + p.indice, 0) / serie2019_2021.length;
  const puntoAjuste = inflacionPayload.serie.find((p) => p.mes === MES_AJUSTE_IPC);
  const ipcMesAjuste = puntoAjuste.indice;
  const factorAjusteIpc = ipcMesAjuste / ipcPromedioBase;

  const excluidas = [];
  const publicables = [];

  for (const r of rows) {
    const id = Number(r.disciplina_id);
    const nFilas = Number(r.n_filas);
    const nConSalarioSipa = Number(r.n_con_salario_sipa);
    const publicable = r.publicable_n100 === "si";
    const medianaNominal = Number(r.mediana_salario_nominal);
    const p25Nominal = Number(r.p25);
    const p75Nominal = Number(r.p75);

    if (!publicable) {
      excluidas.push({ disciplinaId: id, nConSalarioSipa });
      continue;
    }

    const fromCsvNombre = r.nombre_oficial ? r.nombre_oficial : null;
    const fromCsvSlug = r.slug ? r.slug : null;
    const fromDict = dictOpcional.get(id);

    const nombreOficial = fromCsvNombre ?? fromDict?.nombreOficial ?? null;
    const slug = fromCsvSlug ?? fromDict?.slug ?? null;

    const proporcionSipa = nFilas > 0 ? Number((nConSalarioSipa / nFilas).toFixed(4)) : 0;

    publicables.push({
      disciplinaId: id,
      nombreOficial,
      slug,
      nFilas,
      nConSalarioSipa,
      porcentajeSipa: proporcionSipa,
      porcentajeSipaPct: Number((proporcionSipa * 100).toFixed(1)),
      medianaNominal: Number(medianaNominal.toFixed(2)),
      p25Nominal: Number(p25Nominal.toFixed(2)),
      p75Nominal: Number(p75Nominal.toFixed(2)),
      medianaAjustadaOct2026: Math.round(medianaNominal * factorAjusteIpc),
      p25AjustadoOct2026: Math.round(p25Nominal * factorAjusteIpc),
      p75AjustadoOct2026: Math.round(p75Nominal * factorAjusteIpc),
      aniosSalario: r.anios_salario,
      aniosEgreso: r.anios_egreso,
    });
  }

  const fichasPublicadas = publicables.filter((d) => d.nombreOficial && d.slug).length;
  const diccionarioDisponible = fichasPublicadas === publicables.length && publicables.length > 0;

  let anuarioDiu2024 = await parseAnuarioDiu2024(ExcelJS);
  if (!anuarioDiu2024) {
    const existingPath = path.join(OUT_DATA_DIR, "carreras.json");
    if (fs.existsSync(existingPath)) {
      const existing = JSON.parse(fs.readFileSync(existingPath, "utf8"));
      anuarioDiu2024 = existing.anuarioDiu2024 ?? null;
    }
  }

  const payload = {
    actualizado: MES_AJUSTE_IPC,
    anioBase: ANIO_BASE_ARAUCANO,
    mesAjusteIpc: MES_AJUSTE_IPC,
    ipcPromedioBase: Number(ipcPromedioBase.toFixed(4)),
    ipcMesAjuste: Number(ipcMesAjuste.toFixed(4)),
    factorAjusteIpc: Number(factorAjusteIpc.toFixed(6)),
    diccionarioDisponible,
    fichasPublicadas,
    totalDisciplinasPublicables: publicables.length,
    disciplinasExcluidasPorUmbral: excluidas,
    fuenteAraucano: {
      organismo: "CEP XXI — Ministerio de Economía / Producción",
      nombre: "Graduados universitarios del Sistema Araucano (cohortes 2016–2018, salarios SIPA 2019–2021)",
      datasetUrl: ARAUCANO_DATASET_URL,
      baseCsvUrl: ARAUCANO_BASE_CSV_URL,
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      licenseNombre: "CC BY 4.0",
    },
    disciplinas: publicables,
    anuarioDiu2024,
  };

  ensureDir(path.join(OUT_DATA_DIR, "carreras.json"));
  fs.writeFileSync(path.join(OUT_DATA_DIR, "carreras.json"), JSON.stringify(payload, null, 2), "utf8");

  writeUtf8BomCsv(
    OUT_CSV_CARRERAS,
    [
      "disciplina_id",
      "nombre_oficial",
      "slug",
      "n_filas",
      "n_con_salario_sipa",
      "porcentaje_sipa_pct",
      "mediana_nominal_2019_2021_ars",
      "p25_nominal_ars",
      "p75_nominal_ars",
      "mediana_estimada_oct2026_ars",
      "p25_estimado_oct2026_ars",
      "p75_estimado_oct2026_ars",
      "anio_base",
      "mes_ajuste_ipc",
    ],
    publicables.map((d) => [
      d.disciplinaId,
      d.nombreOficial ?? "",
      d.slug ?? "",
      d.nFilas,
      d.nConSalarioSipa,
      d.porcentajeSipaPct,
      d.medianaNominal,
      d.p25Nominal,
      d.p75Nominal,
      d.medianaAjustadaOct2026,
      d.p25AjustadoOct2026,
      d.p75AjustadoOct2026,
      ANIO_BASE_ARAUCANO,
      MES_AJUSTE_IPC,
    ])
  );

  return payload;
}

async function main() {
  const ExcelJS = await loadExcelJS();
  if (!ExcelJS) {
    console.warn("[build-datos-ar] exceljs no disponible en este entorno; se omitirá lectura de XLSX.");
  }
  const inflacion = buildInflacion();
  const desempleo = buildDesempleo();
  const carreras = await buildCarreras(inflacion, ExcelJS);

  console.log(
    `[build-datos-ar] OK: inflacion=${inflacion.serie.length} meses (último ${inflacion.actualizado}), ` +
      `desempleo=${desempleo.serie.length} trimestres (último ${desempleo.actualizado} = ${desempleo.actual.tasaPct}%), ` +
      `carreras=${carreras.totalDisciplinasPublicables} publicables (diccionarioDisponible=${carreras.diccionarioDisponible}, ` +
      `DIU2024=${carreras.anuarioDiu2024 ? carreras.anuarioDiu2024.ramas.length + " ramas" : "no disponible"})`
  );
}

main().catch((err) => {
  console.error("[build-datos-ar] ERROR:", err);
  process.exit(1);
});
