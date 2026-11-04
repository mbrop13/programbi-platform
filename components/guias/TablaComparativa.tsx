/**
 * Tabla comparativa responsive: curso en vivo vs autodidacta vs universidad.
 *
 * En escritorio es una tabla con la columna «curso en vivo» destacada; en
 * mobile se convierte en tarjetas apiladas por criterio, sin scroll horizontal.
 * Todo CSS: no hay JS ni estado.
 */
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
}: {
  titulo?: string;
  subtitulo?: string;
  filas: FilaComparativa[];
  nota?: string;
}) {
  return (
    <section aria-labelledby="tabla-comparativa" data-testid="tabla-comparativa" className="mt-12">
      <h2 id="tabla-comparativa" className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
        {subtitulo}
      </h2>
      <p className="mt-1 text-xl font-bold tracking-tight text-ink">{titulo}</p>

      {/* Escritorio */}
      <div className="mt-4 hidden overflow-hidden rounded-2xl border border-line sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{titulo}</caption>
          <thead>
            <tr className="bg-wash">
              <th scope="col" className="border-b border-line px-4 py-3 text-xs font-bold uppercase tracking-wide text-mute">
                Criterio
              </th>
              <th scope="col" className="border-b border-line bg-ink px-4 py-3 text-xs font-bold uppercase tracking-wide text-canvas">
                Curso en vivo
              </th>
              <th scope="col" className="border-b border-line px-4 py-3 text-xs font-bold uppercase tracking-wide text-mute">
                Autodidacta
              </th>
              <th scope="col" className="border-b border-line px-4 py-3 text-xs font-bold uppercase tracking-wide text-mute">
                Universidad
              </th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.criterio} className="align-top">
                <th scope="row" className="border-b border-line px-4 py-3 text-sm font-semibold text-ink">
                  {fila.criterio}
                </th>
                <td className="border-b border-line bg-wash/50 px-4 py-3 font-medium text-ink">{fila.enVivo}</td>
                <td className="border-b border-line px-4 py-3 text-mute">{fila.autodidacta}</td>
                <td className="border-b border-line px-4 py-3 text-mute">{fila.universidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: una tarjeta por criterio */}
      <ul className="mt-4 space-y-3 sm:hidden">
        {filas.map((fila) => (
          <li key={fila.criterio} className="rounded-2xl border border-line bg-paper p-4">
            <p className="text-sm font-bold text-ink">{fila.criterio}</p>
            <dl className="mt-2 space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-wide text-ink">En vivo</dt>
                <dd className="text-ink">{fila.enVivo}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-faint">
                  Autodidacta
                </dt>
                <dd className="text-mute">{fila.autodidacta}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-faint">
                  Universidad
                </dt>
                <dd className="text-mute">{fila.universidad}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {nota ? <p className="mt-3 text-xs leading-relaxed text-faint">{nota}</p> : null}
    </section>
  );
}
