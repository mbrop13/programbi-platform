/**
 * Tabla comparativa responsive: curso en vivo vs autodidacta vs universidad.
 *
 * En escritorio es una tabla elevada con la columna «curso en vivo» destacada;
 * en mobile se convierte en tarjetas táctiles apiladas por criterio.
 */
import Link from "next/link";
import { FileText } from "lucide-react";
import { GuiaVisualBadge } from "@/components/guias/GuiaEditorialPrimitives";

export type FilaComparativa = {
  criterio: string;
  enVivo: string;
  autodidacta: string;
  universidad: string;
};

export default function TablaComparativa({
  titulo = "Curso en vivo vs. aprender solo vs. universidad",
  subtitulo = "Lo que cambia, en la práctica",
  filas,
  nota,
  brochureHref,
  embebido = false,
}: {
  titulo?: string;
  subtitulo?: string;
  filas: FilaComparativa[];
  nota?: string;
  /** Ruta del brochure PDF del curso, para consultar el arancel. */
  brochureHref?: string;
  /** Dentro del bloque «Resumen visual»: sin margen ni encabezado visibles. */
  embebido?: boolean;
}) {
  return (
    <section
      aria-labelledby="tabla-comparativa"
      data-testid="tabla-comparativa"
      className={embebido ? "" : "mt-12"}
    >
      {embebido ? (
        <h3 id="tabla-comparativa" className="sr-only">
          {titulo}
        </h3>
      ) : (
        <>
          <h2
            id="tabla-comparativa"
            className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]"
          >
            {subtitulo}
          </h2>
          <p className="mt-1 text-xl font-bold tracking-tight text-[var(--g-ink)]">{titulo}</p>
        </>
      )}

      {/* Escritorio */}
      <div
        className={`hidden overflow-x-auto rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] shadow-[var(--g-card-shadow)] sm:block ${
          embebido ? "" : "mt-4"
        }`}
      >
        <table className="w-full border-collapse text-left text-sm tabular-nums">
          <caption className="sr-only">{titulo}</caption>
          <thead>
            <tr className="bg-[var(--g-wash)]">
              <th
                scope="col"
                className="border-b border-[var(--g-border-strong)] px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]"
              >
                Criterio
              </th>
              <th
                scope="col"
                className="border-b border-[var(--g-border-strong)] bg-[var(--g-accent-soft)] px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-ink)]"
              >
                <span className="inline-flex flex-wrap items-center gap-2">
                  <span>Curso en vivo</span>
                  <GuiaVisualBadge tone="accent">Recomendado</GuiaVisualBadge>
                </span>
              </th>
              <th
                scope="col"
                className="border-b border-[var(--g-border-strong)] px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]"
              >
                Autodidacta
              </th>
              <th
                scope="col"
                className="border-b border-[var(--g-border-strong)] px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]"
              >
                Universidad
              </th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr
                key={fila.criterio}
                className="align-top transition-colors even:bg-[var(--g-wash)]/40 hover:bg-[var(--g-wash)]/70"
              >
                <th
                  scope="row"
                  className="border-b border-[var(--g-border)] px-4 py-3.5 text-sm font-semibold text-[var(--g-ink)]"
                >
                  {fila.criterio}
                </th>
                <td className="border-b border-[var(--g-border)] bg-[var(--g-accent-soft)]/70 px-4 py-3.5 font-medium text-[var(--g-ink)]">
                  {fila.enVivo}
                </td>
                <td className="border-b border-[var(--g-border)] px-4 py-3.5 text-[var(--g-muted)]">
                  {fila.autodidacta}
                </td>
                <td className="border-b border-[var(--g-border)] px-4 py-3.5 text-[var(--g-muted)]">
                  {fila.universidad}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: una tarjeta táctil por criterio */}
      <ul className={`space-y-3 sm:hidden ${embebido ? "" : "mt-4"}`}>
        {filas.map((fila) => (
          <li
            key={fila.criterio}
            className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 shadow-[var(--g-card-shadow)]"
          >
            <p className="text-sm font-bold text-[var(--g-ink)]">{fila.criterio}</p>
            <dl className="mt-3 space-y-2.5 text-sm tabular-nums">
              <div className="rounded-xl border border-[var(--g-accent)]/20 bg-[var(--g-accent-soft)]/60 px-3 py-2">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--g-accent)]">
                  Curso en vivo
                </dt>
                <dd className="mt-0.5 font-medium text-[var(--g-ink)]">{fila.enVivo}</dd>
              </div>
              <div className="flex gap-3 px-1">
                <dt className="w-24 shrink-0 text-xs font-semibold uppercase tracking-[0.04em] text-[var(--g-subtle)]">
                  Autodidacta
                </dt>
                <dd className="text-[var(--g-muted)]">{fila.autodidacta}</dd>
              </div>
              <div className="flex gap-3 px-1">
                <dt className="w-24 shrink-0 text-xs font-semibold uppercase tracking-[0.04em] text-[var(--g-subtle)]">
                  Universidad
                </dt>
                <dd className="text-[var(--g-muted)]">{fila.universidad}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {nota ? <p className="mt-3 text-xs leading-relaxed text-[var(--g-subtle)]">{nota}</p> : null}
      {brochureHref ? (
        <Link
          href={brochureHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--g-accent)] sm:min-h-0"
        >
          <FileText size={14} aria-hidden /> Ver temario y precios (PDF)
        </Link>
      ) : null}
    </section>
  );
}
