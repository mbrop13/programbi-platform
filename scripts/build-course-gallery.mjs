/**
 * Genera la galería de "clases reales" para las páginas de curso.
 *
 * Entrada:  "fotos web/*.png" (capturas de clase en vivo, ~1900x1010).
 * Salida:   public/images/courses/galeria/<slug>/NN.webp  (WebP, 1280px de ancho)
 *           + manifest.json con el orden final por curso.
 *
 * Reglas:
 *  - Se deduplica por hash de contenido: la misma captura no se repite
 *    dos veces dentro del mismo curso.
 *  - Se conserva el orden numérico del nombre (1, 2, 3... 10) para que la
 *    galería se lea como una secuencia de clases.
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sourceDir = path.join(root, "fotos web");
const outDir = path.join(root, "public", "images", "courses", "galeria");

/** Prefijo del archivo → slug del curso. */
const GROUPS = [
  { prefix: "Análisis Datos", slug: "analisis-de-datos" },
  { prefix: "Power BI", slug: "power-bi" },
  { prefix: "Python", slug: "python" },
  { prefix: "SQL", slug: "sql-server" },
];

/** Orden canónico de grupos (para el manifest). */
const ORDER = GROUPS.map((g) => g.slug);

function parseIndex(fileName) {
  const m = fileName.match(/(\d+)\.png$/i);
  return m ? Number(m[1]) : 0;
}

const files = (await readdir(sourceDir)).filter((f) => f.toLowerCase().endsWith(".png"));

/** slug → [{ src, index, hash }] */
const buckets = new Map(ORDER.map((slug) => [slug, []]));
const seenGlobal = new Map();

for (const file of files) {
  const group = GROUPS.find((g) => file.startsWith(g.prefix));
  if (!group) {
    console.warn(`· sin grupo: ${file}`);
    continue;
  }
  const buf = await readFile(path.join(sourceDir, file));
  const hash = createHash("sha1").update(buf).digest("hex");
  const bucket = buckets.get(group.slug);
  if (bucket.some((item) => item.hash === hash)) {
    console.log(`· duplicado en ${group.slug}: ${file}`);
    continue;
  }
  bucket.push({ file, index: parseIndex(file), hash, buf });
  seenGlobal.set(hash, file);
}

const manifest = {};

for (const slug of ORDER) {
  const bucket = buckets.get(slug).sort((a, b) => a.index - b.index);
  if (!bucket.length) continue;

  const dir = path.join(outDir, slug);
  await mkdir(dir, { recursive: true });

  const items = [];
  for (let i = 0; i < bucket.length; i += 1) {
    const item = bucket[i];
    const name = `${String(i + 1).padStart(2, "0")}.webp`;
    const dest = path.join(dir, name);
    const out = await sharp(item.buf)
      .rotate()
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(dest);
    items.push({
      src: `/images/courses/galeria/${slug}/${name}`,
      width: out.width,
      height: out.height,
      bytes: out.size,
    });
    console.log(
      `${slug}/${name} ← ${item.file}  ${(item.buf.length / 1024).toFixed(0)}KB → ${(out.size / 1024).toFixed(0)}KB  ${out.width}x${out.height}`
    );
  }
  manifest[slug] = items;
}

await writeFile(path.join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`\nmanifest → ${path.join(outDir, "manifest.json")}`);
