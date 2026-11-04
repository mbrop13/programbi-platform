import { PAISES } from "@/config/paises";
import { getCourseBySlug } from "@/lib/data/courses";
import type { Guia } from "@/lib/guias/tipos";

export type Opcion = { valor: string; etiqueta: string };

export type Filtros = {
  pais: string;
  curso: string;
  q: string;
};

export type GrupoCurso = {
  curso: string;
  nombre: string;
  guias: Guia[];
};

export type ConteoPais = {
  iso: string;
  nombre: string;
  cantidad: number;
};

/** Nombres cortos para los filtros y las cabeceras de grupo. */
const NOMBRES_CURSO: Record<string, string> = {
  "analisis-de-datos": "Análisis de datos",
  "power-bi": "Power BI",
  "sql-server": "SQL Server",
  python: "Python",
  excel: "Excel",
  access: "Access",
  "mercado-financiero": "Mercado financiero",
  "analitica-mineria": "Minería",
  "machine-learning": "Machine Learning",
  "ia-productividad": "IA productividad",
  copilot: "Copilot",
  claude: "Claude",
  "power-automate": "Power Automate",
  general: "Guías generales",
};

/** Orden de los cursos en el hub: primero la ruta de datos, al final lo transversal. */
const ORDEN_CURSO = [
  "analisis-de-datos",
  "power-bi",
  "sql-server",
  "python",
  "excel",
  "access",
  "mercado-financiero",
  "analitica-mineria",
  "machine-learning",
  "ia-productividad",
  "copilot",
  "claude",
  "power-automate",
  "general",
];

const ORDEN_PAIS = new Map(PAISES.map((pais, indice) => [pais.iso, indice]));

/** Sin acentos, mayúsculas ni signos: «power-bi» y «Power BI» buscan lo mismo. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function nombreCurso(curso: string): string {
  return NOMBRES_CURSO[curso] ?? getCourseBySlug(curso)?.title ?? curso;
}

function indiceCurso(curso: string): number {
  const indice = ORDEN_CURSO.indexOf(curso);
  return indice === -1 ? ORDEN_CURSO.length : indice;
}

function ordenPais(iso: string): number {
  if (iso === "transversal") return PAISES.length + 1;
  return ORDEN_PAIS.get(iso) ?? PAISES.length;
}

/** Opciones del filtro de país, solo con mercados que tienen guías. */
export function opcionesPais(guias: Guia[]): Opcion[] {
  const presentes = new Set(guias.map((guia) => guia.country));
  const opciones = PAISES.filter((pais) => presentes.has(pais.iso)).map((pais) => ({
    valor: pais.iso,
    etiqueta: pais.nombre,
  }));
  if (presentes.has("transversal")) {
    opciones.push({ valor: "transversal", etiqueta: "Latinoamérica" });
  }
  return opciones;
}

/** Opciones del filtro de curso, en el orden de la ruta de datos. */
export function opcionesCurso(guias: Guia[]): Opcion[] {
  const presentes = new Set(guias.map((guia) => guia.course));
  return [...presentes]
    .sort((a, b) => indiceCurso(a) - indiceCurso(b) || nombreCurso(a).localeCompare(nombreCurso(b), "es"))
    .map((curso) => ({ valor: curso, etiqueta: nombreCurso(curso) }));
}

/** Busca en h1, title, description y curso. Varias palabras se exigen todas. */
export function filtrarGuias(guias: Guia[], filtros: Filtros): Guia[] {
  const palabras = normalizar(filtros.q).split(/\s+/).filter(Boolean);
  return guias.filter((guia) => {
    if (filtros.pais !== "todos" && guia.country !== filtros.pais) return false;
    if (filtros.curso !== "todos" && guia.course !== filtros.curso) return false;
    if (palabras.length === 0) return true;
    const texto = normalizar(
      `${guia.h1} ${guia.title} ${guia.description} ${nombreCurso(guia.course)} ${guia.course}`
    );
    return palabras.every((palabra) => texto.includes(palabra));
  });
}

/** Agrupa por curso respetando el orden de la ruta de datos. */
export function agruparPorCurso(guias: Guia[]): GrupoCurso[] {
  const grupos = new Map<string, Guia[]>();
  for (const guia of guias) {
    const lista = grupos.get(guia.course);
    if (lista) lista.push(guia);
    else grupos.set(guia.course, [guia]);
  }
  return [...grupos.entries()]
    .sort(([a], [b]) => indiceCurso(a) - indiceCurso(b))
    .map(([curso, lista]) => ({
      curso,
      nombre: nombreCurso(curso),
      guias: [...lista].sort(
        (a, b) => ordenPais(a.country) - ordenPais(b.country) || a.h1.localeCompare(b.h1, "es")
      ),
    }));
}

/** Cantidad de guías por país, en el orden de config/paises.ts. */
export function paisesConConteo(guias: Guia[]): ConteoPais[] {
  const conteo = new Map<string, number>();
  for (const guia of guias) {
    if (guia.country === "transversal") continue;
    conteo.set(guia.country, (conteo.get(guia.country) ?? 0) + 1);
  }
  return PAISES.filter((pais) => conteo.has(pais.iso)).map((pais) => ({
    iso: pais.iso,
    nombre: pais.nombre,
    cantidad: conteo.get(pais.iso) ?? 0,
  }));
}
