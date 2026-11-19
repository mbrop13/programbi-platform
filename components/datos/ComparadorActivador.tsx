"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ComparadorCarreraItem } from "./Comparador";

const Comparador = dynamic(
  () => import("./Comparador").then((module) => module.Comparador),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[460px] w-full rounded-xl" />,
  }
);

export function ComparadorActivador({
  edicion,
  pesosDe,
}: {
  edicion: string;
  pesosDe: string;
}) {
  const [carreras, setCarreras] = React.useState<ComparadorCarreraItem[] | null>(null);
  const [estado, setEstado] = React.useState<"cargando" | "error">("cargando");

  const cargar = React.useCallback(async () => {
    setEstado("cargando");
    try {
      const respuesta = await fetch(
        `/datos/carreras/comparador.json?v=${encodeURIComponent(edicion)}`
      );
      if (!respuesta.ok) throw new Error("No se pudieron cargar los datos");
      const datos = (await respuesta.json()) as ComparadorCarreraItem[];
      setCarreras(datos);
    } catch {
      setEstado("error");
    }
  }, [edicion]);

  React.useEffect(() => {
    void cargar();
  }, [cargar]);

  if (carreras) {
    return <Comparador carreras={carreras} edicion={edicion} pesosDe={pesosDe} />;
  }

  if (estado === "error") {
    return (
      <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
        <CardContent className="p-6 text-center">
          <p role="alert" className="text-sm font-medium text-foreground">
            No se pudieron cargar los datos del comparador.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void cargar()}
            className="mt-3 bg-card"
          >
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <Skeleton className="h-[460px] w-full rounded-xl border border-border bg-muted/40" />;
}
