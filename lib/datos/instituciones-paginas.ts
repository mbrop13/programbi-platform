import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getFotoInstitucion } from "./instituciones-fotos";
import { getRankingCarreras, type RankingItem, type TipoIesKey } from "./carreras";
import {
  getInstitucionVisual,
  INSTITUCIONES_DESTACADAS_KEYS,
  type InstitucionVisual,
} from "./instituciones-visual";

/** Fila compacta de public/datos/carreras/programas-{tipo}.json (Buscador de Carreras SIES 2026). */
interface FilaPrograma {
  s: string; // slug de la carrera genérica
  i: string; // institución
  n: string; // nombre del programa
  r: string; // región
  j: string; // jornada
  a: number | null; // arancel anual
  d: number | null; // duración formal (semestres)
  v: number | null; // vacantes
  p: number | null; // puntaje PAES promedio de matriculados
  c: number | null; // años de acreditación
}

export interface CarreraEnInstitucion {
  slug: string;
  nombre: string;
  area: string;
  programas: number;
  jornadas: string[];
  regiones: string[];
  arancelMin: number | null;
  arancelMax: number | null;
  durFormal: number | null;
  vacantes: number;
  paesProm: number | null;
  /** Indicadores nacionales de la carrera genérica (no son de esta institución). */
  nacional: Pick<RankingItem, "ing4" | "emp1"> | null;
}

export interface PaginaInstitucion {
  slug: string;
  key: string;
  tipo: TipoIesKey;
  visual: InstitucionVisual;
  programas: number;
  carreras: CarreraEnInstitucion[];
  regiones: string[];
  acreditacion: number | null;
  arancelMediano: number | null;
  vacantes: number;
}

const TIPO_DE: Record<InstitucionVisual["tipo"], TipoIesKey> = { U: "u", IP: "ip", CFT: "cft" };

// URLs legibles para las instituciones destacadas. INACAP y Santo Tomás existen como IP y como CFT.
const DESTACADAS: Record<string, { slug: string; nombre: string }> = {
  "UNIVERSIDAD DE CHILE": { slug: "uchile", nombre: "Universidad de Chile" },
  "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE": { slug: "uc", nombre: "Pontificia Universidad Católica de Chile" },
  "UNIVERSIDAD TECNICA FEDERICO SANTA MARIA": { slug: "usm", nombre: "Universidad Técnica Federico Santa María" },
  "UNIVERSIDAD DE CONCEPCION": { slug: "udec", nombre: "Universidad de Concepción" },
  "UNIVERSIDAD DE SANTIAGO DE CHILE": { slug: "usach", nombre: "Universidad de Santiago de Chile" },
  "PONTIFICIA UNIVERSIDAD CATOLICA DE VALPARAISO": { slug: "pucv", nombre: "Pontificia Universidad Católica de Valparaíso" },
  "UNIVERSIDAD ADOLFO IBANEZ": { slug: "uai", nombre: "Universidad Adolfo Ibáñez" },
  "UNIVERSIDAD DIEGO PORTALES": { slug: "udp", nombre: "Universidad Diego Portales" },
  "UNIVERSIDAD AUSTRAL DE CHILE": { slug: "uach", nombre: "Universidad Austral de Chile" },
  "UNIVERSIDAD ANDRES BELLO": { slug: "unab", nombre: "Universidad Andrés Bello" },
  "UNIVERSIDAD DEL DESARROLLO": { slug: "udd", nombre: "Universidad del Desarrollo" },
  "UNIVERSIDAD DE LOS ANDES": { slug: "uandes", nombre: "Universidad de los Andes" },
  "IP DUOC UC": { slug: "duoc-uc", nombre: "Duoc UC" },
  "IP INACAP": { slug: "inacap-ip", nombre: "Instituto Profesional INACAP" },
  "IP AIEP": { slug: "aiep", nombre: "Instituto Profesional AIEP" },
  "IP SANTO TOMAS": { slug: "santo-tomas-ip", nombre: "Instituto Profesional Santo Tomás" },
  "IP DE CHILE": { slug: "ipchile", nombre: "Instituto Profesional de Chile" },
  "IP IACC": { slug: "iacc", nombre: "Instituto Profesional IACC" },
  "CFT INACAP": { slug: "inacap-cft", nombre: "CFT INACAP" },
  "CFT SANTO TOMAS": { slug: "santo-tomas-cft", nombre: "CFT Santo Tomás" },
  "CFT CEDUC - UCN": { slug: "ceduc-ucn", nombre: "CFT CEDUC UCN" },
  "CFT SAN AGUSTIN": { slug: "cft-san-agustin", nombre: "CFT San Agustín" },
  "CFT PUCV": { slug: "cft-pucv", nombre: "CFT PUCV" },
  "CFT DE ENAC": { slug: "enac", nombre: "CFT ENAC" },
};

