/**
 * Detalle local de una ficha de curso: horario en la hora del país y una FAQ
 * corta del mercado. El precio no va aquí: se ve después de crear la cuenta.
 */

import { getPais, ISO_CHILE, normalizarPais, SLUGS_CURSO, type Pais } from "@/config/paises";
import { horarioLocal, type HorarioLocal } from "@/lib/paises/horarios";
import { muestraPrecioLocal, precioCurso } from "@/lib/paises/precios";

export type DetalleCursoLocal = {
  pais: Pais;
  horario: HorarioLocal;
  /** Preguntas del mercado que no revelan el precio. */
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

export function detalleCursoLocal(opts: {
  iso: string | null | undefined;
  /** Hora de inicio y fin de la clase en Chile. */
  inicio?: string;
  fin?: string;
  /** Fecha de referencia para el desfase horario. */
  referencia?: Date;
}): DetalleCursoLocal {
  const pais = getPais(normalizarPais(opts.iso));
  const horario = horarioLocal(pais.iso, {
    inicio: opts.inicio,
    fin: opts.fin,
    referencia: opts.referencia,
  });

  const esChile = pais.iso === ISO_CHILE;
  const lugar = esChile ? "Chile" : pais.nombre;

  const faqs = [
    {
      q: `¿A qué hora son las clases en ${lugar}?`,
      a: esChile
        ? `Las clases en vivo por Zoom son de ${horario.inicioChile} a ${horario.finChile}, hora de Chile (${horario.offset}). ${horario.cadena}.`
        : `Las clases en vivo por Zoom son de ${horario.inicio} a ${horario.fin}, hora de ${lugar} (${horario.offset}). En Chile son de ${horario.inicioChile} a ${horario.finChile}.`,
    },
    {
      q: "¿Qué recibo al terminar el curso?",
      a: `Certificado digital de ProgramBI y acceso de por vida a las grabaciones en el campus virtual. Las clases son en vivo, así que conectate a la hora de ${lugar} y después repites cuando quieras.`,
    },
  ];

  return { pais, horario, faqs };
}
