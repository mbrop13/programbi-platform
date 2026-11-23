import { GuiaToolVisual } from "@/components/guias/GuiaEditorialPrimitives";
import type { CapturaGuia } from "@/lib/guias/paso-a-paso-tipos";

export default function CapturaPendiente({
  captura,
  herramienta,
  curso,
}: {
  captura: CapturaGuia;
  herramienta?: string;
  curso?: string;
}) {
  return (
    <figure
      className="my-6 rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)]/55 p-4 shadow-[var(--g-card-shadow)]"
      data-capture-id={captura.id}
    >
      <div
        data-pending-image="true"
        role="img"
        aria-label={captura.alt}
        className="flex items-start gap-3.5"
      >
        <GuiaToolVisual tool={herramienta} course={curso} size="sm" className="mt-0.5" />
        <div className="min-w-0 flex-1 space-y-1">
          <span className="inline-flex items-center rounded-md border border-[var(--g-border)] bg-[var(--g-surface)] px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--g-subtle)]">
            [Captura en preparación]
          </span>
          <figcaption className="text-sm leading-relaxed text-[var(--g-muted)]">
            {captura.caption}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
