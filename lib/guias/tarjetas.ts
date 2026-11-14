import { getPais } from "@/config/paises";
import { getCourseBySlug } from "@/lib/data/courses";
import { ilustracionDeGuia, tiempoLecturaMinutos } from "@/lib/guias/ilustraciones";
import { fechaActualizado, metaDescripcionGuia, sinMontosDeCurso } from "@/lib/guias/precio";
import { nombreCurso, ordenPais } from "@/lib/guias/opciones";
import type { TarjetaGuia } from "@/lib/guias/hub";
import type { Guia } from "@/lib/guias/tipos";

/**
 * Las guías publicadas viven en `/guias/<slug>` o `/<pais>/guias/<slug>`.
 */
const RUTA_GUIA = /^\/(?:[a-z]{2}\/)?guias\/[^/]+$/;

export function esRutaDeGuia(guia: Pick<Guia, "path">): boolean {
  return RUTA_GUIA.test(guia.path);
}

/** Proyecta una guía completa a lo que necesita la tarjeta del hub. */
export function tarjetaDeGuia(guia: Guia): TarjetaGuia {
  const mercado =
    guia.country === "transversal" ? "Latinoamérica" : getPais(guia.country).nombre;
  const curso = getCourseBySlug(guia.course);
  return {
    path: guia.path,
    // El hub no publica montos: el arancel vive en el brochure PDF del curso.
    title: sinMontosDeCurso(guia.title),
    h1: sinMontosDeCurso(guia.h1),
    description: metaDescripcionGuia(guia.description, 155),
    course: guia.course,
    courseName: nombreCurso(guia.course),
    country: guia.country,
    countryName: mercado,
    countryOrder: ordenPais(guia.country),
    updated: guia.updated,
    updatedLabel: fechaActualizado(guia.updated),
    imageUrl: curso?.imageUrl,
    accentColor: curso?.accentColor ?? "#171716",
    readingMinutes: tiempoLecturaMinutos(guia.body),
    guideImage: ilustracionDeGuia(guia).src,
  };
}

/** Guías reales del hub, sin cuerpos Markdown ni metadatos de la página. */
export function tarjetasDeGuias(guias: Guia[]): TarjetaGuia[] {
  return guias.filter(esRutaDeGuia).map(tarjetaDeGuia);
}
