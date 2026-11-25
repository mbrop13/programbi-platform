import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { esFichaIndexable, getCarrera } from "../../lib/datos/carreras";
import {
  metadataFichaCarrera,
  metadataHubCarreras,
  metadataPreset,
} from "../../lib/datos/seo-carreras";
import {
  getCarreraMxPorSlug,
  getCarrerasExcluidasMx,
  getCarrerasPublicablesMx,
  getMetaCarrerasMx,
  getTodasLasCarrerasMx,
} from "../../lib/datos-mx/carreras";
import { pesosMx, pesosMxExacto, porcentajeMx } from "../../lib/datos-mx/formato";
import {
  PRESTACIONES_LFT_2026_MX,
  UMA_2026_MX,
  calcularIsrMensualMx,
  calcularIsrQuincenalMx,
  getParametrosLaboralesMx,
} from "../../lib/datos-mx/parametros";
import {
  jsonLdDatasetMx,
  jsonLdFichaCarreraMx,
  metadataFichaCarreraMx,
  metadataHubCarrerasMx,
} from "../../lib/datos-mx/seo";
import { faqsFichaMx } from "../../lib/datos-mx/textos";
import { GUIAS_PASO_A_PASO_MX } from "../../lib/guias/paso-a-paso-mx";
import { SITE_URL } from "../../lib/seo";
import {
  PARES_HREFLANG_DATOS,
  alternatesSitemapDatosDe,
  hreflangDatosDe,
} from "../../lib/seo/datos-hreflang";

test("IMCO 2026: exactamente 75 fichas publicables y 4 excluidas (513, 610, 621, 420)", () => {
  const todas = getTodasLasCarrerasMx();
  const publicables = getCarrerasPublicablesMx();
  const excluidas = getCarrerasExcluidasMx();
  const meta = getMetaCarrerasMx();

  assert.equal(todas.length, 79);
  assert.equal(publicables.length, 75);
  assert.equal(excluidas.length, 4);
  assert.equal(meta.totalCarreras, 79);
  assert.equal(meta.totalPublicables, 75);
  assert.equal(meta.totalExcluidas, 4);

  const clavesExcluidas = new Set(excluidas.map((c) => c.cveCarrera));
  assert.deepEqual(
    [...clavesExcluidas].sort(),
    ["420", "513", "610", "621"]
  );
  for (const c of excluidas) {
    assert.equal(c.publicable, false);
  }
});

test("valores de control México 2026: ISR primer/último tramo, UMAs y carreras testigo", () => {
  const params = getParametrosLaboralesMx();
  const tramosM = params.isrArt96Mensual.tramos;
  const tramosQ = params.isrArt96Quincenal.tramos;

  // Primer y último tramo mensual (Anexo 8 RMF 2026)
  assert.equal(tramosM[0].limiteInferior, 0.01);
  assert.equal(tramosM[0].cuotaFija, 0);
  assert.equal(tramosM[0].porcentajeExcedente, 1.92);
  const ultimoM = tramosM[tramosM.length - 1];
  assert.equal(ultimoM.limiteInferior, 425642);
  assert.equal(ultimoM.limiteSuperior, null);
  assert.equal(ultimoM.cuotaFija, 133488.54);
  assert.equal(ultimoM.porcentajeExcedente, 35);

  // Primer y último tramo quincenal
  assert.equal(tramosQ[0].limiteInferior, 0.01);
  assert.equal(tramosQ[0].porcentajeExcedente, 1.92);
  const ultimoQ = tramosQ[tramosQ.length - 1];
  assert.equal(ultimoQ.limiteInferior, 210020.71);
  assert.equal(ultimoQ.limiteSuperior, null);
  assert.equal(ultimoQ.cuotaFija, 65866.05);
  assert.equal(ultimoQ.porcentajeExcedente, 35);

  assert.equal(calcularIsrMensualMx(500).tasaMarginalPct, 1.92);
  assert.equal(calcularIsrMensualMx(500000).tasaMarginalPct, 35);
  assert.equal(calcularIsrQuincenalMx(250000).tasaMarginalPct, 35);

  // 30 UMA ($3,519.30) y 15 UMA ($1,759.65)
  assert.equal(UMA_2026_MX.diaria, 117.31);
  assert.equal(PRESTACIONES_LFT_2026_MX.aguinaldoExentoUmas, 30);
  assert.equal(pesosMxExacto(PRESTACIONES_LFT_2026_MX.aguinaldoExentoPesos), "$3,519.30");
  assert.equal(pesosMxExacto(30 * UMA_2026_MX.diaria), "$3,519.30");
  assert.equal(PRESTACIONES_LFT_2026_MX.ptuExentaUmas, 15);
  assert.equal(pesosMxExacto(PRESTACIONES_LFT_2026_MX.ptuExentaPesos), "$1,759.65");
  assert.equal(PRESTACIONES_LFT_2026_MX.primaVacacionalExentaUmas, 15);
  assert.equal(pesosMxExacto(PRESTACIONES_LFT_2026_MX.primaVacacionalExentaPesos), "$1,759.65");

  // Carreras testigo: Matemáticas y Medicina general
  const mat = getCarreraMxPorSlug("matematicas");
  assert.ok(mat, "Falta Matemáticas en publicables");
  assert.equal(pesosMx(mat.ingreso), "$29,887");
  assert.equal(porcentajeMx(mat.tasaDesocupacion), "1.3 %");

  const med = getCarreraMxPorSlug("medicina-general");
  assert.ok(med, "Falta Medicina general en publicables");
  assert.equal(pesosMx(med.ingreso), "$27,823");
  assert.equal(porcentajeMx(med.tasaDesocupacion), "1.6 %");
  assert.equal(porcentajeMx(med.tasaAceptacion, 0), "19 %");
});

