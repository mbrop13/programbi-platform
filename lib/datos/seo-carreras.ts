import type { Metadata } from "next";
import { ORG_ID, SITE_URL } from "@/lib/seo";
import {
  getMetaCarreras,
  TIPO_ETIQUETAS,
  tipoPrincipalDeCarrera,
  type CarreraRecord,
  type TipoIesKey,
} from "./carreras";
import { millonesCorto, pesos, porcentaje } from "./formato";
import { PRESETS_MAP, type PresetSlug } from "./presets";

export interface MigajaDatos {
  label: string;
  path: string;
}

export const MIGAS_BASE: readonly MigajaDatos[] = [
  { label: "Inicio", path: "/" },
  { label: "Datos de Chile", path: "/datos" },
  { label: "Carreras", path: "/datos/carreras" },
];

/** Recorta un título a ≤ 60 caracteres sin dejar palabras cortadas ni signos colgantes. */
export function ajustarTitulo(base: string, conMarca = true, max = 60): string {
  const limpio = base.replace(/\s+/g, " ").trim();
  const sufijo = " | ProgramBI";
  if (conMarca && limpio.length + sufijo.length <= max) {
    return `${limpio}${sufijo}`;
  }
  if (limpio.length <= max) return limpio;
  let corte = limpio.slice(0, max).trim();
  const lastSpace = corte.lastIndexOf(" ");
  if (lastSpace >= Math.floor(max * 0.55)) corte = corte.slice(0, lastSpace);
  return corte.replace(/[\s:;,.\-–—|]+$/, "");
}

/** Rango objetivo de una meta description (Google muestra ~155–160). */
const DESC_MIN = 140;
const DESC_MAX = 158;

/**
 * Palabras con las que una description NUNCA debe terminar (preposiciones,
 * conjunciones y artículos): dejan la frase colgada tipo «…aranceles y.».
 */
const COLA_PROHIBIDA = new Set([
  "a", "ante", "bajo", "cabe", "con", "contra", "de", "desde", "durante", "en",
  "entre", "hacia", "hasta", "mediante", "para", "por", "según", "sin", "so",
  "sobre", "tras", "y", "e", "o", "u", "ni", "que", "el", "la", "los", "las",
  "un", "una", "unos", "unas", "del", "al",
]);

/**
 * Colas de relleno: frases COMPLETAS (terminan en palabra contenido) ordenadas
 * de corta a larga. Se agrega la más larga que quepa en el rango, nunca un
 * fragmento suelto tipo «…y.» ni «…por.».
 */
const COLAS_DESCRIPTION = [
  "Datos de Chile.",
  "Cifras de Chile.",
  "Fuente: SIES, Mineduc.",
  "Datos oficiales de Chile.",
  "Cifras oficiales, gratis y sin registro.",
  "Datos oficiales de Chile, gratis y sin registro.",
  "Fuente: mifuturo.cl (SIES, Mineduc) en Chile.",
  "Revisa y descarga las cifras oficiales de Chile en ProgramBI.",
  "Consulta las cifras oficiales de Chile y descárgalas gratis en ProgramBI.",
  "Explora las cifras oficiales de Chile, compáralas y descárgalas gratis en ProgramBI.",
  "Datos oficiales de Chile: explora las cifras, compáralas y descárgalas gratis en ProgramBI.",
];

function normalizarDesc(texto: string): string {
  return texto.replace(/\s+/g, " ").trim();
}

/** Última palabra significativa (sin puntuación ni signos), en minúsculas. */
function ultimaPalabraDesc(texto: string): string {
  const sinPunto = texto.replace(/[.,;:!?\-–—…]+$/, "").trim();
  if (!sinPunto) return "";
  const palabra = sinPunto.split(" ").pop() ?? "";
  return palabra.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").toLowerCase();
}

function colaProhibida(texto: string): boolean {
  return COLA_PROHIBIDA.has(ultimaPalabraDesc(texto));
}

/** Cierra con punto, sin dejar comas/guiones/puntos colgantes antes. */
function cerrarPunto(texto: string): string {
  return texto.replace(/[\s.,;:\-–—]+$/, "") + ".";
}

/**
 * Recorta un texto largo a [MIN, MAX]: prioriza el último fin de frase (. o ;)
 * dentro del rango; si no, corta por palabra y retrocede mientras la última
 * palabra sea prohibida. Siempre termina en punto y en palabra contenido.
 */
