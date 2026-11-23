import { GuiaVisualBadge } from "@/components/guias/GuiaEditorialPrimitives";
import type { PasoRutaVisual } from "@/lib/guias/paso-a-paso-tipos";

export default function GuiaPasoAPasoRuta({ pasos }: { pasos: PasoRutaVisual[] }) {
  if (pasos.length === 0) return null;

  return (
    <section aria-labelledby="ruta-visual-titulo" className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="ruta-visual-titulo"
          className="text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]"
        >
          Ruta paso a paso
        </h2>
        <GuiaVisualBadge tone="neutral">{pasos.length} pasos</GuiaVisualBadge>
      </div>

      <ol className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {pasos.map((paso) => (
          <li key={`${paso.numero}-${paso.anchorId}`} className="min-w-0">
            <a
              href={`#${paso.anchorId}`}
              className="group flex h-full min-h-[44px] flex-col justify-between rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 no-underline shadow-[var(--g-card-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--g-accent)] hover:shadow-[var(--g-card-shadow-hover)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--g-accent-soft)] font-mono text-xs font-semibold tabular-nums text-[var(--g-accent)]">
                    {String(paso.numero).padStart(2, "0")}
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[var(--g-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--g-accent)]"
                  >
                    <path
                      d="M3.5 8h9M8.5 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="mt-3 text-sm font-bold leading-snug text-[var(--g-ink)] transition-colors group-hover:text-[var(--g-accent)]">
                  {paso.titulo}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--g-muted)]">
                  {paso.resumen}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
