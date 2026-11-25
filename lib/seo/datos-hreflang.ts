import { SITE_URL } from "@/lib/seo";
import { esFichaIndexable, getCarrera } from "@/lib/datos/carreras";
import { getCarreraPe } from "@/lib/datos-pe/carreras";
import { getCarreraPorSlugCo } from "@/lib/datos-co/carreras";
import { getCarreraMxPorSlug } from "@/lib/datos-mx/carreras";

export interface ParHreflangDatos {
  readonly cl: string;
  readonly pe?: string;
  readonly co?: string;
  readonly mx?: string;
  readonly ar?: string;
}

/**
 * Tabla única y compartida de equivalencias reales entre páginas de datos
 * públicos de Chile (`es-CL`, también `x-default`) y los mercados de LatAm
 * (`es-PE`, `es-CO`, `es-MX`, `es-AR`).
 *
 * Reglas estrictas:
 * - Reciprocidad 100 %: cada URL en un cluster emite el mismo conjunto de
 *   alternates (`x-default` = Chile + `es-CL` + cada país presente).
 * - Solo equivalencias reales y explícitas verificadas contra los datasets
 *   publicables de cada país. Sin pares inventados.
 * - Nunca empareja hubs (`/pe/datos`, `/co/datos`, `/mx/datos`, `/ar/datos`),
 *   páginas exclusivas ni guías laborales.
 */
