import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Download, FileText, MessageCircle } from "lucide-react";
import PlantillaDescarga from "@/components/marketing/PlantillaDescarga";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getPais, ISO_CHILE } from "@/config/paises";
import { courses } from "@/lib/data/courses";
import { OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
import { fichaCurso, rutaFichaCurso } from "@/lib/guias/curso";
import { horarioLocal } from "@/lib/paises/horarios";
import { rutaLocal } from "@/lib/paises/rutas";

/** Fecha publicada en las fichas principales. */
export const PROXIMO_INICIO = "lunes 23 de noviembre de 2026";

const CURSOS_CON_PLANTILLA_BI = new Set(["power-bi", "analisis-de-datos"]);

function cursoDe(slug: string) {
  return courses.find((course) => course.slug === slug);
}

/**
 * CTA contextual de guía. Tres variantes:
 * - top: resumen compacto con fecha, horario local y acceso directo al programa.
 * - mid: descarga de plantilla CSV solo en Power BI / Análisis de Datos; en el
 *        resto de cursos (Claude, SQL, Python, Copilot, Excel, ML...) muestra
 *        resultados concretos del programa en vivo con enlace directo al temario.
 * - end: puente hacia el showcase interactivo `#temario-curso`, inscripción o WhatsApp.
 */
export default function GuiaCTA({
  variant,
  iso,
  course,
  guiaSlug,
}: {
  variant: "top" | "mid" | "end";
  iso: string;
  course: string;
  guiaSlug: string;
}) {
  const pais = getPais(iso);
  const curso = cursoDe(course);
  const ficha = fichaCurso(course);
  const esGeneral = course === "general";
  const nombreCurso = curso?.title || (esGeneral ? "Cursos de ProgramBI" : "Power BI");
  const horario = horarioLocal(iso);
  const lugar = iso === ISO_CHILE ? "Chile" : pais.nombre;
  const rutaCurso = esGeneral ? rutaLocal(iso, "/cursos") : rutaFichaCurso(iso, course);
  const rutaTemario = esGeneral ? rutaCurso : "#temario-curso";
  const horaLocal = `de ${horario.inicio} a ${horario.fin}, hora de ${lugar}`;
  const inicioTexto = ficha.inicio ? `Próxima clase en vivo: ${ficha.inicio}` : OPEN_COHORT_LABEL;

  if (variant === "top") {
    return (
      <aside className="my-8 flex flex-col justify-between gap-3 rounded-2xl border border-line-strong bg-wash/80 px-5 py-4 sm:flex-row sm:items-center">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-mute">
          <CalendarDays size={16} className="shrink-0 text-ink" aria-hidden />
          <span>
            <strong className="font-semibold text-ink">{inicioTexto}</strong> · {horaLocal}
          </span>
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={rutaTemario}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-line-strong bg-paper px-4 text-xs font-semibold text-ink no-underline hover:bg-canvas"
          >
            Temario y precios
          </Link>
          <Link
            href={rutaCurso}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-ink px-4 text-xs font-semibold text-canvas no-underline"
          >
            Ver curso <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </aside>
    );
  }

  if (variant === "mid") {
    if (CURSOS_CON_PLANTILLA_BI.has(course)) {
      return (
        <aside className="my-8 overflow-hidden rounded-2xl border border-line-strong bg-paper shadow-sm">
          <div className="px-5 py-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Download size={16} aria-hidden />
              Plantilla CSV gratis para practicar en {nombreCurso}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-mute">
              Descarga nuestro dataset comercial de ejemplo para probar estos cálculos y armar tu tablero paso a paso.
            </p>
            <div className="mt-4">
              <PlantillaDescarga pais={iso} location={`guia:${guiaSlug}`} label="Descargar la plantilla CSV" />
            </div>
          </div>
        </aside>
      );
    }

    const beneficios = curso?.whatYouLearn.slice(0, 3) ?? [
      "Clases en vivo por Zoom con ejercicios prácticos desde cero",
      "Aplica las herramientas directamente sobre casos de tu trabajo",
      "Campus virtual con las clases y material para practicar durante el curso, y certificado al completar",
    ];

    return (
      <aside className="my-8 overflow-hidden rounded-2xl border border-line-strong bg-paper shadow-sm">
        <div className="px-5 py-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mute">
            Llévalo a la práctica en vivo
          </p>
          <p className="mt-1 text-base font-bold text-ink">
            ¿Quieres dominar {nombreCurso} con ejemplos de tu oficina?
          </p>
          <ul className="mt-3 space-y-1.5">
            {beneficios.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-mute">
                <Check size={14} className="mt-0.5 shrink-0 text-ink" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={rutaTemario}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-xs font-semibold text-canvas no-underline"
            >
              <FileText size={14} aria-hidden /> Ver temario y precios (PDF)
            </Link>
            <Link
              href={rutaCurso}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong bg-canvas px-4 text-xs font-semibold text-ink no-underline hover:bg-wash"
            >
              Ver programa en vivo <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="mt-10 rounded-2xl border border-line bg-wash/70 px-5 py-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Siguiente paso · Curso en vivo</p>
      <p className="mt-1.5 text-lg font-bold tracking-tight text-ink">{nombreCurso} en vivo por Zoom</p>
      <p className="mt-1 text-sm text-mute">
        {inicioTexto} · {horaLocal} · {ficha.horasTexto}.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href={rutaTemario}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline"
        >
          <FileText size={15} aria-hidden /> Desbloquear temario y precios
        </Link>
        <WhatsAppCta
          page={rutaCurso}
          intent="curso"
          course={nombreCurso}
          courseSlug={course}
          country={iso}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-line-strong bg-paper px-5 text-sm font-semibold text-ink no-underline hover:bg-canvas"
        >
          <MessageCircle size={15} aria-hidden />
          Hablar por WhatsApp
        </WhatsAppCta>
      </div>
    </aside>
  );
}
