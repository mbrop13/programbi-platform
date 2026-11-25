import assert from "node:assert/strict";
import test from "node:test";
import { esFichaIndexable, getCarrera } from "../../lib/datos/carreras";
import {
  metadataFichaCarrera,
  metadataHubCarreras,
  metadataPreset,
} from "../../lib/datos/seo-carreras";
import { getCarrerasPe, getMetaCarrerasPe, getResumenCarrerasPe } from "../../lib/datos-pe/carreras";
import { metadataFichaCarreraPe, metadataPaginaPe } from "../../lib/datos-pe/seo";
import { GUIAS_PASO_A_PASO_PE } from "../../lib/guias/paso-a-paso-pe";
import { SITE_URL } from "../../lib/seo";
import {
  PARES_HREFLANG_DATOS,
  alternatesSitemapDatosDe,
  hreflangDatosDe,
} from "../../lib/seo/datos-hreflang";
import { esRutaAnunciable } from "../../lib/seo/indexabilidad";

test("dataset PE tiene exactamente 38 fichas (22 universitarias + 16 técnicas) y 0 advertencias", () => {
  const carreras = getCarrerasPe();
  const resumen = getResumenCarrerasPe();
  const universitarias = carreras.filter((c) => c.tipo === "universitaria");
  const tecnicas = carreras.filter((c) => c.tipo === "tecnica");

  assert.equal(carreras.length, 38);
  assert.equal(universitarias.length, 22);
  assert.equal(tecnicas.length, 16);
  assert.equal(resumen.totalFichas, 38);
  assert.equal(resumen.totalUniversitarias, 22);
  assert.equal(resumen.totalTecnicas, 16);

  const serializado = JSON.stringify(carreras);
  assert.equal(serializado.includes("con_advertencia"), false);
  assert.equal(/\bno\b/i.test(carreras.map((c) => c.slug).join(" ")), false);
  assert.equal(serializado.includes("empleabilidad"), false);
  assert.equal(serializado.includes("enaho_pct_desempleo"), false);
});

test("valores de control ENAHO en fichas clave de Perú", () => {
  const carreras = getCarrerasPe();

  const c511 = carreras.find((c) => c.codigoInei === "511");
  assert.ok(c511, "Falta código INEI 511");
  assert.equal(c511.enaho.mediana, 2881);
  assert.equal(c511.enaho.nConIngreso, 391);
  assert.equal(c511.enaho.cvMediana, 6);

  const c342Univ = carreras.find((c) => c.codigoInei === "342" && c.tipo === "universitaria");
  assert.ok(c342Univ, "Falta código INEI 342 universitaria");
  assert.equal(c342Univ.enaho.mediana, 2163);
  assert.equal(c342Univ.enaho.nConIngreso, 851);

  const c351 = carreras.find((c) => c.codigoInei === "351");
  assert.ok(c351, "Falta código INEI 351");
  assert.equal(c351.enaho.mediana, 2654);
  assert.equal(c351.enaho.nConIngreso, 731);

  const c711 = carreras.find((c) => c.codigoInei === "711");
  assert.ok(c711, "Falta código INEI 711");
  assert.equal(c711.enaho.mediana, 5244);
  assert.equal(c711.enaho.nConIngreso, 175);
});

test("metadata PE emite canonicales absolutos autorreferentes y sin términos prohibidos", () => {
  const paginas = [
    metadataPaginaPe({
      path: "/pe/datos",
      title: "Datos oficiales de Perú | ProgramBI",
      description: "Explora estadísticas oficiales de carreras universitarias y técnicas en Perú.",
    }),
    metadataPaginaPe({
      path: "/pe/datos/carreras",
      title: "Carreras mejor pagadas en Perú 2026 | ProgramBI",
      description: "Ranking de 38 carreras en Perú con ingresos ENAHO, planilla MTPE y SUNEDU.",
    }),
    metadataPaginaPe({
      path: "/pe/datos/carreras/mejor-pagadas",
      title: "Top carreras mejor pagadas en Perú 2026 | ProgramBI",
      description: "Comparativa de sueldos medianos y planilla formal de carreras en Perú.",
    }),
    metadataPaginaPe({
      path: "/pe/datos/carreras/tecnicas-mejor-pagadas",
      title: "Carreras técnicas mejor pagadas en Perú 2026 | ProgramBI",
      description: "Ranking de 16 carreras técnicas en Perú según ENAHO 2022–2024 y MTPE.",
    }),
  ];

  const pathsEsperados = [
    "/pe/datos",
    "/pe/datos/carreras",
    "/pe/datos/carreras/mejor-pagadas",
    "/pe/datos/carreras/tecnicas-mejor-pagadas",
  ];

  paginas.forEach((meta, idx) => {
    assert.equal(meta.alternates?.canonical, `${SITE_URL}${pathsEsperados[idx]}`);
    assert.equal(meta.description?.includes("empleabilidad"), false);
    assert.equal(meta.description?.includes("enaho_pct_desempleo"), false);
  });

  for (const carrera of getCarrerasPe()) {
    const meta = metadataFichaCarreraPe(carrera);
    assert.equal(meta.alternates?.canonical, `${SITE_URL}/pe/datos/carreras/${carrera.slug}`);
    assert.equal(meta.description?.includes("empleabilidad"), false);
    assert.equal(meta.description?.includes("enaho_pct_desempleo"), false);
  }
});

