import ExcelJS from "exceljs";
import { z } from "zod";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const source =
  "https://www.ine.gob.cl/docs/default-source/ocupacion-y-desocupacion/cuadros-estadisticos/series-vigentes/indicadores_principales.xlsx";
const license = "https://creativecommons.org/licenses/by-sa/4.0/";
const raw = path.join(ROOT, "data/desempleo/raw/indicadores_principales.xlsx");
const catalog = JSON.parse(
  await readFile("lib/datos/regiones-catalogo.json", "utf8"),
);
const territories = [
  { slug: "nacional", nombre: "Chile", hoja: "AS", bcch: "10" },
  ...catalog,
];
const normalize = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
const plain = (v) =>
  v && typeof v === "object"
    ? (v.result ??
      v.text ??
      (v.richText ? v.richText.map((x) => x.text).join("") : ""))
    : v;
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
const fail = (msg) => {
  throw new Error(msg);
};
const schema = z.object({
  p: z.string().regex(/^\d{4}-\d{2}$/),
  tasa: z.number().min(0).max(40),
  tasa_ocup: z.number().min(0).max(100),
  tasa_part: z.number().min(0).max(100),
  ft: z.number().positive(),
  ocu: z.number().positive(),
  des: z.number().positive(),
  notas: z.record(z.enum(["a", "b"])),
});
const round = (n) => Math.round((n + Number.EPSILON) * 10000) / 10000;
const label = (p) => {
  const [y, m] = p.split("-").map(Number);
  return `${months[(m + 10) % 12]}–${months[m % 12]} ${y}`;
};
async function download() {
  for (let attempt = 1; attempt <= 3; attempt++)
    try {
      const response = await fetch(source, {
        headers: {
          "User-Agent":
            "ProgramBI Observatorio de datos (https://www.programbi.com)",
        },
        signal: AbortSignal.timeout(60000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 10000) throw new Error("XLSX incompleto");
      await mkdir(path.dirname(raw), { recursive: true });
      await writeFile(raw, bytes);
      return bytes;
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, attempt * 2000));
    }
}
const bytes = await download();
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.load(bytes);
const index = workbook.getWorksheet("índice") ?? fail("Falta hoja índice");
let update;
index.eachRow((row) =>
  row.eachCell((cell) => {
    const m = String(plain(cell.value)).match(
      /Fecha de actualización:\s*(\d{2}-\d{2}-\d{4})/i,
    );
    if (m) update = m[1];
  }),
);
if (!update) fail("No se encontró fecha de actualización INE");
let previous;
try {
  previous = JSON.parse(await readFile("data/desempleo/meta.json", "utf8"));
} catch {}
if (
  previous?.ine_fecha_actualizacion === update &&
  !process.argv.includes("--force")
) {
  console.log(`Sin cambios: INE ${update}`);
  process.exit(0);
}
const series = {};
for (const t of territories) {
  const sheet = workbook.getWorksheet(t.hoja) ?? fail(`Falta hoja ${t.hoja}`);
  let header;
  sheet.eachRow((r, n) => {
    if (
      !header &&
      r.values.some((v) =>
        normalize(plain(v)).startsWith("tasa de desocupacion"),
      )
    )
      header = n;
  });
  if (!header) fail(`Sin encabezados en ${t.hoja}`);
  const h = sheet.getRow(header);
  const find = (name) => {
    let idx;
    h.eachCell((c, i) => {
      if (!idx && normalize(plain(c.value)).startsWith(name)) idx = i;
    });
    if (!idx) fail(`Falta encabezado ${name} en ${t.hoja}`);
    return idx + 1;
  };
  const cols = {
    ft: find("fuerza de trabajo"),
    ocu: find("poblacion ocupada (total)"),
    des: find("poblacion desocupada (total)"),
    tasa: find("tasa de desocupacion"),
    tasa_ocup: find("tasa de ocupacion"),
    tasa_part: find("tasa de participacion"),
  };
  const rows = [];
  sheet.eachRow((row) => {
    const year = plain(row.getCell(1).value);
    if (typeof year !== "number" || year < 2010 || year > 2100) return;
    const period = normalize(plain(row.getCell(2).value));
    const first = months.indexOf(period.slice(0, 3));
    if (first < 0) fail(`Trimestre inválido ${period} ${t.hoja}`);
    const central = (first + 1) % 12;
    const y = year;
    const p = `${y}-${String(central + 1).padStart(2, "0")}`;
    const o = { p, notas: {} };
    for (const [key, col] of Object.entries(cols)) {
      const value = plain(row.getCell(col).value);
      if (typeof value !== "number")
        fail(`Dato faltante ${t.hoja} ${p} ${key}`);
      o[key] = value;
      const note = normalize(plain(row.getCell(col - 1).value));
      if (note === "a" || note === "b") o.notas[key] = note;
    }
    schema.parse(o);
    if (
      Math.abs(o.ft - o.ocu - o.des) > 0.5 ||
      Math.abs(o.tasa - (o.des / o.ft) * 100) > 0.05
    )
      fail(`Inconsistencia FT/tasa ${t.hoja} ${p}`);
    rows.push(o);
  });
  rows.sort((a, b) => a.p.localeCompare(b.p));
  if (rows[0]?.p !== "2010-02")
    fail(`Inicio incorrecto ${t.hoja}: ${rows[0]?.p}`);
  for (let i = 1; i < rows.length; i++) {
    let [y, m] = rows[i - 1].p.split("-").map(Number);
    let expected = `${y + (m === 12 ? 1 : 0)}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}`;
    if (rows[i].p !== expected)
      fail(`Hueco/duplicado ${t.hoja}: ${expected} / ${rows[i].p}`);
  }
  series[t.slug] = rows;
}
const national = series.nacional,
  last = national.at(-1).p;
