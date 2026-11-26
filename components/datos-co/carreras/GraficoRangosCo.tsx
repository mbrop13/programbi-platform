import { enteroCo, pesosCo, porcentajeCo } from "@/lib/datos-co/formato";
import type { RangosSmmlvCo } from "@/lib/datos-co/types";

export interface GraficoRangosCoProps {
  rangos: RangosSmmlvCo;
  totalCotizantes: number;
  nombrePrograma: string;
  smmlvCop: number;
  medianaSmmlv: number;
}

interface Tramo {
  corto: string;
  detalle: string;
  desde: number;
  hasta: number;
  valor: number;
  alto: boolean;
}

/**
 * Distribución de cotizantes en los 7 tramos SMMLV del OLE.
 * Se dibuja con HTML y CSS (sin librería de gráficos): aparece completa desde el
 * servidor, no depende de JavaScript y lleva una tabla para lectores de pantalla.
 */
export function GraficoRangosCo({
  rangos,
  totalCotizantes,
  nombrePrograma,
  smmlvCop,
  medianaSmmlv,
}: GraficoRangosCoProps) {
  const tramos: Tramo[] = [
    { corto: "≤ 1", detalle: "Hasta 1 SMMLV", desde: 0, hasta: 1, valor: rangos.n_1_sm, alto: false },
    { corto: "1–1,5", detalle: "Entre 1 y 1,5 SMMLV", desde: 1, hasta: 1.5, valor: rangos.n_1_y_1_5_sm, alto: false },
    { corto: "1,5–2,5", detalle: "Entre 1,5 y 2,5 SMMLV", desde: 1.5, hasta: 2.5, valor: rangos.n_1_5_y_2_5_sm, alto: false },
    { corto: "2,5–4", detalle: "Entre 2,5 y 4 SMMLV", desde: 2.5, hasta: 4, valor: rangos.n_2_5_y_4_sm, alto: false },
    { corto: "4–6", detalle: "Entre 4 y 6 SMMLV", desde: 4, hasta: 6, valor: rangos.n_4_y_6_sm, alto: true },
    { corto: "6–9", detalle: "Entre 6 y 9 SMMLV", desde: 6, hasta: 9, valor: rangos.n_6_y_9_sm, alto: true },
    { corto: "> 9", detalle: "Más de 9 SMMLV", desde: 9, hasta: Infinity, valor: rangos.n_mas_de_9_sm, alto: true },
  ];

  const sumaTramos = tramos.reduce((s, t) => s + t.valor, 0);
  const base = sumaTramos > 0 ? sumaTramos : totalCotizantes > 0 ? totalCotizantes : 1;
  const max = Math.max(...tramos.map((t) => t.valor), 1);
  const pct = (v: number) => Math.round((v / base) * 1000) / 10;
  const idxMediana = tramos.findIndex((t) => medianaSmmlv >= t.desde && medianaSmmlv < t.hasta);
  const bajo25 = pct(tramos.slice(0, 3).reduce((s, t) => s + t.valor, 0));
  const sobre4 = pct(tramos.filter((t) => t.alto).reduce((s, t) => s + t.valor, 0));

  if (sumaTramos === 0) {
    return (
      <p className="rounded-2xl border border-line bg-paper p-6 text-sm text-mute">
        El OLE no publica la distribución por tramos de ingreso para {nombrePrograma}.
      </p>
    );
  }

  return (
    <figure className="rounded-3xl border border-line bg-paper p-5 sm:p-7">
      <div aria-hidden="true">
        <div className="grid h-56 grid-cols-7 items-end gap-1.5 border-b border-line sm:h-64 sm:gap-3">
          {tramos.map((t, i) => {
            const alto = (t.valor / max) * 100;
            return (
              <div key={t.corto} className="flex h-full min-w-0 flex-col items-center justify-end">
                <span className="mb-1.5 text-[11px] font-semibold text-ink tabular-nums sm:text-sm">
                  {porcentajeCo(pct(t.valor), false)}
                </span>
                <div
                  className={`relative w-full max-w-[64px] rounded-t-md ${
                    t.alto ? "bg-[#0f7b4a]" : i === idxMediana ? "bg-[#0b63c5]" : "bg-[#0b63c5]/35"
                  }`}
                  style={{ height: `${Math.max(alto, t.valor > 0 ? 1.5 : 0)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-3">
          {tramos.map((t, i) => (
            <div key={t.corto} className="min-w-0 text-center">
              <p className="text-[11px] leading-tight font-medium text-ink tabular-nums sm:text-xs">{t.corto}</p>
              <p className="mt-0.5 text-[10px] text-mute tabular-nums sm:text-[11px]">{enteroCo(t.valor)}</p>
              {i === idxMediana ? (
                <p className="mt-1 text-[10px] leading-tight font-semibold text-[#0b63c5] sm:text-[11px]">
                  Mediana
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <figcaption className="mt-5 space-y-3">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-mute">
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-sm bg-[#0b63c5]" aria-hidden="true" />
            Tramo donde cae la mediana
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-sm bg-[#0b63c5]/35" aria-hidden="true" />
            Menos de 4 SMMLV
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-sm bg-[#0f7b4a]" aria-hidden="true" />
            4 SMMLV o más ({pesosCo(smmlvCop * 4)} o más en 2026)
          </span>
        </div>
        <p className="text-sm leading-relaxed text-mute">
          Tramos en salarios mínimos (SMMLV) de los {enteroCo(sumaTramos)} graduados de {nombrePrograma} que
          cotizan en seguridad social. El {porcentajeCo(bajo25)} gana menos de 2,5 SMMLV y el{" "}
          {porcentajeCo(sobre4)} llega a 4 SMMLV o más.
        </p>
      </figcaption>

      {/* Las tablas no respetan el ancho de 1 px de sr-only: se oculta el contenedor. */}
      <div className="sr-only">
      <table>
        <caption>Graduados cotizantes de {nombrePrograma} por tramo de ingreso</caption>
        <thead>
          <tr>
            <th scope="col">Tramo</th>
            <th scope="col">Cotizantes</th>
            <th scope="col">Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          {tramos.map((t) => (
            <tr key={t.corto}>
              <th scope="row">{t.detalle}</th>
              <td>{enteroCo(t.valor)}</td>
              <td>{porcentajeCo(pct(t.valor))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  );
}
