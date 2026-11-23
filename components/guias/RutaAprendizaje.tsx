import Link from "next/link";
import { GuiaToolVisual, GuiaVisualBadge } from "@/components/guias/GuiaEditorialPrimitives";
import { RUTA_DATOS, fichaCurso, pasoDeRuta, rutaFichaCurso } from "@/lib/guias/curso";

/**
 * Ruta de aprendizaje visual y táctil (Excel, SQL Server, Power BI, Python,
 * Análisis de datos). Cada paso se presenta como una tarjeta interactiva con
 * su ícono de herramienta, estado de avance y carga horaria.
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
          : "mt-12 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 shadow-[var(--g-card-shadow)] sm:p-6"
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

      <ol className={`${embebido ? "" : "mt-4"} space-y-2.5`}>
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
                className={`group flex min-h-[44px] items-center justify-between gap-4 rounded-2xl border p-3.5 no-underline transition-all hover:-translate-y-0.5 hover:shadow-[var(--g-card-shadow-hover)] sm:p-4 ${
                  actual
                    ? "border-[var(--g-accent)]/35 bg-[var(--g-accent-soft)] shadow-[var(--g-card-shadow)]"
                    : "border-[var(--g-border)] bg-[var(--g-surface)] shadow-[var(--g-card-shadow)] hover:border-[var(--g-border-strong)]"
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <GuiaToolVisual tool={paso.curso} course={paso.curso} size="sm" className="mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold tabular-nums text-[var(--g-subtle)]">
                        {num}
                      </span>
                      <span className="text-sm font-bold text-[var(--g-ink)] group-hover:text-[var(--g-accent)]">
                        {paso.nombre}
                      </span>
                      {actual ? (
                        <GuiaVisualBadge tone="accent">Paso actual</GuiaVisualBadge>
                      ) : hecho ? (
                        <GuiaVisualBadge tone="ok">Base previa</GuiaVisualBadge>
                      ) : null}
                    </div>
                    <span className="mt-1 block text-xs leading-snug text-[var(--g-muted)]">
                      {paso.detalle}
                    </span>
                  </div>
                </div>

                <span className="shrink-0 rounded-lg border border-[var(--g-border)] bg-[var(--g-wash)] px-2.5 py-1 font-mono text-xs font-semibold tabular-nums text-[var(--g-ink)]">
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