function recortarFrase(base: string): string {
  let mejor: string | null = null;
  for (const m of base.matchAll(/[.;](?=\s|$)/g)) {
    const fin = (m.index ?? 0) + 1;
    if (fin >= DESC_MIN && fin <= DESC_MAX) {
      let frag = base.slice(0, fin).replace(/\s+$/, "");
      if (frag.endsWith(";")) frag = frag.slice(0, -1).replace(/\s+$/, "") + ".";
      if (!colaProhibida(frag)) mejor = frag;
    }
  }
  if (mejor) return mejor;

  let corte = base.slice(0, DESC_MAX).replace(/\s+$/, "");
  const lastSpace = corte.lastIndexOf(" ");
  if (lastSpace >= Math.floor(DESC_MAX * 0.6)) corte = corte.slice(0, lastSpace);
  while (colaProhibida(corte) && corte.includes(" ")) {
    corte = corte.slice(0, corte.lastIndexOf(" ")).replace(/\s+$/, "");
  }
  return cerrarPunto(corte);
}

/** Agrega la cola completa más larga que deje el total dentro del rango. */
function rellenarCola(base: string): string | null {
  const conPunto = base.endsWith(".") ? base : cerrarPunto(base);
  let elegida: string | null = null;
  for (const cola of COLAS_DESCRIPTION) {
    const total = conPunto.length + 1 + cola.length;
    if (total >= DESC_MIN && total <= DESC_MAX) elegida = cola;
  }
  return elegida ? `${conPunto} ${elegida}` : null;
}

/** Da forma a una base: recorta si sobra, rellena si falta, sanea la cola. */
function darFormaDesc(base: string): string | null {
  if (base.length > DESC_MAX) {
    const r = recortarFrase(base);
    if (r.length >= DESC_MIN && r.length <= DESC_MAX && !colaProhibida(r)) return r;
    if (r.length < DESC_MIN) return rellenarCola(r);
    return r.length <= DESC_MAX ? r : null;
  }
  if (base.length < DESC_MIN) return rellenarCola(base);
  if (colaProhibida(base)) {
    const r = recortarFrase(base);
    if (r.length >= DESC_MIN && r.length <= DESC_MAX && !colaProhibida(r)) return r;
    return r.length < DESC_MIN ? rellenarCola(r) : null;
  }
  return base.endsWith(".") ? base : cerrarPunto(base);
}

/**
 * Garantiza una description de 140–158 caracteres que termina en frase completa
 * (punto) y NUNCA en preposición/conjunción/artículo. Prioriza candidatos
 * completos dentro del rango; si no, recorta por frase/palabra o rellena con una
 * cola completa. Misma firma pública: la consumen metadataHub/Ficha/Preset/
 * SimpleDatos y app/(marketing)/casos/[slug]/page.tsx.
 */
export function ajustarDescripcion(candidatos: string[], fallbackBase: string): string {
  const pool: string[] = [];
  for (const c of [...candidatos, fallbackBase]) {
    const n = normalizarDesc(c);
    if (n && !pool.includes(n)) pool.push(n);
  }
  if (pool.length === 0) pool.push(normalizarDesc(fallbackBase) || "Datos oficiales de Chile.");

  // 1) Candidato completo ya dentro del rango y con cola válida.
  for (const c of pool) {
    if (c.length >= DESC_MIN && c.length <= DESC_MAX && !colaProhibida(c)) {
      return c.endsWith(".") ? c : cerrarPunto(c);
    }
  }
  // 2) Dar forma a cada base (recorte por frase o relleno con cola completa).
  for (const base of pool) {
    const s = darFormaDesc(base);
    if (s && s.length >= DESC_MIN && s.length <= DESC_MAX && !colaProhibida(s) && s.endsWith(".")) {
      return s;
    }
  }
  // 3) Último recurso: forzar rango sobre la primera base.
  let s = darFormaDesc(pool[0]) ?? pool[0];
  if (s.length > DESC_MAX) s = recortarFrase(s);
  if (s.length < DESC_MIN) {
    const rellena = rellenarCola(s);
    if (rellena) {
      s = rellena;
    } else {
      // Base muy corta: encadena colas completas hasta alcanzar el mínimo.
      s = s.endsWith(".") ? s : cerrarPunto(s);
      while (s.length < DESC_MIN) {
        const caben = COLAS_DESCRIPTION.filter((c) => s.length + 1 + c.length <= DESC_MAX);
        if (caben.length === 0) break;
        s = `${s} ${caben.reduce((a, b) => (b.length > a.length ? b : a))}`;
      }
      if (s.length < DESC_MIN) {
        const larga = COLAS_DESCRIPTION.reduce((a, b) => (b.length > a.length ? b : a));
        while (s.length < DESC_MIN) s = `${s} ${larga}`;
        if (s.length > DESC_MAX) s = recortarFrase(s);
      }
    }
  }
  // Corte duro de emergencia (p. ej. un token único sin espacios > MAX).
  if (s.length > DESC_MAX) s = cerrarPunto(s.slice(0, DESC_MAX - 1));
  if (s.length < DESC_MIN) {
    const filler = "Datos oficiales de Chile.";
    while (s.length < DESC_MIN) s = `${s} ${filler}`.slice(0, DESC_MAX);
    s = cerrarPunto(s);
  }
  return s.endsWith(".") ? s : cerrarPunto(s);
}

