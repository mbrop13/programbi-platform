import Link from "next/link";
import { ArrowRight, CalendarDays, Download, FileText, MessageCircle } from "lucide-react";
import PlantillaDescarga from "@/components/marketing/PlantillaDescarga";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getPais, ISO_CHILE } from "@/config/paises";
import { fichaCurso, rutaFichaCurso } from "@/lib/guias/curso";
import { courses } from "@/lib/data/courses";
import { horarioLocal } from "@/lib/paises/horarios";
import { courseBrochurePath } from "@/lib/pricing-gate";
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
 * - end: bloque fuerte con brochure, inscripción y WhatsApp.
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
  const rutaBrochure = esGeneral ? rutaLocal(iso, "/cursos") : courseBrochurePath(course, iso);
  const horaLocal = `de ${horario.inicio} a ${horario.fin}, hora de ${lugar}`;
  const inicioTexto = ficha.inicio ? `Próxima clase en vivo: ${ficha.inicio}` : "Cupos abiertos · fecha por confirmar";

  if (variant === "top") {
    return (
      <aside className="my-8 rounded-2xl border border-line bg-wash px-5 py-4">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-mute">
          <CalendarDays size={16} className="text-ink" aria-hidden />
          <span>
            {inicioTexto} · {horaLocal}
          </span>
        </p>
        <Link
          href={rutaCurso}
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
          Descarga una plantilla de práctica para seguir los ejemplos de esta guía en {nombreCurso}. Solo necesitas tu
          email.
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
        {inicioTexto} · {horaLocal} · {ficha.horasTexto} · grabaciones de por vida y certificado.
      </p>
      <p className="mt-3 text-sm font-semibold text-ink">
        {esGeneral ? "El arancel de cada curso está en su PDF de temario y precios." : "El arancel vigente, las fechas y las cuotas están en el PDF de temario y precios del curso."}
      </p>
      <Link
        href={rutaBrochure}
        target={esGeneral ? undefined : "_blank"}
        rel={esGeneral ? undefined : "noopener noreferrer"}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-canvas px-5 py-2.5 text-sm font-semibold text-ink no-underline hover:bg-wash"
      >
        <FileText size={15} aria-hidden /> Ver temario y precios (PDF) →
      </Link>
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
