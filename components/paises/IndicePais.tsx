import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      className="cv-auto border-t border-line bg-wash/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Índice de {info.nombre}
        </p>
        <h2
          id="indice-pais"
          className="mt-3 max-w-[30ch] text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Todas las fichas y guías de {info.nombre}
        </h2>
        <p className="mt-4 max-w-[70ch] text-sm leading-relaxed text-mute">
          Cada curso tiene su ficha con precio en {info.moneda}, horario en hora local y
          preguntas del mercado. Las guías profundizan en el mismo tema con ejemplos y
          ejercicios.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-lg font-bold tracking-tight text-ink">Fichas de curso</h3>
              <Link
                href={rutaLocal(pais, "/cursos")}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
              >
                Ver el catálogo
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>

            <div className="mt-5 space-y-6">
              {grupos.map((grupo) => (
                <div key={grupo.id}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                    {grupo.label}
                  </p>
                  <ul className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {grupo.cursos.map((curso) => (
                      <li key={curso.slug}>
                        <Link
                          href={rutaLocal(pais, `/cursos/${curso.slug}`)}
                          className="text-sm leading-snug text-ink no-underline underline-offset-4 hover:text-mute hover:underline"
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
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-lg font-bold tracking-tight text-ink">
                Guías de {info.nombre}
              </h3>
              <Link
                href={indiceGuias(pais)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
              >
                Ver el índice de guías
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>

            {guias.length > 0 ? (
              <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {guias.map((guia) => (
                  <li key={guia.path}>
                    <Link
                      href={guia.path}
                      className="text-sm leading-snug text-ink no-underline underline-offset-4 hover:text-mute hover:underline"
                    >
                      {guia.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-mute">
                Todavía no hay guías publicadas para {info.nombre}. El material de estudio
                general está en{" "}
                <Link href="/guias" className="font-semibold text-ink underline underline-offset-4">
                  el índice de guías
                </Link>
                .
              </p>
            )}
          </div>
        </div>

        {pais !== ISO_CHILE ? (
          <p className="mt-10 border-t border-line pt-6 text-sm leading-relaxed text-mute">
            ¿Buscas la versión chilena?{" "}
            <Link
              href={rutaLocal(ISO_CHILE, "/cursos")}
              className="font-semibold text-ink underline underline-offset-4"
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
