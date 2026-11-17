/**
 * Cuotas sin interés.
 *
 * Decisión de Manu (4-nov-2026): las 3 cuotas sin interés aplican en TODOS los
 * países, no solo en Chile. Este archivo es la fuente única del dato: ningún
 * componente, FAQ ni texto debe escribir "3 cuotas" a mano.
 *
 * El número es una condición comercial, no un cálculo: si mañana cambia, se
 * cambia acá y se propaga a fichas, precios, FAQ, guías y checkout.
 */

import { normalizarPais, ofreceCuotas } from "@/config/paises";

/** Cantidad de cuotas sin interés vigente en todos los mercados. */
export const CUOTAS_SIN_INTERES = 3;

/**
 * Medios de pago que ofrecen las cuotas sin interés.
 * La disponibilidad final por país la confirma la pasarela en el checkout.
 */
export const MEDIOS_CUOTAS = ["Mercado Pago", "Webpay"] as const;

/**
 * Cuotas sin interés del mercado. Son las mismas en todos los países que las
 * ofrecen. Devuelve 0 donde no hay pasarela que las dé (hoy Estados Unidos):
 * quien use este número para dividir debe comprobar que sea mayor que cero.
 */
export function cuotasSinInteres(iso?: string | null): number {
  return ofreceCuotas(normalizarPais(iso)) ? CUOTAS_SIN_INTERES : 0;
}

/**
 * Texto corto y consistente: "3 cuotas sin interés".
 * Cadena vacía en los mercados sin cuotas: el llamador omite la frase.
 */
export function textoCuotas(iso?: string | null): string {
  const cuotas = cuotasSinInteres(iso);
  return cuotas > 0 ? `${cuotas} cuotas sin interés` : "";
}

/** Nota para bloques de precio y checkout. */
export const NOTA_CUOTAS = `Puedes pagar en ${CUOTAS_SIN_INTERES} cuotas sin interés.`;

/** Nota con los medios, para el paso de pago. */
export const NOTA_CUOTAS_MEDIOS = `Puedes pagar en ${CUOTAS_SIN_INTERES} cuotas sin interés con ${MEDIOS_CUOTAS.join(
  " o ",
)}.`;
