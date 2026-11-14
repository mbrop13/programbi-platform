import type { Metadata } from "next";
import { getPais, ISO_CHILE } from "@/config/paises";
import { miembroPorCurso } from "@/lib/data/equipo";
import { alternatesDeGuia } from "@/lib/guias";
import { fichaCurso } from "@/lib/guias/curso";
import { ilustracionDeGuia } from "@/lib/guias/ilustraciones";
import { nombreCurso } from "@/lib/guias/opciones";
import { metaDescripcionGuia, sinMontosDeCurso } from "@/lib/guias/precio";
import type { Guia } from "@/lib/guias/tipos";
import { robotsLocal } from "@/lib/paises/metadata";
import { localeOg } from "@/lib/paises/rutas";
import { absoluteUrl, pageOg } from "@/lib/seo";

/**
 * Metadatos completos para cualquier guía (`/guias/[slug]` y `/[pais]/guias/[slug]`).
 * Garantiza descripción <= 155 caracteres sin montos de curso, imagen OG
 * personalizada vía `/og` + `summary_large_image` para Twitter/LinkedIn/WhatsApp,
 * metadata de artículo (`publishedTime`/`modifiedTime`/`authors`) y `hreflang`.
 */
export function metadataDeGuia(guia: Guia, indexable: boolean): Metadata {
  const iso = guia.country === "transversal" ? ISO_CHILE : guia.country;
  const lugar = guia.country === "transversal" ? "Latinoamérica" : getPais(iso).nombre;
  const title = sinMontosDeCurso(guia.title);
  const description = metaDescripcionGuia(guia.description, 155);
  const curso = fichaCurso(guia.course);
  const cursoLabel = guia.course === "general" ? "Datos y BI" : nombreCurso(guia.course);
  const instructor = miembroPorCurso(guia.course === "general" ? "power-bi" : guia.course);
  const ilustracion = ilustracionDeGuia(guia);

  const share = pageOg({
    title: guia.h1 || title,
    description,
    path: guia.path,
    kicker: `Guía práctica · ${cursoLabel}`,
    tags: [cursoLabel, lugar, `${new Date(guia.updated).getFullYear()}`],
    alt: ilustracion.alt,
    accent: curso.accentColor,
  });

  const alternates = alternatesDeGuia(guia);
  const canonical = absoluteUrl(guia.path);
  const images = [
    ...share.images,
    {
      url: absoluteUrl(ilustracion.src),
      width: ilustracion.width,
      height: ilustracion.height,
      alt: ilustracion.alt,
    },
  ];

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      ...((guia.country === "transversal" || indexable) && alternates ? { languages: alternates } : {}),
    },
    ...(guia.country !== "cl" && guia.country !== "transversal" && !indexable ? { robots: robotsLocal(iso) } : {}),
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      locale: guia.country === "transversal" ? "es_CL" : localeOg(iso),
      siteName: "ProgramBI",
      publishedTime: guia.updated,
      modifiedTime: guia.updated,
      authors: [instructor.nombre],
      tags: [cursoLabel, lugar, "ProgramBI"],
      images,
    },
    twitter: share.twitter,
  };
}
