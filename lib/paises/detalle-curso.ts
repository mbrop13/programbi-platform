/**
 * Detalle local de una ficha de curso: horario en la hora del país y FAQs
 * localizadas para el pie de página (horario, certificado y precio vigente).
 */

import { getPais, ISO_CHILE, normalizarPais, SLUGS_CURSO, type Pais } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import { courseDurationHours, getCourseBySlug } from "@/lib/data/courses";
import { catalogHours, publicLevelCount } from "@/lib/data/course-views";
import { etiquetaHoraLocal, horarioLocal, type HorarioLocal } from "@/lib/paises/horarios";
import {
  formatMoneda,
  muestraPrecioLocal,
  porcentajeDescuento,
  precioCurso,
  precioListaVenta,
  precioVenta,
  type PromocionAplicable,
} from "@/lib/paises/precios";

export type DetalleCursoLocal = {
  pais: Pais;
  horario: HorarioLocal;
  /** Preguntas del mercado para el bloque FAQ inferior y su FAQPage JSON-LD. */
  faqs: { q: string; a: string }[];
};

function montoConMoneda(pais: Pais, monto: number): string {
  const formatted = formatMoneda(pais.iso, monto);
  return formatted.includes(pais.moneda) ? formatted : `${formatted} ${pais.moneda}`;
}

function formatoConLista(
  pais: Pais,
  precio: number,
  lista: number | null,
): string {
  const descuento = lista != null ? porcentajeDescuento(lista, precio) : 0;
  const base = montoConMoneda(pais, precio);
  if (lista == null || descuento <= 0) return base;
  return `${base} (precio normal de lista ${montoConMoneda(pais, lista)}, ${descuento}% de descuento)`;
}

/**
 * Resumen de precio vigente de un curso en un país para FAQs inferiores y FAQPage JSON-LD.
 * Respeta la diferencia entre programas de nivel único y cursos de dos niveles.
 */
export function resumenPrecioCursoTexto(
  iso: string | null | undefined,
  slug: string,
  courseTitle?: string,
  promotions?: readonly PromocionAplicable[],
): string {
  const pais = getPais(normalizarPais(iso));
  const precio = precioVenta(pais.iso, slug, promotions);
  const course = getCourseBySlug(slug);
  const titulo = courseTitle ?? course?.title ?? "Este curso";
  const lugar = pais.iso === ISO_CHILE ? "Chile" : pais.nombre;

  if (precio == null) {
    return `En ${lugar} todavía no hay un valor público publicado para ${titulo}; el arancel vigente, los medios de pago locales y la fecha de inicio se consultan directamente por WhatsApp. También puedes descargar arriba el PDF completo con el temario del curso.`;
  }

  const lista = precioListaVenta(pais.iso, slug, promotions);
  const descuento = lista != null ? porcentajeDescuento(lista, precio) : 0;
  const niveles = course ? publicLevelCount(course) : 2;
  const horas = course ? catalogHours(course) : courseDurationHours(slug);
  const cuotas = textoCuotas(pais.iso);

  const montoBase = montoConMoneda(pais, precio);
  const detalleLista =
    lista != null && descuento > 0
      ? ` (precio normal de lista ${montoConMoneda(pais, lista)}, ${descuento}% de descuento vigente)`
      : "";
  const estructura =
    niveles === 1
      ? `${titulo} en ${lugar} es un programa de nivel único de ${horas} horas en vivo. El valor vigente es ${montoBase}${detalleLista}`
      : `${titulo} en ${lugar} se dicta en 2 niveles independientes de ${horas} horas en vivo cada uno (Básico-Intermedio y Avanzado). El valor vigente por nivel es ${montoBase}${detalleLista}`;
  const parteCuotas = cuotas ? `, con pago disponible en ${cuotas}` : "";

  return `${estructura}${parteCuotas}. Arriba puedes descargar el PDF completo con el temario, los enlaces de pago y los valores de combos con varios cursos.`;
}

/**
 * Resumen de precios vigentes del catálogo completo en un país para FAQs de /precios, /faq y landings locales.
 */
