export type Testimonial = {
  name: string;
  role: string;
  message: string;
  /**
   * Perfil público del alumno. Solo cuando existe de verdad; nunca inventar.
   *
   * TODO_MANU: el repo no guarda la URL del perfil ni de la publicación de
   * LinkedIn de ningún alumno. Cuando Manu las pase, se completan aquí y las
   * tarjetas muestran el enlace solas. Hasta entonces queda vacío.
   */
  linkedinUrl?: string;
  /**
   * Slug de la ficha del curso, solo si el rol lo dice sin ambigüedad.
   * `undefined` = no se puede atribuir a una ficha concreta.
   */
  cursoSlug?: string;
  fuente?: "linkedin";
  /** Año de publicación del testimonio, si está documentado. TODO_MANU. */
  anio?: string;
};

/**
 * Real student testimonials used on home + community landing.
 * `name`, `role` y `message` son citas literales: no se editan ni se resumen.
 */
export const testimonials: Testimonial[] = [
  {
    name: "Víctor Montecino Muñoz",
    role: "Certificado en Big Data, BigQuery & Looker Studio",
    fuente: "linkedin",
    message:
      "¡Estoy emocionado de compartir que he obtenido un nuevo certificado en Big Data con Big Query y Looker Studio de ProgramBI! Agradezco enormemente a Manuel Oliva por su apoyo y por ofrecer cursos tan completos y enriquecedores.",
  },
  {
    name: "Cynzia Tapia Castro",
    role: "Certificada en Power BI",
    cursoSlug: "power-bi",
    fuente: "linkedin",
    message:
      "¡Me alegra contaros que he obtenido un nuevo certificado: Curso Power BI de ProgramBI! Gracias profesor Manuel Oliva por el apoyo y la enseñanza.",
  },
  {
    name: "Victor Manuel Pérez Barría",
    role: "Certificado en SQL Server & Bases de Datos",
    cursoSlug: "sql-server",
    fuente: "linkedin",
    message:
      "Un paso más en el desarrollo de habilidades con administración de bases de datos. Acabo de terminar un muy buen curso de SQL con el equipo de ProgramBI y su excelente profesor Manuel Oliva. Listo SQL, ahora vamos con Power BI!",
  },
  {
    name: "Pablo Améstica Parraguez",
    role: "Certificado en SQL Server Avanzado",
    cursoSlug: "sql-server",
    fuente: "linkedin",
    message:
      "He completado exitosamente el curso de SQL Server de ProgramBI. Me ha permitido fortalecer mis habilidades hasta un nivel intermedio. Agradezco al profesor Manuel Oliva por su dedicación y excelente enseñanza.",
  },
  {
    name: "Jaime Nicolas Aranda Vasquez",
    role: "Estudiante de Programación y Analítica",
    fuente: "linkedin",
    message:
      "Muy feliz de tener un profesional como Manuel Oliva para guiarme en el programa de ProgramBI y sentar mis bases hacia un futuro diplomado.",
  },
  {
    name: "Julio César Reyes Asenjo",
    role: "Certificado en Big Data - BigQuery & Looker Studio",
    fuente: "linkedin",
    message:
      "Terminé mis estudios de Big Query y Looker Studio en ProgramBI. Agradezco a Manuel Oliva y Joaquín Villagra por su excelente tutoría. ¡Recomiendo ProgramBI!",
  },
  {
    name: "Jorge Kaisarieh",
    role: "Diseñador Gráfico, Web y UI/UX",
    fuente: "linkedin",
    message:
      "Aprendiendo cosas nuevas en Power BI. Es una herramienta bastante necesaria y útil. ¡Recomiendo ProgramBI con los ojos cerrados!",
  },
  {
    name: "Branco Sanchez",
    role: "Certificado en Power BI Avanzado",
    cursoSlug: "power-bi",
    fuente: "linkedin",
    message:
      "Finalicé el curso de Power BI Avanzado en ProgramBI. Sin duda una instancia para seguir aprendiendo en el área de BI.",
  },
  {
    name: "Diego Andrés Repetti Cubillos",
    role: "Certificado en Power BI Avanzado & SQL Server",
    fuente: "linkedin",
    message:
      "Completé exitosamente Power BI avanzado y SQL Server en ProgramBI. Estos conocimientos me ayudan a analizar datos de manera más eficiente.",
  },
  {
    name: "Alexis Rodrigo Astudillo Briones",
    role: "Certificado en SQL Server",
    cursoSlug: "sql-server",
    fuente: "linkedin",
    message:
      "Acabo de terminar y aprobar el curso de SQL Server en ProgramBI, dictado por Manuel Oliva. Tremenda propuesta de valor para el desarrollo laboral, recomendable 100%.",
  },
  {
    name: "Pablo Guzmán G.",
    role: "Alumno de SQL Server",
    cursoSlug: "sql-server",
    fuente: "linkedin",
    message:
      "Gran curso de ProgramBI. Aprendiendo a confeccionar tablas, vistas y procedimientos almacenados.",
  },
  {
    name: "José Méndez",
    role: "Certificado en Python para Análisis de Datos",
    cursoSlug: "python",
    fuente: "linkedin",
    message:
      "Curso finalizado de Python: cada día es más interesante el análisis y gestión de datos. Muchas gracias ProgramBI y Manuel Oliva.",
  },
  {
    name: "Patricio Henríquez Albiña",
    role: "Certificado en Power BI",
    cursoSlug: "power-bi",
    fuente: "linkedin",
    message:
      "Feliz de finalizar el curso de Power BI de ProgramBI. Sin duda una gran herramienta de visualización de datos. ¡Vamos por más!",
  },
  {
    name: "Victor Arzola",
    role: "Alumno de Analítica de Datos",
    cursoSlug: "analisis-de-datos",
    fuente: "linkedin",
    message:
      "Impresiona lo útil que resultan estas herramientas para el análisis de data.",
  },
  {
    name: "Felipe Medel A.",
    role: "Certificado en Power BI",
    cursoSlug: "power-bi",
    fuente: "linkedin",
    message:
      "Obtuve el certificado del curso Power BI de ProgramBI. Manuel, gracias por la paciencia y la motivación.",
  },
  {
    name: "Ismael Yáñez Silva",
    role: "Certificado en SQL Server",
    cursoSlug: "sql-server",
    fuente: "linkedin",
    message:
      "¡Me alegra compartir que he obtenido un nuevo certificado: SQL Server de ProgramBI!",
  },
  {
    name: "Karla Escalona",
    role: "Egresada de Fundamentos de Data Science",
    fuente: "linkedin",
    message:
      "Me puse como meta dominar los fundamentos de Data Science y lo logré gracias a ProgramBI y al mejor profesor, Manuel Oliva. ¡Gracias!",
  },
  {
    name: "Leslie Mau Guesarazo",
    role: "Alumna de Cursos Presenciales",
    fuente: "linkedin",
    message:
      "Gran curso: práctico, claro, adaptable a los requerimientos. Gracias por el compromiso y empuje para ir por más.",
  },
  {
    name: "Branco Sanchez",
    role: "Certificado en SQL Server",
    cursoSlug: "sql-server",
    fuente: "linkedin",
    message:
      "Aprobé el curso de SQL en ProgramBI. Excelente experiencia para adquirir conocimientos sobre Data Science.",
  },
  {
    name: "Jaime Nicolas Aranda Vasquez",
    role: "Certificado en SQL Server",
    cursoSlug: "sql-server",
    fuente: "linkedin",
    message:
      "Muy feliz de certificarme en SQL Server, una herramienta versátil para la toma de decisiones. Gracias a ProgramBI por el profesionalismo.",
  },
];

