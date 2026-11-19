"use client";

import { ArrowRight, Search } from "lucide-react";
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
  open,
  onOpenChange,
  query,
  onQueryChange,
  exactos,
  sugeridos,
  loading,
  hasItems,
  onSelect,
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
        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 aria-selected:bg-muted"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium text-foreground">{entry.nombre}</span>
            <span className="text-xs text-muted-foreground">{entry.area}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {entry.tipos.map((t) => (
              <Badge
                key={t.tipo}
                variant="secondary"
                className="h-auto rounded px-1.5 py-0 text-[11px] font-medium"
              >
                {TIPO_ETIQUETAS[t.tipo].corto}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2.5 text-right">
          {mejorIngreso !== null ? (
            <div>
              <div className="text-xs font-semibold text-foreground tabular-nums">
                {millonesCorto(mejorIngreso)}
              </div>
              <div className="text-[11px] text-muted-foreground">4.º año</div>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Sin dato</span>
          )}
          <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
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
      className="max-w-2xl border border-border bg-card shadow-xl"
    >
      <Command shouldFilter={false} className="bg-card">
        <CommandInput
          value={query}
          onValueChange={onQueryChange}
          placeholder="Escribe una carrera o apodo (ej. informática, tens, derecho, kine)..."
          className="text-sm text-foreground"
        />
        <CommandList className="max-h-[400px] p-1.5">
          {loading && !hasItems ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Cargando carreras...
            </div>
          ) : (
            <>
              {exactos.length > 0 ? (
                <CommandGroup heading={query.trim() ? "Coincidencias" : "Carreras más buscadas"}>
                  {exactos.map(renderEntry)}
                </CommandGroup>
              ) : null}

              {exactos.length === 0 && sugeridos.length > 0 ? (
                <CommandGroup
                  heading={
                    <span className="inline-flex items-center gap-1.5 text-amber-700">
                      <Search className="size-3.5" aria-hidden="true" />
                      Sin coincidencia exacta · Sugerencias cercanas
                    </span>
                  }
                >
                  {sugeridos.slice(0, 3).map(renderEntry)}
                </CommandGroup>
              ) : null}

              {exactos.length === 0 && sugeridos.length === 0 && !loading ? (
                <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
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
