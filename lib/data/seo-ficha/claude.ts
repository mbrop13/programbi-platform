import type { BloqueSeoFicha } from "./tipos";
import { textoCuotas } from "@/config/cuotas";
import { ISO_CHILE } from "@/config/paises";
import { HORA_CLASE_CHILE } from "@/lib/paises/horarios";

const HORARIO = `${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin}`;

/**
 * Bloques extra de la ficha de Claude (Chile).
 * Cada afirmación sale de lib/data/courses.ts, config/pricing.ts,
 * config/cuotas.ts o de las guías ya publicadas. Claude es un único nivel
 * Completo de 20 horas (5 módulos de 4 h), sin programar.
 */
export const BLOQUES_CLAUDE: readonly BloqueSeoFicha[] = [
  {
    eyebrow: "Qué se ve en cada módulo",
    titulo: "Temario completo de 20 horas, sin programar",
    parrafos: [
      "El curso de Claude tiene un único nivel Completo de 20 horas en vivo por Zoom, dividido en 5 módulos de 4 horas cada uno. Parte desde cero y está diseñado para trabajo de oficina, administración y análisis cotidiano sin escribir código.",
    ],
    bullets: [
      "Módulo 1 (4 h) · Introducción a Claude y primeros pasos: interfaces web, escritorio y móvil; planes y privacidad de datos para empresas; configuración de estilo y límites reales de la herramienta.",
      "Módulo 2 (4 h) · Prompting práctico: estructura de contexto, tarea, formato, tono y restricciones; técnicas de rol, ejemplos y pasos; resúmenes de documentos largos, correos, actas y plantillas reutilizables.",
      "Módulo 3 (4 h) · Projects, Artifacts, Docs y Slides: espacios con documentos de referencia del área, Artifacts interactivos para editar al lado, creación de informes y exportación a Word, PDF, PowerPoint o Google Docs.",
      "Módulo 4 (4 h) · Claude para Excel y tareas administrativas: limpieza y análisis de planillas, fórmulas, tablas resumen, tendencias y anomalías sin ser experto en datos; conectores básicos (correo, Drive y calendario) y Claude Cowork sobre tus archivos.",
      "Módulo 5 (4 h) · Automatización ligera y proyecto final: Claude Code y Cowork explicados en lenguaje sencillo (sin programar), automatización de reportes repetitivos, seguridad, verificación para evitar errores y proyecto final sobre un proceso real de tu trabajo.",
    ],
  },
  {
    eyebrow: "Aplicación en oficina y logística",
    titulo: "Privacidad empresarial, casos en LATAM y cómo se cursa",
    parrafos: [
      "El mismo programa de 20 horas se dicta para alumnos particulares y equipos corporativos en Chile y Latinoamérica. Cada módulo aplica casos reales de oficina —actas, control de gastos, informes semanales y reportes mensuales en Excel— con foco en verificación humana y resguardo de datos confidenciales.",
    ],
    bullets: [
      "Nivel único Completo (20 horas): no necesitas conocimientos previos de programación ni niveles anteriores.",
      "Privacidad y criterio: revisas cómo funcionan los planes empresariales, qué datos no conviene exponer y cómo validar cifras antes de enviar un informe.",
      `Horario: dos veces por semana, de ${HORARIO}, hora de Chile (ajustado en vivo a la hora local de cada país de Latinoamérica).`,
      "Campus virtual y certificado: acceso al campus con las clases y material usado para practicar durante el curso, más certificado digital de ProgramBI al completar.",
      `Pago: el arancel vigente y las ${textoCuotas(ISO_CHILE)} están en el PDF de temario y precios del curso.`,
    ],
    enlaces: [
      {
        href: "/guias/como-usar-claude-para-analisis-de-datos",
        label: "Cómo usar Claude para analizar datos (sin programar)",
      },
      { href: "/empresas", label: "Capacitar a un equipo o empresa en Claude" },
      { href: "/cursos/power-bi", label: "Seguir con tableros en Power BI" },
    ],
  },
];
