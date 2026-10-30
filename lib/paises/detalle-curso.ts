/**
 * Detalle local de una ficha de curso: horario en la hora del país, precio y
 * moneda, medios de pago y una FAQ corta del mercado.
 * Todo se calcula en el servidor para que llegue en el HTML.
 */

import { getPais, ISO_CHILE, normalizarPais, SLUGS_CURSO, TIPO_CAMBIO_USD, type Pais } from "@/config/paises";
import { horarioLocal, type HorarioLocal } from "@/lib/paises/horarios";
import { formatCLP, muestraPrecioLocal, precioCurso } from "@/lib/paises/precios";

export type DetalleCursoLocal = {
  pais: Pais;
  horario: HorarioLocal;
  /** Párrafo con el horario convertido a la hora local del país. */
  horarioTexto: string;
  /** Precio en la moneda del país, por ejemplo "$2.190 MXN". */
  precioTexto: string | null;
  /** Precio aproximado en dólares (solo Chile). */
  precioUsdTexto: string | null;
  /** Nota de cobro en CLP, si el pago todavía no sale en la moneda local. */
  notaCobro: string | null;
  /** Medios de pago del país, en una frase. */
  mediosPagoTexto: string;
  /** Tres preguntas frecuentes del mercado. */
  faqs: { q: string; a: string }[];
};

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

/** Dólares de referencia a partir del precio en pesos chilenos. */
export function montoEnUsd(montoClp: number): string {
  const usd = Math.round(montoClp / TIPO_CAMBIO_USD);
  return `USD ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(usd)}`;
}

function listaMedios(medios: string[]): string {
  if (medios.length === 0) return "";
  if (medios.length === 1) return medios[0];
  return `${medios.slice(0, -1).join(", ")} y ${medios[medios.length - 1]}`;
}

export function detalleCursoLocal(opts: {
  iso: string | null | undefined;
  /** Precio del curso en la moneda del país (null si no hay). */
  precio: number | null;
  /** Precio del catálogo en CLP, para la referencia en dólares (Chile). */
  precioCatalogo?: number | null;
  /** Catálogo en CLP cuando el país no tiene un monto propio. */
  precioClp?: number | null;
  /** Hora de inicio y fin de la clase en Chile. */
  inicio?: string;
  fin?: string;
  /** Fecha de referencia para el desfase horario. */
  referencia?: Date;
  /** Nota ya armada: se cobra en CLP. Null si el cobro es en la moneda local. */
  notaCobro?: string | null;
}): DetalleCursoLocal {
  const pais = getPais(normalizarPais(opts.iso));
  const horario = horarioLocal(pais.iso, {
    inicio: opts.inicio,
    fin: opts.fin,
    referencia: opts.referencia,
  });

  const precioClpTexto =
    opts.precio == null && opts.precioClp != null ? `${formatCLP(opts.precioClp)} CLP` : null;
  const precioTexto = opts.precio != null ? montoConCodigo(pais.iso, opts.precio) : precioClpTexto;
  const precioUsdTexto =
    pais.iso === ISO_CHILE && opts.precio != null ? montoEnUsd(opts.precio) : null;
  const notaCobro = precioClpTexto
    ? "El pago se abre en pesos chilenos."
    : opts.notaCobro?.trim() || null;

  const esChile = pais.iso === ISO_CHILE;
  const lugar = esChile ? "Chile" : pais.nombre;

  const horarioTexto = esChile
    ? `Las clases en vivo por Zoom son de ${horario.inicioChile} a ${horario.finChile}, hora de Chile (${horario.offset}). La misma hora en otros mercados: ${horario.cadenaMercados}.`
    : `Las clases en vivo por Zoom son de ${horario.inicioChile} a ${horario.finChile}, hora de Chile. En ${pais.nombre} son de ${horario.inicio} a ${horario.fin} (${horario.offset}). ${horario.cadena}.`;

  const mediosPagoTexto = `Puedes pagar en ${pais.moneda} con ${listaMedios(pais.mediosPago)}.`;

  const faqs = [
    {
      q: `¿A qué hora son las clases en ${lugar}?`,
      a: esChile
        ? `Las clases en vivo por Zoom son de ${horario.inicioChile} a ${horario.finChile}, hora de Chile (${horario.offset}). ${horario.cadena}.`
        : `Las clases en vivo por Zoom son de ${horario.inicio} a ${horario.fin}, hora de ${lugar} (${horario.offset}). En Chile son de ${horario.inicioChile} a ${horario.finChile}.`,
    },
    {
      q: `¿Cómo se paga el curso en ${lugar}?`,
      a: precioTexto
        ? `El valor es ${precioTexto}${precioUsdTexto ? ` (${precioUsdTexto} de referencia)` : ""}. ${notaCobro || mediosPagoTexto}`
        : notaCobro || mediosPagoTexto,
    },
    {
      q: "¿Qué recibo al terminar el curso?",
      a: `Certificado digital de ProgramBI y acceso de por vida a las grabaciones en el campus virtual. Las clases son en vivo, así que conectate a la hora de ${lugar} y después repites cuando quieras.`,
    },
  ];

  return {
    pais,
    horario,
    horarioTexto,
    precioTexto,
    precioUsdTexto,
    notaCobro,
    mediosPagoTexto,
    faqs,
  };
}
