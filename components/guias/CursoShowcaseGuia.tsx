import Image from "next/image";
import Link from "next/link";
import { Check, ExternalLink, MessageCircle } from "lucide-react";
import { BrochureGateForm } from "@/components/marketing/BrochureGateForm";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getPais, ISO_CHILE } from "@/config/paises";
import { getCourseGallery } from "@/lib/data/course-gallery";
import { OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
import { offerSyllabusSections } from "@/lib/data/course-views";
import { getCourseBySlug } from "@/lib/data/courses";
import { miembroPorCurso, rutaPerfil } from "@/lib/data/equipo";
import { fichaCurso, rutaFichaCurso } from "@/lib/guias/curso";
import InicioVigente from "@/components/guias/InicioVigente";
import type { InicioGuia } from "@/lib/guias/inicio";
import { horarioLocal } from "@/lib/paises/horarios";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Bloque de conversión editorial integrado al final de la lectura de cada
 * guía: muestra el curso por dentro junto al formulario de 3 campos para abrir
 * al instante el PDF con temario y arancel local.
 */
export default function CursoShowcaseGuia({
  courseSlug,
  iso,
  guiaSlug,
  inicio = null,
}: {
  courseSlug: string;
  iso: string;
  guiaSlug: string;
  /** Próxima cohorte real del curso, fijada al construir el sitio. */
  inicio?: InicioGuia | null;
}) {
  const pais = getPais(iso);
  const lugar = iso === ISO_CHILE ? "Chile" : pais.nombre;
  const curso = getCourseBySlug(courseSlug);

  if (!curso) {
    return (
      <section
        id="temario-curso"
        aria-labelledby="titulo-showcase-general"
        className="mt-12 rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] p-6 sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
          Cursos en vivo · ProgramBI
        </p>
        <h2
          id="titulo-showcase-general"
          className="mt-2 text-2xl font-bold tracking-tight text-[var(--g-ink)]"
        >
          Aprende estas herramientas en vivo con un proyecto real
        </h2>
        <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-[var(--g-muted)]">
          Elige tu ruta entre Power BI, Claude para oficina y datos, SQL Server, Python o el programa completo de
          Análisis de Datos (60 horas). Todas las clases son en vivo por Zoom en horario de {lugar}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={rutaLocal(iso, "/cursos")}
            className="inline-flex min-h-[44px] items-center rounded-lg bg-[var(--g-accent)] px-6 text-sm font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95"
          >
            Explorar cursos en vivo
          </Link>
          <Link
            href={rutaLocal(iso, "/cursos/claude")}
            className="inline-flex min-h-[44px] items-center rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-5 text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
          >
            Curso de Claude
          </Link>
          <Link
            href={rutaLocal(iso, "/cursos/power-bi")}
            className="inline-flex min-h-[44px] items-center rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-5 text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
          >
            Curso de Power BI
          </Link>
        </div>
      </section>
    );
  }

  const ficha = fichaCurso(curso.slug);
  const horario = horarioLocal(iso);
  const rutaCurso = rutaFichaCurso(iso, curso.slug);
  const modulos = offerSyllabusSections(curso, "publico").slice(0, 5);
  const galeria = getCourseGallery(curso.slug).slice(0, 3);
  const profesor = miembroPorCurso(curso.slug);
  const perfilProfesor = rutaPerfil(profesor.slug);

  return (
    <section
      id="temario-curso"
      data-testid="curso-showcase-guia"
      aria-labelledby="titulo-showcase-curso"
      className="mt-12 scroll-mt-24 overflow-hidden rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-surface)]"
    >
      <div className="grid grid-cols-1 gap-8 p-5 sm:p-7 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] tabular-nums text-[var(--g-subtle)]">
              Curso en vivo recomendado · {ficha.horasTexto} · {horario.inicio} a {horario.fin} ({lugar})
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
              <div className="overflow-hidden rounded-lg border border-[var(--g-border)] bg-[var(--g-wash)]">
                <Image
                  src={curso.imageUrl}
                  alt={`Curso en vivo de ${curso.title} en ProgramBI`}
                  width={360}
                  height={203}
                  sizes="(max-width: 640px) 100vw, 180px"
                  className="aspect-video h-auto w-full object-cover"
                />
              </div>
              <div>
                <h2
                  id="titulo-showcase-curso"
                  className="text-2xl font-bold tracking-tight text-[var(--g-ink)]"
                >
                  {curso.title} en vivo
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--g-muted)]">
                  {curso.shortDescription}
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--g-ink)]">
                  <InicioVigente inicio={inicio} prefijo="Próximo inicio: " alterno={OPEN_COHORT_LABEL} /> · Campus
                  virtual con clases y material
                </p>
              </div>
            </div>

            {modulos.length > 0 ? (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
                  Lo que construyes en el programa ({modulos.length} módulos)
                </p>
                <ol className="mt-3 divide-y divide-[var(--g-border)] border-y border-[var(--g-border)]">
                  {modulos.map((mod, index) => (
                    <li key={mod.name} className="flex items-baseline gap-3 py-2.5">
                      <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-[var(--g-accent)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--g-ink)]">{mod.name}</p>
                        {mod.description ? (
                          <p className="mt-0.5 line-clamp-1 text-xs text-[var(--g-muted)]">{mod.description}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <ul className="mt-6 space-y-2">
                {curso.whatYouLearn.slice(0, 4).map((punto) => (
                  <li key={punto} className="flex items-start gap-2 text-sm text-[var(--g-muted)]">
                    <Check size={15} className="mt-0.5 shrink-0 text-[var(--g-accent)]" aria-hidden />
                    <span>{punto}</span>
                  </li>
                ))}
              </ul>
            )}

            {galeria.length > 0 ? (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
                  Capturas reales de clase en vivo
                </p>
                <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                  {galeria.map((foto) => (
                    <div
                      key={foto.src}
                      className="overflow-hidden rounded-lg border border-[var(--g-border)] bg-[var(--g-wash)]"
                    >
                      <Image
                        src={foto.src}
                        alt={`${foto.tool}: ${foto.caption}`}
                        width={1280}
                        height={720}
                        sizes="(max-width: 768px) 30vw, 180px"
                        className="aspect-video h-auto w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--g-border)] pt-5">
            <div className="flex items-center gap-3">
              {profesor.imageUrl ? (
                <Image
                  src={profesor.imageUrl}
                  alt={profesor.nombre}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full border border-[var(--g-border)] object-cover object-[center_18%]"
                />
              ) : null}
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--g-ink)]">
                  Profe:{" "}
                  <Link
                    href={perfilProfesor}
                    className="text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 hover:decoration-[var(--g-accent)]"
                  >
                    {profesor.nombre}
                  </Link>
                </p>
                <p className="text-xs text-[var(--g-muted)]">{profesor.cargo}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={rutaCurso}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)] sm:min-h-[40px]"
              >
                Ver ficha completa
                <ExternalLink size={13} aria-hidden />
              </Link>
              <WhatsAppCta
                page={rutaCurso}
                intent="curso"
                course={curso.title}
                courseSlug={curso.slug}
                country={iso}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)] sm:min-h-[40px]"
              >
                <MessageCircle size={13} aria-hidden />
                WhatsApp
              </WhatsAppCta>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <BrochureGateForm
            slug={curso.slug}
            courseTitle={curso.title}
            pais={iso}
            source={`guia:${guiaSlug}`}
            idPrefix="guia-showcase"
            heading="Desbloquea temario y precios"
            subheading={`Abre el PDF completo con la malla de ${curso.title}, arancel en ${pais.moneda}, cuotas y fechas para ${lugar}.`}
            buttonLabel="Ver temario y precios (PDF)"
            className="bg-[var(--g-bg)]"
          />
        </div>
      </div>
    </section>
  );
}
