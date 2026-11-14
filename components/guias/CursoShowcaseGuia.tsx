import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink, GraduationCap, MessageCircle } from "lucide-react";
import { BrochureGateForm } from "@/components/marketing/BrochureGateForm";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getPais, ISO_CHILE } from "@/config/paises";
import { getCourseGallery } from "@/lib/data/course-gallery";
import { OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
import { offerSyllabusSections } from "@/lib/data/course-views";
import { getCourseBySlug } from "@/lib/data/courses";
import { miembroPorCurso, rutaPerfil } from "@/lib/data/equipo";
import { fichaCurso, rutaFichaCurso } from "@/lib/guias/curso";
import { horarioLocal } from "@/lib/paises/horarios";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Bloque de conversión editorial integrado al final de la lectura de cada
 * guía: muestra el curso por dentro (portada, módulos reales, capturas de
 * clases reales cuando existen, perfil del profesor) junto al formulario de
 * 3 campos para abrir al instante el PDF con temario y arancel local.
 * Sin montos en HTML inicial: cumple al 100% la arquitectura Gate PDF.
 */
export default function CursoShowcaseGuia({
  courseSlug,
  iso,
  guiaSlug,
}: {
  courseSlug: string;
  iso: string;
  guiaSlug: string;
}) {
  const pais = getPais(iso);
  const lugar = iso === ISO_CHILE ? "Chile" : pais.nombre;
  const curso = getCourseBySlug(courseSlug);

  if (!curso) {
    return (
      <section
        id="temario-curso"
        aria-labelledby="titulo-showcase-general"
        className="mt-12 rounded-[28px] border border-line-strong bg-paper p-6 shadow-sm sm:p-8"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Cursos en vivo · ProgramBI</p>
        <h2 id="titulo-showcase-general" className="mt-2 text-2xl font-bold tracking-tight text-ink">
          Aprende estas herramientas en vivo con un proyecto real
        </h2>
        <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-mute">
          Elige tu ruta entre Power BI, Claude para oficina y datos, SQL Server, Python o el programa completo de
          Análisis de Datos (60 horas). Todas las clases son en vivo por Zoom en horario de {lugar}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={rutaLocal(iso, "/cursos")}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
          >
            Explorar cursos en vivo <ArrowRight size={15} aria-hidden />
          </Link>
          <Link
            href={rutaLocal(iso, "/cursos/claude")}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-canvas px-5 text-sm font-semibold text-ink no-underline hover:bg-wash"
          >
            Curso de Claude
          </Link>
          <Link
            href={rutaLocal(iso, "/cursos/power-bi")}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-canvas px-5 text-sm font-semibold text-ink no-underline hover:bg-wash"
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
      className="mt-12 scroll-mt-24 overflow-hidden rounded-[28px] border border-line-strong bg-paper shadow-sm"
    >
      <div className="grid grid-cols-1 gap-8 p-5 sm:p-7 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-wash px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                <GraduationCap size={13} aria-hidden /> Curso en vivo recomendado
              </span>
              <span className="text-xs font-medium text-mute">
                {ficha.horasTexto} · {horario.inicio}–{horario.fin} ({lugar})
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
              <div className="overflow-hidden rounded-2xl border border-line bg-wash">
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
                <h2 id="titulo-showcase-curso" className="text-2xl font-bold tracking-tight text-ink">
                  {curso.title} en vivo
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-mute">{curso.shortDescription}</p>
                <p className="mt-2 text-xs font-medium text-ink">
                  {ficha.inicio ? `Próximo inicio: ${ficha.inicio}` : OPEN_COHORT_LABEL} · Grabaciones de por vida
                </p>
              </div>
            </div>

            {modulos.length > 0 ? (
              <div className="mt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mute">
                  Lo que construyes en el programa ({modulos.length} módulos)
                </p>
                <ol className="mt-3 space-y-2">
                  {modulos.map((mod, index) => (
                    <li
                      key={mod.name}
                      className="flex items-start gap-3 rounded-2xl border border-line bg-canvas/80 px-3.5 py-2.5"
                    >
                      <span
                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-canvas"
                        style={{ backgroundColor: curso.accentColor === "#F2C811" ? "#171716" : curso.accentColor }}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-ink">{mod.name}</p>
                        {mod.description ? (
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-mute">{mod.description}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <ul className="mt-6 space-y-2">
                {curso.whatYouLearn.slice(0, 4).map((punto) => (
                  <li key={punto} className="flex items-start gap-2 text-sm text-mute">
                    <Check size={15} className="mt-0.5 shrink-0 text-ink" aria-hidden />
                    <span>{punto}</span>
                  </li>
                ))}
              </ul>
            )}

            {galeria.length > 0 ? (
              <div className="mt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mute">
                  Capturas reales de clase en vivo
                </p>
                <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                  {galeria.map((foto) => (
                    <div key={foto.src} className="overflow-hidden rounded-xl border border-line bg-wash">
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

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <div className="flex items-center gap-3">
              {profesor.imageUrl ? (
                <Image
                  src={profesor.imageUrl}
                  alt={profesor.nombre}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full border border-line object-cover object-[center_18%]"
                />
              ) : null}
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink">
                  Profe:{" "}
                  <Link href={perfilProfesor} className="underline decoration-line-strong underline-offset-4">
                    {profesor.nombre}
                  </Link>
                </p>
                <p className="text-[11px] text-mute">{profesor.cargo}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={rutaCurso}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong bg-canvas px-4 text-xs font-semibold text-ink no-underline hover:bg-wash"
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
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong bg-canvas px-4 text-xs font-semibold text-ink no-underline hover:bg-wash"
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
            className="bg-canvas"
          />
        </div>
      </div>
    </section>
  );
}
