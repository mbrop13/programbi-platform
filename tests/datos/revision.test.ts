import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { claveRevisionDesempleo } from "../../lib/datos/revision-desempleo";

test("la clave cambia con correcciones del mismo trimestre y tolera series opcionales", (prueba) => {
  const raiz = mkdtempSync(join(tmpdir(), "revision-desempleo-"));
  assert.equal(dirname(resolve(raiz)), resolve(tmpdir()));
  prueba.after(() => rmSync(raiz, { recursive: true, force: true }));
  const escribir = (ruta: string, contenido: unknown) => {
    const destino = join(raiz, ruta);
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, JSON.stringify(contenido));
  };
  const fecha = "29-10-2026";
  escribir("data/desempleo/meta.json", { version: "2026-08", fetched_at: "uno" });
  escribir("data/desempleo/nacional.json", [{ p: "2026-08", tasa: 9.8 }]);
  escribir("public/datos/desempleo/explorador.json", { tasa: 9.8 });
  escribir("public/datos/desempleo/diferencias/2026-08.json", { diferencia: 1 });
  const sinAjusteEstacional = claveRevisionDesempleo(raiz, fecha);
  escribir("public/datos/desempleo/estacional.json", { tasa: 9.8 });
  const inicial = claveRevisionDesempleo(raiz, fecha);
  assert.notEqual(inicial, sinAjusteEstacional);
  escribir("data/desempleo/meta.json", { version: "2026-08", fetched_at: "dos" });
  assert.equal(claveRevisionDesempleo(raiz, fecha), inicial);
  assert.notEqual(claveRevisionDesempleo(raiz, "30-10-2026"), inicial);
  escribir("data/desempleo/nacional.json", [{ p: "2026-08", tasa: 9.7 }]);
  const corregida = claveRevisionDesempleo(raiz, fecha);
  assert.notEqual(corregida, inicial);
  escribir("public/datos/desempleo/diferencias/2026-08.json", { diferencia: 2 });
  assert.notEqual(claveRevisionDesempleo(raiz, fecha), corregida);
});