export function resumenPreciosCatalogo(
  iso: string | null | undefined,
  promotions?: readonly PromocionAplicable[],
): string {
  const pais = getPais(normalizarPais(iso));
  const pEstandar = precioVenta(pais.iso, "power-bi", promotions);

  if (pEstandar == null) {
    return `En ${pais.nombre} no hay un valor público publicado todavía; los aranceles vigentes, los medios de pago locales y el PDF de temario y precios de cada curso se consultan por WhatsApp.`;
  }

  const estandarTexto = formatoConLista(
    pais,
    pEstandar,
    precioListaVenta(pais.iso, "power-bi", promotions),
  );
  const pAnalisis = precioVenta(pais.iso, "analisis-de-datos", promotions);
  const analisisTexto =
    pAnalisis != null
      ? formatoConLista(pais, pAnalisis, precioListaVenta(pais.iso, "analisis-de-datos", promotions))
      : null;
  const pFinanciero = precioVenta(pais.iso, "mercado-financiero", promotions);
  const financieroTexto =
    pFinanciero != null
      ? formatoConLista(pais, pFinanciero, precioListaVenta(pais.iso, "mercado-financiero", promotions))
      : null;
  const cuotas = textoCuotas(pais.iso);

  const hEstandar = courseDurationHours("power-bi");
  const hAnalisis = courseDurationHours("analisis-de-datos");
  const hMineria = courseDurationHours("analitica-mineria");
  const hFinanciero = courseDurationHours("mercado-financiero");

  const partes = [
    `En ${pais.nombre}, los cursos en vivo de ${hEstandar} horas por nivel (Power BI, Excel, SQL Server, Python y Machine Learning, con 2 niveles: Básico-Intermedio y Avanzado) y los programas de nivel único de ${hEstandar} horas (Copilot, Claude, Power Automate, IA en Productividad y Access) tienen un valor vigente de ${estandarTexto}.`,
  ];
  if (analisisTexto) {
    partes.push(
      `Análisis de Datos (${hAnalisis} horas por nivel, 2 niveles) y Análisis de Datos para la Minería (${hMineria} horas por nivel, 2 niveles) valen ${analisisTexto} por nivel.`,
    );
  }
  if (financieroTexto) {
    partes.push(
      `El programa Mercado Financiero con Python, Power BI y SQL (nivel único de ${hFinanciero} horas) vale ${financieroTexto}.`,
    );
  }
  partes.push(
    `Todos los precios están expresados en ${pais.moneda}${cuotas ? ` y se pueden pagar en ${cuotas}` : ""}. Descarga arriba el PDF de temario y precios de cualquier curso para ver enlaces de pago y combos multicurso.`,
  );

  return partes.join(" ");
}

/** Número con separador local y el código de moneda: "$2.190 MXN". */
export function montoConCodigo(iso: string | null | undefined, monto: number): string {
  const pais = getPais(normalizarPais(iso));
  const numero = new Intl.NumberFormat(pais.locale, {
    minimumFractionDigits: pais.decimales,
    maximumFractionDigits: pais.decimales,
  }).format(monto);
  return `${pais.simbolo}${numero} ${pais.moneda}`;
}

/** Precio de cada curso para el HTML de un mercado local. Vacío fuera de esos países. */
export function textosPreciosLocales(iso: string | null | undefined): Record<string, string> {
  if (!muestraPrecioLocal(iso)) return {};
  const textos: Record<string, string> = {};
  for (const slug of SLUGS_CURSO) {
    const monto = precioCurso(iso, slug);
    if (monto != null) textos[slug] = montoConCodigo(iso, monto);
  }
  return textos;
}

export function detalleCursoLocal(opts: {
  iso: string | null | undefined;
  /** Slug del curso para agregar la FAQ de precio vigente al pie. */
  slug?: string;
  /** Título visible del curso. */
  courseTitle?: string;
  /** Hora de inicio y fin de la clase en Chile. */
  inicio?: string;
  fin?: string;
  /** Fecha de referencia para el desfase horario. */
  referencia?: Date;
  promotions?: readonly PromocionAplicable[];
}): DetalleCursoLocal {
  const pais = getPais(normalizarPais(opts.iso));
  const horario = horarioLocal(pais.iso, {
    inicio: opts.inicio,
    fin: opts.fin,
    referencia: opts.referencia,
  });

  const esChile = pais.iso === ISO_CHILE;
  const lugar = esChile ? "Chile" : pais.nombre;

  const horaLocal = etiquetaHoraLocal(pais.iso, opts.referencia);
  const faqs: { q: string; a: string }[] = [
    {
      q: `¿A qué hora son las clases en ${lugar}?`,
      a: esChile
        ? `Las clases en vivo por Zoom son de ${horario.inicioChile} a ${horario.finChile}, ${horaLocal}. ${horario.cadena}.`
        : `Las clases en vivo por Zoom son de ${horario.inicio} a ${horario.fin}, ${horaLocal}. En Chile son de ${horario.inicioChile} a ${horario.finChile}.`,
    },
    {
      q: "¿Qué recibo al terminar el curso?",
      a: `Certificado digital de ProgramBI y acceso al campus virtual con las clases y el material usado para que puedas practicar durante el curso. Las clases son en vivo a la hora de ${lugar}.`,
    },
  ];

  if (opts.slug) {
    const tituloCurso =
      opts.courseTitle ?? getCourseBySlug(opts.slug)?.title ?? opts.slug;
    faqs.push({
      q: `¿Cuánto cuesta ${tituloCurso} en ${lugar}?`,
      a: resumenPrecioCursoTexto(pais.iso, opts.slug, tituloCurso, opts.promotions),
    });
  }

  return { pais, horario, faqs };
}
