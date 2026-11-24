/**
 * Un país = una entrada. Chile no usa carpeta: sus URLs siguen en la raíz.
 * Los precios locales se fijan a mano. null usa el precio del catálogo en CLP.
 *
 * Argentina: edita solo PRECIOS_ARS cuando cambie el peso.
 * No pongas claves de Mercado Pago aquí. Van en variables de entorno.
 */

export const SLUGS_CURSO = [
  "analisis-de-datos",
  "copilot",
  "claude",
  "chatgpt",
  "gemini",
  "power-automate",
  "analitica-mineria",
  "ia-productividad",
  "power-bi",
  "python",
  "sql-server",
  "excel",
  "access",
  "machine-learning",
  "mercado-financiero",
] as const;

export type SlugCurso = (typeof SLUGS_CURSO)[number];
export type PreciosCurso = Record<SlugCurso, number | null>;
export type TramoPrecio = 0.7 | 0.75 | 0.8 | 0.85;
export type TipoCursoPiso = "20h" | "60h" | "mercado-financiero";

/**
 * Tabla única de pisos en USD por tramo respecto de la referencia de Chile
 * a tipo de cambio piso 1 USD = 1.000 CLP:
 * - 20h Chile: lista $249.000 (249 USD) / vigente $169.000 (169 USD)
 * - 60h Chile: lista $747.000 (747 USD) / vigente $338.000 (338 USD)
 * - Mercado Financiero Chile: lista $514.000 (514 USD) / vigente $349.000 (349 USD)
 */
export const PISOS_USD_POR_TRAMO: Record<
  TramoPrecio,
  Record<TipoCursoPiso, { lista: number; vigente: number }>
> = {
  0.7: {
    "20h": { lista: 175, vigente: 119 },
    "60h": { lista: 523, vigente: 237 },
    "mercado-financiero": { lista: 360, vigente: 245 },
  },
  0.75: {
    "20h": { lista: 187, vigente: 127 },
    "60h": { lista: 561, vigente: 254 },
    "mercado-financiero": { lista: 386, vigente: 262 },
  },
  0.8: {
    "20h": { lista: 199, vigente: 135 },
    "60h": { lista: 598, vigente: 270 },
    "mercado-financiero": { lista: 412, vigente: 280 },
  },
  0.85: {
    "20h": { lista: 212, vigente: 144 },
    "60h": { lista: 635, vigente: 288 },
    "mercado-financiero": { lista: 437, vigente: 297 },
  },
};

/**
 * Tasas de cambio fijas desde 1 USD a moneda local para calcular el piso
 * comercial y el paso de redondeo hacia arriba (`Math.ceil`).
 */
export const TASAS_CAMBIO_PISO_USD: Record<string, { tasa: number; paso: number }> = {
  USD: { tasa: 1, paso: 1 },
  ARS: { tasa: 1560, paso: 1000 },
  COP: { tasa: 3350, paso: 1000 },
  MXN: { tasa: 19, paso: 10 },
  PEN: { tasa: 3.45, paso: 1 },
  UYU: { tasa: 41, paso: 1 },
};

export function tipoCursoDeSlug(slug: string): TipoCursoPiso {
  if (slug === "60h" || slug === "analisis-de-datos" || slug === "analitica-mineria") {
    return "60h";
  }
  if (slug === "mercado-financiero") {
    return "mercado-financiero";
  }
  return "20h";
}

export function pisoEnMoneda(
  tramo: TramoPrecio,
  tipoCurso: SlugCurso | TipoCursoPiso,
  moneda: string,
  clase: "vigente" | "lista" = "vigente"
): number {
  const fx = TASAS_CAMBIO_PISO_USD[moneda.toUpperCase()];
  if (!fx) return 0;
  const tipo = tipoCursoDeSlug(tipoCurso);
  const usd = PISOS_USD_POR_TRAMO[tramo][tipo][clase];
  return Math.ceil((usd * fx.tasa) / fx.paso) * fx.paso;
}

function preciosVacios(): PreciosCurso {
  return Object.fromEntries(SLUGS_CURSO.map((slug) => [slug, null])) as PreciosCurso;
}

