import assert from "node:assert/strict";
import test from "node:test";
import { getCarreras } from "../../lib/datos/carreras";
import {
  bandaAfinidadCarrera,
  cursosParaCarrera,
} from "../../lib/datos/carreras-cursos";

test("Banda 3 (baja): Salud, veterinaria, educación/pedagogía, derecho, arte, humanidades y periodismo/comunicación", () => {
  const carreras = getCarreras();

  const salud = carreras.filter((c) => c.area === "Salud");
  assert.ok(salud.length >= 5, "Debe haber al menos 5 carreras de Salud en el dataset");
  for (const c of salud.slice(0, 5)) {
    assert.equal(bandaAfinidadCarrera(c.slug, c.area), "baja", `${c.slug} (${c.area}) debe ser baja`);
  }

  for (const slug of ["medicina-veterinaria", "tecnico-veterinario"]) {
    assert.equal(bandaAfinidadCarrera(slug, "Agropecuaria"), "baja", `${slug} debe ser baja aunque sea Agropecuaria`);
  }

  assert.equal(
    bandaAfinidadCarrera("pedagogia-en-matematicas-y-computacion", "Educación"),
    "baja",
    "pedagogia-en-matematicas-y-computacion debe ser baja y no caer en informática",
  );
  assert.equal(
    bandaAfinidadCarrera("pedagogia-en-matematicas-y-computacion", "Ciencias Básicas"),
    "baja",
    "pedagogia-* debe ser baja por slug aunque el área sea otra",
  );
  assert.equal(
    bandaAfinidadCarrera("programas-de-formacion-pedagogica", "Educación"),
    "baja",
  );

  for (const [slug, area] of [
    ["derecho", "Derecho"],
    ["arquitectura", "Arte y Arquitectura"],
    ["licenciatura-en-historia", "Humanidades"],
    ["periodismo", "Ciencias Sociales"],
    ["comunicacion-audiovisual", "Arte y Arquitectura"],
    ["diseno-y-comunicacion", "Tecnología"],
  ] as const) {
    assert.equal(bandaAfinidadCarrera(slug, area), "baja", `${slug} (${area}) debe ser baja`);
  }
});

test("Telecomunicaciones NO cae en banda baja", () => {
  for (const slug of [
    "ingenieria-en-telecomunicaciones",
    "tecnico-en-telecomunicaciones",
  ]) {
    const banda = bandaAfinidadCarrera(slug, "Tecnología");
    assert.notEqual(banda, "baja", `${slug} no debe ser baja`);
    assert.equal(banda, "neutra", `${slug} debe ser neutra`);
  }
});

test("Banda 2 (mineria): recomienda Análisis de Datos para la Minería y Power BI", () => {
  for (const slug of [
    "ingenieria-civil-en-minas",
    "tecnico-en-mineria",
    "ingenieria-en-metalurgia",
    "tecnico-en-geomineria",
  ]) {
    assert.equal(bandaAfinidadCarrera(slug, "Tecnología"), "mineria");
    const rec = cursosParaCarrera(slug, "Tecnología");
    assert.equal(rec.banda, "mineria");
    assert.equal(rec.principal.slug, "analitica-mineria");
    assert.equal(rec.principal.nombre, "Análisis de Datos para la Minería");
    assert.equal(rec.secundario.slug, "power-bi");
    assert.deepEqual(
      rec.chips.map((c) => c.slug),
      ["analitica-mineria", "power-bi"],
    );
  }
});

test("Banda 1 (alta): mapeo exacto de cursos y sin SQL Server para industriales", () => {
  const comercial = cursosParaCarrera("ingenieria-comercial", "Administración y Comercio");
  assert.equal(comercial.banda, "alta");
  assert.equal(comercial.principal.slug, "power-bi");
  assert.equal(comercial.secundario.slug, "excel");
  assert.deepEqual(comercial.chips.map((c) => c.slug), ["power-bi", "excel"]);

  const control = cursosParaCarrera("ingenieria-en-control-de-gestion", "Administración y Comercio");
  assert.equal(control.banda, "alta");
  assert.deepEqual(control.chips.map((c) => c.slug), ["power-bi", "excel"]);

  for (const finSlug of ["ingenieria-en-finanzas", "tecnico-en-administracion-financiera-y-finanzas"]) {
    const fin = cursosParaCarrera(finSlug, "Administración y Comercio");
    assert.equal(fin.banda, "alta");
    assert.deepEqual(fin.chips.map((c) => c.slug), ["power-bi", "excel"]);
  }

  const contador = cursosParaCarrera("contador-auditor", "Administración y Comercio");
  assert.equal(contador.banda, "alta");
  assert.equal(contador.principal.slug, "excel");
  assert.equal(contador.secundario.slug, "power-bi");
  assert.deepEqual(contador.chips.map((c) => c.slug), ["excel", "power-bi"]);

  for (const indSlug of ["ingenieria-industrial", "ingenieria-civil-industrial"]) {
    const ind = cursosParaCarrera(indSlug, "Tecnología");
    assert.equal(ind.banda, "alta");
    assert.equal(ind.principal.slug, "power-bi");
    assert.equal(ind.secundario.slug, "analisis-de-datos");
    assert.deepEqual(ind.chips.map((c) => c.slug), ["power-bi", "analisis-de-datos"]);
    assert.ok(
      !ind.chips.some((c) => c.slug === "sql-server"),
      `${indSlug} NO debe recomendar sql-server`,
    );
  }

  for (const infSlug of [
    "ingenieria-en-computacion-e-informatica",
    "ingenieria-civil-en-computacion-e-informatica",
    "tecnico-en-computacion-e-informatica",
  ]) {
    const inf = cursosParaCarrera(infSlug, "Tecnología");
    assert.equal(inf.banda, "alta");
    assert.equal(inf.principal.slug, "sql-server");
    assert.equal(inf.secundario.slug, "python");
    assert.equal(inf.secundario.nombre, "Python");
    assert.deepEqual(inf.chips.map((c) => c.slug), [
      "sql-server",
      "python",
      "analisis-de-datos",
    ]);
  }
});

test("Todas las carreras del dataset resuelven una banda y cursos válidos", () => {
  const carreras = getCarreras();
  assert.ok(carreras.length > 0);
  for (const c of carreras) {
    const rec = cursosParaCarrera(c.slug, c.area);
    assert.ok(["alta", "mineria", "baja", "neutra"].includes(rec.banda));
    assert.ok(rec.principal.slug);
    assert.ok(rec.secundario.slug);
    assert.ok(rec.chips.length >= 2);
  }
});