export const PARES_HREFLANG_DATOS: readonly ParHreflangDatos[] = [
  // Rutas principales / macro / herramientas
  {
    cl: "/datos/carreras",
    pe: "/pe/datos/carreras",
    co: "/co/datos/carreras",
    mx: "/mx/datos/carreras",
    ar: "/ar/datos/carreras",
  },
  {
    cl: "/datos/carreras/mejor-pagadas",
    pe: "/pe/datos/carreras/mejor-pagadas",
    co: "/co/datos/carreras/mejor-pagadas",
    mx: "/mx/datos/carreras-mejor-pagadas",
    ar: "/ar/datos/carreras/mejor-pagadas",
  },
  {
    cl: "/datos/carreras/mas-empleabilidad",
    ar: "/ar/datos/carreras/salida-laboral",
  },
  {
    cl: "/datos/carreras/comparar",
    co: "/co/datos/carreras/comparar",
  },
  {
    cl: "/datos/desempleo",
    co: "/co/datos/desempleo",
    ar: "/ar/datos/desempleo",
  },
  {
    cl: "/datos/inflacion",
    co: "/co/datos/inflacion",
    ar: "/ar/datos/inflacion",
  },

  // Fichas de carreras con equivalencia 1:1 verificada
  {
    cl: "/datos/carreras/administracion-de-empresas-e-ing-asociadas",
    mx: "/mx/datos/carreras/administracion-de-empresas",
  },
  {
    cl: "/datos/carreras/administracion-gastronomica",
    mx: "/mx/datos/carreras/gastronomia-y-servicios-de-alimentos",
  },
  {
    cl: "/datos/carreras/administracion-publica",
    co: "/co/datos/carreras/administracion-publica",
    mx: "/mx/datos/carreras/administracion-publica",
  },
  {
    cl: "/datos/carreras/administracion-turistica-y-hotelera",
    co: "/co/datos/carreras/administracion-turistica-y-hotelera",
    mx: "/mx/datos/carreras/hospitalidad-y-turismo",
  },
  {
    cl: "/datos/carreras/agronomia",
    co: "/co/datos/carreras/agronomia",
  },
  {
    cl: "/datos/carreras/antropologia",
    co: "/co/datos/carreras/antropologia",
  },
  {
    cl: "/datos/carreras/arquitectura",
    pe: "/pe/datos/carreras/arquitectura-y-urbanismo",
    co: "/co/datos/carreras/arquitectura",
    mx: "/mx/datos/carreras/arquitectura-y-urbanismo",
  },
  {
    cl: "/datos/carreras/biologia",
    co: "/co/datos/carreras/biologia",
    mx: "/mx/datos/carreras/biologia",
  },
  {
    cl: "/datos/carreras/bioquimica",
    mx: "/mx/datos/carreras/bioquimica-y-biofisica",
  },
  {
    cl: "/datos/carreras/ciencias-politicas",
    co: "/co/datos/carreras/ciencia-politica",
    mx: "/mx/datos/carreras/ciencias-politicas",
  },
  {
    cl: "/datos/carreras/contador-auditor",
    mx: "/mx/datos/carreras/contabilidad-y-fiscalizacion",
  },
  {
    cl: "/datos/carreras/derecho",
    pe: "/pe/datos/carreras/derecho",
    co: "/co/datos/carreras/derecho",
    mx: "/mx/datos/carreras/derecho",
  },
  {
    cl: "/datos/carreras/diseno",
    co: "/co/datos/carreras/diseno",
  },
  {
    cl: "/datos/carreras/diseno-grafico",
    co: "/co/datos/carreras/diseno-grafico",
    mx: "/mx/datos/carreras/diseno-y-comunicacion-grafica-y-editorial",
  },
  {
    cl: "/datos/carreras/diseno-industrial",
    co: "/co/datos/carreras/diseno-industrial",
  },
  {
    cl: "/datos/carreras/enfermeria",
    pe: "/pe/datos/carreras/enfermeria",
    co: "/co/datos/carreras/enfermeria",
    mx: "/mx/datos/carreras/enfermeria-general-y-obstetricia",
  },
  {
    cl: "/datos/carreras/fonoaudiologia",
    co: "/co/datos/carreras/fonoaudiologia",
  },
  {
    cl: "/datos/carreras/geologia",
    co: "/co/datos/carreras/geologia",
  },
  {
    cl: "/datos/carreras/ingenieria-agricola",
    co: "/co/datos/carreras/ingenieria-agricola",
  },
  {
    cl: "/datos/carreras/ingenieria-en-finanzas",
    mx: "/mx/datos/carreras/finanzas-banca-y-seguros",
  },
  {
    cl: "/datos/carreras/ingenieria-en-quimica",
    mx: "/mx/datos/carreras/ingenieria-de-procesos-quimicos",
  },
  {
    cl: "/datos/carreras/ingenieria-en-telecomunicaciones",
    co: "/co/datos/carreras/ingenieria-en-telecomunicaciones",
  },
  {
    cl: "/datos/carreras/ingenieria-forestal",
    co: "/co/datos/carreras/ingenieria-forestal",
  },
  {
    cl: "/datos/carreras/ingenieria-industrial",
    pe: "/pe/datos/carreras/ingenieria-industrial",
    co: "/co/datos/carreras/ingenieria-industrial",
    mx: "/mx/datos/carreras/ingenieria-industrial",
  },
  {
    cl: "/datos/carreras/ingenieria-mecanica",
    pe: "/pe/datos/carreras/ingenieria-mecanica",
    co: "/co/datos/carreras/ingenieria-mecanica",
  },
  {
    cl: "/datos/carreras/licenciatura-en-letras-y-literatura",
    mx: "/mx/datos/carreras/literatura",
  },
  {
    cl: "/datos/carreras/medicina",
    pe: "/pe/datos/carreras/medicina",
    co: "/co/datos/carreras/medicina",
    mx: "/mx/datos/carreras/medicina-general",
  },
  {
    cl: "/datos/carreras/medicina-veterinaria",
    co: "/co/datos/carreras/medicina-veterinaria",
    mx: "/mx/datos/carreras/veterinaria",
  },
  {
    cl: "/datos/carreras/nutricion-y-dietetica",
    co: "/co/datos/carreras/nutricion-y-dietetica",
    mx: "/mx/datos/carreras/nutricion",
  },
  {
    cl: "/datos/carreras/obstetricia-y-puericultura",
    pe: "/pe/datos/carreras/obstetricia",
  },
  {
    cl: "/datos/carreras/odontologia",
    co: "/co/datos/carreras/odontologia",
    mx: "/mx/datos/carreras/estomatologia-y-odontologia-general",
  },
  {
    cl: "/datos/carreras/pedagogia-en-educacion-basica",
    mx: "/mx/datos/carreras/formacion-docente-en-educacion-basica-nivel-primaria",
  },
  {
    cl: "/datos/carreras/pedagogia-en-educacion-de-parvulos",
    mx: "/mx/datos/carreras/formacion-docente-en-educacion-basica-nivel-preescolar",
  },
  {
    cl: "/datos/carreras/psicologia",
    pe: "/pe/datos/carreras/psicologia",
    co: "/co/datos/carreras/psicologia",
    mx: "/mx/datos/carreras/psicologia",
  },
  {
    cl: "/datos/carreras/publicidad",
    co: "/co/datos/carreras/publicidad",
  },
  {
    cl: "/datos/carreras/quimica-licenciado-en-quimica",
    mx: "/mx/datos/carreras/quimica",
  },
  {
    cl: "/datos/carreras/sociologia",
    co: "/co/datos/carreras/sociologia",
  },
  {
    cl: "/datos/carreras/tecnico-agropecuario",
    pe: "/pe/datos/carreras/agropecuaria-tecnica",
  },
  {
    cl: "/datos/carreras/tecnico-en-administracion-de-empresas",
    pe: "/pe/datos/carreras/administracion-de-empresas-tecnica",
  },
  {
    cl: "/datos/carreras/tecnico-en-computacion-e-informatica",
    mx: "/mx/datos/carreras/tsu-informatica",
  },
  {
    cl: "/datos/carreras/tecnico-en-contabilidad-general",
    pe: "/pe/datos/carreras/contabilidad-tecnica",
    mx: "/mx/datos/carreras/tsu-contabilidad-y-fiscalizacion",
  },
  {
    cl: "/datos/carreras/tecnico-en-enfermeria",
    pe: "/pe/datos/carreras/enfermeria-tecnica",
    mx: "/mx/datos/carreras/tsu-enfermeria-general-y-obstetricia",
  },
  {
    cl: "/datos/carreras/terapia-ocupacional",
    co: "/co/datos/carreras/terapia-ocupacional",
  },
  {
    cl: "/datos/carreras/trabajo-social",
    co: "/co/datos/carreras/trabajo-social",
    mx: "/mx/datos/carreras/trabajo-y-atencion-social",
  },
];

