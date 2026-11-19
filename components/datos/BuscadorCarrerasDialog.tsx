"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import type { BuscadorEntry } from "@/lib/datos/carreras-sinonimos";
import { TIPO_ETIQUETAS } from "@/lib/datos/carreras-tipos";
import { millonesCorto } from "@/lib/datos/formato";

interface BuscadorCarrerasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  exactos: BuscadorEntry[];
  sugeridos: BuscadorEntry[];
  loading: boolean;
  hasItems: boolean;
  onSelect: (entry: BuscadorEntry) => void;
}

export function BuscadorCarrerasDialog({
  open, onOpenChange, query, onQueryChange, exactos, sugeridos, loading, hasItems, onSelect,
}: BuscadorCarrerasDialogProps) {
  const renderEntry = (entry: BuscadorEntry) => {
    const mejorIngreso = entry.tipos.reduce<number | null>((max, t) => {
      if (t.ing4 === null) return max;
      return max === null || t.ing4 > max ? t.ing4 : max;
    }, null);

    return (
      <CommandItem
        key={entry.slug}
        value={`${entry.nombre} ${entry.slug}`}
        onSelect={() => onSelect(entry)}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 aria-selected:bg-[#f3f3f0]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium text-[#171716]">{entry.nombre}</span>
            <span className="text-xs text-[#5c5c58]">{entry.area}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {entry.tipos.map((t) => (
              <Badge
                key={t.tipo}
                variant="outline"
                className="border-[#e2e2dc] bg-[#f7f7f4] px-1.5 py-0 text-[11px] font-semibold text-[#171716]"
              >
                {TIPO_ETIQUETAS[t.tipo].corto}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-right">
          {mejorIngreso !== null ? (
            <div>
              <div className="text-xs font-semibold text-[#171716] tabular-nums">
                {millonesCorto(mejorIngreso)}
              </div>
              <div className="text-[11px] text-[#5c5c58]">4.º año</div>
            </div>
          ) : (
            <span className="text-xs text-[#5c5c58]">s/i</span>
          )}
          <ArrowRight className="size-4 text-[#5c5c58]" />
        </div>
      </CommandItem>
    );
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Buscar carrera en Chile"
      description="Busca por nombre oficial, abreviatura o sinónimo (ej. tens, ing comercial, kine)."
      className="max-w-2xl border border-[#e2e2dc] bg-white"
    >
      <Command shouldFilter={false} className="bg-white">
        <CommandInput
          value={query}
          onValueChange={onQueryChange}
          placeholder="Escribe una carrera o sinónimo (ej. informática, tens, derecho)..."
          className="text-sm text-[#171716]"
        />
        <CommandList className="max-h-[380px] p-1">
          {loading && !hasItems ? (
            <div className="py-8 text-center text-sm text-[#5c5c58]">Cargando carreras...</div>
          ) : (
            <>
              {exactos.length > 0 ? (
                <CommandGroup heading={query.trim() ? "Coincidencias" : "Carreras populares"}>
                  {exactos.map(renderEntry)}
                </CommandGroup>
              ) : null}

              {exactos.length === 0 && sugeridos.length > 0 ? (
                <CommandGroup
                  heading={
                    <span className="inline-flex items-center gap-1.5 text-[#f99c00]">
                      <Sparkles className="size-3.5" />
                      Sin coincidencia exacta · 3 sugerencias cercanas
                    </span>
                  }
                >
                  {sugeridos.slice(0, 3).map(renderEntry)}
                </CommandGroup>
              ) : null}

              {exactos.length === 0 && sugeridos.length === 0 && !loading ? (
                <CommandEmpty className="py-8 text-center text-sm text-[#5c5c58]">
                  No encontramos carreras con «{query}». Prueba con otro término o revisa el área.
                </CommandEmpty>
              ) : null}
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
