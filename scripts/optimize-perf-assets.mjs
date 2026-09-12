/**
 * Compress critical-path images: app icon, nav logo, course covers, company logos.
 * Does not change composition — only dimensions/quality.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function kb(n) {
  return `${(n / 1024).toFixed(1)} KB`;
}

async function rewrite(label, dest, pipeline) {
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  const { rename, unlink, writeFile } = await import("node:fs/promises");
  const tmp = `${dest}.tmp`;
  await writeFile(tmp, data);
  try {
    await unlink(dest);
  } catch {
    /* dest may not exist yet */
  }
  await rename(tmp, dest);
  console.log(`${label}: ${kb(info.size)} (${info.width}x${info.height} ${info.format})`);
}

const iconSrc = path.join(root, "app", "icon.png");
const iconBuf = await sharp(iconSrc).toBuffer();
const iconMeta = await sharp(iconBuf).metadata();
console.log(`icon source: ${kb(iconBuf.length)} (${iconMeta.width}x${iconMeta.height})`);

if ((iconMeta.width ?? 0) > 64) {
  await rewrite(
    "app/icon.png",
    iconSrc,
    sharp(iconBuf).resize(48, 48, { fit: "cover" }).png({ compressionLevel: 9, quality: 90 })
  );
  await rewrite(
    "app/apple-icon.png",
    path.join(root, "app", "apple-icon.png"),
    sharp(iconBuf).resize(180, 180, { fit: "cover" }).png({ compressionLevel: 9, quality: 90 })
  );
} else {
  console.log("icon already small — skip");
}

const logoSrc = path.join(root, "public", "images", "logo.png");
await rewrite(
  "public/images/logo-nav.webp",
  path.join(root, "public", "images", "logo-nav.webp"),
  sharp(logoSrc).resize({ width: 300, height: 80, fit: "inside", withoutEnlargement: true }).webp({
    quality: 78,
    alphaQuality: 80,
  })
);

const courseDir = path.join(root, "public", "images", "courses");
for (const name of await readdir(courseDir)) {
  if (!name.endsWith(".webp")) continue;
  const file = path.join(courseDir, name);
  const buf = await sharp(file).toBuffer();
  await rewrite(
    `courses/${name}`,
    file,
    sharp(buf)
      .resize({ width: 960, height: 600, fit: "cover", withoutEnlargement: true })
      .webp({ quality: 62 })
  );
}

const logosDir = path.join(root, "public", "images", "logos");
for (const name of await readdir(logosDir)) {
  if (!/\.(png|jpe?g|webp)$/i.test(name)) continue;
  const file = path.join(logosDir, name);
  const stem = name.replace(/\.[^.]+$/, "");
  const dest = path.join(logosDir, `${stem}.webp`);
  const buf = await sharp(file).toBuffer();
  await rewrite(
    `logos/${stem}.webp`,
    dest,
    sharp(buf)
      .resize({ width: 240, height: 80, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 70, alphaQuality: 80 })
  );
}