test("datos-hreflang.ts es 100% recíproco y todos sus slugs CL existen y son indexables", () => {
  const carrerasPe = new Map(getCarrerasPe().map((c) => [c.slug, c]));
  const paresPe = PARES_HREFLANG_DATOS.filter((par) => Boolean(par.pe));

  assert.equal(paresPe.length, 14);

  for (const par of paresPe) {
    assert.ok(par.pe, `Par sin ruta PE: ${par.cl}`);
    const langsCl = hreflangDatosDe(par.cl);
    const langsPe = hreflangDatosDe(par.pe);

    assert.ok(langsCl, `Falta hreflang para CL ${par.cl}`);
    assert.ok(langsPe, `Falta hreflang para PE ${par.pe}`);
    assert.deepStrictEqual(langsCl, langsPe);
    assert.equal(langsCl["x-default"], `${SITE_URL}${par.cl}`);
    assert.equal(langsCl["es-CL"], `${SITE_URL}${par.cl}`);
    assert.equal(langsCl["es-PE"], `${SITE_URL}${par.pe}`);

    if (par.cl.startsWith("/datos/carreras/") && par.cl !== "/datos/carreras/mejor-pagadas") {
      const slugCl = par.cl.replace("/datos/carreras/", "");
      const carreraCl = getCarrera(slugCl);
      assert.ok(carreraCl, `Slug CL no existe: ${slugCl}`);
      assert.equal(esFichaIndexable(carreraCl), true, `Slug CL no es indexable: ${slugCl}`);

      const slugPe = par.pe.replace("/pe/datos/carreras/", "");
      assert.ok(carrerasPe.has(slugPe), `Slug PE no existe: ${slugPe}`);

      const metaCl = metadataFichaCarrera(carreraCl, true);
      const metaPe = metadataFichaCarreraPe(carrerasPe.get(slugPe)!);
      assert.deepStrictEqual(metaCl.alternates?.languages, langsCl);
      assert.deepStrictEqual(metaPe.alternates?.languages, langsPe);
    }
  }

  // Hub y preset mejor-pagadas también conectados recíprocamente
  assert.deepStrictEqual(
    metadataHubCarreras().alternates?.languages,
    metadataPaginaPe({ path: "/pe/datos/carreras", title: "Hub PE", description: "Desc PE" }).alternates?.languages,
  );
  assert.deepStrictEqual(
    metadataPreset("mejor-pagadas").alternates?.languages,
    metadataPaginaPe({ path: "/pe/datos/carreras/mejor-pagadas", title: "Top PE", description: "Desc PE" })
      .alternates?.languages,
  );

  // Rutas explícitamente excluidas del emparejamiento
  for (const excluida of [
    "/pe/datos",
    "/pe/datos/carreras/tecnicas-mejor-pagadas",
    "/pe/datos/carreras/tecnologia-medica",
    "/pe/datos/carreras/diseno",
    "/pe/datos/carreras/farmacia-y-bioquimica",
    "/datos/carreras/tecnologia-medica",
    "/pe/guias/calcular-gratificacion-excel",
  ]) {
    assert.equal(hreflangDatosDe(excluida), undefined, `No debe tener hreflang: ${excluida}`);
    assert.equal(alternatesSitemapDatosDe(excluida), undefined);
  }
});

test("las 47 rutas de Perú son anunciables y tienen lastmod real", () => {
  const metaPe = getMetaCarrerasPe();
  assert.match(metaPe.fechaCorte, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(GUIAS_PASO_A_PASO_PE.length, 5);

  const rutasPe = [
    "/pe/datos",
    "/pe/datos/carreras",
    "/pe/datos/carreras/mejor-pagadas",
    "/pe/datos/carreras/tecnicas-mejor-pagadas",
    ...getCarrerasPe().map((c) => `/pe/datos/carreras/${c.slug}`),
    ...GUIAS_PASO_A_PASO_PE.map((g) => `/pe/guias/${g.slug}`),
  ];

  assert.equal(rutasPe.length, 47);
  for (const ruta of rutasPe) {
    assert.equal(esRutaAnunciable(ruta), true, `Ruta PE no anunciable: ${ruta}`);
  }
  for (const guia of GUIAS_PASO_A_PASO_PE) {
    assert.match(guia.updated, /^\d{4}-\d{2}-\d{2}$/);
  }
});