export function ogUrlDe(path: string, version: string): string {
  const clean = path === "/" ? "" : path;
  return `${SITE_URL}${clean}/opengraph-image?v=${encodeURIComponent(version)}`;
}

export function metadataHubCarreras(): Metadata {
  const meta = getMetaCarreras();
  const path = "/datos/carreras";
  const conEdicion = `Ranking de carreras en Chile ${meta.edicion}: sueldos y empleo`;
  const title = conEdicion.length <= 60 ? conEdicion : "Ranking de carreras en Chile: sueldos y empleabilidad";
  const description = ajustarDescripcion(
    [
      `Ranking oficial de ${meta.conteos.genericas_unicas} carreras en Chile (${meta.edicion}): sueldos brutos 1.º al 5.º año, empleabilidad y aranceles. Datos oficiales de mifuturo.cl (Mineduc).`,
      `Ranking oficial de ${meta.conteos.genericas_unicas} carreras en Chile (${meta.edicion}): sueldos brutos 1.º al 5.º año, empleabilidad, aranceles y comparador.`,
    ],
    `Ranking oficial de carreras en Chile (${meta.edicion}): sueldos y empleabilidad.`
  );
  const url = `${SITE_URL}${path}`;
  const ogImg = ogUrlDe(path, meta.edicion);
  return {
    title: { absolute: ajustarTitulo(title, false) },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ProgramBI",
      locale: "es_CL",
      url,
      title,
      description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImg] },
  };
}

export function metadataFichaCarrera(carrera: CarreraRecord, indexable: boolean): Metadata {
  const meta = getMetaCarreras();
  const principal = tipoPrincipalDeCarrera(carrera);
  const ing4 = principal?.data.ing[3] ?? null;
  const ing1 = principal?.data.ing[0] ?? null;
  const emp1 = principal?.data.emp1 ?? null;
  const path = `/datos/carreras/${carrera.slug}`;
  const url = `${SITE_URL}${path}`;

  const cortoIng4 = ing4 ? millonesCorto(ing4) : null;
  const candidato1 = cortoIng4
    ? `Sueldo de ${carrera.nombre} en Chile: ${cortoIng4} al 4.º año`
    : `${carrera.nombre}: sueldo y empleabilidad en Chile`;
  const candidato2 = `${carrera.nombre}: sueldo y empleabilidad en Chile`;
  const title =
    candidato1.length <= 60
      ? candidato1
      : candidato2.length <= 60
        ? candidato2
        : ajustarTitulo(carrera.nombre, true);

  const empStr = emp1 !== null ? porcentaje(emp1).replace("\u00a0", " ") : "s/i";
  const ing1Str = ing1 !== null ? pesos(ing1) : "s/i";
  const ing4Str = ing4 !== null ? pesos(ing4) : "s/i";

  const description = ajustarDescripcion(
    [
      `${carrera.nombre}: ${ing1Str} al 1.er año y ${ing4Str} al 4.º año (brutos). Empleabilidad ${empStr}. Datos ${meta.edicion} de mifuturo.cl, aranceles y ranking.`,
      `${carrera.nombre}: sueldo promedio ${ing4Str} al 4.º año y empleabilidad ${empStr} en Chile. Revisa datos ${meta.edicion} de mifuturo.cl, aranceles y ranking.`,
      `${carrera.nombre} en Chile: ingreso ${ing4Str} al 4.º año, empleabilidad ${empStr}. Datos oficiales ${meta.edicion} de mifuturo.cl, instituciones y comparador.`,
    ],
    `${carrera.nombre} en Chile: sueldos brutos, empleabilidad, percentiles y oferta por institución según mifuturo.cl.`
  );

  const ogImg = ogUrlDe(path, meta.edicion);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "article",
      siteName: "ProgramBI",
      locale: "es_CL",
      url,
      title,
      description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImg] },
  };
}

