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
 * Pesos argentinos (ARS). PRECIOS_ARS es el cobro. PRECIOS_LISTA_ARS es el tachado.
 * Actualiza los dos cuando haya inflación.
 */
export const PRECIOS_LISTA_ARS: PreciosCurso = listas(236000);

/** Análisis de datos y su versión minera, al mismo monto en pesos. */
const ANALISIS_DE_DATOS_ARS = 319900;

export const PRECIOS_ARS: PreciosCurso = {
  "analisis-de-datos": ANALISIS_DE_DATOS_ARS,
  copilot: 159900,
  claude: 159900,
  "power-automate": 159900,
  // Mismo curso y mismo valor que Análisis de datos.
  "analitica-mineria": ANALISIS_DE_DATOS_ARS,
  "ia-productividad": 159900,
  "power-bi": 159900,
  python: 159900,
  "sql-server": 159900,
  excel: 159900,
  access: 159900,
  "machine-learning": 159900,
  // 159900 × 249/169, al corte de 900. En Chile el catálogo es $349.000.
  "mercado-financiero": 235900,
};

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
  dispositivo: "computador" | "computadora";
  /** Voseo solo en titulares y botones. */
  voseo: boolean;
  /**
   * ¿La versión por país puede indexarse?
   * Indexables: Chile (raíz), Argentina, México, Perú, Colombia y Uruguay.
   * El resto queda en noindex, follow y fuera del sitemap y de los hreflang.
   */
  indexable: boolean;
  /** Zona horaria IANA. Sirve para convertir el horario de las clases. */
  zonaHoraria: string;
  /** Medios de pago disponibles en ese país. */
  mediosPago: string[];
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
    dispositivo: "computadora",
    voseo: true,
    indexable: true,
    zonaHoraria: "America/Argentina/Buenos_Aires",
    mediosPago: ["Mercado Pago Argentina (tarjeta de crédito o débito)", "Mercado Pago Wallet", "Transferencia bancaria en pesos"],
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
    precios: precios(79, 159),
    listas: listas(117),
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/La_Paz",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
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
    precios: precios(299900, 599900),
    listas: listas(440000),
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Bogota",
    mediosPago: ["Mercado Pago Colombia (tarjeta de crédito o débito)", "PSE", "Nequi", "Transferencia bancaria en pesos"],
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
    precios: precios(149, 299),
    listas: listas(220),
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Costa_Rica",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
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
    precios: precios(99, 199),
    listas: listas(146),
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Guayaquil",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
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
    precios: precios(89, 179),
    listas: listas(131),
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/El_Salvador",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
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
    precios: precios(89, 179),
    listas: listas(131),
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Guatemala",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
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
    precios: precios(79, 159),
    listas: listas(117),
    dispositivo: "computadora",
    voseo: false,
    indexable: false,
    zonaHoraria: "America/Tegucigalpa",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
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
    precios: precios(2190, 4390),
    listas: listas(3220),
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Mexico_City",
    mediosPago: ["Mercado Pago México (tarjeta de crédito o débito)", "SPEI", "OXXO", "Mercado Pago Wallet"],
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
    precios: precios(69, 139),
    listas: listas(102),
    dispositivo: "computadora",
    voseo: false,
    indexable: false,
    zonaHoraria: "America/Managua",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
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
    // Mismo precio que Costa Rica: USD 149 y análisis 299.
    precios: precios(149, 299),
    listas: listas(220),
    dispositivo: "computadora",
    voseo: false,
    indexable: false,
    zonaHoraria: "America/Panama",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
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
    // Precio en USD pendiente de aprobación de Manu. Sin monto no se muestra
    // precio, no se declara Offer y la ficha invita a consultar por WhatsApp.
    precios: preciosVacios(),
    listas: preciosVacios(),
    dispositivo: "computadora",
    voseo: false,
    indexable: false,
    zonaHoraria: "America/Asuncion",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
    contacto: contactoPendiente(),
  },
  {
    iso: "pe",
    nombre: "Perú",
    idioma: "es-PE",
    moneda: "PEN",
    simbolo: "S/",
    locale: "es-PE",
    decimales: 2,
    pago: "mp",
    precios: precios(349, 699),
    listas: listas(514),
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Lima",
    mediosPago: ["Mercado Pago Perú (tarjeta de crédito o débito)", "Yape o Plin", "Transferencia bancaria en soles"],
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
    precios: precios(109, 219),
    listas: listas(161),
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Santo_Domingo",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
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
    precios: precios(5990, 11990),
    listas: listas(8790),
    dispositivo: "computadora",
    voseo: true,
    indexable: true,
    zonaHoraria: "America/Montevideo",
    mediosPago: ["Mercado Pago Uruguay (tarjeta de crédito o débito)", "Mercado Pago Wallet", "Transferencia bancaria en pesos uruguayos"],
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
    precios: precios(69, 139),
    listas: listas(102),
    dispositivo: "computadora",
    voseo: false,
    indexable: true,
    zonaHoraria: "America/Caracas",
    mediosPago: ["Mercado Pago (tarjeta de crédito o débito)", "Webpay de Flow", "Transferencia bancaria en dólares"],
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

export function normalizarPais(iso: string | null | undefined): string {
  return esIsoPais(iso) ? iso : ISO_CHILE;
}
