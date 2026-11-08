import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import { getPais } from "@/config/paises";
import type { ContenidoPais } from "@/lib/data/contenido-paises/tipos";
import { horarioLocal } from "@/lib/paises/horarios";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Bloque de contenido local de la home. Solo se renderiza en los países que
 * tienen archivo propio en `lib/data/contenido-paises`.
 */
export default function CountryContent({ contenido }: { contenido: ContenidoPais }) {
  const pais = getPais(contenido.iso);
  const hrefCursos = rutaLocal(pais.iso, "/cursos");
  const hrefFaq = rutaLocal(pais.iso, "/faq");
  const horario = horarioLocal(pais.iso);

  return (
    <>
      <section className="cv-auto border-t border-line py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16 lg:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
              {contenido.intro.kicker}
            </p>
            <h2 className="mt-4 max-w-[20ch] text-balance text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {contenido.intro.titulo}
            </h2>
          </div>

          <div>
            <div className="space-y-4 text-base leading-relaxed text-mute sm:text-lg">
              {contenido.intro.parrafos.map((parrafo) => (
                <p key={parrafo}>{parrafo}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={hrefCursos}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-canvas no-underline transition-opacity hover:opacity-90"
              >
                Ver cursos
                <ArrowRight size={16} />
              </Link>
              <Link
                href={hrefFaq}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-3 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
              >
                Preguntas frecuentes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="cv-auto border-t border-line bg-wash/30 py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[46rem]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
              Casos de uso por industria
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Dónde se aplica lo que enseñas
            </h2>
            <p className="mt-4 text-base leading-relaxed text-mute">
              Escenarios de trabajo típicos de {pais.nombre}. No son casos de clientes ni cifras de
              resultados: son ejercicios para practicar con la lógica de cada industria.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {contenido.casos.map((caso, i) => (
              <article
                key={caso.titulo}
                className="rounded-[26px] border border-line bg-paper p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                    {caso.sector}
                  </p>
                  <span className="text-xs tabular-nums text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">{caso.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{caso.descripcion}</p>
                <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-faint">
                  <span className="font-semibold text-mute">Datos de partida:</span> {caso.fuente}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cv-auto border-t border-line py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
              Moneda y pagos
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {contenido.moneda.titulo}
            </h2>
            <p className="mt-4 max-w-[42rem] text-base leading-relaxed text-mute">
              {contenido.moneda.resumen}
            </p>

            <div className="mt-6 max-w-[34rem] rounded-2xl border border-line bg-paper p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                    Horario de clases
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-ink tabular-nums">
                    {horario.inicio} a {horario.fin}
                  </p>
                </div>
                <p className="text-sm text-mute">
                  hora de {pais.nombre} · {horario.offset}
                </p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-faint">
                {horario.inicioChile} a {horario.finChile} en Chile. {contenido.mercado.horario}
              </p>
            </div>

            <div className="mt-6 max-w-[34rem] rounded-2xl border border-line bg-paper p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                Curso Power BI
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                El arancel vigente de tu país, los descuentos y las 3 cuotas sin interés están en
                el brochure PDF del curso.
              </p>
              <Link
                href={rutaLocal(pais.iso, "/cursos/power-bi/brochure")}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-canvas no-underline"
              >
                Ver precios en el brochure PDF
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                Medios de pago
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {pais.mediosPago.map((medio) => (
                  <li
                    key={medio}
                    className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-mute"
                  >
                    {medio}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 max-w-[42rem] text-xs leading-relaxed text-faint">
              {contenido.moneda.nota}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
              Referencias locales
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Los datos que ya existen en {pais.nombre}
            </h2>
            <p className="mt-4 max-w-[42rem] text-base leading-relaxed text-mute">
              Fuentes públicas y sistemas habituales del mercado. Sirven para practicar con
              estructuras parecidas a las que vas a encontrar en tu trabajo.
            </p>

            <ul className="mt-6 divide-y divide-line border-y border-line">
              {contenido.referencias.map((referencia) => (
                <li key={referencia.nombre} className="flex gap-4 py-4">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink">
                    <Database size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{referencia.nombre}</p>
                    <p className="mt-1 text-sm leading-relaxed text-mute">{referencia.detalle}</p>
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
