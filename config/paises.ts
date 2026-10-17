/**
 * Un país = una entrada. Chile no usa carpeta: sus URLs siguen en la raíz.
 * Los precios locales se fijan a mano. null se muestra como [DEFINIR PRECIO].
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
  "analitica-financiera",
  "machine-learning",
] as const;

export type SlugCurso = (typeof SLUGS_CURSO)[number];
export type PreciosCurso = Record<SlugCurso, number | null>;

function preciosVacios(): PreciosCurso {
  return Object.fromEntries(SLUGS_CURSO.map((slug) => [slug, null])) as PreciosCurso;
}

/**
 * Monto que se cobra, ya con el descuento habitual.
 * `normal` es un curso. Análisis de datos es el doble.
 */
function precios(normal: number, analisis: number): PreciosCurso {
  const tabla = preciosVacios();
  for (const slug of SLUGS_CURSO) {
    tabla[slug] = slug === "analisis-de-datos" ? analisis : normal;
  }
  return tabla;
}

/**
 * Precio tachado. En Chile un curso vale 249.000 y Análisis de datos 747.000 (el triple).
 * `normal` es ese original local. Análisis de datos queda en normal × 3.
 */
function listas(normal: number): PreciosCurso {
  const tabla = preciosVacios();
  for (const slug of SLUGS_CURSO) {
    tabla[slug] = slug === "analisis-de-datos" ? normal * 3 : normal;
  }
  return tabla;
}

/**
 * Pesos argentinos (ARS). PRECIOS_ARS es el cobro. PRECIOS_LISTA_ARS es el tachado.
 * Actualiza los dos cuando haya inflación.
 */
export const PRECIOS_LISTA_ARS: PreciosCurso = listas(236000);
export const PRECIOS_ARS: PreciosCurso = {
  "analisis-de-datos": 319900,
  copilot: 159900,
  claude: 159900,
  "power-automate": 159900,
  "analitica-mineria": 159900,
  "ia-productividad": 159900,
  "power-bi": 159900,
  python: 159900,
  "sql-server": 159900,
  excel: 159900,
  "analitica-financiera": 159900,
  "machine-learning": 159900,
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
  /** Precio tachado. Chile lo arma el catálogo (249.000 y 747.000). */
  listas: PreciosCurso | "catalogo";
  dispositivo: "computador" | "computadora";
  /** Voseo solo en titulares y botones. */
  voseo: boolean;
  contacto: {
    email: string;
    whatsapp: string | null;
    ciudad: string;
  };
};

const EMAIL = "contacto@programbi.cl";
const WHATSAPP_CL = "https://wa.me/56935409699";

function contactoPendiente(iso: string): Pais["contacto"] {
  return {
    email: EMAIL,
    whatsapp: null,
    ciudad: `[PENDIENTE CONTENIDO ${iso.toUpperCase()}]`,
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
    contacto: contactoPendiente("ar"),
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
    contacto: contactoPendiente("bo"),
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
    contacto: contactoPendiente("co"),
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
    // 87% del básico chileno: USD 149. Análisis 299, el doble al corte de 99→199.
    precios: precios(149, 299),
    listas: listas(220),
    dispositivo: "computadora",
    voseo: false,
    contacto: contactoPendiente("cr"),
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
    contacto: contactoPendiente("ec"),
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
    contacto: contactoPendiente("sv"),
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
    contacto: contactoPendiente("gt"),
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
    contacto: contactoPendiente("hn"),
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
    contacto: contactoPendiente("mx"),
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
    contacto: contactoPendiente("ni"),
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
    contacto: contactoPendiente("pa"),
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
    precios: precios(89, 179),
    listas: listas(131),
    dispositivo: "computadora",
    voseo: false,
    contacto: contactoPendiente("py"),
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
    contacto: contactoPendiente("pe"),
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
    contacto: contactoPendiente("do"),
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
    contacto: contactoPendiente("uy"),
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
    contacto: contactoPendiente("ve"),
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

export function normalizarPais(iso: string | null | undefined): string {
  return esIsoPais(iso) ? iso : ISO_CHILE;
}