const CL_FICHA_PREFIX = "/datos/carreras/";
const PE_FICHA_PREFIX = "/pe/datos/carreras/";
const CO_FICHA_PREFIX = "/co/datos/carreras/";
const MX_FICHA_PREFIX = "/mx/datos/carreras/";

const RUTAS_BASE_CL = new Set([
  "/datos/carreras",
  "/datos/carreras/mejor-pagadas",
  "/datos/carreras/mas-empleabilidad",
  "/datos/carreras/comparar",
  "/datos/desempleo",
  "/datos/inflacion",
]);

function normalizarPath(path: string): string {
  const sinQuery = (path.split("?")[0] ?? "/").split("#")[0] ?? "/";
  const conBarra = sinQuery.startsWith("/") ? sinQuery : `/${sinQuery}`;
  const sinFinal = conBarra.replace(/\/+$/, "");
  return sinFinal || "/";
}

function esFichaClValida(path: string): boolean {
  if (RUTAS_BASE_CL.has(path)) return true;
  if (!path.startsWith(CL_FICHA_PREFIX)) return false;
  const carrera = getCarrera(path.slice(CL_FICHA_PREFIX.length));
  return Boolean(carrera && esFichaIndexable(carrera));
}

function esRutaPeValida(path: string): boolean {
  if (path === "/pe/datos/carreras" || path === "/pe/datos/carreras/mejor-pagadas") {
    return true;
  }
  if (!path.startsWith(PE_FICHA_PREFIX)) return false;
  return Boolean(getCarreraPe(path.slice(PE_FICHA_PREFIX.length)));
}

