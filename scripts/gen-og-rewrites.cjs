/**
 * Genera lib/datos/og-rewrites.json con el puente URL limpia → URL con hash
 * de los opengraph-image de /datos.
 *
 * Next 16 sirve los file-convention `opengraph-image` con un sufijo hash
 * (`/datos/carreras/opengraph-image-79slui`). Los metadata (ogUrlDe) y el
 * sitemap apuntan a la URL limpia `…/opengraph-image?v=edicion`, que sin
 * puente da 404 (bug OG del plan).
 *
 * Este script corre ANTES de `next build` (prebuild), cuando el manifest
 * `.next/app-path-routes-manifest.json` del build anterior todavía existe
 * (Next lo limpia recién al iniciar el build nuevo). Los hashes son
 * content-hash estables mientras el código OG no cambie; si cambia, el
 * siguiente prebuild los regenera. En el primer build (sin manifest) se
 * conserva el JSON previo o queda vacío (las OG igual se generan en su URL
 * con hash; el puente se activa desde el segundo build).
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const manifestPath = path.join(root, ".next", "app-path-routes-manifest.json");
const outPath = path.join(root, "lib", "datos", "og-rewrites.json");

function build() {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    // Sin manifest (primer build): conservar el JSON previo si existe.
    if (fs.existsSync(outPath)) {
      console.log("[og-rewrites] sin manifest; se conserva el JSON previo.");
      return;
    }
    fs.writeFileSync(outPath, JSON.stringify({ static: [], slugHash: null }, null, 2) + "\n");
    console.log("[og-rewrites] sin manifest; JSON vacío creado.");
    return;
  }
  const staticMap = {};
  let slugHash = null;
  for (const route of Object.values(manifest)) {
    const m = route.match(/^(\/datos(?:\/.*)?)\/opengraph-image-([0-9a-z]+)$/);
    if (!m) continue;
    const [, base, hash] = m;
    if (base.includes("[slug]")) {
      slugHash = hash;
    } else {
      staticMap[`${base}/opengraph-image`] = `${base}/opengraph-image-${hash}`;
    }
  }
  const static = Object.entries(staticMap).map(([source, destination]) => ({ source, destination }));
  fs.writeFileSync(outPath, JSON.stringify({ static, slugHash }, null, 2) + "\n");
  console.log(`[og-rewrites] ${static.length} rutas estáticas + slugHash=${slugHash}`);
}

build();
