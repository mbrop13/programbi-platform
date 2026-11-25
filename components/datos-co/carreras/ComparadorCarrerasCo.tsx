"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  enteroCo,
  nombreProgramaCo,
  pesosCo,
  porcentajeCo,
  smmlvCo,
} from "@/lib/datos-co/formato";
import type { CarreraCo } from "@/lib/datos-co/types";
import { cn } from "@/lib/utils";

export interface ComparadorCarrerasCoProps {
  programas: CarreraCo[];
  slugsIniciales?: string[];
}

const PRESETS_COMPARACION: Array<{ label: string; slugs: string[] }> = [
  {
    label: "Datos y tecnología",
    slugs: [
      "ingenieria-de-sistemas",
      "estadistica",
      "tecnologia-en-sistematizacion-de-datos",
    ],
  },
  {
    label: "Ingenierías y economía",
    slugs: ["ingenieria-industrial", "economia", "contaduria-publica"],
  },
  {
    label: "Universitaria vs Tecnológica",
    slugs: [
      "ingenieria-de-software",
      "tecnologia-en-desarrollo-de-software",
      "tecnologia-en-sistemas",
    ],
  },
];

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function ComparadorCarrerasCo({
  programas,
  slugsIniciales,
}: ComparadorCarrerasCoProps) {
  const mapaPorSlug = useMemo(() => {
    const map = new Map<string, CarreraCo>();
    for (const p of programas) map.set(p.slug, p);
    return map;
  }, [programas]);

  const iniciales = useMemo(() => {
    const candidatos = slugsIniciales ?? PRESETS_COMPARACION[0].slugs;
    const validos = candidatos.filter((s) => mapaPorSlug.has(s)).slice(0, 3);
    if (validos.length > 0) return validos;
    return programas.slice(0, 3).map((p) => p.slug);
  }, [slugsIniciales, mapaPorSlug, programas]);

  const [seleccionados, setSeleccionados] = useState<string[]>(iniciales);
  const [busqueda, setBusqueda] = useState("");

  const carrerasSeleccionadas = useMemo(
    () =>
      seleccionados
        .map((s) => mapaPorSlug.get(s))
        .filter((c): c is CarreraCo => Boolean(c)),
    [seleccionados, mapaPorSlug]
  );

  const sugerencias = useMemo(() => {
    const q = normalizar(busqueda.trim());
    if (!q) return [];
    return programas
      .filter((p) => {
        if (seleccionados.includes(p.slug)) return false;
        return normalizar(`${p.programa} ${p.area_conocimiento}`).includes(q);
      })
      .slice(0, 8);
  }, [busqueda, programas, seleccionados]);

  const agregar = (slug: string) => {
    if (seleccionados.includes(slug) || seleccionados.length >= 3) return;
    setSeleccionados((prev) => [...prev, slug]);
    setBusqueda("");
  };

  const quitar = (slug: string) => {
    setSeleccionados((prev) => prev.filter((s) => s !== slug));
  };

  return (
    <div className="space-y-6">
      <Card className="gap-4 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
        <CardHeader className="px-6 pb-0">
          <CardTitle className="text-base font-semibold tracking-tight text-foreground">
            Selecciona hasta 3 carreras para comparar ({seleccionados.length}/3)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          <div className="flex flex-wrap gap-2">
            {PRESETS_COMPARACION.map((preset) => {
              const disponibles = preset.slugs.filter((s) => mapaPorSlug.has(s));
              if (disponibles.length === 0) return null;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setSeleccionados(disponibles)}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "h-8 rounded-md px-3 text-xs font-medium"
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              disabled={seleccionados.length >= 3}
              placeholder={
                seleccionados.length >= 3
                  ? "Ya tienes 3 carreras seleccionadas. Quita una para agregar otra."
                  : "Buscar programa para agregar (ej. Derecho, Medicina, Ingeniería Civil)..."
              }
              aria-label="Buscar programa para comparar"
              className="h-10 pl-9"
            />
            {sugerencias.length > 0 ? (
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-popover shadow-md">
                {sugerencias.map((item) => (
                  <li key={item.slug}>
                    <button
                      type="button"
                      onClick={() => agregar(item.slug)}
                      className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm hover:bg-muted/60"
                    >
                      <span>
                        <span className="font-medium text-foreground">
                          {nombreProgramaCo(item.programa)}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({item.nivel_formacion})
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700">
                        <Plus className="size-3.5" aria-hidden="true" />
                        Agregar
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {carrerasSeleccionadas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {carrerasSeleccionadas.map((c) => (
                <Badge
                  key={c.slug}
                  variant="outline"
                  className="h-auto gap-2 rounded-lg px-3 py-1.5 text-xs font-medium"
                >
                  <span>{nombreProgramaCo(c.programa)}</span>
                  <button
                    type="button"
                    onClick={() => quitar(c.slug)}
                    aria-label={`Quitar ${nombreProgramaCo(c.programa)}`}
                    className="rounded-sm text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {carrerasSeleccionadas.length === 0 ? (
        <Card className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Selecciona al menos una carrera arriba para ver la comparativa de sueldos y salida laboral.
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="w-48 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Indicador OLE / SNIES
                  </th>
                  {carrerasSeleccionadas.map((c) => (
                    <th key={c.slug} className="px-4 py-3 align-top">
                      {c.sugerido_ficha ? (
                        <Link
                          href={`/co/datos/carreras/${c.slug}`}
                          prefetch={false}
                          className="font-semibold text-blue-700 hover:underline"
                        >
                          {nombreProgramaCo(c.programa)}
                        </Link>
                      ) : (
                        <span className="font-semibold text-foreground">
                          {nombreProgramaCo(c.programa)}
                        </span>
                      )}
                      <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                        {c.nivel_formacion}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">Mediana COP 2026</td>
                  {carrerasSeleccionadas.map((c) => (
                    <td key={c.slug} className="px-4 py-3 font-semibold tabular-nums text-foreground">
                      {pesosCo(c.mediana_cop_2026)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">Mediana en SMMLV</td>
                  {carrerasSeleccionadas.map((c) => (
                    <td key={c.slug} className="px-4 py-3 tabular-nums text-foreground">
                      {smmlvCo(c.mediana_smmlv)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">Promedio COP 2026</td>
                  {carrerasSeleccionadas.map((c) => (
                    <td key={c.slug} className="px-4 py-3 tabular-nums text-muted-foreground">
                      {pesosCo(c.promedio_cop_2026)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">% con 4 SMMLV o más</td>
                  {carrerasSeleccionadas.map((c) => (
                    <td key={c.slug} className="px-4 py-3 font-semibold tabular-nums text-emerald-700">
                      {porcentajeCo(c.pct_4plus_smmlv)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">
                    Graduados cotizantes OLE
                  </td>
                  {carrerasSeleccionadas.map((c) => (
                    <td key={c.slug} className="px-4 py-3 tabular-nums text-foreground">
                      {enteroCo(c.graduados_cotizantes)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">Instituciones (OLE)</td>
                  {carrerasSeleccionadas.map((c) => (
                    <td key={c.slug} className="px-4 py-3 tabular-nums text-muted-foreground">
                      {enteroCo(c.n_ies)} IES
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">Graduados SNIES 2025</td>
                  {carrerasSeleccionadas.map((c) => (
                    <td key={c.slug} className="px-4 py-3 tabular-nums text-muted-foreground">
                      {c.snies_2025 ? `${enteroCo(c.snies_2025.graduados_2025)} (${c.snies_2025.n_ies} IES)` : "s/d"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">Oficial vs Privado</td>
                  {carrerasSeleccionadas.map((c) => (
                    <td key={c.slug} className="px-4 py-3 text-xs tabular-nums text-muted-foreground">
                      {c.sector_ies ? (
                        <div className="space-y-0.5">
                          <p>
                            Oficial: <strong className="text-foreground">{pesosCo(c.sector_ies.oficial.mediana_cop_2026)}</strong>
                          </p>
                          <p>
                            Privado: <strong className="text-foreground">{pesosCo(c.sector_ies.privado.mediana_cop_2026)}</strong>
                          </p>
                        </div>
                      ) : (
                        "Sin comparativa (n < 30)"
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">Área de conocimiento</td>
                  {carrerasSeleccionadas.map((c) => (
                    <td key={c.slug} className="px-4 py-3 text-xs text-muted-foreground">
                      {c.area_conocimiento}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