for (const t of territories)
  if (
    series[t.slug].length !== national.length ||
    series[t.slug].at(-1).p !== last
  )
    fail(`Períodos distintos: ${t.slug}`);
if (previous?.ultimo_periodo?.codigo > last)
  fail("El último período retrocede");
for (let i = 0; i < national.length; i++)
  for (const k of ["ft", "des"]) {
    const sum = catalog.reduce((s, t) => s + series[t.slug][i][k], 0);
    if (Math.abs(sum - national[i][k]) / national[i][k] > 0.001)
      fail(`Suma regional ${k} ${national[i].p}`);
  }
const smoke = national.find((x) => x.p === "2026-08");
if (smoke && Math.abs(smoke.tasa - 9.8026) > 0.01)
  fail(`Prueba de humo 2026-08 falló: ${smoke.tasa}`);
let bcchStatus = "saltado: sin credenciales";
if (
  process.env.BCCH_API_TOKEN ||
  (process.env.BCCH_USER && process.env.BCCH_PASS)
) {
  for (const t of territories) {
    const u = new URL("https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx");
    u.searchParams.set("function", "GetSeries");
    u.searchParams.set("timeseries", `F049.DES.TAS.INE9.${t.bcch}.M`);
    if (process.env.BCCH_API_TOKEN)
      u.searchParams.set("token", process.env.BCCH_API_TOKEN);
    else {
      u.searchParams.set("user", process.env.BCCH_USER);
      u.searchParams.set("pass", process.env.BCCH_PASS);
    }
    u.searchParams.set("firstdate", "2010-01-01");
    u.searchParams.set("lastdate", `${last.slice(0, 4)}-12-31`);
    let res;
    try {
      res = await fetch(u, { signal: AbortSignal.timeout(60000) });
    } catch {
      fail(`No se pudo consultar BCCh: ${t.slug}`);
    }
    if (!res.ok) fail(`BCCh HTTP ${res.status}: ${t.slug}`);
    const body = await res.json();
    const observations = body?.Series?.Obs;
    if (!Array.isArray(observations))
      fail(`Respuesta BCCh inválida: ${t.slug}`);
    const byMonth = new Map(
      observations.map((o) => {
        const m = String(o.indexDateString).match(/^(\d{2})-(\d{2})-(\d{4})$/);
        return m
          ? [`${m[3]}-${m[2]}`, Number(String(o.value).replace(",", "."))]
          : ["", NaN];
      }),
    );
    for (const r of series[t.slug].slice(-24)) {
      const [y, m] = r.p.split("-").map(Number);
      const end = `${y + (m === 12 ? 1 : 0)}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}`;
      const value = byMonth.get(end);
      if (!Number.isFinite(value) || Math.abs(value - r.tasa) > 0.05)
        fail(`Contraste BCCh falló: ${t.slug} ${r.p}`);
    }
  }
  bcchStatus =
    "aprobado: 24 observaciones por territorio; BCCh usa el mes final del trimestre";
}
// Fixed reference points are checked when present, including the published YoY baseline.
for (const [slug, p, expected, tolerance] of [
  ["nacional", "2025-08", 8.53, 0.01],
  ["nuble", "2025-08", 10, 0.05],
  ["nuble", "2026-08", 11.8, 0.05],
  ["metropolitana", "2025-08", 8.8, 0.05],
  ["metropolitana", "2026-08", 10.4, 0.05],
]) {
  const row = series[slug].find((r) => r.p === p);
  if (row && Math.abs(row.tasa - expected) > tolerance)
    fail(`Prueba de referencia falló: ${slug} ${p}`);
}
const revisions = [];
for (const t of territories) {
  let old = [];
  try {
    old = JSON.parse(
      await readFile(
        `data/desempleo/${t.slug === "nacional" ? "nacional" : `regiones/${t.slug}`}.json`,
        "utf8",
      ),
    );
  } catch {}
  const by = new Map(old.map((r) => [r.p, r]));
  for (const r of series[t.slug]) {
    const o = by.get(r.p);
    if (o)
      for (const k of ["tasa", "tasa_ocup", "tasa_part", "ft", "ocu", "des"])
        if (Math.abs(o[k] - r[k]) > 1e-8)
          revisions.push({
            serie: `${t.slug}.${k}`,
            periodo: r.p,
            antes: o[k],
            despues: r[k],
          });
  }
}
const ranking = territories.map((t) => {
  const a = series[t.slug],
    x = a.at(-1),
    prev = a.at(-13),
    same = a.filter((r) => r.p.slice(5) === last.slice(5)),
    prior = same
      .slice(0, -1)
      .filter((r) => r.tasa >= x.tasa)
      .at(-1);
  return {
    slug: t.slug,
    nombre: t.nombre,
    tasa: x.tasa,
    anterior_pp: round(x.tasa - a.at(-2).tasa),
    yoy_pp: round(x.tasa - prev.tasa),
    rank_mismo_trimestre: 1 + same.filter((r) => r.tasa > x.tasa).length,
    anterior_mismo_trimestre: prior ? { p: prior.p, tasa: prior.tasa } : null,
    vs_chile_pp: round(x.tasa - national.at(-1).tasa),
    cinco_anos_pp: a.length > 60 ? round(x.tasa - a.at(-61).tasa) : null,
    maximo: a.reduce((p, c) => (c.tasa > p.tasa ? c : p)),
    minimo: a.reduce((p, c) => (c.tasa < p.tasa ? c : p)),
  };
});
for (const r of ranking)
  if (
    Math.abs(
      r.yoy_pp - (series[r.slug].at(-1).tasa - series[r.slug].at(-13).tasa),
    ) > 0.01
  )
    fail(`YoY inválido ${r.slug}`);
