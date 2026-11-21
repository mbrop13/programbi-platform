import Link from "next/link";
import { getPais, ISO_CHILE } from "@/config/paises";
import { courses } from "@/lib/data/courses";
import { COURSE_FILTER_GROUPS } from "@/lib/data/course-nav";
import { guiasDePais, indiceGuias } from "@/lib/guias";
import { esGuiaPublicada } from "@/lib/guias/relacionadas";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Índice del mercado para la home de cada país: todas las fichas de curso y
 * todas las guías publicadas de ese mercado, en un solo bloque de enlaces
 * visibles y con el nombre real de cada página.
 *
 * El catálogo de la home muestra seis tarjetas y despliega el resto con
 * JavaScript; este índice deja las trece fichas en el HTML inicial, que es lo
 * que necesitan el rastreo y el enlazado interno. También sirve a Chile, donde
 * la portada es la raíz del sitio.
 */
export default function IndicePais({ pais }: { pais: string }) {
  const info = getPais(pais);
  const guias = guiasDePais(pais).filter(esGuiaPublicada);
  const grupos = COURSE_FILTER_GROUPS.map((grupo) => ({
    id: grupo.id,
    label: grupo.label,
    cursos: courses.filter((curso) => grupo.slugs.includes(curso.slug)),
  })).filter((grupo) => grupo.cursos.length > 0);

  return (
    <section
      aria-labelledby="indice-pais"
      className="home-scope cv-auto border-t border-[var(--h-border)] bg-[var(--h-surface)] py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--h-subtle)]">
              Índice de {info.nombre}
            </p>
            <h2
              id="indice-pais"
              className="mt-2.5 max-w-[30ch] text-balance text-2xl font-bold tracking-tight text-[var(--h-ink)] sm:text-3xl"
            >
              Todas las fichas y guías de {info.nombre}
            </h2>
          </div>
          <p className="max-w-[54ch] text-sm leading-relaxed text-[var(--h-muted)] lg:col-span-5">
            Cada curso tiene su ficha con precio en {info.moneda}, horario en hora local y
            preguntas del mercado. Las guías profundizan en el mismo tema con ejemplos y
            ejercicios.
          </p>
        </div>

        <div className="mt-10 grid gap-10 border-t border-[var(--h-border)] pt-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--h-border)] pb-3">
              <h3 className="text-lg font-bold tracking-tight text-[var(--h-ink)]">
                Fichas de curso
              </h3>
              <Link
                href={rutaLocal(pais, "/cursos")}
                className="text-sm font-semibold text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
              >
                Ver el catálogo
              </Link>
            </div>

            <div className="mt-6 space-y-6">
              {grupos.map((grupo) => (
                <div key={grupo.id}>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                    {grupo.label}
                  </p>
                  <ul className="mt-2.5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {grupo.cursos.map((curso) => (
                      <li key={curso.slug}>
                        <Link
                          href={rutaLocal(pais, `/cursos/${curso.slug}`)}
                          className="text-sm leading-snug text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
                        >
                          {curso.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--h-border)] pb-3">
              <h3 className="text-lg font-bold tracking-tight text-[var(--h-ink)]">
                Guías de {info.nombre}
              </h3>
              <Link
                href={indiceGuias(pais)}
                className="text-sm font-semibold text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
              >
                Ver el índice de guías
              </Link>
            </div>

            {guias.length > 0 ? (
              <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {guias.map((guia) => (
                  <li key={guia.path}>
                    <Link
                      href={guia.path}
                      className="text-sm leading-snug text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
                    >
                      {guia.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm leading-relaxed text-[var(--h-muted)]">
                Todavía no hay guías publicadas para {info.nombre}. El material de estudio general
                está en{" "}
                <Link
                  href="/guias"
                  className="font-semibold text-[var(--h-ink)] underline underline-offset-4 hover:text-[var(--h-accent)]"
                >
                  el índice de guías
                </Link>
                .
              </p>
            )}
          </div>
        </div>

        {pais === "us" ? (
          <p className="mt-10 border-t border-[var(--h-border)] pt-6 text-sm leading-relaxed text-[var(--h-muted)]">
            ¿Vives en el sur de Florida?{" "}
            <Link
              href="/us/miami"
              className="font-semibold text-[var(--h-ink)] underline underline-offset-4 hover:text-[var(--h-accent)]"
            >
              Cursos de datos en español en Miami
            </Link>
            {" · "}
            <Link
              href="/us/empresas"
              className="font-semibold text-[var(--h-ink)] underline underline-offset-4 hover:text-[var(--h-accent)]"
            >
              Capacitación para empresas
            </Link>
            .
          </p>
        ) : null}

        {pais !== ISO_CHILE ? (
          <p className="mt-10 border-t border-[var(--h-border)] pt-6 text-sm leading-relaxed text-[var(--h-muted)]">
            ¿Buscas la versión chilena?{" "}
            <Link
              href={rutaLocal(ISO_CHILE, "/cursos")}
              className="font-semibold text-[var(--h-ink)] underline underline-offset-4 hover:text-[var(--h-accent)]"
              hrefLang="es-CL"
            >
              Ver los cursos en Chile
            </Link>
            .
          </p>
        ) : null}
      </div>
    </section>
  );
}
