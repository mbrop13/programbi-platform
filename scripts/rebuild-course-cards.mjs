/**
 * Rebuild *-card.webp from the local 1600px JPEGs at webp q80.
 * The previous pass (960px / q62) looked too soft on retina.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "courses");

for (const name of await readdir(dir)) {
  if (!name.endsWith(".jpg")) continue;
  const slug = name.slice(0, -4);
  const dest = path.join(dir, `${slug}-card.webp`);
  const info = await sharp(path.join(dir, name))
    .resize({ width: 1600, height: 1000, fit: "cover", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(dest);
  console.log(
    `${slug}-card.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)} KB`
  );
}