const explorer = {
  periodos: national.map((r) => ({ codigo: r.p, label: label(r.p) })),
  territorios: territories.map((t) => {
    const a = series[t.slug];
    const years = [...new Set(a.map((r) => r.p.slice(0, 4)))];
    return {
      slug: t.slug,
      nombre: t.nombre,
      tasas: a.map((r) => r.tasa),
      notas: a.map((r) => r.notas.tasa ?? null),
      promedios_anuales: years
        .map((y) => ({
          ano: Number(y),
          items: a.filter((r) => r.p.startsWith(y)),
        }))
        .filter((x) => x.items.length === 12)
        .map((x) => ({
          ano: x.ano,
          tasa: round(x.items.reduce((s, r) => s + r.tasa, 0) / 12),
        })),
    };
  }),
};
const meta = {
  version: last,
  fetched_at: new Date().toISOString(),
  ine_fecha_actualizacion: update,
  ultimo_periodo: { codigo: last, label: label(last) },
  fuentes: [
    {
      nombre: "INE, Encuesta Nacional de Empleo",
      url: source,
      licencia: license,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    },
  ],
  revisiones: revisions,
};
const files = new Map();
const json = (p, v) => files.set(p, JSON.stringify(v, null, 2) + "\n");
json("data/desempleo/meta.json", meta);
json("data/desempleo/ranking.json", ranking);
json("public/datos/desempleo/meta.json", meta);
json("public/datos/desempleo/ranking.json", ranking);
files.set("public/datos/desempleo/explorador.json", JSON.stringify(explorer));
for (let i = 0; i < national.length; i++)
  files.set(
    `public/datos/desempleo/diferencias/${national[i].p}.json`,
    JSON.stringify({
      periodo: national[i].p,
      diferencias: Object.fromEntries(
        territories.map((t) => [
          t.slug,
          series[t.slug].map((y) => round(series[t.slug][i].tasa - y.tasa)),
        ]),
      ),
    }),
  );
