"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { buscarCarreras, type BuscadorEntry } from "@/lib/datos/carreras-sinonimos";
import { trackEvent } from "@/lib/analytics/marketing";
import { cn } from "@/lib/utils";

const DialogoBuscador = dynamic(
  () => import("./BuscadorCarrerasDialog").then(({ BuscadorCarrerasDialog }) => BuscadorCarrerasDialog),
  {
    ssr: false,
    loading: () => <span role="status" className="sr-only">Abriendo el buscador de carreras…</span>,
  },
);

interface BuscadorCarrerasProps {
  initialItems?: BuscadorEntry[];
  onSelect?: (entry: BuscadorEntry) => void;
  placeholder?: string;
  className?: string;
  /** Escucha «/» y Ctrl K. Solo un buscador por página debería tenerlo. */
  atajos?: boolean;
  /** «campo» (barra ancha) o «boton» (disparador compacto con su propio contenido). */
  variante?: "campo" | "boton";
  /** Contenido del disparador cuando `variante="boton"`. */
  children?: React.ReactNode;
  /** Clases del disparador cuando `variante="boton"`. */
  botonClassName?: string;
  /** Texto con que se abre el diálogo (ej. lo que ya se escribió en otro buscador). */
  consultaInicial?: string;
}

export function BuscadorCarreras({
  initialItems,
  onSelect,
  placeholder = "Busca una carrera por nombre o apodo (ej. medicina, informática, tens, comercial)...",
  className,
  atajos = true,
  variante = "campo",
  children,
  botonClassName,
  consultaInicial,
}: BuscadorCarrerasProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [usado, setUsado] = React.useState(false);
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

  const cambiarApertura = React.useCallback(
    (abierto: boolean) => {
      setOpen(abierto);
      if (abierto) {
        if (consultaInicial) setQuery(consultaInicial);
        setUsado(true);
        void ensureLoaded();
      }
    },
    [ensureLoaded, consultaInicial]
  );

  React.useEffect(() => {
    if (!atajos) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        cambiarApertura(!open);
        return;
      }
      if (e.key === "/" && !isTyping && !open) {
        e.preventDefault();
        cambiarApertura(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [atajos, cambiarApertura, open]);

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

  return (
    <div className={cn(variante === "campo" && "w-full", className)}>
      {variante === "boton" ? (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => cambiarApertura(true)}
          onFocus={() => void ensureLoaded()}
          className={botonClassName}
        >
          {children}
        </button>
      ) : (
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => cambiarApertura(true)}
        onFocus={() => void ensureLoaded()}
        className="group flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-input bg-card px-4 text-left text-sm text-muted-foreground shadow-xs transition-all hover:border-slate-400 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Search
            className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
            aria-hidden="true"
          />
          <span className="truncate">{placeholder}</span>
        </span>
        <span aria-hidden="true" className="hidden shrink-0 items-center gap-1 sm:inline-flex">
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
            /
          </kbd>
          <span className="text-[11px] text-muted-foreground/70">o</span>
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
            Ctrl K
          </kbd>
        </span>
      </button>
      )}

      {usado ? (
        <DialogoBuscador
          open={open}
          onOpenChange={cambiarApertura}
          query={query}
          onQueryChange={setQuery}
          exactos={exactos}
          sugeridos={sugeridos}
          loading={loading}
          hasItems={items.length > 0}
          onSelect={handleSelect}
        />
      ) : null}
    </div>
  );
}