/**
 * El curso estándar se cobra a $169.000 y Mercado financiero a $349.000.
 * El precio local de Mercado financiero es el del curso estándar más 47,34 %.
 * El precio de venta en Chile vive en `config/pricing.ts`.
 */
const FACTOR_MERCADO = 249 / 169;

/** El cobro termina en 9, como el resto: 119, 3.190, 235.900. */
function cobroMercado(normal: number): number {
  const paso = normal >= 10000 ? 100 : normal >= 1000 ? 10 : 1;
  const unidad = paso * 10;
  return Math.round((normal * FACTOR_MERCADO - 9 * paso) / unidad) * unidad + 9 * paso;
}

/** Tachado, con el mismo aumento y el corte de la lista normal. */
function listaMercado(normal: number): number {
  const paso = normal >= 10000 ? 1000 : normal >= 1000 ? 10 : 1;
  return Math.round((normal * FACTOR_MERCADO) / paso) * paso;
}

/**
 * «Análisis de datos para la Minería» es el mismo curso que Análisis de datos:
 * en todos los mercados comparte su monto de venta y su precio de lista.
 */
const SLUGS_ANALISIS = new Set<SlugCurso>(["analisis-de-datos", "analitica-mineria"]);

/**
 * Monto que se cobra, ya con el descuento habitual.
 * `normal` es un curso. Análisis de datos (y su versión minera) es el doble.
 */
function precios(normal: number, analisis: number): PreciosCurso {
  const tabla = preciosVacios();
  for (const slug of SLUGS_CURSO) {
    tabla[slug] = SLUGS_ANALISIS.has(slug) ? analisis : normal;
  }
  tabla["mercado-financiero"] = cobroMercado(normal);
  return tabla;
}

/**
 * Precio normal explícito para mercados LatAm: 20h, 60h y Mercado Financiero
 * (30h) con su valor vigente exacto sin recalcular con `cobroMercado`.
 */
function preciosLatAm(
  normal20h: number,
  analisis60h: number,
  mercadoFinanciero30h: number
): PreciosCurso {
  const tabla = preciosVacios();
  for (const slug of SLUGS_CURSO) {
    tabla[slug] = SLUGS_ANALISIS.has(slug) ? analisis60h : normal20h;
  }
  tabla["mercado-financiero"] = mercadoFinanciero30h;
  return tabla;
}

/**
 * Precio de lista solo para Mercado Financiero (30h); los cursos de 20h y 60h
 * quedan en `null` (precio normal sin tachado ni % de descuento).
 */
function listasSoloMercadoFinanciero(listaMF: number): PreciosCurso {
  const tabla = preciosVacios();
  tabla["mercado-financiero"] = listaMF;
  return tabla;
}

/**
 * Precio de lista de los mercados locales. Chile no usa esta tabla: su precio
 * de venta y su lista viven en `config/pricing.ts`.
 * `normal` es el original local. Análisis de datos (y su versión minera)
 * queda en normal × 3.
 */
function listas(normal: number): PreciosCurso {
  const tabla = preciosVacios();
  for (const slug of SLUGS_CURSO) {
    tabla[slug] = SLUGS_ANALISIS.has(slug) ? normal * 3 : normal;
  }
  tabla["mercado-financiero"] = listaMercado(normal);
  return tabla;
}

/**
 * Pesos argentinos (ARS). PRECIOS_ARS es el cobro. PRECIOS_LISTA_ARS solo
 * mantiene el tachado de Mercado Financiero (30h).
 */
export const PRECIOS_LISTA_ARS: PreciosCurso = listasSoloMercadoFinanciero(643000);

export const PRECIOS_ARS_META = {
  vigenteDesde: "2026-11-23",
  revisarAntesDe: "2026-12-15",
  tcReferencia: {
    fuente: "MEP/bolsa (dolarapi.com/v1/dolares/bolsa)",
    venta: 1743.1,
    fecha: "2026-11-22",
  },
  usdObjetivo: {
    basicoIntermedio: 179,
    analisisDatos: 358,
  },
} as const;

export const PRECIOS_ARS: PreciosCurso = preciosLatAm(312000, 624000, 437000);

