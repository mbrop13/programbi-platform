"use client";

import * as React from "react";
import { Link2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { pesos } from "@/lib/datos/formato";
import {
  contarFiltrosActivos,
  type FiltrosCarrerasState,
} from "./FiltrosAvanzados";

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
    const jLabel =
      filtros.jornada === "A Distancia" ? "A distancia (online)" : filtros.jornada;
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
      label: `Duración ≤ ${filtros.duracionMax} sem.`,
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
      toast.success("Enlace a esta vista copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  if (activos === 0 && chips.length === 0) {
    return (
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={copiarEnlace}
          className="h-8 gap-1.5 text-xs text-[#5c5c58] hover:text-[#171716]"
        >
          <Link2 className="size-3.5" />
          Copiar enlace a esta vista
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e2e2dc] bg-white px-3.5 py-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={chip.onRemove}
            className="inline-flex items-center gap-1 rounded-full border border-[#d4d4ce] bg-[#f7f7f4] px-2.5 py-1 text-xs font-medium text-[#171716] transition-colors hover:border-[#1890ff] hover:bg-[#e9f4ff]"
            aria-label={`Quitar filtro ${chip.label}`}
          >
            <span>{chip.label}</span>
            <X className="size-3 text-[#5c5c58]" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 gap-1 px-2 text-xs text-[#5c5c58] hover:text-[#171716]"
        >
          <RotateCcw className="size-3" />
          Limpiar filtros
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={copiarEnlace}
          className="h-7 gap-1.5 border-[#d4d4ce] bg-white px-2.5 text-xs text-[#171716]"
        >
          <Link2 className="size-3.5 text-[#1890ff]" />
          Copiar enlace a esta vista
        </Button>
      </div>
    </div>
  );
}
