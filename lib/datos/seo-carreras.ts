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

/** Garantiza description entre 140 y 155 caracteres. */
export function ajustarDescripcion(candidatos: string[], fallbackBase: string): string {
  for (const c of candidatos) {
    const t = c.replace(/\s+/g, " ").trim();
    if (t.length >= 140 && t.length <= 155) return t;
  }
  const base = (candidatos[0] ?? fallbackBase).replace(/\s+/g, " ").trim();
  if (base.length > 155) {
    let corte = base.slice(0, 154).trim();
    const lastSpace = corte.lastIndexOf(" ");
    if (lastSpace > 130) corte = corte.slice(0, lastSpace);
    return corte.replace(/[\s,;:.\-–—]+$/, "") + ".";
  }
  const relleno = " Revisa sueldos oficiales por año, percentiles P10-P90, instituciones y aranceles 2026 en ProgramBI.";
  const unido = `${base}${relleno}`;
  let corte = unido.slice(0, 154).trim();
  const lastSpace = corte.lastIndexOf(" ");
  if (lastSpace > 135) corte = corte.slice(0, lastSpace);
  return corte.replace(/[\s,;:.\-–—]+$/, "") + ".";
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
