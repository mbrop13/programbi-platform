import type { BloqueSeoFicha } from "./tipos";
import { textoCuotas } from "@/config/cuotas";
import { ISO_CHILE } from "@/config/paises";
import { HORA_CLASE_CHILE } from "@/lib/paises/horarios";

const HORARIO = `${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin}`;

/**
 * Bloques extra de la ficha de SQL Server (Chile).
 * Cada afirmación sale de lib/data/syllabuses/sql-server.ts, lib/data/courses.ts,
 * config/pricing.ts o config/cuotas.ts. No inventar cifras.
 */
export const BLOQUES_SQL_SERVER: readonly BloqueSeoFicha[] = [
  {
    eyebrow: "De básico a avanzado",
    titulo: "Qué se aprende en cada nivel de SQL Server",
    parrafos: [
      "El programa está organizado en dos niveles independientes de 20 horas en vivo por Zoom —Básico-Intermedio y Avanzado— para que avances desde tus primeras consultas hasta procedimientos almacenados y automatización de reportes.",
    ],
    bullets: [
      "Básico-Intermedio (20 h) · Consultas y filtrado desde cero: SELECT, WHERE, TOP, funciones de fecha (MONTH, YEAR), operadores lógicos (AND, OR, IN), columnas calculadas y creación de vistas iniciales.",
      "Básico-Intermedio (20 h) · Cruce de tablas (JOINs) y agrupaciones: INNER JOIN, LEFT JOIN, RIGHT JOIN y FULL JOIN, control de nulos (IS NULL / NOT NULL), ORDER BY, GROUP BY, SUM(), COUNT() y vistas de valorización.",
      "Básico-Intermedio (20 h) · IA aplicada a consultas: apoyo de inteligencia artificial durante el curso para redactar, revisar y agregar consultas a la medida de reportes operativos.",
      "Avanzado (20 h) · Vistas complejas y lógica condicional: CASE WHEN, CONCAT(), LEFT() y cruces de múltiples tablas para reportes consolidados.",
      "Avanzado (20 h) · Procedimientos almacenados y estructura: SELECT INTO, DROP TABLE, CREATE PROC, EXECUTE, ALTER TABLE, ADD CONSTRAINT, UPDATE, CAST() y trabajo final aplicado con integración de SQL y Python asistida por IA.",
    ],
  },
  {
    eyebrow: "Perfil y continuidad",
    titulo: "Para quién es el curso de SQL y cómo conectarlo con Power BI",
    parrafos: [
      "Está dirigido a analistas de finanzas, control de gestión, operaciones y perfiles comerciales o administrativos que hoy dependen de archivos de Excel exportados por terceros y necesitan consultar bases de datos SQL Server directamente, sin requerir experiencia previa en programación.",
      "Una vez que dominas la extracción con vistas y procedimientos en SQL Server, el paso natural es conectar esas consultas a un modelo de datos en Power BI o completar la ruta con Python en el programa integral de Análisis de Datos.",
    ],
    bullets: [
      `Horario: clases 100% en vivo por Zoom, dos veces por semana de ${HORARIO} (hora de Chile), con grabaciones y material en el campus virtual.`,
      "Requisitos: no necesitas saber programar antes de inscribirte; el nivel Básico-Intermedio parte desde cero.",
      "Certificado: certificado digital de ProgramBI al completar y aprobar el trabajo aplicado.",
      `Pago: el arancel vigente y las ${textoCuotas(ISO_CHILE)} están disponibles en el PDF de temario y precios del curso.`,
    ],
    enlaces: [
      { href: "/cursos/power-bi", label: "Curso de Power BI en vivo" },
      { href: "/cursos/analisis-de-datos", label: "Programa de Análisis de Datos (SQL, Power BI y Python)" },
      { href: "/precios", label: "Precios y formas de pago" },
    ],
  },
];
