import Link from "next/link";
import type { Course } from "@/lib/data/courses";
import { catalogHours, offerHours, publicLevelCount } from "@/lib/data/course-views";
import { COURSE_SEO } from "@/lib/seo/money";
import { getPais, ISO_CHILE, muestraPrecioDirecto, normalizarPais } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import { etiquetaHoraLocal, horarioLocal, type HorarioLocal } from "@/lib/paises/horarios";
import {
  etiquetaDescuentoCurso,
  localizarMercado,
  precioVenta,
  type PromocionAplicable,
} from "@/lib/paises/precios";
import { montoConCodigo } from "@/lib/paises/detalle-curso";
import { courseBrochurePath } from "@/lib/pricing-gate";
import { miembroPorCurso, rutaPerfil } from "@/lib/data/equipo";
import { OFERTA_CLASE_GRATIS_WHATSAPP } from "@/config/flags";

const REQUISITOS_POR_CURSO: Record<string, string> = {
  "power-bi":
    "No necesitas saber programar ni dominar DAX antes de empezar; solo manejo básico de Excel y archivos.",
  "sql-server":
    "No necesitas saber programar ni tener experiencia previa en bases de datos; parte desde cero en consultas SQL.",
  python:
    "No necesitas saber programar antes de inscribirte; el curso parte desde cero en fundamentos de Python y Pandas.",
  "analisis-de-datos":
    "No necesitas saber programar: SQL Server, Power BI y Python se enseñan desde cero a partir de manejo básico de Excel.",
  "analitica-mineria":
    "Conocimientos básicos de Excel y análisis de datos; SQL Server, Power BI y Python se aplican desde fundamentos de faena.",
  excel:
    "No necesitas saber programar; parte desde fórmulas y tablas dinámicas hasta Power Query, macros y dashboards.",
  access:
    "No necesitas saber programar; parte desde la interfaz de Microsoft Access y llega a consultas, formularios, informes y macros.",
  "power-automate":
    "No necesitas saber programar: es automatización sin código (no-code) con flujos de Microsoft 365, RPA de escritorio y Copilot.",
  claude:
    "No necesitas saber programar; está enfocado en uso práctico de Claude (Anthropic) para documentos, Excel y tareas diarias.",
  chatgpt:
    "No necesitas saber programar; está enfocado en uso práctico de ChatGPT para trabajo administrativo, análisis en Excel/Google Sheets, informes y automatización ligera.",
  gemini:
    "No necesitas saber programar; está enfocado en uso práctico de Gemini en Google Workspace (Gmail, Docs, Sheets, Meet), documentos PDF y Gemini Notebook.",
  "ia-productividad":
    "No necesitas conocimientos previos ni saber programar; se trabaja con flujos sin código y plantillas de prompts reutilizables.",
  copilot:
    "Manejo de herramientas de oficina de Microsoft 365 (Excel, Outlook, PowerPoint y Word); no requiere saber programar.",
  "mercado-financiero":
    "Excel intermedio (tablas dinámicas, fórmulas avanzadas y gráficos); Python, SQL, Power BI e IA se enseñan desde cero.",
  "machine-learning":
    "Conocimientos intermedios de Python (Pandas y NumPy) y nociones de álgebra lineal para modelado predictivo.",
};

export function requisitoPrevioCurso(slug: string): string {
  return (
    REQUISITOS_POR_CURSO[slug] ??
    "No necesitas saber programar antes de inscribirte; el programa parte desde fundamentos aplicados."
  );
}

export function duracionResumenTexto(course: Course): string {
  const horas = offerHours(course, "publico") || catalogHours(course);
  const niveles = publicLevelCount(course);
  if (niveles > 1) {
    return `${horas} horas en vivo por nivel (2 niveles independientes: Básico-Intermedio y Avanzado, ${horas * 2} horas el programa completo).`;
  }
  return `${horas} horas en vivo en un programa de nivel único.`;
}

export function horarioResumenTexto(iso: string, horario: HorarioLocal): string {
  const horaLocal = etiquetaHoraLocal(iso);
  if (iso === ISO_CHILE) {
    return `Clases de ${horario.inicioChile} a ${horario.finChile}, ${horaLocal}, dos veces por semana.`;
  }
  return `Clases de ${horario.inicio} a ${horario.fin}, ${horaLocal} (${horario.inicioChile} a ${horario.finChile} en Chile), dos veces por semana.`;
}

/**
 * Preguntas frecuentes alineadas con los hechos de `CourseSummaryBox` para que
 * tanto la sección FAQ visible como el JSON-LD `FAQPage` respondan de forma
 * consistente sobre duración, modalidad en vivo, certificado y requisitos
 * previos (incluyendo si se necesita saber programar).
 */
