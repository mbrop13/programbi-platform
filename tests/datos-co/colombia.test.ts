import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { esFichaIndexable, getCarrera } from "../../lib/datos/carreras";
import { getFichaPorSlugCo, getFichasCarrerasCo, getRankingCarrerasCo } from "../../lib/datos-co/carreras";
import {
  getDesempleoCiudadesCo,
  getDesempleoCo,
  getInflacionCo,
  getParametrosLaborales2026Co,
  getSalarioMinimoCo,
} from "../../lib/datos-co/macro";
import { canonicalCo, datasetJsonLdCo, metadataDatosCo } from "../../lib/datos-co/seo";
import { hreflangDatosDe, PARES_HREFLANG_DATOS } from "../../lib/seo/datos-hreflang";

const ROOT = process.cwd();

function collectFiles(dir: string, ext: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectFiles(full, ext));
    } else if (entry.name.endsWith(ext)) {
      out.push(full);
    }
  }
  return out;
}

test("Colombia carreras: exactamente 354 fichas y 335 rankings", () => {
  const fichas = getFichasCarrerasCo();
  const rankings = getRankingCarrerasCo();
  assert.equal(fichas.length, 354, `Esperadas 354 fichas, encontradas ${fichas.length}`);
  assert.equal(rankings.length, 335, `Esperados 335 rankings, encontrados ${rankings.length}`);
});

test("Colombia valores de control sección 4 (macro, salarios y carreras)", () => {
  const sm = getSalarioMinimoCo();
  const params = getParametrosLaborales2026Co();
  assert.equal(sm.smmlv_cop, 1750905);
  assert.equal(sm.auxilio_transporte_cop, 249095);
  assert.equal(sm.total_smmlv_mas_auxilio_cop, 2000000);
  assert.equal(params.smmlv_2026_cop, 1750905);
  assert.equal(params.auxilio_transporte_2026_cop, 249095);

  const desemp = getDesempleoCo();
  assert.equal(desemp.meta.periodo_nacional_actual, "2026-09");
  assert.equal(desemp.meta.tasa_nacional_actual_pct, 8);
  const sep2026 = desemp.nacional.find((p) => p.periodo === "2026-09");
  assert.ok(sep2026);
  assert.equal(sep2026.tasa_desocupacion_pct, 8);

  const ciudades = getDesempleoCiudadesCo();
  const bogota = ciudades.find((c) => /bogot/i.test(c.ciudad));
  const quibdo = ciudades.find((c) => /quibd/i.test(c.ciudad));
  assert.ok(bogota, "Debe existir Bogotá D.C.");
  assert.equal(bogota.tasa_desocupacion_pct, 7.6);
  assert.ok(quibdo, "Debe existir Quibdó");
  assert.equal(quibdo.tasa_desocupacion_pct, 23.4);

  const inf = getInflacionCo();
  assert.equal(inf.meta.periodo_actual, "2026-10");
  assert.equal(inf.meta.indice_actual, 161.32);
  assert.equal(inf.meta.var_12m_actual_pct, 6.3);
  assert.equal(inf.meta.trm_cop_usd, 3592.03);
  assert.equal(inf.meta.tasa_intervencion_pct, 12.25);

  const controles: Array<{
    slug: string;
    mediana_smmlv: number;
    mediana_cop_2026: number;
    graduados_cotizantes: number;
    sugerido_ranking: boolean;
  }> = [
    {
      slug: "ingenieria-de-sistemas-y-computacion",
      mediana_smmlv: 3.99,
      mediana_cop_2026: 6985168,
      graduados_cotizantes: 1550,
      sugerido_ranking: true,
    },
    {
      slug: "ingenieria-informatica",
      mediana_smmlv: 3.87,
      mediana_cop_2026: 6779419,
      graduados_cotizantes: 1132,
      sugerido_ranking: true,
    },
    {
      slug: "ingenieria-de-software",
      mediana_smmlv: 3.65,
      mediana_cop_2026: 6385416,
      graduados_cotizantes: 1175,
      sugerido_ranking: true,
    },
    {
      slug: "ingenieria-de-sistemas",
      mediana_smmlv: 3.08,
      mediana_cop_2026: 5389009,
      graduados_cotizantes: 14422,
      sugerido_ranking: true,
    },
    {
      slug: "economia",
      mediana_smmlv: 2.47,
      mediana_cop_2026: 4318381,
      graduados_cotizantes: 5237,
      sugerido_ranking: true,
    },
    {
      slug: "ingenieria-industrial",
      mediana_smmlv: 2.21,
      mediana_cop_2026: 3870552,
      graduados_cotizantes: 27339,
      sugerido_ranking: true,
    },
    {
      slug: "estadistica",
      mediana_smmlv: 3.7,
      mediana_cop_2026: 6480065,
      graduados_cotizantes: 391,
      sugerido_ranking: false,
    },
  ];

  for (const esperado of controles) {
    const ficha = getFichaPorSlugCo(esperado.slug);
    assert.ok(ficha, `Debe existir ficha ${esperado.slug}`);
    assert.equal(ficha.mediana_smmlv, esperado.mediana_smmlv, `${esperado.slug} mediana_smmlv`);
    assert.equal(ficha.mediana_cop_2026, esperado.mediana_cop_2026, `${esperado.slug} mediana_cop_2026`);
    assert.equal(
      ficha.graduados_cotizantes,
      esperado.graduados_cotizantes,
      `${esperado.slug} graduados_cotizantes`
    );
    assert.equal(ficha.sugerido_ranking, esperado.sugerido_ranking, `${esperado.slug} sugerido_ranking`);
  }
});

