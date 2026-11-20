"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

/**
 * Wrapper cliente mínimo para ocultar bloques SSR de referencia cuando la URL
 * trae un query param (p. ej. `?c=` en el comparador de carreras).
 *
 * El componente interno usa `useSearchParams()` y el export público lo envuelve
 * en `<Suspense fallback={children}>`: así el prerender estático (force-static)
 * sigue incluyendo el bloque en el HTML inicial y, tras la hidratación, el
 * bloque desaparece si el parámetro existe. Sin el límite de Suspense, Next
 * falla el build con «Missing Suspense boundary with useSearchParams».
 */
function OcultarSiParamInterno({
  param,
  children,
}: {
  param: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  if (searchParams?.has(param)) return null;
  return <>{children}</>;
}

export function OcultarSiParam({
  param,
  children,
}: {
  param: string;
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={children}>
      <OcultarSiParamInterno param={param}>{children}</OcultarSiParamInterno>
    </React.Suspense>
  );
}
