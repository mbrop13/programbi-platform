import ExcelJS from "exceljs";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";

const index = "https://sence.gob.cl/sence/anuarios-2004-2026";
const response = await fetch(index, { signal: AbortSignal.timeout(30000) });
if (!response.ok) throw new Error(`SENCE índice: HTTP ${response.status}`);
const html = await response.text();
const urls = [
  ...html.matchAll(
    /https:\/\/cdn-site\.sence\.gob\.cl\/sites\/default\/files\/a\.01_numero_de_participantes_totales_y_aprobados_distribuidos_segun_regiones_(\d{4})\.xlsx/gi,
  ),
]
  .map((m) => ({ url: m[0], year: Number(m[1]) }))
  .sort((a, b) => b.year - a.year);
if (!urls.length)
  throw new Error("SENCE: no se encontró cuadro A.01 actualizado");
const { url, year } = urls[0];
const source = await fetch(url, { signal: AbortSignal.timeout(30000) });
if (!source.ok) throw new Error(`SENCE cuadro: HTTP ${source.status}`);
const bytes = Buffer.from(await source.arrayBuffer());
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.load(bytes);
const sheet = workbook.worksheets[0];
const names = [
  "ARICA Y PARINACOTA",
  "TARAPACÁ",
  "ANTOFAGASTA",
  "ATACAMA",
  "COQUIMBO",
  "VALPARAÍSO",
  "METROPOLITANA",
  "O'HIGGINS",
  "MAULE",
  "ÑUBLE",
  "BIOBÍO",
  "ARAUCANÍA",
  "LOS RÍOS",
  "LOS LAGOS",
  "AYSÉN",
  "MAGALLANES",
];
const rows = [];
let header;
sheet.eachRow((row) => {
  const cells = row.values;
  if (
    cells.some?.(
      (c) => typeof c === "string" && c.trim() === "TOTAL PARTICIPANTES (1)",
    )
  ) {
    header = {
      region: cells.findIndex((c) => c === "REGIÓN"),
      total: cells.findIndex((c) => c === "TOTAL PARTICIPANTES (1)"),
      approved: cells.findIndex(
        (c) => c === "TOTAL PARTICIPANTES APROBADOS (2)",
      ),
    };
  }
  if (!header) return;
  const region = cells[header.region];
  if (names.includes(region) || region === "TOTAL")
    rows.push({
      region,
      total: cells[header.total],
      aprobados: cells[header.approved],
    });
});
if (
  !header ||
  rows.length !== 17 ||
  new Set(rows.map((r) => r.region)).size !== 17 ||
  rows.some(
    (r) =>
      !Number.isSafeInteger(r.total) ||
      !Number.isSafeInteger(r.aprobados) ||
      r.total <= 0 ||
      r.aprobados < 0 ||
      r.aprobados > r.total,
  )
)
  throw new Error("SENCE: estructura o valores inesperados");
const national = rows.find((r) => r.region === "TOTAL");
const regions = rows.filter((r) => r.region !== "TOTAL");
if (
  regions.reduce((s, r) => s + r.total, 0) !== national.total ||
  regions.reduce((s, r) => s + r.aprobados, 0) !== national.aprobados
)
  throw new Error("SENCE: suma regional no coincide con total");
const path = "data/datos-fase3/sence.json";
try {
  const previous = JSON.parse(await readFile(path, "utf8"));
  if (previous.year > year) throw new Error("SENCE: la edición retrocede");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const output = {
  year,
  source: url,
  index,
  sha256: createHash("sha256").update(bytes).digest("hex"),
  national,
  regions,
  methodology:
    "Acciones liquidadas de capacitación por franquicia tributaria. Una persona se cuenta tantas veces como participa en un curso; no son personas únicas. Aprobados: al menos 75% de asistencia según el cuadro.",
};
await mkdir("data/datos-fase3", { recursive: true });
await writeFile(`${path}.tmp`, JSON.stringify(output, null, 2) + "\n");
await rename(`${path}.tmp`, path);
console.log(
  `SENCE ${year}: ${national.total} participaciones, ${national.aprobados} aprobadas; 16 regiones validadas.`,
);
