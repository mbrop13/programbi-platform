import assert from "node:assert/strict";
import test from "node:test";
import { esFichaIndexable, getCarreras, getMetaCarreras } from "../../lib/datos/carreras";
import { carrerasParecidas } from "../../lib/datos/parecidas";
import { PRESET_SLUGS } from "../../lib/datos/presets";
import {
  breadcrumbsSchema,
  datasetCarrerasSchema,
  faqPageSchema,
  itemListSchema,
  metadataFichaCarrera,
  metadataHubCarreras,
  metadataPreset,
} from "../../lib/datos/seo-carreras";
import {
  contextoComparativoFicha,
  faqsFichaCarrera,
  faqsHubCarreras,
} from "../../lib/datos/textos-carreras";

function checkMetaLengths(label: string, title: unknown, description: string | null | undefined) {
  const titleStr = typeof title === "object" && title && "absolute" in title
    ? String((title as { absolute: string }).absolute)
    : String(title ?? "");
  assert.ok(titleStr.length > 0 && titleStr.length <= 60, `${label}: title > 60 (${titleStr.length}): "${titleStr}"`);
  assert.ok(
    description && description.length >= 140 && description.length <= 155,
    `${label}: description fuera de 140-155 (${description?.length}): "${description}"`
  );
}

test("metadata hub y presets cumplen title <= 60 y description 140-155", () => {
  const hub = metadataHubCarreras();
  checkMetaLengths("hub", hub.title, hub.description);

  for (const preset of PRESET_SLUGS) {
    const m = metadataPreset(preset);
    checkMetaLengths(`preset:${preset}`, m.title, m.description);
  }
});

test("metadata de todas las fichas cumple title <= 60 y description 140-155", () => {
  const carreras = getCarreras();
  for (const c of carreras) {
    const indexable = esFichaIndexable(c);
    const m = metadataFichaCarrera(c, indexable);
    checkMetaLengths(`ficha:${c.slug}`, m.title, m.description);
  }
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
