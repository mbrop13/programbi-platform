"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { ComparadorCarreraItem } from "./Comparador";

const Comparador = dynamic(() => import("./Comparador").then((module) => module.Comparador), {
  ssr: false,
  loading: () => <p role="status">Preparando el comparador…</p>,
});

export function ComparadorActivador({ edicion, pesosDe }: { edicion: string; pesosDe: string }) {
  const [carreras, setCarreras] = React.useState<ComparadorCarreraItem[] | null>(null);
  const [estado, setEstado] = React.useState<"listo" | "cargando" | "error">("listo");
  const cargar = React.useCallback(async () => {
    setEstado("cargando");
    try {
      const respuesta = await fetch(`/datos/carreras/comparador.json?v=${encodeURIComponent(edicion)}`);
      if (!respuesta.ok) throw new Error("No se pudieron cargar los datos");
      const datos = await respuesta.json() as ComparadorCarreraItem[];
      setCarreras(datos);
    } catch { setEstado("error"); }
  }, [edicion]);
  React.useEffect(() => {
    const revisar = () => { if (new URLSearchParams(window.location.search).has("c")) void cargar(); };
    revisar();
    window.addEventListener("popstate", revisar);
    return () => window.removeEventListener("popstate", revisar);
  }, [cargar]);
  if (carreras) return <Comparador carreras={carreras} edicion={edicion} pesosDe={pesosDe} />;
  return <div className="rounded-xl border border-[#d6e6f5] bg-white p-5">
    <h2 className="text-lg font-bold text-[#171716]">Compara otras carreras</h2>
    <p className="mt-2 text-sm text-[#5c5c58]">Elige hasta tres carreras y su tipo de institución para comparar sus resultados.</p>
    <button type="button" disabled={estado === "cargando"} onClick={() => void cargar()} className="mt-4 rounded-lg bg-[#1063b8] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d549c] disabled:opacity-60">{estado === "cargando" ? "Cargando…" : estado === "error" ? "Reintentar" : "Abrir comparador"}</button>
    {estado === "error" && <p role="alert" className="mt-2 text-sm">No se pudieron cargar los datos. Inténtalo de nuevo.</p>}
  </div>;
}
