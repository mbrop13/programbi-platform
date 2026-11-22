/**
 * Anti-arbitraje de precios por país (solo servidor).
 *
 * El precio de cada mercado lo fija la carpeta de la URL (`/mx`, `/ve`…), pero
 * el precio de Estados Unidos es el más alto del catálogo. Sin un control, quien
 * compra desde EE.UU. podría abrir `/ve` y pagar USD 69 en vez de USD 249.
 *
 * Regla: si la IP de la petición es de EE.UU., el cobro solo se acepta con el
 * precio de EE.UU. El país de la IP lo entrega Vercel en `x-vercel-ip-country`
 * (el cliente no puede fijarlo en producción). Fuera de Vercel el encabezado no
 * existe y no se bloquea nada, así que el desarrollo local no se ve afectado.
 *
 * Límites conocidos: una VPN lo evita, y alguien de EE.UU. con IP de otro país
 * no se detecta. Es una barrera contra el caso fácil, no un control total.
 */

import { getPais, ISO_CHILE, normalizarPais } from "@/config/paises";

/** Mercado cuyo precio es el más alto y que se protege del arbitraje. */
export const PAIS_PROTEGIDO = "us";
export const PAISES_PROTEGIDOS = new Set(["us", "es"]);

/** País de la IP según Vercel, en minúsculas, o `null` si no viene. */
export function paisDeIp(headers: Headers): string | null {
  const valor = (headers.get("x-vercel-ip-country") || "").trim().toLowerCase();
  return /^[a-z]{2}$/.test(valor) ? valor : null;
}

export type BloqueoMercado = {
  error: string;
  code: "mercado_ip";
  /** Mercado cuyo precio corresponde a la IP de la petición. */
  paisSugerido: string;
};

/**
 * ¿Hay que rechazar este cobro? `paisSolicitado` es el país de la URL desde la
 * que se compra; sin país (Flow, Chile) se toma como Chile.
 */
export function bloqueoPorMercado(
  headers: Headers,
  paisSolicitado: string | null | undefined
): BloqueoMercado | null {
  const ipPais = paisDeIp(headers);
  if (!ipPais || !PAISES_PROTEGIDOS.has(ipPais)) return null;
  const pais = normalizarPais(paisSolicitado || ISO_CHILE);
  if (PAISES_PROTEGIDOS.has(pais)) return null;
  const nombrePais = getPais(ipPais).nombre;
  return {
    code: "mercado_ip",
    paisSugerido: ipPais,
    error: `Detectamos que te conectas desde ${nombrePais}, donde el curso tiene su propio precio en dólares. Abre la versión de ${nombrePais} para continuar. Si estás de viaje y compras para otro país, escríbenos por WhatsApp y lo resolvemos.`,
  };
}
