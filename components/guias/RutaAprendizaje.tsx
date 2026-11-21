import Link from "next/link";
import { RUTA_DATOS, fichaCurso, pasoDeRuta, rutaFichaCurso } from "@/lib/guias/curso";

/**
 * Ruta de aprendizaje editorial (Excel, SQL Server, Power BI, Python,
 * Análisis de datos). Lista limpia con divisores finos e índices tabulares.
 */
export default function RutaAprendizaje({
  iso,
  cursoActual,
  embebido = false,
}: {
  iso: string;
  cursoActual: string;
  /** Dentro del bloque «Resumen visual»: sin tarjeta ni título visible propios. */
  embebido?: boolean;
}) {
  const indice = pasoDeRuta(cursoActual);
  if (indice < 0) return null;

  return (
    <nav
      aria-labelledby="ruta-aprendizaje"
      data-testid="ruta-aprendizaje"
      className={
        embebido
          ? "rounded-none border-0 bg-transparent p-0"
          : "mt-12 rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] px-5 py-6"
      }
    >
      {embebido ? (
        <h3 id="ruta-aprendizaje" className="sr-only">
          Ruta de aprendizaje
        </h3>
      ) : (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="ruta-aprendizaje"
            className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]"
          >
            Ruta de aprendizaje
          </h2>
          <p className="text-xs text-[var(--g-muted)]">Cada paso es un curso en vivo, por separado</p>
        </div>
      )}

      <ol
        className={`${
          embebido ? "" : "mt-4"
        } divide-y divide-[var(--g-border)] border-y border-[var(--g-border)]`}
      >
        {RUTA_DATOS.map((paso, i) => {
          const actual = i === indice;
          const hecho = i < indice;
          const ficha = fichaCurso(paso.curso);
          const num = String(i + 1).padStart(2, "0");

          return (
            <li key={paso.curso}>
              <Link
                href={rutaFichaCurso(iso, paso.curso)}
                aria-current={actual ? "step" : undefined}
                className={`flex min-h-[44px] items-baseline justify-between gap-4 px-2 py-3 no-underline transition-colors ${
                  actual ? "bg-[var(--g-accent-soft)]" : "hover:bg-[var(--g-wash)]"
                }`}
              >
                <div className="flex min-w-0 items-baseline gap-3">
                  <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-[var(--g-subtle)]">
                    {num}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-[var(--g-ink)]">{paso.nombre}</span>
                    {actual ? (
                      <span className="ml-2 text-xs font-semibold text-[var(--g-accent)]">
                        (Paso actual)
                      </span>
                    ) : hecho ? (
                      <span className="ml-2 text-xs text-[var(--g-subtle)]">(Anterior)</span>
                    ) : null}
                    <span className="mt-0.5 block text-xs leading-snug text-[var(--g-muted)]">
                      {paso.detalle}
                    </span>
                  </div>
                </div>

                <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-[var(--g-subtle)]">
                  {ficha.horas != null ? `${ficha.horas} h` : "Ver"}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-xs leading-relaxed text-[var(--g-muted)]">
        No necesitas hacerlos todos: la ruta completa es la del analista de datos. Si ya usas Excel, parte en SQL; si ya
        consultas bases, parte en Power BI.
      </p>
    </nav>
  );
}
