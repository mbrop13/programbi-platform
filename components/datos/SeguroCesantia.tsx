import data from "@/data/datos-fase3/seguro.json";

const fmt = new Intl.NumberFormat("es-CL");

export function SeguroCesantia() {
  return (
    <section
      id="seguro-cesantia"
      className="mb-10 mt-14 rounded-xl border border-neutral-200 bg-white p-6 sm:p-8"
      aria-labelledby="seguro-title"
    >
      <p className="text-sm font-semibold uppercase tracking-wider text-[#006abf]">
        Seguro de cesantía · SP
      </p>
      <h2 id="seguro-title" className="mt-3 text-2xl font-bold">
        Personas que recibieron el seguro de cesantía
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">
        En {data.periodo_label}, {fmt.format(data.total)} personas recibieron
        prestaciones del seguro de cesantía, según la Superintendencia de
        Pensiones. Esta cifra es un registro administrativo y no equivale al
        número de personas desocupadas medido por la encuesta del INE.
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-neutral-600">Total beneficiarios</dt>
          <dd className="mt-1 text-3xl font-bold tabular-nums">
            {fmt.format(data.total)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-neutral-600">
            Solo cuenta individual (CIC)
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {fmt.format(data.cic)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-neutral-600">Fondo solidario (FCS)</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {fmt.format(data.fcs)}
          </dd>
        </div>
      </dl>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="font-semibold">Beneficiarios por sexo</h3>
          <table className="mt-3 w-full text-sm tabular-nums">
            <caption className="sr-only">
              Beneficiarios por sexo en {data.periodo_label}
            </caption>
            <tbody>
              <tr className="border-t border-neutral-200">
                <th scope="row" className="py-2 text-left font-normal">
                  Hombres
                </th>
                <td className="py-2 text-right">
                  {fmt.format(data.sexo.hombres)}
                </td>
              </tr>
              <tr className="border-t border-neutral-200">
                <th scope="row" className="py-2 text-left font-normal">
                  Mujeres
                </th>
                <td className="py-2 text-right">
                  {fmt.format(data.sexo.mujeres)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="font-semibold">Beneficiarios por tipo de contrato</h3>
          <table className="mt-3 w-full text-sm tabular-nums">
            <caption className="sr-only">
              Beneficiarios por contrato en {data.periodo_label}
            </caption>
            <tbody>
              <tr className="border-t border-neutral-200">
                <th scope="row" className="py-2 text-left font-normal">
                  Indefinido
                </th>
                <td className="py-2 text-right">
                  {fmt.format(data.contrato.indefinido)}
                </td>
              </tr>
              <tr className="border-t border-neutral-200">
                <th scope="row" className="py-2 text-left font-normal">
                  Plazo fijo
                </th>
                <td className="py-2 text-right">
                  {fmt.format(data.contrato.plazo_fijo)}
                </td>
              </tr>
              <tr className="border-t border-neutral-200">
                <th scope="row" className="py-2 text-left font-normal">
                  Trabajo de casa particular
                </th>
                <td className="py-2 text-right">
                  {fmt.format(data.contrato.casa_particular)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-neutral-600">
        La ficha de {data.ficha} presenta beneficiarios de {data.periodo_label}.
        La Ley 21.628 modificó requisitos y prestaciones desde diciembre de
        2023, lo que afecta la comparación con períodos anteriores. Fuente:
        Superintendencia de Pensiones, ficha estadística, tabla 9. ProgramBI
        transformó los datos.
      </p>
      <p className="mt-3 text-sm">
        <a className="text-[#006abf] underline" href={data.source}>
          Ver ficha oficial de la Superintendencia de Pensiones
        </a>
      </p>
    </section>
  );
}
