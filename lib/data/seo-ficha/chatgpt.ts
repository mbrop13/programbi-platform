import type { BloqueSeoFicha } from "./tipos";
import { textoCuotas } from "@/config/cuotas";
import { ISO_CHILE } from "@/config/paises";
import { HORA_CLASE_CHILE } from "@/lib/paises/horarios";

const HORARIO = `${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin}`;

/**
 * Bloques extra de la ficha de ChatGPT (Chile).
 * ChatGPT es un único nivel Completo de 20 horas (5 módulos de 4 h), sin programar.
 */
export const BLOQUES_CHATGPT: readonly BloqueSeoFicha[] = [
  {
    eyebrow: "Qué se ve en cada módulo",
    titulo: "Temario completo de 20 horas, sin programar",
    parrafos: [
      "El curso de ChatGPT tiene un único nivel Completo de 20 horas en vivo por Zoom, dividido en 5 módulos de 4 horas cada uno. Parte desde cero y está diseñado para trabajo de oficina, administración y análisis cotidiano sin escribir código.",
    ],
    bullets: [
      "Módulo 1 (4 h) · Configuración, planes y prompting profesional: diferencias entre planes personales y empresariales, privacidad de datos, modos de razonamiento y estructura clara de contexto, tarea, formato y restricciones.",
      "Módulo 2 (4 h) · Documentos, PDF, Deep Research y Projects: lectura y extracción de documentos largos, revisión de bases de licitación, armado de Projects con archivos de referencia, informes y presentaciones.",
      "Módulo 3 (4 h) · Análisis de datos y Excel con ChatGPT: limpieza de planillas CSV y Excel en el chat, generación de fórmulas compatibles con Excel y Google Sheets, tablas resumen y gráficos para reportes.",
      "Módulo 4 (4 h) · Apps, conectores, plugins y skills: conexión con herramientas de trabajo, uso del plugin Data y transición desde los antiguos GPTs personalizados en retiro hacia plugins y skills reutilizables.",
      "Módulo 5 (4 h) · ChatGPT Work, automatización ligera y proyecto final: tareas programadas en ChatGPT Work, explicación sencilla de Codex sin programar, criterios de privacidad y proyecto final sobre un proceso real de tu trabajo.",
    ],
  },
  {
    eyebrow: "Aplicación en oficina y logística",
    titulo: "Privacidad empresarial, casos en LATAM y cómo se cursa",
    parrafos: [
      "El mismo programa de 20 horas se dicta para alumnos particulares y equipos corporativos en Chile y Latinoamérica. Cada módulo aplica casos reales de oficina —planillas de gastos, conciliación, resúmenes de contratos, correos e informes mensuales— con foco en verificación humana y resguardo de datos confidenciales.",
    ],
    bullets: [
      "Nivel único Completo (20 horas): no necesitas conocimientos previos de programación ni niveles anteriores.",
      "Privacidad y criterio: revisas cómo funcionan los planes empresariales, qué datos conviene anonimizar antes de subir archivos y cómo validar cifras antes de enviar un informe.",
      `Horario: dos veces por semana, de ${HORARIO}, hora de Chile (ajustado en vivo a la hora local de cada país de Latinoamérica).`,
      "Campus virtual y certificado: acceso al campus con las clases y material usado para practicar durante el curso, más certificado digital de ProgramBI al completar.",
      `Pago: el arancel vigente y las ${textoCuotas(ISO_CHILE)} están en el PDF de temario y precios del curso.`,
    ],
    enlaces: [
      {
        href: "/guias/chatgpt-para-analisis-de-datos",
        label: "Cómo usar ChatGPT para analizar datos (sin programar)",
      },
      { href: "/empresas", label: "Capacitar a un equipo o empresa en ChatGPT" },
      { href: "/cursos/gemini", label: "Comparar con el curso de Gemini para Google Workspace" },
    ],
  },
];
