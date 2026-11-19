"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CarreraTipoData } from "@/lib/datos/carreras";
import { entero, porcentaje } from "@/lib/datos/formato";

interface PerfilEstudiantesProps {
  data: CarreraTipoData;
}

const SEGMENTOS_ORIGEN = [
  { key: "subvencionado" as const, label: "Particular subvencionado", color: "#2563eb" },
  { key: "municipal" as const, label: "Municipal / SLEP", color: "#334155" },
  { key: "pagado" as const, label: "Particular pagado", color: "#d97706" },
  { key: "delegada" as const, label: "Adm. delegada", color: "#94a3b8" },
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
    <Card className="gap-4 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
      <CardHeader className="px-6">
        <CardTitle className="text-base font-semibold text-foreground">
          Perfil de estudiantes y retención
        </CardTitle>
        <CardDescription className="text-xs">
          Titulados 2024, matrícula vigente 2025, permanencia en la carrera y colegio de origen.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-muted/35 p-3.5 tabular-nums">
            <span className="text-xs text-muted-foreground">Titulados 2024</span>
            <div className="mt-1 text-xl font-bold text-foreground">{entero(titulados.t)}</div>
          </div>
          <div className="rounded-lg border border-border bg-muted/35 p-3.5 tabular-nums">
            <span className="text-xs text-muted-foreground">Matrícula total 2025</span>
            <div className="mt-1 text-xl font-bold text-foreground">
              {entero(matricula.total)}
            </div>
            {matricula.primer_ano_t !== null ? (
              <span className="text-[11px] text-muted-foreground">
                1.er año: {entero(matricula.primer_ano_t)}
              </span>
            ) : null}
          </div>
          <div className="rounded-lg border border-border bg-muted/35 p-3.5 tabular-nums">
            <span className="text-xs text-muted-foreground">Retención 1.er año</span>
            <div className="mt-1 text-xl font-bold text-blue-700">
              {porcentaje(retencion.r1)}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/35 p-3.5 tabular-nums">
            <span className="text-xs text-muted-foreground">Retención 2.º año</span>
            <div className="mt-1 text-xl font-bold text-foreground">
              {porcentaje(retencion.r2)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground">
              Mujeres y hombres (titulados 2024)
            </h4>
            {pctMujeresTit !== null && pctHombresTit !== null ? (
              <span className="text-xs font-medium text-foreground tabular-nums">
                {porcentaje(pctMujeresTit)} mujeres · {porcentaje(pctHombresTit)} hombres
              </span>
            ) : null}
          </div>

          {pctMujeresTit !== null && pctHombresTit !== null ? (
            <div className="mt-2.5 flex h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${Math.round(pctMujeresTit * 1000) / 10}%` }}
                title={`Mujeres: ${porcentaje(pctMujeresTit)} (${entero(titulados.m)})`}
              />
              <div
                className="h-full bg-slate-700"
                style={{ width: `${Math.round(pctHombresTit * 1000) / 10}%` }}
                title={`Hombres: ${porcentaje(pctHombresTit)} (${entero(titulados.h)})`}
              />
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Sin desagregación por sexo publicada para este segmento.
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-muted-foreground tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-blue-600" />
              Mujeres: {entero(titulados.m)} ({porcentaje(pctMujeresTit)})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-slate-700" />
              Hombres: {entero(titulados.h)} ({porcentaje(pctHombresTit)})
            </span>
          </div>

          <p className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            mifuturo.cl no publica sueldos separados por sexo por secreto estadístico del SII.
          </p>
        </div>

        <div className="rounded-lg border border-border p-4">
          <h4 className="text-sm font-semibold text-foreground">Colegio de origen (matrícula)</h4>
          {tieneOrigen ? (
            <>
              <div className="mt-2.5 flex h-3 w-full overflow-hidden rounded-full bg-slate-200">
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
                    <span className="text-muted-foreground">
                      {seg.label}:{" "}
                      <strong className="font-semibold text-foreground">
                        {porcentaje(origen[seg.key])}
                      </strong>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Sin distribución por dependencia de establecimiento publicada.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