/**
 * Interruptor de publicación de los testimonios.
 *
 * Por defecto encendido: estas citas ya se muestran en la home. Se apaga con
 * `NEXT_PUBLIC_TESTIMONIOS="0"` sin tocar `config/flags.ts`. Cuando está
 * apagado, las páginas nuevas de testimonios no se indexan y los componentes
 * no renderizan citas.
 */
export const TESTIMONIOS_PUBLICADOS = process.env.NEXT_PUBLIC_TESTIMONIOS !== "0";

/*
 * TODO_MANU (datos que faltan; no se inventan):
 * - URL del perfil o de la publicación de LinkedIn de cada alumno (`linkedinUrl`).
 * - Año de publicación (`anio`) de cada cita.
 * - Citas sin `cursoSlug` (Big Data/BigQuery, Data Science, cursos presenciales
 *   y programa de diplomado): falta confirmar a qué ficha corresponden antes
 *   de atribuirlas a un curso.
 */

/** Testimonios atribuidos a un curso concreto. Vacío si no hay o si están apagados. */
export function testimoniosDeCurso(cursoSlug: string): Testimonial[] {
  if (!TESTIMONIOS_PUBLICADOS) return [];
  return testimonials.filter((testimonio) => testimonio.cursoSlug === cursoSlug);
}

/** Testimonios sin curso identificable (roles que no nombran una ficha). */
export function testimoniosSinCurso(): Testimonial[] {
  if (!TESTIMONIOS_PUBLICADOS) return [];
  return testimonials.filter((testimonio) => !testimonio.cursoSlug);
}
