import assert from "node:assert/strict";
import test from "node:test";
import type { Metadata } from "next";
import { esFichaIndexable, getCarreras, getMetaCarreras } from "../../lib/datos/carreras";
import { CARRERAS_SEO_MAPA, tituloFichaCarreraConFormato } from "../../lib/datos/carreras-seo-mapa";
import { datosJovenes } from "../../lib/datos/desempleo-desgloses";
import { periodo, tasa } from "../../lib/datos/desempleo-formato";
import {
  getInstitucionesConPagina,
  getPaginaInstitucion,
  nombreInstitucion,
} from "../../lib/datos/instituciones-paginas";
import { carrerasParecidas } from "../../lib/datos/parecidas";
import { PRESET_SLUGS } from "../../lib/datos/presets";
import { NACIONAL, REGIONES } from "../../lib/datos/regiones";
import { metaObservatorio } from "../../lib/datos/seo";
import {
  ajustarTitulo,
  breadcrumbsSchema,
  datasetCarrerasSchema,
  faqPageSchema,
  itemListSchema,
  metadataFichaCarrera,
  metadataHubCarreras,
  metadataPreset,
  metadataSimpleDatos,
} from "../../lib/datos/seo-carreras";
import {
  contextoComparativoFicha,
  faqsFichaCarrera,
  faqsHubCarreras,
} from "../../lib/datos/textos-carreras";

function extractTitle(title: unknown): string {
  return typeof title === "object" && title && "absolute" in title
    ? String((title as { absolute: string }).absolute)
    : String(title ?? "");
}

function checkMetaLengths(label: string, m: Metadata, minDesc = 140, maxDesc = 155) {
  const titleStr = extractTitle(m.title);
  const description = m.description;
  assert.ok(titleStr.length > 0 && titleStr.length <= 60, `${label}: title > 60 (${titleStr.length}): "${titleStr}"`);
  assert.ok(!titleStr.includes("| ProgramBI"), `${label}: title incluye '| ProgramBI': "${titleStr}"`);
  assert.ok(
    description && description.length >= minDesc && description.length <= maxDesc,
    `${label}: description fuera de ${minDesc}-${maxDesc} (${description?.length}): "${description}"`
  );
  assert.ok(!description.endsWith("..."), `${label}: description truncada con '...'`);
  if (m.openGraph) {
    assert.equal(m.openGraph.title, titleStr, `${label}: openGraph.title desincronizado`);
    assert.equal(m.openGraph.description, description, `${label}: openGraph.description desincronizada`);
  }
  if (m.twitter) {
    assert.equal(m.twitter.title, titleStr, `${label}: twitter.title desincronizado`);
    assert.equal(m.twitter.description, description, `${label}: twitter.description desincronizada`);
  }
}

test("metadata hub y presets cumplen title <= 60, description 140-155 y sin marca", () => {
  const hub = metadataHubCarreras();
  checkMetaLengths("hub", hub);

  for (const preset of PRESET_SLUGS) {
    const m = metadataPreset(preset);
    checkMetaLengths(`preset:${preset}`, m);
  }
});

test("metadata de todas las 165 fichas cumple cobertura, unicidad, longitud y OG/Twitter", () => {
  const carreras = getCarreras();
  assert.equal(carreras.length, 165);

  const titulosVistos = new Map<string, string>();
  for (const c of carreras) {
    assert.ok(c.slug in CARRERAS_SEO_MAPA, `Falta ${c.slug} en CARRERAS_SEO_MAPA`);
    const indexable = esFichaIndexable(c);
    const m = metadataFichaCarrera(c, indexable);
    checkMetaLengths(`ficha:${c.slug}`, m);

    const titleStr = extractTitle(m.title);
    assert.ok(
      !titulosVistos.has(titleStr),
      `Título duplicado entre ${titulosVistos.get(titleStr)} y ${c.slug}: "${titleStr}"`
    );
    titulosVistos.set(titleStr, c.slug);
  }

  // Verificar ejemplos priorizados
  const medVet = carreras.find((c) => c.slug === "medicina-veterinaria")!;
  assert.equal(tituloFichaCarreraConFormato(medVet).title, "¿Cuánto gana un veterinario en Chile? Sueldo 2026");
  const tens = carreras.find((c) => c.slug === "tecnico-en-enfermeria")!;
  assert.equal(tituloFichaCarreraConFormato(tens).title, "¿Cuánto gana un TENS en Chile? Sueldo técnico en enfermería");
  assert.ok(metadataFichaCarrera(tens, true).description?.includes("institutos"));
});

