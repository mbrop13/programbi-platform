"use client";

import Link from "next/link";

export default function GuiasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="guias-scope min-h-[70vh] bg-[var(--g-bg)] px-4 py-16 text-[var(--g-ink)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
          Error al cargar guías
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--g-ink)]">
          No pudimos mostrar esta guía ahora
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--g-muted)]">
          Ocurrió un problema temporal al preparar el contenido de la biblioteca de guías. Puedes
          volver a intentarlo o regresar al índice general para elegir otra guía.
        </p>
        {error?.digest && (
          <p className="mt-3 font-mono text-xs text-[var(--g-subtle)]">
            Referencia técnica: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[var(--g-ink)] px-4 py-2 text-sm font-semibold text-[var(--g-bg)] transition-opacity hover:opacity-90"
          >
            Reintentar
          </button>
          <Link
            href="/guias"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--g-border-strong)] bg-[var(--g-surface)] px-4 py-2 text-sm font-medium text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
          >
            Ir al índice de guías
          </Link>
        </div>
      </div>
    </div>
  );
}