test("vocabulario MX: 0 ocurrencias de 'empleabilidad' en lib/datos-mx y data/mx/*.json", () => {
  const root = process.cwd();
  const libDir = join(root, "lib", "datos-mx");
  for (const file of readdirSync(libDir).filter((f) => f.endsWith(".ts"))) {
    const content = readFileSync(join(libDir, file), "utf8");
    assert.equal(
      /empleabilidad/i.test(content),
      false,
      `Se encontró 'empleabilidad' en lib/datos-mx/${file}`
    );
  }

  const dataDir = join(root, "data", "mx");
  for (const file of readdirSync(dataDir).filter((f) => f.endsWith(".json"))) {
    const content = readFileSync(join(dataDir, file), "utf8");
    assert.equal(
      /empleabilidad/i.test(content),
      false,
      `Se encontró 'empleabilidad' en data/mx/${file}`
    );
  }
});

test("canonicales absolutos /mx/... y ausencia de license abierta en Dataset IMCO", () => {
  const hubMeta = metadataHubCarrerasMx();
  assert.equal(
    hubMeta.alternates?.canonical,
    `${SITE_URL}/mx/datos/carreras-mejor-pagadas`
  );

  const hubCarrerasMeta = metadataHubCarrerasMx({ path: "/mx/datos/carreras" });
  assert.equal(
    hubCarrerasMeta.alternates?.canonical,
    `${SITE_URL}/mx/datos/carreras`
  );

  for (const c of getCarrerasPublicablesMx()) {
    const m = metadataFichaCarreraMx(c);
    assert.equal(
      m.alternates?.canonical,
      `${SITE_URL}/mx/datos/carreras/${c.slug}`
    );
    const esperado = hreflangDatosDe(`/mx/datos/carreras/${c.slug}`);
    assert.deepEqual(m.alternates?.languages, esperado);
  }

  const dataset = jsonLdDatasetMx({
    name: "Carreras mejor pagadas en México 2026",
    description: "Datos IMCO 2026",
    path: "/mx/datos/carreras-mejor-pagadas",
  });
  assert.equal("license" in dataset, false);

  const med = getCarreraMxPorSlug("medicina-general")!;
  const jsonLdFicha = jsonLdFichaCarreraMx(med, faqsFichaMx(med));
  const datasetFicha = jsonLdFicha[0] as Record<string, unknown>;
  assert.equal(datasetFicha["@type"], "Dataset");
  assert.equal("license" in datasetFicha, false);
});

