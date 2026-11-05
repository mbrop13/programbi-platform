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

import { normalizarPais } from "@/config/paises";

/** Cantidad de cuotas sin interés vigente en todos los mercados. */
export const CUOTAS_SIN_INTERES = 3;

/**
 * Medios de pago que ofrecen las cuotas sin interés.
 * La disponibilidad final por país la confirma la pasarela en el checkout.
 */
export const MEDIOS_CUOTAS = ["Mercado Pago", "Webpay"] as const;

/** Cuotas sin interés del mercado. Hoy son las mismas en todos los países. */
export function cuotasSinInteres(iso?: string | null): number {
  // normalizarPais valida el ISO; el valor no altera el número while la
  // decisión comercial sea global.
  normalizarPais(iso);
  return CUOTAS_SIN_INTERES;
}

/** Texto corto y consistente: "3 cuotas sin interés". */
export function textoCuotas(iso?: string | null): string {
  return `${cuotasSinInteres(iso)} cuotas sin interés`;
}

/** Nota para bloques de precio y checkout. */
export const NOTA_CUOTAS = `Puedes pagar en ${CUOTAS_SIN_INTERES} cuotas sin interés.`;

/** Nota con los medios, para el paso de pago. */
export const NOTA_CUOTAS_MEDIOS = `Puedes pagar en ${CUOTAS_SIN_INTERES} cuotas sin interés con ${MEDIOS_CUOTAS.join(
  " o ",
)}.`;
