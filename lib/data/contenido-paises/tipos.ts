/**
 * Contenido propio de cada landing de país.
 *
 * Argentina, México, Perú, Colombia y Uruguay comparten la estructura de la
 * página, pero no el texto: cada archivo `xx.ts` define su intro, sus casos de
 * uso por industria, sus referencias locales, su bloque de moneda y sus FAQ.
 *
 * Regla editorial: los casos son escenarios de trabajo por industria, no casos
 * de clientes. No se inventan alumnos, cifras ni empresas.
 */

export type CategoriaFaqPais = "general" | "cursos" | "pagos";

export type FaqPais = {
  q: string;
  a: string;
  categoria: CategoriaFaqPais;
};

export type CasoUsoPais = {
  /** Industria o sector local. */
  sector: string;
  titulo: string;
  descripcion: string;
  /** Sistemas o datos locales que suelen alimentar el tablero. */
  fuente: string;
};

export type ReferenciaPais = {
  nombre: string;
  detalle: string;
};

export type SeoPagina = {
  title: string;
  description: string;
};

/**
 * Título y descripción propios de las páginas internas. Sin esto, las rutas
 * de varios países reutilizan el mismo texto base y solo cambia el nombre.
 */
export type SeoPaginasPais = {
  cursos: SeoPagina;
  faq: SeoPagina;
  implementacion: SeoPagina;
  migrar: SeoPagina;
  porQueFallan: SeoPagina;
  nosotros: SeoPagina;
};

/**
 * Contexto de mercado que usan las páginas que no son la home: empresas,
 * catálogo, fichas de curso y guías comerciales. Es texto propio del país,
 * no una sustitución del nombre de Chile.
 */
export type MercadoPais = {
  /** Ejemplo concreto de datos o proceso local. */
  ejemplo: string;
  /** Particularidades del horario de las clases en ese país. */
  horario: string;
  /** Cómo se factura y en qué moneda. */
  facturacion: string;
};

export type ContenidoPais = {
  iso: string;
  seo: SeoPagina;
  seoPaginas: SeoPaginasPais;
  hero: {
    h1: string;
    parrafo: string;
    nota: string;
  };
  intro: {
    kicker: string;
    titulo: string;
    parrafos: string[];
  };
  casos: CasoUsoPais[];
  referencias: ReferenciaPais[];
  moneda: {
    titulo: string;
    resumen: string;
    /** Aclaración sobre el cobro y el equivalente en CLP. */
    nota: string;
  };
  mercado: MercadoPais;
  /** Párrafo propio para la página institucional. */
  nosotros: {
    parrafo: string;
  };
  faqs: FaqPais[];
};