test("datos-hreflang.ts: pares base, reciprocidad 100%, indexabilidad y sin falsos positivos", () => {
  const hHubCl = hreflangDatosDe("/datos/carreras");
  assert.ok(hHubCl);
  assert.equal(hHubCl["x-default"], `${SITE_URL}/datos/carreras`);
  assert.equal(hHubCl["es-CL"], `${SITE_URL}/datos/carreras`);
  assert.equal(hHubCl["es-MX"], `${SITE_URL}/mx/datos/carreras`);
  assert.deepEqual(hreflangDatosDe("/mx/datos/carreras"), hHubCl);

  const hTopCl = hreflangDatosDe("/datos/carreras/mejor-pagadas");
  assert.ok(hTopCl);
  assert.equal(hTopCl["x-default"], `${SITE_URL}/datos/carreras/mejor-pagadas`);
  assert.equal(hTopCl["es-CL"], `${SITE_URL}/datos/carreras/mejor-pagadas`);
  assert.equal(hTopCl["es-MX"], `${SITE_URL}/mx/datos/carreras-mejor-pagadas`);
  assert.deepEqual(hreflangDatosDe("/mx/datos/carreras-mejor-pagadas"), hTopCl);

  const vistosCl = new Set<string>();
  const vistosMx = new Set<string>();
  const paresMx = PARES_HREFLANG_DATOS.filter((par) => Boolean(par.mx));

  for (const par of paresMx) {
    assert.ok(par.cl.startsWith("/datos/carreras"), `CL inválido: ${par.cl}`);
    assert.ok(par.mx && par.mx.startsWith("/mx/datos/"), `MX inválido: ${par.mx}`);
    assert.equal(vistosCl.has(par.cl), false, `CL duplicado: ${par.cl}`);
    assert.equal(vistosMx.has(par.mx), false, `MX duplicado: ${par.mx}`);
    vistosCl.add(par.cl);
    vistosMx.add(par.mx);

    if (par.cl.startsWith("/datos/carreras/") && par.cl !== "/datos/carreras/mejor-pagadas") {
      const slugCl = par.cl.replace("/datos/carreras/", "");
      const slugMx = par.mx.replace("/mx/datos/carreras/", "");
      const clRec = getCarrera(slugCl);
      const mxRec = getCarreraMxPorSlug(slugMx);
      assert.ok(clRec && esFichaIndexable(clRec), `CL no indexable: ${slugCl}`);
      assert.ok(mxRec && mxRec.publicable, `MX no publicable: ${slugMx}`);
    }

    const hCl = hreflangDatosDe(par.cl);
    const hMx = hreflangDatosDe(par.mx);
    assert.ok(hCl && hMx);
    assert.deepEqual(hCl, hMx, `No recíproco entre ${par.cl} y ${par.mx}`);
    assert.equal(hCl["x-default"], `${SITE_URL}${par.cl}`);
    assert.equal(hCl["es-CL"], `${SITE_URL}${par.cl}`);
    assert.equal(hCl["es-MX"], `${SITE_URL}${par.mx}`);
  }

  // Rutas sin par explícito no deben emitir hreflang
  assert.equal(hreflangDatosDe("/mx/datos"), undefined);
  assert.equal(alternatesSitemapDatosDe("/mx/datos"), undefined);
  for (const g of GUIAS_PASO_A_PASO_MX) {
    assert.equal(hreflangDatosDe(`/mx/guias/${g.slug}`), undefined);
  }
  assert.equal(hreflangDatosDe("/mx/datos/carreras/matematicas"), undefined);

  // Conexión en metadata CL y MX
  const clHub = metadataHubCarreras();
  assert.deepEqual(clHub.alternates?.languages, hreflangDatosDe("/datos/carreras"));

  const clPreset = metadataPreset("mejor-pagadas");
  assert.deepEqual(
    clPreset.alternates?.languages,
    hreflangDatosDe("/datos/carreras/mejor-pagadas")
  );

  const medCl = getCarrera("medicina")!;
  assert.deepEqual(
    metadataFichaCarrera(medCl, true).alternates?.languages,
    hreflangDatosDe("/datos/carreras/medicina")
  );
  assert.equal(metadataFichaCarrera(medCl, false).alternates?.languages, undefined);

  const medMx = getCarreraMxPorSlug("medicina-general")!;
  assert.deepEqual(
    metadataFichaCarreraMx(medMx).alternates?.languages,
    hreflangDatosDe("/mx/datos/carreras/medicina-general")
  );
});