function slugDe(visual: InstitucionVisual): string {
  return (
    DESTACADAS[visual.key]?.slug ??
    visual.sigla
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

let cacheFilas: Partial<Record<TipoIesKey, FilaPrograma[]>> = {};

function filasTipo(tipo: TipoIesKey): FilaPrograma[] {
  const cache = cacheFilas[tipo];
  if (cache) return cache;
  const file = join(process.cwd(), "public", "datos", "carreras", `programas-${tipo}.json`);
  const filas = existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as FilaPrograma[]) : [];
  cacheFilas = { ...cacheFilas, [tipo]: filas };
  return filas;
}

function mediana(valores: number[]): number | null {
  if (valores.length === 0) return null;
  const orden = [...valores].sort((a, b) => a - b);
  const m = Math.floor(orden.length / 2);
  return orden.length % 2 ? orden[m] : Math.round((orden[m - 1] + orden[m]) / 2);
}

function moda(valores: number[]): number | null {
  if (valores.length === 0) return null;
  const conteo = new Map<number, number>();
  for (const v of valores) conteo.set(v, (conteo.get(v) ?? 0) + 1);
  return [...conteo.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0][0];
}

/** Instituciones destacadas con página propia. */
export function getInstitucionesConPagina(): { slug: string; key: string; visual: InstitucionVisual }[] {
  return INSTITUCIONES_DESTACADAS_KEYS.map((key) => {
    const visual = getInstitucionVisual(key);
    return { slug: slugDe(visual), key: visual.key, visual };
  });
}

/** Nombre completo con tildes (los datos del SIES vienen en mayúsculas y sin tildes). */
export function nombreInstitucion(visual: InstitucionVisual): string {
  return DESTACADAS[visual.key]?.nombre ?? visual.nombreCorto;
}

export function slugInstitucion(key: string): string | null {
  return getInstitucionesConPagina().find((i) => i.key === getInstitucionVisual(key).key)?.slug ?? null;
}

export function getPaginaInstitucion(slug: string): PaginaInstitucion | null {
  const entrada = getInstitucionesConPagina().find((i) => i.slug === slug);
  if (!entrada) return null;
  const { visual } = entrada;
  const tipo = TIPO_DE[visual.tipo];

  const filas = filasTipo(tipo).filter((f) => getInstitucionVisual(f.i, visual.tipo).key === visual.key);
  if (filas.length === 0) return null;

  const ranking = new Map(
    getRankingCarreras()
      .filter((r) => r.tipo === tipo)
      .map((r) => [r.slug, r])
  );

  const porCarrera = new Map<string, FilaPrograma[]>();
  for (const f of filas) {
    const lista = porCarrera.get(f.s) ?? [];
    lista.push(f);
    porCarrera.set(f.s, lista);
  }

  const carreras: CarreraEnInstitucion[] = [...porCarrera.entries()].map(([s, lista]) => {
    const r = ranking.get(s);
    const aranceles = lista.map((f) => f.a).filter((a): a is number => a !== null && a > 0);
    const paes = lista.map((f) => f.p).filter((p): p is number => p !== null && p > 0);
    return {
      slug: s,
      nombre: r?.nombre ?? lista[0].n,
      area: r?.area ?? "Otras",
      programas: lista.length,
      jornadas: [...new Set(lista.map((f) => f.j))].sort(),
      regiones: [...new Set(lista.map((f) => f.r))].sort(),
      arancelMin: aranceles.length ? Math.min(...aranceles) : null,
      arancelMax: aranceles.length ? Math.max(...aranceles) : null,
      durFormal: moda(lista.map((f) => f.d).filter((d): d is number => d !== null && d > 0)),
      vacantes: lista.reduce((acc, f) => acc + (f.v ?? 0), 0),
      paesProm: paes.length ? Math.round(paes.reduce((a, b) => a + b, 0) / paes.length) : null,
      nacional: r ? { ing4: r.ing4, emp1: r.emp1 } : null,
    };
  });

  carreras.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  return {
    slug,
    key: visual.key,
    tipo,
    visual,
    programas: filas.length,
    carreras,
    regiones: [...new Set(filas.map((f) => f.r))].sort((a, b) => a.localeCompare(b, "es")),
    acreditacion: moda(filas.map((f) => f.c).filter((c): c is number => c !== null && c > 0)),
    arancelMediano: mediana(filas.map((f) => f.a).filter((a): a is number => a !== null && a > 0)),
    vacantes: filas.reduce((acc, f) => acc + (f.v ?? 0), 0),
  };
}

/** Datos listos para TarjetaInstitucion (componente cliente): sin fs ni funciones. */
export interface TarjetaInstitucionDatos {
  key: string;
  slug: string | null;
  nombre: string;
  sigla: string;
  tipo: "U" | "IP" | "CFT";
  ciudad?: string;
  color: string;
  programas: number | null;
  carreras: number | null;
  acreditacion: number | null;
  foto: { srcSm: string; alt: string } | null;
}

/** Sólo instituciones con oferta 2026 (CFT INACAP, por ejemplo, ya no tiene programas propios). */
export function getTarjetasInstituciones(): TarjetaInstitucionDatos[] {
  return getInstitucionesConPagina().flatMap(({ slug, key, visual }) => {
    const pagina = getPaginaInstitucion(slug);
    if (!pagina) return [];
    const foto = getFotoInstitucion(key);
    return {
      key,
      slug: pagina ? slug : null,
      nombre: nombreInstitucion(visual),
      sigla: visual.sigla,
      tipo: visual.tipo,
      ciudad: visual.ciudad,
      color: visual.color,
      programas: pagina?.programas ?? null,
      carreras: pagina?.carreras.length ?? null,
      acreditacion: pagina?.acreditacion ?? null,
      foto: foto ? { srcSm: foto.srcSm, alt: foto.alt } : null,
    };
  });
}
