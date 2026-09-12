/**
 * One-off: download course covers and write compressed JPEGs for next/image.
 * Source hosts (mail.programbi.com) reject HEAD, so the app previously served raw 2MB files.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "courses");

const IMAGES = [
  [
    "analisis-de-datos",
    "https://mail.programbi.com/uploads/diseña_una_imagen_similar_a_202605311714.jpeg",
  ],
  ["copilot", "https://mail.programbi.com/uploads/Copilot.jpeg"],
  ["power-automate", "https://mail.programbi.com/uploads/Power-automate.jpeg"],
  [
    "analitica-mineria",
    "https://mail.programbi.com/uploads/bien_pero_que_solo_tengan_202605311720.jpeg",
  ],
  [
    "ia-productividad",
    "https://mail.programbi.com/uploads/ahora_que_se_vea_dede_202605311728.jpeg",
  ],
  [
    "power-bi",
    "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Tamano_personalizado_1_9d2f2efd-3f0e-40d7-a62b-fb7a0ba08d83.png?v=1720500191",
  ],
  ["python", "https://mail.programbi.com/uploads/Python.jpeg"],
  ["sql-server", "https://mail.programbi.com/uploads/sql-server-(2).jpeg"],
  [
    "excel",
    "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Image_202511180217.png?v=1763443093",
  ],
  [
    "analitica-financiera",
    "https://mail.programbi.com/uploads/has_que_se_vean_varias_202605311731.jpeg",
  ],
  [
    "machine-learning",
    "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-f5cacc2d-9ca1-4d23-8361-fb8a615a8943.png?v=1739059469",
  ],
];

await mkdir(outDir, { recursive: true });

for (const [slug, url] of IMAGES) {
  const res = await fetch(url, {
    headers: { "User-Agent": "ProgramBI-image-optimizer/1.0" },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`${slug}: HTTP ${res.status} ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = path.join(outDir, `${slug}.jpg`);
  const destWebp = path.join(outDir, `${slug}.webp`);
  const pipeline = sharp(buf)
    .rotate()
    .resize({ width: 1600, height: 1000, fit: "cover", withoutEnlargement: true });
  await pipeline.clone().jpeg({ quality: 78, mozjpeg: true, chromaSubsampling: "4:2:0" }).toFile(dest);
  await pipeline
    .clone()
    .resize({ width: 1200, height: 750, fit: "cover", withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(destWebp);
  const out = await sharp(dest).metadata();
  const webp = await sharp(destWebp).metadata();
  console.log(
    `${slug}: ${(buf.length / 1024 / 1024).toFixed(2)} MB → ${((out.size ?? 0) / 1024).toFixed(0)} KB jpg / ${((webp.size ?? 0) / 1024).toFixed(0)} KB webp`
  );
}
