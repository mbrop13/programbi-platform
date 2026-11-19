"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";
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
import { buscarCarreras, type BuscadorEntry } from "@/lib/datos/carreras-sinonimos";
import { TIPO_ETIQUETAS } from "@/lib/datos/carreras-tipos";
import { millonesCorto } from "@/lib/datos/formato";
import { trackEvent } from "@/lib/analytics/marketing";

interface BuscadorCarrerasProps {
  initialItems?: BuscadorEntry[];
  onSelect?: (entry: BuscadorEntry) => void;
  placeholder?: string;
  className?: string;
}

export function BuscadorCarreras({
  initialItems,
  onSelect,
  placeholder = "Busca una carrera (ej. medicina, informática, tens, comercial)...",
  className,
}: BuscadorCarrerasProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [items, setItems] = React.useState<BuscadorEntry[]>(initialItems ?? []);
  const [loading, setLoading] = React.useState(false);
  const fetchedRef = React.useRef(Boolean(initialItems && initialItems.length > 0));
  const lastTrackedQueryRef = React.useRef("");

  const ensureLoaded = React.useCallback(async () => {
    if (fetchedRef.current || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/datos/carreras/buscador.json");
      if (res.ok) {
        const data = (await res.json()) as BuscadorEntry[];
        setItems(data);
        fetchedRef.current = true;
      }
    } catch {
      // Silencioso: si falla la red, el usuario puede reintentar al abrir
    } finally {
      setLoading(false);
    }
  }, [loading]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
        void ensureLoaded();
        return;
      }
      if (e.key === "/" && !isTyping && !open) {
        e.preventDefault();
        setOpen(true);
        void ensureLoaded();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [ensureLoaded, open]);

  const { exactos, sugeridos } = React.useMemo(() => {
    return buscarCarreras(query, items, 12);
  }, [query, items]);

  React.useEffect(() => {
    const trimmed = query.trim();
    if (!open || trimmed.length < 2 || trimmed === lastTrackedQueryRef.current) return;
    const timer = window.setTimeout(() => {
      lastTrackedQueryRef.current = trimmed;
      trackEvent("datos_search", {
        q_len: trimmed.length,
        resultado: exactos.length > 0 ? "exacto" : sugeridos.length > 0 ? "sugerido" : "vacio",
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [query, open, exactos.length, sugeridos.length]);

  const handleSelect = (entry: BuscadorEntry) => {
    setOpen(false);
    if (onSelect) {
      onSelect(entry);
      return;
    }
    router.push(`/datos/carreras/${entry.slug}`);
  };

  const renderEntry = (entry: BuscadorEntry) => {
    const mejorIngreso = entry.tipos.reduce<number | null>((max, t) => {
      if (t.ing4 === null) return max;
      return max === null || t.ing4 > max ? t.ing4 : max;
    }, null);

    return (
      <CommandItem
        key={entry.slug}
        value={`${entry.nombre} ${entry.slug}`}
        onSelect={() => handleSelect(entry)}
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
    <div className={className}>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          void ensureLoaded();
        }}
        onFocus={() => void ensureLoaded()}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#d4d4ce] bg-white px-4 py-3 text-left text-sm text-[#5c5c58] shadow-xs transition-colors hover:border-[#1063b8] focus-visible:outline-2 focus-visible:outline-[#1063b8]"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <Search className="size-4 shrink-0 text-[#1063b8]" aria-hidden="true" />
          <span className="truncate">{placeholder}</span>
        </span>
        <span
          aria-hidden="true"
          className="hidden shrink-0 items-center gap-1 sm:inline-flex"
        >
          <kbd className="rounded border border-[#e2e2dc] bg-[#f7f7f4] px-1.5 py-0.5 font-mono text-[11px] text-[#5c5c58]">
            /
          </kbd>
          <span className="text-[11px] text-[#5c5c58]">o</span>
          <kbd className="rounded border border-[#e2e2dc] bg-[#f7f7f4] px-1.5 py-0.5 font-mono text-[11px] text-[#5c5c58]">
            Ctrl K
          </kbd>
        </span>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) void ensureLoaded();
        }}
        title="Buscar carrera en Chile"
        description="Busca por nombre oficial, abreviatura o sinónimo (ej. tens, ing comercial, kine)."
        className="max-w-2xl border border-[#e2e2dc] bg-white"
      >
        <Command shouldFilter={false} className="bg-white">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Escribe una carrera o sinónimo (ej. informática, tens, derecho)..."
            className="text-sm text-[#171716]"
          />
          <CommandList className="max-h-[380px] p-1">
            {loading && items.length === 0 ? (
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
    </div>
  );
}
