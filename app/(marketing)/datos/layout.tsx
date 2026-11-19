import type { ReactNode } from "react";
import "@/components/datos/datos.css";

export default function DatosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="datos-scope min-h-screen bg-[#f7f7f4] text-[#171716]">
      {children}
    </div>
  );
}
