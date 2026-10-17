export default function PagoLoading() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
        <span className="text-sm text-mute">Cargando inscripción…</span>
      </div>
    </section>
  );
}
