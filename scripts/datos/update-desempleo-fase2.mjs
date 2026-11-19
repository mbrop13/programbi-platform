import ExcelJS from "exceljs";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import path from "node:path";

const base =
  "https://www.ine.gob.cl/docs/default-source/ocupacion-y-desocupacion/cuadros-estadisticos/series-vigentes/";
const license = "https://creativecommons.org/licenses/by-sa/4.0/";
const sources = {
  sexo: base + "indicadores_principales_reg_sex.xlsx",
  edad: base + "indicadores_principales_edad.xlsx",
  rama: base + "rama.xlsx",
  estacional: base + "ajuste_estacional.xlsx",
  duracion: base + "duracion_des_edad.xlsx",
  nini: base + "no_estudian_no_ocupadas.xlsx",
  informalidad:
    "https://www.ine.gob.cl/docs/default-source/informalidad-y-condiciones-laborales/cuadros-estadisticos/proyecciones_censo_2017/informalidad_tasas.xlsx",
};
const normal = (x) =>
  String(x ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
const plain = (x) =>
  x && typeof x === "object"
    ? (x.result ?? x.text ?? x.richText?.map((v) => v.text).join(""))
    : x;
const months = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
const catalog = JSON.parse(
  await readFile("lib/datos/regiones-catalogo.json", "utf8"),
);
const territories = [{ slug: "nacional", hoja: "AS" }, ...catalog];
const ages = ["15-24", "25-34", "35-44", "45-54", "55-64", "65-Más"];
const indicators = {
  tasa: "tasa de desocupacion",
  tasa_ocup: "tasa de ocupacion",
  tasa_part: "tasa de participacion",
  ft: "fuerza de trabajo",
  ocu: "poblacion ocupada (total)",
  des: "poblacion desocupada (total)",
};
async function load(name, url) {
  let bytes, error;
  for (let attempt = 1; attempt <= 3; attempt++)
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "ProgramBI Observatorio de datos (https://www.programbi.com)",
        },
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) throw Error(`HTTP ${res.status}`);
      bytes = Buffer.from(await res.arrayBuffer());
      if (bytes.length < 10000) throw Error("XLSX incompleto");
      break;
    } catch (e) {
      error = e;
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 2000));
    }
  if (!bytes) throw Error(`${name}: ${error}`);
  await mkdir("data/desempleo/raw", { recursive: true });
  await writeFile(`data/desempleo/raw/${name}.xlsx`, bytes);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(bytes);
  const index = workbook.getWorksheet("índice");
  if (!index) throw Error(`${name}: falta índice`);
  let fecha;
  index.eachRow((r) =>
    r.eachCell((c) => {
      const m = String(plain(c.value)).match(
        /Fecha de actualización:\s*(\d{2}-\d{2}-\d{4})/i,
      );
      if (m) fecha = m[1];
    }),
  );
  if (!fecha) throw Error(`${name}: falta fecha de actualización`);
  return {
    workbook,
    fuente: {
      nombre: `INE, ENE: ${name}`,
      url,
      licencia: license,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      fecha_actualizacion: fecha,
    },
  };
}
function parse(sheet, specs, direct = false) {
  if (!sheet) throw Error("Falta hoja");
  let header;
  sheet.eachRow((r, n) => {
    if (!header && r.values.some((v) => normal(plain(v)) === "trimestre"))
      header = n;
  });
  if (!header) throw Error(`${sheet.name}: falta encabezado`);
  const h = sheet.getRow(header),
    unit = sheet.getRow(header + 1),
    columns = {};
  for (const [key, term] of Object.entries(specs)) {
    const found = [];
    h.eachCell((c, i) => {
      if (normal(plain(c.value)).startsWith(term)) found.push(i);
    });
    const col = found.find(
      (i) => direct || normal(plain(unit.getCell(i).value)) !== "nota",
    );
    if (!col) throw Error(`${sheet.name}: falta ${term}`);
    columns[key] = col;
  }
  const result = [];
  sheet.eachRow((row) => {
    const y = plain(row.getCell(1).value);
    if (typeof y !== "number" || y < 2010 || y > 2100) return;
    const first = months.indexOf(
      normal(plain(row.getCell(2).value)).slice(0, 3),
    );
    if (first < 0) throw Error(`${sheet.name}: trimestre inválido`);
    const p = `${y}-${String(((first + 1) % 12) + 1).padStart(2, "0")}`,
      valores = {},
      notas = {};
    for (const [k, c] of Object.entries(columns)) {
      const v = plain(row.getCell(c).value);
      if (typeof v === "number" && Number.isFinite(v)) {
        if (v < 0) throw Error(`${sheet.name} ${p}: valor negativo ${k}`);
        if (
          (k === "tasa" ||
            k === "tasa_ocup" ||
            k === "tasa_part" ||
            k === "hombres" ||
            k === "mujeres") &&
          v > 100 &&
          (direct || (sheet.name === "AS" && specs.tasa?.includes("informal")))
        )
          throw Error(`${sheet.name}: tasa inválida`);
        valores[k] = v;
        const note = normal(plain(row.getCell(c - 1).value));
        if (!direct && ["a", "b"].includes(note)) notas[k] = note;
      } else if (
        v !== null &&
        v !== undefined &&
        v !== "" &&
        v !== "-" &&
        v !== "..."
      )
        throw Error(`${sheet.name} ${p} ${k}: valor inesperado ${v}`);
    }
    result.push({ p, valores, notas });
  });
  result.sort((a, b) => a.p.localeCompare(b.p));
  if (!result.length) throw Error(`${sheet.name}: sin datos`);
  for (let i = 1; i < result.length; i++) {
    const [y, m] = result[i - 1].p.split("-").map(Number);
    const next = `${y + (m === 12 ? 1 : 0)}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}`;
    if (result[i].p !== next)
      throw Error(`${sheet.name}: hueco o duplicado ${next}`);
  }
  return result;
}
function sectorSpecs(sheet) {
  const h = sheet.getRow(6),
    u = sheet.getRow(7),
    specs = {},
    labels = {};
  h.eachCell((c, i) => {
    const title = String(plain(c.value) ?? "").trim();
    if (i < 3 || normal(plain(u.getCell(i).value)) === "nota" || !title) return;
    const key = normal(title)
      .replace(/\s*\[\d+\]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
    if (specs[key]) throw Error(`Rama duplicada: ${key}`);
    specs[key] = normal(title);
    labels[key] = title;
  });
  return { specs, labels };
}
export async function updatePhase2() {
  const loaded = {};
  for (const [name, url] of Object.entries(sources))
    loaded[name] = await load(name, url);
  const out = {};
  for (const [name, l] of Object.entries(loaded))
    out[name] = { fuente: l.fuente, series: {} };
  for (const t of territories) {
    for (const [code, sex] of [
      ["H", "hombres"],
      ["M", "mujeres"],
    ])
      out.sexo.series[`${t.slug}:${sex}`] = parse(
        loaded.sexo.workbook.getWorksheet(
          t.slug === "nacional" ? code : `${code}_${t.hoja}`,
        ),
        indicators,
      );
    const si = loaded.informalidad.workbook.getWorksheet(t.hoja);
    out.informalidad.series[t.slug] = parse(si, {
      tasa: "ambos sexos tasa de ocupacion informal",
      hombres: "hombres tasa de ocupacion informal",
      mujeres: "mujeres tasa de ocupacion informal",
    });
    const sr = loaded.rama.workbook.getWorksheet(t.hoja),
      { specs, labels } = sectorSpecs(sr);
    out.rama.indicadores = labels;
    out.rama.series[t.slug] = parse(sr, specs);
  }
  for (const age of ages) {
    const key = age === "65-Más" ? "65-mas" : age;
    out.edad.series[key] = parse(
      loaded.edad.workbook.getWorksheet(age),
      indicators,
    );
    out.duracion.series[key] = parse(
      loaded.duracion.workbook.getWorksheet(age),
      {
        tasa_larga: "tasa de desocupacion de larga duracion",
        proporcion_larga: "proporcion de desocupados de larga duracion",
        promedio_meses: "promedio de busqueda de una ocupacion",
        des: "poblacion desocupada (total)",
      },
    );
  }
  for (const [key, term] of [
    ["15-24", "total"],
    ["15-19", "entre 15 y 19 anos de edad"],
    ["20-24", "entre 20 y 24 anos de edad"],
  ])
    out.nini.series[key] = parse(loaded.nini.workbook.getWorksheet("tramo"), {
      total: `${term} (ambos sexos)`,
      hombres: `${term} (hombres)`,
      mujeres: `${term} (mujeres)`,
    });
  out.estacional.series.nacional = parse(
    loaded.estacional.workbook.getWorksheet("tasa_as"),
    { tasa: "tasa ajustada" },
    true,
  );
  // Validate each publication independently; INE sources may have different release dates.
  for (const [name, data] of Object.entries(out)) {
    const all = Object.values(data.series),
      end = all[0].at(-1).p;
    for (const rows of all) {
      if (rows.at(-1).p !== end)
        throw Error(`${name}: periodos finales distintos`);
      for (const row of rows)
        for (const [key, value] of Object.entries(row.valores)) {
          if (
            (key.startsWith("tasa") ||
              key === "proporcion_larga" ||
              (name === "informalidad" &&
                ["hombres", "mujeres"].includes(key))) &&
            value > 100
          )
            throw Error(`${name} ${row.p}: tasa fuera de rango`);
        }
    }
    try {
      const old = JSON.parse(
        await readFile(`data/desempleo/${name}.json`, "utf8"),
      );
      for (const [key, rows] of Object.entries(data.series))
        if (old.series?.[key]?.at(-1)?.p > rows.at(-1).p)
          throw Error(`${name} ${key}: periodo retrocede`);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
  }
  for (const name of ["sexo", "edad"])
    for (const rows of Object.values(out[name].series))
      for (const { p, valores: v } of rows) {
        if (
          !["tasa", "ft", "ocu", "des"].every(
            (k) => typeof v[k] === "number",
          ) ||
          Math.abs(v.ft - v.ocu - v.des) > 0.5 ||
          Math.abs(v.tasa - (v.des / v.ft) * 100) > 0.05
        )
          throw Error(`${name} ${p}: identidad laboral inválida`);
      }
  const periodo = out.rama.series.nacional.at(-1).p;
  const periodo_anterior = `${Number(periodo.slice(0, 4)) - 1}-${periodo.slice(5)}`;
  const variaciones = {
    fuente: out.rama.fuente,
    periodo,
    periodo_anterior,
    territorios: {},
  };
  for (const [territorio, rows] of Object.entries(out.rama.series)) {
    const actual = rows.at(-1),
      anterior = rows.find((row) => row.p === periodo_anterior);
    if (!anterior)
      throw Error(
        `rama ${territorio}: falta período interanual ${periodo_anterior}`,
      );
    variaciones.territorios[territorio] = Object.entries(actual.valores)
      .filter(
        ([sector]) =>
          sector !== "poblacion_ocupada_total" &&
          typeof anterior.valores[sector] === "number",
      )
      .map(([sector, valor]) => ({
        sector,
        nombre: out.rama.indicadores[sector],
        actual: valor,
        anterior: anterior.valores[sector],
        variacion: valor - anterior.valores[sector],
        ...(actual.notas[sector] ? { nota_actual: actual.notas[sector] } : {}),
        ...(anterior.notas[sector]
          ? { nota_anterior: anterior.notas[sector] }
          : {}),
      }));
  }
  const files = new Map();
  for (const [name, data] of Object.entries(out))
    for (const root of ["data/desempleo", "public/datos/desempleo"])
      files.set(`${root}/${name}.json`, JSON.stringify(data, null, 2) + "\n");
  for (const root of ["data/desempleo", "public/datos/desempleo"])
    files.set(
      `${root}/ramas-yoy.json`,
      JSON.stringify(variaciones, null, 2) + "\n",
    );
  const csv = [
    "# Fuente: INE, Encuesta Nacional de Empleo; actualización " +
      out.nini.fuente.fecha_actualizacion,
    "# Transformación: ProgramBI; INE no respalda esta visualización",
    "# Licencia CC BY-SA 4.0: " + license,
    "periodo;tramo;total_miles;hombres_miles;mujeres_miles;nota_total;nota_hombres;nota_mujeres",
  ];
  for (const [age, rows] of Object.entries(out.nini.series))
    for (const r of rows)
      csv.push(
        [
          r.p,
          age,
          ...["total", "hombres", "mujeres"].map((k) =>
            String(r.valores[k] ?? "").replace(".", ","),
          ),
          ...["total", "hombres", "mujeres"].map((k) => r.notas[k] ?? ""),
        ].join(";"),
      );
  files.set(
    "public/datos/desempleo/csv/jovenes.csv",
    "\ufeff" + csv.join("\r\n") + "\r\n",
  );
  for (const [p, content] of files) {
    await mkdir(path.dirname(p), { recursive: true });
    await writeFile(`${p}.tmp`, content);
  }
  for (const p of files.keys()) await rename(`${p}.tmp`, p);
  console.log(
    "Fase 2: " +
      Object.entries(out)
        .map(([k, v]) => `${k} ${v.fuente.fecha_actualizacion}`)
        .join("; "),
  );
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve("scripts/datos/update-desempleo-fase2.mjs")
)
  await updatePhase2();
