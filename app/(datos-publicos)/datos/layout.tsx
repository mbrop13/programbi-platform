import type { ReactNode } from "react";
import "@/components/datos/datos.css";
import estilos from "@/components/datos/Observatorio.module.css";

export default function DatosLayout({ children }: { children: ReactNode }) {
  return <div className={estilos.datos}><div className="datos-scope min-h-screen">{children}</div></div>;
}