const out = new ExcelJS.Workbook();
const readme = out.addWorksheet("Léeme");
readme.addRows([
  ["Observatorio de desempleo — ProgramBI"],
  ["Fuente: INE, Encuesta Nacional de Empleo"],
  ["Actualización INE", update],
  ["Fuente", source],
  ["Licencia CC BY-SA 4.0", license],
  ["ProgramBI transformó los datos; INE no respalda esta visualización."],
  [
    "FT: fuerza de trabajo; ocupados y desocupados expresados en miles; tasas en porcentaje.",
  ],
  ["Trimestre móvil identificado por su mes central."],
]);
for (const t of territories) {
  const a = series[t.slug],
    rel = t.slug === "nacional" ? "nacional" : `regiones/${t.slug}`;
  json(`data/desempleo/${rel}.json`, a);
  json(`public/datos/desempleo/${rel}.json`, a);
  const keys = [
    "p",
    "tasa",
    "tasa_ocup",
    "tasa_part",
    "ft",
    "ocu",
    "des",
    "notas",
  ];
  const ws = out.addWorksheet(t.slug.slice(0, 31));
  ws.addRow([
    "Periodo",
    "Tasa desocupación (%)",
    "Tasa ocupación (%)",
    "Tasa participación (%)",
    "Fuerza de trabajo (miles)",
    "Ocupados (miles)",
    "Desocupados (miles)",
    "Notas",
  ]);
  a.forEach((r) =>
    ws.addRow(
      keys.map((k) => (k === "notas" ? JSON.stringify(r.notas) : r[k])),
    ),
  );
  const csv =
    [
      `# Fuente: INE, Encuesta Nacional de Empleo; actualización ${update}`,
      "# Transformación: ProgramBI; INE no respalda esta visualización",
      `# Licencia CC BY-SA 4.0: ${license}`,
      keys.join(";"),
      ...a.map((r) =>
        keys
          .map((k) =>
            k === "notas"
              ? Object.entries(r.notas)
                  .map(([k, v]) => `${k}:${v}`)
                  .join("|")
              : String(r[k]).replace(".", ","),
          )
          .join(";"),
      ),
    ].join("\r\n") + "\r\n";
  files.set(`public/datos/desempleo/csv/${t.slug}.csv`, "\ufeff" + csv);
}
files.set(
  "public/datos/desempleo/desempleo-chile.xlsx",
  Buffer.from(await out.xlsx.writeBuffer()),
);
// All validation precedes publication; stage each file before replacing outputs.
for (const [p, content] of files) {
  await mkdir(path.dirname(p), { recursive: true });
  await writeFile(`${p}.tmp`, content);
}
for (const p of files.keys()) await rename(`${p}.tmp`, p);
const top = ranking
  .filter((r) => r.slug !== "nacional")
  .sort((a, b) => b.tasa - a.tasa);
const summary = `## Actualización ENE ${label(last)}\n\n- Fecha INE: ${update}\n- Chile: ${national.at(-1).tasa.toFixed(2)} %\n- Mayor: ${top
  .slice(0, 3)
  .map((x) => `${x.nombre} ${x.tasa.toFixed(2)} %`)
  .join(", ")}\n- Menor: ${top
  .slice(-3)
  .reverse()
  .map((x) => `${x.nombre} ${x.tasa.toFixed(2)} %`)
  .join(
    ", ",
  )}\n- Revisiones: ${revisions.length}\n- Validaciones: esquema, continuidad, identidad laboral, suma regional, YoY y prueba de humo aprobadas.\n- Contraste BCCh: ${bcchStatus}.\n`;
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY)
  await writeFile(process.env.GITHUB_STEP_SUMMARY, summary, { flag: "a" });
if (process.env.DATOS_SUMMARY_PATH)
  await writeFile(process.env.DATOS_SUMMARY_PATH, summary);
