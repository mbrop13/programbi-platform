"use client";

import type { CarreraTipoData } from "@/lib/datos/carreras";
import { entero, porcentaje } from "@/lib/datos/formato";

interface PerfilEstudiantesProps {
  data: CarreraTipoData;
}

const SEGMENTOS_ORIGEN = [
  { key: "subvencionado" as const, label: "Particular subvencionado", color: "#1890ff" },
  { key: "municipal" as const, label: "Municipal / SLEP", color: "#475569" },
  { key: "pagado" as const, label: "Particular pagado", color: "#f99c00" },
  { key: "delegada" as const, label: "Administración delegada", color: "#a3a3a0" },
];

export function PerfilEstudiantes({ data }: PerfilEstudiantesProps) {
  const { titulados, matricula, retencion, origen } = data;

  const pctMujeresTit =
    titulados.m !== null && titulados.t ? titulados.m / titulados.t : null;
  const pctHombresTit =
    titulados.h !== null && titulados.t ? titulados.h / titulados.t : null;

  const origenItems = SEGMENTOS_ORIGEN.map((seg) => ({
    ...seg,
    valor: origen[seg.key],
  })).filter((s): s is typeof s & { valor: number } => s.valor !== null && s.valor > 0);

  const tieneOrigen = origenItems.length > 0;

  return (
    <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#171716]">
          Perfil de estudiantes, titulados y retención
        </h3>
        <p className="text-xs text-[#5c5c58]">
          Titulados 2024, matrícula vigente 2025, retención de 1.er/2.º año y colegio de origen.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3.5 tabular-nums">
          <span className="text-xs text-[#5c5c58]">Titulados 2024</span>
          <div className="mt-1 text-xl font-extrabold text-[#171716]">
            {entero(titulados.t)}
          </div>
        </div>
        <div className="rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3.5 tabular-nums">
          <span className="text-xs text-[#5c5c58]">Matrícula total 2025</span>
          <div className="mt-1 text-xl font-extrabold text-[#171716]">
            {entero(matricula.total)}
          </div>
          {matricula.primer_ano_t !== null ? (
            <span className="text-[11px] text-[#5c5c58]">
              1.er año: {entero(matricula.primer_ano_t)}
            </span>
          ) : null}
        </div>
        <div className="rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3.5 tabular-nums">
          <span className="text-xs text-[#5c5c58]">Retención 1.er año</span>
          <div className="mt-1 text-xl font-extrabold text-[#1063b8]">
            {porcentaje(retencion.r1)}
          </div>
        </div>
        <div className="rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3.5 tabular-nums">
          <span className="text-xs text-[#5c5c58]">Retención 2.º año</span>
          <div className="mt-1 text-xl font-extrabold text-[#171716]">
            {porcentaje(retencion.r2)}
          </div>
        </div>
      </div>

      {/* Mujeres y hombres */}
      <div className="mt-5 rounded-lg border border-[#e2e2dc] p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="text-sm font-bold text-[#171716]">
            Mujeres y hombres (titulados 2024)
          </h4>
          {pctMujeresTit !== null && pctHombresTit !== null ? (
            <span className="text-xs font-semibold text-[#171716] tabular-nums">
              {porcentaje(pctMujeresTit)} mujeres · {porcentaje(pctHombresTit)} hombres
            </span>
          ) : null}
        </div>

        {pctMujeresTit !== null && pctHombresTit !== null ? (
          <div className="mt-2.5 flex h-4 w-full overflow-hidden rounded-full bg-[#e2e2dc]">
            <div
              className="h-full bg-[#1890ff]"
              style={{ width: `${Math.round(pctMujeresTit * 1000) / 10}%` }}
              title={`Mujeres: ${porcentaje(pctMujeresTit)} (${entero(titulados.m)})`}
            />
            <div
              className="h-full bg-[#475569]"
              style={{ width: `${Math.round(pctHombresTit * 1000) / 10}%` }}
              title={`Hombres: ${porcentaje(pctHombresTit)} (${entero(titulados.h)})`}
            />
          </div>
        ) : (
          <p className="mt-2 text-xs text-[#5c5c58]">
            Sin desagregación por sexo publicada para este segmento.
          </p>
        )}

        <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#5c5c58] tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#1890ff]" />
            Mujeres: {entero(titulados.m)} ({porcentaje(pctMujeresTit)})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#475569]" />
            Hombres: {entero(titulados.h)} ({porcentaje(pctHombresTit)})
          </span>
        </div>

        <p className="mt-3 rounded-md bg-[#f7f7f4] px-3 py-2 text-xs text-[#5c5c58]">
          mifuturo no publica sueldos por sexo (el SII no lo permite por los mínimos de casos), así que aquí no hay brecha salarial.
        </p>
      </div>

      {/* Colegio de origen: barra horizontal apilada */}
      <div className="mt-4 rounded-lg border border-[#e2e2dc] p-4">
        <h4 className="text-sm font-bold text-[#171716]">
          Colegio de origen (matrícula)
        </h4>
        {tieneOrigen ? (
          <>
            <div className="mt-2.5 flex h-4 w-full overflow-hidden rounded-full bg-[#e2e2dc]">
              {origenItems.map((item) => (
                <div
                  key={item.key}
                  className="h-full"
                  style={{
                    width: `${Math.round(item.valor * 1000) / 10}%`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.label}: ${porcentaje(item.valor)}`}
                />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 tabular-nums">
              {SEGMENTOS_ORIGEN.map((seg) => (
                <div key={seg.key} className="flex items-center gap-1.5">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-[#5c5c58]">
                    {seg.label}:{" "}
                    <strong className="text-[#171716]">
                      {porcentaje(origen[seg.key])}
                    </strong>
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-2 text-xs text-[#5c5c58]">
            Sin distribución por dependencia de establecimiento publicada.
          </p>
        )}
      </div>
    </div>
  );
}
