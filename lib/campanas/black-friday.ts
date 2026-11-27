import { getPais, normalizarPais, PAISES, SLUGS_CURSO } from "@/config/paises";
import { descuentoPublico, type PromocionAplicable } from "@/lib/paises/precios";

/**
 * Black Friday 2026: muestra con más fuerza los descuentos que los cursos YA tienen
 * (no cambia ningún precio). Corre desde el viernes 27 hasta el lunes 30 de noviembre
 * a medianoche, en la hora de cada país.
 *
 * El 1 de diciembre el descuento termina de verdad (confirmado por el negocio); por
 * eso los textos pueden decir «termina el lunes 30».
 */
export const BLACK_FRIDAY = {
  nombre: "Black Friday",
  inicio: "2026-11-27",
  /** Último día incluido (se apaga a las 00:00 del día siguiente, hora local). */
  fin: "2026-11-30",
  finTexto: "el lunes 30 de noviembre",
} as const;

/**
 * La campaña completa (barra y portada) solo tiene sentido donde hay varios cursos con
 * descuento: hoy es Chile (15 de 15). En otros países solo se destaca el curso que lo tiene.
 */
const MIN_CURSOS_CAMPANA_COMPLETA = 3;

/** Desfase UTC de una zona IANA en una fecha («-03:00»). */
function desfase(zona: string, fecha: string): string {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: zona,
    timeZoneName: "longOffset",
  }).formatToParts(new Date(`${fecha}T12:00:00Z`));
  const nombre = partes.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = nombre.match(/GMT([+-]\d{2}:\d{2})/);
  return m ? m[1] : "+00:00";
}

/** Instante (ms) en que la fecha local empieza en la zona del país. */
function inicioDelDia(fecha: string, zona: string): number {
  return Date.parse(`${fecha}T00:00:00${desfase(zona, fecha)}`);
}

function diaSiguiente(fecha: string): string {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export interface VentanaCampana {
  inicioMs: number;
  /** Primer instante FUERA de la campaña (00:00 del 1 de diciembre, hora local). */
  finMs: number;
}

export function ventanaBlackFriday(iso: string | null | undefined): VentanaCampana {
  const zona = getPais(normalizarPais(iso)).zonaHoraria;
  return {
    inicioMs: inicioDelDia(BLACK_FRIDAY.inicio, zona),
    finMs: inicioDelDia(diaSiguiente(BLACK_FRIDAY.fin), zona),
  };
}

export function blackFridayVigente(iso: string | null | undefined, ahoraMs = Date.now()): boolean {
  const v = ventanaBlackFriday(iso);
  return ahoraMs >= v.inicioMs && ahoraMs < v.finMs;
}

/** Descuentos reales por curso en el país (los mismos que muestra el checkout). */
export function descuentosDelPais(
  iso: string | null | undefined,
  promotions?: readonly PromocionAplicable[]
): { slug: string; pct: number }[] {
  return SLUGS_CURSO.map((slug) => ({ slug, pct: descuentoPublico(iso, slug, promotions) })).filter(
    (d) => d.pct > 0
  );
}

/** Resumen para la barra y la portada; `null` si el país no tiene campaña completa. */
export function campanaCompleta(
  iso: string | null | undefined,
  promotions?: readonly PromocionAplicable[]
): { max: number; min: number; cursos: number } | null {
  const d = descuentosDelPais(iso, promotions);
  if (d.length < MIN_CURSOS_CAMPANA_COMPLETA) return null;
  const pcts = d.map((x) => x.pct);
  return { max: Math.max(...pcts), min: Math.min(...pcts), cursos: d.length };
}

/**
 * Script en línea que se ejecuta antes de pintar: marca `<html class="bf-off">` cuando la
 * hora del visitante está fuera de la campaña de su país (según la carpeta de la URL).
 * El CSS oculta entonces todo lo marcado con `.bf-on` y muestra `.bf-alt`. Así la campaña
 * se apaga a la medianoche exacta aunque la página venga de caché (ISR de 24 horas).
 */
export function scriptVentanaCampana(): string {
  const ventanas: Record<string, [number, number]> = {};
  for (const p of PAISES) {
    const v = ventanaBlackFriday(p.iso);
    ventanas[p.iso] = [v.inicioMs, v.finMs];
  }
  return `(function(){try{var v=${JSON.stringify(ventanas)};var s=location.pathname.split("/")[1];var w=v[s]||v.cl;var t=Date.now();if(t<w[0]||t>=w[1])document.documentElement.classList.add("bf-off");}catch(e){}})();`;
}
