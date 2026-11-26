import Link from "next/link";
import { CalendarDays, Check, Download, FileText, MessageCircle } from "lucide-react";
import { GuiaToolVisual } from "@/components/guias/GuiaEditorialPrimitives";
import InicioVigente from "@/components/guias/InicioVigente";
import PlantillaDescarga from "@/components/marketing/PlantillaDescarga";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getPais, ISO_CHILE } from "@/config/paises";
import { courses } from "@/lib/data/courses";
import { OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
import { fichaCurso, rutaFichaCurso } from "@/lib/guias/curso";
import type { InicioGuia } from "@/lib/guias/inicio";
import { horarioLocal } from "@/lib/paises/horarios";
import { rutaLocal } from "@/lib/paises/rutas";

/** Etiqueta evergreen de cohorte cuando no hay una fecha fija publicada. */
export const PROXIMO_INICIO = OPEN_COHORT_LABEL;

const CURSOS_CON_PLANTILLA_BI = new Set(["power-bi", "analisis-de-datos"]);

function cursoDe(slug: string) {
  return courses.find((course) => course.slug === slug);
}

/**
 * CTA contextual de guía. Tres variantes:
 * - top: resumen compacto con fecha, horario local y acceso directo al programa.
 * - mid: descarga de plantilla CSV solo en Power BI / Análisis de Datos; en el
 *        resto de cursos muestra resultados concretos del programa en vivo.
 * - end: puente hacia el showcase interactivo `#temario-curso`, inscripción o WhatsApp.
 */
export default function GuiaCTA({
  variant,
  iso,
  course,
  guiaSlug,
  inicio = null,
  ctaPosition,
}: {
  variant: "top" | "mid" | "end";
  iso: string;
  course: string;
  guiaSlug: string;
  /** Próxima cohorte real del curso, fijada al construir el sitio. */
  inicio?: InicioGuia | null;
  ctaPosition?: string;
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
  const inicioTexto = (
    <InicioVigente inicio={inicio} prefijo="Próximo inicio: " alterno={OPEN_COHORT_LABEL} />
  );

  if (variant === "top") {
    return (
      <aside className="my-8 flex flex-col justify-between gap-3 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] px-5 py-4 shadow-[var(--g-card-shadow)] sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <GuiaToolVisual tool={course} course={course} size="sm" />
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--g-muted)]">
            <CalendarDays size={15} className="shrink-0 text-[var(--g-accent)]" aria-hidden />
            <span>
              <strong className="font-semibold text-[var(--g-ink)]">{inicioTexto}</strong> ·{" "}
              <span className="tabular-nums">{horaLocal}</span>
            </span>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={rutaTemario}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)] sm:min-h-[38px]"
          >
            Temario y precios
          </Link>
          <Link
            href={rutaCurso}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--g-accent)] px-4 text-xs font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95 sm:min-h-[38px]"
          >
            Ver curso en vivo
          </Link>
        </div>
      </aside>
    );
  }

  if (variant === "mid") {
    if (CURSOS_CON_PLANTILLA_BI.has(course)) {
      return (
        <aside className="my-8 overflow-hidden rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] px-5 py-5 shadow-[var(--g-card-shadow)] sm:px-6">
          <div className="flex items-start gap-3">
            <GuiaToolVisual tool={course} course={course} size="sm" className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-bold text-[var(--g-ink)]">
                <Download size={15} className="shrink-0 text-[var(--g-accent)]" aria-hidden />
                Plantilla CSV gratis para practicar en {nombreCurso}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--g-muted)]">
                Descarga nuestro dataset comercial de ejemplo para probar estos cálculos y armar tu tablero paso a paso.
              </p>
              <div className="mt-4">
                <PlantillaDescarga pais={iso} location={`guia:${guiaSlug}`} label="Descargar la plantilla CSV" />
              </div>
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
      <aside className="my-8 overflow-hidden rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] px-5 py-5 shadow-[var(--g-card-shadow)] sm:px-6">
        <div className="flex items-start gap-3">
          <GuiaToolVisual tool={course} course={course} size="sm" className="mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
              Llévalo a la práctica en vivo
            </p>
            <p className="mt-1 text-base font-bold text-[var(--g-ink)]">
              ¿Quieres dominar {nombreCurso} con ejemplos de tu oficina?
            </p>
            <ul className="mt-3 space-y-1.5">
              {beneficios.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-[var(--g-muted)]">
                  <Check size={14} className="mt-0.5 shrink-0 text-[var(--g-ok)]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={rutaCurso}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[var(--g-accent)] px-4 text-xs font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95 sm:min-h-[40px]"
              >
                <FileText size={14} aria-hidden /> Ver programa y precios (PDF)
              </Link>
              <WhatsAppCta
                page={rutaCurso}
                intent="curso"
                course={nombreCurso}
                courseSlug={course}
                country={iso}
                ctaPosition={ctaPosition ?? "guia_mid"}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)] sm:min-h-[40px]"
              >
                <MessageCircle size={14} aria-hidden /> Consultar por WhatsApp
              </WhatsAppCta>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="mt-10 rounded-2xl border border-[var(--g-border-strong)] bg-[var(--g-wash)] px-5 py-6 shadow-[var(--g-card-shadow)] sm:px-6">
      <div className="flex items-start gap-3">
        <GuiaToolVisual tool={course} course={course} size="md" className="mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
            Siguiente paso · Curso en vivo
          </p>
          <p className="mt-1 text-lg font-bold tracking-tight text-[var(--g-ink)]">
            {nombreCurso} en vivo por Zoom
          </p>
          <p className="mt-1 text-sm tabular-nums text-[var(--g-muted)]">
            {inicioTexto} · {horaLocal} · {ficha.horasTexto}.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <Link
          href={rutaTemario}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--g-accent)] px-5 text-sm font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95"
        >
          <FileText size={15} aria-hidden /> Desbloquear temario y precios
        </Link>
        <WhatsAppCta
          page={rutaCurso}
          intent="curso"
          course={nombreCurso}
          courseSlug={course}
          country={iso}
          ctaPosition={ctaPosition ?? "guia_end"}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] px-5 text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-bg)]"
        >
          <MessageCircle size={15} aria-hidden />
          Hablar por WhatsApp
        </WhatsAppCta>
      </div>
    </aside>
  );
}
