import { Plus, Check } from "lucide-react";
import type { RankingItem } from "@/lib/datos/carreras-tipos";
import { pesos, porcentaje, semestres, variacionPorcentual } from "@/lib/datos/formato";

function MiniRangoBar({
  p10,
  p50,
  p90,
  maxGlobal,
  factor,
}: {
  p10: number | null;
  p50: number | null;
  p90: number | null;
  maxGlobal: number;
  factor: number;
}) {
  if (p10 === null || p90 === null || maxGlobal <= 0) {
    return <span className="text-xs text-[#5c5c58]">s/i</span>;
  }
  const left = Math.max(0, Math.min(100, (p10 / maxGlobal) * 100));
  const right = Math.max(left, Math.min(100, (p90 / maxGlobal) * 100));
  const mid = p50 !== null ? Math.max(left, Math.min(right, (p50 / maxGlobal) * 100)) : null;

  return (
    <div className="w-36 space-y-1">
      <div className="relative h-2 w-full rounded-full bg-[#f0f0ec]">
        <div
          className="absolute top-0 h-2 rounded-full bg-[#1890ff]/35"
          style={{ left: `${left}%`, width: `${Math.max(4, right - left)}%` }}
        />
        {mid !== null ? (
          <div
            className="absolute -top-0.5 h-3 w-1 rounded-full bg-[#1890ff]"
            style={{ left: `${mid}%` }}
          />
        ) : null}
      </div>
      <div className="flex justify-between text-[11px] text-[#5c5c58] tabular-nums">
        <span>{pesos(p10 * factor)}</span>
        <span>{pesos(p90 * factor)}</span>
      </div>
    </div>
  );
}

