import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Testimonios from "@/components/marketing/Testimonios";
import { courses } from "@/lib/data/courses";
import {
  TESTIMONIOS_PUBLICADOS,
  testimoniosDeCurso,
  testimoniosSinCurso,
} from "@/lib/data/testimonials";
import { absoluteUrl, jsonLdString, pageOg, tituloSeo } from "@/lib/seo";

const TITULO = "Testimonios de alumnos de ProgramBI";
const DESCRIPCION =
  "Citas textuales y verificables de alumnos que terminaron los cursos de Power BI, SQL Server, Python y Análisis de Datos en ProgramBI, sin ediciones ni métricas inventadas.";

const share = pageOg({
  title: `${TITULO} | ProgramBI`,
  description: DESCRIPCION,
  path: "/casos",
  kicker: "Testimonios de alumnos",
  tags: ["Power BI", "SQL", "Python", "Análisis de datos"],
});

export const metadata: Metadata = {
  title: { absolute: tituloSeo(TITULO) },
  description: DESCRIPCION,
  alternates: { canonical: absoluteUrl("/casos") },
  // Kill-switch: con NEXT_PUBLIC_TESTIMONIOS="0" la página sigue respondiendo
  // 200, pero no se indexa.
  ...(TESTIMONIOS_PUBLICADOS ? {} : { robots: { index: false, follow: true } }),
  openGraph: {
    title: `${TITULO} | ProgramBI`,
    description: DESCRIPCION,
    url: absoluteUrl("/casos"),
    type: "website",
    locale: "es_CL",
    images: share.images,
  },
  twitter: share.twitter,
};

export default function CasosPage() {
  // Un solo grupo por curso con citas atribuibles; el resto va a «Otros».
  const grupos = courses
    .map((curso) => ({
      curso,
      testimonios: testimoniosDeCurso(curso.slug),
    }))
    .filter((grupo) => grupo.testimonios.length > 0);
  const otros = testimoniosSinCurso();

  // Sin Review ni AggregateRating ni ItemList de demostración: el índice
  // declara únicamente la colección de testimonios reales de alumnos.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl("/casos")}#collection`,
        name: TITULO,
        description: DESCRIPCION,
        url: absoluteUrl("/casos"),
        inLanguage: "es-CL",
        isPartOf: { "@type": "WebSite", name: "ProgramBI", url: absoluteUrl("/") },
      },
    ],
  };

  return (
    <div className="bg-canvas px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />

      <div className="mx-auto max-w-[1120px]">
        <nav aria-label="Migas de pan" className="text-xs text-mute">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="no-underline hover:text-ink">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink">Testimonios</li>
          </ol>
        </nav>

        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Testimonios
        </p>
        <h1 className="mt-2 max-w-[24ch] text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
          {TITULO}
        </h1>
        <p className="mt-5 max-w-[64ch] text-base leading-relaxed text-mute">
          {TESTIMONIOS_PUBLICADOS
            ? "Citas textuales y verificables de alumnos que terminaron un curso de ProgramBI. Las publicaron ellos en LinkedIn y aquí aparecen tal cual, con su nombre y el programa que cursaron: sin ediciones, sin métricas inventadas ni puntuaciones."
            : "Los testimonios verificados de alumnos están desactivados en este momento. Puedes revisar el catálogo de cursos o las opciones de capacitación para empresas."}
        </p>

        {TESTIMONIOS_PUBLICADOS ? (
          <>
            {grupos.length > 0 ? (
              <nav
                aria-labelledby="indice-testimonios"
                className="mt-10 rounded-2xl border border-line bg-paper px-5 py-5"
              >
                <h2
                  id="indice-testimonios"
                  className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute"
                >
                  Testimonios por curso
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {grupos.map(({ curso, testimonios }) => (
                    <li key={curso.slug}>
                      <Link
                        href={`#testimonios-${curso.slug}`}
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-canvas px-3.5 text-[13px] font-medium text-ink no-underline transition-colors hover:border-ink/30"
                      >
                        {curso.title}
                        <span className="rounded-full bg-wash px-2 py-0.5 text-[11px] font-semibold text-mute">
                          {testimonios.length}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {grupos.map(({ curso, testimonios }) => (
              <section
                key={curso.slug}
                aria-labelledby={`testimonios-${curso.slug}`}
                className="mt-14 scroll-mt-24 border-t border-line pt-10"
              >
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Curso</p>
                    <h2
                      id={`testimonios-${curso.slug}`}
                      className="mt-1 text-2xl font-bold tracking-tight text-ink"
                    >
                      {curso.title}
                    </h2>
                  </div>
                  <Link
                    href={`/cursos/${curso.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline"
                  >
                    Ver ficha del curso
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </div>
                <div className="mt-5">
                  <Testimonios testimonios={testimonios} testId={`testimonios-${curso.slug}`} />
                </div>
              </section>
            ))}

            {otros.length > 0 ? (
              <section aria-labelledby="testimonios-otros" className="mt-14 border-t border-line pt-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Otros programas</p>
                <h2 id="testimonios-otros" className="mt-1 text-2xl font-bold tracking-tight text-ink">
                  Otros alumnos
                </h2>
                <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-mute">
                  Testimonios de alumnos cuyo rol no permite atribuir la cita a una ficha concreta.
                </p>
                <div className="mt-5">
                  <Testimonios testimonios={otros} testId="testimonios-otros" />
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <section className="mt-12 rounded-2xl border border-line bg-paper px-6 py-8">
            <h2 className="text-xl font-bold tracking-tight text-ink">Testimonios no publicados</h2>
            <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-mute">
              Los testimonios están desactivados en este momento. Puedes revisar el catálogo de cursos,
              sus temarios y las opciones de capacitación para empresas mientras tanto.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link
                href="/cursos"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline"
              >
                Ver todos los cursos
                <ArrowRight size={14} aria-hidden />
              </Link>
              <Link
                href="/empresas"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-mute no-underline hover:text-ink"
              >
                Capacitación para empresas
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </section>
        )}

        <section className="mt-16 rounded-3xl border border-line bg-paper px-6 py-8 sm:px-10">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            ¿Quieres aprender con la misma metodología?
          </h2>
          <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-mute">
            Cada ficha de curso tiene temario, horarios en vivo y precio vigente para tu país, o
            puedes cotizar un programa cerrado para tu equipo.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/cursos"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-canvas no-underline transition-opacity hover:opacity-85"
            >
              Ver todos los cursos
              <ArrowRight size={14} aria-hidden />
            </Link>
            <Link
              href="/empresas"
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-canvas px-5 py-2.5 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
            >
              Capacitación para empresas
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
