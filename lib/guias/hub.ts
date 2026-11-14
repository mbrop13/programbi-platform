/**
 * Helpers puros del hub de guías. Este archivo lo importa un componente de
 * cliente, así que no debe importar `generado.ts`, `courses.ts` ni precios:
 * solo tipos borrados en compilación y funciones sin datos.
 */

export type Opcion = {
  valor: string;
  etiqueta: string;
  /** Guías de ese país o curso en el listado que originó la opción. */
  cantidad?: number;
  /** Curso que la portada del catálogo marca como destacado. */
  destacado?: boolean;
};

export type Filtros = {
  pais: string;
  curso: string;
  q: string;
};

/**
 * Datos mínimos de una guía para pintar la tarjeta y filtrarla en cliente.
 * El cuerpo Markdown, las FAQ y las fuentes se quedan en el servidor: enviar
 * `GUIAS` completo serializaba más de 1 MB de contenido en el payload RSC.
 */
export type TarjetaGuia = {
  path: string;
  title: string;
  h1: string;
  description: string;
  course: string;
  courseName: string;
  country: string;
  countryName: string;
  /** Posición del país en config/paises.ts, resuelta en servidor. */
  countryOrder: number;
  updated: string;
  updatedLabel: string;
  imageUrl?: string;
  accentColor?: string;
  readingMinutes?: number;
  guideImage?: string;
};

export type GrupoCurso = {
  curso: string;
  nombre: string;
  /** El curso es de portada según lib/data/courses.ts. */
  destacado: boolean;
  guias: TarjetaGuia[];
};

export type ConteoPais = {
  iso: string;
  nombre: string;
  cantidad: number;
};

/** Sin acentos, mayúsculas ni signos: «power-bi» y «Power BI» buscan lo mismo. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Busca en h1, title, descripción, curso y país. Varias palabras se exigen todas. */
export function filtrarGuias(guias: TarjetaGuia[], filtros: Filtros): TarjetaGuia[] {
  const palabras = normalizar(filtros.q).split(/\s+/).filter(Boolean);
  return guias.filter((guia) => {
    if (filtros.pais !== "todos" && guia.country !== filtros.pais) return false;
    if (filtros.curso !== "todos" && guia.course !== filtros.curso) return false;
    if (palabras.length === 0) return true;
    const texto = normalizar(
      `${guia.h1} ${guia.title} ${guia.description} ${guia.courseName} ${guia.course} ${guia.countryName}`
    );
    return palabras.every((palabra) => texto.includes(palabra));
  });
}

/**
 * Agrupa por curso en el orden de las opciones (primero los cursos destacados
 * del catálogo) y, dentro de cada grupo, por país. Los cursos que no estén en
 * `cursos` (por ejemplo, una guía general) van al final.
 */
export function agruparPorCurso(guias: TarjetaGuia[], cursos: Opcion[] = []): GrupoCurso[] {
  const indice = new Map(cursos.map((opcion, posicion) => [opcion.valor, posicion]));
  const meta = new Map(cursos.map((opcion) => [opcion.valor, opcion]));
  const grupos = new Map<string, TarjetaGuia[]>();

  for (const guia of guias) {
    const lista = grupos.get(guia.course);
    if (lista) lista.push(guia);
    else grupos.set(guia.course, [guia]);
  }

  return [...grupos.entries()]
    .sort(([a], [b]) => {
      const posicionA = indice.get(a);
      const posicionB = indice.get(b);
      if (posicionA === undefined && posicionB === undefined) return a.localeCompare(b, "es");
      if (posicionA === undefined) return 1;
      if (posicionB === undefined) return -1;
      return posicionA - posicionB;
    })
    .map(([curso, lista]) => ({
      curso,
      nombre: meta.get(curso)?.etiqueta ?? lista[0]?.courseName ?? curso,
      destacado: meta.get(curso)?.destacado === true,
      guias: [...lista].sort(
        (a, b) =>
          a.countryOrder - b.countryOrder ||
          a.countryName.localeCompare(b.countryName, "es") ||
          a.h1.localeCompare(b.h1, "es")
      ),
    }));
}
