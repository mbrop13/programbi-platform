import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const FUENTE_DIR = join(ROOT, "data", "pe", "carreras", "fuente");
const OUT_JSON = join(ROOT, "data", "pe", "carreras", "carreras-pe.json");
const OUT_CSV = join(ROOT, "public", "pe", "datos", "carreras", "csv", "carreras-peru.csv");

const SLUGS_RESERVADOS = new Set(["mejor-pagadas", "tecnicas-mejor-pagadas", "csv"]);
const CODIGOS_HERMANA = new Set(["111", "112", "121", "331", "332", "342", "526", "531", "611", "714"]);

const MTPE_TECNICAS_MAP = {
  "112": "Educación Primaria",
  "524": "Técnico Electricista",
  "526": "Técnico Mecánica",
  "121": "Educación Secundaria",
  "531": "Técnico Civil",
  "222": "Diseño",
  "332": "Administración de Servicios Turísticos, Hotelería y Gastronomía",
  "331": "Administración de Empresas",
  "441": "Ciencias de la Computación",
  "342": "Contabilidad y Finanzas",
  "337": "Secretariado",
  "611": "Agropecuaria",
  "714": "Enfermería",
  "715": "Tecnología Médica",
  "716": "Farmacia y Bioquímica",
  "111": "Educación Inicial",
};

// Tabla exacta de regex de data/peru-carreras-fase1/build_poc.py
const SUNEDU_RX = {
  "711": /^medicina humana/i,
  "527": /minas|minera|metalurg|petrole/i,
  "521": /^ingenieria industrial/i,
  "526": /^ingenieria mecanica(?!.*electr)|^ingenieria mecanica$/i,
  "511": /ingenieria de sistemas|ingenieria de software|ingenieria informatica|ingenieria de computacion|ingenieria de sistemas e informatica/i,
  "531": /^ingenieria civil/i,
  "714": /enfermeria/i,
  "533": /arquitectura/i,
  "351": /^derecho/i,
  "112": /educacion primaria/i,
  "341": /^economia/i,
  "121": /educacion secundaria/i,
  "335": /negocios internacionales/i,
  "594": /ambiental|ecologia/i,
  "342": /contabilidad|contables/i,
  "331": /^administracion(?! publica)|administracion de empresas|administracion y/i,
  "611": /agronom|agropecuari/i,
  "717": /obstetricia/i,
  "713": /odontolog|estomatolog/i,
  "321": /ciencias de la comunicacion|comunicacion/i,
  "111": /educacion inicial/i,
  "332": /turismo|hoteler|gastronom/i,
  "313": /psicolog/i,
  "422": /^quimica$/i,
  "715": /tecnologia medica/i,
  "411": /^biologia/i,
  "523": /agroindustri/i,
  "621": /veterinari/i,
  "522": /industrias alimentarias|alimentari/i,
};

const DEPARTAMENTO_NOMBRES = {
  amazonas: "Amazonas",
  ancash: "Áncash",
  apurimac: "Apurímac",
  arequipa: "Arequipa",
  ayacucho: "Ayacucho",
  cajamarca: "Cajamarca",
  cusco: "Cusco",
  huancavelica: "Huancavelica",
  huanuco: "Huánuco",
  ica: "Ica",
  junin: "Junín",
  "la-libertad": "La Libertad",
  lambayeque: "Lambayeque",
  lima: "Lima",
  loreto: "Loreto",
  "madre-de-dios": "Madre de Dios",
  moquegua: "Moquegua",
  pasco: "Pasco",
  piura: "Piura",
  puno: "Puno",
  "san-martin": "San Martín",
  tacna: "Tacna",
  tumbes: "Tumbes",
  ucayali: "Ucayali",
};

function norm(s) {
  return String(s ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = [];
  let row = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQ = false;
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQ = true;
    } else if (c === ",") {
      row.push(cur);
      cur = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cur);
      cur = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      cur += c;
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    if (row.length > 1 || row[0] !== "") rows.push(row);
  }
  const hdr = rows[0];
  return rows.slice(1).map((r) => {
    const obj = {};
    for (let i = 0; i < hdr.length; i++) {
      obj[hdr[i]] = r[i] ?? "";
    }
    return obj;
  });
}

