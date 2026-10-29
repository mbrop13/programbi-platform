import type { CourseSyllabusData } from "./types";

export const iaProductividadSyllabus: CourseSyllabusData = {
  slug: "ia-productividad",
  accent: "#7C3AED",
  programYear: "2026",
  audience:
    "Personal administrativo que necesite automatizar informes diarios, resúmenes, reportes recurrentes y tareas repetitivas de oficina.",
  audienceNote:
    "Enfoque 100 % práctico, con ejercicios reales sobre informes diarios administrativos, financieros, control de gestión, contables.",
  benefits: [
    "Automatización de informes diarios y resúmenes ejecutivos en minutos.",
    "Ingeniería de prompts estructurada con plantillas reutilizables para oficina.",
    "Tratamiento y resumen inteligente de datos desde Excel, CSV y correos.",
    "Generación ágil de presentaciones y documentos profesionales con IA.",
    "Flujos de trabajo conectados con Outlook/Gmail, Teams, Drive y Excel.",
    "Uso seguro y confidencial de la IA, validando datos y previniendo alucinaciones.",
  ],
  levels: [
    {
      id: "programa",
      label: "Curso práctico de IA aplicada a la productividad laboral",
      shortLabel: "20h",
      theme: "#7C3AED",
      intro:
        "Contenido curso IA en productividad para administrativos. Enfoque 100 % práctico, con ejercicios reales sobre informes diarios administrativos, financieros, control de gestión y contables.",
      modules: [
        {
          id: "mod-1",
          title: "Módulo 1 – Fundamentos de IA para la productividad",
          hours: 3,
          subtitle: "3 Horas • Fundamentos y herramientas",
          icon: "bot",
          highlight: true,
          topics: [
            "Qué es la IA generativa y qué puede (y no puede) hacer por un administrativo.",
            "Principales herramientas gratuitas y de pago: ChatGPT, Claude, Gemini, Copilot y alternativas.",
            "Configuración de cuentas, privacidad y buenas prácticas de uso en el entorno laboral.",
            "Demostración: generar un informe diario simple en menos de 5 minutos.",
          ],
        },
        {
          id: "mod-2",
          title: "Módulo 2 – Ingeniería de prompts para informes",
          hours: 4,
          subtitle: "4 Horas • Estructura y plantillas",
          icon: "star",
          topics: [
            "Estructura de un buen prompt: rol + contexto + tarea + formato + restricciones.",
            "Técnicas avanzadas: few-shot, chain-of-thought y prompts iterativos.",
            "Plantillas reutilizables para informes diarios, semanales y mensuales.",
            "Ejercicio práctico: crear 5 plantillas de informes (asistencia, ventas, incidencias, gastos y seguimiento de tareas).",
          ],
        },
        {
          id: "mod-3",
          title: "Módulo 3 – Automatización de informes a partir de datos",
          hours: 4,
          subtitle: "4 Horas • Datos y reportes con Excel",
          icon: "excel",
          topics: [
            "Extraer, limpiar y resumir datos desde Excel, CSV, correos o textos desestructurados.",
            "Generar tablas, gráficos descriptivos y conclusiones automáticas.",
            "Convertir datos crudos en informes narrativos listos para enviar.",
            "Ejercicio práctico: tomar un archivo Excel real (o simulado) y generar el informe diario completo con recomendaciones.",
          ],
        },
        {
          id: "mod-4",
          title: "Módulo 4 – Documentos y presentaciones automáticas",
          hours: 3,
          subtitle: "3 Horas • Word, Docs y Slides",
          icon: "generic",
          topics: [
            "Crear informes en Word / Google Docs con formato profesional.",
            "Generar presentaciones (PowerPoint / Google Slides) a partir de un resumen.",
            "Uso de IA para mejorar redacción, tono y claridad de los informes.",
            "Ejercicio práctico: transformar un informe diario en un documento formal + presentación de 5 diapositivas.",
          ],
        },
        {
          id: "mod-5",
          title: "Módulo 5 – Automatización de flujos de trabajo",
          hours: 3,
          subtitle: "3 Horas • Integraciones NoCode",
          icon: "bolt",
          topics: [
            "Conectar IA con herramientas del día a día (Outlook/Gmail, Excel, Teams, Drive).",
            "Introducción a automatizaciones sin código.",
            "Programar la generación y envío de informes diarios.",
            "Ejercicio práctico: diseñar un flujo completo (recibir datos → generar informe → enviar por correo o Teams).",
          ],
        },
        {
          id: "mod-6",
          title: "Módulo 6 – Buenas prácticas, seguridad y proyecto final",
          hours: 3,
          subtitle: "3 Horas • Seguridad y entrega final",
          icon: "generic",
          topics: [
            "Privacidad de datos, confidencialidad y límites legales.",
            "Cómo validar la información generada por IA (evitar alucinaciones).",
            "Organización de prompts y plantillas personales.",
            "Proyecto final: cada participante automatiza su propio informe diario real (o el más frecuente de su trabajo) y lo presenta.",
            "Revisión colectiva, feedback y plan de mejora personal.",
          ],
        },
      ],
    },
  ],
};
