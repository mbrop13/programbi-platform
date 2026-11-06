/**
 * Preguntas de la página /empresas.
 *
 * La misma lista alimenta el bloque visible y el FAQPage de JSON-LD: si se
 * edita una respuesta, cambian las dos. Sin precios ni cifras inventadas.
 */
export type EmpresaFaq = {
  q: string;
  a: string;
};

export const EMPRESAS_FAQS: EmpresaFaq[] = [
  {
    q: "¿Cómo se dicta la capacitación para empresas?",
    a: "En vivo, con un mentor y ejercicios sobre los datos de la empresa. No es un curso abierto: armamos un programa para el equipo. La mayoría de las sesiones es por Zoom, con grabaciones y material; si el equipo está en un mismo lugar, se puede hacer presencial.",
  },
  {
    q: "¿Trabajan con los datos de la empresa?",
    a: "Sí. Adaptamos los ejercicios a sus tablas, KPIs y procesos. El objetivo es que el equipo salga haciendo el trabajo real, no un laboratorio genérico.",
  },
  {
    q: "¿Qué duración y niveles tienen los programas?",
    a: "Cada curso tiene sus niveles —básico-intermedio y avanzado— y su carga horaria. En la propuesta definimos horas, fechas y calendario según el equipo y el objetivo.",
  },
  {
    q: "¿Cómo se cotiza la capacitación in-company?",
    a: "Conversamos 20–30 minutos para entender el área, el tamaño del grupo y qué necesitan saber hacer. Después llega una propuesta con temas, nivel, fechas y valor. El precio se cotiza según el programa: no hay una tarifa única publicada.",
  },
  {
    q: "¿Facturan a la empresa?",
    a: "Sí. Factura electrónica, orden de compra si la necesitan y reporte de asistencia por persona.",
  },
  {
    q: "¿Entregan certificado?",
    a: "Sí. Cada participante recibe certificado al completar el programa, además del reporte de asistencia para la empresa.",
  },
];
