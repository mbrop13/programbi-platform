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
                          {pais === "ar" && curso.slug === "power-bi"
                            ? "curso de Power BI"
                            : pais === "pe" && curso.slug === "power-bi"
                              ? "curso de Power BI en Perú"
                              : pais === "co" && curso.slug === "power-bi"
                                ? "curso de Power BI en Colombia"
                                : curso.title}
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

        {pais === "pe" ? (
          <p className="mt-10 border-t border-line pt-6 text-sm leading-relaxed text-mute">
            Destacados en Perú:{" "}
            <Link href="/pe/cursos/power-bi" className="font-semibold text-ink underline underline-offset-4">
              curso de Power BI en Perú
            </Link>
            {" · "}
            <Link href="/pe/datos" className="font-semibold text-ink underline underline-offset-4">
              Datos de Perú: sueldos por carrera y Excel
            </Link>
            {" · "}
            <Link href="/pe/datos/carreras" className="font-semibold text-ink underline underline-offset-4">
              Carreras mejor pagadas en Perú
            </Link>
            .
          </p>
        ) : null}

        {pais === "co" ? (
          <div className="mt-10 border-t border-line pt-6 text-sm leading-relaxed text-mute">
            <p className="font-semibold text-ink">Recursos y datos de Colombia</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <Link href="/co/cursos/power-bi" className="font-semibold text-ink underline underline-offset-4">
                  curso de Power BI en Colombia
                </Link>
              </li>
              <li>
                <Link href="/co/datos" className="font-semibold text-ink underline underline-offset-4">
                  Datos de Colombia
                </Link>
              </li>
              <li>
                <Link href="/co/datos/carreras" className="font-semibold text-ink underline underline-offset-4">
                  Carreras de datos en Colombia
                </Link>
              </li>
              <li>
                <Link href="/co/guias/prima-de-servicios-excel" className="font-semibold text-ink underline underline-offset-4">
                  Prima de servicios en Excel
                </Link>
              </li>
              <li>
                <Link href="/co/guias/intereses-de-cesantias-excel" className="font-semibold text-ink underline underline-offset-4">
                  Intereses de cesantías en Excel
                </Link>
              </li>
              <li>
                <Link href="/co/guias/cesantias-2026" className="font-semibold text-ink underline underline-offset-4">
                  Cesantías 2026 en Colombia
                </Link>
              </li>
            </ul>
          </div>
        ) : null}

        {pais === "mx" ? (
          <div className="mt-10 border-t border-line pt-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
              Datos y herramientas de México
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li>
                <Link href="/mx/datos" className="font-semibold text-ink underline underline-offset-4 hover:text-mute">
                  Datos laborales de México
                </Link>
              </li>
              <li>
                <Link href="/mx/datos/carreras" className="font-semibold text-ink underline underline-offset-4 hover:text-mute">
                  Carreras y sueldos en México
                </Link>
              </li>
              <li>
                <Link href="/mx/datos/carreras-mejor-pagadas" className="font-semibold text-ink underline underline-offset-4 hover:text-mute">
                  Carreras mejor pagadas en México
                </Link>
              </li>
              <li>
                <Link href="/mx/guias/plantilla-aguinaldo-excel" className="font-semibold text-ink underline underline-offset-4 hover:text-mute">
                  Plantilla de aguinaldo en Excel
                </Link>
              </li>
            </ul>
          </div>
        ) : null}

        {pais === "ar" ? (
          <p className="mt-10 border-t border-line pt-6 text-sm leading-relaxed text-mute">
            Recursos de Argentina:{" "}
            <Link href="/ar/datos" className="font-semibold text-ink underline underline-offset-4">
              Datos de Argentina
            </Link>
            {" · "}
            <Link href="/ar/guias/calcular-aguinaldo-excel" className="font-semibold text-ink underline underline-offset-4">
              Cómo calcular el aguinaldo en Excel
            </Link>
            .
          </p>
        ) : null}

        {pais === "us" ? (
          <p className="mt-10 border-t border-line pt-6 text-sm leading-relaxed text-mute">
            ¿Vives en el sur de Florida?{" "}
            <Link href="/us/miami" className="font-semibold text-ink underline underline-offset-4">
              Cursos de datos en español en Miami
            </Link>
            {" · "}
            <Link href="/us/empresas" className="font-semibold text-ink underline underline-offset-4">
              Capacitación para empresas
            </Link>
            .
          </p>
        ) : null}

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
