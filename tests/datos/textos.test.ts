import assert from "node:assert/strict";
import test from "node:test";
import { esFichaIndexable, getCarreras } from "../../lib/datos/carreras";
import {
  contextoComparativoFicha,
  narrativaUnicaFicha,
  resumenFichaCarrera,
} from "../../lib/datos/textos-carreras";

function shingles5(texto: string): Set<string> {
  const words = texto
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const set = new Set<string>();
  for (let i = 0; i <= words.length - 5; i++) {
    set.add(words.slice(i, i + 5).join(" "));
  }
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

test("todas las fichas indexables tienen >= 250 palabras propias y similitud < 60%", () => {
  const carreras = getCarreras().filter((c) => esFichaIndexable(c));
  assert.ok(carreras.length >= 150, `Esperado >= 150 fichas indexables, obtenido ${carreras.length}`);

  const textos: { slug: string; text: string; set: Set<string> }[] = [];
  for (const c of carreras) {
    const ctx = contextoComparativoFicha(c);
    assert.ok(ctx, `Sin contexto para ${c.slug}`);
    const resumen = resumenFichaCarrera(c, ctx).join(" ");
    const cuerpo = narrativaUnicaFicha(c, ctx).join(" ");
    const full = `${resumen} ${cuerpo}`;
    const wordCount = full.trim().split(/\s+/).length;
    assert.ok(wordCount >= 250, `${c.slug} tiene solo ${wordCount} palabras (< 250)`);
    assert.ok(!/gana más porque|mejor carrera porque/i.test(full), `Frase causal prohibida en ${c.slug}`);
    textos.push({ slug: c.slug, text: full, set: shingles5(full) });
  }

  // Verificar similitud entre muestra representativa y pares cercanos (misma área)
  let maxSim = 0;
  let maxPair = "";
  for (let i = 0; i < textos.length; i += 3) {
    for (let j = i + 1; j < Math.min(textos.length, i + 15); j++) {
      const sim = jaccard(textos[i].set, textos[j].set);
      if (sim > maxSim) {
        maxSim = sim;
        maxPair = `${textos[i].slug} vs ${textos[j].slug}`;
      }
      assert.ok(sim < 0.6, `Similitud excesiva (${(sim * 100).toFixed(1)}%) entre ${textos[i].slug} y ${textos[j].slug}`);
    }
  }
  console.log(`Similitud máxima muestreada: ${(maxSim * 100).toFixed(1)}% (${maxPair})`);
});
