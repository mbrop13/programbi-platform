import type { PasoRutaVisual } from "@/lib/guias/paso-a-paso-tipos";

export default function GuiaPasoAPasoRuta({ pasos }: { pasos: PasoRutaVisual[] }) {
  if (pasos.length === 0) return null;

  return (
    <section aria-labelledby="ruta-visual-titulo" className="mt-8">
      <h2
        id="ruta-visual-titulo"
        className="text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]"
      >
        Ruta paso a paso
      </h2>
      <ol className="mt-3 divide-y divide-[var(--g-border)] border-y border-[var(--g-border)]">
        {pasos.map((paso) => (
          <li key={`${paso.numero}-${paso.anchorId}`} className="min-w-0">
            <a
              href={`#${paso.anchorId}`}
              className="group flex min-h-[44px] items-baseline gap-4 py-3.5 no-underline transition-colors hover:bg-[var(--g-surface)] sm:px-2"
            >
              <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-[var(--g-subtle)]">
                {String(paso.numero).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-[var(--g-ink)] transition-colors group-hover:text-[var(--g-accent)]">
                  {paso.titulo}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--g-muted)]">
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
