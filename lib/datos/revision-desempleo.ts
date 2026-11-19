import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Las URLs de recursos deben cambiar también ante correcciones del mismo mes.
// Se calcula desde los datos publicados, no desde fetched_at (que cambia en cada descarga).
export function claveRevisionDesempleo(raiz: string, fechaIne: string): string {
  const hash = createHash("sha256");
  const incluir = (ruta: string) => {
    const bytes = readFileSync(join(raiz, ruta));
    hash.update(`${ruta}:${bytes.length}:`);
    hash.update(bytes);
  };
  const directorio = (ruta: string) => {
    const entradas = readdirSync(join(raiz, ruta), { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name, "en"));
    for (const entrada of entradas) {
      const archivo = `${ruta}/${entrada.name}`;
      if (entrada.isDirectory()) directorio(archivo);
      else if (entrada.isFile() && entrada.name.endsWith(".json") && archivo !== "data/desempleo/meta.json") incluir(archivo);
    }
  };
  hash.update(fechaIne);
  directorio("data/desempleo");
  incluir("public/datos/desempleo/explorador.json");
  const estacional = "public/datos/desempleo/estacional.json";
  if (existsSync(join(raiz, estacional))) incluir(estacional);
  directorio("public/datos/desempleo/diferencias");
  return hash.digest("hex").slice(0, 20);
}
