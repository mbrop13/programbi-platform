import { getPais, normalizarPais, PAISES } from "@/config/paises";

export type ModoCobro = "catalogo" | "local" | "usd-chile" | "fallback-cl";

export type CobroPais = {
  iso: string;
  modo: ModoCobro;
  moneda: string;
  marker: string | null;
  /** Token de la cuenta que crea la preferencia. Vacío si no hay ninguna. */
  token: string;
  /** Cuenta que firma el webhook: cl o el iso local. */
  cuenta: string;
};

function tokenChile(): string {
  return process.env.MERCADOPAGO_ACCESS_TOKEN || "";
}

function tokenLocal(iso: string): string {
  return process.env[`MERCADOPAGO_ACCESS_TOKEN_${iso.toUpperCase()}`] || "";
}

/**
 * Todos los países cobran con el token de Chile, en pesos chilenos.
 * La cuenta de Chile no puede crear un cobro en otra moneda.
 */
export function resolverCobro(iso: string | null | undefined): CobroPais {
  const pais = getPais(normalizarPais(iso));
  const chile = tokenChile();
  if (pais.iso === "cl" || pais.pago === "catalogo") {
    return { iso: "cl", modo: "catalogo", moneda: "CLP", marker: null, token: chile, cuenta: "cl" };
  }
  return { iso: pais.iso, modo: "fallback-cl", moneda: "CLP", marker: null, token: chile, cuenta: "cl" };
}

export function tokenPorCuenta(cuenta: string | null | undefined): string {
  if (!cuenta || cuenta === "cl") return tokenChile();
  return tokenLocal(cuenta) || tokenChile();
}

/** Datos que el cliente puede ver. No incluye tokens. */
export function estadoPublico(iso: string) {
  const cobro = resolverCobro(iso);
  return { marker: cobro.marker, moneda: cobro.moneda, modo: cobro.modo };
}

export function estadosPublicos(): Record<string, ReturnType<typeof estadoPublico>> {
  return Object.fromEntries(PAISES.map((pais) => [pais.iso, estadoPublico(pais.iso)]));
}
