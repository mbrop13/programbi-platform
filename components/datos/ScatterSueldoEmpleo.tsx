"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { ScatterSueldoEmpleoProps } from "./ScatterSueldoEmpleoChart";

const ScatterChartDynamic = dynamic(() => import("./ScatterSueldoEmpleoChart"), {
  ssr: false,
  loading: () => (
    <Skeleton
      className="h-[420px] w-full rounded-xl border border-[#e2e2dc] bg-[#f3f3f0]"
      aria-label="Cargando gráfico de sueldo versus empleabilidad"
    />
  ),
});

export function ScatterSueldoEmpleo(props: ScatterSueldoEmpleoProps) {
  return <ScatterChartDynamic {...props} />;
}
