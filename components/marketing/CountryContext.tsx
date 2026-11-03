import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { getPais } from "@/config/paises";
import type { ContenidoPais } from "@/lib/data/contenido-paises/tipos";
import { horarioLocal } from "@/lib/paises/horarios";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Contexto local reutilizable para las páginas internas del país: catálogo,
 * guías comerciales y empresas. Usa el ejemplo, el horario real de la cohorte,
 * la moneda y las referencias propias de `lib/data/contenido-paises`.
 */
export default function CountryContext({
  contenido,
  titulo,
}: {
  contenido: ContenidoPais;
  titulo?: string;
}) {
  const pais = getPais(contenido.iso);
  const horario = horarioLocal(pais.iso);
  const hrefCursos = rutaLocal(pais.iso, "/cursos");

  return (
    <section className="border-t border-line px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1100px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Contexto local · {pais.nombre}
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-[26ch] text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {titulo ?? `Cómo se trabaja el dato en ${pais.nombre}`}
          </h2>
          <Link
            href={hrefCursos}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline"
          >
            Ver cursos
            <ArrowRight size={14} />
          </Link>
        </div>
        <p className="mt-4 max-w-[72ch] text-base leading-relaxed text-mute">
          {contenido.mercado.ejemplo}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-line bg-paper p-5">
            <span className="flex size-9 items-center justify-center rounded-full border border-line bg-canvas text-ink">
              <CalendarClock size={16} />
            </span>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-mute">
              Horario de clases
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-ink tabular-nums">
              {horario.inicio} a {horario.fin} · {pais.nombre}
            </p>
            <p className="mt-1 text-xs text-faint tabular-nums">
              {horario.inicioChile} a {horario.finChile} en Chile · {horario.offset}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-mute">{contenido.mercado.horario}</p>
          </article>

          <article className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
              Moneda y pagos
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
              Precios en {pais.moneda}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-mute">{contenido.moneda.resumen}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {pais.mediosPago.map((medio) => (
                <li
                  key={medio}
                  className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[11px] text-mute"
                >
                  {medio}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">Facturación</p>
            <p className="mt-2 text-xs leading-relaxed text-mute">{contenido.mercado.facturacion}</p>
          </article>
        </div>

        <div className="mt-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
            Referencias locales
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {contenido.referencias.map((referencia) => (
              <li
                key={referencia.nombre}
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink"
                title={referencia.detalle}
              >
                {referencia.nombre}
              </li>
            ))}
          </ul>
          <p className="mt-3 max-w-[72ch] text-xs leading-relaxed text-faint">
            Fuentes públicas y sistemas habituales del mercado. Son referencias para practicar con
            estructuras parecidas a las de tu trabajo, no casos de clientes.
          </p>
        </div>
      </div>
    </section>
  );
}
