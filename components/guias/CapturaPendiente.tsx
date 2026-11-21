import type { CapturaGuia } from "@/lib/guias/paso-a-paso-tipos";

export default function CapturaPendiente({ captura }: { captura: CapturaGuia }) {
  return (
    <figure
      className="my-6 rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] px-4 py-3"
      data-capture-id={captura.id}
    >
      <div
        data-pending-image="true"
        role="img"
        aria-label={captura.alt}
        className="flex flex-col gap-1"
      >
        <span className="font-mono text-xs text-[var(--g-subtle)]">
          [Captura en preparación]
        </span>
        <figcaption className="text-sm leading-relaxed text-[var(--g-muted)]">
          {captura.caption}
        </figcaption>
      </div>
    </figure>
  );
}