/**
 * Dólares de Estados Unidos y España. Sin descuento ni precio tachado (lista = vigente):
 * USD 249 el curso estándar de 20 horas, USD 498 Análisis de datos / Minería (60 horas)
 * y USD 369 Mercado financiero (30 horas).
 */
export const PRECIOS_USD_EEUU: PreciosCurso = precios(249, 498);

export type PagoPais = "catalogo" | "mp" | "usd-chile" | "clp-chile";

export type Pais = {
  iso: string;
  nombre: string;
  /** BCP 47, también el hreflang. */
  idioma: string;
  moneda: string;
  simbolo: string;
  /** Locale de Intl.NumberFormat. */
  locale: string;
  decimales: number;
  /**
   * catalogo: precios CLP actuales (courses.ts + overrides).
   * mp: Mercado Pago del país, si existe la variable de entorno.
   * usd-chile: Mercado Pago no opera; checkout de Chile en USD.
   * clp-chile: Mercado Pago no opera; checkout de Chile en CLP.
   */
  pago: PagoPais;
  /** Lo que se cobra. Chile usa el catálogo y la promo del admin. */
  precios: PreciosCurso | "catalogo";
  /** Precio de lista. Chile lo arma el catálogo; no es el precio comercial efectivo. */
  listas: PreciosCurso | "catalogo";
  /** Tramo de piso comercial respecto de Chile (70%, 75%, 80% o 85% a 1 USD = 1.000 CLP). */
  tramoPrecio?: TramoPrecio;
  /** El mercado publica precio único sin tachado ni % de descuento (ej. EE.UU. / FTC). */
  sinDescuento?: boolean;
  dispositivo: "computador" | "computadora" | "ordenador";
  /** Voseo solo en titulares y botones. */
  voseo: boolean;
  /**
   * ¿La versión por país puede indexarse?
   * Solo se indexan los 6 mercados principales con contenido local y tabla de
   * precios propia (cl, ar, mx, pe, co, uy). Los demás quedan en `false`
   * (noindex, follow; fuera del sitemap y hreflang) para evitar ~300+ URLs
   * casi duplicadas que diluyen la calidad del sitio; se pueden reactivar por
   * mercado cuando tengan pasarela local y copy único.
   */
  indexable: boolean;
  /** Zona horaria IANA. Sirve para convertir el horario de las clases. */
  zonaHoraria: string;
  /** Medios de pago disponibles en ese país. */
  mediosPago: string[];
  /**
   * El precio se muestra en la ficha sin pedir el formulario del brochure.
   * Solo Estados Unidos: allá el precio oculto resta confianza y conversión.
   * El resto de los mercados mantiene el gate de precios.
   */
  precioDirecto?: boolean;
  /** El mercado no ofrece cuotas sin interés (no hay pasarela local que las dé). */
  sinCuotas?: boolean;
  contacto: {
    email: string;
    whatsapp: string | null;
    ciudad: string;
  };
};

/**
 * Referencia para mostrar el precio en dólares: 1 USD = 900 CLP.
 * Es la misma referencia que usa el checkout (ver app/(marketing)/pago).
 * Actualízala cuando el dólar se mueva.
 */
export const TIPO_CAMBIO_USD = 900;


const EMAIL = "contacto@programbi.cl";
const WHATSAPP_CL = "https://wa.me/56935409699";
const MEDIOS_PAGO_USD = [
  "Mercado Pago (tarjeta de crédito o débito)",
  "Tarjeta de crédito o débito internacional",
  "Transferencia bancaria en dólares",
];

// Mientras no exista MERCADOPAGO_ACCESS_TOKEN_<ISO> activo, el checkout opera
// con la cuenta de Chile en CLP usando medios internacionales. Los métodos
// locales (OXXO/SPEI, PSE/Nequi, Yape/Plin, etc.) se pueden re-agregar cuando
// la cuenta local de Mercado Pago esté activa en cada país.
const MEDIOS_PAGO_INTERNACIONAL = [
  "Tarjeta de crédito o débito internacional (vía Mercado Pago)",
  "Transferencia bancaria internacional",
];