test("Colombia: 0 menciones a 'empleabilidad' ni 'campo laboral' en lib/datos-co y data/co", () => {
  const dataCoDir = join(ROOT, "data", "co");
  const dataCoJsons = readdirSync(dataCoDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => join(dataCoDir, name));
  const files = [...collectFiles(join(ROOT, "lib", "datos-co"), ".ts"), ...dataCoJsons];
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    assert.equal(
      /empleabilidad/i.test(content),
      false,
      `Término prohibido 'empleabilidad' encontrado en ${file}`
    );
    assert.equal(
      /campo\s+laboral/i.test(content),
      false,
      `Término prohibido 'campo laboral' encontrado en ${file}`
    );
  }
});

test("Colombia SEO: canonicales absolutos /co/... y ausencia de license en OLE/SNIES/DANE", () => {
  assert.equal(canonicalCo("/co/datos/carreras"), "https://www.programbi.com/co/datos/carreras");
  const metaHub = metadataDatosCo({
    title: "Carreras en Colombia",
    description: "Descripción de prueba",
    path: "/co/datos/carreras",
  });
  assert.equal(metaHub.alternates?.canonical, "https://www.programbi.com/co/datos/carreras");
  assert.ok(String(metaHub.alternates?.languages?.["es-CL"] ?? "").endsWith("/datos/carreras"));
  assert.ok(String(metaHub.alternates?.languages?.["es-CO"] ?? "").endsWith("/co/datos/carreras"));

  const metaExclusivo = metadataDatosCo({
    title: "Salario mínimo Colombia 2026",
    description: "Descripción de prueba",
    path: "/co/datos/salario-minimo",
  });
  assert.equal(
    metaExclusivo.alternates?.canonical,
    "https://www.programbi.com/co/datos/salario-minimo"
  );
  assert.equal(metaExclusivo.alternates?.languages, undefined);

  const dsOle = datasetJsonLdCo({
    id: "ole-test",
    name: "OLE 2023",
    description: "Prueba",
    path: "/co/datos/carreras",
    isBasedOn: { name: "OLE", url: "https://ole.mineducacion.gov.co" },
    variableMeasured: ["Mediana salarial"],
  });
  assert.equal("license" in dsOle, false, "Dataset OLE/SNIES/DANE no debe incluir 'license'");
});

test("datos-hreflang: reciprocidad 100%, slugs CL/CO válidos y exclusiones respetadas", () => {
  const obligatorios: Array<[string, string]> = [
    ["/datos/carreras", "/co/datos/carreras"],
    ["/datos/carreras/mejor-pagadas", "/co/datos/carreras/mejor-pagadas"],
    ["/datos/carreras/comparar", "/co/datos/carreras/comparar"],
    ["/datos/desempleo", "/co/datos/desempleo"],
    ["/datos/inflacion", "/co/datos/inflacion"],
  ];

  for (const [cl, co] of obligatorios) {
    const hCl = hreflangDatosDe(cl);
    const hCo = hreflangDatosDe(co);
    assert.ok(hCl, `Falta hreflang para ${cl}`);
    assert.deepEqual(hCl, hCo, `Reciprocidad rota entre ${cl} y ${co}`);
  }

  const clSeen = new Set<string>();
  const coSeen = new Set<string>();
  for (const par of PARES_HREFLANG_DATOS) {
    assert.ok(!clSeen.has(par.cl), `Ruta CL duplicada en PARES_HREFLANG_DATOS: ${par.cl}`);
    clSeen.add(par.cl);
    if (!par.co) continue;

    assert.ok(!coSeen.has(par.co), `Ruta CO duplicada en PARES_HREFLANG_DATOS: ${par.co}`);
    coSeen.add(par.co);

    const hCl = hreflangDatosDe(par.cl);
    const hCo = hreflangDatosDe(par.co);
    assert.ok(hCl && hCo);
    assert.deepEqual(hCl, hCo, `Reciprocidad rota para ${par.cl} <-> ${par.co}`);
    assert.equal(hCl["x-default"], hCl["es-CL"], `x-default debe ser Chile para ${par.cl}`);

    if (par.cl.startsWith("/datos/carreras/") && par.co.startsWith("/co/datos/carreras/")) {
      const slugCl = par.cl.replace("/datos/carreras/", "");
      const slugCo = par.co.replace("/co/datos/carreras/", "");
      if (slugCl !== "mejor-pagadas" && slugCl !== "comparar") {
        const carreraCl = getCarrera(slugCl);
        assert.ok(carreraCl, `Slug CL inexistente en carreras.json: ${slugCl}`);
        assert.equal(
          esFichaIndexable(carreraCl),
          true,
          `Slug CL no es indexable: ${slugCl}`
        );
        const fichaCo = getFichaPorSlugCo(slugCo);
        assert.ok(fichaCo, `Slug CO inexistente o sin sugerido_ficha: ${slugCo}`);
      }
    }
  }

  const excluidas = [
    "/co/datos",
    "/co/datos/salario-minimo",
    "/co/datos/carreras/tecnologicas-mejor-pagadas",
    "/co/datos/carreras/cuanto-gana-un-analista-de-datos",
    "/co/datos/carreras/metodologia",
    "/co/guias/prima-de-servicios-excel",
    "/co/guias/cesantias-2026",
  ];
  for (const ruta of excluidas) {
    assert.equal(hreflangDatosDe(ruta), undefined, `Ruta excluida no debe tener hreflang: ${ruta}`);
  }
});
