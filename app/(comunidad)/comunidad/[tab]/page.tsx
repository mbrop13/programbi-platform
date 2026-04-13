import { Suspense } from "react";
import ComunidadPortal from "@/components/comunidad/ComunidadPortal";

export default function ComunidadTabPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-brand-blue">Cargando comunidad...</div>}>
      <ComunidadPortal />
    </Suspense>
  );
}