export function TablaRankingCarreras({ rows, factor = 1, compareSlugs = [], onToggleCompare, onSelectSlug, maxP90: suppliedMaxP90 }: {
  rows: readonly RankingItem[];
  factor?: number;
  compareSlugs?: readonly string[];
  onToggleCompare?: (slug: string) => void;
  onSelectSlug?: (slug: string) => void;
  maxP90?: number;
}) {
  const maxP90 = suppliedMaxP90 ?? rows.reduce((max, row) => Math.max(max, row.p90_5 ?? 0), 1_000_000);
  return (
    <div className="md:overflow-x-auto md:rounded-xl md:border md:border-[#e2e2dc] md:bg-white">
      <table role="table" aria-label="Ranking de carreras" className="block w-full border-collapse text-left text-sm md:table">
        <thead role="rowgroup" className="sr-only md:not-sr-only md:table-header-group">
          <tr className="border-b border-[#e2e2dc] bg-[#f7f7f4] text-xs font-semibold text-[#5c5c58]">
            <th scope="col" className="px-3 py-3 text-center">#</th>
            <th scope="col" className="px-3 py-3">Carrera</th>
            <th scope="col" className="px-3 py-3 text-right">Sueldo 4.º año</th>
            <th scope="col" className="px-3 py-3 text-right">Empleab. 1.º</th>
            <th scope="col" className="px-3 py-3">Rango P10–P90 (5.º)</th>
            <th scope="col" className="px-3 py-3 text-right">Arancel med.</th>
            <th scope="col" className="px-3 py-3 text-right">Dur. real</th>
            <th scope="col" className="px-3 py-3 text-right">Acción</th>
          </tr>
        </thead>
        <tbody role="rowgroup" className="block space-y-3 md:table-row-group md:space-y-0 md:divide-y md:divide-[#e2e2dc]">
          {rows.map((row, idx) => {
            const inCompare = compareSlugs.includes(row.slug);
            const ing4Adj =
              row.ing4 !== null ? Math.round(row.ing4 * factor) : null;
            return (
              <tr
                key={`${row.slug}-${row.tipo}`}
                role="row"
                onMouseEnter={onSelectSlug ? () => onSelectSlug(row.slug) : undefined}
                className="grid grid-cols-3 gap-x-2 gap-y-3 rounded-xl border border-[#e2e2dc] bg-white p-4 transition-colors hover:bg-[#f7f7f4]/80 md:table-row md:rounded-none md:border-0 md:p-0"
              >
                <td role="cell" className="col-span-3 text-xs font-semibold text-[#5c5c58] tabular-nums md:table-cell md:px-3 md:py-3 md:text-center">
                  <span aria-hidden="true" className="md:hidden">#</span>{idx + 1}
                </td>
                <th role="rowheader" scope="row" className="col-span-2 text-left font-normal md:table-cell md:px-3 md:py-3">
                  <a
                    href={`/datos/carreras/${row.slug}?tipo=${row.tipo}`}
                    className="text-base font-bold text-[#171716] hover:text-[#1063b8] hover:underline md:text-sm md:font-semibold"
                  >
                    {row.nombre}
                  </a>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#5c5c58]">
                    <span>{row.area}</span>
                    {row.yoy_real_4 !== null ? (
                      <span
                        className={
                          row.yoy_real_4 >= 0
                            ? "text-emerald-700"
                            : "text-rose-700"
                        }
                      >
                        {variacionPorcentual(row.yoy_real_4)} real
                      </span>
                    ) : null}
                  </div>
                </th>
                <td role="cell" className="text-xs font-bold text-[#171716] tabular-nums md:table-cell md:px-3 md:py-3 md:text-right md:text-sm">
                  <span aria-hidden="true" className="block font-normal text-[#5c5c58] md:hidden">Sueldo 4.º año: </span>{pesos(ing4Adj)}
                </td>
                <td role="cell" className="text-xs font-medium text-[#171716] tabular-nums md:table-cell md:px-3 md:py-3 md:text-right md:text-sm">
                  <span aria-hidden="true" className="block font-normal text-[#5c5c58] md:hidden">Empleab. 1.º: </span>{porcentaje(row.emp1)}
                </td>
                <td role="cell" className="col-span-3 flex items-center justify-between border-t border-[#e2e2dc] pt-2.5 md:table-cell md:border-0 md:px-3 md:py-3">
                  <span aria-hidden="true" className="text-[11px] text-[#5c5c58] md:hidden">Rango P10–P90 (5.º): </span>
                  <MiniRangoBar
                    p10={row.p10_5}
                    p50={row.p50_5}
                    p90={row.p90_5}
                    maxGlobal={maxP90}
                    factor={factor}
                  />
                </td>
                <td role="cell" className="text-xs text-[#171716] tabular-nums md:table-cell md:px-3 md:py-3 md:text-right">
                  <span aria-hidden="true" className="block text-[#5c5c58] md:hidden">Arancel med.: </span>{pesos(row.arancel_med)}
                </td>
                <td role="cell" className="text-xs text-[#5c5c58] tabular-nums md:table-cell md:px-3 md:py-3 md:text-right">
                  <span aria-hidden="true" className="block md:hidden">Duración real: </span>{semestres(row.dur_real)}
                </td>
                <td role="cell" className="col-start-3 row-start-2 text-right md:table-cell md:px-3 md:py-3">
                  <button
                    type="button"
                    onClick={onToggleCompare ? () => onToggleCompare(row.slug) : undefined}
                    disabled={!onToggleCompare}
                    aria-pressed={inCompare}
                    aria-label={`${inCompare ? "Quitar de comparación" : "Comparar"}: ${row.nombre}`}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                      inCompare
                        ? "border-[#1063b8] bg-[#e9f4ff] text-[#1063b8]"
                        : "border-[#e2e2dc] bg-white text-[#171716] hover:border-[#1063b8]"
                    }`}
                  >
                    {inCompare ? (
                      <>
                        <Check className="size-3" />
                        En lista
                      </>
                    ) : (
                      <>
                        <Plus className="size-3" />
                        Comparar
                      </>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
