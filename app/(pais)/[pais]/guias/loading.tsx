export default function GuiasPaisLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando guías locales de datos y Power BI"
      className="guias-scope min-h-screen bg-[var(--g-bg)] px-4 pb-20 pt-12 text-[var(--g-ink)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1120px]">
        <p className="mb-6 text-xs font-medium text-[var(--g-subtle)]">
          Cargando guías locales y rutas de estudio...
        </p>

        <div className="border-b border-[var(--g-border)] pb-8">
          <div className="h-3 w-32 rounded bg-[var(--g-wash)]" />
          <div className="mt-4 h-9 w-full max-w-lg rounded bg-[var(--g-wash)]" />
          <div className="mt-3 h-4 w-full max-w-xl rounded bg-[var(--g-wash)]" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] p-5"
            >
              <div className="h-3 w-24 rounded bg-[var(--g-wash)]" />
              <div className="mt-3 h-5 w-5/6 rounded bg-[var(--g-wash)]" />
              <div className="mt-2.5 h-3.5 w-full rounded bg-[var(--g-wash)]" />
              <div className="mt-1.5 h-3.5 w-3/4 rounded bg-[var(--g-wash)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
