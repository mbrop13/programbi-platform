# Cómo escribe Pluma una guía nueva

Las guías viven en `guias/*.md` (nuevas, una por curso × país) y en
`content/guias/**/*.md` (históricas). El Markdown es la fuente editable; React
solo lo renderiza. Después de editar hay que regenerar
`lib/guias/generado.ts` y commitear el resultado.

## 1. Crear el archivo

1. Copia la plantilla que corresponda:
   - `guias/_PLANTILLA-guia-curso-pais.md` — curso × país.
   - `guias/_PLANTILLA_CERTIFICACION.md` — certificaciones (PL-300).
   - `guias/_PLANTILLA_COMPARATIVA.md` — comparativas (A vs B).
2. Renombra el archivo sin el guion bajo inicial. Los archivos que empiezan con
   `_` son plantillas y el build los omite.
3. Usa un nombre estable, por convención `<curso>-<pais>.md`
   (`excel-chile.md`, `curso-analisis-de-datos-bolivia.md`).

## 2. Frontmatter campo por campo

El frontmatter va entre dos líneas `---` al inicio del archivo.

| Campo | Obligatorio | Qué debe llevar |
|---|---|---|
| `slug` | Sí | Identificador único y estable. Forma la URL. No lo cambies si la guía ya está publicada. |
| `ruta_sugerida` | Sí | `/guias/<slug>` para Chile y transversales; `/<pais>/guias/<slug>` para el resto. |
| `pais` | Sí | ISO de `config/paises.ts` (`cl`, `ar`, `mx`, `co`, `pe`, `uy`, `py`, `bo`, `cr`, `ec`, `sv`, `gt`, `do`, `ve`, `hn`, `ni`, `pa`) o `latam` para una guía transversal. |
| `hreflang` | Sí | BCP 47 del mercado (`es-CL`, `es-AR`, `es-MX`…) o `es` si es una única versión en español. |
| `curso` | Sí | Slug del curso al que empuja la guía (`power-bi`, `excel`, `sql-server`, `access`, `python`, `analisis-de-datos`, `claude`…). |
| `url_curso` | Recomendado | URL real de la ficha del curso en ese mercado. Se usa en el JSON-LD. |
| `layout` | No | `comparativa`, `certificacion`, `sueldos` o `curso`. Si falta, se usa el render estándar. |
| `publicar` | No | `false` deja la guía fuera del build sin borrar el archivo. |
| `title` | Sí | Máximo recomendado 60 caracteres. Se usa como `<title>` absoluto. |
| `meta` | Sí | 150–160 caracteres. Se usa como meta description. |
| `h1` | Sí | Un solo H1, distinto del `title`; debe repetirse como primer `#` del cuerpo. |
| `updated` | Sí | Fecha ISO `YYYY-MM-DD` de la última revisión de datos. |
| `sources` | Recomendado | Lista de URLs reales consultadas. Se muestran al pie y en el JSON-LD. |
| `nota_hermes` | Recomendado | Instrucciones internas. Debe incluir `ELEMENTO VISUAL: …` con la tabla o gráfico sugerido. |

### Reglas de país y ruta

- Chile y las guías transversales (`latam` → `transversal`) viven en
  `/guias/<slug>`.
- Cualquier otro país vive en `/<pais>/guias/<slug>`.
- El país debe existir en `config/paises.ts`. Si no, el build falla con un
  mensaje que pide agregarlo.
- `pais: latam` se normaliza a `transversal`; no lo cambies a mano en el
  generado.

## 3. Cuerpo de la guía

Estructura mínima (mira las plantillas):

1. `# H1` igual al `h1` del frontmatter.
2. **Respuesta corta** en los dos primeros párrafos: debe poder citarse sola
   (GEO) y no inventar cifras.
3. Secciones `##` con el desarrollo, tablas y ejemplos locales.
4. Marcadores de CTA en su propia línea:
   `**[CTA-TOP]** — texto`, `**[CTA-MID]** — texto`, `**[CTA-END]** — texto`.
   El build los convierte en `<!-- CTA-TOP -->`, etc.
5. Precio con `{precio_local}` (o `{{precio}}`). Nunca escribas el monto a mano:
   el renderizador lo resuelve desde `config/pricing.ts`.
6. `## Preguntas frecuentes` con al menos 4 preguntas en negrita terminadas en
   `?`. La respuesta va en el párrafo siguiente. Esas mismas preguntas forman el
   `FAQPage`.
7. `nota_hermes` con `ELEMENTO VISUAL:` y la intención de búsqueda.

## 4. Publicar

```bash
node scripts/build-guias.mjs
node scripts/verificar-guias.mjs
```

`build-guias.mjs`:

- Lee `content/guias/**/*.md` y `guias/*.md` en ese orden.
- Omite archivos que empiezan con `_` y los que tienen `publicar: false`.
- Normaliza `latam` a `transversal`.
- Extrae FAQ, CTA, fuentes y `ELEMENTO VISUAL`.
- Valida campos obligatorios, país, `layout` y reglas de ruta.
- Falla con un error claro si hay rutas duplicadas o frontmatter incompleto.
- Regenera `lib/guias/generado.ts`.

Después del build, revisa el resumen que imprime (FAQ y palabras por guía),
commitea el `.md` nuevo y `lib/guias/generado.ts` juntos.

## 5. Qué valida el verificador

`node scripts/verificar-guias.mjs` mide contenido casi duplicado con shingles de
5 palabras y límite de 30 %:

- **Modo histórico:** todos los pares de `content/guias/pais/*.md`.
- **Modo nuevo:** variantes de país del mismo curso y tema en `guias/*.md`
  (agrupa por `curso` + slug sin sufijo de país). Reporta las parejas que
  superan el 30 % y el peor par de cada grupo.
- Sale con código 1 si algún par supera el límite, en cualquiera de los dos
  modos.

Si dos variantes se parecen demasiado, reescribe ejemplos, contexto local,
temario o FAQ de una de ellas; no bajes el umbral.
