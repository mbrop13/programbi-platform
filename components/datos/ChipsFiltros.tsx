"use client";

import * as React from "react";
import { Link2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { pesos } from "@/lib/datos/formato";
import { contarFiltrosActivos, type FiltrosCarrerasState } from "./FiltrosAvanzados";

interface ChipsFiltrosProps {
  filtros: FiltrosCarrerasState;
  onChange: (next: FiltrosCarrerasState) => void;
  onReset: () => void;
}

interface ChipItem {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ChipsFiltros({ filtros, onChange, onReset }: ChipsFiltrosProps) {
  const chips: ChipItem[] = [];

  if (filtros.nivel) {
    chips.push({
      key: "nivel",
      label: `Nivel: ${filtros.nivel}`,
      onRemove: () => onChange({ ...filtros, nivel: "" }),
    });
  }
  if (filtros.area) {
    chips.push({
      key: "area",
      label: `Área: ${filtros.area}`,
      onRemove: () => onChange({ ...filtros, area: "" }),
    });
  }
  if (filtros.jornada) {
    const jLabel = filtros.jornada === "A Distancia" ? "Online" : filtros.jornada;
    chips.push({
      key: "jornada",
      label: `Jornada: ${jLabel}`,
      onRemove: () => onChange({ ...filtros, jornada: "" }),
    });
  }
  for (const reg of filtros.regiones) {
    chips.push({
      key: `reg-${reg}`,
      label: reg,
      onRemove: () =>
        onChange({
          ...filtros,
          regiones: filtros.regiones.filter((r) => r !== reg),
        }),
    });
  }
  if (filtros.arancelMax !== null) {
    chips.push({
      key: "arancel",
      label: `Arancel ≤ ${pesos(filtros.arancelMax)}`,
      onRemove: () => onChange({ ...filtros, arancelMax: null }),
    });
  }
  if (filtros.duracionMax !== null) {
    chips.push({
      key: "duracion",
      label: `Hasta ${(filtros.duracionMax / 2).toFixed(1).replace(".", ",")} años`,
      onRemove: () => onChange({ ...filtros, duracionMax: null }),
    });
  }
  if (filtros.acredMin > 0) {
    chips.push({
      key: "acred",
      label:
        filtros.acredMin === 1
          ? "Solo acreditadas"
          : `Acreditación ≥ ${filtros.acredMin} años`,
      onRemove: () => onChange({ ...filtros, acredMin: 0 }),
    });
  }
  if (filtros.vacantesMin > 0) {
    chips.push({
      key: "vacantes",
      label: `Vacantes ≥ ${filtros.vacantesMin}`,
      onRemove: () => onChange({ ...filtros, vacantesMin: 0 }),
    });
  }
  if (filtros.tituladosMin > 0) {
    chips.push({
      key: "titulados",
      label: `Titulados ≥ ${filtros.tituladosMin}`,
      onRemove: () => onChange({ ...filtros, tituladosMin: 0 }),
    });
  }
  if (filtros.paes !== null) {
    chips.push({
      key: "paes",
      label: `PAES: ${filtros.paes} pts`,
      onRemove: () => onChange({ ...filtros, paes: null }),
    });
  }

  const activos = contarFiltrosActivos(filtros);

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace a esta vista copiado");
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  if (activos === 0 && chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-xs">
      <div className="flex flex-wrap items-center gap-1.5">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={chip.onRemove}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-slate-300 hover:bg-muted"
            aria-label={`Quitar filtro ${chip.label}`}
          >
            <span>{chip.label}</span>
            <X className="size-3 text-muted-foreground" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onReset}
          className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          Limpiar
        </Button>
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={copiarEnlace}
          className="h-7 gap-1.5 bg-card px-2.5 text-xs"
        >
          <Link2 className="size-3 text-muted-foreground" aria-hidden="true" />
          Copiar enlace
        </Button>
      </div>
    </div>
  );
}