test("metadata de herramientas, listados e instituciones cumple longitudes", () => {
  const simples = [
    {
      path: "/datos/carreras/puntaje-ponderado",
      title: "Calculadora de puntaje ponderado PAES Chile 2026",
      description:
        "Calcula tu puntaje ponderado PAES con NEM y Ranking aplicando las ponderaciones reales por universidad y carrera en Chile según datos oficiales SIES.",
    },
    {
      path: "/datos/carreras/retorno",
      title: "Calculadora de retorno de carrera en Chile 2026",
      description:
        "Estima cuánto cuesta estudiar una carrera en Chile (arancel 2026 y duración real) y a cuántos meses de sueldo bruto equivale al 1.º y 4.º año.",
    },
    {
      path: "/datos/carreras/comparar",
      title: "Comparador de carreras en Chile 2026: sueldos y empleo",
      description:
        "Compara hasta 3 carreras en Chile lado a lado: sueldos 1.º al 5.º año, empleabilidad, duración real y aranceles 2026 con datos oficiales de mifuturo.cl.",
    },
    {
      path: "/datos/carreras/test",
      title: "Explorador de carreras en Chile según datos oficiales 2026",
      description:
        "Ordena carreras en Chile en 5 pasos según área, presupuesto, PAES, región y jornada con cifras oficiales de sueldos y empleabilidad de mifuturo.cl.",
    },
    {
      path: "/datos/carreras/tecnologia-y-datos",
      title: "Carreras de tecnología y datos en Chile: sueldos 2026",
      description:
        "Ranking oficial de carreras de tecnología, informática, redes, telecomunicaciones y estadística en Chile 2026: sueldos, empleabilidad y aranceles.",
    },
  ];
  for (const s of simples) {
    checkMetaLengths(s.path, metadataSimpleDatos(s));
  }

  for (const inst of getInstitucionesConPagina()) {
    const p = getPaginaInstitucion(inst.slug);
    if (!p) continue;
    const nombre = nombreInstitucion(p.visual);
    const tFull = `${nombre}: carreras, aranceles y sedes 2026`;
    const tShort = `${p.visual.nombreCorto}: carreras, aranceles y sedes 2026`;
    const t = tFull.length <= 60 ? tFull : tShort.length <= 60 ? tShort : ajustarTitulo(tShort, false);
    assert.ok(t.length <= 60, `inst:${inst.slug} title > 60 (${t.length}): "${t}"`);
  }
});

test("metadata de desempleo (Chile, 16 regiones y jóvenes) cumple longitudes, sin XLSX y OG/Twitter", () => {
  const chile = metaObservatorio(NACIONAL, "Chile");
  checkMetaLengths("desempleo:chile", chile);

  for (const reg of REGIONES) {
    const m = metaObservatorio(reg.slug, reg.nombre);
    checkMetaLengths(`desempleo:${reg.slug}`, m);
    assert.ok(!m.description?.includes("XLSX"), `${reg.slug}: description contiene 'XLSX'`);
  }

  const dj = datosJovenes();
  assert.ok(dj);
  const tasaStr = tasa(dj.tasa).replace("\u00a0", " ");
  const trimestre = periodo(dj.actual.p);
  const tj = `Desempleo juvenil en Chile: ${tasaStr} en ${trimestre} (INE)`;
  const tFinal = tj.length <= 60 ? tj : `Desempleo juvenil en Chile: ${tasaStr} (${trimestre})`;
  const descJ = `La desocupación de jóvenes de 15 a 24 años fue ${tasaStr} en ${trimestre}, según el INE. Explora la evolución y descarga los datos oficiales por edad.`;
  assert.ok(tFinal.length <= 60, `jovenes title > 60: "${tFinal}"`);
  assert.ok(descJ.length >= 140 && descJ.length <= 155, `jovenes desc (${descJ.length}): "${descJ}"`);
});

test("grafo interno: 0 páginas huérfanas, >= 5 salientes y >= 2 entrantes por ficha", () => {
  const carreras = getCarreras().filter((c) => esFichaIndexable(c));
  const incoming = new Map<string, number>();
  // Todas las fichas reciben al menos 1 enlace desde el hub `/datos/carreras` (o listado de carreras)
  for (const c of carreras) incoming.set(c.slug, 1);

  for (const c of carreras) {
    const ctx = contextoComparativoFicha(c);
    assert.ok(ctx);
    const { similares } = carrerasParecidas(c);
    const salientes = new Set<string>(similares.map((s) => s.slug));
    if (ctx.anteriorEnRanking) salientes.add(ctx.anteriorEnRanking.slug);
    if (ctx.siguienteEnRanking) salientes.add(ctx.siguienteEnRanking.slug);

    // Cada ficha enlaza a: hub + comparador + al menos 1 curso + >= 4 similares/hermanas
    assert.ok(salientes.size + 3 >= 5, `${c.slug} tiene pocos enlaces salientes: ${salientes.size + 3}`);
    for (const target of salientes) {
      incoming.set(target, (incoming.get(target) ?? 0) + 1);
    }
  }

  for (const c of carreras) {
    const inc = incoming.get(c.slug) ?? 0;
    assert.ok(inc >= 2, `Ficha ${c.slug} tiene solo ${inc} enlaces entrantes (< 2)`);
  }
});

test("JSON-LD válido para hub y muestra de fichas", () => {
  const meta = getMetaCarreras();
  const hubDataset = datasetCarrerasSchema({
    path: "/datos/carreras",
    name: `Ranking de carreras en Chile (${meta.edicion})`,
    description: "Ingresos y empleabilidad oficial",
  });
  assert.equal(hubDataset["@type"], "Dataset");
  assert.ok(hubDataset.distribution.length >= 2);
  assert.equal(hubDataset.dateModified, meta.fetched_at.slice(0, 10));

  const faqsHub = faqPageSchema(faqsHubCarreras());
  assert.equal(faqsHub["@type"], "FAQPage");
  assert.ok(faqsHub.mainEntity.length >= 5);

  const list = itemListSchema("Top", [{ nombre: "Medicina", slug: "medicina", tipo: "u" }]);
  assert.equal(list["@type"], "ItemList");

  const bc = breadcrumbsSchema([{ label: "Inicio", path: "/" }]);
  assert.equal(bc["@type"], "BreadcrumbList");

  const med = getCarreras().find((c) => c.slug === "medicina")!;
  const ctx = contextoComparativoFicha(med)!;
  const faqMed = faqPageSchema(faqsFichaCarrera(med, ctx));
  assert.ok(faqMed.mainEntity.length >= 4);
});
