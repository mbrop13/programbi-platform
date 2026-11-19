import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { compararTramosDesc, parseTramo, puntoMedioTramo } from "../../lib/datos/tramos";
import { buscarCarreras, type BuscadorEntry } from "../../lib/datos/carreras-sinonimos";
import { pesos, porcentaje } from "../../lib/datos/formato";

test("parseTramo parsea los 23 formatos oficiales de mifuturo.cl y s/i", () => {
  const t1 = parseTramo("De $900 mil a $1 millón");
  assert.deepEqual(t1, { texto: "De $900 mil a $1 millón", min: 900_000, max: 1_000_000 });
  assert.equal(puntoMedioTramo(t1), 950_000);

  const t2 = parseTramo("De $1 millón 100 mil a $1 millón 200 mil");
  assert.deepEqual(t2, {
    texto: "De $1 millón 100 mil a $1 millón 200 mil",
    min: 1_100_000,
    max: 1_200_000,
  });

  const t3 = parseTramo("Desde $2 millones 500 mil a $3 millones");
  assert.deepEqual(t3, {
    texto: "Desde $2 millones 500 mil a $3 millones",
    min: 2_500_000,
    max: 3_000_000,
  });

  const t4 = parseTramo("Sobre $3 millones 500 mil");
  assert.deepEqual(t4, { texto: "Sobre $3 millones 500 mil", min: 3_500_000, max: null });
  assert.equal(puntoMedioTramo(t4), null);

  assert.equal(parseTramo("s/i"), null);
  assert.equal(parseTramo("n/a"), null);
  assert.equal(parseTramo(""), null);
});

test("parseTramo falla con formatos desconocidos", () => {
  assert.throws(() => parseTramo("Entre 1 y 2 palos"));
});

test("compararTramosDesc ubica Sobre arriba y null al final", () => {
  const sobre = parseTramo("Sobre $3 millones 500 mil");
  const medio = parseTramo("De $1 millón a $1 millón 100 mil");
  const lista = [null, medio, sobre].sort(compararTramosDesc);
  assert.equal(lista[0]?.texto, "Sobre $3 millones 500 mil");
  assert.equal(lista[1]?.texto, "De $1 millón a $1 millón 100 mil");
  assert.equal(lista[2], null);
});

test("formato es-CL formatea pesos y porcentajes correctamente", () => {
  assert.equal(pesos(2203057), "$2.203.057");
  assert.equal(porcentaje(0.8204, true), "82,0\u00a0%");
});

test("buscador con sinónimos resuelve consultas reales de postulantes", () => {
  const raw = readFileSync(join(process.cwd(), "public", "datos", "carreras", "buscador.json"), "utf8");
  const items = JSON.parse(raw) as BuscadorEntry[];

  const casos: [string, string][] = [
    ["ing comercial", "ingenieria-comercial"],
    ["medico", "medicina"],
    ["abogado", "derecho"],
    ["kine", "kinesiologia"],
    ["informatica", "ingenieria-civil-en-computacion-e-informatica"],
    ["contador auditor", "contador-auditor"],
  ];

  for (const [query, expectedSlug] of casos) {
    const res = buscarCarreras(query, items, 10);
    assert.ok(
      res.exactos.some((x) => x.slug === expectedSlug),
      `Se esperaba "${expectedSlug}" para consulta "${query}", obtenido: ${res.exactos.map((e) => e.slug).join(", ")}`
    );
  }
});