export function faqsResumenCurso(
  course: Course,
  rawPais: string | null | undefined,
  horario: HorarioLocal
): { q: string; a: string }[] {
  const iso = normalizarPais(rawPais);
  const horas = offerHours(course, "publico") || catalogHours(course);
  const niveles = publicLevelCount(course);
  const requisito = requisitoPrevioCurso(course.slug);
  const horarioTexto = horarioResumenTexto(iso, horario);

  const duracionRespuesta =
    niveles > 1
      ? `Cada nivel (${course.title} Básico-Intermedio y Avanzado) dura ${horas} horas en vivo por Zoom. Si cursas ambos niveles, el programa completo suma ${horas * 2} horas.`
      : `El curso de ${course.title} dura ${horas} horas en vivo por Zoom en un programa de nivel único.`;

  return [
    {
      q: `¿Cuánto dura el curso de ${course.title}?`,
      a: duracionRespuesta,
    },
    {
      q: `¿El curso de ${course.title} es en vivo?`,
      a: `Sí. Las clases son 100% en vivo por Zoom, con grabaciones disponibles en el campus virtual junto con el material de práctica. ${horarioTexto}`,
    },
    {
      q: `¿El curso de ${course.title} entrega certificado?`,
      a: "Sí. Recibes un certificado digital de ProgramBI al completar el curso, además de acceso al campus virtual con las grabaciones y archivos de trabajo.",
    },
    {
      q: `¿Necesito saber programar para tomar ${course.title}?`,
      a: requisito,
    },
  ];
}

export default function CourseSummaryBox({
  course,
  pais: rawPais,
  inicio,
  fin,
  promotions,
}: {
  course: Course;
  pais?: string | null;
  inicio?: string;
  fin?: string;
  promotions?: readonly PromocionAplicable[];
}) {
  const iso = normalizarPais(rawPais);
  const info = getPais(iso);
  const seo = COURSE_SEO[course.slug];
  const horario = horarioLocal(iso, { inicio, fin });
  const niveles = publicLevelCount(course);
  const audienciaRaw = seo?.audience || course.shortDescription;
  const audiencia = localizarMercado(audienciaRaw, iso);
  const nivelCapitalizado =
    course.level.charAt(0).toUpperCase() + course.level.slice(1);
  const precioDirecto = muestraPrecioDirecto(iso)
    ? precioVenta(iso, course.slug, promotions)
    : null;
  const etiquetaDescuento = muestraPrecioDirecto(iso)
    ? null
    : etiquetaDescuentoCurso(iso, course.slug, promotions);
  const cuotas = textoCuotas(iso);
  const brochureHref = courseBrochurePath(course.slug, iso);
  const profesor = miembroPorCurso(course.slug);
  const tieneClaseGratis = OFERTA_CLASE_GRATIS_WHATSAPP && !muestraPrecioDirecto(iso);

  return (
    <section
      aria-labelledby="curso-en-resumen"
      data-testid="course-summary-box"
      className="mt-8 rounded-[26px] border border-line bg-paper p-5 sm:p-6"
    >
      <h2
        id="curso-en-resumen"
        className="text-xs font-bold uppercase tracking-[0.18em] text-mute"
      >
        En resumen
      </h2>
      <ul className="mt-3.5 space-y-2 text-sm leading-relaxed text-ink">
        <li>
          <strong className="font-semibold">Modalidad:</strong> Clases 100% en vivo por Zoom, con grabaciones disponibles en el campus virtual.
        </li>
        <li>
          <strong className="font-semibold">Duración:</strong> {duracionResumenTexto(course)}
        </li>
        <li>
          <strong className="font-semibold">Nivel y para quién es:</strong> Nivel {nivelCapitalizado.toLowerCase()}. {audiencia}
        </li>
        <li>
          <strong className="font-semibold">Requisitos previos:</strong> {requisitoPrevioCurso(course.slug)}
        </li>
        <li>
          <strong className="font-semibold">Certificado:</strong> Certificado digital de ProgramBI al completar.
        </li>
        <li>
          <strong className="font-semibold">Horario en {iso === ISO_CHILE ? "Chile" : info.nombre}:</strong>{" "}
          {horarioResumenTexto(iso, horario)}
        </li>
        <li>
          <strong className="font-semibold">Arancel vigente:</strong>{" "}
          {precioDirecto != null ? (
            <>
              {montoConCodigo(iso, precioDirecto)}
              {niveles > 1 ? " por nivel" : ""} (pago directo en {info.moneda}).
            </>
          ) : (
            <>
              {etiquetaDescuento ? `${etiquetaDescuento} vigente · ` : ""}
              <Link
                href={brochureHref}
                className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                ver arancel vigente en el PDF de temario y precios
              </Link>
              {cuotas ? `, con pago en ${cuotas}` : ""}.
            </>
          )}
        </li>
        {tieneClaseGratis && (
          <li>
            <strong className="font-semibold">Clase de prueba:</strong>{" "}
            Disponible clase gratis introductoria coordinada vía WhatsApp antes de inscribirte.
          </li>
        )}
        <li>
          <strong className="font-semibold">Docente y casos:</strong>{" "}
          Dictado por{" "}
          <Link
            href={rutaPerfil(profesor.slug)}
            className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            {profesor.nombre}
          </Link>{" "}
          ({profesor.cargo}) ·{" "}
          <Link
            href="/casos"
            className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            ver testimonios de alumnos
          </Link>
          .
        </li>
      </ul>
    </section>
  );
}
