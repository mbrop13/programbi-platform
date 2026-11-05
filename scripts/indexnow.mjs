#!/usr/bin/env node
/**
 * IndexNow: avisa a Bing (y a Yandex, Seznam y Naver) que las URLs del sitemap
 * cambiaron, sin esperar a que las rastree.
 *
 * Sin dependencias. Lee las URLs del sitemap, las manda en lotes de 10 000 y,
 * por defecto, solo simula el envío (dry-run).
 *
 * Uso a mano:
 *
 *   # 1. Dry-run contra producción: cuenta las URLs y muestra una muestra.
 *   node scripts/indexnow.mjs
 *
 *   # 2. Probar contra el servidor local (next dev / next start en 3112).
 *   node scripts/indexnow.mjs --base=http://127.0.0.1:3112
 *
 *   # 3. Envío real. Hazlo SOLO después de desplegar y comprobar que
 *   #    /sitemap.xml y /<clave>.txt responden 200 en producción.
 *   node scripts/indexnow.mjs --enviar
 *
 *   # 4. Sitemap en otra ruta u otro dominio (preview).
 *   node scripts/indexnow.mjs --sitemap=https://preview.example.com/sitemap.xml
 *
 * La clave se detecta sola: busca en public/ un archivo <32 hex>.txt cuyo
 * contenido sea exactamente ese nombre. También se puede forzar con
 * --clave=<32 hex>.
 *
 * La clave y su archivo son públicos a propósito: IndexNow los usa para
 * verificar que quien envía controla el dominio.
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(RAIZ, "public");
const ENDPOINT = "https://api.indexnow.org/indexnow";
const LOTE_MAX = 10_000;

const args = process.argv.slice(2);

function arg(nombre, porDefecto = "") {
  const prefijo = `--${nombre}=`;
  const encontrado = args.find((a) => a.startsWith(prefijo));
  return encontrado ? encontrado.slice(prefijo.length).trim() : porDefecto;
}

function fallar(mensaje) {
  console.error(`\n✗ ${mensaje}\n`);
  process.exit(1);
}

const base = (arg("base", "https://www.programbi.com") || "").replace(/\/+$/, "");
const sitemapUrl = arg("sitemap", `${base}/sitemap.xml`);
const enviar = args.includes("--enviar");

if (!/^https?:\/\//i.test(base)) fallar(`--base debe ser una URL http(s); recibí «${base}».`);
if (!/^https?:\/\//i.test(sitemapUrl)) fallar(`--sitemap debe ser una URL http(s); recibí «${sitemapUrl}».`);

const origen = new URL(base).origin;
const host = new URL(base).hostname;

function decodificarXml(texto) {
  return texto
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

async function leerSitemap(url) {
  let res;
  try {
    res = await fetch(url, {
      headers: { accept: "application/xml,text/xml,*/*" },
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    fallar(`No pude descargar ${url}: ${err.message}`);
  }
  if (!res.ok) fallar(`El sitemap respondió ${res.status} ${res.statusText} en ${url}.`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => decodificarXml(m[1].trim()));
  return [...new Set(locs.filter(Boolean))];
}

async function leerClave() {
  const explicita = arg("clave");
  if (explicita) {
    if (!/^[0-9a-f]{32}$/i.test(explicita)) fallar("--clave debe tener 32 caracteres hexadecimales.");
    return explicita.toLowerCase();
  }

  let archivos;
  try {
    archivos = await readdir(PUBLIC);
  } catch {
    fallar(`No existe la carpeta ${PUBLIC}.`);
  }

  for (const nombre of archivos) {
    if (!/^[0-9a-f]{32}\.txt$/i.test(nombre)) continue;
    const clave = nombre.slice(0, -4).toLowerCase();
    const contenido = (await readFile(path.join(PUBLIC, nombre), "utf8")).trim();
    if (contenido.toLowerCase() === clave) return clave;
  }

  fallar(
    "No encontré la clave IndexNow. Crea public/<32 hex>.txt con la clave dentro " +
      "o pasa --clave=<32 hex>."
  );
}

/**
 * Comprueba que la clave publique esté desplegada antes de enviar: si
 * `/<clave>.txt` no responde 200 con el contenido exacto, IndexNow rechaza
 * el envío. Mejor fallar aquí que gastar la cuota del día.
 */
async function verificarClavePublica(clave) {
  const url = `${origen}/${clave}.txt`;
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  } catch (err) {
    fallar(`No pude comprobar la clave pública en ${url}: ${err.message}`);
  }
  if (!res.ok) {
    fallar(`${url} respondió ${res.status}. Despliega public/${clave}.txt antes de enviar.`);
  }
  const contenido = (await res.text()).trim();
  if (contenido !== clave) {
    fallar(`${url} no contiene exactamente la clave. Revisa public/${clave}.txt.`);
  }
  console.log(`Clave pública OK: ${url}`);
}

async function enviarLote(lote, clave, numero, total) {
  const cuerpo = {
    host,
    key: clave,
    keyLocation: `${origen}/${clave}.txt`,
    urlList: lote,
  };

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (err) {
    fallar(`Lote ${numero}/${total}: fallo de red contra ${ENDPOINT}: ${err.message}`);
  }

  // 200 = aceptado; 202 = aceptado, clave aún en validación.
  if (res.status !== 200 && res.status !== 202) {
    const detalle = (await res.text()).slice(0, 500).trim();
    fallar(
      `Lote ${numero}/${total}: IndexNow respondió ${res.status} ${res.statusText}.` +
        (detalle ? `\n  ${detalle}` : "")
    );
  }

  console.log(`  · lote ${numero}/${total}: ${lote.length} URLs → ${res.status} ${res.statusText}`);
}

async function main() {
  const clave = await leerClave();
  const urls = await leerSitemap(sitemapUrl);

  if (urls.length === 0) fallar(`El sitemap ${sitemapUrl} no tiene ninguna etiqueta <loc>.`);

  const ajenas = [];
  const propias = [];
  for (const url of urls) {
    try {
      if (new URL(url).origin === origen) propias.push(url);
      else ajenas.push(url);
    } catch {
      ajenas.push(url);
    }
  }

  console.log(`Sitemap: ${sitemapUrl}`);
  console.log(`Host:    ${host}`);
  console.log(`Clave:   ${clave} (${origen}/${clave}.txt)`);
  console.log(`URLs:    ${propias.length}`);

  if (ajenas.length) {
    console.warn(`\n⚠ ${ajenas.length} URLs no pertenecen a ${origen} y se omiten:`);
    for (const url of ajenas.slice(0, 5)) console.warn(`  - ${url}`);
  }

  if (propias.length === 0) fallar("No queda ninguna URL del host indicado para enviar.");

  if (!enviar) {
    console.log("\nDry-run: no se envió nada. Muestra:");
    for (const url of propias.slice(0, 5)) console.log(`  - ${url}`);
    if (propias.length > 5) console.log(`  … y ${propias.length - 5} más`);
    console.log("\nPara enviar de verdad: node scripts/indexnow.mjs --enviar");
    return;
  }

  const lotes = [];
  for (let i = 0; i < propias.length; i += LOTE_MAX) lotes.push(propias.slice(i, i + LOTE_MAX));

  await verificarClavePublica(clave);

  console.log(`\nEnviando ${propias.length} URLs en ${lotes.length} lote(s)…`);
  for (let i = 0; i < lotes.length; i++) {
    await enviarLote(lotes[i], clave, i + 1, lotes.length);
  }
  console.log("\n✓ IndexNow aceptó todos los lotes.");
}

main().catch((err) => fallar(err?.stack || String(err)));
