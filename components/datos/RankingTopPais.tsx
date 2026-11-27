"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FilaTopPais {
  href: string;
  nombre: string;
  /** Línea de apoyo bajo el nombre: área, nivel, otra métrica. */
  detalle: string;
  /** Valor numérico para la barra (en la misma unidad dentro del grupo). */
  valor: number;
  texto: string;
}

export interface GrupoTopPais {
  id: string;
  label: string;
  filas: FilaTopPais[];
}

/**
 * Top 10 por grupo (nivel de formación) para las páginas de carreras de cada país.
 * Va antes de la tabla completa: responde rápido «¿cuáles pagan más?» y la tabla
 * queda para quien quiere comparar en detalle.
 */
export function RankingTopPais({
  titulo,
  descripcion,
  grupos,
  verTodasHref,
  verTodasTexto = "Ver la tabla completa",
}: {
  titulo: string;
  descripcion: string;
  grupos: GrupoTopPais[];
  verTodasHref: string;
  verTodasTexto?: string;
}) {
  const conDatos = grupos.filter((g) => g.filas.length > 0);
  const [activo, setActivo] = React.useState(conDatos[0]?.id ?? "");
  const grupo = conDatos.find((g) => g.id === activo) ?? conDatos[0];
  if (!grupo) return null;
  // Barras desde cero, relativas al primero del grupo.
  const max = Math.max(...grupo.filas.map((f) => f.valor), 1);

  return (
    <section aria-labelledby="top-pais-titulo" className="space-y-5">
      <div className="max-w-3xl space-y-1.5">
        <h2 id="top-pais-titulo" className="text-2xl font-bold tracking-[-0.02em] text-ink sm:text-[1.75rem]">
          {titulo}
        </h2>
        <p className="text-base text-mute">{descripcion}</p>
      </div>

      {conDatos.length > 1 ? (
        <div
          role="group"
          aria-label="Nivel de formación"
          className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {conDatos.map((g) => {
            const on = g.id === grupo.id;
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={on}
                onClick={() => setActivo(g.id)}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center rounded-xl border px-4 text-sm font-semibold whitespace-nowrap transition-colors sm:h-10",
                  on
                    ? "border-ink bg-ink text-white"
                    : "border-line-strong bg-paper text-ink hover:border-ink active:bg-wash"
                )}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <p aria-live="polite" className="sr-only">
          Mostrando {grupo.label}
        </p>
        <ol className="divide-y divide-line">
          {grupo.filas.slice(0, 10).map((f, i) => {
            const podio = i < 3;
            return (
              <li
                key={f.href}
                className="group relative grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-4 py-3.5 transition-colors hover:bg-wash/60 sm:grid-cols-[2.75rem_minmax(0,1fr)_minmax(0,15rem)_8rem] sm:gap-x-5 sm:px-6"
              >
                <span
                  className={cn(
                    "text-center leading-none font-extrabold tabular-nums",
                    podio ? "text-2xl text-[#0b63c5]" : "text-lg text-mute"
                  )}
                >
                  <span className="sr-only">Puesto </span>
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <Link
                    href={f.href}
                    prefetch={false}
                    className={cn(
                      "font-semibold text-ink underline-offset-4 after:absolute after:inset-0 group-hover:underline focus-visible:outline-none! focus-visible:after:ring-2 focus-visible:after:ring-[#0b63c5] focus-visible:after:ring-inset",
                      podio ? "text-[17px]" : "text-[15px]"
                    )}
                  >
                    {f.nombre}
                  </Link>
                  <p className="mt-0.5 text-sm text-mute sm:truncate">{f.detalle}</p>
                </div>
                <div className="col-start-2 flex items-center gap-3 sm:contents">
                  <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-wash" aria-hidden="true">
                    <div
                      className={cn("h-full rounded-full", podio ? "bg-[#0b63c5]" : "bg-[#0b63c5]/45")}
                      style={{ width: `${Math.max(2, (f.valor / max) * 100).toFixed(1)}%` }}
                    />
                  </div>
                  <p className="shrink-0 text-base font-bold text-ink tabular-nums sm:text-right sm:text-lg">{f.texto}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="border-t border-line bg-wash/40 px-4 py-2 sm:px-6">
          <a
            href={verTodasHref}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-[#0b63c5] underline-offset-4 hover:underline"
          >
            {verTodasTexto}
          </a>
        </div>
      </div>
    </section>
  );
}