function esRutaCoValida(path: string): boolean {
  if (
    path === "/co/datos/carreras" ||
    path === "/co/datos/carreras/mejor-pagadas" ||
    path === "/co/datos/carreras/comparar" ||
    path === "/co/datos/desempleo" ||
    path === "/co/datos/inflacion"
  ) {
    return true;
  }
  if (!path.startsWith(CO_FICHA_PREFIX)) return false;
  const carrera = getCarreraPorSlugCo(path.slice(CO_FICHA_PREFIX.length));
  return Boolean(carrera && carrera.sugerido_ficha);
}

function esRutaMxValida(path: string): boolean {
  if (path === "/mx/datos/carreras" || path === "/mx/datos/carreras-mejor-pagadas") {
    return true;
  }
  if (!path.startsWith(MX_FICHA_PREFIX)) return false;
  const carrera = getCarreraMxPorSlug(path.slice(MX_FICHA_PREFIX.length));
  return Boolean(carrera && carrera.publicable);
}

function construirLanguagesDePar(par: ParHreflangDatos): Record<string, string> | undefined {
  const cl = normalizarPath(par.cl);
  if (!esFichaClValida(cl)) return undefined;

  const activos: Array<[string, string]> = [];
  if (par.pe && esRutaPeValida(normalizarPath(par.pe))) {
    activos.push(["es-PE", `${SITE_URL}${normalizarPath(par.pe)}`]);
  }
  if (par.co && esRutaCoValida(normalizarPath(par.co))) {
    activos.push(["es-CO", `${SITE_URL}${normalizarPath(par.co)}`]);
  }
  if (par.mx && esRutaMxValida(normalizarPath(par.mx))) {
    activos.push(["es-MX", `${SITE_URL}${normalizarPath(par.mx)}`]);
  }
  if (par.ar) {
    activos.push(["es-AR", `${SITE_URL}${normalizarPath(par.ar)}`]);
  }

  if (activos.length === 0) return undefined;

  const clUrl = `${SITE_URL}${cl}`;
  const languages: Record<string, string> = {
    "x-default": clUrl,
    "es-CL": clUrl,
  };
  for (const [locale, url] of activos) {
    languages[locale] = url;
  }
  return languages;
}

const HREFLANG_POR_RUTA = new Map<string, Record<string, string>>();
for (const par of PARES_HREFLANG_DATOS) {
  const languages = construirLanguagesDePar(par);
  if (!languages) continue;
  HREFLANG_POR_RUTA.set(normalizarPath(par.cl), languages);
  if (par.pe && languages["es-PE"]) HREFLANG_POR_RUTA.set(normalizarPath(par.pe), languages);
  if (par.co && languages["es-CO"]) HREFLANG_POR_RUTA.set(normalizarPath(par.co), languages);
  if (par.mx && languages["es-MX"]) HREFLANG_POR_RUTA.set(normalizarPath(par.mx), languages);
  if (par.ar && languages["es-AR"]) HREFLANG_POR_RUTA.set(normalizarPath(par.ar), languages);
}

/**
 * Devuelve el mapa recíproco `alternates.languages` (`x-default`, `es-CL` y
 * los países con equivalente real publicado) o `undefined` si la ruta es
 * exclusiva de un país.
 */
export function hreflangDatosDe(path: string): Record<string, string> | undefined {
  return HREFLANG_POR_RUTA.get(normalizarPath(path));
}

/**
 * Devuelve `{ languages }` listo para `MetadataRoute.Sitemap` cuando la ruta
 * tiene equivalencia internacional recíproca, o `undefined` en caso contrario.
 */
export function alternatesSitemapDatosDe(
  path: string
): { languages: Record<string, string> } | undefined {
  const languages = hreflangDatosDe(path);
  return languages ? { languages } : undefined;
}
