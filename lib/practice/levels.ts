// =============================================================================
// Catálogo de Units (secciones) y sus Levels (niveles) + Ejercicios.
//
// Para agregar tus propios niveles copia el patrón del Unit "sql-server" más
// abajo. El README.md de esta carpeta explica el paso a paso.
// =============================================================================

import type { Unit } from "./types";

export const PRACTICE_UNITS: Unit[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // UNIDAD DE MUESTRA: SQL Server · Fundamentos
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "sql-server",
    slug: "sql-server",
    title: "SQL Server",
    description: "Consultas, joins y bases relacionales con T-SQL.",
    icon: "Database",
    accentColor: "#CC2935", // rojo SQL Server
    emoji: "🛢️",
    levels: [
      {
        id: "sql-1",
        title: "Nivel 1 · Fundamentos",
        kind: "lesson",
        xp: 10,
        exercises: [
          // 1 ── multiple-choice ── ¿Qué comando selecciona filas?
          {
            id: "sql-1-e1",
            type: "multiple-choice",
            prompt: "¿Qué palabra clave se usa para leer filas de una tabla?",
            hint: "Empezamos las consultas con esta palabra.",
            data: {
              options: ["INSERT", "SELECT", "UPDATE", "DROP"],
              correctIndex: 1,
            },
            explanation:
              "SELECT es la cláusula de lectura. INSERT agrega, UPDATE modifica y DROP elimina objetos.",
          },

          // 2 ── arrange ── ordena los tokens de una query SELECT
          {
            id: "sql-1-e2",
            type: "arrange",
            prompt: 'Ordena losTokens para formar: "SELECT nombre FROM clientes"',
            hint: "Primero la acción, luego la columna, luego la tabla.",
            data: {
              tokens: [
                { id: "t2", text: "nombre" },
                { id: "t3", text: "FROM" },
                { id: "t4", text: "clientes" },
                { id: "t1", text: "SELECT" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation:
              "La estructura mínima de un SELECT es: SELECT <columnas> FROM <tabla>.",
          },

          // 3 ── select-all ── cláusulas válidas en un SELECT
          {
            id: "sql-1-e3",
            type: "select-all",
            prompt: "¿Cuáles de estas son cláusulas válidas de un SELECT?",
            hint: "Hay 3 correctas.",
            data: {
              options: ["FROM", "WHERE", "ROBOT", "GROUP BY", "PIZZA"],
              correctIndices: [0, 1, 3],
            },
            explanation:
              "FROM (origen), WHERE (filtro) y GROUP BY (agrupación) son cláusulas válidas. ROBOT y PIZZA no existen.",
          },

          // 4 ── fill-blank ── WHERE filtra filas
          {
            id: "sql-1-e4",
            type: "fill-blank",
            prompt: "Completa: SELECT * FROM clientes _____ edad > 18;",
            hint: "Es la cláusula de filtro de filas.",
            data: {
              acceptedAnswers: ["where", "WHERE", "Where"],
              placeholder: "escribe la palabra...",
            },
            explanation:
              "WHERE filtra las filas devueltas por la consulta según una condición.",
          },

          // 5 ── match-pairs ── empareja comando con su acción
          {
            id: "sql-1-e5",
            type: "match-pairs",
            prompt: "Empareja cada comando con su acción.",
            hint: "Toca un item de la izquierda y luego su par en la derecha.",
            data: {
              left: [
                { id: "L1", text: "SELECT" },
                { id: "L2", text: "INSERT" },
                { id: "L3", text: "UPDATE" },
                { id: "L4", text: "DELETE" },
              ],
              right: [
                { id: "R1", text: "Leer filas" },
                { id: "R2", text: "Eliminar filas" },
                { id: "R3", text: "Agregar fila" },
                { id: "R4", text: "Modificar filas" },
              ],
              correctPairs: [
                { left: "L1", right: "R1" },
                { left: "L2", right: "R3" },
                { left: "L3", right: "R4" },
                { left: "L4", right: "R2" },
              ],
            },
            explanation:
              "SELECT lee, INSERT agrega, UPDATE modifica y DELETE elimina filas.",
          },

          // 6 ── multiple-choice ── tipo de dato entero
          {
            id: "sql-1-e6",
            type: "multiple-choice",
            prompt: "¿Qué tipo de T-SQL almacena números enteros?",
            hint: "Empieza por I.",
            data: {
              options: ["VARCHAR", "INT", "DATETIME", "BIT"],
              correctIndex: 1,
            },
            explanation:
              "INT guarda enteros (~±2.1B). VARCHAR guarda texto, DATETIME fechas y BIT valores booleanos (0/1).",
          },

          // 7 ── arrange ── consulta con WHERE y ORDER BY
          {
            id: "sql-1-e7",
            type: "arrange",
            prompt:
              'Ordena para formar: "SELECT * FROM ventas WHERE total > 100 ORDER BY total DESC"',
            hint: "ORDER BY siempre va después de WHERE.",
            data: {
              tokens: [
                { id: "t1", text: "SELECT *" },
                { id: "t2", text: "FROM ventas" },
                { id: "t3", text: "WHERE total > 100" },
                { id: "t4", text: "ORDER BY total DESC" },
              ],
              correctOrder: ["t1", "t2", "t3", "t4"],
            },
            explanation:
              "El orden lógico de procesamiento es FROM → WHERE → SELECT → ORDER BY, aunque en texto escribas SELECT primero.",
          },
        ],
      },

      // Niveles siguientes (placeholder, los creas tú):
      {
        id: "sql-2",
        title: "Nivel 2 · Filtrado y ORDER BY",
        kind: "lesson",
        xp: 10,
        exercises: [], // TODO: agrega tus ejercicios aquí
      },
      {
        id: "sql-3",
        title: "Nivel 3 · JOINs",
        kind: "lesson",
        xp: 15,
        exercises: [],
      },
      {
        id: "sql-checkpoint",
        title: "Punto de control",
        kind: "checkpoint",
        xp: 30,
        exercises: [],
      },
      {
        id: "sql-trophy",
        title: "Unidad completada",
        kind: "trophy",
        xp: 50,
        exercises: [],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // UNIDADES PLACEHOLDER (solo cabecera; crea los niveles tú).
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "power-bi",
    slug: "power-bi",
    title: "Power BI",
    description: "Modelado, DAX y visualización.",
    icon: "BarChart3",
    accentColor: "#F2C811", // amarillo Power BI
    emoji: "📊",
    levels: [
      { id: "pbi-1", title: "Nivel 1 · Introducción", kind: "lesson", xp: 10, exercises: [] },
      { id: "pbi-2", title: "Nivel 2 · Power Query", kind: "lesson", xp: 10, exercises: [] },
    ],
  },
  {
    id: "inteligencia-artificial",
    slug: "inteligencia-artificial",
    title: "Inteligencia Artificial",
    description: "Prompting, RAG y fundamentos de LLMs.",
    icon: "Brain",
    accentColor: "#7C3AED",
    emoji: "🧠",
    levels: [
      { id: "ia-1", title: "Nivel 1 · Fundamentos", kind: "lesson", xp: 10, exercises: [] },
      { id: "ia-2", title: "Nivel 2 · Prompting", kind: "lesson", xp: 15, exercises: [] },
    ],
  },
  {
    id: "python",
    slug: "python",
    title: "Python",
    description: "Sintaxis, tipos de datos y librerías.",
    icon: "Code2",
    accentColor: "#3B82F6",
    emoji: "🐍",
    levels: [
      { id: "py-1", title: "Nivel 1 · Sintaxis", kind: "lesson", xp: 10, exercises: [] },
    ],
  },
  {
    id: "excel",
    slug: "excel",
    title: "Excel Avanzado",
    description: "Fórmulas, tablas dinámicas y dashboards.",
    icon: "FileSpreadsheet",
    accentColor: "#10B981",
    emoji: "📈",
    levels: [
      { id: "x-1", title: "Nivel 1 · Fórmulas", kind: "lesson", xp: 10, exercises: [] },
    ],
  },
];

// Helper: obtener un Unit por slug.
export function getUnitBySlug(slug: string): Unit | undefined {
  return PRACTICE_UNITS.find((u) => u.slug === slug);
}