function num(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function intNum(v) {
  const n = num(v);
  return n === null ? null : Math.round(n);
}

function titleCaseEs(str) {
  return String(str ?? "")
    .toLowerCase()
    .replace(/\b([a-záéíóúñü])/gi, (m) => m.toUpperCase())
    .replace(/\b(De|Del|La|Las|Los|Y|E|En|Por|Para)\b/g, (m) => m.toLowerCase())
    .replace(/^./, (m) => m.toUpperCase());
}

function medianOf(nums) {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

function csvCell(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function main() {
  const fichasRaw = parseCsv(readFileSync(join(FUENTE_DIR, "fichas_publicables_pe.csv"), "utf8"));
  const pocRaw = parseCsv(readFileSync(join(FUENTE_DIR, "poc_carreras_peru.csv"), "utf8"));
  const enahoRaw = parseCsv(readFileSync(join(FUENTE_DIR, "enaho_pool_por_grupo_carrera.csv"), "utf8"));
  const mtpeRaw = parseCsv(
    readFileSync(join(FUENTE_DIR, "mtpe_mejor_pagadas_por_departamento_nov22_oct23.csv"), "utf8"),
  );
  const m22Raw = parseCsv(readFileSync(join(FUENTE_DIR, "mtpe_univ_mejor_pagadas_2022.csv"), "utf8"));
  const suneduRaw = parseCsv(readFileSync(join(FUENTE_DIR, "sunedu_pregrado_programa_universidad.csv"), "utf8"));

  // Filtrar estrictamente publicables === "si"
  const fichas = fichasRaw.filter((f) => f.enaho_publicable === "si");
  if (fichas.length !== 38) {
    throw new Error(`Se esperaban 38 fichas publicables, se encontraron ${fichas.length}`);
  }
  for (const f of fichas) {
    if (SLUGS_RESERVADOS.has(f.slug)) {
      throw new Error(`Slug reservado detectado en fichas_publicables_pe.csv: ${f.slug}`);
    }
  }

  // Índices de cruce
  const pocMap = new Map(pocRaw.map((r) => [`${r.tipo}|${r.codigo_inei_3dig}`, r]));
  const enahoMap = new Map(
    enahoRaw.map((r) => [`${r.tipo === "universitaria" ? "universitaria" : "tecnica"}|${r.grupo3}`, r]),
  );
  const m22ByCode = new Map(m22Raw.map((r) => [r.grupo3, r]));

  // Pre-indexar MTPE por tipo y familia normalizada
  const mtpeByTipoFam = new Map();
  for (const r of mtpeRaw) {
    const k = `${r.tipo}|${norm(r.familia)}`;
    if (!mtpeByTipoFam.has(k)) mtpeByTipoFam.set(k, []);
    mtpeByTipoFam.get(k).push(r);
  }

  // Pre-indexar SUNEDU normalizado
  const suneduNorm = suneduRaw.map((r) => ({
    codigoEntidad: r.CODIGO_ENTIDAD.trim(),
    nombre: r.NOMBRE.trim(),
    tipoGestion: titleCaseEs(r.TIPO_GESTION.trim()),
    departamento: titleCaseEs(r.DEPARTAMENTO_LOCAL.trim() || r.DEPARTAMENTO_FILIAL.trim()),
    codigoFilial: r.CODIGO_FILIAL.trim(),
    denomNorm: norm(r.DENOMINACION_PROGRAMA),
  }));

  function extraerUniversidadesSunedu(codigoInei) {
    const rx = SUNEDU_RX[codigoInei];
    if (!rx) return [];
    const byEntidad = new Map();
    for (const row of suneduNorm) {
      if (!rx.test(row.denomNorm)) continue;
      const existing = byEntidad.get(row.codigoEntidad);
      if (!existing || (existing.codigoFilial !== "S" && row.codigoFilial === "S")) {
        byEntidad.set(row.codigoEntidad, row);
      }
    }
    return [...byEntidad.values()]
      .map(({ codigoEntidad, nombre, tipoGestion, departamento }) => ({
        codigoEntidad,
        nombre,
        tipoGestion,
        departamento,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }

  // Mapa de hermanas por codigoInei -> { universitaria: slug, tecnica: slug }
  const hermanasMap = new Map();
  for (const f of fichas) {
    if (!CODIGOS_HERMANA.has(f.codigo_inei_3dig)) continue;
    if (!hermanasMap.has(f.codigo_inei_3dig)) hermanasMap.set(f.codigo_inei_3dig, {});
    hermanasMap.get(f.codigo_inei_3dig)[f.tipo] = f.slug;
  }

  const carreras = fichas.map((f) => {
    const key = `${f.tipo}|${f.codigo_inei_3dig}`;
    const poc = pocMap.get(key);
    const enaho = enahoMap.get(key);
    if (!poc || !enaho) {
      throw new Error(`Falta cruce POC/ENAHO para ${key} (${f.slug})`);
    }
    if (enaho.publicable !== "si") {
      throw new Error(`Fila no publicable en ENAHO: ${key}`);
    }

    // MTPE
    let mtpeFamNorm = null;
    let prom2022PubPriv = null;
    if (f.tipo === "universitaria") {
      const m22 = m22ByCode.get(f.codigo_inei_3dig);
      mtpeFamNorm = m22 ? norm(m22.familia_mtpe) : norm(f.carrera_familia);
      prom2022PubPriv = m22 ? intNum(m22.mtpe_prom_18_29_2022) : null;
    } else {
      const famTec = MTPE_TECNICAS_MAP[f.codigo_inei_3dig];
      if (!famTec) throw new Error(`Falta mapeo MTPE técnica para ${f.codigo_inei_3dig}`);
      mtpeFamNorm = norm(famTec);
    }

    const mtpeTipo = f.tipo === "universitaria" ? "universitarias" : "tecnicas";
    const mtpeRows = mtpeByTipoFam.get(`${mtpeTipo}|${mtpeFamNorm}`) ?? [];
    const nacRow = mtpeRows.find((r) => r.archivo_dep === "nacional") ?? null;
    const limaRow = mtpeRows.find((r) => r.archivo_dep === "lima") ?? null;
    const depRows = mtpeRows
      .filter((r) => r.archivo_dep !== "nacional")
      .map((r) => ({
        departamento: r.archivo_dep,
        nombreDepartamento: DEPARTAMENTO_NOMBRES[r.archivo_dep] ?? titleCaseEs(r.archivo_dep.replace(/-/g, " ")),
        promedio: intNum(r.promedio),
        p10: intNum(r.p10),
        p90: intNum(r.p90),
      }))
      .filter((d) => d.promedio !== null)
      .sort((a, b) => b.promedio - a.promedio)
      .slice(0, 5);

    // EDO 2026
    const edoPuestos =
      f.tipo === "universitaria" ? intNum(poc.edo2026_puestos_univ) : intNum(poc.edo2026_puestos_prof_tecnico);
    const edo2026 =
      poc.edo2026_familia && edoPuestos !== null ? { familia: poc.edo2026_familia, puestos: edoPuestos } : null;

    // SUNEDU (solo universitarias)
    let sunedu = null;
    if (f.tipo === "universitaria") {
      const universidades = extraerUniversidadesSunedu(f.codigo_inei_3dig);
      const pocCount = intNum(poc.sunedu_univ_licenciadas_que_la_ofrecen);
      if (pocCount !== null && universidades.length !== pocCount) {
        throw new Error(
          `Conteo SUNEDU distinto para ${f.codigo_inei_3dig}: script=${universidades.length} vs poc=${pocCount}`,
        );
      }
      sunedu = {
        totalUniversidades: universidades.length,
        universidades,
      };
    }

    // Hermana
    const par = hermanasMap.get(f.codigo_inei_3dig);
    const slugHermana = par ? (f.tipo === "universitaria" ? par.tecnica ?? null : par.universitaria ?? null) : null;

    return {
      slug: f.slug,
      tipo: f.tipo,
      codigoInei: f.codigo_inei_3dig,
      nombre: f.carrera_familia,
      rankNivel: 0,
      rankGeneral: 0,
      slugHermana,
      enaho: {
        nMuestra: intNum(enaho.n_muestra),
        nConIngreso: intNum(enaho.n_con_ingreso),
        mediana: intNum(enaho.ingreso_mediano),
        p25: intNum(enaho.p25),
        p75: intNum(enaho.p75),
        ic90Low: intNum(enaho.ic90_bajo),
        ic90High: intNum(enaho.ic90_alto),
        cvMediana: num(enaho.cv_mediana),
        pctOcupados: num(enaho.pct_ocupados),
        pctPension: num(enaho.pct_afiliado_pension),
        pctOcupProfTec: num(enaho.pct_ocup_profesional_tecnica),
      },
      mtpe: {
        nacional: nacRow ? intNum(nacRow.promedio) : null,
        p10: nacRow ? intNum(nacRow.p10) : null,
        p90: nacRow ? intNum(nacRow.p90) : null,
        rankNacional: nacRow ? intNum(nacRow.rank) : null,
        lima: limaRow ? intNum(limaRow.promedio) : null,
        prom2022PubPriv,
        topDepartamentos: depRows,
      },
      edo2026,
      sunedu,
    };
  });

  // Calcular rankNivel y rankGeneral
  const univs = carreras.filter((c) => c.tipo === "universitaria").sort((a, b) => b.enaho.mediana - a.enaho.mediana);
  const tecs = carreras.filter((c) => c.tipo === "tecnica").sort((a, b) => b.enaho.mediana - a.enaho.mediana);
  univs.forEach((c, idx) => {
    c.rankNivel = idx + 1;
  });
  tecs.forEach((c, idx) => {
    c.rankNivel = idx + 1;
  });
  const todasOrdenadas = [...carreras].sort((a, b) => b.enaho.mediana - a.enaho.mediana);
  todasOrdenadas.forEach((c, idx) => {
    c.rankGeneral = idx + 1;
  });

  const carrerasFinales = [...univs, ...tecs];
  const mayor = todasOrdenadas[0];

  const payload = {
    meta: {
      edicion: "2026",
      fechaCorte: "2026-11-25",
      unidad: "S/ mensuales (soles de 2024 deflactados con IPC de Lima Metropolitana BCRP)",
      periodoEnaho: "2022-2024 (pool 3 años, egresados completos 25-40 años)",
      periodoMtpe: "Noviembre 2022 - octubre 2023 (jóvenes 18-29 dependientes formales privados); 2022 (público + privado)",
      corteSunedu: "2024-08-28",
      fuentes: [
        {
          id: "inei-enaho",
          nombre: "INEI ENAHO 2022-2024 (módulos 300 y 500, códigos 784/906/966)",
          url: "https://proyectos.inei.gob.pe/microdatos/",
        },
        {
          id: "mtpe-disel-2023",
          nombre: "MTPE-DISEL Planilla Electrónica nov-2022 a oct-2023 (pub. 5207826)",
          url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/5207826",
        },
        {
          id: "mtpe-disel-2022",
          nombre: "MTPE-DISEL Planilla Electrónica 2022 público + privado (pub. 4882782)",
          url: "https://www.gob.pe/institucion/mtpe/informes-publicaciones/4882782",
        },
        {
          id: "mtpe-edo-2026",
          nombre: "MTPE Encuesta de Demanda Ocupacional (EDO) 2026 (informe Perú 26-01-2026, Gráf. 27-28)",
          url: "https://www.gob.pe/mtpe",
        },
        {
          id: "sunedu",
          nombre: "SUNEDU Programas Académicos (datos abiertos, corte 28-08-2024)",
          url: "https://www.datosabiertos.gob.pe/",
        },
        {
          id: "bcrp-ipc",
          nombre: "BCRP IPC Lima Metropolitana (serie PN01271PM)",
          url: "https://estadisticas.bcrp.gob.pe/estadisticas/series/mensuales/resultados/PN01271PM",
        },
      ],
    },
    resumen: {
      totalFichas: carrerasFinales.length,
      totalUniversitarias: univs.length,
      totalTecnicas: tecs.length,
      mayorMediana: {
        slug: mayor.slug,
        nombre: mayor.nombre,
        tipo: mayor.tipo,
        mediana: mayor.enaho.mediana,
      },
      medianaUniversitaria: medianOf(univs.map((c) => c.enaho.mediana)),
      medianaTecnica: medianOf(tecs.map((c) => c.enaho.mediana)),
    },
    carreras: carrerasFinales,
  };

  // Validaciones estrictas antes de escribir
  const rxBan1 = new RegExp("emplea" + "bilidad", "i");
  const rxBan2 = new RegExp("enaho_pct_" + "desempleo|pct_" + "desempleo", "i");
  const jsonText = JSON.stringify(payload, null, 2) + "\n";
  if (rxBan1.test(jsonText)) {
    throw new Error("Palabra prohibida detectada en JSON");
  }
  if (rxBan2.test(jsonText)) {
    throw new Error("Campo prohibido detectado en JSON");
  }

  const controles = [
    { codigo: "511", tipo: "universitaria", mediana: 2881, n: 391, cv: 6.0 },
    { codigo: "342", tipo: "universitaria", mediana: 2163, n: 851 },
    { codigo: "351", tipo: "universitaria", mediana: 2654, n: 731 },
    { codigo: "711", tipo: "universitaria", mediana: 5244, n: 175 },
  ];
  for (const ctrl of controles) {
    const found = carrerasFinales.find((c) => c.codigoInei === ctrl.codigo && c.tipo === ctrl.tipo);
    if (!found) throw new Error(`Control faltante: ${ctrl.tipo} ${ctrl.codigo}`);
    if (found.enaho.mediana !== ctrl.mediana || found.enaho.nConIngreso !== ctrl.n) {
      throw new Error(
        `Control ${ctrl.codigo} no coincide: mediana=${found.enaho.mediana} (esp ${ctrl.mediana}), n=${found.enaho.nConIngreso} (esp ${ctrl.n})`,
      );
    }
    if (ctrl.cv !== undefined && found.enaho.cvMediana !== ctrl.cv) {
      throw new Error(`Control ${ctrl.codigo} cv=${found.enaho.cvMediana} (esp ${ctrl.cv})`);
    }
  }

  mkdirSync(dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, jsonText, "utf8");

  // CSV público (UTF-8 BOM, 38 filas, con atribución/fuentes al pie)
  const csvHeaders = [
    "slug",
    "tipo",
    "codigo_inei_3dig",
    "carrera_familia",
    "rank_nivel",
    "rank_general",
    "slug_hermana",
    "enaho_n_muestra",
    "enaho_n_con_ingreso",
    "enaho_ingreso_mediano_25_40_soles",
    "enaho_p25_soles",
    "enaho_p75_soles",
    "enaho_ic90_bajo_soles",
    "enaho_ic90_alto_soles",
    "enaho_cv_mediana_pct",
    "enaho_pct_ocupados",
    "enaho_pct_afiliado_pension",
    "enaho_pct_ocup_nivel_prof_tec",
    "mtpe_sueldo_nacional_nov22_oct23",
    "mtpe_p10_nacional",
    "mtpe_p90_nacional",
    "mtpe_rank_nacional",
    "mtpe_sueldo_lima_nov22_oct23",
    "mtpe_sueldo_2022_pub_priv",
    "edo2026_familia",
    "edo2026_puestos",
    "sunedu_universidades_licenciadas",
  ];

  const csvRows = [csvHeaders.join(",")];
  for (const c of carrerasFinales) {
    csvRows.push(
      [
        c.slug,
        c.tipo,
        c.codigoInei,
        c.nombre,
        c.rankNivel,
        c.rankGeneral,
        c.slugHermana ?? "",
        c.enaho.nMuestra,
        c.enaho.nConIngreso,
        c.enaho.mediana,
        c.enaho.p25,
        c.enaho.p75,
        c.enaho.ic90Low,
        c.enaho.ic90High,
        c.enaho.cvMediana,
        c.enaho.pctOcupados,
        c.enaho.pctPension,
        c.enaho.pctOcupProfTec,
        c.mtpe.nacional ?? "",
        c.mtpe.p10 ?? "",
        c.mtpe.p90 ?? "",
        c.mtpe.rankNacional ?? "",
        c.mtpe.lima ?? "",
        c.mtpe.prom2022PubPriv ?? "",
        c.edo2026?.familia ?? "",
        c.edo2026?.puestos ?? "",
        c.sunedu?.totalUniversidades ?? "",
      ]
        .map(csvCell)
        .join(","),
    );
  }
  // Pie de atribución y fuentes oficiales
  csvRows.push("");
  csvRows.push(csvCell("# ProgramBI Perú — Datos de Carreras (edición 2026, corte 2026-11-25)"));
  csvRows.push(
    csvCell(
      "# Fuente ENAHO: INEI ENAHO 2022-2024 (mód. 300 y 500, códigos 784/906/966), egresados completos 25-40 años, S/ de 2024 deflactados con IPC Lima BCRP (PN01271PM).",
    ),
  );
  csvRows.push(
    csvCell(
      "# Fuente MTPE: MTPE-DISEL Planilla Electrónica nov-2022 a oct-2023 (gob.pe pub. 5207826) y 2022 pub+priv (pub. 4882782), jóvenes 18-29 años.",
    ),
  );
  csvRows.push(
    csvCell(
      "# Fuente EDO y SUNEDU: MTPE EDO 2026 (informe Perú 26-01-2026, Gráf. 27-28); SUNEDU Programas Académicos (corte 28-08-2024).",
    ),
  );

  const csvText = "\uFEFF" + csvRows.join("\r\n") + "\r\n";
  if (rxBan1.test(csvText) || rxBan2.test(csvText)) {
    throw new Error("Término prohibido detectado en CSV");
  }

  mkdirSync(dirname(OUT_CSV), { recursive: true });
  writeFileSync(OUT_CSV, csvText, "utf8");

  console.log(
    `OK: ${carrerasFinales.length} carreras (${univs.length} univ + ${tecs.length} tec) -> ${OUT_JSON} y ${OUT_CSV}`,
  );
}

main();
