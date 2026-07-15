import type { CourseSyllabusData } from "./types";

export const sqlServerSyllabus: CourseSyllabusData = {
  slug: "sql-server",
  accent: "#0891B2",
  programYear: "2026",
  levels: [
    {
      id: "nivel1",
      label: "Nivel I: Básico",
      shortLabel: "Fundamentos (16h)",
      theme: "#0891B2",
      audience:
        "Este curso es ideal para principiantes que desean aprender SQL Server desde cero, enfocándose en consultas básicas y manipulación inicial de datos para automatizar reportes simples en entornos empresariales.",
      benefits: [
        "Apoyar decisiones básicas con informes eficientes.",
        "Alta demanda en roles iniciales de datos.",
        "Conexión a bases de datos para Power BI.",
        "Reducción de riesgos operacionales.",
      ],
      modules: [
        {
          id: "n1-1",
          title: "Introducción a SQL (4 horas)",
          hours: 4,
          topics: [
            "Funciones: SELECT (Recuperación de datos), WHERE (Filtrado), TOP (Límite de filas), MONTH() (Mes de fecha), YEAR() (Año de fecha).",
            "Problemas resueltos: Seleccionar datos de tablas, filtrar por código, crear columnas calculadas, creación de vista básica.",
          ],
        },
        {
          id: "n1-2",
          title: "Filtros y Operaciones Básicas (4 horas)",
          hours: 4,
          topics: [
            "Funciones: Operadores (=, >=, <=), lógicos (AND, OR), IN (Conjunto de valores).",
            "Problemas resueltos: Filtrar por año/mes, vista filtrada, múltiples condiciones, lista de códigos, columna constante.",
          ],
        },
        {
          id: "n1-3",
          title: "Cruce de Tablas Básico (JOIN) (4 horas)",
          hours: 4,
          topics: [
            "Funciones: INNER JOIN (Coincidentes), LEFT JOIN (Izquierda completa), IS NULL/NOT NULL (Nulos), COUNT() (Contar filas).",
            "Problemas resueltos: Cruce de tablas (ventas/productos), identificar no vendidos, comparación de joins.",
          ],
        },
        {
          id: "n1-4",
          title: "Introducción a IA en SQL Server (4 horas)",
          hours: 4,
          icon: "star",
          highlight: true,
          topics: [
            "Uso aplicado de herramientas de IA durante el curso, para crear consultas a la medida de reportes automatizados.",
          ],
        },
      ],
    },
    {
      id: "nivel2",
      label: "Nivel II: Intermedio",
      shortLabel: "Joins & Reporting (16h)",
      theme: "#16A34A",
      audience:
        "Este curso construye sobre los fundamentos, enfocándose en joins avanzados, ordenamiento y agrupaciones para generar informes consolidados en empresas.",
      benefits: [
        "Informes con cruces complejos para eficiencia operativa.",
        "Automatización de filtros y cálculos.",
        "Alta demanda en data analytics.",
        "Integración ágil con Power BI.",
      ],
      modules: [
        {
          id: "n2-1",
          title: "Tipos de JOIN y Vistas de Control (4 horas)",
          hours: 4,
          topics: [
            "Funciones: FULL JOIN (Todas filas), RIGHT JOIN (Derecha completa).",
            "Problemas resueltos: Vista de control, margen de utilidad, comparación de todos los joins.",
          ],
        },
        {
          id: "n2-2",
          title: "Ordenamiento y Filtrado Avanzado (4 horas)",
          hours: 4,
          topics: [
            "Funciones: ORDER BY (Ordenar), DESC (Descendente), operadores de fecha, GROUP BY (Agrupar), SUM() (Suma).",
            "Problemas resueltos: Top ventas ordenadas, rango de fechas, cruce de tres tablas, vista de valorización.",
          ],
        },
        {
          id: "n2-3",
          title: "Requerimientos Complejos (4 horas)",
          hours: 4,
          topics: [
            "Problemas resueltos: Cruce de cuatro/cinco tablas, columnas calculadas (Utilidad Total, Impuesto), vista agrupada por país, consultas condicionales.",
          ],
        },
        {
          id: "n2-4",
          title: "Integración de IA Intermedia (4 horas)",
          hours: 4,
          icon: "star",
          highlight: true,
          topics: [
            "Uso de IA para resolver problemas de complejidad intermedia en reportes a la medida.",
            "Preprocesamiento de datos para IA: Limpieza y agregación con GROUP BY para modelos predictivos.",
          ],
        },
      ],
    },
    {
      id: "nivel3",
      label: "Nivel III: Avanzado",
      shortLabel: "Admin & Stored Procs (16h)",
      theme: "#EA580C",
      audience:
        "Este curso avanzado profundiza en vistas complejas, procedimientos almacenados y análisis predictivos, perfecto para optimizar reportes automatizados consolidados.",
      benefits: [
        "Automatización completa con procedimientos predictivos.",
        "Alta demanda en data science.",
        "Estrategias para metas en tiempo real.",
        "Integración con IA avanzada en DBs.",
      ],
      modules: [
        {
          id: "n3-1",
          title: "Creación de Vistas Complejas (4 horas)",
          hours: 4,
          topics: [
            "Funciones: LEFT() (Extraer texto), CASE WHEN (Condicionales), CONCAT() (Concatenar).",
            "Problemas resueltos: Cruce con múltiples joins, columna Tipo_Transporte por país, vistas agrupadas.",
          ],
        },
        {
          id: "n3-2",
          title: "Tablas de Reportes y Procedimientos (3 horas)",
          hours: 3,
          topics: [
            "Funciones: SELECT INTO, DROP TABLE, CREATE PROC, EXECUTE.",
            "Problemas resueltos: Tabla de vista, actualización de reportes, procs para múltiples tablas.",
          ],
        },
        {
          id: "n3-3",
          title: "Análisis de Datos y Reportes (3 horas)",
          hours: 3,
          topics: [
            "Funciones: ALTER TABLE, ADD CONSTRAINT, UPDATE, CAST().",
            "Problemas resueltos: Modificar claves primarias, actualización de vistas, estrategia de metas vs. ventas.",
          ],
        },
        {
          id: "n3-4",
          title: "Trabajo Final Aplicado (3 horas)",
          hours: 3,
          topics: [
            "Aplicación integral: Trabajo práctico con todas las herramientas, certificación al aprobar.",
          ],
        },
        {
          id: "n3-5",
          title: "Integración Avanzada de IA (3 horas)",
          hours: 3,
          icon: "star",
          highlight: true,
          topics: [
            "Uso de IA para resolver problemas complejos de consultas (querys) y procedimientos almacenados.",
            "Uso de la inteligencia artificial para integrar consultas de SQL con códigos de Python para ejecutar informes y procesos.",
          ],
        },
      ],
    },
  ],
};
