import { slugAncla } from "@/lib/guias/anclas";

export type ItemIndice = {
  id: string;
  texto: string;
  /** Nivel semántico con el que se renderiza el título en el cuerpo. */
  nivel: 2 | 3;
};

/** Tope de seguridad: un índice de 40 ítems deja de ser útil y pesa en el HTML. */
const MAX_ITEMS = 30;

/**
 * Encabezados visibles del cuerpo de una guía, con su jerarquía.
 *
 * Las guías nuevas usan `##` para las secciones; las más antiguas vienen de
 * Pluma con `#####` (que `GuiaMarkdown` renderiza como H2). Los `###`, `####` y
 * `######` se convierten en H3 para que el índice pueda anidarlos.
 *
 * Los ids se deduplican igual que en el cuerpo: si dos títulos se llaman igual,
 * el segundo lleva sufijo `-2`.
 */
export function encabezadosVisibles(body: string): ItemIndice[] {
  const out: ItemIndice[] = [];
  const vistos = new Set<string>();
  let hayH2 = false;

  for (const linea of body.split("\n")) {
    const match = linea.match(/^(#{2,6})\s+(.+?)\s*$/);
    if (!match) continue;

    const nivelMd = match[1].length;
    const nivel: 2 | 3 = nivelMd === 2 || nivelMd === 5 ? 2 : 3;
    // Un H3 suelto al principio (sin H2 que lo contenga) no se indenta.
    if (nivel === 3 && !hayH2) continue;

    const texto = match[2].replace(/[*_`]/g, "").trim();
    if (!texto || /^preguntas frecuentes$/i.test(texto)) continue;

    let id = slugAncla(texto);
    if (!id) continue;

    if (vistos.has(id)) {
      let n = 2;
      while (vistos.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }

    vistos.add(id);
    if (nivel === 2) hayH2 = true;
    out.push({ id, texto, nivel });

    if (out.length >= MAX_ITEMS) break;
  }

  return out;
}