function contactoPendiente(): Pais["contacto"] {
  // Sin ciudad confirmada no se publica nada: un «[PENDIENTE …]» en el HTML
  // es peor que no mostrar la línea. El país ya se lee en el resto de la página.
  return {
    email: EMAIL,
    whatsapp: null,
    ciudad: "",
  };
}

export const PAISES: Pais[] = [
  {
    iso: "cl",
    nombre: "Chile",
    idioma: "es-CL",
    moneda: "CLP",
    simbolo: "$",
    locale: "es-CL",
    decimales: 0,
    pago: "catalogo",
    precios: "catalogo",
    listas: "catalogo",
    dispositivo: "computador",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Santiago",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en pesos"],
    contacto: { email: EMAIL, whatsapp: WHATSAPP_CL, ciudad: "Santiago, Chile" },
  },
  {
    iso: "ar",
    nombre: "Argentina",
    idioma: "es-AR",
    moneda: "ARS",
    simbolo: "$",
    locale: "es-AR",
    decimales: 0,
    pago: "mp",
    precios: PRECIOS_ARS,
    listas: PRECIOS_LISTA_ARS,
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: true,
    indexable: true,
    zonaHoraria: "America/Argentina/Buenos_Aires",
    mediosPago: MEDIOS_PAGO_INTERNACIONAL,
    contacto: contactoPendiente(),
  },
  {
    iso: "bo",
    nombre: "Bolivia",
    idioma: "es-BO",
    moneda: "USD",
    simbolo: "$",
    locale: "es-BO",
    decimales: 2,
    pago: "usd-chile",
    precios: preciosLatAm(149, 298, 245),
    listas: listasSoloMercadoFinanciero(360),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/La_Paz",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
  {
    iso: "co",
    nombre: "Colombia",
    idioma: "es-CO",
    moneda: "COP",
    simbolo: "$",
    locale: "es-CO",
    decimales: 0,
    pago: "mp",
    precios: preciosLatAm(519000, 1038000, 878000),
    listas: listasSoloMercadoFinanciero(1294000),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Bogota",
    mediosPago: MEDIOS_PAGO_INTERNACIONAL,
    contacto: contactoPendiente(),
  },
  {
    iso: "cr",
    nombre: "Costa Rica",
    idioma: "es-CR",
    moneda: "USD",
    simbolo: "$",
    locale: "es-CR",
    decimales: 2,
    pago: "usd-chile",
    // Importes fijos para Costa Rica; no se derivan del precio chileno.
    precios: preciosLatAm(199, 398, 297),
    listas: listasSoloMercadoFinanciero(437),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Costa_Rica",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
  {
    iso: "ec",
    nombre: "Ecuador",
    idioma: "es-EC",
    moneda: "USD",
    simbolo: "$",
    locale: "es-EC",
    decimales: 2,
    pago: "usd-chile",
    precios: preciosLatAm(149, 298, 262),
    listas: listasSoloMercadoFinanciero(386),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Guayaquil",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
  {
    iso: "sv",
    nombre: "El Salvador",
    idioma: "es-SV",
    moneda: "USD",
    simbolo: "$",
    locale: "es-SV",
    decimales: 2,
    pago: "usd-chile",
    precios: preciosLatAm(149, 298, 262),
    listas: listasSoloMercadoFinanciero(386),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/El_Salvador",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
  {
    // Estados Unidos: hispanohablantes que viven y trabajan allá (Miami primero).
    // Precio sin descuento (249/498) y cobro en CLP fallback: noindex hasta tener pasarela y copy propio.
    iso: "us",
    nombre: "Estados Unidos",
    idioma: "es-US",
    moneda: "USD",
    simbolo: "$",
    locale: "es-US",
    // En EE.UU. el precio se lee «$299», no «$299.00».
    decimales: 0,
    // PROVISIONAL: Mercado Pago no opera en EE.UU. Mientras no exista un cobro
    // directo en dólares, el checkout cae en el equivalente en CLP con la
    // cuenta de Chile, igual que los demás mercados en USD.
    pago: "usd-chile",
    precios: PRECIOS_USD_EEUU,
    // Sin precio tachado: en EE.UU. el precio «normal» tiene que haberse
    // ofrecido de verdad (reglas de la FTC). Se publica solo el precio final.
    listas: preciosVacios(),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    // Hora del Este (Miami, Nueva York). Central y Pacífico se explican en el texto.
    zonaHoraria: "America/New_York",
    mediosPago: ["Tarjeta de crédito o débito"],
    precioDirecto: true,
    sinCuotas: true,
    contacto: contactoPendiente(),
  },
  {
    iso: "es",
    nombre: "España",
    idioma: "es-ES",
    moneda: "USD",
    simbolo: "$",
    locale: "es-ES",
    decimales: 0,
    pago: "usd-chile",
    precios: PRECIOS_USD_EEUU,
    listas: preciosVacios(),
    sinDescuento: true,
    dispositivo: "ordenador",
    voseo: false,
    indexable: true,
    zonaHoraria: "Europe/Madrid",
    mediosPago: [
      "Tarjeta de crédito o débito internacional (Visa/Mastercard)",
      "Transferencia bancaria internacional (para empresas)",
    ],
    precioDirecto: true,
    sinCuotas: true,
    contacto: contactoPendiente(),
  },
  {
    iso: "gt",
    nombre: "Guatemala",
    idioma: "es-GT",
    moneda: "USD",
    simbolo: "$",
    locale: "es-GT",
    decimales: 2,
    pago: "usd-chile",
    precios: preciosLatAm(149, 298, 262),
    listas: listasSoloMercadoFinanciero(386),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Guatemala",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
  {
    iso: "hn",
    nombre: "Honduras",
    idioma: "es-HN",
    moneda: "USD",
    simbolo: "$",
    locale: "es-HN",
    decimales: 2,
    pago: "usd-chile",
    precios: preciosLatAm(149, 298, 245),
    listas: listasSoloMercadoFinanciero(360),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Tegucigalpa",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
  {
    iso: "mx",
    nombre: "México",
    idioma: "es-MX",
    moneda: "MXN",
    simbolo: "$",
    locale: "es-MX",
    decimales: 0,
    pago: "mp",
    precios: preciosLatAm(3480, 6960, 5320),
    listas: listasSoloMercadoFinanciero(7830),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Mexico_City",
    mediosPago: MEDIOS_PAGO_INTERNACIONAL,
    contacto: contactoPendiente(),
  },
  {
    iso: "ni",
    nombre: "Nicaragua",
    idioma: "es-NI",
    moneda: "USD",
    simbolo: "$",
    locale: "es-NI",
    decimales: 2,
    pago: "usd-chile",
    precios: preciosLatAm(149, 298, 245),
    listas: listasSoloMercadoFinanciero(360),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Managua",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
  {
    iso: "pa",
    nombre: "Panamá",
    idioma: "es-PA",
    moneda: "USD",
    simbolo: "$",
    locale: "es-PA",
    decimales: 2,
    pago: "usd-chile",
    // Mismo precio que Costa Rica: USD 199 y análisis 398.
    precios: preciosLatAm(199, 398, 297),
    listas: listasSoloMercadoFinanciero(437),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Panama",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
  {
    iso: "py",
    nombre: "Paraguay",
    idioma: "es-PY",
    moneda: "USD",
    simbolo: "$",
    locale: "es-PY",
    decimales: 2,
    pago: "usd-chile",
    precios: preciosLatAm(149, 298, 262),
    listas: listasSoloMercadoFinanciero(386),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Asuncion",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
  {
    iso: "pe",
    nombre: "Perú",
    idioma: "es-PE",
    moneda: "PEN",
    simbolo: "S/",
    locale: "es-PE",
    decimales: 0,
    pago: "mp",
    precios: preciosLatAm(618, 1236, 904),
    listas: listasSoloMercadoFinanciero(1332),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Lima",
    mediosPago: MEDIOS_PAGO_INTERNACIONAL,
    contacto: contactoPendiente(),
  },
  {
    iso: "do",
    nombre: "República Dominicana",
    idioma: "es-DO",
    moneda: "USD",
    simbolo: "$",
    locale: "es-DO",
    decimales: 2,
    pago: "usd-chile",
    precios: preciosLatAm(149, 298, 280),
    listas: listasSoloMercadoFinanciero(412),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Santo_Domingo",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
  {
    iso: "uy",
    nombre: "Uruguay",
    idioma: "es-UY",
    moneda: "UYU",
    simbolo: "$",
    locale: "es-UY",
    decimales: 0,
    pago: "mp",
    precios: preciosLatAm(8100, 16200, 12177),
    listas: listasSoloMercadoFinanciero(17917),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: true,
    indexable: true,
    zonaHoraria: "America/Montevideo",
    mediosPago: MEDIOS_PAGO_INTERNACIONAL,
    contacto: contactoPendiente(),
  },
  {
    iso: "ve",
    nombre: "Venezuela",
    idioma: "es-VE",
    moneda: "USD",
    simbolo: "$",
    locale: "es-VE",
    decimales: 2,
    pago: "usd-chile",
    precios: preciosLatAm(149, 298, 245),
    listas: listasSoloMercadoFinanciero(360),
    sinDescuento: true,
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Caracas",
    mediosPago: MEDIOS_PAGO_USD,
    contacto: contactoPendiente(),
  },
];

export const ISO_CHILE = "cl";

const POR_ISO = new Map(PAISES.map((pais) => [pais.iso, pais]));

export function esIsoPais(iso: string | null | undefined): iso is string {
  return !!iso && POR_ISO.has(iso);
}

export function getPais(iso: string | null | undefined): Pais {
  return POR_ISO.get(iso || "") || PAISES[0];
}

/**
 * Aplica el piso comercial respecto de Chile (70%–85% a 1 USD = 1.000 CLP).
 * Acepta el ISO del país (ej. "ar", "sv", "us", "cl") o un código de moneda
 * junto con `tramoExplicito`. Si es Chile (`cl`), un mercado `sinDescuento`
 * (`/us`) o no tiene `tramoPrecio`, devuelve `precio` sin cambios.
 */
export function aplicarPisoChile(
  precio: number,
  tipoCurso: SlugCurso | TipoCursoPiso,
  monedaOrIso: string,
  clase: "vigente" | "lista" = "vigente",
  tramoExplicito?: TramoPrecio
): number {
  const isoCandidate = monedaOrIso.toLowerCase();
  if (esIsoPais(isoCandidate)) {
    const pais = getPais(isoCandidate);
    if (pais.iso === ISO_CHILE || pais.sinDescuento) return precio;
    const tramo = tramoExplicito ?? pais.tramoPrecio;
    if (!tramo) return precio;
    const piso = pisoEnMoneda(tramo, tipoCurso, pais.moneda, clase);
    return piso > 0 ? Math.max(precio, piso) : precio;
  }
  const moneda = monedaOrIso.toUpperCase();
  if (moneda === "CLP" || !tramoExplicito) return precio;
  const piso = pisoEnMoneda(tramoExplicito, tipoCurso, moneda, clase);
  return piso > 0 ? Math.max(precio, piso) : precio;
}

/** Países con carpeta. Chile no está. */
export const PAISES_CARPETA = PAISES.filter((pais) => pais.iso !== ISO_CHILE);

/**
 * Versiones por país que Google puede indexar.
 * Chile entra por la raíz (sin carpeta), el resto por su carpeta /xx.
 */
export const PAISES_INDEXABLES = PAISES.filter((pais) => pais.indexable);

/** ¿La versión de ese país se puede indexar? */
export function esIndexable(iso: string | null | undefined): boolean {
  return esIsoPais(iso) ? POR_ISO.get(iso)!.indexable : false;
}

/** ¿Ese mercado muestra el precio sin pedir el formulario? Hoy solo EE.UU. */
export function muestraPrecioDirecto(iso: string | null | undefined): boolean {
  return esIsoPais(iso) ? POR_ISO.get(iso)!.precioDirecto === true : false;
}

/** ¿Ese mercado ofrece cuotas sin interés? */
export function ofreceCuotas(iso: string | null | undefined): boolean {
  return esIsoPais(iso) ? POR_ISO.get(iso)!.sinCuotas !== true : true;
}

export function normalizarPais(iso: string | null | undefined): string {
  return esIsoPais(iso) ? iso : ISO_CHILE;
}
