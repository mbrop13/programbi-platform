/**
 * Anclas estables para los títulos del cuerpo de una guía.
 *
 * Las usan `GuiaMarkdown` (para poner el `id` en cada H2) y `IndiceGuia`
 * (para construir el índice lateral). Tienen que producir exactamente el mismo
 * slug con el mismo texto; por eso viven en un solo archivo.
 */
export function slugAncla(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .slice(0, 60)
    .replace(/-$/, "");
}

/** Extrae los H2 del Markdown del cuerpo, en orden, sin los marcadores de CTA. */
export function encabezadosDeGuia(body: string): { id: string; texto: string }[] {
  const out: { id: string; texto: string }[] = [];
  const vistos = new Set<string>();
  for (const linea of body.split("\n")) {
    const match = linea.match(/^##\s+(.+?)\s*$/);
    if (!match) continue;
    const texto = match[1].replace(/[*_`]/g, "").trim();
    if (!texto || /^preguntas frecuentes$/i.test(texto)) continue;
    let id = slugAncla(texto);
    if (!id) continue;
    if (vistos.has(id)) {
      let n = 2;
      while (vistos.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    vistos.add(id);
    out.push({ id, texto });
  }
  return out;
}

/** Texto plano de los nodos de React (para calcular el id de un encabezado). */
export function textoDeNodos(nodos: unknown): string {
  if (nodos == null || typeof nodos === "boolean") return "";
  if (typeof nodos === "string" || typeof nodos === "number") return String(nodos);
  if (Array.isArray(nodos)) return nodos.map(textoDeNodos).join("");
  if (typeof nodos === "object" && "props" in (nodos as Record<string, unknown>)) {
    const props = (nodos as { props?: { children?: unknown } }).props;
    return textoDeNodos(props?.children);
  }
  return "";
}