export function metadataPreset(preset: PresetSlug): Metadata {
  const meta = getMetaCarreras();
  const def = PRESETS_MAP[preset];
  const path = `/datos/carreras/${preset}`;
  const url = `${SITE_URL}${path}`;
  const title = ajustarTitulo(def.titleSeo, false);
  const description = ajustarDescripcion([def.descriptionSeo], def.descriptionSeo);
  const ogImg = ogUrlDe(path, meta.edicion);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ProgramBI",
      locale: "es_CL",
      url,
      title,
      description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImg] },
  };
}

export function metadataSimpleDatos({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const meta = getMetaCarreras();
  const url = `${SITE_URL}${path}`;
  const finalTitle = ajustarTitulo(title, false);
  const finalDesc = ajustarDescripcion([description], description);
  const ogImg = ogUrlDe(path, meta.edicion);
  return {
    title: { absolute: finalTitle },
    description: finalDesc,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ProgramBI",
      locale: "es_CL",
      url,
      title: finalTitle,
      description: finalDesc,
      images: [{ url: ogImg, width: 1200, height: 630, alt: finalTitle }],
    },
    twitter: { card: "summary_large_image", title: finalTitle, description: finalDesc, images: [ogImg] },
  };
}

export function breadcrumbsSchema(migas: readonly MigajaDatos[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: m.label,
      item: `${SITE_URL}${m.path === "/" ? "" : m.path}`,
    })),
  };
}

export function faqPageSchema(faqs: readonly { pregunta: string; respuesta: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta },
    })),
  };
}

export function itemListSchema(
  name: string,
  items: readonly { nombre: string; slug: string; tipo?: TipoIesKey }[]
) {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.tipo ? `${item.nombre} (${TIPO_ETIQUETAS[item.tipo].corto})` : item.nombre,
      url: `${SITE_URL}/datos/carreras/${item.slug}`,
    })),
  };
}

export function datasetCarrerasSchema(opts: {
  path: string;
  name: string;
  description: string;
}) {
  const meta = getMetaCarreras();
  const url = `${SITE_URL}${opts.path}`;
  return {
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: "es-CL",
    creator: { "@type": "Organization", "@id": ORG_ID, name: "ProgramBI" },
    isBasedOn: meta.fuentes.slice(0, 3).map((f) => f.url),
    usageInfo: "https://www.mifuturo.cl/mi-futuro-buscadores/",
    creditText: `Fuente: Elaboración propia a partir de base publicada en www.mifuturo.cl (Mineduc), edición ${meta.edicion}.`,
    temporalCoverage: "2022/2024",
    spatialCoverage: { "@type": "Country", name: "Chile" },
    dateModified: meta.fetched_at.slice(0, 10),
    variableMeasured: [
      "Ingreso promedio bruto mensual 1.º al 5.º año (CLP de septiembre de 2025)",
      "Empleabilidad 1.er y 2.º año (%)",
      "Duración formal y real (semestres)",
      "Arancel anual 2026 (CLP)",
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Ranking de carreras en Chile (CSV)",
        encodingFormat: "text/csv",
        contentUrl: `${SITE_URL}/datos/carreras/csv/ranking-carreras.csv`,
      },
      {
        "@type": "DataDownload",
        name: "Carreras por institución en Chile (CSV)",
        encodingFormat: "text/csv",
        contentUrl: `${SITE_URL}/datos/carreras/csv/carreras-instituciones.csv`,
      },
    ],
  };
}

export function webAppSchema(opts: { path: string; name: string; description: string }) {
  return {
    "@type": "WebApplication",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    isAccessibleForFree: true,
    inLanguage: "es-CL",
  };
}
