import type { CourseSyllabusData } from "./types";

export const accessSyllabus: CourseSyllabusData = {
  slug: "access",
  accent: "#A4373A",
  programYear: "2026",
  audience:
    "Personal administrativo que necesita almacenar, organizar, consultar y analizar información de distintas áreas de una organización.",
  audienceNote:
    "Objetivo: diseñar, construir y administrar bases de datos relacionales con Microsoft Access, y optimizar la gestión y la generación de reportes.",
  benefits: [
    "Diferenciar cuándo usar Access y cuándo alcanza Excel.",
    "Diseñar tablas, claves y relaciones con integridad referencial.",
    "Consultar y resumir datos con criterios, agregaciones y SQL básico.",
    "Armar formularios para ingresar y validar información.",
    "Generar informes de gestión y exportarlos a PDF y Excel.",
    "Automatizar tareas frecuentes con macros y un proyecto aplicado.",
  ],
  levels: [
    {
      id: "programa",
      label: "Curso de Access para administrativos",
      shortLabel: "20h",
      theme: "#A4373A",
      intro:
        "Curso de 20 horas para diseñar, construir y administrar bases de datos relacionales con Microsoft Access: tablas, consultas, formularios, informes, macros y un proyecto de un proceso empresarial.",
      modules: [
        {
          id: "mod-1",
          title: "Módulo 1. Introducción a Microsoft Access",
          icon: "generic",
          topics: [
            "Conceptos fundamentales de bases de datos.",
            "Diferencias entre Excel y Access.",
            "Interfaz y entorno de trabajo de Access.",
            "Creación y configuración de bases de datos.",
            "Tipos de datos y propiedades de los campos.",
            "Importación de datos desde Excel y archivos externos.",
          ],
        },
        {
          id: "mod-2",
          title: "Módulo 2. Diseño y construcción de bases de datos",
          icon: "sql",
          topics: [
            "Fundamentos del modelo relacional.",
            "Diseño de tablas y estructuras de información.",
            "Claves primarias y claves foráneas.",
            "Relaciones entre tablas.",
            "Integridad referencial.",
            "Normalización básica de bases de datos.",
            "Ejercicio práctico: diseño de una base de datos de gestión empresarial.",
          ],
        },
        {
          id: "mod-3",
          title: "Módulo 3. Consultas y extracción de información",
          icon: "sql",
          topics: [
            "Creación de consultas mediante el asistente y vista diseño.",
            "Consultas de selección.",
            "Criterios y filtros avanzados.",
            "Consultas con múltiples tablas.",
            "Ordenamiento y agrupación de información.",
            "Campos calculados.",
            "Funciones de agregación: SUMA, PROMEDIO, CONTAR, MÁXIMO y MÍNIMO.",
            "Consultas de parámetros.",
            "Consultas SQL básicas: SELECT, WHERE, ORDER BY, GROUP BY y JOIN.",
          ],
        },
        {
          id: "mod-4",
          title: "Módulo 4. Formularios para el ingreso y gestión de datos",
          icon: "generic",
          topics: [
            "Creación de formularios.",
            "Diseño y personalización de formularios.",
            "Controles de ingreso de información.",
            "Listas desplegables y cuadros combinados.",
            "Formularios vinculados a tablas y consultas.",
            "Formularios principales y subformularios.",
            "Validación de datos y controles de ingreso.",
          ],
        },
        {
          id: "mod-5",
          title: "Módulo 5. Informes y generación de reportes",
          icon: "chart",
          topics: [
            "Creación de informes.",
            "Diseño y formato de reportes.",
            "Agrupación y ordenamiento de información.",
            "Totales y subtotales.",
            "Informes basados en consultas.",
            "Exportación de informes a PDF y Excel.",
            "Generación de reportes de gestión.",
          ],
        },
        {
          id: "mod-6",
          title: "Módulo 6. Automatización y herramientas avanzadas",
          icon: "bolt",
          topics: [
            "Introducción a las macros de Access.",
            "Automatización de tareas frecuentes.",
            "Botones de navegación y ejecución de acciones.",
            "Macros para abrir formularios e informes.",
            "Introducción a SQL en Access.",
            "Actualización, eliminación y creación de registros mediante consultas de acción.",
            "Buenas prácticas para administrar bases de datos.",
          ],
        },
        {
          id: "mod-7",
          title: "Módulo 7. Proyecto práctico integrador",
          icon: "generic",
          topics: [
            "Construcción de una base de datos aplicada a un proceso empresarial.",
            "Creación de tablas y relaciones.",
            "Desarrollo de consultas para obtener indicadores.",
            "Diseño de formularios para ingresar información.",
            "Generación de informes de gestión.",
            "Presentación del proyecto final.",
          ],
        },
      ],
    },
  ],
};
