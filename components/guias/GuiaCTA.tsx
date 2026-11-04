import Link from "next/link";
import { ArrowRight, CalendarDays, Download, MessageCircle } from "lucide-react";
import PlantillaDescarga from "@/components/marketing/PlantillaDescarga";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getPais, ISO_CHILE } from "@/config/paises";
import { courses } from "@/lib/data/courses";
import { formatMoneda, precioVenta } from "@/lib/paises/precios";
import { horarioLocal } from "@/lib/paises/horarios";
import { rutaLocal } from "@/lib/paises/rutas";

/** Fecha publicada en las fichas de los cursos (dato real, no calculado). */
export const PROXIMO_INICIO = "lunes 23 de noviembre de 2026";

function cursoDe(slug: string) {
  return courses.find((course) => course.slug === slug);
}

/**
 * CTA de guía. Tres variantes:
 * - top: caja discreta con la próxima clase y el horario local.
 * - mid: descarga de la plantilla (solo email).
 * - end: bloque fuerte con precio local, inscripción y WhatsApp.
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
  const nombreCurso = curso?.title || "Power BI";
  const precio = precioVenta(iso, course);
  const horario = horarioLocal(iso);
  const lugar = iso === ISO_CHILE ? "Chile" : pais.nombre;
  const rutaCurso = rutaLocal(iso, `/cursos/${course}`);
  const rutaLanding = rutaLocal(iso, "/curso-power-bi");
  const horaLocal = `de ${horario.inicio} a ${horario.fin}, hora de ${lugar}`;

  if (variant === "top") {
    return (
      <aside className="my-8 rounded-2xl border border-line bg-wash px-5 py-4">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-mute">
          <CalendarDays size={16} className="text-ink" aria-hidden />
          <span>
            Próxima clase en vivo: <strong className="font-semibold text-ink">{PROXIMO_INICIO}</strong> ·{" "}
            {horaLocal}
          </span>
        </p>
        <Link
          href={rutaLanding}
          className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline"
        >
          Ver el curso
          <ArrowRight size={15} aria-hidden />
        </Link>
      </aside>
    );
  }

  if (variant === "mid") {
    return (
      <aside className="my-8 rounded-2xl border border-line bg-paper px-5 py-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Download size={16} aria-hidden />
          Plantilla gratis para practicar
        </p>
        <p className="mt-1 text-sm leading-relaxed text-mute">
          Descarga la plantilla de dashboard de ventas y sigue los ejemplos de la guía en Power BI.
          Solo necesitas tu email.
        </p>
        <div className="mt-4">
          <PlantillaDescarga pais={iso} location={`guia:${guiaSlug}`} label="Descargar la plantilla CSV" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="mt-10 rounded-2xl border border-line-strong bg-paper px-5 py-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Curso en vivo</p>
      <p className="mt-2 text-xl font-bold tracking-tight text-ink">{nombreCurso} en vivo</p>
      <p className="mt-1 text-sm text-mute">
        {PROXIMO_INICIO} · {horaLocal} · 20 horas por Zoom · grabaciones de por vida y certificado.
      </p>
      {precio != null ? (
        <p className="mt-3 text-2xl font-bold tracking-tight text-ink">
          {formatMoneda(iso, precio)}
          <span className="ml-2 text-xs font-medium text-mute">por nivel</span>
        </p>
      ) : (
        <p className="mt-3 text-sm font-semibold text-ink">Consulta el valor por WhatsApp según tu país.</p>
      )}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href={rutaCurso}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline"
        >
          Inscribirme
          <ArrowRight size={15} aria-hidden />
        </Link>
        <WhatsAppCta
          page={rutaCurso}
          intent="curso"
          course={nombreCurso}
          courseSlug={course}
          country={iso}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-canvas px-5 text-sm font-semibold text-ink no-underline"
        >
          <MessageCircle size={15} aria-hidden />
          Hablar por WhatsApp
        </WhatsAppCta>
      </div>
    </aside>
  );
}

/** Barra fija inferior para mobile en las guías. */
export function GuiaStickyCta({ iso, course }: { iso: string; course: string }) {
  const curso = cursoDe(course);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
      <div className="flex gap-2">
        <Link
          href={rutaLocal(iso, `/cursos/${course}`)}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-sm font-semibold text-canvas no-underline"
        >
          Inscribirme
        </Link>
        <WhatsAppCta
          page={rutaLocal(iso, `/cursos/${course}`)}
          intent="curso"
          course={curso?.title || "Power BI"}
          courseSlug={course}
          country={iso}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-canvas text-sm font-semibold text-ink no-underline"
        >
          <MessageCircle size={16} aria-hidden />
          WhatsApp
        </WhatsAppCta>
      </div>
    </div>
  );
}
