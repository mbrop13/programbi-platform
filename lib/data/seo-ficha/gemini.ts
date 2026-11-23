import type { BloqueSeoFicha } from "./tipos";
import { textoCuotas } from "@/config/cuotas";
import { ISO_CHILE } from "@/config/paises";
import { HORA_CLASE_CHILE } from "@/lib/paises/horarios";

const HORARIO = `${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin}`;

/**
 * Bloques extra de la ficha de Gemini (Chile).
 * Gemini es un único nivel Completo de 20 horas (5 módulos de 4 h), sin programar.
 */
export const BLOQUES_GEMINI: readonly BloqueSeoFicha[] = [
  {
    eyebrow: "Qué se ve en cada módulo",
    titulo: "Temario completo de 20 horas, sin programar",
    parrafos: [
      "El curso de Gemini tiene un único nivel Completo de 20 horas en vivo por Zoom, dividido en 5 módulos de 4 horas cada uno. Parte desde cero y está pensado para aprovechar Gemini dentro de Google Workspace y el análisis documental diario sin escribir código.",
    ],
    bullets: [
      "Módulo 1 (4 h) · App de Gemini, Google Workspace y skills: diferencias entre cuenta personal y Google Workspace Business Standard+, configuración de privacidad, prompting estructurado y skills que reemplazan a los antiguos Gems.",
      "Módulo 2 (4 h) · Gmail, Calendar, Meet, Docs y Slides: redacción de correos con tono de empresa, resúmenes de reuniones en Meet, borradores en Docs y presentaciones en Slides exportables a PowerPoint o PDF.",
      "Módulo 3 (4 h) · Google Sheets y PDF con Gemini: creación de tablas y fórmulas, uso de Fill with Gemini y extracción ordenada de datos desde archivos PDF y documentos largos hacia hojas de cálculo.",
      "Módulo 4 (4 h) · Gemini Notebook (NotebookLM) y Deep Research: cuadernos de trabajo con fuentes propias y citas verificables, Audio y Video Overviews, e investigación profunda con validación de fuentes.",
      "Módulo 5 (4 h) · Workspace Studio, privacidad y proyecto final: automatización ligera de flujos en Workspace Studio sin programar, alcance real en Latinoamérica, resguardo de datos y proyecto final aplicado a tu trabajo.",
    ],
  },
  {
    eyebrow: "Aplicación en oficina y logística",
    titulo: "Privacidad empresarial, casos en LATAM y cómo se cursa",
    parrafos: [
      "El mismo programa de 20 horas se dicta para alumnos particulares y equipos corporativos en Chile y Latinoamérica. Cada módulo trabaja casos reales de oficina sobre Gmail, Docs, Sheets y archivos PDF con foco en verificación humana y resguardo de datos confidenciales.",
    ],
    bullets: [
      "Nivel único Completo (20 horas): no necesitas conocimientos previos de programación ni niveles anteriores.",
      "Privacidad y criterio: revisas qué incluye una cuenta personal frente a Google Workspace empresarial, qué datos no conviene exponer y cómo verificar fuentes y cifras.",
      `Horario: dos veces por semana, de ${HORARIO}, hora de Chile (ajustado en vivo a la hora local de cada país de Latinoamérica).`,
      "Campus virtual y certificado: acceso al campus con las clases y material usado para practicar durante el curso, más certificado digital de ProgramBI al completar.",
      `Pago: el arancel vigente y las ${textoCuotas(ISO_CHILE)} están en el PDF de temario y precios del curso.`,
    ],
    enlaces: [
      {
        href: "/guias/gemini-para-analisis-de-datos",
        label: "Cómo usar Gemini para analizar datos y documentos",
      },
      { href: "/empresas", label: "Capacitar a un equipo o empresa en Gemini" },
      { href: "/cursos/chatgpt", label: "Comparar con el curso de ChatGPT para Excel y oficina" },
    ],
  },
];
