/** Tipos del contenido de guías. La fuente es cada .md de content/guias. */
export type GuiaFaq = { q: string; a: string };

export type Guia = {
  /** Ruta del archivo fuente, para trazabilidad. */
  source: string;
  slug: string;
  /** Ruta canónica relativa, con prefijo de país cuando corresponde. */
  path: string;
  /** ISO del país, o "transversal" cuando no tiene variante por país. */
  country: string;
  /** BCP 47 para `<html lang>` y `inLanguage`. */
  lang: string;
  title: string;
  description: string;
  h1: string;
  /** Fecha ISO (YYYY-MM-DD) visible como «Actualizado». */
  updated: string;
  /** Curso al que empuja la guía: power-bi o claude. */
  course: string;
  /** Markdown del cuerpo, con marcadores <!-- CTA-TOP|MID|END -->. */
  body: string;
  faqs: GuiaFaq[];
};
