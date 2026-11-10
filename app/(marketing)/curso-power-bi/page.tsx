import { permanentRedirect } from "next/navigation";

/**
 * Canibalización Power BI resuelta: la única canónica es /cursos/power-bi.
 *
 * GSC 28 d: /cursos/power-bi 118 impresiones / 1 clic; /curso-power-bi sin filas.
 * La landing tenía un solo bloque único (la plantilla de ventas CSV), que se
 * migró a la ficha en `components/marketing/PlantillaVentasPowerBi.tsx`.
 *
 * La regla 301 vive además en vercel.json y next.config.ts (frente WS2); este
 * `permanentRedirect` (308, equivalente para buscadores) cubre previews, dev y
 * cualquier despliegue que no aplique la configuración.
 */
export const dynamic = "force-dynamic";

export default function Page(): never {
  permanentRedirect("/cursos/power-bi");
}
