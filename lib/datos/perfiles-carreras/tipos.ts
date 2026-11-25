/**
 * Perfil cualitativo de una carrera: qué hace quien la ejerce, para quién está
 * pensada y dónde trabaja. Complementa las cifras de mifuturo.cl en la ficha.
 *
 * Regla editorial: descripción general de la profesión en Chile, en tuteo y
 * lenguaje simple. Sin cifras (sueldos, empleabilidad, aranceles: esos salen
 * de los datos oficiales), sin nombres de empresas ni de instituciones y sin
 * prometer resultados.
 */
export type PerfilCarrera = {
  /** Dos frases: qué hace en su día a día quien ejerce la carrera. */
  queHace: string;
  /** Cuatro o cinco tareas concretas y típicas, cada una en una frase corta. */
  tareas: string[];
  /** Tres o cuatro rasgos de la persona a la que le suele acomodar. */
  paraQuien: string[];
  /** Dos o tres señales de que quizás no es para ti. */
  noEsParaTi: string[];
  /** Tres a cinco lugares o sectores donde trabaja. */
  dondeTrabaja: string[];
  /** Cuatro a seis ramos o materias típicas de la malla. */
  ramos: string[];
  /** Tres a cinco habilidades que desarrolla. */
  habilidades: string[];
};
