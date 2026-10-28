/**
 * Horario de las clases en la hora local de cada país.
 *
 * Las clases se dictan en vivo desde Chile (America/Santiago). Cada versión
 * por país muestra la misma clase convertida a su hora local, respetando el
 * horario de verano de cada país (offsets IANA, no números fijos).
 */

import { getPais, normalizarPais } from "@/config/paises";

/** Hora de inicio y fin de la clase en Chile, cuando no hay cohorte en la base. */
export const HORA_CLASE_CHILE = { inicio: "19:30", fin: "21:30" };

/** Orden con el que se comparan los horarios entre mercados. */
const ORDEN_MERCADOS = ["ar", "mx", "pe", "co", "uy"];

type Partes = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function partesEnZona(date: Date, timeZone: string): Partes {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const out: Record<string, number> = {};
  for (const parte of fmt.formatToParts(date)) {
    if (parte.type !== "literal") out[parte.type] = parseInt(parte.value, 10);
  }
  return out as unknown as Partes;
}

/** Minutos de desfase de la zona respecto a UTC en esa fecha (incluye verano). */
export function desfaseMinutos(date: Date, timeZone: string): number {
  const p = partesEnZona(date, timeZone);
  const comoUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((comoUtc - date.getTime()) / 60000);
}

/** "UTC-3" / "UTC-6" / "UTC+2" con el signo del desfase real de la fecha. */
export function etiquetaUtc(date: Date, timeZone: string): string {
  const minutos = desfaseMinutos(date, timeZone);
  const signo = minutos < 0 ? "-" : "+";
  const absoluto = Math.abs(minutos);
  const horas = Math.floor(absoluto / 60);
  const resto = absoluto % 60;
  return `UTC${signo}${horas}${resto ? `:${String(resto).padStart(2, "0")}` : ""}`;
}

/** Instante UTC de una hora de pared ("19:30") en una zona. */
function instanteDeHoraPared(referencia: Date, hora: string, timeZone: string): Date {
  const [h, m] = hora.split(":").map((n) => parseInt(n, 10));
  const p = partesEnZona(referencia, timeZone);
  const base = Date.UTC(p.year, p.month - 1, p.day, h, m, 0);
  let utc = base;
  for (let i = 0; i < 2; i++) {
    utc = base - desfaseMinutos(new Date(utc), timeZone) * 60000;
  }
  return new Date(utc);
}

/** Convierte una hora de Chile a la hora local de otra zona. */
export function horaEnZona(horaChile: string, timeZone: string, referencia: Date = new Date()): string {
  const instante = instanteDeHoraPared(referencia, horaChile, "America/Santiago");
  return new Intl.DateTimeFormat("es-CL", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(instante);
}

/** Zona horaria del país. Chile no tiene carpeta: usa su zona. */
export function zonaDe(iso: string | null | undefined): string {
  return getPais(normalizarPais(iso)).zonaHoraria;
}

/**
 * Agrega "hora de Perú" cuando el país tiene un precio propio.
 * Chile usa el catálogo y se queda con la hora sola.
 */
export function conHoraPais(iso: string | null | undefined, horario: string): string {
  const pais = getPais(normalizarPais(iso));
  if (!horario || pais.precios === "catalogo") return horario;
  return `${horario} · hora de ${pais.nombre}`;
}

/** Extrae "19:30 a 21:30" del horario guardado en la base de datos. */
export function horarioDeCohorte(scheduleTime: string | null | undefined): {
  inicio: string;
  fin: string;
} {
  const match = (scheduleTime || "").match(/(\d{1,2}):(\d{2})\s*(?:a|y|-|–)\s*(\d{1,2}):(\d{2})/);
  if (!match) return { ...HORA_CLASE_CHILE };
  const dos = (n: string) => String(parseInt(n, 10)).padStart(2, "0");
  return { inicio: `${dos(match[1])}:${match[2]}`, fin: `${dos(match[3])}:${match[4]}` };
}

export type HorarioLocal = {
  /** Hora de inicio de la clase en la hora local del país. */
  inicio: string;
  /** Hora de término de la clase en la hora local del país. */
  fin: string;
  /** Hora de inicio en Chile. */
  inicioChile: string;
  /** Hora de término en Chile. */
  finChile: string;
  /** Desfase del país, por ejemplo "UTC-6". */
  offset: string;
  /** "19:30 en Chile = 19:30 en Argentina = 16:30 en México ..." */
  cadena: string;
  /** La misma cadena sin la parte de Chile: "19:30 en Argentina = 16:30 en México ..." */
  cadenaMercados: string;
};

/**
 * Horario de la clase en la hora local del país, con la cadena de equivalencias
 * entre los mercados indexables (Chile, Argentina, México, Perú, Colombia y Uruguay).
 */
export function horarioLocal(
  iso: string | null | undefined,
  opciones: { inicio?: string; fin?: string; referencia?: Date } = {}
): HorarioLocal {
  const pais = getPais(normalizarPais(iso));
  const referencia = opciones.referencia ?? new Date();
  const inicioChile = opciones.inicio ?? HORA_CLASE_CHILE.inicio;
  const finChile = opciones.fin ?? HORA_CLASE_CHILE.fin;

  const mercados = ORDEN_MERCADOS.map((iso) => getPais(iso));
  const lista = pais.indexable ? mercados : [pais, ...mercados];
  const unicos = lista.filter((p, i) => lista.findIndex((otro) => otro.iso === p.iso) === i);
  const cadena = [
    `${inicioChile} en Chile`,
    ...unicos.map(
      (mercado) => `${horaEnZona(inicioChile, mercado.zonaHoraria, referencia)} en ${mercado.nombre}`,
    ),
  ];

  const cadenaCompleta = cadena.join(" = ");

  return {
    inicio: horaEnZona(inicioChile, pais.zonaHoraria, referencia),
    fin: horaEnZona(finChile, pais.zonaHoraria, referencia),
    inicioChile,
    finChile,
    offset: etiquetaUtc(referencia, pais.zonaHoraria),
    cadena: cadenaCompleta,
    cadenaMercados: cadena.slice(1).join(" = "),
  };
}
