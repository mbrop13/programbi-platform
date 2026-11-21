import Link from "next/link";
import { Database } from "lucide-react";
import { getPais } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import type { ContenidoPais } from "@/lib/data/contenido-paises/tipos";
import { horarioLocal } from "@/lib/paises/horarios";
import { rutaLocal } from "@/lib/paises/rutas";
import { courseBrochurePath } from "@/lib/pricing-gate";

/**
 * Bloque de contenido local de la home. Solo se renderiza en los países que
 * tienen archivo propio en `lib/data/contenido-paises`.
 */
export default function CountryContent({ contenido }: { contenido: ContenidoPais }) {
  const pais = getPais(contenido.iso);
  const hrefCursos = rutaLocal(pais.iso, "/cursos");
  const hrefFaq = rutaLocal(pais.iso, "/preguntas-frecuentes");
  const horario = horarioLocal(pais.iso);

  return (
    <>
      <section className="home-scope cv-auto border-t border-[var(--h-border)] bg-[var(--h-bg)] py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16 lg:px-8 xl:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--h-subtle)]">
              {contenido.intro.kicker}
            </p>
            <h2 className="mt-3 max-w-[20ch] text-balance text-3xl font-bold leading-[1.15] tracking-tight text-[var(--h-ink)] sm:text-4xl lg:text-5xl">
              {contenido.intro.titulo}
            </h2>
          </div>

          <div>
            <div className="space-y-4 text-base leading-relaxed text-[var(--h-muted)] sm:text-lg">
              {contenido.intro.parrafos.map((parrafo) => (
                <p key={parrafo}>{parrafo}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={hrefCursos}
                className="inline-flex min-h-[44px] items-center rounded-lg bg-[var(--h-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--h-surface)] no-underline transition-opacity hover:opacity-90"
              >
                Ver cursos en {pais.nombre}
              </Link>
              <Link
                href={hrefFaq}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-[var(--h-border-strong)] bg-[var(--h-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--h-ink)] no-underline transition-colors hover:border-[var(--h-ink)]"
              >
                Preguntas frecuentes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-scope cv-auto border-t border-[var(--h-border)] bg-[var(--h-wash)] py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="max-w-[46rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--h-subtle)]">
              Casos de uso por industria
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--h-ink)] sm:text-4xl lg:text-5xl">
              Dónde se aplica lo que enseñas
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--h-muted)]">
              Escenarios de trabajo típicos de {pais.nombre}. No son casos de clientes ni cifras de
              resultados: son ejercicios para practicar con la lógica de cada industria.
            </p>
          </div>

          <ol className="mt-10 grid grid-cols-1 border-t border-[var(--h-border-strong)] md:grid-cols-2 md:gap-x-10">
            {contenido.casos.map((caso, i) => (
              <li
                key={caso.titulo}
                className="flex items-start gap-4 border-b border-[var(--h-border)] py-6"
              >
                <span className="mt-0.5 shrink-0 font-mono text-xs font-semibold tabular-nums text-[var(--h-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <article className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                    {caso.sector}
                  </p>
                  <h3 className="mt-1.5 text-xl font-bold tracking-tight text-[var(--h-ink)]">
                    {caso.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">
                    {caso.descripcion}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--h-subtle)]">
                    <span className="font-semibold text-[var(--h-muted)]">Datos de partida:</span>{" "}
                    {caso.fuente}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-scope cv-auto border-t border-[var(--h-border)] bg-[var(--h-bg)] py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 xl:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--h-subtle)]">
              Moneda y pagos
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--h-ink)] sm:text-4xl">
              {contenido.moneda.titulo}
            </h2>
            <p className="mt-4 max-w-[42rem] text-base leading-relaxed text-[var(--h-muted)]">
              {contenido.moneda.resumen}
            </p>

            <div className="mt-6 max-w-[36rem] divide-y divide-[var(--h-border)] rounded-xl border border-[var(--h-border)] bg-[var(--h-surface)]">
              <div className="p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                      Horario de clases
                    </p>
                    <p className="mt-1.5 text-2xl font-bold tracking-tight text-[var(--h-ink)] tabular-nums">
                      {horario.inicio} a {horario.fin}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--h-muted)]">
                    hora de {pais.nombre} · {horario.offset}
                  </p>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-[var(--h-subtle)]">
                  {horario.inicioChile} a {horario.finChile} en Chile. {contenido.mercado.horario}
                </p>
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                  Curso Power BI
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">
                  {textoCuotas(pais.iso)
                    ? `El arancel vigente de tu país, los descuentos y las ${textoCuotas(pais.iso)} están en el PDF de temario y precios del curso.`
                    : "El arancel vigente de tu país y los descuentos están en el PDF de temario y precios del curso."}
                </p>
                <Link
                  href={courseBrochurePath("power-bi", pais.iso)}
                  className="mt-4 inline-flex min-h-[44px] items-center rounded-lg bg-[var(--h-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--h-surface)] no-underline transition-opacity hover:opacity-90"
                >
                  Ver temario y precios (PDF)
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                Medios de pago
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {pais.mediosPago.map((medio) => (
                  <li
                    key={medio}
                    className="rounded-md border border-[var(--h-border)] bg-[var(--h-surface)] px-3 py-1.5 text-xs font-medium text-[var(--h-muted)]"
                  >
                    {medio}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 max-w-[42rem] text-xs leading-relaxed text-[var(--h-subtle)]">
              {contenido.moneda.nota}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--h-subtle)]">
              Referencias locales
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--h-ink)] sm:text-4xl">
              Los datos que ya existen en {pais.nombre}
            </h2>
            <p className="mt-4 max-w-[42rem] text-base leading-relaxed text-[var(--h-muted)]">
              Fuentes públicas y sistemas habituales del mercado. Sirven para practicar con
              estructuras parecidas a las que vas a encontrar en tu trabajo.
            </p>

            <ul className="mt-6 divide-y divide-[var(--h-border)] border-y border-[var(--h-border)]">
              {contenido.referencias.map((referencia) => (
                <li key={referencia.nombre} className="flex gap-4 py-4">
                  <span
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--h-border)] bg-[var(--h-surface)] text-[var(--h-ink)]"
                    aria-hidden
                  >
                    <Database size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--h-ink)]">{referencia.nombre}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--h-muted)]">
                      {referencia.detalle}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
