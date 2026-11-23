"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function GuiasPaisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ pais?: string }>();
  const pais = typeof params?.pais === "string" ? params.pais : "";
  const hubPaisHref = pais ? `/${pais}/guias` : "/guias";

  return (
    <div className="guias-scope min-h-[70vh] bg-[var(--g-bg)] px-4 py-16 text-[var(--g-ink)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
          Error al cargar guías por país
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--g-ink)]">
          No pudimos cargar las guías locales
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--g-muted)]">
          Se produjo un fallo al recuperar el contenido de guías para esta región. Intenta recargar
          la vista o consulta la biblioteca general de guías.
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
            href={hubPaisHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--g-border-strong)] bg-[var(--g-surface)] px-4 py-2 text-sm font-medium text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
          >
            Volver a guías locales
          </Link>
          <Link
            href="/guias"
            className="inline-flex min-h-[44px] items-center justify-center px-2 py-2 text-sm font-medium text-[var(--g-accent)] underline underline-offset-4"
          >
            Ver todas las guías
          </Link>
        </div>
      </div>
    </div>
  );
}
