#!/usr/bin/env node
/**
 * Pipeline reproducible de datos oficiales de Colombia (/co/datos).
 * Lee exclusivamente de `data/co/fuente/out/` (sin red, sin `new Date()`),
 * genera los JSON en `data/co/` y los 4 CSV públicos en `public/co/datos/<tema>/csv/`,
 * y valida los valores de control oficiales antes de terminar.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const FUENTE_DIR = path.join(ROOT, "data", "co", "fuente", "out");
const DATA_OUT_DIR = path.join(ROOT, "data", "co");
const PUBLIC_CARRERAS_CSV = path.join(ROOT, "public", "co", "datos", "carreras", "csv");
const PUBLIC_DESEMPLEO_CSV = path.join(ROOT, "public", "co", "datos", "desempleo", "csv");
const PUBLIC_INFLACION_CSV = path.join(ROOT, "public", "co", "datos", "inflacion", "csv");

const SLUGS_RESERVADOS = new Set([
  "mejor-pagadas",
  "tecnologicas-mejor-pagadas",
  "cuanto-gana-un-analista-de-datos",
  "comparar",
  "metodologia",
  "csv",
]);

const CORRECCIONES_SLUG = {
  "administracion-de-la-seguridad-y-saluden-el-trabajo":
    "administracion-de-la-seguridad-y-salud-en-el-trabajo",
};

function parseCsvRow(line) {
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
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  const lines = raw.split("\n");
  if (lines.length < 2) return [];
  const headers = parseCsvRow(lines[0]);
  return lines.slice(1).map((line) => {
    const vals = parseCsvRow(line);
    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = vals[i] ?? "";
    }
    return obj;
  });
}

function escapeCsvCell(val) {
  const s = val === null || val === undefined ? "" : String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(headers, rows) {
  const lines = [headers.map(escapeCsvCell).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsvCell(row[h])).join(","));
  }
  return lines.join("\n") + "\n";
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function writeCsv(filePath, headers, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, toCsv(headers, rows), "utf8");
}

function num(val) {
  if (val === "" || val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

function intVal(val) {
  const n = Number.parseInt(val, 10);
  return Number.isFinite(n) ? n : 0;
}

function roundTo(val, decimals) {
  const f = 10 ** decimals;
  return Math.round(val * f) / f;
}

function assert(cond, msg) {
  if (!cond) {
    throw new Error(`Validación fallida: ${msg}`);
  }
}

function main() {
  // 1. Parámetros laborales 2026
  const paramsPath = path.join(FUENTE_DIR, "parametros_laborales_2026.json");
  const paramsRaw = JSON.parse(fs.readFileSync(paramsPath, "utf8"));
  const smmlv = paramsRaw.smmlv_2026_cop;
  const auxilio = paramsRaw.auxilio_transporte_2026_cop;

  assert(smmlv === 1750905, `SMMLV 2026 esperado 1750905, obtenido ${smmlv}`);
  assert(auxilio === 249095, `Auxilio 2026 esperado 249095, obtenido ${auxilio}`);
  assert(paramsRaw.trm_2026_11_25 === 3592.03, `TRM esperada 3592.03, obtenida ${paramsRaw.trm_2026_11_25}`);
  assert(
    paramsRaw.tasa_intervencion_pct_2026_11_24 === 12.25,
    `Tasa intervención esperada 12.25, obtenida ${paramsRaw.tasa_intervencion_pct_2026_11_24}`
  );

  // 2. SNIES graduados 2025 (indexado por programa_normalizado + nivel_formacion)
  const sniesRows = readCsv(path.join(FUENTE_DIR, "snies_graduados_2025.csv"));
  const sniesMap = new Map();
  const sniesDups = new Set();
  for (const r of sniesRows) {
    const key = `${r.programa_normalizado}||${r.nivel_formacion}`;
    if (sniesMap.has(key)) {
      sniesDups.add(key);
    } else {
      sniesMap.set(key, {
        graduados_2025: intVal(r.graduados_2025),
        n_ies: intVal(r.n_ies),
        nbc: r.nbc,
      });
    }
  }
  // Solo usar cruce inequívoco
  for (const k of sniesDups) sniesMap.delete(k);

  // 3. Carreras OLE por IES (solo >=30 cotizantes)
  const iesRows = readCsv(path.join(FUENTE_DIR, "carreras_ole_ies_cohorte_2020_2022.csv"));
  const iesPorKey = new Map();
  for (const r of iesRows) {
    const grad = intVal(r.graduados_cotizantes);
    if (grad < 30) continue;
    const key = `${r.programa_normalizado}||${r.nivel_formacion}`;
    if (!iesPorKey.has(key)) iesPorKey.set(key, []);
    iesPorKey.get(key).push({
      ies: r.ies,
      sector_ies: r.sector_ies,
      graduados_cotizantes: grad,
      pct_4plus_smmlv: num(r.pct_4plus_smmlv) ?? 0,
      mediana_smmlv: num(r.mediana_smmlv) ?? 0,
      mediana_cop_2026: intVal(r.mediana_cop_2026),
    });
  }

  // 4. Carreras OLE consolidadas
  const oleRows = readCsv(path.join(FUENTE_DIR, "carreras_ole_cohorte_2020_2022.csv"));
  const programasPublicados = [];
  const slugsVistos = new Set();
  const fichasPorNivel = {};
  const rankingsPorNivel = {};

  for (const r of oleRows) {
    const esRanking = r.sugerido_ranking === "si";
    const esFicha = r.sugerido_ficha === "si";
    if (!esRanking && !esFicha) continue;

    const slug = CORRECCIONES_SLUG[r.slug] ?? r.slug;
    assert(!SLUGS_RESERVADOS.has(slug), `Slug reservado colisiona: ${slug}`);
    assert(!slugsVistos.has(slug), `Slug duplicado: ${slug}`);
    slugsVistos.add(slug);

    if (esFicha) {
      fichasPorNivel[r.nivel_formacion] = (fichasPorNivel[r.nivel_formacion] || 0) + 1;
    }
    if (esRanking) {
      rankingsPorNivel[r.nivel_formacion] = (rankingsPorNivel[r.nivel_formacion] || 0) + 1;
    }

    const key = `${r.programa_normalizado}||${r.nivel_formacion}`;
    const iesLista = (iesPorKey.get(key) ?? []).slice().sort(
      (a, b) => b.mediana_smmlv - a.mediana_smmlv || b.graduados_cotizantes - a.graduados_cotizantes || a.ies.localeCompare(b.ies, "es")
    );

    // Desglose sector_ies (Oficial vs Privado) solo si ambos lados tienen >= 30 cotizantes
    let sectorIes = null;
    const oficiales = iesLista.filter((x) => x.sector_ies === "Oficial");
    const privados = iesLista.filter((x) => x.sector_ies === "Privado");
    const gradOf = oficiales.reduce((acc, x) => acc + x.graduados_cotizantes, 0);
    const gradPr = privados.reduce((acc, x) => acc + x.graduados_cotizantes, 0);
    if (gradOf >= 30 && gradPr >= 30) {
      const calcSector = (lista, gradTotal) => {
        const medSmmlv = roundTo(
          lista.reduce((acc, x) => acc + x.mediana_smmlv * x.graduados_cotizantes, 0) / gradTotal,
          2
        );
        const pct4 = roundTo(
          lista.reduce((acc, x) => acc + x.pct_4plus_smmlv * x.graduados_cotizantes, 0) / gradTotal,
          1
        );
        return {
          n_ies: lista.length,
          graduados_cotizantes: gradTotal,
          mediana_smmlv: medSmmlv,
          mediana_cop_2026: Math.round(medSmmlv * smmlv),
          pct_4plus_smmlv: pct4,
        };
      };
      sectorIes = {
        oficial: calcSector(oficiales, gradOf),
        privado: calcSector(privados, gradPr),
      };
    }

    programasPublicados.push({
      slug,
      programa: r.programa,
      programa_normalizado: r.programa_normalizado,
      nivel_formacion: r.nivel_formacion,
      area_conocimiento: r.area_conocimiento,
      graduados_cotizantes: intVal(r.graduados_cotizantes),
      n_ies: intVal(r.n_ies),
      pct_4plus_smmlv: num(r.pct_4plus_smmlv) ?? 0,
      mediana_smmlv: num(r.mediana_smmlv) ?? 0,
      mediana_cop_2026: intVal(r.mediana_cop_2026),
      promedio_smmlv: num(r.promedio_smmlv) ?? 0,
      promedio_cop_2026: intVal(r.promedio_cop_2026),
      sugerido_ranking: esRanking,
      sugerido_ficha: esFicha,
      rangos_smmlv: {
        n_1_sm: intVal(r["n_1-sm"]),
        n_1_y_1_5_sm: intVal(r["n_1-y-1-5-sm"]),
        n_1_5_y_2_5_sm: intVal(r["n_1-5-y-2-5-sm"]),
        n_2_5_y_4_sm: intVal(r["n_2-5-y-4-sm"]),
        n_4_y_6_sm: intVal(r["n_4-y-6-sm"]),
        n_6_y_9_sm: intVal(r["n_6-y-9-sm"]),
        n_mas_de_9_sm: intVal(r["n_mas-de-9-sm"]),
      },
      snies_2025: sniesMap.get(key) ?? null,
      sector_ies: sectorIes,
    });
  }

  programasPublicados.sort(
    (a, b) =>
      b.mediana_smmlv - a.mediana_smmlv ||
      b.graduados_cotizantes - a.graduados_cotizantes ||
      a.slug.localeCompare(b.slug, "es")
  );

  // Validar conteos exactos
  const totalFichas = programasPublicados.filter((p) => p.sugerido_ficha).length;
  const totalRankings = programasPublicados.filter((p) => p.sugerido_ranking).length;
  assert(totalFichas === 354, `Conteo fichas esperado 354, obtenido ${totalFichas}`);
  assert(fichasPorNivel["Universitario"] === 209, `Fichas Universitario esperado 209, obtenido ${fichasPorNivel["Universitario"]}`);
  assert(fichasPorNivel["Tecnológico"] === 131, `Fichas Tecnológico esperado 131, obtenido ${fichasPorNivel["Tecnológico"]}`);
  assert(
    fichasPorNivel["Formación técnica profesional"] === 14,
    `Fichas Téc Prof esperado 14, obtenido ${fichasPorNivel["Formación técnica profesional"]}`
  );

  assert(totalRankings === 335, `Conteo rankings esperado 335, obtenido ${totalRankings}`);
  assert(rankingsPorNivel["Universitario"] === 99, `Rankings Universitario esperado 99, obtenido ${rankingsPorNivel["Universitario"]}`);
  assert(rankingsPorNivel["Tecnológico"] === 210, `Rankings Tecnológico esperado 210, obtenido ${rankingsPorNivel["Tecnológico"]}`);
  assert(
    rankingsPorNivel["Formación técnica profesional"] === 26,
    `Rankings Téc Prof esperado 26, obtenido ${rankingsPorNivel["Formación técnica profesional"]}`
  );

  // Validar 7 programas de control
  const verificarProg = (nombreNorm, nivel, grad, pct4, med) => {
    const p = programasPublicados.find(
      (x) => x.programa_normalizado === nombreNorm && x.nivel_formacion === nivel
    );
    assert(p, `Falta programa de control: ${nombreNorm} (${nivel})`);
    assert(p.graduados_cotizantes === grad, `${nombreNorm} grad esperado ${grad}, obtenido ${p.graduados_cotizantes}`);
    assert(p.pct_4plus_smmlv === pct4, `${nombreNorm} pct4 esperado ${pct4}, obtenido ${p.pct_4plus_smmlv}`);
    assert(p.mediana_smmlv === med, `${nombreNorm} mediana esperado ${med}, obtenido ${p.mediana_smmlv}`);
  };

  verificarProg("INGENIERIA DE SISTEMAS Y COMPUTACION", "Universitario", 1550, 49.8, 3.99);
  verificarProg("INGENIERIA INFORMATICA", "Universitario", 1132, 47.5, 3.87);
  verificarProg("INGENIERIA DE SOFTWARE", "Universitario", 1175, 43.5, 3.65);
  verificarProg("INGENIERIA DE SISTEMAS", "Universitario", 14422, 32.3, 3.08);
  verificarProg("ECONOMIA", "Universitario", 5237, 19.1, 2.47);
  verificarProg("INGENIERIA INDUSTRIAL", "Universitario", 27339, 14.3, 2.21);
  verificarProg("ESTADISTICA", "Universitario", 391, 42.2, 3.7);

  // Construir carreras-ies.json indexado por slug
  const porProgramaIes = {};
  const iesCsvRows = [];
  let totalIesRegistros = 0;
  for (const p of programasPublicados) {
    const key = `${p.programa_normalizado}||${p.nivel_formacion}`;
    const lista = (iesPorKey.get(key) ?? []).slice().sort(
      (a, b) => b.mediana_smmlv - a.mediana_smmlv || b.graduados_cotizantes - a.graduados_cotizantes || a.ies.localeCompare(b.ies, "es")
    );
    if (lista.length > 0) {
      porProgramaIes[p.slug] = lista;
      totalIesRegistros += lista.length;
      for (const item of lista) {
        iesCsvRows.push({
          slug: p.slug,
          programa: p.programa,
          nivel_formacion: p.nivel_formacion,
          ies: item.ies,
          sector_ies: item.sector_ies,
          graduados_cotizantes: item.graduados_cotizantes,
          pct_4plus_smmlv: item.pct_4plus_smmlv,
          mediana_smmlv: item.mediana_smmlv,
          mediana_cop_2026: item.mediana_cop_2026,
        });
      }
    }
  }

  const nivelesUnicos = ["Universitario", "Tecnológico", "Formación técnica profesional"];
  const areasUnicas = [...new Set(programasPublicados.map((p) => p.area_conocimiento))].sort((a, b) =>
    a.localeCompare(b, "es")
  );

  writeJson(path.join(DATA_OUT_DIR, "carreras.json"), {
    meta: {
      cohorte: "2020-2022",
      anio_seguimiento: 2023,
      smmlv_2026_cop: smmlv,
      fuente_ole: "Ministerio de Educación Nacional — Observatorio Laboral para la Educación (OLE), Base IBC, cohorte 2020–2022, seguimiento 2023.",
      fuente_ole_url: "https://ole.mineducacion.gov.co",
      fuente_snies: "Ministerio de Educación Nacional — SNIES, graduados 2025.",
      fuente_snies_url: "https://snies.mineducacion.gov.co",
      conteos: {
        total_fuente: oleRows.length,
        publicados: programasPublicados.length,
        fichas: totalFichas,
        rankings: totalRankings,
        fichas_por_nivel: fichasPorNivel,
        rankings_por_nivel: rankingsPorNivel,
      },
      niveles: nivelesUnicos,
      areas: areasUnicas,
    },
    programas: programasPublicados,
  });

  writeJson(path.join(DATA_OUT_DIR, "carreras-ies.json"), {
    meta: {
      cohorte: "2020-2022",
      anio_seguimiento: 2023,
      smmlv_2026_cop: smmlv,
      umbral_min_cotizantes: 30,
      total_registros: totalIesRegistros,
      fuente_ole: "Ministerio de Educación Nacional — OLE, Base IBC, cohorte 2020–2022, seguimiento 2023.",
      fuente_ole_url: "https://ole.mineducacion.gov.co",
    },
    por_programa: porProgramaIes,
  });

  // CSV público 1: ranking-carreras-colombia-ole.csv (solo sugerido_ranking)
  const rankingCsvRows = programasPublicados
    .filter((p) => p.sugerido_ranking)
    .map((p) => ({
      slug: p.slug,
      programa: p.programa,
      nivel_formacion: p.nivel_formacion,
      area_conocimiento: p.area_conocimiento,
      graduados_cotizantes: p.graduados_cotizantes,
      n_ies: p.n_ies,
      pct_4plus_smmlv: p.pct_4plus_smmlv,
      mediana_smmlv: p.mediana_smmlv,
      mediana_cop_2026: p.mediana_cop_2026,
      graduados_snies_2025: p.snies_2025 ? p.snies_2025.graduados_2025 : "",
    }));

  writeCsv(
    path.join(PUBLIC_CARRERAS_CSV, "ranking-carreras-colombia-ole.csv"),
    [
      "slug",
      "programa",
      "nivel_formacion",
      "area_conocimiento",
      "graduados_cotizantes",
      "n_ies",
      "pct_4plus_smmlv",
      "mediana_smmlv",
      "mediana_cop_2026",
      "graduados_snies_2025",
    ],
    rankingCsvRows
  );

  // CSV público 2: carreras-ies-colombia-ole.csv
  writeCsv(
    path.join(PUBLIC_CARRERAS_CSV, "carreras-ies-colombia-ole.csv"),
    [
      "slug",
      "programa",
      "nivel_formacion",
      "ies",
      "sector_ies",
      "graduados_cotizantes",
      "pct_4plus_smmlv",
      "mediana_smmlv",
      "mediana_cop_2026",
    ],
    iesCsvRows
  );

  // 5. Desempleo DANE GEIH
  const desNacRows = readCsv(path.join(FUENTE_DIR, "desempleo_nacional.csv")).map((r) => {
    const anio = intVal(r.anio);
    const mes = intVal(r.mes);
    return {
      anio,
      mes,
      periodo: `${anio}-${String(mes).padStart(2, "0")}`,
      mes_nombre: r.mes_nombre,
      tasa_desocupacion_pct: num(r.tasa_desocupacion_pct) ?? 0,
    };
  });
  desNacRows.sort((a, b) => a.anio - b.anio || a.mes - b.mes);

  const desActual = desNacRows[desNacRows.length - 1];
  assert(desActual && desActual.periodo === "2026-09", `Último periodo desempleo esperado 2026-09, obtenido ${desActual?.periodo}`);
  assert(desActual.tasa_desocupacion_pct === 8.0, `Desempleo sep-2026 esperado 8.0, obtenido ${desActual.tasa_desocupacion_pct}`);

  const desCiuRows = readCsv(path.join(FUENTE_DIR, "desempleo_ciudades_jul_sep_2026.csv")).map((r) => ({
    ciudad: r.ciudad,
    tasa_desocupacion_pct: num(r.tasa_desocupacion_pct) ?? 0,
    tipo: r.tipo,
  }));

  const bogota = desCiuRows.find((c) => c.ciudad === "Bogotá D.C.");
  const quibdo = desCiuRows.find((c) => c.ciudad === "Quibdó");
  assert(bogota && bogota.tasa_desocupacion_pct === 7.6, `Bogotá esperado 7.6, obtenido ${bogota?.tasa_desocupacion_pct}`);
  assert(quibdo && quibdo.tasa_desocupacion_pct === 23.4, `Quibdó esperado 23.4, obtenido ${quibdo?.tasa_desocupacion_pct}`);
  assert(desCiuRows.filter((c) => c.tipo === "ciudad").length === 23, "Se esperan 23 ciudades");
  assert(desCiuRows.filter((c) => c.tipo === "agregado").length === 3, "Se esperan 3 totales oficiales");

  writeJson(path.join(DATA_OUT_DIR, "desempleo.json"), {
    meta: {
      fuente: "DANE, Gran Encuesta Integrada de Hogares (GEIH), anex-GEIH-sep2026.xlsx (actualizado 30-oct-2026).",
      fuente_url: "https://www.dane.gov.co/index.php/estadisticas-por-tema/mercado-laboral/empleo-y-desempleo",
      periodo_nacional_actual: desActual.periodo,
      tasa_nacional_actual_pct: desActual.tasa_desocupacion_pct,
      periodo_ciudades: "jul-sep 2026",
      cobertura_ciudades: "23 ciudades y áreas metropolitanas, trimestre móvil",
      nota_metodologica: "No mezclar la serie nacional mensual (8,0 % en septiembre 2026) con el agregado trimestral móvil de 23 ciudades (8,9 % en jul–sep 2026).",
    },
    nacional: desNacRows,
    ciudades: desCiuRows,
  });

  // CSV público 3: desempleo-colombia-dane.csv
  writeCsv(
    path.join(PUBLIC_DESEMPLEO_CSV, "desempleo-colombia-dane.csv"),
    ["periodo", "anio", "mes", "mes_nombre", "tasa_desocupacion_pct"],
    desNacRows
  );

  // 6. Inflación (IPC DANE) + BanRep + TRM
  const ipcRows = readCsv(path.join(FUENTE_DIR, "ipc_nacional.csv")).map((r) => {
    const anio = intVal(r.anio);
    const mes = intVal(r.mes);
    return {
      anio,
      mes,
      periodo: `${anio}-${String(mes).padStart(2, "0")}`,
      mes_nombre: r.mes_nombre,
      indice_base_dic2018: num(r.indice_base_dic2018) ?? 0,
      var_12m_pct: num(r.var_12m_pct),
    };
  });
  ipcRows.sort((a, b) => a.anio - b.anio || a.mes - b.mes);

  const ipcActual = ipcRows[ipcRows.length - 1];
  assert(ipcActual && ipcActual.periodo === "2026-10", `Último periodo IPC esperado 2026-10, obtenido ${ipcActual?.periodo}`);
  assert(ipcActual.indice_base_dic2018 === 161.32, `IPC índice oct-2026 esperado 161.32, obtenido ${ipcActual.indice_base_dic2018}`);
  assert(ipcActual.var_12m_pct === 6.3, `IPC var 12m oct-2026 esperado 6.3, obtenido ${ipcActual.var_12m_pct}`);

  writeJson(path.join(DATA_OUT_DIR, "inflacion.json"), {
    meta: {
      base: "dic-2018=100",
      periodo_actual: ipcActual.periodo,
      indice_actual: ipcActual.indice_base_dic2018,
      var_12m_actual_pct: ipcActual.var_12m_pct,
      fuente_ipc: "DANE, Índice de Precios al Consumidor (IPC), anex-IPC-Indices-oct2026.xlsx (actualizado 9-nov-2026).",
      fuente_ipc_url: "https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/indice-de-precios-al-consumidor-ipc",
      tasa_intervencion_pct: paramsRaw.tasa_intervencion_pct_2026_11_24,
      tasa_intervencion_fecha: "2026-11-24",
      tasa_intervencion_fuente: paramsRaw.tasa_intervencion_fuente,
      tasa_intervencion_url: "https://www.banrep.gov.co/es/estadisticas/tasas-interes-politica-monetaria",
      trm_cop_usd: paramsRaw.trm_2026_11_25,
      trm_fecha: "2026-11-25",
      trm_fuente: paramsRaw.trm_fuente,
      trm_url: "https://www.datos.gov.co/Econom-a-y-Finanzas/Tasa-de-Cambio-Representativa-del-Mercado-TRM-/32sa-8pi3",
      trm_licencia: "CC BY-SA 4.0",
    },
    serie: ipcRows,
  });

  // CSV público 4: ipc-colombia-dane.csv
  writeCsv(
    path.join(PUBLIC_INFLACION_CSV, "ipc-colombia-dane.csv"),
    ["periodo", "anio", "mes", "mes_nombre", "indice_base_dic2018", "var_12m_pct"],
    ipcRows
  );

  // 7. Salario mínimo y parámetros laborales 2026
  const salarioMinimoJson = {
    anio: 2026,
    smmlv_cop: smmlv,
    auxilio_transporte_cop: auxilio,
    total_smmlv_mas_auxilio_cop: smmlv + auxilio,
    tope_auxilio_transporte_smmlv: 2,
    tope_auxilio_transporte_cop: smmlv * 2,
    salud_empleado_pct: 4,
    pension_empleado_pct: 4,
    fsp_desde_smmlv: 4,
    intereses_cesantias_pct_anual: 12,
    fuentes: {
      smmlv: paramsRaw.smmlv_fuente,
      auxilio_transporte: paramsRaw.auxilio_fuente,
      mintrabajo_url: "https://www.mintrabajo.gov.co",
    },
  };
  writeJson(path.join(DATA_OUT_DIR, "salario-minimo.json"), salarioMinimoJson);

  const notasLimpias = (paramsRaw.notas ?? []).map((n) =>
    n
      .replace(/«empleabilidad»/gi, "«tasa de cotización»")
      .replace(/empleabilidad/gi, "tasa de cotización")
      .replace(/«campo laboral»/gi, "«salida laboral»")
      .replace(/campo laboral/gi, "salida laboral")
  );

  writeJson(path.join(DATA_OUT_DIR, "parametros-laborales-2026.json"), {
    ...paramsRaw,
    total_smmlv_mas_auxilio_2026_cop: smmlv + auxilio,
    notas: notasLimpias,
  });

  console.log(
    `[build-datos-co] OK: ${programasPublicados.length} programas (${totalFichas} fichas, ${totalRankings} rankings), ${totalIesRegistros} registros IES, ${desNacRows.length} meses desempleo, ${ipcRows.length} meses IPC.`
  );
}

main();
