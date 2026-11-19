import { mkdtemp, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

// BCN, Regiones: 16 regiones más la entidad separada «Zona sin demarcar».
// El recorte excluye islas oceánicas alejadas, como Rapa Nui y Juan Fernández.
const source =
  "https://www.bcn.cl/obtienearchivo?id=repositorio/10221/10398/2/Regiones.zip";
const slugs = {
  15: "arica-y-parinacota",
  1: "tarapaca",
  2: "antofagasta",
  3: "atacama",
  4: "coquimbo",
  5: "valparaiso",
  13: "metropolitana",
  6: "ohiggins",
  7: "maule",
  16: "nuble",
  8: "biobio",
  9: "araucania",
  14: "los-rios",
  10: "los-lagos",
  11: "aysen",
  12: "magallanes",
};
const dir = await mkdtemp(join(tmpdir(), "programbi-mapa-"));
function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0)
    throw new Error(`${command} terminó con código ${result.status}`);
}
try {
  const input = process.argv[2];
  let shape;
  if (input) shape = resolve(input);
  else {
    const response = await fetch(source, {
      headers: { "User-Agent": "ProgramBI cartografia/1.0" },
      signal: AbortSignal.timeout(120000),
    });
    if (!response.ok) throw new Error(`BCN respondió ${response.status}`);
    const zip = join(dir, "regiones.zip");
    await writeFile(zip, Buffer.from(await response.arrayBuffer()));
    run("tar", ["-xf", zip, "-C", dir]);
    shape = join(dir, "Regional.shp");
  }
  const svgPath = join(dir, "mapa.svg");
  const quote = (s) => (process.platform === "win32" ? `"${s}"` : s);
  run(process.platform === "win32" ? "npx.cmd" : "npx", [
    "--yes",
    "mapshaper@0.6.113",
    quote(shape),
    "-filter",
    quote("codregion > 0"),
    "-clip",
    "bbox=-8500000,-7555000,-7390000,-1970000",
    "-simplify",
    "0.05%",
    "keep-shapes",
    "-o",
    quote(svgPath),
    "format=svg",
    "id-field=codregion",
    "precision=0.1",
    "width=400",
  ]);
  const raw = await readFile(svgPath, "utf8");
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1];
  const paths = {};
  for (const match of raw.matchAll(
    /<path\s+d="([^"]+)"[^>]*\sid="(\d+)"\s*\/>/g,
  )) {
    const slug = slugs[match[2]];
    if (!slug || paths[slug])
      throw new Error(`Código de región inesperado o repetido: ${match[2]}`);
    paths[slug] = match[1];
  }
  if (!viewBox || Object.keys(paths).length !== 16)
    throw new Error(
      `Se esperaban 16 regiones; se obtuvieron ${Object.keys(paths).length}`,
    );
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><title>Regiones de Chile — cartografía BCN simplificada</title>${Object.entries(
    paths,
  )
    .map(([id, d]) => `<path id="${id}" d="${d}" fill-rule="evenodd"/>`)
    .join("")}</svg>`;
  if (Buffer.byteLength(svg) >= 60000) throw new Error("El SVG excede 60 KB");
  await mkdir("public/datos/desempleo", { recursive: true });
  await mkdir("components/datos", { recursive: true });
  await writeFile("public/datos/desempleo/mapa-chile.svg", svg + "\n");
  await writeFile(
    "components/datos/mapa-paths.json",
    JSON.stringify({ viewBox, paths }) + "\n",
  );
  console.log(
    `16 regiones; SVG ${Buffer.byteLength(svg)} bytes. Fuente: ${source}`,
  );
} finally {
  await rm(dir, { recursive: true, force: true });
}
