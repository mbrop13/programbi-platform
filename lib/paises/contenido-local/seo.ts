import type { Metadata } from "next";
import type { RutaBloqueLocal } from "./tipos";

/**
 * Title y meta description propios de WS8 para Argentina y Colombia.
 *
 * Límites: el title final incluye « | ProgramBI» y no supera 60 caracteres
 * (el mismo tope de `lib/seo.ts`). La descripción no repite montos: el valor
 * se consulta en el brochure PDF por la regla del gate de precios.
 */
export type SeoLocal = {
  title: string;
  description: string;
};

const SEO: Record<string, Partial<Record<RutaBloqueLocal, SeoLocal>>> = {
  ar: {
    hub: {
      title: "Cursos de datos en vivo en Argentina | ProgramBI",
      description:
        "Cursos en vivo de análisis de datos, Power BI y SQL para profesionales de Argentina: horario de Buenos Aires, precios en ARS y 3 cuotas sin interés.",
    },
    cursos: {
      title: "Cursos Power BI y datos en Argentina | ProgramBI",
      description:
        "Catálogo en vivo para Argentina: Power BI, SQL, Python y análisis de datos. Horario de Buenos Aires, precios en ARS y proyecto final con certificado.",
    },
    "curso:power-bi": {
      title: "Curso Power BI en vivo en Argentina | ProgramBI",
      description:
        "Curso Power BI en vivo para Argentina: Power Query, modelo estrella y DAX en 20 horas. Horario de Buenos Aires, valor en ARS y 3 cuotas sin interés.",
    },
    "curso:analisis-de-datos": {
      title: "Curso de análisis de datos en Argentina | ProgramBI",
      description:
        "Análisis de datos en vivo para Argentina: SQL Server, Power BI y Python en dos niveles de 60 horas. Horario local, valor en ARS y certificado.",
    },
    "curso:python": {
      title: "Curso de Python para datos en Argentina | ProgramBI",
      description:
        "Python para datos en vivo para Argentina: Pandas, visualización y automatización de reportes. Horario de Buenos Aires, valor en ARS y 3 cuotas.",
    },
    empresas: {
      title: "Capacitación in-company en Argentina | ProgramBI",
      description:
        "Capacitación in-company para empresas de Argentina: Power BI, SQL, Python e IA con los datos del equipo, en vivo y con factura corporativa.",
    },
    precios: {
      title: "Precios de cursos en Argentina | ProgramBI",
      description:
        "Precios de los cursos en vivo para Argentina: valores en ARS, brochure por curso, medios de pago y 3 cuotas sin interés. Sin letra chica.",
    },
  },
  co: {
    hub: {
      title: "Cursos de datos en vivo en Colombia | ProgramBI",
      description:
        "Formación en vivo en Power BI, análisis de datos y Python para profesionales de Colombia: horario de Bogotá, precios en COP y 3 cuotas sin interés.",
    },
    cursos: {
      title: "Cursos Power BI y datos en Colombia | ProgramBI",
      description:
        "Catálogo en vivo para Colombia: Power BI, SQL, Python y análisis de datos. Horario de Bogotá, precios en COP, proyecto final y certificado.",
    },
    "curso:power-bi": {
      title: "Curso Power BI en vivo en Colombia | ProgramBI",
      description:
        "Curso Power BI en vivo para Colombia: Power Query, modelo estrella y DAX en 20 horas. Horario de Bogotá, valor en COP y 3 cuotas sin interés.",
    },
    "curso:analisis-de-datos": {
      title: "Curso de análisis de datos en Colombia | ProgramBI",
      description:
        "Análisis de datos en vivo para Colombia: SQL Server, Power BI y Python en dos niveles de 60 horas. Horario de Bogotá, valor en COP y certificado.",
    },
    "curso:python": {
      title: "Curso de Python para datos en Colombia | ProgramBI",
      description:
        "Python para datos en vivo para Colombia: Pandas, visualización y automatización de reportes. Horario de Bogotá, valor en COP y 3 cuotas sin interés.",
    },
    empresas: {
      title: "Capacitación in-company en Colombia | ProgramBI",
      description:
        "Capacitación in-company para empresas de Colombia: Power BI, SQL, Python e IA con los datos del equipo, en vivo y con factura corporativa.",
    },
    precios: {
      title: "Precios de cursos en Colombia | ProgramBI",
      description:
        "Precios de los cursos en vivo para Colombia: valores en COP, brochure por curso, medios de pago como PSE o Nequi y 3 cuotas sin interés.",
    },
  },
};

export function getSeoLocal(
  iso: string | null | undefined,
  ruta: RutaBloqueLocal
): SeoLocal | null {
  if (!iso) return null;
  return SEO[iso]?.[ruta] ?? null;
}

/**
 * Aplica el title y la description locales sobre los metadatos que ya armó la
 * página (canonical, hreflang, imágenes OG y Twitter se conservan).
 */
export function aplicarSeoLocal(
  metadata: Metadata,
  iso: string | null | undefined,
  ruta: RutaBloqueLocal
): Metadata {
  const seo = getSeoLocal(iso, ruta);
  if (!seo) return metadata;

  const openGraph =
    metadata.openGraph && typeof metadata.openGraph === "object"
      ? { ...metadata.openGraph, title: seo.title, description: seo.description }
      : metadata.openGraph;
  const twitter =
    metadata.twitter && typeof metadata.twitter === "object"
      ? { ...metadata.twitter, title: seo.title, description: seo.description }
      : metadata.twitter;

  return {
    ...metadata,
    title: { absolute: seo.title },
    description: seo.description,
    openGraph,
    twitter,
  };
}
