import type { ReactNode } from "react";
import estilos from "@/components/datos/Observatorio.module.css";

export default function DatosLayout({ children }: { children: ReactNode }) {
  return <div className={estilos.datos}>{children}</div>;
}