test("sitemap incluye exactamente las 82 URLs nuevas de México con lastmod real y alternates", async (t) => {
  const esperadasMx = [
    `${SITE_URL}/mx/datos`,
    `${SITE_URL}/mx/datos/carreras`,
    `${SITE_URL}/mx/datos/carreras-mejor-pagadas`,
    ...getCarrerasPublicablesMx().map(
      (c) => `${SITE_URL}/mx/datos/carreras/${c.slug}`
    ),
    ...GUIAS_PASO_A_PASO_MX.map((g) => `${SITE_URL}/mx/guias/${g.slug}`),
  ];
  assert.equal(esperadasMx.length, 82);

  // Verificar fechas reales de las 4 guías y alternates de datos-hreflang
  for (const g of GUIAS_PASO_A_PASO_MX) {
    assert.match(g.updated, /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.deepEqual(
    alternatesSitemapDatosDe("/mx/datos/carreras")?.languages,
    hreflangDatosDe("/mx/datos/carreras")
  );
  assert.deepEqual(
    alternatesSitemapDatosDe("/datos/carreras")?.languages,
    hreflangDatosDe("/datos/carreras")
  );
  assert.equal(alternatesSitemapDatosDe("/mx/datos"), undefined);

  const sitemapSrc = readFileSync(join(process.cwd(), "app", "sitemap.ts"), "utf8");
  const sinComentarios = sitemapSrc.replace(/\/\/.*$/gm, "");
  assert.equal(sinComentarios.includes("new Date()"), false, "app/sitemap.ts no debe usar new Date()");
  assert.ok(sitemapSrc.includes("/mx/datos"));
  assert.ok(sitemapSrc.includes("/mx/datos/carreras"));
  assert.ok(sitemapSrc.includes("/mx/datos/carreras-mejor-pagadas"));
  assert.ok(sitemapSrc.includes("GUIAS_PASO_A_PASO_MX"));

  let entries: Awaited<ReturnType<typeof import("../../app/sitemap").default>>;
  try {
    const mod = await import("../../app/sitemap");
    entries = await mod.default();
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "MODULE_NOT_FOUND" || code === "ERR_MODULE_NOT_FOUND") {
      t.diagnostic("Sin node_modules (@supabase/ssr); validado estáticamente y por helpers");
      return;
    }
    throw err;
  }

  const urls = new Set(entries.map((e) => e.url));
  for (const url of esperadasMx) {
    assert.ok(urls.has(url), `Falta en sitemap: ${url}`);
  }

  // 0 CSV/XLSX en sitemap
  for (const e of entries) {
    assert.equal(/\.(csv|xlsx)$/i.test(e.url), false, `Archivo descargable en sitemap: ${e.url}`);
  }

  // lastmod real en las 82 URLs MX
  const byUrl = new Map(entries.map((e) => [e.url, e]));
  for (const url of esperadasMx) {
    const entry = byUrl.get(url)!;
    assert.ok(
      typeof entry.lastModified === "string" && /^\d{4}-\d{2}-\d{2}$/.test(entry.lastModified),
      `lastmod inválido en ${url}: ${String(entry.lastModified)}`
    );
  }

  // Alternates recíprocos en sitemap para pares CL <-> MX
  assert.deepEqual(
    byUrl.get(`${SITE_URL}/mx/datos/carreras`)?.alternates?.languages,
    hreflangDatosDe("/mx/datos/carreras")
  );
  assert.deepEqual(
    byUrl.get(`${SITE_URL}/datos/carreras`)?.alternates?.languages,
    hreflangDatosDe("/datos/carreras")
  );
  assert.equal(byUrl.get(`${SITE_URL}/mx/datos`)?.alternates, undefined);
});
