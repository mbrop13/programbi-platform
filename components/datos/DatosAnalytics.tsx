"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import {
  GA_MEASUREMENT_ID,
  captureUtmFromUrl,
  initGa4,
  markGa4Loaded,
  trackPageView,
} from "@/lib/analytics/marketing";

const AvisosCarreras = dynamic(() => import("sonner").then(({ Toaster }) => Toaster), {
  ssr: false,
});

const ACTIVACION_DIFERIDA_MS = 9000;
const eventos = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

export function DatosAnalytics() {
  const pathname = usePathname();
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    if (!pathname) return;
    const ruta = pathname + window.location.search;
    captureUtmFromUrl();
    initGa4(ruta);
    trackPageView(ruta);
  }, [pathname]);

  useEffect(() => {
    function activar() {
      setActivo(true);
      desmontar();
    }
    function desmontar() {
      window.clearTimeout(espero);
      for (const evento of eventos) window.removeEventListener(evento, activar);
    }
    const espero = window.setTimeout(activar, ACTIVACION_DIFERIDA_MS);
    for (const evento of eventos) window.addEventListener(evento, activar, { passive: true });
    return desmontar;
  }, []);

  return (
    <>
      {activo && GA_MEASUREMENT_ID && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
          onLoad={markGa4Loaded}
        />
      )}
      {pathname?.startsWith("/datos/carreras") && <AvisosCarreras richColors position="top-right" />}
    </>
  );
}
