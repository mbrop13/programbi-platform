/**
 * Contenido propio de /us/empresas.
 *
 * La página de empresas de Chile habla de factura electrónica y de OC chilena;
 * para equipos en Estados Unidos el texto cambia: idioma, husos horarios,
 * moneda y reembolso del empleador. Sin precios ni cifras inventadas: la
 * capacitación in-company se cotiza por programa, igual que en el resto.
 */
import type { EmpresaFaq } from "@/lib/data/empresas-faqs";

export const ISO_EMPRESAS_US = "us";

export const HERO_EMPRESAS_US = {
  kicker: "Cursos para empresas · Estados Unidos",
  titulo: "Capacitación en español de Power BI, Excel e IA para empresas en EE.UU.",
  descripcion:
    "Programas cerrados para equipos hispanohablantes: Power BI, Excel, SQL, Python e IA, en vivo y en español, con los datos de tu empresa y factura o recibo en USD.",
  nota: "La clase se explica en español; el software y los reportes se trabajan en inglés, como en tu oficina.",
} as const;

export const INCLUDES_EMPRESAS_US = [
  {
    title: "En español, con el software en inglés",
    text: "El equipo aprende en su idioma sin perder el vocabulario que usa con clientes y con la casa matriz.",
  },
  {
    title: "Con sus datos",
    text: "Ejercicios sobre QuickBooks, NetSuite, Salesforce, ADP o los Excel que el equipo ya usa.",
  },
  {
    title: "Horario en ET, CT o PT",
    text: "Se acuerda con el equipo, también para oficinas en Texas, Chicago o California.",
  },
  {
    title: "Factura o recibo en USD",
    text: "Propuesta por escrito, reporte de asistencia por persona y documentación de proveedor si compras la pide.",
  },
] as const;

export const FAQS_EMPRESAS_US: EmpresaFaq[] = [
  {
    q: "¿La capacitación para empresas en EE.UU. es en español?",
    a: "Sí. Las sesiones se dictan en vivo y en español, con un mentor. El software se usa con la interfaz en inglés y los términos técnicos (dashboard, measure, join, payroll) se mantienen en inglés, para que el equipo trabaje igual que en la oficina.",
  },
  {
    q: "¿Qué horarios manejan para equipos en distintos husos?",
    a: "El horario se acuerda con el equipo. Las clases abiertas se dictan desde Santiago de Chile y caen entre las 17:30 y las 19:30 en la hora del Este; para un programa cerrado se define la franja que convenga en ET, CT o PT, según dónde trabaje el grupo.",
  },
  {
    q: "¿Trabajan con los datos de la empresa?",
    a: "Sí. Adaptamos los ejercicios a las tablas, KPIs y procesos del equipo: exportaciones de QuickBooks, NetSuite, Salesforce o ADP, y reportes en Excel. El equipo sale haciendo el trabajo real, no un laboratorio genérico.",
  },
  {
    q: "¿Cómo se cotiza y en qué moneda?",
    a: "Conversamos 20 a 30 minutos para entender el área, el tamaño del grupo y qué necesitan saber hacer. Después llega una propuesta por escrito con temas, nivel, fechas, valor en dólares (USD) y condiciones. No hay una tarifa única publicada: se cotiza según el programa.",
  },
  {
    q: "¿Entregan factura o recibo en dólares?",
    a: "Sí, factura o recibo en USD, orden de compra si la necesitan y reporte de asistencia por persona. Si el área de compras pide documentación de proveedor, la solicitamos antes de empezar.",
  },
  {
    q: "¿Qué duración y niveles tienen los programas?",
    a: "Cada curso tiene su carga horaria y sus niveles (básico-intermedio y avanzado, según el curso). En la propuesta definimos horas, fechas y calendario según el equipo y el objetivo.",
  },
  {
    q: "¿Entregan certificado?",
    a: "Sí. Cada participante recibe un certificado digital propio de la academia al completar el programa, con código de verificación, más el reporte de asistencia para la empresa. No es una certificación de Microsoft ni una acreditación estadounidense; el examen PL-300 se rinde por separado.",
  },
  {
    q: "¿Mi empresa puede reembolsar un curso abierto en lugar de contratar un programa cerrado?",
    a: "Sí, es otra opción: cada persona se inscribe en un curso abierto y la empresa lo reembolsa. Según el IRS, un empleador puede dar hasta $5,250 al año por empleado libres de impuesto bajo un programa calificado de asistencia educativa (Sección 127). Cada empresa define sus reglas; entregamos recibo en USD y la descripción del curso para la solicitud.",
  },
];
